import mongoose from 'mongoose';

const cuisineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: { type: String },
    isActive: { type: Boolean, default: true },
    type: { type: String, enum: ['cuisine'], default: 'cuisine' },
    isDeleted: { type: Boolean, default: false }
});

export const Cuisine = mongoose.model('Cuisine', cuisineSchema);
