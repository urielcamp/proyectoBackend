import { Router } from "express";
import UserModel from "../dao/models/user.model.js";

const router = Router()

router.post('/register', async(req, res) => {
    const userToRegister = req.body
    const user = new UserModel(userToRegister)
    await user.save()
    res.redirect('/')
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body
    const user = await UserModel.findOne({email, password}).lean().exec()
    if(!user) {
        return res.redirect('/')
    }
    if(user.email === 'adminCoder@coder.com' && user.password === 'adminCod3r123'){
        user.role = 'admin'
    }else{
        user.role = 'user'
    }
    req.session.user = user
    res.redirect('/products')

})

export default router
