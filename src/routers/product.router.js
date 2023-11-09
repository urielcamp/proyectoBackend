import { Router } from "express";
import { paginateProductsController, getProductsController, getPidProductController, createProductController, deleteProductController, putProductController } from "../controllers/products.controller.js";


const router = Router();

export const getProducts = paginateProductsController;

router.get('/', getProductsController)

router.get('/:pid', getPidProductController)

router.post('/', createProductController)

router.put('/:pid', putProductController)

router.delete('/:pid', deleteProductController)

export default router