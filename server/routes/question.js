const express = require("express");

const {
  authenticateToken,
  authenticateRole,
} = require("../middleware/authMiddleware");

const {
  getQuestions,
  addQuestion,
  getQuestion,
  updateQuestion,
  deleteQuestion,
  addTestcase,
  submitSolution,
} = require("../controllers/questions");

const router = express.Router();

router
  .get("/", authenticateToken, getQuestions)
  .post("/", authenticateRole("admin"), addQuestion)
  .get("/:id", authenticateToken, getQuestion)
  .put("/:id", authenticateRole("admin"), updateQuestion)
  .delete("/:id", authenticateRole("admin"), deleteQuestion)
  .post("/:id", authenticateRole("admin"), addTestcase)
  .post("/solution/:id", authenticateToken, submitSolution);

module.exports = router;