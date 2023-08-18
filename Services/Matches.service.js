const MatchModel = require("../models/Match.model");
const MatchDto = require("../dtos/Match.dto");

class MatchesService {
  async getMatches(status) {
    const matches = await MatchModel.find({status: status || "upcoming"});

    return matches.map((match) => new MatchDto(match));
  }
}

module.exports = new MatchesService();
