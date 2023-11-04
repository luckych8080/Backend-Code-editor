const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  testCases: [
    {
      input: String,
      output: String,
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
