const exp= require('express')
const app= exp();
const cors = require('cors');

app.use(exp.json());
require('dotenv').config()//process.env.SECRET_KEY
app.use(cors({
    origin: 'http://localhost:5173' // Your frontend's URL
}));
//import MongoClient
const {MongoClient}=require('mongodb')
let mClient=new MongoClient(process.env.DB_URL)
//connect mongoDB server
mClient.connect()
.then((connectionObj)=>{

    //connect to a database(romehome)
    const romehomedb=connectionObj.db('roamhome')
    //connection to a collection
    const hostlersCollection=romehomedb.collection('hostlers')
    const hostelMgmtCollection=romehomedb.collection('hostelMgmt')

    app.set('hostlersCollection',hostlersCollection)
    app.set('hostelMgmtCollection',hostelMgmtCollection)
    
    console.log("DB connection success")

    app.listen(process.env.PORT,()=>console.log("http server started on port 4000"))
}
)
.catch(err=>console.log("Error in DB connection",err))

const hostlerApp = require("./API/hostlerApi");
const hostelMgmtApp = require("./API/hostelMgmtApi");

app.use("/hostler-api",hostlerApp);

app.use("/hostelMgmt-Api", hostelMgmtApp);

//handling invalid path
app.use('*',(req,res,next)=>{
    res.send({message:'Invalid path'})
})

//error handling middleware
app.use((err,req,res,next)=>{
    res.send({message:"error occured",errorMessage:err.message})
})