
const express = require("express");
const Feedback = require("../models/Feedback");

const router = express.Router();

// GET: Fetch all feedback
router.get("/", async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 });

    res.status(200).json(feedback);
  } catch (error) {
    console.error("Error fetching feedback:", error.message);
    res.status(500).json({ message: "Failed to fetch feedback" });
  }
});
n
// POST: Save new feedback
router.post("/", async (req, res) => {
  try {
    const { studentName, course, rating, comments } = req.body;

    if (
      !studentName?.trim() ||
      !comments?.trim() ||
      rating === undefined ||
      rating === null ||
      rating === ""
    ) {
      return res.status(400).json({
        message: "Name, rating, and comments are required",
      });
    }

    const numericRating = Number(rating);

    if (
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        message: "Rating must be an integer between 1 and 5",
      });
    }

    const newFeedback = await Feedback.create({
      studentName,
      course,
      rating: numericRating,
      comments,
    });

    res.status(201).json({
      message: "Feedback submitted successfully",
      feedback: newFeedback,
    });
  } catch (error) {
    console.error("Error saving feedback:", error.message);

    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: "Failed to save feedback" });
  }
});

module.exports = router;
