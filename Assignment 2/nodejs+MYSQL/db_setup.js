const mysql = require('mysql2');
require('dotenv').config();

// MySQL Connection for setup
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 3306
});

console.log('Setting up database...');

// Create database and table
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    console.log('Please make sure MySQL server is running and credentials are correct.');
    console.log('Default credentials: host=localhost, user=root, password=(empty)');
    process.exit(1);
  } else {
    console.log('Connected to MySQL server');
    
    // Create database if it doesn't exist
    const createDbQuery = 'CREATE DATABASE IF NOT EXISTS ??';
    db.query(mysql.format(createDbQuery, [process.env.DB_NAME || 'crud_app']), (err) => {
      if (err) {
        console.error('Error creating database:', err);
        process.exit(1);
      } else {
        console.log('Database created or already exists');
        
        // Connect to the specific database
        db.changeUser({database: process.env.DB_NAME || 'crud_app'}, (err) => {
          if (err) {
            console.error('Error selecting database:', err);
            process.exit(1);
          } else {
            console.log('Using database:', process.env.DB_NAME || 'crud_app');
            
            // Create table if it doesn't exist
            const createTableQuery = `
              CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL UNIQUE,
                phone VARCHAR(20),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
              )
            `;
            
            db.query(createTableQuery, (err) => {
              if (err) {
                console.error('Error creating table:', err);
                process.exit(1);
              } else {
                console.log('Users table created or already exists');
                console.log('Database setup completed successfully!');
                db.end();
              }
            });
          }
        });
      }
    });
  }
});