const { Router } = require("express");

const router = Router();

const fs=require('fs')
const { title } = require('process')

class ProductManager{
    
    constructor(path){
        this.products=[],
        this.path = path;
    }

    addProducts( title, description, price, thumbnail, code, stock){
        let newProduct={
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }

        if(this.products.length === 0){
            newProduct.id = 1
        } else {
            newProduct.id = this.products[this.products.length -1].id + 1;
        }

        
        if (this.products.find(prod => prod.title === newProduct.title) || this.products.find(prod => prod.description === newProduct.description) || this.products.find(prod => prod.price === newProduct.price) || this.products.find(prod => prod.thumbnail === newProduct.thumbnail) || this.products.find(prod => prod.code === newProduct.code) || this.products.find(prod => prod.stock === newProduct.stock)){
            console.error("Product already exist!");
            return "Product already exist!";
        } else {
            this.products.push(newProduct);
            fs.writeFileSync(this.path, JSON.stringify(this.products, null, 5))
        }
        
    }

    getProducts(){
        if(fs.existsSync(this.path)){
            return JSON.parse(fs.readFileSync(this.path, 'utf-8'))
        }else return [];
    }

    getProductById(productId){
        let searchedProductId = this.products.findIndex(prod => prod.id == productId);
        
        if (searchedProductId === -1){
            console.error("Product not found!"); 
            return "Product not found!";          
        } else {
            return this.products[searchedProductId];
        }
    }
    deleteProductById(productId){
        
        let productToDelete = this.products.find(prod => prod.id === productId);
        let filteredProductList = [];

        if (!productToDelete){
            console.error("The product you want to delete does not exist!")
            return
        } else {
            filteredProductList = this.products.filter((prod) => prod.id !== productToDelete.id);
            this.products = filteredProductList;
            fs.writeFileSync(this.path, JSON.stringify(filteredProductList, null, 5))  
            return;    
        }

    }
    updateProduct(id, propertyToChange, newProperty){
        let productToChange = this.products.find(prod => prod.id === id);
        let productToChangeIndex = this.products.findIndex(prod => prod.id === id);
        let arrayToWrite = [];
     
        if (!productToChange){
            console.error("The product you want to update does not exist!");
            return;
        } else if (!productToChange.hasOwnProperty(propertyToChange)){
            console.error("The product you want to update does not contain the property specified!");
            return;
        } else {
            productToChange[[propertyToChange]] = newProperty;
            this.products[productToChangeIndex] = productToChange;
            arrayToWrite = this.products;
            fs.writeFileSync(this.path, JSON.stringify(arrayToWrite, null, 5));                 
            return;
        }
    }

}

let productManagerClass = new ProductManager('./products.json');
productManagerClass.addProducts("producto 1", "producto de prueba 1", 100, "producto 1 thumbnail", 1001, 10);
productManagerClass.addProducts("producto 2", "producto de prueba 2", 200, "producto 2 thumbnail", 2002, 20);
productManagerClass.addProducts("producto 3", "producto de prueba 3", 300, "producto 3 thumbnail", 3003, 30);
productManagerClass.addProducts("producto 4", "producto de prueba 4", 400, "producto 4 thumbnail", 4004, 40);
productManagerClass.addProducts("producto 5", "producto de prueba 5", 500, "producto 5 thumbnail", 5005, 50);
productManagerClass.addProducts("producto 6", "producto de prueba 6", 600, "producto 6 thumbnail", 6006, 60);
productManagerClass.addProducts("producto 7", "producto de prueba 7", 700, "producto 7 thumbnail", 7007, 70);
productManagerClass.addProducts("producto 8", "producto de prueba 8", 800, "producto 8 thumbnail", 8008, 80);
productManagerClass.addProducts("producto 9", "producto de prueba 9", 900, "producto 9 thumbnail", 9009, 90);
productManagerClass.addProducts("producto 10", "producto de prueba 10", 1000, "producto 10 thumbnail", 100010, 100);


router.get("/", (req, res) => {
  res.send("Bienvenido!");
});

router.get("/products", (req, res) => {
    const {limit} = req.query;
    if (limit){
        // const slicedArray = array.slice(0, n);
        res.send(productManagerClass.getProducts().slice(0, limit));
    } else {
        res.send(productManagerClass.getProducts());
    }
});

router.get("/products/:id", (req,res) => {
    const {id} = req.params;
    const calledProduct = productManagerClass.getProductById(id);
    if (calledProduct === "Product not found!")
    {
        res.send({error:"El producto no existe!"})
    } else {
        res.send(calledProduct);
    }   
})

module.exports = router;