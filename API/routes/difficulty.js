import express from 'express';
import { createDifficulty, deleteDifficulty, getAllDifficulties, updateDifficulty } from '../controllers/difficulty.js';

const router = express.Router();

router.post('/difficulties', createDifficulty);
router.get('/difficulties',getAllDifficulties);
router.put('/difficulties/:id',updateDifficulty);
router.delete('/difficulties/:id',deleteDifficulty);

export default router;