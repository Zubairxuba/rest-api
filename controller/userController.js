const mongoose = require("mongoose")
const User = require("../api/model/user")
const bycrpt = require("bcrypt")
const jwt = require("jsonwebtoken")
const config = require("dotenv").config;

config()

const userSignup =  (req, res, next)=>{

    bycrpt.hash(req.body.password, 10 , (err , hash)=>{
         if(err){
             res.status(500).json({
                 error: err
             })
         }else{
             const user = new User({
                 _id: mongoose.Types.ObjectId(), 
                 email: req.body.email,
                 password: hash
             });
             user.save()
             .then(result=>{
                 console.log(result);
                 res.status(200).json({
                     message: "New User Sign Up",
                     user: result
                 })
             })
             .catch(err=>{
                 console.log(err);
                 res.status(404).json({error: err})
             })
         }
     });
}


const userLogin = (req, res)=>{
    User.find({email: req.body.email})
    .exec()
    .then(users=>{
        if(users.length < 1){
                res.status(404).json({
                    message: "Auth Failed"
                })
        }

            bycrpt.compare(req.body.password, users[0].password, (err, result)=>{
                if ( err ){
                  return  res.status(404).json({
                        message: "Auth Failed"
                    })
                }
                if ( result){
                 const token = jwt.sign({
                        email: users[0].email,
                        userId : users[0]._id
                    },process.env.JWT_KEY,
                    {
                        expiresIn: "1h"
                    }
                    )
                 return   res.status(200).json({
                        message: "Auth Successfull",
                        token : token

                    })
                }else{
                    return res.status(404).json({
                        message: "Auth Failed"
                    })
                }
                
            })
        
    })
    .catch(err=>{
        res.status(404).json({
            error: err
        })
    })

}

const getAllUsers =  (req, res, next)=>{
    User.find()
    .select("_id email")
    .exec()
    .then(doc=>{
      
        res.status(200).json({
            count: doc.length,
            user: doc
        })
    
    })
    .catch(err=>{
        console.log(err);
        res.status(404).json({error: err})
    })
}


const deleteUser =  (req, res, next)=>{
    const id = req.params.userId
    User.remove({_id: id })
    .select("_id email")
    .exec()
    .then(doc=>{
        console.log(doc);
        res.status(200).json({
            message: "User Deleted",
            user : doc
        })
    })
    
}


module.exports = {
    userSignup, userLogin, deleteUser, getAllUsers
}