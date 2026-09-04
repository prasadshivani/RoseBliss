const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Register
const postRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // ✅ Password ko hash karo save karne se pehle
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({
      message: "User Registered Successfully ✅",
    });
  } catch (error) {
    console.error("REGISTER ERROR =>", error);
    res.status(500).json({
      message: "Server Error ❌",
    });
  }
};

// Login
const postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // ✅ Hashed password se compare karo
    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      message: "Login Successful ✅",
      token,
      user: {
        _id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        
        role: existingUser.role,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR =>", error);
    res.status(500).json({
      message: "Server Error ❌",
    });
  }
};

const clerkAdminLogin = async (req, res) => {
  try {
    const { email, name } = req.body;

    console.log("========== CLERK ADMIN LOGIN ==========");
    console.log("EMAIL RECEIVED FROM CLERK =>", email);
    console.log("NAME RECEIVED FROM CLERK =>", name);

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    // Email ko clean + lowercase karo
    const normalizedEmail = email.trim().toLowerCase();

    console.log(
      "NORMALIZED EMAIL =>",
      normalizedEmail
    );

    // MongoDB me normalized email se user find karo
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    console.log(
      "USER FOUND IN MONGODB =>",
      existingUser
    );

    if (!existingUser) {
      return res.status(404).json({
        message: "Admin user not found in database",
      });
    }

    // Admin check
    if (existingUser.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Admin only.",
      });
    }

    // JWT generate
    const token = jwt.sign(
      {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    console.log("ADMIN LOGIN SUCCESS ✅");

    return res.status(200).json({
      message: "Admin login successful",
      token,
      user: {
        _id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
      },
    });

  } catch (error) {
    console.error(
      "CLERK ADMIN LOGIN ERROR =>",
      error
    );

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  postRegister,
  postLogin,
  clerkAdminLogin,
};