const express = require('express');
//const axios = require('axios'); // Make sure axios is installed
let books = require("./booksdb.js");
let { users } = require("./auth_users.js");
const public_users = express.Router();

// Simulate async fetch function for books
const fetchBooks = async () => {

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books);
    }, 100); // simulate 100ms delay
  });
};

// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) return res.status(400).json({ message: "Username and password are required" });

  const existingUser = users.find(user => user.username === username);
  if (existingUser) return res.status(409).json({ message: "Username already exists" });

  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Get all books (async using Promise / async-await)
public_users.get('/', async (req, res) => {
  try {
    // Using async-await
    const allBooks = await fetchBooks();

    return res.status(200).json(allBooks);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching books", error: err.message });
  }
});

// Get book by ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  try {
    const allBooks = await fetchBooks();
    if (allBooks[isbn]) return res.status(200).json(allBooks[isbn]);
    return res.status(404).json({ message: "Book not found" });
  } catch (err) {
    return res.status(500).json({ message: "Error fetching book", error: err.message });
  }
});

// Get books by author
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author.toLowerCase();
  try {
    const allBooks = await fetchBooks();
    const result = {};
    Object.keys(allBooks).forEach(isbn => {
      if (allBooks[isbn].author.toLowerCase() === author) result[isbn] = allBooks[isbn];
    });

    if (Object.keys(result).length > 0) return res.status(200).json(result);
    return res.status(404).json({ message: "No books found for this author" });
  } catch (err) {
    return res.status(500).json({ message: "Error fetching books by author", error: err.message });
  }
});

// Get books by title
public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title.toLowerCase();
  try {
    const allBooks = await fetchBooks();
    const result = {};
    Object.keys(allBooks).forEach(isbn => {
      if (allBooks[isbn].title.toLowerCase() === title) result[isbn] = allBooks[isbn];
    });

    if (Object.keys(result).length > 0) return res.status(200).json(result);
    return res.status(404).json({ message: "No books found with this title" });
  } catch (err) {
    return res.status(500).json({ message: "Error fetching books by title", error: err.message });
  }
});

// Get reviews for a book
public_users.get('/review/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  try {
    const allBooks = await fetchBooks();
    if (allBooks[isbn]) return res.status(200).json({ reviews: allBooks[isbn].reviews });
    return res.status(404).json({ message: "Book not found" });
  } catch (err) {
    return res.status(500).json({ message: "Error fetching reviews", error: err.message });
  }
});

module.exports.general = public_users;
