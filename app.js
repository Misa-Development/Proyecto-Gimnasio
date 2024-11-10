require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const cookieParser = require('cookie-parser');

const dbUri = process.env.MONGO_URI;
const port = process.env.APP_PORT || 3000;

mongoose.connect(dbUri)
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/admin', adminRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
