const express = require("express");

const router = express.Router();

const Prayer = require("../models/Prayer");



// Submit Prayer Request

router.post("/", async(req,res)=>{


    try{


        const prayer = await Prayer.create(
            req.body
        );


        res.status(201).json({

            success:true,

            message:
            "Prayer request submitted successfully",

            prayer

        });



    }catch(error){


        res.status(500).json({

            success:false,

            message:error.message

        });


    }


});





// Get All Prayer Requests
// Admin Dashboard will use this later

router.get("/", async(req,res)=>{


    try{


        const prayers = await Prayer.find()
        .sort({
            createdAt:-1
        });



        res.json({

            success:true,

            prayers

        });



    }catch(error){


        res.status(500).json({

            success:false,

            message:error.message

        });


    }


});





module.exports = router;