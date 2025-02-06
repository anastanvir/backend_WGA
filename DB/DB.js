const mongoose = require("mongoose")

const DBConnection = () => {
    try {
        mongoose.connect(process.env.MONGODB_URI)
        console.log("Database is Connected")
    } catch (error) {
        console.log(error)
    }
}

module.exports = DBConnection