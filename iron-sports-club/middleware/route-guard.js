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

module.exports = {
    isLoggedIn,
    isLoggedOut,
    isInstructor,
    isStudent
  };