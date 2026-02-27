const mongoose = require('mongoose')

const connectDB = async () => {
    await mongoose.connect(process.env.MONGODB_URI)
        .then(() => {
            console.log("Database connected");
        })
        .catch(() => {
            console.log("Database connection makee problem");
        })
}
module.exports = connectDB;