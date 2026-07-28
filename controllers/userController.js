const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// REGISTER USER

exports.register = async(req,res)=>{

try{

const {
name,
email,
password,
country,
fellowship
}=req.body;


const existingUser = await User.findOne({email});


if(existingUser){

return res.status(400).json({
message:"User already exists"
});

}



const hashedPassword = await bcrypt.hash(password,10);



const user = await User.create({

name,
email,
password:hashedPassword,
country,
fellowship

});



res.status(201).json({

message:"Registration successful",
user

});


}catch(error){

res.status(500).json({
message:error.message
});

}

};




// LOGIN USER

exports.login = async(req,res)=>{

try{


const {
email,
password
}=req.body;



const user = await User.findOne({email});


if(!user){

return res.status(404).json({
message:"User not found"
});

}



const checkPassword =
await bcrypt.compare(password,user.password);



if(!checkPassword){

return res.status(400).json({
message:"Invalid password"
});

}



const token = jwt.sign(

{
id:user._id,
role:user.role
},

process.env.JWT_SECRET,

{
expiresIn:"7d"
}

);



res.json({

message:"Login successful",

token,

user

});



}catch(error){

res.status(500).json({
message:error.message
});

}

};