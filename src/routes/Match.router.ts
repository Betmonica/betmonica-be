import { Router } from 'express';
import { matchesController } from '../Controllers/Matches.controller';

const router = Router();

router.get('/get', matchesController.getMatches);

export default router; 
