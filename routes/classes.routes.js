const express = require("express");
const router = express.Router();
const Class = require("../models/Class.model");
const User = require("../models/User.model");
const fileUploader = require('../config/cloudinary.config');



const {isStudent, isInstructor} = require("../middleware/route-guard");

router.get("/classes/list", (req, res) => {

  Class.find()
    .then((classes) => {
      console.log("classes from DB: ", { classes });

      if(req.session.currentUser){


      res.render("classes/list", { classes , isLoggedIn:true});
    } else {
      res.render("classes/list", { classes, isLoggedOut:true});
    }
    })

    .catch((err) => console.log(err));
});

router.get("/classes/:id/class-details", (req, res, next) => {
  const { id } = req.params;
  console.log("params from class details: ", id);
  if(req.session.currentUser.role === "Instructor"){
  Class.findById(id)
    .then((foundClass) => {

        User.findById(req.session.currentUser._id)
        .then((foundClassInstructor) => {

        if (foundClass.owner.toString() === req.session.currentUser._id) {
          res.render("classes/class-details", {isInstructor: true, foundClass, isOwner: true, foundClassInstructor, isLoggedIn:true});
        } else {
          res.render("classes/class-details", {isInstructor: true, foundClass, foundClassInstructor, isLoggedIn:true});
        } 
    })
  })
    .catch((err) => console.log(err));
  }
  else { 
    Class.findById(id)
    .then((foundClass) => {

      User.findById(req.session.currentUser._id)
        .then((currentUser) => {
          console.log("FOUNDCLASS OWNER ===>", foundClass.owner.toString())

          User.findById(foundClass.owner.toString())
            .then((foundClassInstructor) => {
            if(currentUser.classes.includes(foundClass._id.toString())) {
                res.render("classes/class-details", {isInstructor: false, foundClass, isBooked: true, foundClassInstructor, isLoggedIn:true});
    
            } else {
                res.render("classes/class-details", {isInstructor: false, foundClass, isNotBooked: true, foundClassInstructor, isLoggedIn:true});
    
            }
            })
    })
    })
    .catch((err) => console.log(err));


  }
});

router.get("/classes/create-class", isInstructor,  (req, res, next) => {
  res.render("classes/create-class", {isLoggedIn:true} );
});

router.post("/classes/create-class", fileUploader.single('class-cover-image'), (req, res) => {
  const { className, duration, date, timeOfDay, description, location, price, neededEquipment} = req.body;
  const ownerId = req.session.currentUser._id
  

Class.create({ className, duration, date, timeOfDay, description, owner: ownerId, image: req.file.path, location, price, neededEquipment}) 
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
  Class.findById(id)
    .then((foundClass) => {
      res.render("classes/edit-class", foundClass);
    })
    .catch((err) => console.log(err));
});

router.post("/classes/:id/edit-class", (req, res) => {
  const { className, duration, date, timeOfDay, description } = req.body;
  const { id } = req.params;  
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