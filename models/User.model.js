const { Schema, model, default: mongoose } = require("mongoose");

const userSchema = new Schema(
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
      role: {
        type: String,
        required: true,
        enum: ["Instructor", "Student"]
      },

      classes: [{ type: Schema.Types.ObjectId, ref: "Class" }]
    },
    {
      // this second object adds extra properties: `createdAt` and `updatedAt`
      timestamps: true
    }
  );
  const User = model("User", userSchema);
  module.exports = User;
  
  
  
  
  
  
  
  