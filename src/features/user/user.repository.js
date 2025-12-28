import mongoose from 'mongoose';
import { userSchema } from './user.schema.js';
import { ApplicationError } from '../../errorHandler/applicationError.js';
import bcrypt from 'bcrypt';
const UserModel=mongoose.model('users',userSchema);

export default class UserRepository{
async signUp(user){
    try{
        const newUser=new UserModel(user);
        await newUser.save();
        return newUser;
    }catch(err){
        if (err.code === 11000) {
            throw new ApplicationError("Email already exists", 409);
        }
        if(err instanceof mongoose.Error.ValidationError){
            throw err;
        }
        throw new ApplicationError('Error while signup',500);
    }
}

async findUserByEmail(email){
    try{
        return await UserModel.findOne({email});
    }catch(err){
        console.log(err);
        throw new ApplicationError('Entered email not found',500);
    }
}

async resetPassword(userId,hashedPassword){
    try{
        const user=await UserModel.findById(userId);
        if(user){
            user.password=hashedPassword;
            user.save();
        }else{
            throw new ApplicationError('User not found',404);
        }
    }catch(err){
        console.log(err);
        throw new ApplicationError('Failed to reset password',500);
    }
}
}