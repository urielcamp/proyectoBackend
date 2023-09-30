import fs from "fs"
import ProductManager from "./productManager.js"

const productManager = new ProductManager("./data/products.json")

export class CartManager {
    #path

    constructor(path){
        this.#path = path
        this.#init()
    }

    async #init() {
        if (!fs.existsSync(this.#path)){
            await fs.promises.writeFile(this.#path, JSON.stringify([], null, '\t'))
        }
    }

    #generateId(data){
        return data.length === 0 ? 1 : data[data.length - 1].id + 1;
    }

    async createCart(){
        if(!fs.existsSync(this.#path)) return "[500] DB file does not exists."
        let data = await fs.promises.readFile(this.#path, "utf-8")
        let carts = JSON.parse(data)
        const cartToAdd = {id: this.#generateId(carts), products: []}
        carts.push(cartToAdd)
        await fs.promises.writeFile(this.#path, JSON.stringify(carts, null, '\t'))
        return cartToAdd
    }

    async getProductsFromCart(id){
        if(!fs.existsSync(this.#path)) return "[500] DB file does not exists."
        let data = await fs.promises.readFile(this.#path, "utf-8")
        let carts = JSON.parse(data)
        let cart = carts.find(item => item.id === id)
        if(!cart) return "[404] not found"
        return cart
    }
    async addProductToCart(cid, pid) {
        if (!fs.existsSync(this.#path)) return "[500] DB file does not exists."
        const result = await productManager.getProductsById(pid)
        if (typeof result == "string") return `[404] product with ID=${pid} was not found`
        const cart = await this.getProductsFromCart(cid)
        if(typeof cart == "string") return `[404] cart with ID=${cid} was not found`
        const productIndex = cart.products.findIndex(item => item.product === pid)
        if (productIndex >= 0) {
            cart.products[productIndex].quantity += 1
        }else{
            cart.products.push({ product: pid, quantity: 1});
        }
        let data = await fs.promises.readFile(this.#path, "utf-8")
        let carts = JSON.parse(data)
        carts = carts.map(item => {
            if (item.id === cid) {
                return cart
            } else {
                return item
            }
        })
        await fs.promises.writeFile(this.#path, JSON.stringify(carts, null, '\t'))
        return cart
    }
}

export default CartManager