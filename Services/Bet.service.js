const UserModel = require("../models/User.model");
const MatchModel = require("../models/Match.model");
const BetModel = require("../models/Bet.model");
const BetDto = require("../dtos/Bet.dto");
const {errorTypes} = require("../utils/error-generator");

class BetService {
  placeBet = async (email, matchId, teamId, betAmount) => {
    const match = await MatchModel.findOne({_id: matchId, status: 'upcoming', isLive: false})
    if (!match) {
      throw Error(`${errorTypes.VALIDATION} Match with this id does not exit!`);
    }

    if (match.homeTeam.teamId !== teamId && match.awayTeam.teamId !== teamId) {
      throw Error(`${errorTypes.VALIDATION} Team with this id does not exit!`);
    }

    const betOdd = match.homeTeam.teamId === teamId ? match.homeTeam.odd : match.awayTeam.odd
    if (!betOdd) {
      throw Error(`${errorTypes.VALIDATION} Odd does not exist!`);
    }

    const user = await UserModel.findOne({email}).populate('bets')
    if (user.balance < betAmount) {
      throw Error(`${errorTypes.VALIDATION} User do not have enough balance!`);
    }

    const isBetOnOtherTeamExist = user.bets.some(bet => bet.match === matchId && bet.teamId !== teamId)
    if (isBetOnOtherTeamExist) {
      throw Error(`${errorTypes.VALIDATION} You already bet to enemy team!`);
    }

    const bet = await BetModel.create({
      user: user._id,
      match,
      teamId,
      betAmount,
      betOdd,
      status: 'upcoming'
    });

    user.balance -= betAmount
    user.bets.unshift(bet._id)
    await user.save()

    return new BetDto(bet)
  }

  getBets = async (userEmail) => {
    const user = await UserModel.findOne({email: userEmail}).populate('bets').populate({
      path: 'bets',
      populate: {path: 'match'}
    })

    return user.bets.map((bet) => new BetDto(bet))
  }

  cancelBet = async (userEmail, betId) => {
    const user = await UserModel.findOne({email: userEmail}).populate('bets').populate({
      path: 'bets',
      populate: {path: 'match'}
    })

    const bets = []

    for (const bet of user.bets) {
      if (!bet._id.equals(betId)) {
        bets.push(bet)
      } else if (bet.match.isLive) {
        throw Error(`${errorTypes.VALIDATION} Can't cancel bet, match already in live!`)
      } else {
        user.balance += bet.betAmount
      }
    }

    user.bets = bets

    const bet = await BetModel.findOneAndDelete({_id: betId, status: 'upcoming'})

    if (!bet) {
      throw Error(`${errorTypes.VALIDATION} Bet were not found!`)
    }

    await user.save()
    return {}
  }
}

module.exports = new BetService()
