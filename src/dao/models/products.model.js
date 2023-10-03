import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsCollection = 'products'

const productsSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    code: String,
    stock: Number,
    category: String
})

mongoose.set('strictQuery', false)
productsSchema.plugin(mongoosePaginate)
const productModel = mongoose.model(productsCollection, productsSchema)

export default productModel

