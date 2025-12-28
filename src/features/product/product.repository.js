import mongoose from "mongoose";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../errorHandler/applicationError.js";
import { ObjectId } from "mongodb";
import { productSchema } from "./product.schema.js";
import { reviewSchema } from "./reviews.schema.js";
import { categorySchema } from "./category.schema.js";

const ProductModel=mongoose.model('products',productSchema);
const ReviewModel=mongoose.model('Reviews',reviewSchema);
const CategoryModel=mongoose.model('category',categorySchema);

export default class ProductRepository{
    constructor(){
        this.collection="products";
    }
    async add(productData){
        try{
            // 1. Adding Product
               productData.categories = productData.category.split(',').map(id => id.trim());
                console.log(productData);
                const savedProduct =await  new ProductModel(productData).save();
    
                // 2. Update categories.
                await CategoryModel.updateMany(
                    {_id: {$in: savedProduct.categories}},
                    {$push: {products: new ObjectId(savedProduct._id)}}
                )
            
            /*
            const db=getDB();
            const collection=db.collection(this.collection);
            await collection.insertOne(newProduct);
            return newProduct;
            */
        }catch(err){
            throw new ApplicationError('Something went wrong while adding product',500);
        }
    }

    async getAll(){
        try{
            const db=getDB();
            const collection=db.collection(this.collection);
            return await collection.find().toArray();
        }catch(err){
            throw ApplicationError('Something went wrong while fetching all products',500);
        }
    }

    async get(id){
        try{
            const db=getDB();
            const collection=db.collection(this.collection);
            return await collection.findOne({_id:new ObjectId(id)});
        }catch(err){
            throw new ApplicationError('Something went wrong while fetching product by ID',500);
        }
    }

    async filter(minPrice,maxPrice,categories){
        try{
            const db=getDB();
            const collection=db.collection(this.collection);
            let filterExpression={};
            if(minPrice){
                filterExpression.price={$gte:parseFloat(minPrice)};
            }
            /*
            if(maxPrice){
                filterExpression.price={...filterExpression.price,$lte:parseFloat(maxPrice)};
            }

            if(category){
                filterExpression.category=category;
            }*/
            //['cat1','cat2']
            if(categories){
                //filterExpression={$and:[{category:categories},filterExpression]};
                //filterExpression={$or:[{category:categories},filterExpression]};
                categories=JSON.parse(categories.replace(/'/g,'"'));
                filterExpression={$and:[{category:{$in:categories}},filterExpression]};
            }

            return await collection.find(filterExpression).project({name:1,price:1,_id:0,sizes:{$slice:-1}}).toArray();
        }catch(err){
            throw new ApplicationError('Something went wrong while filtering product',500);
        }
    }

    async rating(userId,productId,rating){
        try{
            const findProduct=await ProductModel.findById(productId);
            if(!findProduct){
               throw new ApplicationError('Product not found',400); 
            }
            const review=await ReviewModel.findOne({productId:new ObjectId(productId),userId:new ObjectId(userId)});
            if(review){
                review.rating=rating;
                await review.save();
            }else{
                const newReview=new ReviewModel({productId:new ObjectId(productId),userId:new ObjectId(userId),rating});
                await ProductModel.findByIdAndUpdate(productId,{$push:{reviews:newReview._id}})
            }
            return {success:true};
        }catch(err){
            throw new ApplicationError('Something went wrong while rating product',500);
        }
        /*
        try{
            const db=getDB();
            const collection=db.collection(this.collection);
            //1. Find the product and pull if exists
            await collection.updateOne({_id:new ObjectId(productId)},
            {$pull:{ratings:{userId:new ObjectId(userId)}}});
            //2. Push it then
            const updatedProduct=await collection.updateOne({_id:new ObjectId(productId)},{$push:{ratings:{userId:new ObjectId(userId),rating}}});
            return updatedProduct;
        }catch(err){
            throw new ApplicationError('Something went wrong while rating product',500);
        }
            */
    /*
    async rating(userId,productId,rating){
        try{
            const db=getDB();
            const collection=db.collection(this.collection);
            //1. Find the product
            const product=await collection.findOne({_id:new ObjectId(productId)});
            //2. Find the rating
            const getRating=product?.ratings?.find(u=>u.userId==userId);

            if(getRating){
                const updatedProduct=await collection.updateOne(
                    {_id:new ObjectId(productId),"ratings.userId":new ObjectId(userId)},
                    {$set:{"ratings.$.rating":rating}});
                    return updatedProduct;
            }else{
                const updatedProduct=await collection.updateOne({_id:new ObjectId(productId)},{$push:{ratings:{userId:new ObjectId(userId),rating}}});
                return updatedProduct;
            }
        }catch(err){
            throw new ApplicationError('Something went wrong while rating product',500);
        }
        */
    }

    async averagePricePerProduct() {
    try {
        const db = getDB();
        const collection = db.collection(this.collection);

        const result = await collection.aggregate([
            {
                $group: {
                    _id: "$category",
                    averagePrice: { $avg: "$price" }
                }
            }
        ]).toArray(); // IMPORTANT

        return result;

    } catch (err) {
        throw new ApplicationError('Something went wrong while getting average Price');
    }
}

}