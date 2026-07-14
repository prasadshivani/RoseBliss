const mongoose = require("mongoose");

const connectDB = () => {
    try {
        mongoose.connect(process.env.MONGO_URI);
        console.log("database connected success");
    } catch (error){
        console.log(error);
        
    }
};

module.exports = connectDB;