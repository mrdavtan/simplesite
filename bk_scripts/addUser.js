const db = require('./db');

function addUser(user) {
    db.get('users')
      .push(user)
      .write();
}

const newUser = {
    id: "user123",
    name: "Alex Smith",
    email: "alex@example.com",
    socialMediaLinks: {
      "twitter": "https://twitter.com/alexsmith",
      "linkedin": "https://linkedin.com/in/alexsmith"
    }
};

addUser(newUser);

