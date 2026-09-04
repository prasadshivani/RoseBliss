const express = require("express");

const {
  postRegister,
  postLogin,
  clerkAdminLogin,
} = require("../controllers/authController");

const {
  validateRegister,
  validateLogin,
} = require("../middleware/validationMiddleware");

const authRouter = express.Router();

authRouter.post("/register", validateRegister, postRegister);
authRouter.post("/login", validateLogin, postLogin);
authRouter.post("/clerk-admin-login", clerkAdminLogin);

module.exports = authRouter;