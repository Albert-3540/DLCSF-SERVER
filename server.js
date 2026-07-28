const express = require("express");
const cors = require("cors");
require("dotenv").config();


const connectDB = require("./config/database");


const app = express();



connectDB();



app.use(cors());

app.use(express.json());




// Routes

app.use("/api/auth",
require("./routes/auth"));




app.get("/",(req,res)=>{

res.send("DLCSF Global Backend Running");

});




const PORT = process.env.PORT || 5000;



app.listen(PORT,()=>{

console.log(
`Server running on port ${PORT}`
);

});