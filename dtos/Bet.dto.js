const MatchDto = require('./Match.dto')

module.exports = class BetDto {
  bet;
  match;

  constructor(model) {
    this.bet = {
      id: model._id,
      matchId: model.match._id,
      teamId: model.teamId,
      betAmount: model.betAmount,
      betOdd: model.betOdd,
      status: model.status,
    }

    this.match = new MatchDto(model.match);
  }
}
