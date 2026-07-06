const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes')
const errorHandler = require('./middleware/errorHandler')
const notFound = require('./middleware/notFound')

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connectDB = require('./config/dbConnection')
connectDB();

app.get('/', (req, res) => { 
    res.send('<h1>An E-Commerce Backend System</h1>')
})

app.use('/api/auth/', authRoutes)

app.use(notFound);
app.use(errorHandler);

module.exports = app;
