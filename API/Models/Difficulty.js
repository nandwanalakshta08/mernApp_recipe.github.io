import mongoose from 'mongoose'

const difficultySchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description: { type: String },
    isActive: { type: Boolean, default: true },
    type: { type: String, enum: ['difficulty'], default: 'difficulty' }, 
    isDeleted: { type: Boolean, default: false } 

});
export const Difficulty = mongoose.model('Difficulty', difficultySchema);