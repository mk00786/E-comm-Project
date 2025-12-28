import mongoose from 'mongoose';
import dotenv from "dotenv";
import { categorySchema } from '../features/product/category.schema.js';

dotenv.config();
const url=process.env.DB_URL;

export const connectToMongoose=async()=>{
    try{
        await mongoose.connect(url);
        console.log("Mongodb using mongoose is connected");
        addCategories();
    }catch(err){
        console.log(err);
    }
}

async function addCategories(){
    const CategoryModel=mongoose.model('category',categorySchema);
    const categories=await CategoryModel.find();
    if(!categories||categories.length===0){
        await CategoryModel.insertMany([{name:'Books'},{name:'Clothing'},{name:'Electronics'}])
    }
    console.log(await CategoryModel.find());
    
    console.log("Categories are added");
}