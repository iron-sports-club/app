const mongoose = require("mongoose");
const User = require("../models/User.model");
const Class = require("../models/Class.model");

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost/iron-sports-club";

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

const fakeUsers = [
{
    fullName : "Giulia Colombo",
    email: "giulia@test.com",
    password: "giulia",
    role: "Instructor",
    classes: []
},
{
    fullName : "Hadeel Gamal",
    email: "hadeel@test.com",
    password: "hadeel",
    role: "Instructor",
    classes: []
},
{
    fullName : "Jan Auer",
    email: "jan@test.com",
    password: "jan",
    role: "Student",
    classes: []
},
{
    fullName : "John Doe",
    email: "john@test.com",
    password: "john",
    role: "Student",
    classes: []
}
];

const fakeClasses = [
{


},
];
