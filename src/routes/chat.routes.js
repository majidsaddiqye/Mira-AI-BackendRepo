const express = require('express');
const {authUser} = require('../middlewares/auth.middleware')
const {createChat} = require('../controllers/chat.controller')
const router = express.Router();


//Routes
router.post('/',authUser,createChat)

module.exports= router