const mongoose = require("mongoose");


const prayerSchema = new mongoose.Schema(
  {

    fullName:{
      type:String,
      required:true,
      trim:true
    },


    email:{
      type:String,
      required:true,
      trim:true
    },


    phone:{
      type:String,
      default:""
    },


    country:{
      type:String,
      default:""
    },


    state:{
      type:String,
      default:""
    },


    campus:{
      type:String,
      default:""
    },


    category:{
      type:String,
      default:"Spiritual Growth"
    },


    request:{
      type:String,
      required:true
    },


    anonymous:{
      type:Boolean,
      default:false
    },


    priority:{
      type:String,
      enum:["Normal","Urgent"],
      default:"Normal"
    },


    status:{
      type:String,
      enum:[
        "Pending",
        "Prayed",
        "Completed"
      ],
      default:"Pending"
    }

  },

  {
    timestamps:true
  }

);



module.exports = mongoose.model(
  "Prayer",
  prayerSchema
);