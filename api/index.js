const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const { body, validationResult } = require('express-validator');

const app = express();
const port = process.env.PORT || 3636;

// Enable CORS for all routes
app.use(cors({
  origin: '*'
}));

app.use(express.json()); // Middleware for JSON parsing

let productDb, userDb, orderDb;

// handles disconnection
function handleDisconnect() {
  productDb = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_PRODUCTS_DB
  });

  // creates connection to User DB
  userDb = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_USERS_DB
  });

  // creates connection to Order DB
  orderDb = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_ORDER_DB
  });

  // CONNECTIONS
  // creates connection to Product DB
  productDb.connect(err => {
    if (err) {
      console.error('Error connecting to products DB:', err);
      setTimeout(handleDisconnect, 2000);
    } else {
      console.log('Connected to products DB');
    }
  });


  // creates connection to User DB
  userDb.connect(err => {
    if (err) {
      console.error('Error connecting to users DB:', err);
      setTimeout(handleDisconnect, 2000);
    } else {
      console.log('Connected to users DB');
    }
  });

  // creates connection to order DB
  orderDb.connect(err =>{
    if (err) {
      console.error('Error connecting to order DB:', err);
      setTimeout(handleDisconnect, 2000);
    } else {
      console.log('Connected to users DB');
    }
  });


  // ERRORS
  // handles errors for productDB
  productDb.on('error', err => {
    console.error('MySQL product DB error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') handleDisconnect();
  });

  // handles errors for userDB
  userDb.on('error', err => {
    console.error('MySQL user DB error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') handleDisconnect();
  });

  // handles errors for orderDB
  orderDb.on('error', err => {
    console.error('MySQL order DB error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') handleDisconnect();
  });
  
}

handleDisconnect();

// 🔹 User Registration API (Only for Customers)
app.post('/register',
  [
    body('username').notEmpty().trim().escape().withMessage('Username is required'),
    body('email')
      .isEmail().withMessage('Invalid email format')
      .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      .withMessage('Email must contain @ and a valid domain (e.g., .com, .org, .edu)'),
    body('password')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
      .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
      .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
      .matches(/\d/).withMessage('Password must contain at least one number')
      .matches(/[\W]/).withMessage('Password must contain at least one special character (e.g., !, @, #)'),
    body('first_name').notEmpty().trim().escape().withMessage('First name is required'),
    body('last_name').notEmpty().trim().escape().withMessage('Last name is required'),
    body('user_role').equals('customer').withMessage('Only customers can register via this form')
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, first_name, last_name, user_role } = req.body;

    // Check for duplicate username or email
    const checkQuery = 'SELECT * FROM users WHERE email = ? OR username = ?';
    userDb.query(checkQuery, [email, username], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send('Internal server error');
      }

      if (results.length > 0) {
        return res.status(400).json({ error: 'Username or email already exists' });
      }


      // Insert user into the database
      const insertQuery = 'INSERT INTO users (username, email, password, first_name, last_name, user_role) VALUES (?, ?, ?, ?, ?, ?)';
      userDb.query(insertQuery, [username, email, password, first_name, last_name, user_role], (err, result) => {
        if (err) {
          console.error('Error adding user:', err);
          return res.status(500).send('Error adding user');
        }

        res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
      });
    });
  }
);

// 🔹 Fetch Products API
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

// 🔹 Fetch Users API
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

// 🔹 Fetch Orders API
app.get('/orders', (req, res) => {
  orderDb.query('SELECT * FROM orders', (err, results) => {
    if (err) {
      console.error('Error fetching orders:', err);
      res.status(500).send('Error fetching orders');
      return;
    }
    res.json(results);
  });
});


// get Ordered Items from order
app.get('/orders/:user_id', (req, res) => {
  const userId = req.params.user_id;
  orderDb.query('SELECT * FROM orders natural join orderedItems WHERE user_id = ?', [userId], (err, results) => {
    if (err) {
      console.error('Error fetching ordered items:', err);
      res.status(500).send('Error fetching ordered items');
      return;
    }
    res.json(results);
  });
});


app.listen(port, () => {
  console.log(`API service is running on port ${port}`);
});
