import fs from 'fs';

export class ProductManager {
    #path

    constructor(path) {
        this.#path = path;
        this.#init();
    }

    async #init() {
        if (!fs.existsSync(this.#path)) {
            await fs.promises.writeFile(this.#path, JSON.stringify([], null, '\t'));
        }
    }

    #generateId(products) {
        return products.length === 0 ? 1 : products[products.length - 1].id + 1;
    }

    async addProduct(product) {
        if (!product.title || !product.description || !product.price || !product.code || !product.stock) {
            return "[400] Error producto incompleto";
        }
        
        if (!fs.existsSync(this.#path)) {
            return '[500]  Error el archivo no existe';
        }

        let data = await fs.promises.readFile(this.#path, 'utf-8');
        let products = JSON.parse(data);
        const found = products.find(item => item.code === product.code);

        if (found) {
            return '[400] Error, mismo code';
        }

        const productToAdd = { id: this.#generateId(products), ...product };
        products.push(productToAdd);
        await fs.promises.writeFile(this.#path, JSON.stringify(products, null, '\t'));
        return productToAdd;
    }


    async getProducts(){
        if(!fs.existsSync(this.#path)) return '[500] Error el archivo no existe'
        let data = await fs.promises.readFile(this.#path, 'utf-8')
        let products = JSON.parse(data)
        return products
    }

    async getProductsById (id) {
        if(!fs.existsSync(this.#path)) return '[500] Error el archivo no existe'
        let data = await fs.promises.readFile(this.#path, 'utf-8')
        let products = JSON.parse(data)
        let product = products.find( item => item.id === id)
        if (!product) return 'Error'
        return product
    }

    async updateProduct (id, updatedProduct) {
        if(!fs.existsSync(this.#path)) return '[500] Error el archivo no existe'
        let isFound = false
        let data = await fs.promises.readFile(this.#path, 'utf-8')
        let products = JSON.parse(data)
        let newProduct = products.map(item => {
            if ( item.id === id) {
                isFound = true
                return {
                    ...item,
                    ...updatedProduct
                }
            }else{
                return item
            }
        })
        if (!isFound) return '[500] Error producto no existe'
        await fs.promises.writeFile(this.#path, JSON.stringify(newProduct, null, '\t'))
        return newProduct.find(item => item.id === id)
    }

    async deleteProduct(id) {
        if (!fs.existsSync(this.#path)) return '[500] Error el archivo no existe';
        let data = await fs.promises.readFile(this.#path, 'utf-8');
        let products = JSON.parse(data);
        let newProducts = products.filter(item => item.id !== id);
        
        //aca esta la correccion del isFound no declarado 
        let isFound = false; 
        
        if (products.length !== newProducts.length) {
            isFound = true;
        }
    
        if (!isFound) return '[500] Error el producto no existe';
        
        await fs.promises.writeFile(this.#path, JSON.stringify(newProducts, null, '\t'));
        return newProducts;
    }
    
}

export default ProductManager;