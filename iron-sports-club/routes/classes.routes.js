const express = require("express");
const router = express.Router();
const Class = require("../models/Class.model");
const User = require("../models/User.model");


const {isStudent, isInstructor} = require("../middleware/route-guard");

router.get("/classes/list", (req, res) => {
  Class.find()
    .then((classes) => {
      console.log("classes from DB: ", { classes });
      res.render("classes/list", { classes });
    })

    .catch((err) => console.log(err));
});

router.get("/classes/:id/class-details", (req, res, next) => {
  const { id } = req.params;
  console.log(req.params);
  if(req.session.currentUser.role === "Instructor"){
  Class.findById(id)
    .then((foundClass) => {
      res.render("classes/class-details", {isInstructor: true, foundClass});
      console.log("foundclass from class details: ", foundClass);
    })
    .catch((err) => console.log(err));
  }
  else {
    res.render("classes/class-details", {isInstructor: false, foundClass});

  }
});

router.get("/classes/create-class", isInstructor,  (req, res, next) => {
  res.render("classes/create-class");
});

router.post("/classes/create-class", (req, res) => {
  const { className, duration, date, timeOfDay, description } = req.body;
  const ownerId = req.session.currentUser._id
//   Class.create({ className, duration, date, timeOfDay, description, owner: ownerId }) 
//   .then(createdClass => {
//     return User.findByIdAndUpdate(req.session.currentUser._id, { $push: {classes: createdClass._id}}); // 
//     })
//     .then(() => res.redirect("/classes/list"))
//     .catch((err) => console.log(err));

Class.create({ className, duration, date, timeOfDay, description, owner: ownerId }) 
.then(newClass => {
    User.findById(ownerId)
    .then(classInstructor => {
        classInstructor.classes.push(newClass._id)
        classInstructor.save()
    })
    .catch(err => console.log(err))
})
.then(() => res.redirect("/classes/list"))
        .catch(err => console.log(err));
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

    Class.findById(id)
        .then((foundClass) => {
            const classIndex = req.session.currentUser.classes.indexOf(foundclass._id)
            req.session.currentUser.classes.splice(classIndex, 1)
        })
  
    Class.findByIdAndDelete(id)
        .then(() => res.redirect('/classes/list'))
        .catch(err => console.log(err))
  });

router.get("/classes/:id/book-class", isStudent, (req, res, next) => {
    const classId = req.params

Class.findById(classId)
    .then((foundClass) => {
        foundClass.attendees.push(req.session.currentUser._id)
        foundClass.save()
        req.session.currentUser.classes.push(foundClass._id)
    })
    .then(res.redirect(`/classes/${classId}`))
    .catch(err => console.log(err))
})

router.get("/classes/:id/cancel-class", isStudent, (req, res, next) => {

    classId = req.params

    Class.findById(classId)
        .then((foundClass) => {
            const attendeeIndex = foundClass.attendees.indexOf(req.session.currentUser._id)
            foundClass.attendees.splice(attendeeIndex, 1)
            
            const bookedClassIndex = req.session.currentUser.classes.indexOf(foundClass._id)
            req.session.currentUser.classes.splice(bookedClassIndex, 1)
        })
        .then(res.redirect(`/classes/${classId}`))
    .catch(err => console.log(err))
})

module.exports = router;
