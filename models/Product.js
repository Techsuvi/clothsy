import { unique } from 'next/dist/build/utils';


const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    title: {type: string, required: true},
    slug: {type: string, required: true, unique: true},
    desc: {type: string, required: true},
    img: {type: string, required: true},
    category: {type: string, required: true},
    size: {type: string},
    color: {type: string},
    price: {type: Number,required: true },
    availableQty: {type: Number,required: true },
   
}, {timestamps: true});
 export default mongoose.model("Product", ProductSchema)