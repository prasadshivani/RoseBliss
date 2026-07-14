const express = require("express");
const {
  postRegister,
  postLogin,
} = require("../controllers/authController");

const authRouter = express.Router();


authRouter.post("/register", postRegister);
authRouter.post("/login", postLogin);

module.exports = authRouter;
