const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3636;

// Enable CORS for all routes
app.use(cors({
  origin: ['http://localhost:3000', 'https://sk8ts-shop.com']
}));

app.use(express.json()); // Middleware for parsing JSON requests

let productDb, userDb;

function handleDisconnect() {
  productDb = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_PRODUCTS_DB
  });

  userDb = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_USERS_DB
  });

  productDb.connect(err => {
    if (err) {
      console.error('Error connecting to products DB:', err);
      setTimeout(handleDisconnect, 2000);
    } else {
      console.log('Connected to products DB');
    }
  });

  userDb.connect(err => {
    if (err) {
      console.error('Error connecting to users DB:', err);
      setTimeout(handleDisconnect, 2000);
    } else {
      console.log('Connected to users DB');
    }
  });

  productDb.on('error', err => {
    console.error('MySQL product DB error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') handleDisconnect();
  });

  userDb.on('error', err => {
    console.error('MySQL user DB error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') handleDisconnect();
  });
}

handleDisconnect();

// API endpoint to fetch products
app.get('/products', (req, res) => {
  productDb.query('SELECT * FROM products', (err, results) => {
    if (err) {
      console.error('Error fetching products:', err);
      res.status(500).send('Error fetching products');
      return;
    }
    res.json(results);
  });
});

// API endpoint to fetch users
app.get('/users', (req, res) => {
  userDb.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      res.status(500).send('Error fetching users');
      return;
    }
    res.json(results);
  });
});

// API endpoint to add a user
// Wilson, this will probably need to change to match the layout of the users table
app.post('/users', (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).send('Missing required fields');
  }

  const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
  userDb.query(query, [username, email, password], (err, result) => {
    if (err) {
      console.error('Error adding user:', err);
      res.status(500).send('Error adding user');
      return;
    }
    res.status(201).json({ message: 'User added', userId: result.insertId });
  });
});

app.listen(port, () => {
  console.log(`API service is running on port ${port}`);
});
