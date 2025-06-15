

const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    userId: {type: string, required: true},
    products:[
        {
            productId: {type: String},
            quantity: {type: Number, default: 1}
        }],
        adress: {type: string, required: true},
        amount: {type: Number,default: "Pending", required: true},
}, {timestamps: true});
 export default mongoose.model("Order", OrderSchema)