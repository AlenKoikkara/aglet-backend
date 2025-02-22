require('dotenv').config()
var cors = require('cors');

const express = require('express')
const mongoose = require('mongoose')
const serverless = require('serverless-http')

// express app
const app = express()

app.use(cors({ origin: ["http://localhost:3000", "http://44.203.204.86/", "https://aglet.vercel.app"] }))
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

const productRoutes = require('./routes/product')
const favouriteRoutes = require('./routes/favourites')
const userRoutes = require('./routes/user')
const cartRoutes = require('./routes/cart')
const orderRoutes = require('./routes/order')
const webhookRoutes = require('./routes/webhooks')

app.use('/api/webhooks', webhookRoutes)

// middleware
app.use(express.json())

app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

// routes
app.use('/api/products', productRoutes)
app.use('/api/favourite', favouriteRoutes)
app.use('/api/user', userRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/order', orderRoutes)
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from serverless backend with cicd!" });
});
app.use('/', (req, res) => {
  res.send('server is running')
})



// connect to db
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 30000, socketTimeoutMS: 45000, family: 4 })
  .then(() => {
    console.log('connected to database')
    // listen to port
    app.listen(process.env.PORT, () => {
      console.log('listening for requests on port', process.env.PORT)
    })
  })
  .catch((err) => {
    console.log(err)
  }) 

module.exports.handler = serverless(app);