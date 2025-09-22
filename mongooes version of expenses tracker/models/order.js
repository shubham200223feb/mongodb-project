
const mongoose= require("mongoose");
const Schema= mongoose.Schema;
const Orderschema= new Schema({
    order_id:{
        type:String
    },
    payment_id:{
        type:String,
    },
    status:{
        type:String,
    },
    user_id:{
        type:Schema.Types.ObjectId,
        ref:'User',
        require:true,
        }
});
module.exports=mongoose.model('Order',Orderschema);