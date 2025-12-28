import UserModel from "./user.model.js";
import jwt from 'jsonwebtoken';
import UserRepository from "./user.repository.js";
import bcrypt from 'bcrypt';

export default class UserController{

    constructor(){
        this.userRepository=new UserRepository();
    }

    async getSignUp(req,res){
        try{
            const {name,email,password,type}=req.body;
        /*    
        const newUser={
            name,
            email,
            password,
            type
        };
        
        // const addUser= await UserModel.signUp(newUser);
        */

       const user={
            name,
            email,
            password,
            type
       };
        const savedUser=await this.userRepository.signUp(user);
        const response = savedUser.toObject();
        delete response.password;
        return res.status(201).send(response);
        }catch(err){
            return res.status(err.statusCode || 400).send(err.message);
        }
    }

    async getSignIn(req,res){
        try{
            const {email,password}=req.body;
            //const isUserRegistered=UserModel.signIn(email, password);
            //const isUserRegistered=await this.userRepository.signIn(email, password);
            const isUserRegistered=await this.userRepository.findUserByEmail(email);
            console.log(isUserRegistered);
            
            if(!isUserRegistered){
                return res.status(400).send('Invalid Credentials');
            }else{
                //check password
                const isMatch=await bcrypt.compare(password, isUserRegistered.password);
                if(!isMatch){
                    return res.status(400).send('Invalid Credentials');
                }else{
                let token=jwt.sign({
                // userId:isUserRegistered.id,
                userId:isUserRegistered._id,
                email:isUserRegistered.email
                },process.env.JWT_SECRET,{
                    expiresIn:'1h'
                });
                return res.status(200).send(token);
            }
            }
        }catch(err){
            return res.status(500).send('Something went wrong');
        }
    }

    async resetPassword(req,res){
        const {newPassword}=req.body;
        const userId=req.userId;
        const hashedPassword=await bcrypt.hash(newPassword,10);
        try{
            await this.userRepository.resetPassword(userId,hashedPassword);
            return res.status(200).send('Password is reset');
        }catch(err){
            console.log(err);
            return res.status(500).send('Something went wrong');
        }
    }
}