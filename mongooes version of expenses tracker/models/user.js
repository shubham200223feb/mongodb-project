const mongoose=require("mongoose");
const { type } = require("os");
const Schema = mongoose.Schema;
const Userschema= new Schema({
    name:{
        type:String,
        require:true,
    },
    email:{
        type:String,
        require:true,
    },
    password:{
        type:String,
        require:true
    },
    total:{
        type:Number,
        default:0,
    },
    isPremium:{
        type:Boolean,
        default:"false"
    }
});
module.exports=mongoose.model('User',Userschema);