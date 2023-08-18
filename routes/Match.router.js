const { Router } = require("express");
const MatchesController = require("../Controllers/Matches.controller");

const router = Router();

router.get("/get", MatchesController.getMatches);

module.exports = router;
