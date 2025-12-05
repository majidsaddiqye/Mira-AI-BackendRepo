const express = require("express");
const { registerUser, LoginUser, logoutUser } = require("../controllers/auth.controller");
const {authUser} = require('../middlewares/auth.middleware')
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", LoginUser);
router.get("/logout", logoutUser);

// Verify route - checks if user is authenticated
router.get("/verify", authUser, (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user
  });
});
module.exports = router;
