import { Recipe } from "../Models/Recipe.js";
import { Category } from "../Models/Category.js";

export const addRecipe = async (req, res) => {
  try {
    const {
title, description, prepTime, cookTime, totalTime, servings, category,cuisine,difficulty,notes,ingredients,instructions,nutrition,author}=req.body;
    if (!req.files || (!req.files.images && !req.files.video)) {
      return res.status(400).json({ message: 'atleast one Image/Video file is required' });
    }
    const parsedIngredients = JSON.parse(ingredients);
    const parsedInstructions = JSON.parse(instructions);
    const parsedNutrition = JSON.parse(nutrition);
    const parsedAuthor = JSON.parse(author);

    const imagePaths = req.files.images ? req.files.images.map(file => file.path) : [];
    const videoPath = req.files.video ? req.files.video[0].path : '';

    const newRecipe = new Recipe({title,
      description, prepTime, cookTime,totalTime,servings, category, cuisine, difficulty, notes,
      ingredients: parsedIngredients, instructions: parsedInstructions, nutrition: parsedNutrition, author: parsedAuthor, images: imagePaths, video: videoPath
    });   
    const savedRecipe = await newRecipe.save();
     res.status(201).json(savedRecipe);
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).json({ message: error.message });
  }
};
  
export const editrecipe = async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;

  const existingRecipe = await Recipe.findById(id);

  const images = req.files && req.files.images
    ? req.files.images.map(file => file.path)
    : existingRecipe.images; 

  const video = req.files && req.files.video
    ? req.files.video[0].path
    : existingRecipe.video;

  console.log('images :>> ', images);

  if (!id){
    return res.status(400).json({ message: 'Recipe ID is required' });
  }
  let parsedIngredients = [];
  let parsedInstructions = [];
  let parsedNutrition = {};
  let parsedAuthor = {};


  if (updatedData['ingredients[0].name']) {
    parsedIngredients = Object.keys(updatedData)
      .filter(key => key.startsWith('ingredients['))
      .reduce((acc, key) => {
        const index = parseInt(key.match(/\d+/)[0]);
        const field = key.split('.').slice(-1)[0];
        if (!acc[index]) acc[index] = {};
        acc[index][field] = updatedData[key];
        return acc;
      }, []);
  }

  if (updatedData['instructions[0].step']) {
    parsedInstructions = Object.keys(updatedData)
      .filter(key => key.startsWith('instructions['))
      .reduce((acc, key) => {
        const index = parseInt(key.match(/\d+/)[0]);
        const field = key.split('.').slice(-1)[0];
        if (!acc[index]) acc[index] = {};
        acc[index][field] = updatedData[key];
        return acc;
      }, []);
  }

  if (updatedData['nutrition.calories']) {
    parsedNutrition = Object.keys(updatedData)
      .filter(key => key.startsWith('nutrition.'))
      .reduce((acc, key) => {
        acc[key.replace('nutrition.', '')] = updatedData[key];
        return acc;
      }, {});
  }

  if (updatedData['author.name']) {
    parsedAuthor = Object.keys(updatedData)
      .filter(key => key.startsWith('author.'))
      .reduce((acc, key) => {
        acc[key.replace('author.', '')] = updatedData[key];
        return acc;
      }, {});
  }

  const data = {
    title: updatedData.title,
    description: updatedData.description,
    prepTime: updatedData.prepTime,
    cookTime: updatedData.cookTime,
    totalTime: updatedData.totalTime,
    servings: updatedData.servings,
    category: updatedData.category,
    cuisine: updatedData.cuisine,
    difficulty: updatedData.difficulty,
    notes: updatedData.notes,
    ingredients: parsedIngredients,
    instructions: parsedInstructions,
    nutrition: parsedNutrition,
    author: parsedAuthor,
    images,
    video,
    status: updatedData.status === 'true'
  };

  try {
    const recipe = await Recipe.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json({ message: 'Recipe Updated Successfully', recipe });
  } catch (error) {
    console.error('Error updating recipe:', error);
    res.status(500).json({ message: 'Server error occurred', error: error.message });
  }
};

export const allrecipe = async (req,res) => {
    try{
        const recipes = await Recipe.find({},'title category status images').populate('category','name').sort({created_at:-1});
        console.log("=recipe=",recipes)
        res.json({recipes});
    }catch(error){
        res.json({message: error.message});
    }
}


export const viewRecipe = async (req, res) => {
    const id = req.params.id;
    
    try {
      const recipe = await Recipe.findById(id).populate('category','name').populate('cuisine','name').populate('difficulty','name').sort({created_at:-1});
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
    const { page = 1, limit = 5, search, filter, difficulty, category, cuisine } = req.query;

    const query = { status: true };
    if (search) {
      if (filter === 'name') {
        query.title = { $regex: search, $options: 'i' };
      } else if (filter === 'ingredient') {
        query.ingredients = { $elemMatch: { name: { $regex: search, $options: 'i' } }};
      }
    }

    if (difficulty){
      query.difficulty = difficulty;
    }
    if (category){
      query.category = category;
    }
    if (cuisine){
      query.cuisine = cuisine;
    }

    const recipes = await Recipe.find(query).populate('difficulty', 'name').populate('category', 'name').populate('cuisine', 'name').skip((page - 1) * limit).limit(Number(limit)).sort({created_at: -1});

    const totalRecipes = await Recipe.countDocuments(query);

    res.json({ recipes, totalRecipes });
  } catch(error){
    console.error('Error fetching recipes:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// export const getallrecipe = async(req, res) =>{
//   try {
//     const page = parseInt(req.query.page) || 1; 
//     const limit = parseInt(req.query.limit) || 5; 
//     const skip = (page - 1) * limit; 

//     const recipes = await Recipe.find({ status: true }).skip(skip).limit(limit).populate('category', 'name').sort({ created_at: -1 });

//     const totalRecipes = await Recipe.countDocuments({ status: true });

//     res.json({recipes,totalRecipes});
//   }catch(error) {
//     console.error("Error in fetching recipes:", error);
//     res.status(500).json({ message: "Error in fetching recipes" });
//   }
// };

  
