const express = require('express');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// Public routes
app.use("/", genl_routes);
app.use("/books", genl_routes);

// Customer routes (login & review)
app.use("/customer", customer_routes);

// Start server locally (Vercel ignores this)
const PORT = 5000;
app.listen(PORT, () => console.log("Server running on port " + PORT));

module.exports = app; // Required for Vercel serverless
