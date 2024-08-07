import { Recipe } from "../models/Recipe.js";
import mongoose from "mongoose";
export const addRecipe = async (req, res) => {
  try {
    const {
title, description, prepTime, cookTime, totalTime, servings, category,cuisine,difficulty,notes,ingredients,instructions,nutrition,author}=req.body;
    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }
    const parsedIngredients = JSON.parse(ingredients);
    const parsedInstructions = JSON.parse(instructions);
    const parsedNutrition = JSON.parse(nutrition);
    const parsedAuthor = JSON.parse(author);
    const newRecipe = new Recipe({title,
      description, prepTime, cookTime,totalTime,servings, category, cuisine, difficulty, notes,
      ingredients: parsedIngredients, instructions: parsedInstructions, nutrition: parsedNutrition, author: parsedAuthor,image: req.file.path,
    });   
    const savedRecipe = await newRecipe.save();
     res.status(201).json(savedRecipe);
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).json({ message: error.message });
  }
};



// export const addrecipe = async (req,res) => {
//     const {title, description, ingredients, instructions, prepTime, cookTime, totalTime, servings, category, cuisine, difficulty, notes, nutrition, image, author} = req.body
//     try {
//     const recipe = await Recipe.create({title, description, ingredients, instructions, prepTime, cookTime, totalTime, servings, category, cuisine, difficulty, notes, nutrition, image, author,status:true});
//     res.json({message:"Recipe Created Successfully!",recipe})
//     } catch (error) {
//         res.json({message: error.message})
//     }
// }


  

  
  export const editrecipe = async (req, res) => {
    const id = req.params.id;
    ///const updatedData = req.body;
    //console.log('updatedData :>> ', updatedData);
    console.log('req.file :>> ', req.file);
  
    const image = req.file ? req.file.path : '';
    console.log('image :>> ', image);
  
    // const {
    //   title, description, prepTime, cookTime, totalTime, servings, category,
    //   cuisine, notes, difficulty, ingredients, instructions, nutrition, author
    // } = updatedData;

    const {title, description, prepTime, cookTime, totalTime, servings, category,cuisine,difficulty,notes,ingredients,instructions,nutrition,author}=req.body;
    
    console.log("ingre",ingredients,"instr",instructions)
    const parsedIngredients = ingredients ? JSON.parse(ingredients) : [];
    const parsedInstructions = instructions ? JSON.parse(instructions) : [];
    const parsedNutrition = nutrition ? JSON.parse(nutrition) : {};
    const parsedAuthor = author ? JSON.parse(author) : {};


    
    const data = {
      title,
      description,
      prepTime,
      cookTime,
      totalTime,
      servings,
      category,
      cuisine,
      difficulty,
      notes,
      ...(parsedIngredients.length > 0 && { ingredients: parsedIngredients }),
      ...(parsedInstructions.length > 0 && { instructions: parsedInstructions }),
      ...(Object.keys(parsedNutrition).length > 0 && { nutrition: parsedNutrition }),
      ...(Object.keys(parsedAuthor).length > 0 && { author: parsedAuthor }),
      // ...(image && { image })
    };
    
    console.log('data :>> ', data);
    
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid recipe ID' });
      }
    
      const recipe = await Recipe.findByIdAndUpdate(id, data, { new: true, runValidators: true });
      
      if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }
    
      res.json({ message: 'Recipe Updated Successfully', recipe });
    
    } catch (error) {
      console.error('Error updating recipe:', error);
      res.status(500).json({ message: 'Server error occurred', error: error.message });
    }
  }    
// export const editrecipe = async (req, res) => {
//   const id = req.params.id;
//   const updatedData = req.body;
//   console.log('updatedData :>> ', updatedData);
//   console.log('req.file :>> ', req.file);
//   const image = req.file ? req.file.path : '';
//   console.log('image :>> ', image);
//   const {title,description,prepTime,cookTime,totalTime,servings,category,cuisine,notes} = updatedData

//   const parsedNutrition = updatedData.nutrition ? JSON.parse(updatedData.nutrition): '';
//   const parsedAuthor = updatedData.author ? JSON.parse(updatedData.author) : '';


//   const data = {
//    parsedAuthor,parsedNutrition,image,title,description,prepTime,cookTime,totalTime,servings,category,cuisine,notes
//   }

//   console.log('data :>> ', data);
 
//   try {
//     if (!id || !updatedData) {
//       return res.status(400).json({ message: 'Invalid request data' });
//     }
//     const recipe = await Recipe.findByIdAndUpdate(id, data, { new: true, runValidators: true });
//     if (!recipe) {
//       return res.status(404).json({ message: 'Recipe not found' });
//     }
//     res.json({ message: 'Recipe Updated Successfully', recipe });

//   } catch (error) {
//     console.error('Error updating recipe:', error); 
//     res.status(500).json({ message: 'Server error occurred', error: error.message });
//   }
// };


export const allrecipe = async (req,res) => {
    try{
        const recipes = await Recipe.find({},'title category status image');
        res.json({recipes});
    }catch(error){
        res.json({message: error.message});
    }
}

export const viewRecipe = async (req, res) => {
    const id = req.params.id;
    
    try {
      const recipe = await Recipe.findById(id);
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      res.json(recipe);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

export const deleterecipe = async (req,res)=>{
    const id = req.params.id;
    try {
        const recipe = await Recipe.findByIdAndDelete(id);
        if(!recipe){
            return res.json({message:"Recipe not found"});
        }
        res.json({message:"Recipe Deleted Successfully"});
    } catch (error) {
        return res.json({message:error.message});
    }
}

export const updatestatus = async(req,res)=>{
    const{id,status}=req.body;
    try{
        const recipe = await Recipe.findByIdAndUpdate(id,{status},{new:true, runValidators:true});
        if(!recipe){
            return res.json({message:"recipe not found"})
        }
        res.json({message:"status upated successfullly",recipe})
    }catch(error){
        res.json({message:error.message})
    }
};

export const getallrecipe = async (req, res) => {
    try {
      const recipes = await Recipe.find({ status: true });
      console.log('Recipes fetched from DB:', recipes); 
      res.json(recipes); 
    } catch (error) {
      console.error("Error in fetching recipes:", error);
      res.status(500).json({ message: "Error in fetching recipes" });
    }
  };
  
  
