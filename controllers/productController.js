const { emptyFieldValidation } = require('../utils/validation')
const Product = require('../models/productModel')

const createProductController = async (req, res) => {
    const { title, price, category } = req.body
    emptyFieldValidation(res, title, price, category)

    // title exists ase naki
    let existingTitle = await Product.findOne({ title: title })
    if (existingTitle) {
        return res.send({
            success: false,
            message: "title already exist"
        })
    }

    let sku = `${Date.now()}-${new Date().getFullYear()}`

    // sku exists ase naki
    let existingSku = await Product.findOne({ sku: sku })
    if (existingSku) {
        return res.send({
            success: false,
            message: "sku already exist"
        })
    }

    let product = new Product({
        ...req.body,
        sku: sku
    })

    await product.save()

    res.json({
        success: true,
        message: "Product Created"
    })


}

// all product get

const getProductController = async (req, res) => {
    try {
        let product = await Product.find({})

        res.json({
            success: true,
            message: "All Product Data",
            product
        })
    } catch (error) {
        res.json({
            success: false,
            message: "Server Error"
        })
    }
}



// single product get

const getSingleProductController = async (req, res) => {
    try {
        const { id } = req.params

        const singleProduct = await Product.findOne({ _id: id })
        // let productData = await Product.findById(id) 

        res.json({
            success: true,
            message: `${singleProduct.title} data`,
            singleProduct
        })
    } catch (error) {
        res.json({
            success: false,
            message: "Server Error"
        })
    }
}




// product delete

const productDeleteController = async (req, res) => {
    try {
        const { id } = req.params

        await Product.findByIdAndDelete(id)

        res.json({
            success: true,
            message: "Product Deleted"
        })
    } catch (error) {
        res.json({
            success: false,
            message: "Server Error"
        })
    }
}




// product update

const productUpdateController = async (req, res) => {
    try {
        const { id } = req.params
        const productUpdate = await Product.findByIdAndUpdate({ _id: id }, req.body)

        res.json({
            success: true,
            message: "Product Updated"
        })
    } catch (error) {
        res.json({
            success: false,
            message: "Server Error"
        })
    }
}


module.exports = { createProductController, getProductController, getSingleProductController, productDeleteController, productUpdateController }