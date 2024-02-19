import express from 'express';
import fs from 'fs';
import path from 'path';
import { getDbForPost } from './db/db.js'; // Ensure this path matches your project structure

const app = express();

app.set('view engine', 'ejs'); // Set EJS as the templating engine
app.set('views', 'views'); // Specify the directory where EJS templates are located
app.use(express.json()); // for parsing application/json

// Serve static files from 'public'
app.use(express.static('public'));

const blogDirectory = './blog';

// Route to get all posts
app.get('/', async (req, res) => {
    const postFiles = fs.readdirSync(blogDirectory);
    const posts = [];

    for (const file of postFiles) {
        const filePath = path.join(blogDirectory, file);
        const fileContent = fs.readFileSync(filePath, { encoding: 'utf8' });
        const postData = JSON.parse(fileContent);
        posts.push(postData);
    }

    // This is where the missing closing bracket should be
    res.render('index', { posts }); // Make sure to render your EJS template with the posts data
}); // <-- This closing bracket was missing

// Route to add a new post
app.post('/api/posts', async (req, res) => {
    const { title, content, publishedDate, seoTitle, seoDescription, seoKeywords } = req.body;

    // Ensure all required fields are present
    if (!title || !content || !publishedDate) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const post = { id: Date.now().toString(), title, content, publishedDate, seoTitle, seoDescription, seoKeywords }; // Construct the post object with a unique ID
        const db = await getDbForPost(post);
        // Since each post is stored in its own file, directly set db.data to post
        db.data = post;
        await db.write();
        res.status(201).json({ message: 'Post added successfully.' });
    } catch (error) {
        console.error('Error saving post:', error);
        res.status(500).json({ message: 'Failed to add the post', error: error.toString() });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

