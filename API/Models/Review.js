import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    recipe: { type: mongoose.Schema.ObjectId, ref: 'Recipe', required: true},
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min:1, max: 5},
    comment: { type: String },
    images: [{ type: String }],
    created_at: {type: Date, default: Date.now}
});

export const Review = mongoose.model('Review', reviewSchema);
