const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: [true, "Please add a task description"],
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    startDate: {
      type: String, // Stored as YYYY-MM-DD from your frontend
      default: "",
    },
    endDate: {
      type: String, // Stored as YYYY-MM-DD from your frontend
      default: "",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Low",
    },
    category: {
      type: String,
      default: "Work",
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // Automatically handles createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Todo", TodoSchema);