import { Review } from "../Models/Review.js";
import { Recipe } from "../Models/Recipe.js";



export const addReview = async (req, res) => {
    const { recipeId, rating, comment } = req.body;
    const userId = req.user.userId;
  
    try {
      const recipe = await Recipe.findById(recipeId);
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }
  
      const existingReview = await Review.findOne({ user: userId, recipe: recipeId });
      if (existingReview) {
        return res.status(400).json({ message: "You have already reviewed this recipe" });
      }
  
      const newReview = new Review({user: userId,recipe: recipeId,rating,comment,
        images: req.files.map(file => file.filename), 
      });
  
      const savedReview = await newReview.save();
      res.status(201).json({ message: "Review added successfully", review: savedReview });
    } catch (error) {
      console.error("Error adding review:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
// export const addReview = async (req, res) => {
//     const { recipeId, rating, comment } = req.body;
//     const userId = req.user.userId;

//     try {
//         const recipe = await Recipe.findById(recipeId);
//         if (!recipe){
//             return res.status(404).json({ message: "Recipe not found" });
//         }
//         const existingReview = await Review.findOne({ recipe: recipeId, user: req.user.userId });
//         if (existingReview) {
//             return res.status(400).json({ message: "You have already reviewed this recipe" });
//         }
      
//         const review = new Review({recipe: recipeId,user: userId,rating,comment}); 
//         await review.save();
//         res.status(201).json({message:'Review added successfully',review});

//     } catch (error){
//         res.status(500).json({message:'fail to add review',error: error.message});
//     }
// };

export const getReviewsByRecipe = async (req, res) =>{
    const {recipeId} = req.params;
   try {
       const recipe = await Recipe.findById(recipeId);
        if (!recipe){
            return res.status(404).json({message:"Recipe not found"});
        }
        const reviews = await Review.find({ recipe:recipeId }).populate('user', 'first_name last_name').sort({created_at:-1});

        if(!reviews.length) {
            return res.status(404).json({ message:"No reviews found"});
        }
        const baseURL = 'http://localhost:3000/reviewimg/';
  const reviewsWithImages = reviews.map(review => {
            return {
             ...review._doc, images: review.images.map(img => `${baseURL}${img}`) 
            };
        });
    res.json(reviewsWithImages);
    }catch (error){
        res.status(500).json({message:error.message});
    }
};

export const getAllReviews = async(req,res) =>{
    try {
        const reviews = await Review.find().populate('user','first_name last_name').populate('recipe','title').sort({created_at:-1});
        if(!reviews.length){
            return res.status(404).json({message:"No reviews found"});
        }
        res.json({message:"list of reviews",reviews});
    } catch (error) {
        res.status(500).json({message:error.message});
    }
};

export const editReview = async (req,res)=> {
    const {reviewId} = req.params;
    const {rating,comment}= req.body;
    try {
      const review = await Review.findById(reviewId);
      if(!review){
        return res.status(404).json({message: "Review not found"});
      }
      review.rating = rating;
      review.comment = comment;
      await review.save();
      res.json({message: "Review updated successfully", review});
    } catch (error) {
        res.status(500).json({message:"fail to edit review", error: error.message});
    }
};

export const getReviewById = async (req, res) => {
    const { reviewId } = req.params;

    try {
        const review = await Review.findById(reviewId).populate('user', 'first_name last_name');
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }
        res.json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteReview = async(req,res)=> {
    const {reviewId} = req.params;
    try {
        const review = await Review.findByIdAndDelete(reviewId);
        if (!review){
            return res.status(404).json({message: "review not found"});
        }
        res.json({message:"review deleted successfully"});
    } catch (error) {
        res.status(500).json({message:"failed to delete review",error: error.message});
    }
};
