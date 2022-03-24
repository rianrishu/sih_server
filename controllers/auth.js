const User = require("../models/user") // whatever the name we have exported from user.js the same name should be used here as the const variable name
const { check, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');



exports.signout = (req,res) => {
    res.clearCookie("token")
    res.json({
        message : "user signout successfully ",
    });
};


//protected routed
exports.isSignedIn = expressJwt({
    secret : "secret",
    userProperty : "auth",
    algorithms: ['HS256']
})
 

//custom middlewares

exports.isAuthenticated = (req,res,next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id
    if(!checker){
        return res.status(403).json({
            error : "ACCESS DENIED"
        })
    }
    next()
}

exports.isAdmin = (req,res,next) => {
    if(req.profile.role === 0){
        return res.status(403).json({
            error : "You are not ADMIN, Acess Denied"
        })
    }

    next()
}



exports.signup  = (req,res) => {

    // console.log(req.body)
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).json({
            error : errors.array()[0].msg
        })
    }
    const user = new User(req.body)
    // console.log(req.body)
    user.save((err,user) => {
        if(err){
            return res.status(400).json({
                err : "NOT able to save user in DB"
            })
        }
        res.json({
            name : user.name,
            email : user.email
        });
    })
}

exports.signin = (req,res) =>
{
    const errors = validationResult(req)
    const {email,password} = req.body; //Destructuring of the body
    console.log(email)
    console.log(password)
    if(!errors.isEmpty()){
        return res.status(422).json({
            error : errors.array()[0].msg
        });
    }
    
    User.findOne({email}, (err, user) => {  // findONe matches the verify first match on th DB
        if(err || !user){
            return res.status(400).json({
                error : "USER email doesn't exist"
            })
        }
   

        if(!user.authenticate(password)){
                return res.status(401).json({
                    error: "EMAIL AND PASSWORD donot match"
                })
        }
//CREATE TOKEN
    const token = jwt.sign({_id: user._id},process.env.SECRET)
   //PUT TOKEN IN COOKIE
   res.cookie("token",token,{expire : new Date() + 9999})

   //send response to frontEnd
   const {_id,name,email,role} = user
   return res.json({token, user: {_id,name,email,role} })
   
})
}