import mongoose from "mongoose";

const productsCollection = 'products'

const productsSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    code: String,
    stock: Number,
    category: String
})

const productsModel = mongoose.model(productsCollection, productsSchema)

export default productsModel