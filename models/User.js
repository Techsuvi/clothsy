import { unique } from 'next/dist/build/utils';


const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {type: string, required: true},
    email: {type: string, required: true, unique: true},
    password: {type: string, required: true},
  
   
}, {timestamps: true});
 export default mongoose.model("User", UserSchema)