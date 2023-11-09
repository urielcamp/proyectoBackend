import { Router } from "express";
import { publicRoutes } from "../middlewares/auth.middleware.js";
import { getViewController, realTimeProductsViewController, getCidViewController,getProfileViewController } from '../controllers/view.controller.js'


const router = Router()


router.get('/', publicRoutes, getViewController)

router.get('/realTimeProducts', publicRoutes, realTimeProductsViewController)

router.get('/:cid', publicRoutes, getCidViewController)

router.get('/profile', publicRoutes, getProfileViewController);

export default router

