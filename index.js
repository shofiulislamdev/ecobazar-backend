require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const multer = require('multer')
const dbConfig = require('./config/dbConfig')
const { registrationController, loginController, forgotPasswordController, resetPasswordController, resendVerificationEmailController, verifyEmailController } = require('./controllers/authenticationController')
const { getAllUsersController, singleUserDataController, deleteUserController, updateUserController } = require('./controllers/userController')
const { createProductController, getProductController, getSingleProductController, productDeleteController, productUpdateController } = require('./controllers/productController')

const axios = require('axios')

// const { rateLimit } = require('express-rate-limit')
// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000,
//     limit: 3,
//     standardHeaders: 'draft-8',
//     legacyHeaders: false,
//     ipv6Subnet: 56,
// })
// app.use(limiter)



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/products');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + "-" + file.originalname);
    },
});

const upload = multer({ storage: storage });


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
app.post('/createproduct', upload.array('photos', 5), createProductController)

app.get('/allproduct', getProductController)
app.get('/singleproduct/:id', getSingleProductController)
app.delete('/deleteproduct/:id', productDeleteController)
app.post('/updateproduct/:id', upload.array('photos', 5), productUpdateController)

// Payment
app.post('/payment', async function (req, res) {

    const asd = req.body

    let data = await axios.post('https://sandbox.aamarpay.com/jsonpost.php',{
        store_id: "aamarpaytest",
        signature_key: "dbb74894e82415a2f7ff0ec3a97e4183",
        ...req.body,
        tran_id: Date.now(),
        currency: "BDT",
        success_url: "https://example.com/success.php",
        fail_url: "https://example.com/fail.php",
        cancel_url: "https://example.com/cancel.php",
        desc: "Lend Money",
        type: "json"
    })
    res.send(data.data)

})

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