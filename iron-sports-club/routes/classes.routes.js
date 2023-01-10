const express = require("express");
const router = express.Router();
const Class = require("../models/Class.model");

const {isStudent, isInstructor} = require("../middleware/route-guard");
const User = require("../models/User.model");

router.get("/classes/list", (req, res) => {
  Class.find()
    .then((classes) => {
      console.log("classes from DB: ", { classes });
      res.render("classes/list", { classes });
    })

    .catch((err) => console.log(err));
});

router.get("/classes/create-class", isInstructor,  (req, res, next) => {
  res.render("classes/create-class");
});

router.post("/classes/create-class", (req, res) => {
  const { className, duration, date, timeOfDay, description } = req.body;
/*   const {userId} = req.session.currentUser; */
  Class.create({ className, duration, date, timeOfDay, description })
    // .then(createdClass => {
    //   return User.findByIdAndUpdate(userId, { $push: {classes: createdClass._id}});
    // })
    .then(() => res.redirect("/classes/list"))
    .catch((err) => console.log(err));
});

router.get("/classes/:id/edit-class", isInstructor, (req, res, next) => {
  const { id } = req.params;
  console.log(req.params);
  Class.findById(id)
    .then((foundClass) => {
      res.render("classes/edit-class", foundClass);
    })
    .catch((err) => console.log(err));
});

router.post("/classes/:id/edit-class", (req, res) => {
  const { className, duration, date, timeOfDay, description } = req.body;
  const { id } = req.params;  
  console.log("Parameeters: ",req.params);
  Class.findByIdAndUpdate(id, { className, duration, date, timeOfDay, description })
    .then(() => res.redirect("/classes/list"))
    .catch((err) => console.log(err));
});


router.post('/classes/:id/delete', isInstructor, (req, res, next) => {
    const { id } = req.params;
  
    Class.findByIdAndDelete(id)
        .then(() => res.redirect('/classes/list'))
        .catch(err => console.log(err))
  });
module.exports = router;
