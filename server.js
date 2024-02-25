import express from 'express';
import path from 'path';
import fs from 'fs';
import { getDbForPost } from './db/db.js';
import { fileURLToPath } from 'url';
import basicAuth from 'express-basic-auth';
import OpenAI from 'openai';
import * as http from 'http';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';


const app = express();
const PORT = 3001;

// Initialize OpenAI - Ensure you replace with your actual initialization
const openai = new OpenAI();

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


import helmet from 'helmet';

app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"], // Allows resources from the same origin
        imgSrc: ["'self'", "data:"], // Allows images from the same origin and data URLs
        scriptSrc: ["'self'", "'unsafe-inline'"], // Adjust according to your needs
        styleSrc: ["'self'", "https:", "'unsafe-inline'"], // Adjust according to your needs

    },
}));



app.use(express.json()); // Middleware to parse JSON bodies
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public')); // Middleware to serve static files from 'public'

// Set the MIME type for JavaScript files
app.use((req, res, next) => {
    if (req.url.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript');
    }
    next();
});



// Basic Authentication for the /admin route
const adminAuth = basicAuth({
    users: { 'admin': 'password' }, // Replace 'password' with a strong password
    challenge: true,
    realm: 'Admin',
    unauthorizedResponse: req => 'Unauthorized',
});

app.get('/admin', adminAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'editor.html'));
});

app.get('/main', async (req, res) => {
    try {
        const blogDirectory = path.join(__dirname, 'db', 'blog');
        const postFiles = fs.readdirSync(blogDirectory).filter(file => file.endsWith('.json'));
        const posts = postFiles.map(file => {
            const filePath = path.join(blogDirectory, file);
            return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        });
        res.render('main', { posts });
    } catch (error) {
        console.error(`Error fetching posts for /main: ${error}`);
        res.status(500).send('Error loading posts');
    }
});


app.post('/submit', async (req, res) => {
    console.log('Submit endpoint hit');
    const { title, content, imageDescription } = req.body;

    try {
        // Generate an image based on the provided description
        const response = await openai.images.generate({
            prompt: imageDescription,
            model: "dall-e-3",
            n: 1,
            size: "1024x1024"
        });

        console.log('Response data:', response);

        const imageUrl = response.data[0].url ? response.data[0].url : 'Default image URL or indication that no image was generated';

        if (imageUrl !== 'Default image URL or indication that no image was generated') {
            const now = new Date();
            // Sanitize the title to be filesystem-friendly
            const sanitizedTitle = title.toLowerCase().replace(/\s+/g, '_').replace(/[^\w-]+/g, '');
            const datePart = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}`;
            const timePart = `${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;
            const imageName = `${sanitizedTitle}_${datePart}_${timePart}.png`;
            console.log(imageUrl);
            console.log(imageName);
            await downloadImage(imageUrl, imageName);
            const localImagePath = `/img/blog/${imageName}`;

            const publishedDate = new Date().toISOString();

            // Generate a unique ID for the post
            const postId = uuidv4();

            const post = {
                id: postId, // Assign the generated ID to the post
                title,
                content,
                imageDescription,
                imageUrl: localImagePath,
                publishedDate
            };

            const db = await getDbForPost(post);
            db.data = post;
            await db.write();

            console.log('Post saved:', post);
            res.status(201).send({ message: 'Post saved successfully', post });
        } else {
            console.error('No valid image URL provided:', imageUrl);
            res.status(400).send('Invalid image URL provided');
            return;
        }
    } catch (error) {
        console.error('Error during post submission:', error);
        res.status(500).send('Failed to save post');
    }
});

// Function to download and save an image from a URL
async function downloadImage(imageUrl, imageName) {
  try {
    const response = await axios({
      method: 'GET',
      url: imageUrl,
      responseType: 'stream',
    });

    const pathToSave = path.join(__dirname, 'public/img/blog', imageName);
    const writer = fs.createWriteStream(pathToSave);

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (error) {
    console.error('Failed to download image:', error);
    throw new Error('Failed to download image');
  }
}

//app.get('/posts/:postId', async (req, res) => {
//    const postId = req.params.postId;
//    try {
//        const post = await findPostById(postId);
//        if (post) {
//            res.render('blogpage', { post: post });
//        } else {
//            res.status(404).send('Post not found');
//        }
//    } catch (error) {
//        console.error(`Error fetching post details for ID ${postId}:`, error);
//        res.status(500).send('Error loading post');
//    }
//});
//

async function getOtherPosts(excludePostId) {
    const allPosts = []; // Fetch all posts. This is just a placeholder. Implement according to your data source.
    return allPosts.filter(post => post.id !== excludePostId);
}


app.get('/posts/:postId', async (req, res) => {
    const postId = req.params.postId;
    try {
        const post = await findPostById(postId); // Fetch the main post
        const otherPosts = await getOtherPosts(postId); // Fetch other posts excluding the main post
        if (post) {
            // Pass both the main post and other posts to the view
            res.render('blogpage', { post: post, posts: otherPosts });
        } else {
            res.status(404).send('Post not found');
        }
    } catch (error) {
        console.error(`Error fetching post details for ID ${postId}:`, error);
        res.status(500).send('Error loading post');
    }
});



async function findPostById(postId) {
    const blogDirectory = path.join(__dirname, 'db', 'blog');
    try {
        const postFiles = fs.readdirSync(blogDirectory).filter(file => file.endsWith('.json'));
        for (let file of postFiles) {
            const filePath = path.join(blogDirectory, file);
            const postContent = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            // Assuming each post JSON has an 'id' property
            if (postContent.id === postId) {
                return postContent;
            }
        }
    } catch (error) {
        console.error(`Failed to find post by ID (${postId}):`, error);
        return null; // Or throw an error, depending on how you want to handle this case
    }
    return null; // Return null if no post matches the given ID
}


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

