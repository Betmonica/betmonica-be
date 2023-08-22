import {Router} from"express"
import UserController from"../Controllers/User.controller"
import BetController from"../Controllers/Bet.controller"
import authenticateToken from"../utils/authenticate-token"

const router = Router();

router.post('/login', UserController.login)
router.get('/refresh-token', UserController.token)
router.post('/registration', UserController.registration)
router.delete('/logout', UserController.logout)

router.get('/user-data', authenticateToken, UserController.getUserData)
router.get('/balance/get', authenticateToken, UserController.getBalance)

router.get("/bets/get-bets", authenticateToken, BetController.getBets);
router.post("/bets/place-bet", authenticateToken, BetController.placeBet);
router.delete("/bets/cancel-bet", authenticateToken, BetController.cancelBet);

export default router;
