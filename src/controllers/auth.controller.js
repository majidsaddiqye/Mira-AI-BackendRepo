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

    const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token);

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



module.exports = { registerUser };
