import { Router } from "express";
import ProductManager from "../dao/FileSystem/productManager.js";
import productsModel from "../dao/models/products.model.js";

const router = Router()
const productManager = new ProductManager('./data/products.json')

router.get('/', async (req, res) => {
    const products = await productsModel.find().lean().exec()
    res.render('home', { products })
})

router.get('/realTimeProducts', async (req, res) =>{
    const products = await productsModel.find().lean().exec()
    res.render('realTimeProducts', { products })
})



export default router