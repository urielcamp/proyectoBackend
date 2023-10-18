import passport from "passport";
import local from 'passport-local';
import GitHubStrategy from 'passport-github2'
import UserModel from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";


const localStrategy = local.Strategy

const initializePassport = () => {
    
    passport.use('register', new localStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async(req, username, password, done) => {
        const{ first_name, last_name, email, age} = req.body
        try{
            const user = await UserModel.findOne({ email: username})
            if (user) {
                return done(null, false)
            }
            const newUser = {
                first_name, last_name, email, age, password: createHash(password)
            }
            const result = await UserModel.create(newUser)
            return done(null, result)

        }catch(err){
            return done(err)
        }
    }))

    
passport.use('login', new localStrategy({
    usernameField: 'email',
}, async(username, password, done) => {
    try {
        const user = await UserModel.findOne({ email: username });
        
        if (!user) {
            return done(null, false);
        }

        // Verifica si las credenciales son las del administrador
        if (user.email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
            // Si son las credenciales del administrador, asigna el rol "admin" al usuario
            user.role = 'admin';
            
        } else {
            // Si no son las credenciales del administrador, asigna el rol "user"
            user.role = 'user';
        }

        if (!isValidPassword(user, password)) {
            return done(null, false);
        }

        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

passport.use('github', new GitHubStrategy({
    clientID: 'Iv1.906b3925049edf04',
    clientSecret: '997f967b0fb88a1bd7132598430aa969c019cee1',
    callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
}, async(accessTokem, refreshToken, profile, done) => {
    try{
        const user = await UserModel.findOne({ email: profile._json.email})
        if(user) return done(null, user)
        const newUser = await UserModel.create({
            first_name: profile._json.name,
            last_name: '',
            email: profile._json.email,
            password: ''
    })
    return done(null, newUser)
    } catch(err) {
        return done('Error to login with github')
    }
}))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async(id, done) =>{
        const user = await UserModel.findById(id)
        done(null, user)
    })


}

export default initializePassport


