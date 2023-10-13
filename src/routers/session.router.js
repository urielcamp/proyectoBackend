import { Router } from "express";
import UserModel from "../dao/models/user.model.js";
import {  isValidPassword } from "../utils.js";
import passport from "passport";


const router = Router()

router.post('/register', passport.authenticate('register', {failureRedirect: '/session/failRegister'}) ,async(req, res) => {
    res.redirect('/')
})

router.get('/failRegister', (req, res) => res.send({error: 'Passport register failes'}))

router.post('/login', passport.authenticate('login', {failureRedirect: '/session/failLogin'}),async (req, res) => {
    if(!req.user){
        return res.status(400).send({ status: 'error', error: 'Invalid credentials'})
    }    
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age
    }
    res.redirect('/products');
});

router.get('/failLogin', (req, res) => res.send({error: 'Passport login failes'}))

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
