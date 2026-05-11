require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const dbConfig = require('./config/dbConfig')
const { registrationController, loginController, forgotPasswordController, resetPasswordController, resendVerificationEmailController, verifyEmailController } = require('./controllers/authenticationController')
const { getAllUsersController, singleUserDataController, deleteUserController, updateUserController } = require('./controllers/userController')

// const { rateLimit } = require('express-rate-limit')
// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000,
//     limit: 3,
//     standardHeaders: 'draft-8',
//     legacyHeaders: false,
//     ipv6Subnet: 56,
// })
// app.use(limiter)




// Middleware
app.use(express.json())
app.use(cors())

// Database config
dbConfig()

app.post('/registration', registrationController)
app.post('/login', loginController)
app.post('/forgotpassword', forgotPasswordController)
app.post('/resetpassword/:token', resetPasswordController)
app.post('/resendverificationemail', resendVerificationEmailController)
app.post('/verifyemail/:token', verifyEmailController)

//Product Create

// Order Management

// user management
app.get('/allusers', getAllUsersController)
app.get('/singleuser/:id', singleUserDataController)
app.delete('/deleteuser/:id', deleteUserController)
app.post('/update/:id', updateUserController)

let port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})