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
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email, password }).lean().exec();

        if (!user) {
            return res.redirect('/');
        }

        if (user.email === 'adminCoder@coder.com' && user.password === 'adminCod3r123') {
            user.role = 'admin';
        } else {
            user.role = 'user';
        }

        req.session.user = user;

        res.redirect('/products');
    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        res.status(500).json({ status: 'error', error: 'Error en el inicio de sesión' });
    }
});

router.get('/logout', (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error al cerrar la sesión:', err);
                res.status(500).render('errors/base', { error: err });
            } else {
                // Redireccionar a la página de inicio después de cerrar la sesión
                res.redirect('/');
            }
        });
    } catch (error) {
        console.error('Error al cerrar la sesión:', error);
        res.status(500).render('errors/base', { error });
    }
});



export default router
