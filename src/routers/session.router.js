import { Router } from "express";
import passport from "passport";
import {createCountController, createSessionController, getSessionController, getGithubSessionController} from '../controllers/session.controller.js'

const router = Router()

router.post('/register', passport.authenticate('register', { failureRedirect: 'failRegister' }), createCountController);

router.get('/failRegister', (req, res) => res.send({ error: 'Passport register failed' }));

router.post('/login', passport.authenticate('login', { failureRedirect: 'failLogin' }), createSessionController);

router.get('/failLogin', (req, res) => res.send({ error: 'Passport login failed' }));

router.get('/logout', getSessionController);

router.get('/github', passport.authenticate('github', {scope: ['user: email']}), (req, res) =>{

})

router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}), getGithubSessionController)

export default router


