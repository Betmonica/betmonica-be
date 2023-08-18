const BetModel = require('../models/Bet.model')
const {errorsGenerator, errorTypes} = require('../utils/error-generator')

class UserBetsUpdateCron {
  updateBetsStatuses = async () => {
    try {

      const upcomingBets = await BetModel.find({status: 'upcoming'}).populate('match').populate('user')

      for (const upcomingBet of upcomingBets) {
        const matchStatus = upcomingBet.match.status;

        switch (matchStatus.toLowerCase()) {
          case 'cancelled':
            upcomingBet.user.balance += upcomingBet.betAmount;
            upcomingBet.status = 'cancelled'
            break;
          case 'finished':
            if (upcomingBet.match.teamWonId === upcomingBet.teamId) {
              upcomingBet.status = 'win'
              upcomingBet.user.balance += upcomingBet.betAmount * upcomingBet.betOdd;
            } else {
              upcomingBet.status = 'lose'
            }
            break;
          case 'upcoming':
            // Do not do anything
            break;
        }

        await upcomingBet.user.save()
        await upcomingBet.save()
      }
    } catch (error) {
      console.log(errorsGenerator.checkErrorType(`${errorTypes.CRON_JOB} Something went wrong ${JSON.stringify(error)}`));
    }
  }
}

module.exports = new UserBetsUpdateCron()

