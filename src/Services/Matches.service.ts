import MatchModel from "../models/Match.model"
import MatchDto from "../dtos/Match.dto"
 
class MatchesService {
  async getMatches(status) {
    const matches = await MatchModel.find({status: status || "upcoming"});

    return matches.map((match) => new MatchDto(match));
  }
}

export default new MatchesService();
