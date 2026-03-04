const express = require('express')

const connectDB = require('./config/db')

const cookieParser = require('cookie-parser')

const { authRoute } = require('./routes/authRoute')

const {providerRoute} = require('./routes/providerRoute')

const serviceRoute = require('./routes/serviceRoute')

const orderRoute = require('./routes/orderRoute')

require('dotenv').config()

const app = express()

app.use(express.json())

app.use(cookieParser())

connectDB()

app.listen(process.env.PORT,()=>{console.log(`server listen using port number of ${process.env.PORT}`);
})

app.use('/api/v1/auth',authRoute)

app.use('/api/v1/provider',providerRoute)

app.use('/api/v1/service',serviceRoute)

app.use('/api/v1/orders',orderRoute)