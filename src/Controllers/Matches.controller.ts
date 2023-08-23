import MatchDto from '../dtos/Match.dto';
import MatchService from '../Services/Matches.service';
import { responseGenerator } from '../utils/response';

class MatchesController {
	async getMatches(req: any, res: any, next: Function): Promise<any> {
		try {
			const { status } = req.query;

			const matches: MatchDto[] = await MatchService.getMatches(status);

			res.status(200).send(responseGenerator.Success({ matches }));
		} catch (error) {
			next(error);
		}
	}
}

export const matchesController: MatchesController = new MatchesController();
