import express from 'express';
import db from './db/db.js';

const app = express();
app.use(express.json()); // for parsing application/json

// Route to get all posts
app.get('/api/posts', async (req, res) => {
  await db.read(); // Ensure the latest data is read
  res.send(db.data.posts);
});

// Route to add a new post

app.post('/api/posts', async (req, res) => {
    console.log('Received post data:', req.body); // Log incoming post data

    try {
        await db.read();
        db.data.posts.push(req.body);
        await db.write();
        console.log('Post saved successfully'); // Confirm post is saved
        res.status(201).json({ message: 'Post added successfully.' });
    } catch (error) {
        console.error('Error saving post:', error); // Log errors if any
        res.status(500).json({ message: 'Failed to add the post', error: error.toString() });
    }
});


app.use(express.static('public'));

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

