
const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
      maxlength: 100,
    },
    course: {
      type: String,
      trim: true,
      default: "Not specified",
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1,
      max: 5,
    },
    comments: {
      type: String,
      required: [true, "Comments are required"],
      trim: true,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
