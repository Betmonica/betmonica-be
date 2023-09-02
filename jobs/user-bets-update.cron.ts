import { BET_STATUSES, MATCH_STATUSES } from '../enums';
import BetModel from '../models/Bet.model';
import { UnexpectedError } from '../utils/errors';

class UserBetsUpdateCron {
	updateBetsStatuses = async () => {
		try {
			const upcomingBets: any = await BetModel.find({ status: MATCH_STATUSES.UPCOMING })
				.populate('match')
				.populate('user');

			for (const upcomingBet of upcomingBets) {
				const matchStatus = upcomingBet.match.status;

				switch (matchStatus.toLowerCase()) {
					case MATCH_STATUSES.CANCELLED:
						upcomingBet.user.balance += upcomingBet.betAmount;
						upcomingBet.status = BET_STATUSES.CANCELLED;
						break;
					case MATCH_STATUSES.FINISHED:
						if (upcomingBet.match.teamWonId === upcomingBet.teamId) {
							upcomingBet.status = BET_STATUSES.WON;
							upcomingBet.user.balance += upcomingBet.betAmount * upcomingBet.betOdd;
						} else {
							upcomingBet.status = BET_STATUSES.LOST;
						}
						break;
					case MATCH_STATUSES.UPCOMING:
						// Do not do anything
						break;
				}

				await upcomingBet.user.save();
				await upcomingBet.save();
			}
		} catch (error) {
			console.log(new UnexpectedError(`Something went wrong ${JSON.stringify(error)}`));
		}
	};
}

export default new UserBetsUpdateCron();
