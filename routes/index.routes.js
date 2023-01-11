const express = require('express');
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {

  if(req.session.currentUser){
  res.render("index", {isLoggedIn: true})
} else {
  res.render("index", {isLoggedOut: true})
}
});

module.exports = router;
