import express from 'express';
import db from './db/db.js'; // Adjust the path as needed

const app = express();
app.use(express.json());

app.post('/api/posts', async (req, res) => {
    try {
        await db.read(); // Ensure db is up-to-date
        const { title, content, author } = req.body;
        const newPost = { id: Date.now().toString(), title, content, author, publishedDate: new Date() };
        db.data.posts.push(newPost);
        await db.write(); // Persist the new post
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ message: 'Failed to add the post', error: error.toString() });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

