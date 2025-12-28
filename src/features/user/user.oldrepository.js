import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../errorHandler/applicationError.js";

class UserRepository{
    async signUp(newUser){
    try{
        //1.Get the database
        const db=getDB();
    
        //2.Get the collection
        const collection=db.collection('users');
    
        //3.Insert the document
        await collection.insertOne(newUser);
    
        // newUser.id=users.length+1;
        // users.push(newUser);
        return newUser;
    }catch(err){
        console.log(err);
        throw new ApplicationError('Something went wrong while signing up the DB',500);
    }
    }

    async signIn(email,password){
        try{
            console.log(email,password);
            
            const db=getDB();
            const collection=db.collection('users');
            return await collection.findOne({email,password})
        }catch(err){
            console.log(err);
            throw new ApplicationError('Something went wrong while login',500);
        }
    }

    async findUserByEmail(email){
        try{
            const db=getDB();
            const collection=db.collection('users');
            return await collection.findOne({email});
        }catch(err){
            throw new ApplicationError('Email not exist',500);
        }
    }
}

export default  UserRepository;