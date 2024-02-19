import express from 'express';
import path from 'path';
import fs from 'fs';
import { getDbForPost } from './db/db.js'; // Import getDbForPost from db.js
import { fileURLToPath } from 'url';
import basicAuth from 'express-basic-auth';

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
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route to display blog posts on /main
app.get('/main', async (req, res) => {
    console.log('Fetching blog posts for /main');
    try {
        const blogDirectory = path.join(__dirname, 'blog');
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

// Endpoint to handle blog post submissions
app.post('/submit', async (req, res) => {
    console.log('Submit endpoint hit'); // Diagnostic log
    console.log('Received a submission request');
    const post = req.body; // Extract post data from the request body
    try {
        const db = await getDbForPost(post);
    console.log('Attempting to save post:', post);
        await db.write(post); // Assuming db.write() correctly saves the post object
        console.log('Post saved:', post);
        res.status(201).send('Post saved successfully');
    } catch (error) {
    console.error('Error during post submission:', error);
        console.error('Failed to save post:', error);
        res.status(500).send('Failed to save post');
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

