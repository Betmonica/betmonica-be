import { Router } from 'express';
import UserController from '../Controllers/User.controller';
import { betController } from '../Controllers/Bet.controller';
import authenticateToken from '../utils/authenticate-token';

const router = Router();

router.post('/login', UserController.login);
router.get('/refresh-token', UserController.token);
router.post('/registration', UserController.registration);
router.delete('/logout', UserController.logout);

router.get('/balance/get', authenticateToken, UserController.getBalance);

router.get('/bets/get-bets', authenticateToken, betController.getBets);
router.post('/bets/place-bet', authenticateToken, betController.placeBet);
router.delete('/bets/cancel-bet', authenticateToken, betController.cancelBet);

export default router;
