const express = require("express");
const { LogIn, SignUp } = require("../controllers/user");
const router = express.Router();

router.post("/login", LogIn).post("/signup", SignUp);

module.exports = router;
