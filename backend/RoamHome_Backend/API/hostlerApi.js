
require('dotenv').config()
const exp = require('express');
const {Db}=require('mongodb')
const hostlerApp = exp.Router();
const bcryptjs=require('bcryptjs')
const jwt=require('jsonwebtoken')
const expressAsyncHandler=require('express-async-handler')
const tokenVerify=require('../middlewares/tokenVerify.js')
const {ObjectId}=require('mongodb')
hostlerApp.use(exp.json());



// Get all hostlers (protected)
hostlerApp.get("/hostlers",tokenVerify,expressAsyncHandler(async (req, res) => {
    //get hoslersCollection obj
    const hostlersCollection=req.app.get('hostlersCollection')
    //get hostlers data from hostlersCollection of DB
    let hostlersList = await hostlersCollection.find().toArray()
    //get users from DB
    res.send({message:"users",payload:hostlersList})
}));

// Get user by username (protected)
hostlerApp.get("/hostlers/:username",tokenVerify,expressAsyncHandler(async (req, res) => {
    //get hoslersCollection obj
    const hostlersCollection=req.app.get('hostlersCollection')
    const usernameOfUrl=req.params.username
    let hostler=await hostlersCollection.findOne({username:{$eq:usernameOfUrl}})
    res.send({message:"Hostler by url",payload:hostler})

}));

// Add new user
hostlerApp.post("/hostler",expressAsyncHandler(async (req, res) => {
    //get hoslersCollection obj
    const hostlersCollection=req.app.get('hostlersCollection')

    const newHostler=req.body;

    let existingHostler=await hostlersCollection.findOne({username:newHostler.username})

    if(existingHostler!==null)
    {
        res.send({message:"User already existed"})
    }
    else{
       let hashedpassword= await bcryptjs.hash(newHostler.password,7)

       newHostler.password=hashedpassword;

       await hostlersCollection.insertOne(newHostler)

       res.send({message:"user created"})
    }

}));

//hostler login
hostlerApp.post('/hostler-login',(async(req,res)=>{
    //get hoslersCollection obj
    const hostlersCollection=req.app.get('hostlersCollection')
    //get new HostlerCredential from client
    const hostlerCred=req.body;
    //verify email
    let dbUser=await hostlersCollection.findOne({email:hostlerCred.email})
    //if user not existed
    if(dbUser==null){
        res.send({message:"Invalid email"})
    }
    else{
       let result = await bcryptjs.compare(hostlerCred.password,dbUser.password)
       if(result===false)
       {
        res.send({message:"Invalid password"})
    }
    else{
        //create jwt token
        let signedToken=jwt.sign({email:hostlerCred.email},process.env.SECRET_KEY,{expiresIn:'15m'})
        //send res
        res.send({message:"login success",token:signedToken,hostler:dbUser})
    }
    }
}));

// Add booking details for a hostler (protected)
hostlerApp.put("/hostlers/:username/booking",tokenVerify, expressAsyncHandler(async (req, res) => {
    // Get hostlersCollection obj
    const hostlersCollection = req.app.get('hostlersCollection');
    
    // Get username from the URL params and booking details from the request body
    const username = req.params.username;
    const bookingDetails = req.body;

    // Find the hostler by username
    let hostler = await hostlersCollection.findOne({ username: username });
    
    // If hostler not found, send a 404 response
    if (!hostler) {
        return res.status(404).send({ message: "Hostler not found" });
    }

    // If hostelBookingDetails field doesn't exist, initialize it as an empty array
    if (!hostler.hostelBookingDetails) {
        hostler.hostelBookingDetails = [];
    }

    // Add new booking details to the hostelBookingDetails array
    hostler.hostelBookingDetails.push(bookingDetails);

    // Update the hostler document with the new booking details
    await hostlersCollection.updateOne(
        { username: username },
        { $set: { hostelBookingDetails: hostler.hostelBookingDetails } }
    );

    // Send response
    res.send({ message: "Booking added", payload: hostler.hostelBookingDetails });
}));

//hostler profile update
hostlerApp.put('/hostler-update/:id',tokenVerify,expressAsyncHandler(async(req,res)=>{
    // Get hostlersCollection obj
    const hostlersCollection = req.app.get('hostlersCollection');
    let hoslterId=new ObjectId(req.params.id);
    let modifiedUser=req.body;
    const result=await hostlersCollection.updateOne({_id:hoslterId},{$set:{...modifiedUser}})
res.send({message:"User modified"});
}))


//delete user(protected)
hostlerApp.delete('/hostler/:username',tokenVerify,expressAsyncHandler(async(req,res)=>{
    // Get hostlersCollection obj
    const hostlersCollection = req.app.get('hostlersCollection');
    const userName = req.params.username;
    const user = await hostlersCollection.findOne({ username: userName });

    if (user===null) {
        res.send({ message: "User not found" });
    } 
    else {
        await hostlersCollection.deleteOne({ username: userName });
        res.send({ message: "User deleted" });
    }

}));




module.exports = hostlerApp;