const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb+srv://aman:roor@cluster0.gmyhglx.mongodb.net/project', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

// Check MongoDB connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

// Define schema for user sign up
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String
});

// Define schema for travel requests
const travelRequestSchema = new mongoose.Schema({
  username: String,
  mobile_number: String,
  email: String,
  starting_date: Date,
  ending_date: Date,
  pickup_destination: String,
  number_of_travellers: Number,
  trip_details: String,
});

// Create models based on the schemas
const User = mongoose.model('logsign', userSchema); // Assuming 'logsign' is your user table
const TravelRequest = mongoose.model('travel_requests', travelRequestSchema); // Assuming 'travel_requests' is your travel requests table

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from the "Travel Crew" directory
app.use(express.static(path.join(__dirname, 'Travel Crew')));

// Route for user signup
app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const user = new User({ username, email, password });
        await user.save();
        res.redirect('/'); // Redirect to home page
    } catch (error) {
        console.error('Error creating user', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route for user login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email, password });
        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' });
        } else {
            res.redirect('/'); // Redirect to home page
        }
    } catch (error) {
        console.error('Error fetching user', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route for submitting travel requests
app.post('/custom', async (req, res) => {
    const { username, number, email, s_date, e_date, pickup, no_traveller, trip_details } = req.body;
    try {
        const travelRequest = new TravelRequest({
            username,
            mobile_number: number,
            email,
            starting_date: new Date(s_date),
            ending_date: new Date(e_date),
            pickup_destination: pickup,
            number_of_travellers: no_traveller,
            trip_details,
        });
        await travelRequest.save();
        res.redirect('/'); // Redirect to home page
    } catch (error) {
        console.error('Error creating travel request', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const port = 3000;
app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
