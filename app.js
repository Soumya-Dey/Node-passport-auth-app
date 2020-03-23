const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');

const indexRoutes = require('./routes/index');
const usersRoute = require('./routes/users');
const mongoURI = require('./config/keys').MongoURI;

const app = express();

// db connection
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(`error: ${err}`));

// ejs
app.use(expressLayouts);
app.set('view engine', 'ejs');

// body parser
app.use(express.urlencoded({ extended: false }));

// routes
app.use('/', indexRoutes);
app.use('/users', usersRoute);

// listen to server
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`listining to port ${PORT}`));