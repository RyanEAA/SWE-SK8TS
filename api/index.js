const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
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
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

app.use(express.json()); // Middleware for JSON parsing

const path = require('path');
app.use('/public', express.static(path.join(__dirname, 'public')));


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
app.get('/allusers', (req, res) => {
  userDb.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).send('Error fetching users');
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
  orderDb.query(
    'SELECT * FROM orders o JOIN orderedItems oi ON o.order_id = oi.order_id',
    (err, results) => {
      if (err) {
        console.error('Error fetching orders:', err);
        return res.status(500).send('Error fetching orders');
      }
      res.json(results);
    }
  );
});


// 🔹 Place Order API
app.post('/placeOrder', [
  body('user_id').isInt({ min: 1 }).withMessage('Valid user_id is required'),
  body('total_amount').isFloat({ min: 0 }).withMessage('Total amount must be a non-negative number'),
  body('shipping_address').notEmpty().trim().withMessage('Shipping address is required'),
  body('items').isArray({ min: 1 }).withMessage('Items must be a non-empty array'),
  body('items.*.product_id').isInt({ min: 1 }).withMessage('Valid product_id is required for each item'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
  body('items.*.price').isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
  body('items.*.customization').optional().isString().trim()
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
        const insertItems = items.map(item => [
          order_id, item.product_id, item.quantity, item.price, item.customization || null
        ]);

        connection.query(
          'INSERT INTO orderedItems (order_id, product_id, quantity, price, customization) VALUES ?',
          [insertItems],
          (err) => {
            if (err) {
              connection.rollback(() => connection.release());
              return res.status(500).send('Error adding ordered items');
            }

            connection.commit(err => {
              connection.release();
              if (err) return res.status(500).send('Error finalizing order');

              res.status(201).json({ message: 'Order added successfully', orderId: order_id });
            });
          }
        );
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

app.get('/order/:order_id', (req, res) => {
  const orderId = req.params.order_id;

  // Check if order_id is valid
  if (!/^\d+$/.test(orderId)) {
    return res.status(400).json({ error: 'Invalid order ID' });
  }

  // Query to fetch order and its items
  orderDb.query(
    'SELECT * FROM orders o JOIN orderedItems oi ON o.order_id = oi.order_id WHERE o.order_id = ?',
    [orderId],
    (err, results) => {
      if (err) {
        console.error('Error fetching order:', err);
        return res.status(500).send('Error fetching order');
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'Order not found' });
      }

      res.json(results);
    }
  );
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

// get all employees
app.get('/employees', (req, res) => {
  userDb.query("SELECT * FROM users WHERE user_role = 'employee'", (err, results) => {
    if (err) {
      console.error('Error fetching employees:', err);
      return res.status(500).send('Error fetching employees');
    }
    res.json(results);
  });
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


// lol we already have a users endpoint I feel like If I change it I'm going to have to change a lot of stuff
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

// Create a new product with image upload
// create folder where images will be stored
const fs = require('fs');
const multer = require('multer'); // Set up multer for file uploads

const uploadDir = path.join(__dirname, 'public', 'Images');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public', 'Images'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });
app.post('/createproduct', upload.single('image'), (req, res) => {
  const {
    name, description, price, stock_quantity, category_id, brand_id,
    sku, weight, dimensions, color, size, status, customizations
  } = req.body;

  const imagePath = req.file ? `/api/public/Images/${req.file.filename}` : null;

  const parsedCustomizations = customizations ? JSON.parse(customizations) : [];

  productDb.query(
    `INSERT INTO products (
      name, description, price, stock_quantity, category_id, brand_id, sku, weight, dimensions, color, size, image_path, status, customizations
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      name, description, price, stock_quantity, category_id, brand_id,
      sku, weight, dimensions, color, size, imagePath, status, JSON.stringify(parsedCustomizations)
    ],
    (err, result) => {
      if (err) {
        console.error('Error creating product:', err);
        return res.status(500).json({ error: 'Error creating product' });
      }
      res.status(201).json({ message: 'Product created successfully', productId: result.insertId });
    }
  );
});

// app.get('/api/products/:id', (req, res) => {
//   const productId = req.params.id;
  
//   productDb.query('SELECT * FROM products WHERE product_id = ?', [productId], (err, results) => {
//     if (err) {
//       console.error('DB error:', err); // full error
//       return res.status(500).json({ error: 'Database error', details: err.message });
//     }
    
//     if (results.length === 0) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     const product = results[0];
//     if (product.customizations) {
//       try {
//         product.customizations = JSON.parse(product.customizations);
//       } catch (e) {
//         console.error('Error parsing customizations:', e);
//         product.customizations = null;
//       }
//     }

//     res.json(product);
//   });
// }); 

// Edit an existing product
app.put('/products/:id', (req, res) => {
  const productId = req.params.id;
  const {
    name,
    price,
    stock_quantity,
    description,
    category_id,
    brand_id,
    sku,
    weight,
    dimensions,
    color,
    size,
    status,
    customizations,
  } = req.body;

  const parsedCustomizations = customizations ? JSON.stringify(customizations) : null;

  const query = `
    UPDATE products
    SET name = ?, price = ?, stock_quantity = ?, description = ?, category_id = ?, brand_id = ?,
        sku = ?, weight = ?, dimensions = ?, color = ?, size = ?, status = ?, customizations = ?
    WHERE product_id = ?
  `;

  const values = [
    name,
    price,
    stock_quantity,
    description,
    category_id,
    brand_id,
    sku,
    weight,
    dimensions,
    color,
    size,
    status,
    parsedCustomizations,
    productId,
  ];

  productDb.query(query, values, (err, result) => {
    if (err) {
      console.error('Error updating product:', err);
      return res.status(500).send('Error updating product');
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product updated successfully' });
  });
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

// update user
app.put('/users/:id', (req, res) => {
  const userId = req.params.id;
  const { username, email, password, first_name, last_name, user_role } = req.body;

  userDb.query(
    'UPDATE users SET username = ?, email = ?, password = ?, first_name = ?, last_name = ?, user_role = ? WHERE user_id = ?',
    [username, email, password, first_name, last_name, user_role, userId],
    (err, result) => {
      if (err) {
        console.error('Error updating user:', err);
        return res.status(500).send('Error updating user');
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({ message: 'User updated successfully' });
    }
  );
});


const https = require('https');
const fetch = require('node-fetch');

app.post('/chat', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    const data = await geminiResponse.json();

    if (!data || !data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
      return res.status(500).json({ error: 'Failed to get a valid response from Gemini API' });
    }

    const aiMessage = data.candidates[0].content.parts[0].text;

    res.json({ message: aiMessage });
  } catch (error) {
    console.error('Error connecting to Gemini API:', error);
    res.status(500).json({ error: 'Error connecting to Gemini API' });
  }
});


app.put('/editOrder/:order_id', [
  body('user_id').isInt({ min: 1 }).withMessage('Valid user_id is required'),
  body('total_amount').isFloat({ min: 0 }).withMessage('Total amount must be non-negative'),
  body('shipping_address').notEmpty().trim().withMessage('Shipping address is required'),
  body('items').isArray({ min: 1 }).withMessage('Items must be a non-empty array'),
  body('items.*.product_id').isInt({ min: 1 }).withMessage('Valid product_id required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be positive integer'),
  body('items.*.price').isFloat({ min: 0 }).withMessage('Price must be non-negative'),
  body('items.*.customization').optional().isString().trim()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { order_id } = req.params;
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

      // Step 1: Update the order details
      const updateOrderQuery = `
        UPDATE orders
        SET total_amount = ?, shipping_address = ?
        WHERE order_id = ? AND user_id = ?
      `;

      connection.query(updateOrderQuery, [total_amount, shipping_address, order_id, user_id], (err, result) => {
        if (err) {
          connection.rollback(() => connection.release());
          return res.status(500).send('Error updating order');
        }

        if (result.affectedRows === 0) {
          connection.rollback(() => connection.release());
          return res.status(404).json({ message: 'Order not found or unauthorized' });
        }

        // Step 2: Delete existing items for the order
        const deleteItemsQuery = 'DELETE FROM orderedItems WHERE order_id = ?';

        connection.query(deleteItemsQuery, [order_id], (err) => {
          if (err) {
            connection.rollback(() => connection.release());
            return res.status(500).send('Error clearing existing order items');
          }

          // Step 3: Insert updated items
          const insertItems = items.map(item => [
            order_id, item.product_id, item.quantity, item.price, item.customization || null
          ]);

          connection.query(
            'INSERT INTO orderedItems (order_id, product_id, quantity, price, customization) VALUES ?',
            [insertItems],
            (err) => {
              if (err) {
                connection.rollback(() => connection.release());
                return res.status(500).send('Error adding updated order items');
              }

              // Step 4: Commit the transaction
              connection.commit(err => {
                connection.release();
                if (err) return res.status(500).send('Error finalizing order update');

                res.status(200).json({ message: 'Order updated successfully', orderId: order_id });
              });
            }
          );
        });
      });
    });
  });
});

// Admin Analytics API
app.get('/admin/analytics', (req, res) => {
  const activeUsersQuery = `
    SELECT u.username, COUNT(o.order_id) AS total_orders
    FROM users u
    JOIN orders o ON u.user_id = o.user_id
    GROUP BY u.user_id
    ORDER BY total_orders DESC
    LIMIT 3
  `;

  const productiveEmployeesQuery = `
    SELECT u.username, COUNT(o.order_id) AS fulfilled_orders
    FROM users u
    JOIN orders o ON u.user_id = o.employee_id
    WHERE o.order_status = 'sent'
    GROUP BY u.user_id
    ORDER BY fulfilled_orders DESC
    LIMIT 3
  `;

  const popularItemsQuery = `
    SELECT p.name, SUM(oi.quantity) AS total_sold
    FROM products p
    JOIN orderedItems oi ON p.product_id = oi.product_id
    GROUP BY p.product_id
    ORDER BY total_sold DESC
    LIMIT 5
  `;

  Promise.all([
    new Promise((resolve, reject) => userDb.query(activeUsersQuery, (err, results) => err ? reject(err) : resolve(results))),
    new Promise((resolve, reject) => userDb.query(productiveEmployeesQuery, (err, results) => err ? reject(err) : resolve(results))),
    new Promise((resolve, reject) => productDb.query(popularItemsQuery, (err, results) => err ? reject(err) : resolve(results)))
  ])
  .then(([activeUsers, productiveEmployees, popularItems]) => {
    res.json({ activeUsers, productiveEmployees, popularItems });
  })
  .catch(err => {
    console.error('Error fetching analytics:', err);
    res.status(500).send('Error fetching analytics');
  });
});

// Contact Us - Submit Message
app.post('/message', [
  body('user_id').isInt({ min: 1 }).withMessage('Valid user_id is required'),
  body('title').notEmpty().trim().escape().withMessage('Title is required'),
  body('message_text').notEmpty().trim().escape().withMessage('Message text is required')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { user_id, title, message_text } = req.body;

  userDb.query(
    'INSERT INTO messages (user_id, title, message_text, created_at, is_read) VALUES (?, ?, ?, NOW(), 0)',
    [user_id, title, message_text],
    (err, result) => {
      if (err) {
        console.error('Error submitting message:', err);
        return res.status(500).send('Error submitting message');
      }
      res.status(201).json({ message: 'Message submitted successfully', messageId: result.insertId });
    }
  );
});

// Admin Message Center
app.get('/admin/messages', (req, res) => {
  userDb.query(
    `SELECT m.message_id, m.title, m.created_at, u.username
     FROM messages m
     JOIN users u ON m.user_id = u.user_id
     ORDER BY m.created_at DESC`,
    (err, results) => {
      if (err) {
        console.error('Error fetching messages:', err);
        return res.status(500).send('Error fetching messages');
      }
      res.json(results);
    }
  );
});

// Admin View Specific Message
app.get('/admin/message/:message_id', (req, res) => {
  const messageId = req.params.message_id;
  userDb.query(
    `SELECT m.*, u.username, u.email
     FROM messages m
     JOIN users u ON m.user_id = u.user_id
     WHERE m.message_id = ?`,
    [messageId],
    (err, results) => {
      if (err) {
        console.error('Error fetching message:', err);
        return res.status(500).send('Error fetching message');
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Message not found' });
      }
      res.json(results[0]);
    }
  );
});

// Admin Update Message Status
app.put('/admin/message/:message_id/markread', (req, res) => {
  const messageId = req.params.message_id;

  userDb.query(
    'UPDATE messages SET is_read = 1 WHERE message_id = ?',
    [messageId],
    (err, result) => {
      if (err) {
        console.error('Error updating message:', err);
        return res.status(500).send('Failed to update message');
      }

      if (result.affectedRows === 0) {
        return res.status(404).send('Message not found');
      }

      res.json({ message: 'Message marked as read' });
    }
  );
});

// get top 3 users
app.get('/admin/top-users', (req, res) => {
  userDb.query(
    'SELECT u.*, COUNT(o.order_id) AS order_count\
    FROM order.orders o\
    JOIN users.users u ON o.user_id = u.user_id\
    GROUP BY u.user_id\
    ORDER BY order_count DESC\
    LIMIT 3;',
    (err, results) => {
      if (err) {
        console.error('Error fetching top users:', err);
        return res.status(500).send('Error fetching top users');
      }
      res.json(results);
    }
  );
});


// get top 3 employees
app.get('/admin/top-employees', (req, res) => {
  userDb.query(
    `SELECT u.*, COUNT(o.order_id) AS handled_orders
     FROM order.orders o
     JOIN users u ON o.employee_id = u.user_id
     WHERE o.employee_id IS NOT NULL
     GROUP BY u.user_id
     ORDER BY handled_orders DESC
     LIMIT 3`,
    (err, results) => {
      if (err) {
        console.error('Error fetching top employees:', err);
        return res.status(500).send('Error fetching top employees');
      }
      res.json(results);
    }
  );
});


//get top 5 products
app.get('/admin/top-products', (req, res) => {
  productDb.query(
    `SELECT p.*, SUM(oi.quantity) AS total_ordered
     FROM order.orderedItems oi
     JOIN products p ON oi.product_id = p.product_id
     GROUP BY oi.product_id
     ORDER BY total_ordered DESC
     LIMIT 5`,
    (err, results) => {
      if (err) {
        console.error('Error fetching top products:', err);
        return res.status(500).send('Error fetching top products');
      }
      res.json(results);
    }
  );
});




// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).send('Internal server error');
});

// Open API Connection
app.listen(port, () => {
  console.log(`API service is running on port ${port}`);
});

