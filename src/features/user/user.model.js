import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../errorHandler/applicationError.js";

export default class UserModel{
    constructor(id,name,email,password,type){
        this._id=id;
        this.name=name;
        this.email=email;
        this.password=password;
        this.type=type;
    }

    /*static async signUp(newUser){
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
            throw new ApplicationError('Something went wrong',500);
        }
        
    }
    
    static signIn(email,password){
        return users.find((u)=>u.email===email&&u.password===password);
    }
        */

    static getAll(){
        return users;
    }
}

let users=[
    {
        "id":1,
        "name":"Mridul",
        "email":"mridul@abc.com",
        "password":"mk123",
        "type":"seller"
    },
    {
        "id":2,
        "name":"Aman",
        "email":"aman@abc.com",
        "password":"aman123",
        "type":"customer"
    }
];