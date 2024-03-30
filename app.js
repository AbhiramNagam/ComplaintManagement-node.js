// app.js

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./db'); // Import the database connection module
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to file a complaint
app.post('/file-complaint', (req, res) => {
  const { complaintType, description, username } = req.body;
  
  db.query('INSERT INTO userComplaints (username, complaintType, description) VALUES (?, ?, ?)', [username, complaintType, description])
    .then(result => {
      res.status(200).json({ message: 'Complaint filed successfully' });
    })
    .catch(error => {
      console.error('Error filing complaint:', error);
      res.status(500).json({ message: 'Failed to file complaint' });
    });
});

// Endpoint to get complaints
app.get('/complaints', (req, res) => {
  const { username } = req.query;
  db.query('SELECT * FROM userComplaints WHERE username = ?', [username])
    .then(results => {
      res.status(200).json({ complaints: results });
    })
    .catch(error => {
      console.error('Error fetching complaints:', error);
      res.status(500).json({ message: 'Failed to fetch complaints' });
    });
});

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password])
    .then(results => {
      if (results.length > 0) {
        const user = results[0];
        res.status(200).json({ message: 'Login successful', user: { username: user.username, role: user.role } });
      } else {
        res.status(401).json({ message: 'Invalid username or password' });
      }
    })
    .catch(error => {
      console.error('Error logging in:', error);
      res.status(500).json({ message: 'Failed to log in' });
    });
});

// Endpoint to register a new user
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Check if the user is an admin (prevent admin registration)
  if (req.user.role === 'admin') {
    return res.status(403).json({ message: "Admins cannot register" });
  }

  // Validate user input (e.g., check for unique username)
  // Perform necessary validation and hashing of the password
  
  // Insert new user record into the database
  db.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, password, 'customer'])
    .then(result => {
      res.status(201).json({ message: 'User registered successfully' });
    })
    .catch(error => {
      console.error('Error registering user:', error);
      res.status(500).json({ message: 'Failed to register user' });
    });
});

// Endpoint to register a new user
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  // For now, let's assume only customers can register.
  const role = 'customer';

  // Validate user input (e.g., check for unique username)
  // Perform necessary validation and hashing of the password
  // For simplicity, let's assume validation and hashing are done elsewhere

  // Insert new user record into the database
  db.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, password, role])
    .then(result => {
      res.status(201).json({ message: 'User registered successfully' });
    })
    .catch(error => {
      console.error('Error registering user:', error);
      res.status(500).json({ message: 'Failed to register user' });
    });
});



// Start the server to listen on the specified local IP address and port
app.listen(port, '127.0.0.1', () => {
  console.log(`Server is running on http://127.0.0.1:${port}`);
});
