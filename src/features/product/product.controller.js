import ProductModel from "./product.model.js";
import ProductRepository from "./product.repository.js";

export default class ProductController{
    constructor(){
        this.repository=new ProductRepository();
    }

    async getAllProduct(req,res){
        try{
            const products=await this.repository.getAll();
            return res.status(200).send(products);
        }catch(err){
            console.log(err);
            return res.status(500).send('Something went wrong');
        }
        // const products=ProductModel.getAll();
        // res.status(200).send(products);
    }

    async addProduct(req,res){
        /*
        const {name,price,sizes}=req.body;
        const newProduct={
            name,
            price:parseFloat(price),
            sizes:sizes.split(','),
            imageUrl:req.file.filename
        };
        const addedProduct=ProductModel.add(newProduct);
        res.status(201).send(addedProduct);
        */
       
       try{
        /*
        if(!req.file){
            return res.status(400).send('Image is required');
        }*/

        let {name,price,sizes,categories,description}=req.body;
        price=parseFloat(price);
        sizes=sizes?.split(',');
        const imageUrl=req?.file?.filename;
        const newProduct=new ProductModel(null,name,description,price,imageUrl,categories,sizes);
        const productAdd=await this.repository.add(newProduct);
        return res.status(201).send(productAdd);
       }catch(err){
        console.log(err);
        return res.status(500).send('Something went wrong');
       }
    }

    async filterProduct(req,res){
        try{
            let {minPrice,maxPrice,category}=req.query;
            const filteredProduct=await this.repository.filter(Number(minPrice),Number(maxPrice),category);
            console.log(filteredProduct);
            
            return res.status(200).send(filteredProduct);
        }catch(err){
            return res.status(err.statusCode||500).json({msg:err.message||'Something went wrong'});
        }
        /*
        let {minPrice,maxPrice,category}=req.query;
        console.log(minPrice,maxPrice,category);
        const filteredProduct=ProductModel.filter(Number(minPrice),Number(maxPrice),category);
        
        return res.status(200).send(filteredProduct);*/

    }

    async getOneProduct(req,res){
        try{
            const {id}=req.params;
            const product=await this.repository.get(id);
            if(!product){
                return res.status(404).json({message:'Product not found'});
            }
            return res.status(200).send(product);
        }catch(err){
            return res.status(err.statusCode||500).json({message:err.message||'Internal server error'});
        }
        /*
        const id=req.params.id;
        const searchProduct=ProductModel.getById(id);
        if(!searchProduct){
            res.status(404).send('Product not found');
        }else{
            res.status(200).send(searchProduct);
        }
            */
    }

    async postRating(req,res,next){
        try{
            const userId=req.userId;
            const {productId,rating}=req.body;
            console.log(userId,productId,rating);
            await this.repository.rating(userId, productId, rating);
            return res.status(200).send('Rating added successfully');
        }catch(err){
            next(err);
        }
    }

    async getAveragePrice(req,res){
        try{
            const result=await this.repository.averagePricePerProduct();
            return res.status(200).send(result);
        }catch(err){
            return res.status(500).send('Something went wrong');
        }
    }
}