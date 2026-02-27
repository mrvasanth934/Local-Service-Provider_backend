const express = require('express')

const connectDB = require('./config/db')

const cookieParser = require('cookie-parser')

const { authRoute } = require('./routes/authRoute')

require('dotenv').config()

const app = express()

app.use(express.json())

app.use(cookieParser())

connectDB()

app.listen(process.env.PORT,()=>{console.log(`server listen using port number of ${process.env.PORT}`);
})

app.use('/api/v1/auth',authRoute)