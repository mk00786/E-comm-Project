import ProductController from "./product.controller.js";
import express from "express";
import {uploadFile} from '../../middlewares/file-upload.middleware.js';

const router=express.Router();
const productController=new ProductController();

router.get('/',(req,res)=>{
    productController.getAllProduct(req, res)
});

router.post('/rateProduct',(req,res,next)=>{productController.postRating(req,res,next)});
router.post('/',uploadFile.single('imageUrl'),(req,res)=>{
    productController.addProduct(req, res)
});

router.get('/filter',(req,res)=>{
    productController.filterProduct(req,res)});

router.get('/averagePrice',(req,res,next)=>{
    productController.getAveragePrice(req,res)
});
router.get('/:id',(req,res)=>{productController.getOneProduct(req,res)});

export default router;