import { getProductsFromCart } from "../routers/cart.router.js";
import { getProducts } from "../routers/product.router.js";
import { port } from "../app.js";


export const getViewController = async (req, res) => {
    const result = await getProducts(req, res)
    if (result.statusCode === 200) {
        const totalPages = []
        let link
        for (let index = 1; index <= result.response.totalPages; index++) {
            if (!req.query.page) {
                link = `http://${req.hostname}:${port}${req.originalUrl}&page=${index}`
            } else {
                const modifiedUrl = req.originalUrl.replace(`page=${req.query.page}`, `page=${index}`)
                link = `http://${req.hostname}:${port}${modifiedUrl}`
            }
            totalPages.push({ page: index, link })
        }
        const user = req.session.user
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
}

export const realTimeProductsViewController = async (req, res) => {
    const result = await getProducts(req, res)
    if (result.statusCode === 200) {
        res.render('realTimeProducts', { products: result.response.payload })
    } else {
        res.status(result.statusCode).json({ status: 'error', error: result.response.error })
    }
}

export const getCidViewController = async(req, res) => {
    const result = await getProductsFromCart(req, res)
    if (result.statusCode === 200) {
        res.render('cart', { cart: result.response.payload })
    } else {
        res.status(result.statusCode).json({ status: 'error', error: result.response.error })
    }
}

export const getProfileViewController = (req, res) => {
    
    const user = req.session.user
    res.render('profile', { user });
}