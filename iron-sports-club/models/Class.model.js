const mongoose = require('mongoose');

const { Schema } = mongoose; 

const classSchema = new Schema ({
    className: {
        type: String,
        required: true,
        unique: true
    },
    duration: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true
    },
    timeOfDay: {
        type: String,
        required: true
    },
    defaultIcon: {
        type: String,
        default: "./public/images/default-cllass-icon.jpg.jpg"
    },
    description: {
        type: String
    },
    owner: {type: Schema.Types.ObjectId, ref: "Instructor"},
    attendees: [{ type: Schema.Types.ObjectId, ref: "Student" }]
})

const Class = model("Class", classSchema)

module.exports = Class