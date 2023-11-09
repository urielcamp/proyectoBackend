import express from "express";
import handlebars from 'express-handlebars';
import { Server } from "socket.io";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import { Command } from "commander";
import dotenv from 'dotenv';

import Sockets from "./sockets.js";
import initializePassport from "./config/passport.config.js";
import productsRouter from "./routers/product.router.js";
import cartRouter from "./routers/cart.router.js";
import viewsRouter from "./routers/view.router.js";
import chatRouter from './routers/chat.router.js';
import sessionViewsRouter from './routers/session.view.router.js';
import sessionRouter from "./routers/session.router.js";

dotenv.config();

const program = new Command();

program
    .option('-p <port>', 'Puerto del servidor', 8080)
    .option('--mode <port>', 'Modo de ejecucion', 'Production');
program.parse();

export const port = program.opts().p;
const mode = program.opts().mode;

const app = express();

// Configuración del servidor
app.use(express.json());
app.use(express.static('./src/public'));
app.use(express.urlencoded({ extended: true }));
app.engine('handlebars', handlebars.engine());
app.set('views', './src/views');
app.set('view engine', 'handlebars');

// Configuración de la sesión y passport
app.use(session({
store: MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
    dbName: process.env.MONGO_DB_NAME,
}),
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

export const privateRoutes = (req, res, next) => {
if (!req.session.user) return res.redirect('/login');
next();
};

export const publicRoutes = (req, res, next) => {
    if (!req.session.user) return res.redirect('/');
        next();
};

// Rutas
app.use('/', sessionViewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use('/products', viewsRouter);
app.use('/carts', viewsRouter);
app.use('/chat', chatRouter);
app.use('/api/sessions', sessionRouter);

// Conexión a la base de datos y luego inicio del servidor
async function startServer() {
    try {
        await connectToDatabase();
        const server = app.listen(port, () => console.log(`Server up on port ${port} running on mode ${mode} !!!`));
        const io = new Server(server);
        Sockets(io);
    } catch (error) {
        console.error("Error al iniciar el servidor:", error);
    }
    }

async function connectToDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        });
        console.log("Conexión a MongoDB exitosa");
    } catch (error) {
        console.error("Error al conectar a MongoDB:", error);
        throw error;
    }
    }

startServer();
