import { Router} from 'express'
import { privateRoutes } from '../middlewares/auth.middleware.js';

const router = Router()

router.get('/register', privateRoutes, async(req, res) => {
    res.render('sessions/register')
})

router.get('/', privateRoutes, async (req, res) => {
    res.render('sessions/login')
})


export default router