const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if username or password is missing
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Find user in the registered users array
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // User is valid, create JWT token
  const token = jwt.sign(
    { username: username },      // payload
    "fingerprint_customer",      // secret key (same as session secret)
    { expiresIn: "1h" }          // token expires in 1 hour
  );

  // Save token in session (optional, since JWT is usually sent in headers)
  req.session.authorization = { token, username };

  return res.status(200).json({ message: "User successfully logged in", token });
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Missing Authorization header" });
  }

  const token = authHeader.split(" ")[1]; // Bearer <token>
  if (!token) {
    return res.status(401).json({ message: "Invalid Authorization header" });
  }

  try {
    const payload = jwt.verify(token, "fingerprint_customer");
    const username = payload.username;

    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Add or update the review
    books[isbn].reviews[username] = review;

    return res.status(200).json({
      message: "Review added/updated successfully",
      reviews: books[isbn].reviews
    });
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
});


module.exports.authenticated = regd_users;
module.exports.users = users;
