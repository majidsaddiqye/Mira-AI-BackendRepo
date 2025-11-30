require('dotenv').config()
const app = require('./src/app')
const connectDB = require('./src/db/db')




// Connect Database
connectDB()

//Server Start
const PORT= process.env.PORT
app.listen(PORT,()=>{
    console.log(`Server is Listening on port ${PORT}`)
})