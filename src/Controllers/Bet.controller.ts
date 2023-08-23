import { MatchWithBets, PlaceBetResponse } from '../interfaces';
import UserDto from '../dtos/User.dto';
import BetService from '../Services/Bet.service';
import { responseGenerator } from '../utils/response';

class BetController {
	async placeBet(req: any, res: any, next: Function): Promise<void> {
		try {
			const { matchId, teamId, betAmount } = req.body;
			const { id: userId }: UserDto = req.user;

			const betData: PlaceBetResponse = await BetService.placeBet(userId, matchId, teamId, betAmount);

			res.status(200).send(responseGenerator.Success({ bet: betData.bet, match: betData.match }));
		} catch (error) {
			next(error);
		}
	}

	async getBets(req: any, res: any, next: Function): Promise<void> {
		try {
			const { id: userId }: UserDto = req.user;

			const bets: MatchWithBets[] = await BetService.getBetsByUserId(userId);

			res.status(200).send(responseGenerator.Success({ bets }));
		} catch (error) {
			next(error);
		}
	}

	async cancelBet(req: any, res: any, next: Function): Promise<void> {
		try {
			const { id: userId }: UserDto = req.user;
			const { betId } = req.body;

			await BetService.cancelBetByUserId(userId, betId);

			res.status(200).send(responseGenerator.Success({}));
		} catch (error) {
			next(error);
		}
	}
}

export const betController: BetController = new BetController();
