// Import required modules
const express = require('express');
const mysql = require('mysql');

// Create the Express app
const app = express();

// Set the port from the environment variable or default to 3000
const port = process.env.PORT || 3000;

// Parse the connection string from the environment variable (Azure MySQL In App)
const mysqlConnStr = process.env.MYSQLCONNSTR_localdb || 'Server=127.0.0.1;Database=localdb;Uid=azure;Pwd=6#vWHD_$';

// Function to parse the connection string to extract host, user, password, and database
function parseConnectionString(connStr) {
  const config = {};
  const pairs = connStr.split(';');
  pairs.forEach(pair => {
    const [key, value] = pair.split('=');
    if (key && value) {
      config[key.toLowerCase().trim()] = value.trim();
    }
  });
  return config;
}

const dbConfig = parseConnectionString(mysqlConnStr);

// Create a MySQL connection pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: dbConfig.server || '127.0.0.1',
  user: dbConfig.uid || 'azure',
  password: dbConfig.pwd || '6#vWHD_$',
  database: dbConfig.database || 'employees_db',
  port: dbConfig.PORT || 51830,
  multipleStatements: true
});

// Middleware to parse JSON request body
app.use(express.json());

// Create database and table on server start
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
    return;
  }

  const createDBQuery = `
    CREATE DATABASE IF NOT EXISTS employees_db;
    USE employees_db;
    CREATE TABLE IF NOT EXISTS employees (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      position VARCHAR(100) NOT NULL,
      salary DECIMAL(10, 2) NOT NULL
    );
  `;

  connection.query(createDBQuery, (err, result) => {
    connection.release();
    if (err) {
      console.error('Error creating database or table:', err.message);
    } else {
      console.log('Database and table created successfully');
    }
  });
});

// Route to display a simple welcome message
app.get('/', (req, res) => {
  res.send(`
    <h1>Welcome to Employee Management</h1>
    <p>This is a Node.js app with MySQL In App on Azure.</p>
    <ul>
      <li><a href="/employees">View All Employees</a></li>
    </ul>
  `);
});

// Route to fetch all employees
app.get('/employees', (req, res) => {
  const query = 'SELECT * FROM employees';
  pool.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching employees:', err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(results);
  });
});

// Route to get an employee by ID
app.get('/employees/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM employees WHERE id = ?';
  pool.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error fetching employee:', err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(results[0] || {});
  });
});

// Route to create a new employee
app.post('/employees', (req, res) => {
  const { name, position, salary } = req.body;
  if (!name || !position || !salary) {
    return res.status(400).json({ error: 'Name, position, and salary are required' });
  }
  const query = 'INSERT INTO employees (name, position, salary) VALUES (?, ?, ?)';
  pool.query(query, [name, position, salary], (err, result) => {
    if (err) {
      console.error('Error inserting employee:', err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json({ message: 'Employee created successfully', employeeId: result.insertId });
  });
});

// Route to update an employee's information
app.put('/employees/:id', (req, res) => {
  const { id } = req.params;
  const { name, position, salary } = req.body;
  const query = 'UPDATE employees SET name = ?, position = ?, salary = ? WHERE id = ?';
  pool.query(query, [name, position, salary, id], (err, result) => {
    if (err) {
      console.error('Error updating employee:', err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json({ message: 'Employee updated successfully' });
  });
});

// Route to delete an employee by ID
app.delete('/employees/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM employees WHERE id = ?';
  pool.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting employee:', err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json({ message: 'Employee deleted successfully' });
  });
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
