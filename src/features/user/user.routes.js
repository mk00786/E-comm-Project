import jwtAuth from "../../middlewares/jwt.middleware.js";
import UserController from "./user.controller.js";
import express from 'express';

const router=express.Router();
const userController=new UserController();

// router.post('/signup',userController.getSignUp);
// router.post('/signin',userController.getSignIn);

router.post('/signup',(req,res,next)=>{
    userController.getSignUp(req, res,next)
});

router.post('/signin',(req,res)=>{
    userController.getSignIn(req, res)
});

router.put('/reset-password',jwtAuth,(req,res,next)=>{
    userController.resetPassword(req, res,next)
});

export default router;