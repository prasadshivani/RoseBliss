const express = require("express");

const {
  postRegister,
  postLogin,
} = require("../controllers/authController");

const {
  validateRegister,
  validateLogin,
} = require("../middleware/validationMiddleware");

const authRouter = express.Router();

authRouter.post("/register", validateRegister, postRegister);
authRouter.post("/login", validateLogin, postLogin);

module.exports = authRouter;