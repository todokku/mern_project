const express = require("express");
const router = express.Router();
const bcrypt = require ("bcryptjs"); // to encrypt password
const config = require("config");
const jwt = require("jsonwebtoken");

//User Model
const User = require("../../models/User"); //we bring in item models

//actual route is to POST request from api/users
//Register new user
//Public access

router.post("/", (req, res)=> {
const {name, email, password} = req.body; //destructring in order to get data in res.body


//Validation
if(!name || !email || !password) { //if none of this values are present, response ll be 404
    return res.status(400).json({ msg: "Please enter all fields"});
}

//Check if user exists
User.findOne({ email })
.then(user => {  //to check if user already exist
    if(user) return res.status(400).json({ msg: "User already exist"});
     
    const newUser = new User({  //if user doesn't exist, new user is created
        name,
        email,
        password
    }); 
    
    // Salt created and hashed
    bcrypt.genSalt(10,(err, salt)=> { //defult is 10, can be higher num
        bcrypt.hash(newUser.password, salt, (err, hash) =>{
            if(err) throw err;
            newUser.password = hash; //password saved from plain text to hash
            newUser.save()
            .then(user=> {
                jwt.sign(
                    {id: user.id },
                    config.get("jwtSecret"),
                    { expiresIn: 3600},//token to last for an hour
                     (err, token)=>{
                         if(err) throw err;
                         res.json({
                             token,
                            user: {
                                id: user.id,  //id, name & email is sent back
                                name:user.name,
                                email: user.email
                            }
                        });
                     }
                )
              
            });
        })
    })
})
});
   
module.exports = router;