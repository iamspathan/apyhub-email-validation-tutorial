const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const mongoose = require("mongoose");
const cors = require('cors');
const app = express();

app.use(cors({ allowedHeaders: 'Content-Type, Cache-Control' }));
app.options('*', cors());
app.use(bodyParser.json());


// Connect to MongoDB database
mongoose.connect('mongodb://localhost/auth_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to database'))
  .catch(err => console.error('Error connecting to database:', err));

  // Define user schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);


// Signup endpoint
app.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    //validate email using ApyHub API
    const response = await axios.post('https://api.apyhub.com/validate/email/dns', { email }, {
      headers: {
        'apy-token': 'APY0BOODK2plpXgxRjezmBOXqID51DGpFq8QnHJeBQrrzuIBc25UIglN93bbwvnkBWlUia1',
        'Content-Type': 'application/json'
      }
    });
   
    if (!res.isValid) {
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

    // Create new user
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

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

app.get('/', (req, res) => {
  res.send('/index.html')
})

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
