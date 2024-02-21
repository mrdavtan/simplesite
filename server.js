import express from 'express';
import path from 'path';
import fs from 'fs';
import { getDbForPost } from './db/db.js';
import { fileURLToPath } from 'url';
import basicAuth from 'express-basic-auth';
import OpenAI from 'openai';
import * as http from 'http';
import axios from 'axios';

const app = express();
const PORT = 3001;

// Initialize OpenAI - Ensure you replace with your actual initialization
const openai = new OpenAI();

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json()); // Middleware to parse JSON bodies
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public')); // Middleware to serve static files from 'public'

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

            const post = {
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

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

