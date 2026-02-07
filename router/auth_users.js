const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Login route
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const token = jwt.sign({ username }, "fingerprint_customer", { expiresIn: "1h" });

  return res.status(200).json({ message: "User successfully logged in", token });
});

// Add or modify a book review (JWT only)
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;

  if (!review) return res.status(400).json({ message: "Review text is required as query parameter" });

  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Missing Authorization header" });

  const token = authHeader.split(" ")[1]; // Bearer <token>
  if (!token) return res.status(401).json({ message: "Invalid Authorization header" });

  try {
    const payload = jwt.verify(token, "fingerprint_customer");
    const username = payload.username;

    if (!books[isbn]) return res.status(404).json({ message: "Book not found" });

    books[isbn].reviews[username] = review;

    return res.status(200).json({
      message: "Review added/updated successfully",
      reviews: books[isbn].reviews
    });
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
});

// Delete a book review (only user's own review)
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;

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

    if (!books[isbn].reviews[username]) {
      return res.status(404).json({ message: "You have not reviewed this book" });
    }

    // Delete the review by this user
    delete books[isbn].reviews[username];

    return res.status(200).json({
      message: "Your review has been deleted successfully",
      reviews: books[isbn].reviews
    });

  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
});

module.exports.authenticated = regd_users;
module.exports.users = users;
