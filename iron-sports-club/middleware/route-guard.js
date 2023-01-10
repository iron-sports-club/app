const Class = require("../models/Class.model");

//isLoggedin
const isLoggedIn = (req, res, next) => {
    if (req.session.currentUser) {
        next(); // execute the next action for this route
    }
    else {
        return res.redirect('/auth/login');
    }
  
};

//isLoggedOut
const isLoggedOut = (req, res, next) => {
    if (!req.session.currentUser) {
        next(); // execute the next action for this route
    }
    else{
        return res.redirect('/');
    }
   
  };

//isInstructor
const isInstructor = (req, res, next) => {
    if (req.session.currentUser.role === "Instructor") {
        next();
}
};

//isStudent
const isStudent = (req, res, next) => {
    if (req.session.currentUser.role === "Student") {
        next();
}
};


//isOwner > using this to display the "delete" button in the class page, for instructors that have created that class


// const isOwner = (req, res, next) => {
// //check if user is logged in, otherwise we'd get undefined params
//     if (req.session.currentUser) {
//         const {classId} = req.params; //is classId correct???
//         const {userId} = req.session.currentUser;
//         //get the class we want to delete
//         //check that the owner of the found class is equal to currentUser
//         //if it is -> next()
//         Class.findById(classId)
//             .then(class => {
//                 if (class.owner === userId) {
//                     next()
//                 }
//             })
//             .then( )              
//     }
// };
 
module.exports = {
    isLoggedIn,
    isLoggedOut,
    isInstructor,
    isStudent,
    isOwner
  };