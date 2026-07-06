const express = require('express');
const cors = require('cors');


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connectDB = require('./config/dbConnection')
connectDB();

app.get('/', (req, res) => { 
    res.send('<h1>An E-Commerce Backend System</h1>')
})


module.exports = app;
