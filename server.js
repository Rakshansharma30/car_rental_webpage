const express = require('express');
const mysql = require('mysql');
const path = require('path'); // Add this line to import the path module

const app = express();
const port = 5500;

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rakshan',
  database: 'car_rental'
});

// Attempt to connect to the MySQL database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());

// Route to handle requests to the root URL
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.get('/rentalsignup-form.html', (req, res) => {
  res.sendFile(path.join(__dirname,'public', 'rentalsignup-form.html'));
});

app.get('/carrental.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public','carrental.html'));
});

app.post('/save_data', (req, res) => {
  const { username, firstName, lastName, password, otp } = req.body;

  const newUser = {
    username,
    first_name: firstName,
    last_name: lastName,
    password,
    otp
  };

  // Insert the new user data into the 'users' table
  db.query('INSERT INTO users SET ?', newUser, (err, result) => {
    if (err) {
      console.error('Error inserting data into database:', err);
      return res.status(500).json({ error: 'Error inserting data into database' });
    }
    console.log('User registered successfully');
    const htmlContent = `
      <script>
        alert('User registered successfully!');
        window.location.href = '/carrental.html'; // Redirect to carrental.html
      </script>
    `;

    res.status(200).send(htmlContent);
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
app.get('/loginpage.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'loginpage.html'));
});

// Route to serve the car rental page
app.get('/carrental.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'carrental.html'));
});

// Route to handle login form submission
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Query the database for the user with the provided username
  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).json({ error: 'Error querying database' });
    }

    // If no user found with the provided username, authentication fails
    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const user = results[0];

    // Compare the provided password with the hashed password stored in the database
    if (password !== user.password) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    const htmlContent2 = `
      <script>
        alert('User Login successfully!');
        window.location.href = '/carrental.html'; // Redirect to carrental.html
        res.status(200).json({ success: true });
      </script>
    `;
    res.redirect('/carrental.html');
  });
});
app.post('/booking', (req, res) => {
  const { vehicle, pickupLocation, destination, startDate, endDate } = req.body;
  let CarID;
  switch (vehicle) {
      case 'mustang':
          CarID = 1; 
          break;
      case 'swift':
          CarID = 2; 
          break;
      case 'creta':
          CarID = 3; 
          break;
      case 'nexon':
          CarID = 4; 
          break;
      case 'scorpio':
          CarID = 5; 
          break;
      case 'city':
          CarID = 6; 
          break;
      case 'fortuner':
          CarID = 7; 
          break;
      case 'seltos':
          CarID = 8; 
          break;
      case 'duster':
          CarID = 9; 
          break;
      case 'octavia':
          CarID = 10; 
          break;
      default:
          return res.status(400).json({ error: 'Invalid vehicle selection' });
  }

  // Create a new booking object
  const booking = {
//     CarID, // Assign CarID here based on the selected vehicle
//     PickupLocation: pickupLocation,
//     Destination: destination,
//     StartDate: startDate,
//     EndDate: endDate,
// };
CarID: 1,
PickupLocation: 'dehradun',
Destination: 'delhi',
StartDate: '2024-04-20',
EndDate: '2024-04-25' 
};
// Insert the new booking data into the 'Booking' table
db.query('INSERT INTO Booking SET ?', booking, (err, result) => {
  if (err) {
    console.error('Error inserting data into database:', err);
    return res.status(500).json({ error: 'Error inserting data into database' });
  }
  console.log('Booking saved successfully');
  res.status(200).json({ success: true });
});
});
