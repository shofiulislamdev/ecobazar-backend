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

let getAllProductsController = async (req, res) => {
    let productData = await Product.find({})
    res.send({
        message: "All Product Data",
        productData
    })
}

// single product get
let singleProductDataController = async (req, res) => {
    let { id } = req.params
    let productData = await Product.findById(id)
    res.send({
        message: `${productData.title} data`,
        productData
    })
}

// product delete
let deleteProductController = async (req, res) => {
    let { id } = req.params
    let productData = await Product.findByIdAndDelete(id)
    res.send({
        message: "Product Deleted"
    })
}

// product update
let updateProductController = async (req, res) => {
    let { id } = req.params
    let productData = await Product.findByIdAndUpdate({ _id: id }, req.body, { new: true })
    res.send({
        message: "Product Updated"
    })
}

module.exports = { createProductController, getAllProductsController, singleProductDataController, deleteProductController, updateProductController }