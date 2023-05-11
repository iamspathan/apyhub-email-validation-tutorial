const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors({ allowedHeaders: 'Content-Type, Cache-Control' }));
app.options('*', cors());
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public')); //__dir and not _dir


const users = []; 

// Signup endpoint
app.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    //validate email using ApyHub API
    const response = await axios.post('https://api.apyhub.com/validate/email/dns', { email }, {
      headers: {
        'apy-token': 'ADD-YOUR-APY-TOKEN-HERE',
        'Content-Type': 'application/json'
      }
    });
   
    if (!response.data.data) {
      return res.status(400).json({ message: 'Invalid email address' });
    }


    // Check if user already exists
    const user = users.find(u => u.email === email);
    if (user) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Save user
    users.push({ email, password: hashedPassword });
    res.status(201).json({ message: 'User created' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.bodcleary;

    // Check if user exists
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if password is correct
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ email }, 'secret', { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.listen(3000, () => {
  console.log('Server started: http://localhost:3000');
});
