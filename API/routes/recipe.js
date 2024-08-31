import express from "express";
import { addRecipe, allrecipe, deleterecipe, editrecipe, getallrecipe, updatestatus, viewRecipe } from "../controllers/recipe.js";
import authenticate from "../middlewares/authenticate.js";
import upload from "../middleware/upload.js";


const router = express.Router();

router.post('/addrecipe', upload, addRecipe);

router.get('/allrecipe',allrecipe);
router.get('/viewrecipe/:id',viewRecipe)
router.put('/editrecipe/:id', upload, editrecipe);
router.delete('/deleterecipe/:id',deleterecipe);
router.post('/updatestatus',updatestatus);
router.get('/getallrecipe',getallrecipe)
export default router