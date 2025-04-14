const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const axios = require("axios");
const { body, validationResult } = require('express-validator');

const app = express();
const port = process.env.PORT || 3636;

// Enable CORS for specific origins
const corsOptions = {
  origin: [
    'https://sk8ts-shop.com',
    /http:\/\/localhost:\d+/
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json()); // Middleware for JSON parsing

// Database pool configuration
const dbConfig = {
  connectionLimit: 10, // Allow up to 10 concurrent connections
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD
};

// Create connection pools for each database
const productDb = mysql.createPool({ ...dbConfig, database: process.env.MYSQL_PRODUCTS_DB });
const userDb = mysql.createPool({ ...dbConfig, database: process.env.MYSQL_USERS_DB });
const orderDb = mysql.createPool({ ...dbConfig, database: process.env.MYSQL_ORDER_DB });

// Handles MySQL disconnections
function handleDbError(pool, name) {
  pool.on('error', err => {
    console.error(`MySQL ${name} DB error:`, err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.log(`Reconnecting to ${name} DB...`);
    }
  });
}

handleDbError(productDb, 'product');
handleDbError(userDb, 'user');
handleDbError(orderDb, 'order');

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

    userDb.query('SELECT * FROM users WHERE email = ? OR username = ?', [email, username], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send('Internal server error');
      }

      if (results.length > 0) {
        return res.status(400).json({ error: 'Username or email already exists' });
      }

      userDb.query(
        'INSERT INTO users (username, email, password, first_name, last_name, user_role) VALUES (?, ?, ?, ?, ?, ?)',
        [username, email, password, first_name, last_name, user_role],
        (err, result) => {
          if (err) {
            console.error('Error adding user:', err);
            return res.status(500).send('Error adding user');
          }

          res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
        }
      );
    });
  }
);

// 🔹 Fetch Products API
app.get('/products', (req, res) => {
  productDb.query('SELECT * FROM products', (err, results) => {
    if (err) {
      console.error('Error fetching products:', err);
      return res.status(500).send('Error fetching products');
    }
    res.json(results);
  });
});

// 🔹 Fetch Users API
app.get('/users', (req, res) => {
  userDb.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).send('Error fetching users');
    }
    res.json(results);
  });
});

// 🔹 Fetch Orders API
app.get('/orders', (req, res) => {
  orderDb.query('SELECT * FROM orders', (err, results) => {
    if (err) {
      console.error('Error fetching orders:', err);
      return res.status(500).send('Error fetching orders');
    }
    res.json(results);
  });
});

// 🔹 Place Order API
app.post('/placeOrder', [
  body('user_id').isInt({ min: 1 }).withMessage('Valid user_id is required'),
  body('total_amount').isFloat({ min: 0 }).withMessage('Total amount must be a non-negative number'),
  body('shipping_address').notEmpty().trim().withMessage('Shipping address is required'),
  body('items').isArray({ min: 1 }).withMessage('Items must be a non-empty array'),
  body('items.*.product_id').isInt({ min: 1 }).withMessage('Valid product_id is required for each item'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
  body('items.*.price').isFloat({ min: 0 }).withMessage('Price must be a non-negative number')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { user_id, total_amount, shipping_address, items } = req.body;

  orderDb.getConnection((err, connection) => {
    if (err) {
      console.error('Database connection error:', err);
      return res.status(500).send('Database connection failed');
    }

    connection.beginTransaction(err => {
      if (err) {
        connection.release();
        return res.status(500).send('Error processing order');
      }

      const insertOrderQuery = `
        INSERT INTO orders (user_id, order_date, total_amount, shipping_address, order_status)
        VALUES (?, NOW(), ?, ?, 'unclaimed')
      `;
      
      connection.query(insertOrderQuery, [user_id, total_amount, shipping_address], (err, orderResult) => {
        if (err) {
          connection.rollback(() => connection.release());
          return res.status(500).send('Error adding order');
        }

        const order_id = orderResult.insertId;
        const insertItems = items.map(item => [order_id, item.product_id, item.quantity, item.price]);

        connection.query('INSERT INTO orderedItems (order_id, product_id, quantity, price) VALUES ?', [insertItems], (err) => {
          if (err) {
            connection.rollback(() => connection.release());
            return res.status(500).send('Error adding ordered items');
          }

          connection.commit(err => {
            connection.release();
            if (err) return res.status(500).send('Error finalizing order');

            res.status(201).json({ message: 'Order added successfully', orderId: order_id });
          });
        });
      });
    });
  });
});

// Update orders API
app.put(
  '/update-orders/:order_id/:status/:employee_id',
  (req, res) => {
    // 1. Extract Data from URL Parameters
    const orderId = req.params.order_id;
    const orderStatus = req.params.status;
    const employeeId = req.params.employee_id;

    // 2. Validation (Optional, but recommended)
    // You might still want to validate orderStatus and employeeId
    // to ensure they are in the expected format.
    if (!['unclaimed', 'claimed', 'sent'].includes(orderStatus)) {
      return res.status(400).json({ error: 'Invalid order status' });
    }

    if (!/^\d+$/.test(employeeId)) { // basic number check.
      return res.status(400).json({ error: 'Invalid employee ID' });
    }

    // 3. Construct SQL Update Query
    let query = 'UPDATE orders SET order_status = ?, employee_id = ? WHERE order_id = ?';
    let params = [orderStatus, employeeId, orderId];

    // 4. Execute Database Query
    orderDb.query(query, params, (err, result) => {
      // 5. Database Error Handling
      if (err) {
        console.error('Error updating order status:', err);
        return res.status(500).send('Error updating order status');
      }

      // 6. Order Not Found Handling
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }

      // 7. Success Response
      res.json({ message: 'Order status updated successfully' });
    });
  }
);

// Get Unclaimed Orders API
app.get('/unclaimed_orders', (req, res) => {
  orderDb.query(
    "SELECT * FROM orders WHERE order_status = 'Unclaimed'",
    (err, results) => {
      if (err) {
        console.error('Error fetching unclaimed orders:', err);
        return res.status(500).send('Error fetching unclaimed orders');
      }
      res.json(results);
    }
  );
});

// 🔹 Fetch Ordered Items API
app.get('/orders/user/:user_id', (req, res) => {
  const userId = req.params.user_id;
  orderDb.query('SELECT * FROM orders NATURAL JOIN orderedItems WHERE user_id = ? ORDER BY order_id DESC', [userId], (err, results) => {
    if (err) {
      console.error('Error fetching ordered items:', err);
      return res.status(500).send('Error fetching ordered items');
    }
    res.json(results);
  });
});

// Fetch Orders by Employee ID API
app.get('/orders/employee/:employee_id', (req, res) => {
  const employeeId = req.params.employee_id;

  // Check if employee_id is valid
  if (!/^\d+$/.test(employeeId)) { // basic number check.
    return res.status(400).json({ error: 'Invalid employee ID' });
  }

  // Query to fetch orders assigned to the employee
  orderDb.query("SELECT * FROM order.orders o JOIN order.orderedItems oi on o.order_id = oi.order_id WHERE employee_id = ? AND order_status = 'claimed'", 
    [employeeId], (err, results) => {
    if (err) {
      console.error('Error fetching orders for employee:', err);
      return res.status(500).send('Error fetching orders for employee');
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No orders found for this employee' });
    }

    res.json(results);
  });
});

// Fetch the three most recently registered users API
app.get('/users/recent', (req, res) => {
  userDb.query('SELECT * FROM users ORDER BY created_at DESC LIMIT 3', (err, results) => {
    if (err) {
      console.error('Error fetching recent users:', err);
      return res.status(500).send('Error fetching recent users');
    }
    res.json(results);
  });
});

// Update last_login to current time after successful login
app.post('/users/:id/update-last-login', (req, res) => {
  const userId = req.params.id;

  userDb.query(
    'UPDATE users SET last_login = NOW() WHERE user_id = ?',
    [userId],
    (err, result) => {
      if (err) {
        console.error('Error updating last login:', err);
        return res.status(500).send('Error updating last login');
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({ message: 'Last login updated successfully' });
    }
  );
});


// Fetch the two most recently active employees API
app.get('/employees/active', (req, res) => {
  userDb.query(
    "SELECT * FROM users WHERE user_role = 'employee' ORDER BY last_login DESC LIMIT 2",
    (err, results) => {
      if (err) {
        console.error('Error fetching active employees:', err);
        return res.status(500).send('Error fetching active employees');
      }
      res.json(results);
    }
  );
});

// Fetch the five most recently placed orders
app.get('/orders/recent', (req, res) => {
  orderDb.query('SELECT * FROM orders ORDER BY order_date DESC LIMIT 5', (err, results) => {
    if (err) {
      console.error('Error fetching recent orders:', err);
      return res.status(500).send('Error fetching recent orders');
    }
    res.json(results);
  });
});

// Add a new user
app.post('/users', (req, res) => {
  const { username, email, password, first_name, last_name, user_role } = req.body;
  userDb.query(
    'INSERT INTO users (username, email, password, first_name, last_name, user_role) VALUES (?, ?, ?, ?, ?, ?)',
    [username, email, password, first_name, last_name, user_role],
    (err, result) => {
      if (err) {
        console.error('Error adding user:', err);
        return res.status(500).send('Error adding user');
      }
      res.status(201).json({ message: 'User added successfully', userId: result.insertId });
    }
  );
});

// Delete a user
app.delete('/users/:id', (req, res) => {
  const userId = req.params.id;
  userDb.query('DELETE FROM users WHERE user_id = ?', [userId], (err, result) => {
    if (err) {
      console.error('Error deleting user:', err);
      return res.status(500).send('Error deleting user');
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  });
});

// Add a new product
app.post('/products', (req, res) => {
  const { name, price, stock } = req.body;
  productDb.query(
    'INSERT INTO products (name, price, stock) VALUES (?, ?, ?)',
    [name, price, stock],
    (err, result) => {
      if (err) {
        console.error('Error adding product:', err);
        return res.status(500).send('Error adding product');
      }
      res.status(201).json({ message: 'Product added successfully', productId: result.insertId });
    }
  );
});

// Edit an existing product
app.put('/products/:id', (req, res) => {
  const productId = req.params.id;
  const { name, price, stock } = req.body;
  productDb.query(
    'UPDATE products SET name = ?, price = ?, stock_quantity = ? WHERE product_id = ?',
    [name, price, stock, productId],
    (err, result) => {
      if (err) {
        console.error('Error updating product:', err);
        return res.status(500).send('Error updating product');
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json({ message: 'Product updated successfully' });
    }
  );
});

// Delete a product
app.delete('/products/:id', (req, res) => {
  const productId = req.params.id;
  productDb.query('DELETE FROM products WHERE product_id = ?', [productId], (err, result) => {
    if (err) {
      console.error('Error deleting product:', err);
      return res.status(500).send('Error deleting product');
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  });
});

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  console.log("📨 Received message:", userMessage);
  console.log("🔑 API key present?", !!process.env.COHERE_API_KEY);

  if (!userMessage) {
    return res.status(400).json({ error: "Missing user message in request body." });
  }

  try {
    const response = await axios.post(
      "https://api.cohere.ai/v1/chat",
      {
        model: "command-a-03-2025",
        message: userMessage,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error("❌ Backend error:", err.response?.data || err.message);
    console.error("❌ Full error object:", err);
    res.status(500).json({ error: "Something went wrong with the AI call." });
  }
});



// Open API Connection
app.listen(port, () => {
  console.log(`API service is running on port ${port}`);
});


