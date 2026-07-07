const express = require('express');
const cors = require('cors');

const app = express();

//importing routes
const authRoutes = require('./routes/auth.routes')
const userRoutes = require('./routes/user.routes')
const productRoutes = require('./routes/product.routes')

// global middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const errorHandler = require('./middleware/errorHandler')
const notFound = require('./middleware/notFound')

// connect to database
const connectDB = require('./config/dbConnection')
connectDB();

app.get('/', (req, res) => { 
    res.send('<h1>An E-Commerce Backend System</h1>')
})

//routes
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/products', productRoutes)

app.use(notFound);
app.use(errorHandler);

module.exports = app;
