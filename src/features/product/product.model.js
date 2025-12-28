import {ApplicationError} from "../../errorHandler/applicationError.js";
import UserModel from "../user/user.model.js";

export default class ProductModel{
    constructor(id,name,description,price,imageUrl,category,sizes){
        this._id=id;
        this.name=name;
        this.description=description;
        this.price=price;
        this.imageUrl=imageUrl;
        this.category=category;
        this.sizes=sizes;
    }
/*
    static getAll(){
        return products;
    }

    static add(newProduct){
      newProduct.id=products.length+1;
      products.push(newProduct);
      return newProduct;
    }

    static getById(id){
      return products.find(product=>product.id==id);
    }
    
    static filter(minPrice,maxPrice,category){
      return products.filter(product=>
        (!minPrice||product.price>=minPrice)&&
        (!maxPrice||product.price<=maxPrice)&&
        (!category||product.category===category));
    }

    static rating(userId,productId,rating){
      const findUser=UserModel.getAll().find(user=>user.id==userId);

      if(!findUser){
        throw new ApplicationError('User not found',404);
      }

      const findProduct=products.find(p=>p.id==productId);
      if(!findProduct) throw new ApplicationError('Product not found',404);

      //if no rating is for product
      if(!findProduct.rating){
        findProduct.rating=[];
        findProduct.rating.push({
          userId,rating
        })
      }else{
        //if user editing his previous rating
        const existingRatingIndex=findProduct.rating.findIndex(p=>p.userId===userId);
        if(existingRatingIndex>=0){
          findProduct.rating[existingRatingIndex]={
            userId,rating
          }
        }else{
        //users new rating
        findProduct.rating.push({
          userId,rating
        })
      }
      }
    }
      */
}

var products = [
    new ProductModel(
      1,
      'Product 1',
      'Description for Product 1',
      19.99,
      'https://m.media-amazon.com/images/I/51-nXsSRfZL._SX328_BO1,204,203,200_.jpg',
      'Category1'
    ),
    new ProductModel(
      2,
      'Product 2',
      'Description for Product 2',
      29.99,
      'https://m.media-amazon.com/images/I/51xwGSNX-EL._SX356_BO1,204,203,200_.jpg',
      'Category2',
      ['M', 'XL']
    ),
    new ProductModel(
      3,
      'Product 3',
      'Description for Product 3',
      39.99,
      'https://m.media-amazon.com/images/I/31PBdo581fL._SX317_BO1,204,203,200_.jpg',
      'Category3',
      ['M', 'XL','S']
)];