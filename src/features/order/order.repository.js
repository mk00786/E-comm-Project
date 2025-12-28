import { ObjectId } from "mongodb";
import { getClient, getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../errorHandler/applicationError.js";
import OrderModel from "./order.model.js";

export default class OrderRepository{
    constructor(){
        this.collection="orders";
    }

    async placeOrder(userId){
        const client=getClient();
        const session=client.startSession();
        try{
            session.startTransaction();
            const db=getDB();
             //1. Get cartItems and calculate total amount
            const items=await this.getTotalAmount(userId,session);
            console.log(items);
            
            const finalTotalAmount=items.reduce((acc,item)=>acc+item.totalAmount,0);
            //2. Create an order record
            const newOrder=new OrderModel(new ObjectId(userId),finalTotalAmount,new Date());
            await db.collection(this.collection).insertOne(newOrder,{session});
            //3. Reduce the stock
            for(let item of items){
                await db.collection('products').updateOne({
                    _id:item.productId
                },{
                    $inc:{stock:-item.quantity}
                },{session})
            }
            console.log("here");
            
            
            //4.clear the cart items
            await db.collection('cartItems').deleteMany({
                userId:new ObjectId(userId)
            },{session})

            await session.commitTransaction();
            session.endSession();
            return;
        }catch(err){
            await session.abortTransaction();
            session.endSession();
            throw new ApplicationError('Something went wrong',500);
        }
       
    }

    async getTotalAmount(userId,session){
        
        const db=getDB();
        const items=await db.collection('cartItems').aggregate([
            {
                //1.Get cart items for the user
                $match:{userId:new ObjectId(userId)}
            },
            {
                //2. Get the products from products collection
                $lookup:{
                    from:"products",
                    localField:"productId",
                    foreignField:"_id",
                    as:"productInfo"
                }   
            },
            {
                //3. unwind it
                $unwind:"$productInfo"
            },
            {
                //4.calculate total
                $addFields:{
                   "totalAmount":{
                    $multiply:["$productInfo.price","$quantity"]
                   }
                }
            }
        ],{session})
        .toArray();
        return items;
    }
}