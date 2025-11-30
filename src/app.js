const express = require('express');
const authRoutes = require('./routes/auth.routes')
const chatRoutes = require('./routes/chat.routes')
const cookieParser = require("cookie-parser");

//App Level Moddlewares
const app = express();
app.use(express.json());
app.use(cookieParser());

//Routes
app.use('/api/auth',authRoutes)
app.use('/api/chat',chatRoutes)




module.exports = app