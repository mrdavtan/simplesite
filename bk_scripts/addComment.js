const db = require('./db');

function addComment(comment) {
    db.get('comments')
      .push(comment)
      .write();
}

const newComment = {
    id: "comment201",
    content: "Really insightful article, especially about scalability!",
    publishedDate: "2024-03-02",
    postId: "101", // Assuming this links to the post with ID 101
    postedBy: "Jane Doe"
};

addComment(newComment);

