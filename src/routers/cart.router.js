import { Router } from "express";
import {CartManager} from "../dao/FileSystem/cartManager.js"
import cartModel from "../dao/models/cart.model.js";
import productModel from "../dao/models/products.model.js";

const router = Router()
const cartManager = new CartManager("./data/carts.json")

export const getProductsFromCart = async (req, res) => {
    try {
        const id = req.params.cid
        const result = await cartModel.findById(id).populate('products.product').lean()
        if (result === null) {
            return {
                statusCode: 404,
                response: { status: 'error', error: 'Not found' }
            }
        }
        return {
            statusCode: 200,
            response: { status: 'success', payload: result }
        }
    } catch(err) {
        return {
            statusCode: 500,
            response: { status: 'error', error: err.message }
        }
    }
}

router.post('/', async (req, res) => {
    try {
        const result = await cartModel.create({})
        res.status(201).json({ status: 'success', payload: result })
    } catch(err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
})

router.get('/:cid', async (req, res) => {
    const result = await getProductsFromCart(req, res)
    res.status(result.statusCode).json(result.response)
})

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cid = req.params.cid
        const pid = req.params.pid
        const cartToUpdate = await cartModel.findById(cid)
        if (cartToUpdate === null) {
            return res.status(404).json({ status: 'error', error: `Cart with id=${cid} Not found` })
        }
        const productToAdd = await productModel.findById(pid)
        if (productToAdd === null) {
            return res.status(404).json({ status: 'error', error: `Product with id=${pid} Not found` })
        }
        const productIndex = cartToUpdate.products.findIndex(item => item.product == pid)
        if ( productIndex > -1) {
            cartToUpdate.products[productIndex].quantity += 1
        } else {
            cartToUpdate.products.push({ product: pid, quantity: 1 })
        }
        const result = await cartModel.findByIdAndUpdate(cid, cartToUpdate, { returnDocument: 'after' })
        res.status(201).json({ status: 'success', payload: result })
    } catch(err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
})

router.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const cid = req.params.cid
        const pid = req.params.pid
        const cartToUpdate = await cartModel.findById(cid)
        if (cartToUpdate === null) {
            return res.status(404).json({ status: 'error', error: `El carrito con el id=${cid} no esta` })
        }
        const productToDelete = await productModel.findById(pid)
        if (productToDelete === null) {
            return res.status(404).json({ status: 'error', error: `El producto con el id=${pid} no esta` })
        }
        const productIndex = cartToUpdate.products.findIndex(item => item.product == pid)
        if ( productIndex === -1) {
            return res.status(400).json({ status: 'error', error: `El producto con el id=${pid} no esta en el carrito con id=${cid}` })
        } else {
            cartToUpdate.products = cartToUpdate.products.filter(item => item.product.toString() !== pid)
        }
        const result = await cartModel.findByIdAndUpdate(cid, cartToUpdate, { returnDocument: 'after' })
        res.status(200).json({ status: 'success', payload: result })
    } catch(err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
})

router.put('/:cid', async (req, res) => {
    try {
        const cid = req.params.cid
        const cartToUpdate = await cartModel.findById(cid)
        if (cartToUpdate === null) {
            return res.status(404).json({ status: 'error', error: `Cart with id=${cid} Not found` })
        }
        const products = req.body.products
        
        if (!products) {
            return res.status(400).json({ status: 'error', error: 'Field "products" is not optional' })
        }
        for (let index = 0; index < products.length; index++) {
            if (!products[index].hasOwnProperty('product') || !products[index].hasOwnProperty('quantity')) {
                return res.status(400).json({ status: 'error', error: 'product must have a valid id and a valid quantity' })
            }
            if (typeof products[index].quantity !== 'number') {
                return res.status(400).json({ status: 'error', error: 'product\'s quantity must be a number' })
            }
            if (products[index].quantity === 0) {
                return res.status(400).json({ status: 'error', error: 'product\'s quantity cannot be 0' })
            }
            const productToAdd = await productModel.findById(products[index].product)
            if (productToAdd === null) {
                return res.status(400).json({ status: 'error', error: `Product with id=${products[index].product} doesnot exist. We cannot add this product to the cart with id=${cid}` })
            }
        }
        
        cartToUpdate.products = products
        const result = await cartModel.findByIdAndUpdate(cid, cartToUpdate, { returnDocument: 'after' })
        res.status(200).json({ status: 'success', payload: result })
    } catch(err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
})

router.put('/:cid/product/:pid', async (req, res) => {
    try {
        const cid = req.params.cid
        const pid = req.params.pid
        const cartToUpdate = await cartModel.findById(cid)
        if (cartToUpdate === null) {
            return res.status(404).json({ status: 'error', error: `Cart with id=${cid} Not found` })
        }
        const productToUpdate = await productModel.findById(pid)
        if (productToUpdate === null) {
            return res.status(404).json({ status: 'error', error: `Product with id=${pid} Not found` })
        }
        const quantity = req.body.quantity
        //start: validaciones de quantity enviado por body
        if (!quantity) {
            return res.status(400).json({ status: 'error', error: 'Field "quantity" is not optional' })
        }
        if (typeof quantity !== 'number') {
            return res.status(400).json({ status: 'error', error: 'product\'s quantity must be a number' })
        }
        if (quantity === 0) {
            return res.status(400).json({ status: 'error', error: 'product\'s quantity cannot be 0' })
        }
        const productIndex = cartToUpdate.products.findIndex(item => item.product == pid)
        if ( productIndex === -1) {
            return res.status(400).json({ status: 'error', error: `Product with id=${pid} Not found in Cart with id=${cid}` })
        } else {
            cartToUpdate.products[productIndex].quantity = quantity
        }
        //end: validaciones de quantity enviado por body
        const result = await cartModel.findByIdAndUpdate(cid, cartToUpdate, { returnDocument: 'after' })
        res.status(200).json({ status: 'success', payload: result })
    } catch(err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
})

router.delete('/:cid', async (req, res) => {
    try {
        const cid = req.params.cid
        const cartToUpdate = await cartModel.findById(cid)
        if (cartToUpdate === null) {
            return res.status(404).json({ status: 'error', error: `Cart with id=${cid} Not found` })
        }
        cartToUpdate.products = []
        const result = await cartModel.findByIdAndUpdate(cid, cartToUpdate, { returnDocument: 'after' })
        res.status(200).json({ status: 'success', payload: result })
    } catch(err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
})

export default router