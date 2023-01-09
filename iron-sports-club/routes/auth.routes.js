const bcrypt = require("bcrypt")
const express = require("express")
const router = express.Router()

const User = require("../models/User.model")
const saltRounds = 10


// GET Signup
router.get("/auth/signup", (req, res) => {
    res.render("auth/signup")
})


// POST Signup
router.post("/auth/signup", async (req, res) => {
    const { fullName, email, password, role } = req.body
    console.log("REQ.BODY ===>", req.body)

    //unsuccessful Signup
    if (!fullName || !email || !password || !role) {
        res.render("auth/signup", { errorMessage: "All fields have to be filled. Please provide your full name, email, password and role."})
        return
    }

    //successful Signup
    const passwordHash = await bcrypt.hash(password, saltRounds)

    User.create({ fullName, email, password: passwordHash, role })
        .then((newUser) => {            
            req.session.currentUser = {fullName: newUser.fullName, role: newUser.role, classes: newUser.classes}
            res.redirect("/auth/profile")
        })
        .catch(err => console.log(err))
})


// GET Login
router.get("/auth/login", (req, res) => {
    res.render("auth/login")
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
                req.session.currentUser = {fullName: user.fullName, role: user.role, classes: user.classes}
                res.redirect("/auth/profile")

//If email matches, but password does not                
            } else {
                res.render('auth/login', { errorMessage: 'Incorrect password.' });
            }

        })
            .catch(err => console.log(err))
})


// GET Profile
router.get("/auth/profile", (req, res) => {
    // const { currentUser } = req.session
    console.log("CURRENT USER ===>", req.session.currentUser)
    res.render("auth/profile", req.session.currentUser)
})


//POST Logout
router.post("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) console.log(err);
        res.redirect('/');
      });
})

module.exports = router;