import express from "express";
import handlebars from 'express-handlebars'
import { Server } from "socket.io";
import mongoose from "mongoose";
import Sockets from "./sockets.js";

import productsRouter from "./routers/product.router.js"
import cartRouter from "./routers/cart.router.js"
import viewsRouter from "./routers/view.router.js"
import chatRouter from './routers/chat.router.js'

export const puerto = 8080

const app = express()
app.use(express.json())
app.use(express.static('./src/public'))

app.engine('handlebars', handlebars.engine())
app.set('views', './src/views')
app.set('view engine', 'handlebars')

app.use("/api/products", productsRouter)
app.use("/api/carts", cartRouter)
app.use('/products', viewsRouter)
app.use('/carts', viewsRouter)
app.use('/chat', chatRouter)

async function connectToDatabase() {
    try {
        await mongoose.connect('mongodb+srv://coder:coder@cluster0.rzjdugp.mongodb.net/ecommerce', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Conexión a MongoDB exitosa");
        } catch (error) {
        console.error("Error al conectar a MongoDB:", error);
        }
    }
    
    connectToDatabase();
    
const server = app.listen(8080,() =>  console.log("server up!!!")) 
const io = new Server(server)
Sockets(io)




