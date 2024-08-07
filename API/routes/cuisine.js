import express from 'express';
import { createCuisine, deleteCuisine, getAllCuisines, updateCuisine } from '../controllers/cuisine.js';

const router = express.Router();

router.post('/cuisines', createCuisine);
router.get('/cuisines', getAllCuisines);
router.put('/cuisines/:id', updateCuisine);
router.delete('/cuisines/:id', deleteCuisine);

export default router;
