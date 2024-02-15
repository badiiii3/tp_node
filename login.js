// app.js
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'secret', // Change this to a long random string
  resave: true,
  saveUninitialized: true
}));

// Mock user data (you would replace this with your actual user authentication logic)
let users = [
  { id: 1, username: 'user1', password: 'password1' },
  { id: 2, username: 'user2', password: 'password2' }
];

// Login route
app.get('/login', (req, res) => {
  const errorMessage = req.session.errorMessage;
  req.session.errorMessage = null;

  res.send(`
    <h1>Login</h1>
    <form action="/login" method="post">
      <input type="text" name="username" placeholder="Username" required>
      <input type="password" name="password" placeholder="Password" required>
      <button type="submit">Login</button>
      <p style="color: red;">${errorMessage ? errorMessage : ''}</p>
    </form>
    <p>Don't have an account? <a href="/register">Register</a></p>
  `);
});

// Register route
app.get('/register', (req, res) => {
  res.send(`
    <h1>Register</h1>
    <form action="/register" method="post">
      <input type="text" name="username" placeholder="Username" required>
      <input type="password" name="password" placeholder="Password" required>
      <button type="submit">Register</button>
    </form>
    <p>Already have an account? <a href="/login">Login</a></p>
  `);
});

// Register route - POST
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    req.session.errorMessage = 'Username already exists';
    res.redirect('/register');
  } else {
    const userId = users.length + 1; // Generate a new user ID
    users.push({ id: userId, username, password });
    req.session.userId = userId; // Store user ID in session
    res.redirect('/login');
  }
});

// Authentication route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    req.session.userId = user.id; // Store user ID in session
    res.redirect('/dashboard');
  } else {
    req.session.errorMessage = 'Invalid username or password';
    res.redirect('/login');
  }
});

// Signout route
app.get('/signout', (req, res) => {
  // Destroy the session to sign the user out
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.redirect('/login');
    }
  });
});

// Middleware to protect routes
function requireLogin(req, res, next) {
  if (req.session.userId) {
    next();
  } else {
    res.redirect('/login');
  }
}

// Protected route
app.get('/dashboard', requireLogin, (req, res) => {
  const userId = req.session.userId;
  res.send(`Welcome to the dashboard, User ID: ${userId}! <a href="/signout">Sign out</a>`);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
