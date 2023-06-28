
const express = require('express');
const connectDB = require('./config/database/db');
const morgan = require('morgan');
const bodyParser = require('body-parser')
const adminUserRoutes = require('./api/routes/adminUser');
const userRoutes = require('./api/routes/user')
const vocabularyRoutes = require('./api/routes/vocabulary');

/**
 * Creating App
 */

const app = express();
app.use(morgan('dev'));

/**
 * Calling Database Functionality
 */

connectDB();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * Middleware
 */


app.use('/api/adminuser', adminUserRoutes);
app.use('/api/user', userRoutes);
app.use('/api/vocabulary', vocabularyRoutes);


/**
 * Error Handling While Enter Wrong URL 
 */

app.use('', async (req, res, next) => {

    res.status(500).json({
        success: false,
        error: "Bad Respone Enter Url is Wrong!! Please Check!!"
    });
});

module.exports = app;