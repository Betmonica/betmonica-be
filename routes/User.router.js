const {Router} = require("express");
const UserController = require("../Controllers/User.controller");
const BetController = require("../Controllers/Bet.controller");
const authenticateToken = require("../utils/authenticate-token");

const router = Router();

router.post('/login', UserController.login)
router.get('/refresh-token', UserController.token)
router.post('/registration', UserController.registration)
router.delete('/logout', UserController.logout)

router.get('/balance/get', authenticateToken, UserController.getBalance)

router.get("/bets/get-bets", authenticateToken, BetController.getBets);
router.post("/bets/place-bet", authenticateToken, BetController.placeBet);
router.delete("/bets/cancel-bet", authenticateToken, BetController.cancelBet);

module.exports = router;
