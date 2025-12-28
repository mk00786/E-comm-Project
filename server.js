import './env.js';
import express from "express";
import swagger from "swagger-ui-express";
import cors from 'cors';
import productRouter from "./src/features/product/product.routes.js";
import bodyParser from "body-parser";
import userRouter from "./src/features/user/user.routes.js";
// import basicAuthorizer from "./src/middlewares/basicAuth.middleware.js";
import jwtAuth from "./src/middlewares/jwt.middleware.js";
import cartRouter from "./src/features/cart/cartItems.routes.js";
// import apiDocs from "./swagger.json" with { type: "json" };
import apiDocs from "./swagger_up.json" with { type: "json" };
import loggerMiddleware from "./src/middlewares/logger.middleware.js";
import { ApplicationError } from "./src/errorHandler/applicationError.js";
import {connectToMongoDB} from "./src/config/mongodb.js";
import { connectToMongoose } from './src/config/mongooseConfig.js';
import orderRouter from './src/features/order/order.routes.js';
import mongoose from 'mongoose';
import likesRouter from './src/features/likes/likes.routes.js';

const app=express();

//CORS policy configuration
/*app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','http://127.0.0.1:5500');
    res.header('Access-Control-Allow-Headers','*');//Authorization,Content-Type
    res.header('Access-Control-Allow-Methods','*');//GET,POST,PUT,DELETE
    if(req.method=='OPTIONS'){
        return res.sendStatus(200);
    }
    next();
})*/

const corsOptions={
    origin:"http://127.0.0.1:5500"
}

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use('/api-docs',swagger.serve,swagger.setup(apiDocs));//Bearer <token> also be used when bearer token is passed we need to add "Bearer " ourselves
// app.use('/api/products',basicAuthorizer,productRouter);
app.use(loggerMiddleware);
app.use('/api/orders',jwtAuth,orderRouter);
app.use('/api/users',userRouter);
app.use('/api/products',jwtAuth,productRouter);
app.use('/api/cartItems',jwtAuth,cartRouter);
app.use('/api/likes',jwtAuth,likesRouter);

//404 middleware ..always put this at end
app.use((req,res)=>{
    res.send('API not found.Refer localhost:3000/api-docs for more info.')
})

app.get('/',(req,res)=>{
    res.send('Welcome to E-comm API');
})

//Error handler middleware always make it to the last
app.use((err,req,res,next)=>{
    if(err instanceof mongoose.Error.ValidationError){
        res.status(400).send(err.message);
    }
    
    if(err instanceof ApplicationError){
        res.status(err.code).send(err.message);
    }

    console.log(err);
    res.status(500).send('Something went wrong.Please try again.');
})

app.listen(3000, ()=>{
    console.log('Server running at port 3000');
    //connectToMongoDB();
    connectToMongoose();
});