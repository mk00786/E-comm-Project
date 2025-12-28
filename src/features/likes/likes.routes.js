import express from 'express';
import LikesController from './likes.controller.js';

const router=express.Router();
const likesController=new LikesController();

router.post('/',(req,res,next)=>{likesController.likeItem(req, res, next)});
router.get('/like',(req,res,next)=>{likesController.getLikes(req,res,next)});
router.get('/',(req,res,next)=>{likesController.getUserLikes(req,res,next)});
export default router;