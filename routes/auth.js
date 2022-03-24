var express = require('express')
var router = express.Router();
const User = require("../models/user")
const { check } = require('express-validator');
const {signout , signup ,signin,isSignedIn } = require("../controllers/auth")

// router.get('/', (req, res) => {
//     console.log(User.find({"name" : "rishu"}))
// })

// router.get('/', (req,res) => {
//     User.find().then((name) =>{
//         res.send(JSON.stringify(name));
//     }) //where req.session.user is an id (the logged in user's object id or _id)
// })

router.post("/signup", signup)

router.post(
    "/signin", signin
)


router.get("/signout", signout )
router.get("/signin", signin )
router.get("/testroute", isSignedIn, (req,res) => {
    res.send(req.auth)
})

module.exports = router; 