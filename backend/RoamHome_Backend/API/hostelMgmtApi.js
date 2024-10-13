const exp = require('express');
const hostelMgmtApp=exp.Router();
const bcryptjs=require('bcryptjs')
const jwt=require('jsonwebtoken')
const expressAsyncHandler=require('express-async-handler')
const tokenVerify=require('../middlewares/tokenVerify.js')
const multer = require('multer');
const path = require('path');
const fs = require('fs');


hostelMgmtApp.use(exp.json());

//Get all hostelAdmins(public)
hostelMgmtApp.get("/hostelMgmt", async (req, res) => {
    // Get hostelMgmtCollection object
    const hostelMgmtCollection = req.app.get('hostelMgmtCollection');

    // Fetch all hostel admins
    let hostelAdminsList = await hostelMgmtCollection.find().toArray();

    // Parse roomTypes for each hostelAdmin
    hostelAdminsList = hostelAdminsList.map(admin => {
        console.log("Before processing admin:", admin);

        // Check if properties exist and are an array
        if (admin.properties && Array.isArray(admin.properties)) {
            admin.properties.forEach(property => {
                if (property.roomTypes && typeof property.roomTypes === 'string') {
                    try {
                        console.log("Attempting to parse roomTypes for property:", property.roomTypes);
                        // Attempt to parse the roomTypes
                        property.roomTypes = JSON.parse(property.roomTypes);
                        console.log("Parsed roomTypes successfully:", property.roomTypes);
                    } catch (error) {
                        // If parsing fails, keep it as a string
                        console.error("Error parsing roomTypes:", error);
                        console.log("Keeping roomTypes as string:", property.roomTypes);
                    }
                } else {
                    console.log("roomTypes is not a string or is undefined for property:", property.roomTypes);
                }
            });
        } else {
            console.log("No properties found for admin:", admin.username);
        }

        console.log("After processing admin:", admin);
        return admin;
    });

    // Send the updated list
    res.send({ message: "users", payload: hostelAdminsList });
});





//Get all hostelAdmins(protected)
hostelMgmtApp.get("/hostelAdmins", tokenVerify, expressAsyncHandler(async (req, res) => {
    // Get hostelMgmtCollection object
    const hostelMgmtCollection = req.app.get('hostelMgmtCollection');

    // Fetch all hostel admins
    let hostelAdminsList = await hostelMgmtCollection.find().toArray();

    // Parse roomTypes for each hostelAdmin
    hostelAdminsList = hostelAdminsList.map(admin => {
        //console.log("Before processing admin:", admin);

        // Check if properties exist and are an array
        if (admin.properties && Array.isArray(admin.properties)) {
            admin.properties.forEach(property => {
                if (property.roomTypes && typeof property.roomTypes === 'string') {
                    try {
                        //console.log("Attempting to parse roomTypes for property:", property.roomTypes);
                        // Attempt to parse the roomTypes
                        property.roomTypes = JSON.parse(property.roomTypes);
                        //console.log("Parsed roomTypes successfully:", property.roomTypes);
                    } catch (error) {
                        // If parsing fails, keep it as a string
                        console.error("Error parsing roomTypes:", error);
                       // console.log("Keeping roomTypes as string:", property.roomTypes);
                    }
                } else {
                    //console.log("roomTypes is not a string or is undefined for property:", property.roomTypes);
                }
            });
        } else {
            //console.log("No properties found for admin:", admin.username);
        }

        //console.log("After processing admin:", admin);
        return admin;
    });

    // Send the updated list
    res.send({ message: "users", payload: hostelAdminsList });
}));


//Get user by username (protected)
hostelMgmtApp.get("/hostelAdmins/:username", tokenVerify, expressAsyncHandler(async (req, res) => {
    // get hostelMgmtCollection obj
    const hostelMgmtCollection = req.app.get('hostelMgmtCollection');
    const hUsernameOfUrl = req.params.username;

    // Fetch the specific hostel admin by username
    let hostelAdmin = await hostelMgmtCollection.findOne({ username: { $eq: hUsernameOfUrl } });

    // Check if hostelAdmin exists and has properties
    if (hostelAdmin && hostelAdmin.properties && Array.isArray(hostelAdmin.properties)) {
        hostelAdmin.properties.forEach(property => {
            // Check and parse roomTypes if it's a string
            if (property.roomTypes && typeof property.roomTypes === 'string') {
                try {
                    console.log("Attempting to parse roomTypes for property in", hUsernameOfUrl, ":", property.roomTypes);
                    property.roomTypes = JSON.parse(property.roomTypes);
                    console.log("Parsed roomTypes successfully:", property.roomTypes);
                } catch (error) {
                    console.error("Error parsing roomTypes for property in", hUsernameOfUrl, ":", error);
                }
            }
        });
    }

    // Send the parsed hostel admin
    res.send({ message: "Hostel admin by url", payload: hostelAdmin });
}));



//Add new user
hostelMgmtApp.post("/admin",expressAsyncHandler(async(req,res) => {
    //get hostelMgmtCollection obj
    const hostelMgmtCollection=req.app.get('hostelMgmtCollection')

    const newAdmin=req.body;

    let existingAdmin=await hostelMgmtCollection.findOne({username:newAdmin.username})

    if(existingAdmin!=null)
    {
        res.send({message:"User already existed"})
    }
    else{
        let hashedpassword= await bcryptjs.hash(newAdmin.password,7)
 
        newAdmin.password=hashedpassword;
 
        await hostelMgmtCollection.insertOne(newAdmin)
 
        res.send({message:"user created"})
     }
}));

//hostel management login
hostelMgmtApp.post('/hostelMgmt-login',expressAsyncHandler(async(req,res)=>{
    //get hostelMgmtCollection obj
    const hostelMgmtCollection=req.app.get('hostelMgmtCollection')
    const adminCred=req.body;
    let dbUser=await hostelMgmtCollection.findOne({email:adminCred.email})
    if(dbUser==null)
    {
        res.send({message:"Invalid email"})

    }
    else{
        let result=await bcryptjs.compare(adminCred.password,dbUser.password)
        if(result===false)
        {
            res.send({message:"Invalid password"})
        }
    
    else{
        let signedToken=jwt.sign({email:adminCred.email},process.env.SECRET_KEY,{expiresIn:"15m"})
        res.send({message:"login success",token:signedToken,admin:dbUser})
    }
}
}));

//Add properties to Hostel Management(protected)
// const uploadsDir = path.join(__dirname, 'uploads');
// if (!fs.existsSync(uploadsDir)) {
//     fs.mkdirSync(uploadsDir, { recursive: true });
// }

// Serve static files from the uploads directory
hostelMgmtApp.use('/Images', exp.static(path.join(__dirname, 'public/Images')));


// Define the storage configuration for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/Images'); // Save images to the 'public/Images' folder
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

const upload = multer({ storage: storage });

// PUT route to update properties with uploaded images
hostelMgmtApp.put("/hostelAdmins/:username/listing", upload.array('photos'), expressAsyncHandler(async (req, res) => {
    const username = req.params.username;
    let properties = req.body;

    // Log the incoming request body to debug
    console.log('Request body:', req.body);
    console.log('Uploaded files:', req.files);

    // Parse req.body if it's in string format
    if (typeof properties === 'string') {
        properties = JSON.parse(properties);
    }

    // Get the hostel management collection object
    const hostelMgmtCollection = req.app.get('hostelMgmtCollection');

    // Find the admin
    let admin = await hostelMgmtCollection.findOne({ username: username });

    if (!admin) {
        return res.status(404).send({ message: "Hostler not found" });
    }

    // Prepare to append file paths to properties
    if (!admin.properties) {
        admin.properties = [];
    }

    // Store filenames of uploaded photos
    const fileNames = req.files.map(file => `/Images/${file.filename}`); // Store only the relative path
    properties.photos = fileNames; // Add the photo paths to the properties object
console.log(fileNames)
    admin.properties.push(properties); // Add the new property to the admin's properties

    // Update the database
    await hostelMgmtCollection.updateOne(
        { username: username },
        { $set: { properties: admin.properties } }
    );

    res.send({ message: "Properties added", payload: admin.properties });
}));


// Update specific property details (protected)
hostelMgmtApp.put("/hostelAdmins/:id",tokenVerify,expressAsyncHandler(async (req, res) => {
    const hostelMgmtCollection = req.app.get('hostelMgmtCollection');
    
    const idOfUrl= new ObjectId(req.params.id); 
    const modifiedHostelAdmin = req.body; 
console.log("mod ",modifiedHostelAdmin)
    
                const updateResult = await hostelMgmtCollection.updateOne(
    { _id: idOfUrl, "properties.hostelName": modifiedHostelAdmin.hostelName },
    { $set: { "properties.$": modifiedHostelAdmin } }
);


        

        res.send({ message: "Property updated successfully", payload: updateResult });
    
}));




//Add reserved users to hostelMgmt 
const { ObjectId } = require('mongodb'); 

hostelMgmtApp.put("/hostelAdmins/:username/reservation",tokenVerify, expressAsyncHandler(async (req, res) => {
    // Get hostelMgmtCollection obj
    const hostelMgmtCollection = req.app.get('hostelMgmtCollection');

    const adminOfUsername = req.params.username;
    const bookingDetails = req.body;

    try {
        

        let owner = await hostelMgmtCollection.findOne({ username:adminOfUsername  });

        if (!owner) {
            return res.status(404).send({ message: "Admin not found" });
        }
        if (!owner.hostelBookingDetails) {
            owner.hostelBookingDetails = [];
        }
        owner.hostelBookingDetails.push(bookingDetails);

        await hostelMgmtCollection.updateOne(
            { username:adminOfUsername },
            { $set: { hostelBookingDetails: owner.hostelBookingDetails } }
        );

        res.send({ message: "Added Successfully", payload: owner.hostelBookingDetails });
    } catch (error) {
        res.status(500).send({ message: "An error occurred", error: error.message });
    }
}));

//delete hostelMgmtAcc(protected)
hostelMgmtApp.delete('/hostelAdmins/:username',(async(req,res)=>{
    // Get hostlersCollection obj
    const hostelMgmtCollection = req.app.get('hostelMgmtCollection');
    const userName = req.params.username;
    const user = await hostelMgmtCollection.findOne({ username: userName });

    if (user===null) {
        res.send({ message: "User not found" });
    } 
    else {
        await hostelMgmtCollection.deleteOne({ username: userName });
        res.send({ message: "User deleted" });
    }

}));

//delete a property (protected)
hostelMgmtApp.delete('/hostelAdmins/:username/properties/:hostelName', (async (req, res) => {
    // Get hostelMgmtCollection obj
    const hostelMgmtCollection = req.app.get('hostelMgmtCollection');

    const userName = req.params.username;
    const hostelName = req.params.hostelName;

    const user = await hostelMgmtCollection.findOne({ username: userName });

    if (user && user.properties.some(property => property.hostelName === hostelName)) {
        await hostelMgmtCollection.updateOne(
            { username: userName },
            { $pull: { properties: { hostelName: hostelName } } } 
        );
        res.send({ message: "Property deleted" });
    } else {
        res.send({ message: "Property not found" });
    }
}));

//get properties based on city name

hostelMgmtApp.get('/properties/:city', expressAsyncHandler(async (req, res) => {
    const city = req.params.city;
    const hostelMgmtCollection = req.app.get('hostelMgmtCollection');

    // Query the database to find all hostel admins that have properties in the specified city
    const hostelAdmins = await hostelMgmtCollection.find({
        "properties.city": { $regex: new RegExp(city, 'i') }
    }).toArray();

    // Flatten all properties from the hostelAdmins
    const allProperties = hostelAdmins.flatMap(admin => admin.properties);

    // Parse roomTypes for each property
    const propertiesWithParsedRoomTypes = allProperties.map(property => {
        console.log("Before processing property:", property);

        if (property.roomTypes && typeof property.roomTypes === 'string') {
            try {
                // console.log("Attempting to parse roomTypes:", property.roomTypes);
                // Attempt to parse the roomTypes
                property.roomTypes = JSON.parse(property.roomTypes);
                // console.log("Parsed roomTypes successfully:", property.roomTypes);
            } catch (error) {
                // If parsing fails, keep it as a string
                console.error("Error parsing roomTypes:", error);
                // console.log("Keeping roomTypes as string:", property.roomTypes);
            }
        } else {
            console.log("roomTypes is not a string or is undefined:", property.roomTypes);
        }

        // console.log("After processing property:", property);
        return property;
    });

    // Filter properties by the specified city
    const filteredProperties = propertiesWithParsedRoomTypes.filter(property => 
        property.city.toLowerCase() === city.toLowerCase()
    );

    // Send the filtered properties as a response
    res.send({ message: "properties", payload: filteredProperties });
}));







//search by cities
hostelMgmtApp.get('/search/:city', async (req, res) => {
    // Get hostelMgmtCollection object
    const hostelMgmtCollection = req.app.get('hostelMgmtCollection');
    
    const searchTerm = req.params.city ? req.params.city.toLowerCase() : '';

    try {
        // Fetch all hostel admins
        const hostelAdmins = await hostelMgmtCollection.find().toArray();

        // Flatten the properties array and extract cities while parsing roomTypes
        const allCities = hostelAdmins.flatMap(admin => 
            admin.properties?.map(property => {
                // Parse roomTypes if it's a string
                if (property.roomTypes && typeof property.roomTypes === 'string') {
                    try {
                        property.roomTypes = JSON.parse(property.roomTypes);
                    } catch (error) {
                        console.error("Error parsing roomTypes:", error);
                    }
                }
                return property.city?.toLowerCase();
            }) || []
        );

        // Filter cities by search term
        const filteredCities = allCities.filter(city => city?.includes(searchTerm));

        // Remove duplicates
        const uniqueCities = [...new Set(filteredCities)];

        // Return the array of unique cities
        res.send({ message: "Cities found", payload: uniqueCities });
    } catch (error) {
        console.error('Error fetching cities:', error);
        res.status(500).send({ message: "An error occurred", error: error.message });
    }
});




module.exports =hostelMgmtApp;


// hostelMgmtApp.put("/hostelAdmins/:id", tokenVerify, expressAsyncHandler(async (req, res) => {
//     const hostelMgmtCollection = req.app.get('hostelMgmtCollection');

//     const idOfUrl = new ObjectId(req.params.id);
//     const modifiedHostelAdmin = req.body;
//     console.log("mod ", modifiedHostelAdmin);

//     const updateResult = await hostelMgmtCollection.updateOne(
//         {
//             _id: idOfUrl,
//             "properties.hostelName": modifiedHostelAdmin.hostelName // Ensure this matches exactly
//         },
//         {
//             $set: { "properties.$": modifiedHostelAdmin }
//         }
//     );

//     console.log(updateResult);

//     if (updateResult.matchedCount === 0) {
//         return res.status(404).send({ message: "No matching property found." });
//     }

//     res.send({ message: "Property updated successfully", payload: updateResult });
// }));