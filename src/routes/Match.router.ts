import {Router} from "express"
import MatchesController from "../Controllers/Matches.controller"

const router = Router();

router.get("/get", MatchesController.getMatches);

export default router;
