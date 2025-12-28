import LikesRepository from "./likes.repository.js";

export default class LikesController{
    constructor(){
        this.repository=new LikesRepository();
    }

    async likeItem(req,res,next){
        try{
            const {id,types}=req.body;
            
            const userId=req.userId;
            if(types!=='products'&&types!=='category'){
                return res.status(404).send('Invalid types Liked');
            }

            if(types==='products'){
                await this.repository.likeProduct(userId, id);
                return res.status(201).send('Product Liked successfully');
            }else{
                await this.repository.likeCategory(userId, id);
                return res.status(201).send('Category Liked Successfully');
            }
        }catch(err){
            console.log(err);
            return res.status(500).send('Something went wrong');
        }
    }

    async getLikes(req,res,next){
        try{
            const {id,types}=req.query;
            const likesfetched=await this.repository.getLikes(id, types);
            console.log(likesfetched);
            
            return res.status(200).send(likesfetched);
        }catch(err){
            console.log(err);
            return res.status(500).send('Something went wrong');
        }
    }

    async getUserLikes(req,res,next){
        try{
            const userId=req.userId;
            const getUserLikes=await this.repository.userLikes(userId);
            return res.status(200).send(getUserLikes);
        }catch(err){
            console.log(err);
            return res.status(500).send('Something went wrong');
        }
    }
}