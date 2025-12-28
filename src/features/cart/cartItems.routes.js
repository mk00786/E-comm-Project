import express from "express";
import CartItemsController from "./cartItems.controller.js";

const router=express.Router();
const cartItemController=new CartItemsController();

router.post('/',(req,res)=>{cartItemController.addCart(req,res)});
router.get('/',(req,res)=>{cartItemController.getUserItems(req,res)});
router.delete('/:id',(req,res)=>{cartItemController.deleteItem(req,res)});

export default router;