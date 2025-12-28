import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const userSchema=new mongoose.Schema({
    name:String,
    email:{type:String,unique:true,match:[/.+\@.+\../,"Please enter a valid email"]},
    password:{type:String,
        validate:{
            validator:function(value){
                if (value.startsWith("$2b$")) return true;
                return /^(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/.test(value);
            },
            message:"Password must be of 8-12 characters n contain a special character too."
        }
    },
    type:{type:String,enum:['Customer','Seller']}
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

export { userSchema };