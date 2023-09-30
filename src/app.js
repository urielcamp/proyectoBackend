import express from "express";
import handlebars from 'express-handlebars'
import mongoose from "mongoose";

import productsRouter from "./routers/product.router.js"
import cartRouter from "./routers/cart.router.js"
import viewsRouter from "./routers/view.router.js"

import { Server } from "socket.io";


const app = express()
app.use(express.json())
app.use(express.static('./src/public'))

app.engine('handlebars', handlebars.engine())
app.set('views', './src/views')
app.set('view engine', 'handlebars')



app.use("/api/products", productsRouter)
app.use("/api/carts", cartRouter)
app.use('/products', viewsRouter)


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

io.on("connection", socket => {
    console.log('Cliente conectado...')
    socket.on('productList', data => {
        io.emit('updatedProducts', data)
    })
})

