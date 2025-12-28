import mongoose from 'mongoose'

export const likesSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    },
    likeables:{
        type:mongoose.Schema.Types.ObjectId,
        refPath:'types'
    },
    types:{
        type:String,
        enum:['products','category']
    }
});

likesSchema.pre('save', async function () {
    console.log('Like Incoming....');
});

likesSchema.post('save',(doc)=>{
    console.log('Liked document');
    console.log(doc);  
})
