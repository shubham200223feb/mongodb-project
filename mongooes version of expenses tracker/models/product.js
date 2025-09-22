const mongoose=require("mongoose");
const Schema = mongoose.Schema;
const Productschema= new Schema({
    item:{
        type:String,
        required:true,
    },
    amount:{
        type:Number,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    user_id:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true,
    }
    
});
module.exports=mongoose.model('Product',Productschema);