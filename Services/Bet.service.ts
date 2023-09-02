import { Schema } from 'mongoose';
import { MatchWithBets, PlaceBetResponse } from '../interfaces';
import { BET_STATUSES, MATCH_STATUSES } from '../enums';
import BetDto from '../dtos/Bet.dto';
import MatchDto from '../dtos/Match.dto';
import UserModel from '../models/User.model';
import MatchModel from '../models/Match.model';
import BetModel from '../models/Bet.model';
import { AuthenticateError, ValidationError } from '../utils/errors';

class BetService {
	async placeBet(
		userId: Schema.Types.ObjectId,
		matchId: string,
		teamId: string,
		betAmount: number
	): Promise<PlaceBetResponse> {
		if (!userId) {
			throw new ValidationError(`Miss "userId" field!`);
		}

		if (!matchId) {
			throw new ValidationError(`Miss "matchId" field!`);
		}

		if (!teamId) {
			throw new ValidationError(`Miss "teamId" field!`);
		}

		if (!betAmount) {
			throw new ValidationError(`Miss "betAmount" field!`);
		}

		const match = await MatchModel.findOne({
			_id: matchId,
			status: MATCH_STATUSES.UPCOMING,
			isLive: false
		});
		if (!match) {
			throw new ValidationError(`Upcoming match with id: ${matchId}, were not founded!`);
		}

		if (match.homeTeam.teamId !== teamId && match.awayTeam.teamId !== teamId) {
			throw new ValidationError(`Team with id: ${teamId}, were not founded!`);
		}

		const betOdd: number = match.homeTeam.teamId === teamId ? match.homeTeam.odd : match.awayTeam.odd;
		if (!betOdd) {
			throw new ValidationError(`Odd does not exist!`);
		}

		const user: any = await UserModel.findById(userId).populate('bets');
		if (user.balance < betAmount) {
			throw new ValidationError(`User do not have enough balance!`);
		}

		const isBetOnOtherTeamExist: boolean = user.bets.some((bet: any) => bet.match === matchId && bet.teamId !== teamId);
		if (isBetOnOtherTeamExist) {
			throw new ValidationError(`You already have bet to enemy team!`);
		}

		const bet = await BetModel.create({
			user: user._id,
			match,
			teamId,
			betAmount,
			betOdd,
			status: BET_STATUSES.UPCOMING
		});

		user.balance -= betAmount;
		user.bets.unshift(bet._id);
		await user.save();

		return {
			bet: new BetDto(bet),
			match: new MatchDto(match)
		};
	}

	async getBetsByUserId(userId: Schema.Types.ObjectId): Promise<MatchWithBets[]> {
		if (!userId) {
			throw new ValidationError(`Miss "userId" field!`);
		}

		const user: any = await UserModel.findById(userId)
			.populate('bets')
			.populate({
				path: 'bets',
				populate: { path: 'match' }
			});

		return user.bets.map(
			(bet: any): MatchWithBets => ({
				bet: new BetDto(bet),
				match: new MatchDto(bet.match)
			})
		);
	}

	async cancelBet(userId: Schema.Types.ObjectId, betId: string): Promise<{}> {
		if (!userId) {
			throw new AuthenticateError(`Miss "userId" field!`);
		}

		if (!betId) {
			throw new ValidationError(`Miss "betId" field!`);
		}

		const user: any = await UserModel.findById(userId)
			.populate('bets')
			.populate({
				path: 'bets',
				populate: { path: 'match' }
			});

		const bets: BetDto[] = [];

		for (const bet of user.bets) {
			if (!bet._id.equals(betId)) {
				bets.push(bet);
			} else if (bet.match.isLive) {
				throw new ValidationError(`Can't cancel bet, match with id: ${bet.match._id} already in live!`);
			} else {
				user.balance += bet.betAmount;
			}
		}

		user.bets = bets;

		const bet = await BetModel.findOneAndDelete({
			_id: betId,
			status: BET_STATUSES.UPCOMING
		});

		if (!bet) {
			throw new ValidationError(`Bet were not found!`);
		}

		await user.save();
		return {};
	}
}

export default new BetService();
