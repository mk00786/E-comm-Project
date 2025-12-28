import { ObjectId, ReturnDocument } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../errorHandler/applicationError.js";

export default class CartItemsRepository{
    constructor(){
        this.collectionName='cartItems';
    }

    async add(cartItem){
        try{
            const {productId,userId,quantity}=cartItem;
            const db=getDB();
            const collection=db.collection(this.collectionName);
            /*
            const checkIsAlreadyAdded=await collection.findOne({productId:new ObjectId(productId),userId:new ObjectId(userId)});
            if(checkIsAlreadyAdded){
                const updatedItem=await collection.updateOne({productId:new ObjectId(productId),userId:new ObjectId(userId)},{
                    $set:{quantity:quantity}
                })
                return updatedItem;
            }else{
                const addedItem=await collection.insertOne({
                productId:new ObjectId(productId),
                userId:new ObjectId(userId),
                quantity
                });
                return addedItem;
            }
                */
               const id=await this.getNextCounter(db);
               console.log(id);
               
               await collection.updateOne(
                    {productId:new ObjectId(productId), userId:new ObjectId(userId)},
                        {
                        $setOnInsert: {_id:id},
                        $inc:{
                        quantity: quantity
                        }},
                        {upsert: true})
        }catch(err){
            throw new ApplicationError('Something went wrong while adding cartItem');
        }
    }

    async getItems(userId){
        try{
            const db=getDB();
            const collection=db.collection(this.collectionName);
            return await collection.find({userId:new ObjectId(userId)}).toArray();
        }catch(err){
            throw new ApplicationError('Something went wrong while fetching cartItem');
        }
    }

    async delete(cartItemId,userId){
        try{
            const db=getDB();
            const collection=db.collection(this.collectionName);            
            return await collection.deleteOne({_id:new ObjectId(cartItemId),userId:new ObjectId(userId)});
        }catch(err){
            throw new ApplicationError('Something went wrong while deleting cartItem');
        }
    }

    async getNextCounter(db){
        const resultDocument = await db.collection("counters").findOneAndUpdate(
            {_id:'cartItemId'},
            {$inc:{value: 1}},
            {returnDocument:'after'}
        )
        console.log(resultDocument);
        return resultDocument.value;
    }
}