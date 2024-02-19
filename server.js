
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Your existing server.js code continues here...


import express from 'express';
import path from 'path';
import fs from 'fs';
import basicAuth from 'express-basic-auth';

const app = express();
const PORT = 3000;

// Basic Authentication for the /admin route
const adminAuth = basicAuth({
    users: { 'admin': 'password' }, // Replace 'password' with a strong password
    challenge: true, // Causes browsers to show a login dialog
    realm: 'Admin',
    unauthorizedResponse: (req) => {
        console.log('Unauthorized access attempt to /admin');
        return 'Unauthorized';
    }
});

// Middleware to serve static files from 'public'
app.use(express.static('public'));

// Password-protected route for blog administration
app.get('/admin', adminAuth, (req, res) => {
    console.log('Access granted to /admin');
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route to display blog posts on /home
app.get('/home', async (req, res) => {
    console.log('Fetching blog posts for /home');
    try {
        const blogDirectory = path.join(__dirname, 'blog');
        const postFiles = fs.readdirSync(blogDirectory);
        console.log(`Found ${postFiles.length} post files in the blog directory.`);

        const posts = postFiles.map(file => {
            const filePath = path.join(blogDirectory, file);
            const fileContent = fs.readFileSync(filePath, { encoding: 'utf8' });
            return JSON.parse(fileContent);
        });

        console.log(`Successfully loaded ${posts.length} posts.`);
        // Assuming you have an EJS template named 'home.ejs' for displaying posts
        res.render('home', { posts });
    } catch (error) {
        console.error('Error fetching posts for /home:', error);
        res.status(500).send('Error loading posts');
    }
});

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

