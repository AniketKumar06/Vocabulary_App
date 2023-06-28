const http = require('http');
const app = require('./app')
const dotenv = require("dotenv");
const colors = require('colors');

/**
 * Configure path address by using dotenv 
 */

dotenv.config({
    path: './config/config.env'
});

/**
 * Creating Server
 */
const server = http.createServer(app);


const PORT = process.env.PORT

server.listen(PORT,
    console.log(`Server is running on port : ${PORT}`.blue.underline));
