import express from 'express';
import path from 'path';
import fs from 'fs';
import { getDbForPost } from './db/db.js';
import { fileURLToPath } from 'url';
import basicAuth from 'express-basic-auth';
import OpenAI from 'openai';

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
    console.log('Received a submission request');
    const { title, content, imageDescription } = req.body;

    try {
        // Generate an image based on the provided description
        const response = await openai.createImage({
            model: "text-davinci-003",
            prompt: imageDescription,
            n: 1,
            size: "1024x1024"
        });

        const imageUrl = response.data[0].url;

        // Extend your post object to include the imageUrl
        const post = {
            title,
            content,
            imageDescription,
            imageUrl, // Add the generated image URL to your post object
        };

        // Continue with saving the post to your database
        const db = await getDbForPost(post);
        console.log('Attempting to save post:', post);
        db.data = {...post};
        await db.write();

        console.log('Post saved:', post);
        res.status(201).send({ message: 'Post saved successfully', post });
    } catch (error) {
        console.error('Error during post submission:', error);
        res.status(500).send('Failed to save post');
    }
});


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

