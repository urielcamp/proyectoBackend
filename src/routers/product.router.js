import { Router } from "express";
import ProductManager from "../dao/FileSystem/productManager.js";
import productModel from '../dao/models/products.model.js'



const router = Router()


const productManager = new ProductManager("./data/products.json")


router.get("/", async (req, res) => {
    const result = await productModel.find()
    const limit = req.query.limit
    if (typeof result === "string"){
        const error = result.split(" ")
        return res.status(parseInt(error[0].slice(1,4))).json({ error: result.slice(6)})

    }
    res.status(200).json({status: "success", payload: result.slice(0, limit)})

})

router.get("/:pid", async (req, res) => {
    const id = parseInt(req.params.pid)
    const result = await productManager.getProductsById(id)
    if(typeof result === "string") {
        const error = result.split(" ")
        return res.status(parseInt(error[0].slice(1,4))).json({ error: result.slice(6)})

    }
    res.status(200).json({status: "success", payload: result})
})

router.post("/",  async (req, res) => {
    try {
        const product = req.body
        const result = await productModel.create(product)
        const products = await productModel.find().lean().exec()
        req.io.emit('updatedProducts', products)
        res.status(201).json({ status: 'success', payload: result })
    } catch(err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
})

router.put("/:pid", async (req, res) => {
    const id = parseInt(req.params.pid)
    const data = req.body
    const result = await productManager.updateProduct(id, data)
    if(typeof result === "string") {
        const error = result.split( " ")
        return res.status(parseInt(error[0].slice(1,4))).json({ error: result.slice(6)})

    }
    res.status(200).json({ status: "success", payload: result})
})

router.delete("/:pid", async (req, res) => {
    const id = parseInt(req.params.pid)
    const data = req.body
    const result = await productManager.deleteProduct(id, data)
    if(typeof result === "string") {
        const error = result.split( " ")
        return res.status(parseInt(error[0].slice(1,4))).json({ error: result.slice(6)})

    }
    res.status(201).json({ status: "success", payload: result})
})

export default router

