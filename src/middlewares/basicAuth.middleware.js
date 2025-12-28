import UserModel from "../features/user/user.model.js";

const basicAuthorizer=(req,res,next)=>{
    //1.check the headers sent
    const authHeader=req.headers.authorization;
    if(!authHeader){
        return res.status(401).send('No authorization details found');
    }
    console.log(authHeader);

    //2. Extract credentials
    // const base64Credentials=Buffer.from(authHeader.split(' ')[1],"base64").toString().split(':');
    const base64Credentials=authHeader.replace('Basic ',"");
    console.log(base64Credentials);

    //3. Decode Credentials
    const decodeCreds=Buffer.from(base64Credentials,"base64").toString('utf8');
    console.log(decodeCreds);//[username:password]
    const creds=decodeCreds.split(':');
    console.log(creds);
    
    const user=UserModel.getAll().find(user=>user.email===creds[0]&&user.password===creds[1]);
    if(!user){
        return res.status(401).send('Invalid Credentials');
    }else{
        next();
    }
}

export default basicAuthorizer;