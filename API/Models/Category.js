import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: { type: String },
    isActive: { type: Boolean, default: true },
    type: { type: String, enum: ['category'], default: 'category' },
    isDeleted: { type: Boolean, default: false }
});

export const Category = mongoose.model('Category', categorySchema);
