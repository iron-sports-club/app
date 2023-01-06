const { Schema, model, default: mongoose } = require("mongoose");

const studentSchema = new Schema(
    {
      fullName: {
        type: String,
        trim: true,
        required: false,
        unique: true
      },
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
      },
      password: {
        type: String,
        required: true
      },
      bookedClasses: [{ type: Schema.Types.ObjectId, ref: "Class" }]
    },
    {
      // this second object adds extra properties: `createdAt` and `updatedAt`
      timestamps: true
    }
  );
  const Student = model("Student", studentSchema);
  module.exports = Student;
  
  
  
  
  
  
  
  