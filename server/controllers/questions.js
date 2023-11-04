require("dotenv").config();
const Question = require("../models/Question");
const axios = require("axios");

// Get all Questions
const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.status(200).json({ questions });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Add a Question
const addQuestion = async (req, res) => {
  try {
    const body = req.body;

    const question = new Question({
      title: body.title,
      description: body.description,
      testCases: body.testCases,
      createdBy: req.user.userId,
    });

    const newQuestion = await question.save();
    const allQuestions = await Question.find();

    res.status(201).json({
      message: "Question added",
      question: newQuestion,
      questions: allQuestions,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get a Question
const getQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    res.status(200).json({ question });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update a Question
const updateQuestion = async (req, res) => {
  try {
    const {
      params: { id },
      body,
    } = req;

    const updateQuestion = await Question.findByIdAndUpdate({ _id: id }, body);
    const allQuestions = await Question.find();

    res.status(201).json({
      message: "Question Updated",
      question: updateQuestion,
      questions: allQuestions,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a Question
const deleteQuestion = async (req, res) => {
  try {
    const deleteQuestion = await Question.findByIdAndRemove(req.params.id);

    const allQuestions = await Question.find();

    res.status(200).json({
      message: "Question deleted",
      question: deleteQuestion,
      questions: allQuestions,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Add Test case to a Question
const addTestcase = async (req, res) => {
  try {
    const {
      params: { id },
    } = req;
    const { input, output } = req.body;

    const question = await Question.findByIdAndUpdate(id);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    question.testCases.push({ input, output });
    const addtestcase = await question.save();

    const allQuestions = await Question.find();

    res.status(201).json({
      message: "Test case added",
      question: addtestcase,
      questions: allQuestions,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Submit a solution
const submitSolution = async (req, res) => {
  try {
    const { code, input, lang } = req.body;

    const question = await Question.findById(req.params.id);
    console.log(question)

    let url = "https://api.jdoodle.com/v1/execute";
    let config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    let output;
    let program = {
      script: code,
      language: lang,
      stdin: input,
      versionIndex: "0",
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET
    };

    try {
      await axios
        .post(url, program, config)
        .then((response) => {
          output = response.data;
        })
        .catch((err) => {
          console.log("error in app.js axios ", err);
        });
    } catch (err) {
      res.json({ message: "error" });
    }

    res.json({ message: "Success", question, output });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getQuestions,
  addQuestion,
  getQuestion,
  updateQuestion,
  deleteQuestion,
  addTestcase,
  submitSolution,
};
