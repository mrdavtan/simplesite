import express from 'express';
import path from 'path';
import fs from 'fs';
import { getDbForPost } from './db/db.js';
import { fileURLToPath } from 'url';
import basicAuth from 'express-basic-auth';
import OpenAI from 'openai';

import axios from 'axios';


const openai = new OpenAI();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Middleware to parse JSON bodies
app.use(express.json());
const PORT = 3001;

// Basic Authentication for the /admin route
const adminAuth = basicAuth({
    users: {
        'admin': 'password'
    }, // Replace 'password' with a strong password
    challenge: true,
    realm: 'Admin',
    unauthorizedResponse: req => {
        console.log('Unauthorized access attempt to /admin');
        return 'Unauthorized';
    }
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to serve static files from 'public'
app.use(express.static('public'));

// Password-protected route for blog administration
app.get('/admin', adminAuth, (req, res) => {
    console.log('Access granted to /admin');
    res.sendFile(path.join(__dirname, 'public', 'editor.html'));
});

// Route to display blog posts on /main
app.get('/main', async (req, res) => {
    console.log('Fetching blog posts for /main');
    try {
        const blogDirectory = path.join(__dirname, 'db', 'blog');


        const postFiles = fs.readdirSync(blogDirectory).filter(file => file.endsWith('.json'));
        console.log(`Found ${postFiles.length} post files in the blog directory.`);
        const posts = postFiles.filter(file => file.endsWith('.json')).map(file => {
            const filePath = path.join(blogDirectory, file);
            const fileContent = fs.readFileSync(filePath, { encoding: 'utf8' });
            return JSON.parse(fileContent);
        });
        console.log(`Successfully loaded ${posts.length} posts.`);
        res.render('main', { posts });
    } catch (error) {
        console.error('Error fetching posts for /main:', error);
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
            n: 1,
            size: "1024x1024"
        });

        // Log the response to inspect the structure
        console.log('Response data:', response.data);

        // Safely access the first image URL, if available
        const imageUrl = response.data && response.data.data && response.data.data.length > 0
                         ? response.data.data[0].url
                         : 'Default image URL or indication that no image was generated';

            if (imageUrl.startsWith('http')) {
                // If valid, proceed with downloading the image
                const imageName = '...'; // Determine your imageName based on your requirements
                await downloadImage(imageUrl, imageName);
                // Proceed with the rest of your logic, such as saving the post with the image
            } else {
                // If not valid, log an error or handle accordingly
                console.error('No valid image URL provided:', imageUrl);
                // Respond with an error message or fallback logic
                res.status(400).send('Invalid image URL provided');
                return; // Stop further execution in this case
            }

        // Here, download the image and save it locally, then get the local path
        const now = new Date();
        const imageName = `image_${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}.png`;
        await downloadImage(imageUrl, imageName);
        const localImagePath = `/img/blog/${imageName}`;

        // Extend your post object to include the localImagePath
        const post = {
            title,
            content,
            imageDescription,
            imageUrl: localImagePath // Use the local path instead of the direct URL
        };

        // Placeholder for database saving logic
        console.log('Attempting to save post:', post);

        console.log('Post saved:', post);
        res.status(201).send({ message: 'Post saved successfully', post });
    } catch (error) {
        console.error('Error during post submission:', error);
        res.status(500).send('Failed to save post');
    }
});

// Function to download and save an image from a URL
async function downloadImage(imageUrl, imageName) {
  const response = await axios({
    method: 'GET',
    url: imageUrl,
    responseType: 'stream',
  });

  const pathToSave = path.join(__dirname, 'public/images/blog', imageName);
  const writer = fs.createWriteStream(pathToSave);

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}



app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

