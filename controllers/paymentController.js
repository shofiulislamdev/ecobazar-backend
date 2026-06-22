const axios = require('axios')
const Cart = require('../models/cartModel')
const Order = require('../models/orderModel')
const paymentController = async (req, res) => {
    const { userId, cus_name, cus_email, cus_add1, cus_add2, cus_city, cus_state, cus_postcode, cus_phone } = req.body
    try {

        const cart = await Cart.find({ user: userId }).populate('product')

        let totalPrice = 0

        let pro = []
        cart.map(item => {
            pro.push({
                title: item.product.title,
                price: item.product.price,
                discountPrice: item.product.discountPrice,
                sku: item.product.sku,
                stock: item.product.stock,
                category: item.product.category,
                tag: item.product.tag,
                status: item.product.status,
                images: item.product.images,
                quantity: item.quantity,
                totalPrice: item.totalPrice
            })

            totalPrice += item.totalPrice
        })
        // res.send({
        //     product: pro,
        //     totalPrice: totalPrice
        // })


        const response = await axios.post(
            'https://sandbox.aamarpay.com/jsonpost.php',
            {
                store_id: 'aamarpaytest',
                tran_id: Date.now(),
                success_url: 'http://www.merchantdomain.com/successpage.html',
                fail_url: 'http://www.merchantdomain.com/failedpage.html',
                cancel_url: 'http://www.merchantdomain.com/cancelpage.html',
                amount: totalPrice,
                currency: 'BDT',
                signature_key: 'dbb74894e82415a2f7ff0ec3a97e4183',
                desc: 'Merchant Registration Payment',
                cus_name: cus_name,
                cus_email: cus_email,
                cus_add1: cus_add1,
                cus_add2: cus_add2,
                cus_city: cus_city,
                cus_state: cus_state,
                cus_postcode: cus_postcode,
                cus_country: 'Bangladesh',
                cus_phone: cus_phone,
                type: 'json'
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );


        const order = new Order({
            user: userId,
            products: pro,
            totalPrice: totalPrice,
            tranid: "646565465485"
        })

        await order.save()

        res.json(response.data);

    } catch (error) {
        console.error("AamarPay Error:", error.response?.data || error.message);

        res.status(500).json({
            success: false,
            message: error.response?.data || error.message
        });
    }
};

module.exports = { paymentController }

