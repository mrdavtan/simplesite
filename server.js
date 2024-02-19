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
  const post = req.body;
  db.data.posts.push(post); // Add the new post to the array
  await db.write(); // Persist changes to db.json
  res.status(201).send(post);
});


app.use(express.static('public'));

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

