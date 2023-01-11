const { Schema, model, default: mongoose } = require("mongoose");

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
    image: {
        type: String,
    },
    description: {
        type: String
    },
    owner: {type: Schema.Types.ObjectId, ref: "Instructor"},
    attendees: [{ type: Schema.Types.ObjectId, ref: "Student" }]
})

const Class = model("Class", classSchema)
module.exports = Class;