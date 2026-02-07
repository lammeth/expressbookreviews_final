const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let { users } = require("./auth_users.js");
const public_users = express.Router();

const axiosGet = (url) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {

        const parts = url.split('/');
        if (parts[0] === 'isbn') {
          const isbn = parts[1];
          if (books[isbn]) resolve({ data: books[isbn] });
          else reject({ response: { status: 404, data: { message: "Book not found" } } });
        } else if (parts[0] === 'author') {
          const author = parts[1].toLowerCase();
          const result = {};
          Object.keys(books).forEach(key => {
            if (books[key].author.toLowerCase() === author) {
              result[key] = books[key];
            }
          });
          if (Object.keys(result).length > 0) resolve({ data: result });
          else reject({ response: { status: 404, data: { message: "No books found for this author" } } });
        } else if (parts[0] === 'title') {
          const title = parts[1].toLowerCase();
          const result = {};
          Object.keys(books).forEach(key => {
            if (books[key].title.toLowerCase() === title) {
              result[key] = books[key];
            }
          });
          if (Object.keys(result).length > 0) resolve({ data: result });
          else reject({ response: { status: 404, data: { message: "No books found with this title" } } });
        } else if (parts[0] === 'review') {
          const isbn = parts[1];
          if (books[isbn]) resolve({ data: books[isbn].reviews });
          else reject({ response: { status: 404, data: { message: "Book not found" } } });
        } else if (parts[0] === '') {

          resolve({ data: books });
        } else {
          reject({ response: { status: 404, data: { message: "Invalid endpoint" } } });
        }
      } catch (err) {
        reject({ response: { status: 500, data: { message: "Internal error" } } });
      }
    }, 100); 
  });
};

// Get all books (async)
public_users.get('/', async (req, res) => {
  try {
    const response = await axiosGet('/');
    return res.status(200).json(response.data);
  } catch (err) {
    return res.status(err.response?.status || 500).json(err.response?.data || { message: "Error fetching books" });
  }
});

// Get book by ISBN (async)
public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  try {
    const response = await axiosGet(`isbn/${isbn}`);
    return res.status(200).json(response.data);
  } catch (err) {
    return res.status(err.response?.status || 500).json(err.response?.data || { message: "Error fetching book" });
  }
});

// Get books by author  (async)
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author;
  try {
    const response = await axiosGet(`author/${author}`);
    return res.status(200).json(response.data);
  } catch (err) {
    return res.status(err.response?.status || 500).json(err.response?.data || { message: "Error fetching books by author" });
  }
});

// Get books by title (async)
public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title;
  try {
    const response = await axiosGet(`title/${title}`);
    return res.status(200).json(response.data);
  } catch (err) {
    return res.status(err.response?.status || 500).json(err.response?.data || { message: "Error fetching books by title" });
  }
});

// Get book reviews (async)
public_users.get('/review/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  try {
    const response = await axiosGet(`review/${isbn}`);
    return res.status(200).json(response.data);
  } catch (err) {
    return res.status(err.response?.status || 500).json(err.response?.data || { message: "Error fetching reviews" });
  }
});

module.exports.general = public_users;
