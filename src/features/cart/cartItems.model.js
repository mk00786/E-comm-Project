import ProductModel from "../product/product.model.js";
import UserModel from "../user/user.model.js";

export default class CartItemModel{
    constructor(productId,userId,quantity,id){
        this.productId=productId;
        this.userId=userId;
        this.quantity=quantity;
        this._id=id;
    }
    /*
    static add(productId,userId,quantity){
        const product=ProductModel.getById(productId);
        if(!product){
            return 'Product not found';
        }

        const user= UserModel.getAll().find(u=>u.id==userId);
        if(!user){
            return "User not found";
        }

        if(quantity<=0){
            return 'Quantity must be a positive value';
        }

        const itemsExistsIndex=cartItems.findIndex(items=>items.userId==userId&&items.productId==productId);
        if(itemsExistsIndex>=0){
            cartItems[itemsExistsIndex].quantity=Number(quantity);
            return cartItems[itemsExistsIndex];
        }else{
            const newItem=new CartItemModel(Number(productId),userId,Number(quantity),cartItems.length+1);
            cartItems.push(newItem);
            return newItem;
        }
    }

    static getItems(userId){
        return cartItems.filter(items=>items.userId==userId);
    }

    static delete(cartItemId,userId){
        const cartItemIndex=cartItems.findIndex(i=>i.id==cartItemId&&i.userId==userId);
        if(cartItemIndex===-1){
            return "CartItem need to be deleted not found";
        }else{
            cartItems.splice(cartItemIndex,1);
        }
    }
        */
}

let cartItems=[
    new CartItemModel(1,2,1,1)
];