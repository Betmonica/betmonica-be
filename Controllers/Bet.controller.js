const BetService = require("../Services/Bet.service");
const {errorsGenerator, errorTypes} = require("../utils/error-generator");

class BetController {
  async placeBet(req, res, next) {
    try {
      const {matchId, teamId, betAmount} = req.body
      const {email} = req.user

      const betData = await BetService.placeBet(email, matchId, teamId, betAmount)

      res.status(200).send({data: {bet: betData.bet, match: betData.match}, success: true})
    } catch (error) {
      next(errorsGenerator.checkErrorType(error))
    }
  }

  async getBets(req, res, next) {
    try {
      const {email} = req.user

      const bets = await BetService.getBets(email)

      res.status(200).send({data: {bets}, success: true})
    } catch (error) {
      next(errorsGenerator.checkErrorType(error))
    }
  }

  async cancelBet(req, res, next) {
    try {
      const {betId} = req.body
      const {email} = req.user

      if (!betId) {
        throw Error(`${errorTypes.VALIDATION} Bet id does not provided!`)
      }

      const data = await BetService.cancelBet(email, betId)

      res.status(200).send({data, success: true})
    } catch (error) {
      next(errorsGenerator.checkErrorType(error))
    }
  }
}

module.exports = new BetController();
