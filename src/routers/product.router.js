import { Router } from "express";
import ProductManager from "../dao/FileSystem/productManager.js";
import productModel from '../dao/models/products.model.js';
import { puerto } from "../app.js";

const router = Router();
const productManager = new ProductManager("./data/products.json");

export const getProducts = async (req, res) => {
    try {
        const limit = req.query.limit || 5;
        const page = req.query.page || 1;
        const filterOptions = {};
        if (req.query.stock) filterOptions.stock = req.query.stock;
        if (req.query.category) filterOptions.category = req.query.category;
        const paginateOptions = { lean: true, limit, page };
        if (req.query.sort === 'asc') paginateOptions.sort = { price: 1 };
        if (req.query.sort === 'desc') paginateOptions.sort = { price: -1 };
        const result = await productModel.paginate(filterOptions, paginateOptions);

        // Genera los enlaces de paginación
        const baseUrl = `http://${req.hostname}:${puerto}${req.baseUrl}`;
        const totalPages = result.totalPages;
        const currentPage = result.page;
        const prevLink = currentPage > 1 ? `${baseUrl}?page=${currentPage - 1}` : null;
        const nextLink = currentPage < totalPages ? `${baseUrl}?page=${currentPage + 1}` : null;

        return {
            statusCode: 200,
            response: { 
                status: 'success', 
                payload: result.docs,
                totalPages,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                page: currentPage,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink,
                nextLink
            }
        }
    } catch(err) {
        return {
            statusCode: 500,
            response: { status: 'error', error: err.message }
        }
    }
}




router.get('/', async (req, res) => {
    const result = await getProducts(req, res)
    res.status(result.statusCode).json(result.response)
})

router.get('/:pid', async (req, res) => {
    try {
        const id = req.params.pid
        const result = await productModel.findById(id).lean().exec()
        if (result === null) {
            return res.status(404).json({ status: 'error', error: 'Not found' })
        }
        res.status(200).json({ status: 'success', payload: result })
    } catch(err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
})

router.post('/', async (req, res) => {
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

router.put('/:pid', async (req, res) => {
    try {
        const id = req.params.pid
        const data = req.body
        const result = await productModel.findByIdAndUpdate(id, data, { returnDocument: 'after' })
        if (result === null) {
            return res.status(404).json({ status: 'error', error: 'Not found' })
        }
        const products = await productModel.find().lean().exec()
        req.io.emit('updatedProducts', products)
        res.status(200).json({ status: 'success', payload: result })
    } catch(err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
})

router.delete('/:pid', async (req, res) => {
    try {
        const id = req.params.pid
        const result = await productModel.findByIdAndDelete(id)
        if (result === null) {
            return res.status(404).json({ status: 'error', error: 'Not found' })
        }
        const products = await productModel.find().lean().exec()
        req.io.emit('updatedProducts', products)
        res.status(200).json({ status: 'success', payload: products })
    } catch(err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
})

export default router