import mongoose from "mongoose";

const ingredientSchema = new mongoose.Schema({
    name: { type: String , required: true },
    quantity: { type: String , required: true },
    unit: { type: String , required: true }
});

const instructionSchema = new mongoose.Schema({
    step: { type: Number , required: true },
    description: { type: String , required: true }
});

const nutritionSchema = new mongoose.Schema({
    calories: { type: Number, required: true},
    fat: { type: Number, required: true},
    carbohydrates: { type: Number, required: true},
    protein: { type: Number, required: true}
});

const authorSchema = new mongoose.Schema({
    name:{type: String, required: true},
    profileUrl: {type: String, required: true}
});

const recipeSchema = new mongoose.Schema({
    title: { type: String , required: true },
    description: { type: String , required: true },
    ingredients: [ingredientSchema],
    instructions: [instructionSchema],
    prepTime: {type: String, required: true},
    cookTime: {type: String, required: true},
    totalTime: {type: String, required: true},
    servings: {type: Number, required: true},
    category: {type: String, required: true},
    cuisine: {type: String, required: true},
    difficulty: {type: String, required: true},
    notes: {type: String, required: true},
    nutrition: nutritionSchema,
    image: { type: String , required: true },
    author: authorSchema,
    status: {type: Boolean,default:true},
    created_at: { type: Date, default: Date.now }
});

export const Recipe = mongoose.model('Recipe',recipeSchema);