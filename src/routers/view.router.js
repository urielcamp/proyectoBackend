import { Router } from "express";
import ProductManager from "../dao/FileSystem/productManager.js";
import { getProductsFromCart } from "./cart.router.js";
import { getProducts } from "./product.router.js";
import { puerto } from "../app.js";
import { publicRoutes } from "../middlewares/auth.middleware.js";

const router = Router()
const productManager = new ProductManager('./data/products.json')

router.get('/', publicRoutes, async (req, res) => {
    const result = await getProducts(req, res)
    if (result.statusCode === 200) {
        const totalPages = []
        let link
        for (let index = 1; index <= result.response.totalPages; index++) {
            if (!req.query.page) {
                link = `http://${req.hostname}:${puerto}${req.originalUrl}&page=${index}`
            } else {
                const modifiedUrl = req.originalUrl.replace(`page=${req.query.page}`, `page=${index}`)
                link = `http://${req.hostname}:${puerto}${modifiedUrl}`
            }
            totalPages.push({ page: index, link })
        }
        res.render('home', { user, products: result.response.payload, paginateInfo: {
                hasPrevPage: result.response.hasPrevPage,
                hasNextPage: result.response.hasNextPage,
                prevLink: result.response.prevLink,
                nextLink: result.response.nextLink,
                totalPages
            }
        })
    } else {
        res.status(result.statusCode).json({ status: 'error', error: result.response.error })
    }
})

router.get('/realTimeProducts', publicRoutes, async (req, res) => {
    const result = await getProducts(req, res)
    if (result.statusCode === 200) {
        res.render('realTimeProducts', { products: result.response.payload })
    } else {
        res.status(result.statusCode).json({ status: 'error', error: result.response.error })
    }
})

router.get('/:cid', async(req, res) => {
    const result = await getProductsFromCart(req, res)
    if (result.statusCode === 200) {
        res.render('cart', { cart: result.response.payload })
    } else {
        res.status(result.statusCode).json({ status: 'error', error: result.response.error })
    }
})

export default router