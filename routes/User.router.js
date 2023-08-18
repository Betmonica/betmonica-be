const {Router} = require("express");
const UserController = require("../Controllers/User.controller");
const BetController = require("../Controllers/Bet.controller");
const authenticateToken = require("../utils/authenticate-token");

const router = Router();

router.post('/login', UserController.login)
router.get('/refresh-token', UserController.token)
router.post('/registration', UserController.registration)
router.post('/logout', authenticateToken, UserController.logout)

router.get("/bets/get-bets", authenticateToken, BetController.getBets);
router.post("/bets/place-bet", authenticateToken, BetController.placeBet);
router.delete("/bets/cancel-bet", authenticateToken, BetController.cancelBet);

module.exports = router;
