// Import Express and your db module
import express from 'express';
import { db } from './db/db.js'; // Adjust the path as needed

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

// Example route to add a new post
app.post('/api/posts', async (req, res) => {
    const { title, content } = req.body;

    // Ensure the required fields are present
    if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required.' });
    }

    // Add the new post to the 'posts' array
    db.data.posts.push({ id: Date.now(), title, content });

    // Write the updated data back to the database
    await db.write();

    // Respond with the added post
    res.status(201).json({ message: 'Post added successfully.' });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

