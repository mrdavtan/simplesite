const db = require('./db');

function addPost(post) {
    db.get('posts')
      .push(post)
      .write();
}

const newPost = {
    id: "101",
    title: "The Future of Graph Databases",
    content: "Graph databases are becoming increasingly popular...",
    publishedDate: "2024-03-01",
    seoTitle: "Exploring the Future of Graph Databases",
    seoDescription: "An in-depth look at the emerging trends in graph database technologies.",
    seoKeywords: ["graph databases", "future trends", "database technology"],
    // Example vector data for illustration
    textVector: [0.12, 0.23, 0.34, 0.45, 0.56]
};

addPost(newPost);

