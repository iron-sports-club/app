const bcrypt = require("bcrypt")
const express = require("express")
const router = express.Router()
const fileUploader = require('../config/cloudinary.config');
const User = require("../models/User.model")
const saltRounds = 10

const {isLoggedIn, isLoggedOut, isStudent, isInstructor} = require("../middleware/route-guard");


// GET Signup
router.get("/auth/signup", isLoggedOut, (req, res, next) => {
    res.render("auth/signup", {isLoggedOut: true})
})


// POST Signup
router.post("/auth/signup", fileUploader.single('instructor-cover-image'), async (req, res) => {
    const { fullName, email, password, role, aboutInstructor, startedInstructing} = req.body
    
    console.log("REQ.BODY ===>", req.body)
   console.log("REQ.FILE ===>", req.file)

   //Setting imageUrl to empty string if no image is given
const filePath = req.file !== undefined ? req.file.path : '';

    //unsuccessful Signup
    if (!fullName || !email || !password || !role) {
        res.render("auth/signup", { errorMessage: "You missed mandatory fields. Please provide your full name, email, password and role."})
        return
    }


    //successful Signup
    const passwordHash = await bcrypt.hash(password, saltRounds)


    User.create({ fullName, email, password: passwordHash, role, aboutInstructor, startedInstructing, imageUrl: filePath})
        .then((newUser) => {            
            req.session.currentUser = {fullName: newUser.fullName, role: newUser.role, classes: newUser.classes, _id: newUser._id, aboutInstructor: newUser.aboutInstructor, startedInstructing: newUser.startedInstructing, imageUrl: newUser.imageUrl}
            res.redirect("/auth/profile")
        })
        .catch(err => console.log(err))
})


// GET Login
router.get("/auth/login", isLoggedOut, (req, res, next) => {
    res.render("auth/login", {isLoggedOut: true})
})


// POST Login
router.post("/auth/login", (req, res) => {
    const { email, password } = req.body 

// Checking that both inputs are filled
    if (email === "" || password === "") {
        res.render("auth/login", {errorMessage: "You did not fill in your email and/or password. Please try again"})
        return
    }


//Trying to find User in DB
    User.findOne({email})
        .then (user => {
            console.log("USER ===>", user)
            
//If email is not matching in DB            
            if (!user) {
                res.render("auth/login", {errorMessage: "This email address is not registered. Please try again or sign up."})
                return

//If email and password match                
            } else if (bcrypt.compareSync(password, user.password))  {
                req.session.currentUser = {fullName: user.fullName, role: user.role, classes: user.classes, _id: user._id}
                res.redirect("/auth/profile")

//If email matches, but password does not                
            } else {
                res.render('auth/login', { errorMessage: 'Incorrect password.' });
            }

        })
            .catch(err => console.log(err))
})


router.get("/auth/profile", isLoggedIn, (req, res, next) => {
    const {fullName, role, classes} = req.session.currentUser
    console.log(req.session.currentUser.classes)
    if(req.session.currentUser.role === "Instructor"){


User.findOne({ fullName })
        .populate("classes")
        .then( foundUser => {
            console.log("user:", foundUser)
            console.log("user's classes:", foundUser.classes)
            res.render("auth/profile", {isInstructor: true, foundUser, isLoggedIn: true})
        })
        .catch(error => console.log(error))
} else {
    User.findOne({ fullName })
    .populate("classes")
    .then( foundUser => {
        console.log("user:", foundUser)
        res.render("auth/profile", {isInstructor: false, foundUser, isLoggedIn: true})
    })
    .catch(error => console.log(error))
}
    })


//POST Logout
router.post("/logout", isLoggedIn, (req, res, next) => {
    req.session.destroy(err => {
        if (err) console.log(err);
        res.redirect('/');
      });
})

module.exports = router;