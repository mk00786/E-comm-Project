import CartItemModel from "./cartItems.model.js";
import CartItemsRepository from "./cartItems.repository.js";

export default class CartItemsController{
    constructor(){
        this.repository=new CartItemsRepository();
    }

    async addCart(req,res){
        try{
            const {productId,quantity}=req.body;
            const userId=req.userId;

            if(!productId){
                return 'ProductId not found';
            }
            
            if(!userId){
                return "UserId not found";
            }
            
            if(quantity<=0){
                return 'Quantity must be a positive value';
            }

            const cartItem=new CartItemModel(productId,userId,quantity,null);
            const addedItem=await this.repository.add(cartItem);
            return res.status(201).send(addedItem);
        }catch(err){
            return res.status(500).send('Something went wrong');
        }
        /*
        const {productId,quantity}=req.query;
        const userId=req.userId;
        const error=CartItemModel.add(productId, userId, quantity);
        if(error==="Product not found"||error==="Quantity must be a negative value"){
          return  res.status(400).send(error);
        }
        res.status(201).send('Item added to cart successfully');    */
    }

    async getUserItems(req,res){
        try{
            const userId=req.userId;
            const fetchedItem=await this.repository.getItems(userId);
            return res.status(200).send(fetchedItem);
        }catch(err){
            return res.status(500).send('Something went wrong');
        }
        /*
        const userId=req.userId;
        const items=CartItemModel.getItems(userId);
        res.status(200).send(items);*/
    }

    async deleteItem(req,res){
        try{
            const {id}=req.params;
            const userId=req.userId;
            const deletedItem=await this.repository.delete(id, userId);
            if(!deletedItem){
                return res.status(404).send('Item not found');
            }
            return res.status(200).send(deletedItem);
        }catch(err){
            return res.status(500).send('Something went wrong');
        }
        /*
        const cartItemId=req.params.id;
        const userId=req.userId;
        const error=CartItemModel.delete(cartItemId,userId);
        if(error){
            return res.status(400).send(error);
        }
        res.status(200).send('Item deleted successfully');
        */
    }
}