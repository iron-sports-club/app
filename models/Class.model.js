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
        required: true
    },
    description: {
        type: String,
        required: true
    },
    //NEW STUFF FOR CLASS DETAIL PAGE
    location: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    neededEquipment: {
        type: String,
        required: true
    },
    //NEW STUFF FOR CLASS DETAIL PAGE

    owner: {type: Schema.Types.ObjectId, ref: "Instructor"},
    attendees: [{ type: Schema.Types.ObjectId, ref: "Student" }]
})

const Class = model("Class", classSchema)
module.exports = Class;