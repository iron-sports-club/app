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

    User.create({ fullName, email, password, role })
        .then(newUser => res.redirect("/auth/profile", newUser)) //sending info of newUser
        .catch(err => console.log(err))
})

module.exports = router;