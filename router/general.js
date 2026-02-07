const express = require('express');
let books = require("./booksdb.js");
let { users } = require("./auth_users.js");
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) return res.status(400).json({ message: "Username and password are required" });

  const existingUser = users.find(user => user.username === username);
  if (existingUser) return res.status(409).json({ message: "Username already exists" });

  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Get all books
public_users.get('/', (req, res) => res.status(200).json(books));

// Get book by ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  if (books[isbn]) return res.status(200).json(books[isbn]);
  return res.status(404).json({ message: "Book not found" });
});

// Get books by author
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author.toLowerCase();
  const result = {};

  Object.keys(books).forEach(isbn => {
    if (books[isbn].author.toLowerCase() === author) result[isbn] = books[isbn];
  });

  if (Object.keys(result).length > 0) return res.status(200).json(result);
  return res.status(404).json({ message: "No books found for this author" });
});

// Get books by title
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title.toLowerCase();
  const result = {};

  Object.keys(books).forEach(isbn => {
    if (books[isbn].title.toLowerCase() === title) result[isbn] = books[isbn];
  });

  if (Object.keys(result).length > 0) return res.status(200).json(result);
  return res.status(404).json({ message: "No books found with this title" });
});

// Get reviews for a book
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  if (books[isbn]) return res.status(200).json({ reviews: books[isbn].reviews });
  return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;
