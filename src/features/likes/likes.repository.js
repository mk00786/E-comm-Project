import mongoose from "mongoose";
import { likesSchema } from "./likes.schema.js";
import { ApplicationError } from "../../errorHandler/applicationError.js";
import { ObjectId } from "mongodb";

const likesModel=mongoose.model('likes',likesSchema);

export default class LikesRepository{
    async getLikes(id,type){
        try{
            return await likesModel.find({likeables:new ObjectId(id),types:type}).populate('user').populate({path:'likeables',model:type});
        }catch(err){
            console.log(err);   
            throw new ApplicationError('Getting error while fetching likes');
        }
    }

    async userLikes(userId){
        try{
            const getUserLikes=await likesModel.find({user:new ObjectId(userId)}).populate({path:'likeables'});
            return getUserLikes;
        }catch(err){
            console.log(err);
            throw new ApplicationError('Getting error while fetching likes');
        }
    }

    async likeProduct(userId,productId){
        try{
            const addLike=new likesModel({user:new ObjectId(userId),likeables:new ObjectId(productId),types:'products'});
            await addLike.save();
        }catch(err){
            console.log(err);
            throw new ApplicationError('Something went wrong'); 
        }
    }

    async likeCategory(userId,categoryId){
        try{
            const addLike=new likesModel({user:new ObjectId(userId),likeables:new ObjectId(categoryId),types:'category'});
            await addLike.save();
        }catch(err){
            console.log(err);
            throw new ApplicationError('Something went wrong'); 
        }
    }
} 