const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();


// Routes
const prayerRoutes = require("./routes/prayerRoutes");



const app = express();


// Middleware

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://your-frontend-domain.com"
    ],
    credentials:true
  })
);


app.use(express.json());

app.use(express.urlencoded({
  extended:true
}));




// API Routes

app.use("/api/prayer", prayerRoutes);





// Test Route

app.get("/", (req,res)=>{

    res.json({

        message:
        "DLCSF Global API Server Running"

    });

});





// MongoDB Connection

mongoose
.connect(process.env.MONGO_URI)
.then(()=>{

    console.log(
        "Database connected successfully"
    );

})
.catch((error)=>{

    console.log(
        "Database connection failed:",
        error.message
    );

});






// Server Port

const PORT = process.env.PORT || 5000;


app.listen(PORT,()=>{

    console.log(
        `Server running on port ${PORT}`
    );

});
import app from './app.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 Environment: ${process.env.NODE_ENV || 'development'}`);
});