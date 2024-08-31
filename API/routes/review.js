import express from "express";
import { addReview, deleteReview, editReview, getAllReviews, getReviewById, getReviewsByRecipe } from "../controllers/review.js";
import authenticate from "../middlewares/authenticate.js";
import upload from '../middleware/image.js'


const router = express.Router();

router.post('/reviews',authenticate,upload,addReview);
router.get('/reviews/:recipeId', getReviewsByRecipe); 
router.get('/reviews',getAllReviews);
router.put('/reviews/:reviewId',upload,editReview);
router.get('/review/:reviewId',getReviewById); 
router.delete('/reviews/:reviewId',deleteReview);
export default router;