import { Router } from "express";
import { getProductsCartController, createCartController, getCartByIdController, createCartByIdController, deleteProductFromCartController, updateCartController, updateCartByIdController, deleteCartController } from "../controllers/cart.controller.js";

const router = Router()

export const getProductsFromCart = getProductsCartController;

router.post('/', createCartController)

router.get('/:cid', getCartByIdController)

router.post('/:cid/product/:pid', createCartByIdController )

router.delete('/:cid/product/:pid', deleteProductFromCartController)

router.put('/:cid', updateCartController)

router.put('/:cid/product/:pid', updateCartByIdController)

router.delete('/:cid', deleteCartController)

export default router


