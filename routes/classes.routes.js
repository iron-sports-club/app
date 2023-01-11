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
  console.log("params from class details: ", id);
  if(req.session.currentUser.role === "Instructor"){
  Class.findById(id)
    .then((foundClass) => {
        console.log("Found class: ", foundClass);
        console.log("Owner of found class", foundClass.owner.toString());
        console.log("Current user id: ",req.session.currentUser._id);
        if (foundClass.owner.toString() === req.session.currentUser._id) {
          res.render("classes/class-details", {isInstructor: true, foundClass, isOwner: true});
        } else {
          res.render("classes/class-details", {isInstructor: true, foundClass});
        } 
      console.log("foundclass from class details: ", foundClass);
    })
    .catch((err) => console.log(err));
  }
  else { 
    Class.findById(id)
    .then((foundClass) => {

      User.findById(req.session.currentUser._id)
        .then((currentUser) => {

          console.log("FOUND CLASS ID ===>", foundClass._id.toString())
          console.log("CURRENT USER CLASSES INDEX 0 ===>", currentUser.classes[0])

        if(currentUser.classes.includes(foundClass._id.toString())) {
            res.render("classes/class-details", {isInstructor: false, foundClass, isBooked: true});

        } else {
            res.render("classes/class-details", {isInstructor: false, foundClass, isNotBooked: true});

        }
    })
    })
    .catch((err) => console.log(err));


  }
});

router.get("/classes/create-class", isInstructor,  (req, res, next) => {
  res.render("classes/create-class");
});

router.post("/classes/create-class", (req, res) => {
  const { className, duration, date, timeOfDay, description } = req.body;
  const ownerId = req.session.currentUser._id

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
    .then(() => res.redirect("/auth/profile"))
    .catch((err) => console.log(err));
});


router.post('/classes/:id/delete', isInstructor, (req, res, next) => {
    const { id } = req.params;

    Class.findById(id)
        .then((foundClass) => {
            User.findById(req.session.currentUser._id)
                .then((currentUser) => {
                    const classIndex= currentUser.classes.indexOf(foundClass._id)
                    currentUser.classes.splice(classIndex._id, 1)
                    currentUser.save()
                    
                })
            
            User.find(foundClass._id)
            .then((listOfAttendees) => {
              console.log("LIST OF USERS ===>", listOfAttendees)
              listOfAttendees.forEach((singleAttendee) => {
                User.findById(singleAttendee._id)
                  .then ((foundSingleAttendee) => {
                    classIndex= foundSingleAttendee.classes.indexOf(foundClass._id)
                    foundSingleAttendee.classes.splice(classIndex._id, 1)
                    foundSingleAttendee.save()
                  }) 
              })
            })

                .catch(err => console.log(err))
        })
        Class.findByIdAndDelete(id)
        .then(() => res.redirect('/auth/profile'))

  });

router.post("/classes/:id/book-class", isStudent, (req, res, next) => {
    const { id } = req.params
console.log("classId from book class: ", id);
Class.findById(id)
    .then((foundClass) => {
        foundClass.attendees.push(req.session.currentUser._id)
        foundClass.save()
        User.findById(req.session.currentUser._id)
            .then((currentUser) => {
                currentUser.classes.push(foundClass._id)
                currentUser.save()
            })
    })
    .then(res.redirect(`/classes/${id}/class-details`))
    .catch(err => console.log(err))
})

router.post("/classes/:id/cancel-class", isStudent, (req, res, next) => {

    const {id} = req.params

    Class.findById(id)
        .then((foundClass) => {
            const attendeeIndex = foundClass.attendees.indexOf(req.session.currentUser._id)
            console.log("ATTENDEE INDEX", attendeeIndex)
            foundClass.attendees.splice(attendeeIndex, 1)
            foundClass.save()
            
            User.findById(req.session.currentUser._id)
                .then((currentUser) => {
                    const classIndex= currentUser.classes.indexOf(foundClass._id)
                    currentUser.classes.splice(classIndex._id, 1)
                    currentUser.save()
                })
        })
        .then(res.redirect(`/classes/${id}/class-details`))
    .catch(err => console.log(err))
})

module.exports = router;