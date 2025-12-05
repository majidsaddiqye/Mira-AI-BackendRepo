const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");

//RegisterUser Controller
async function registerUser(req, res) {
  try {
    const {
      fullname: { firstName, lastName },
      email,
      password,
    } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).send({ message: "All fields are required" });
    }

    const isUserAlreadyExist = await userModel.findOne({ email });
    if (isUserAlreadyExist) {
      return res.status(400).send({ message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      fullName: { firstName, lastName },
      email,
      password: hashPassword,
    });

    // const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET, {
    //   expiresIn: "7d",
    // });

    // res.cookie("token", token);

    return res.status(201).send({
      message: "User Registered successfully",
      user: {
        email: user.email,
        id: user._id,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    console.log(error);
  }
}

// LoginUser Controller
async function LoginUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
      return res.status(400).send({ message: "All fields are required" });
    }

  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(401).send({ message: "Invalid email or password" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).send({ message: "Invalid password" });
  }

  const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token);

  return res.status(201).send({
    message: "Login successfully",
    user: {
      email: user.email,
      id: user._id,
      fullName: user.fullName,
    },
  });
}

//Logout User Controller
async function logoutUser(req,res){
   res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  return res.status(200).json({
    message: "Logged out successfully",
  });
}

module.exports = { registerUser, LoginUser, logoutUser };
