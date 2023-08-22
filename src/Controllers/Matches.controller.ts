import MatchService from '../Services/Matches.service';
import { errorsGenerator } from '../utils/error-generator';

class MatchesController {
	async getMatches(req, res, next): Promise<any> {
		try {
			const { status } = req.query;

			const matches = await MatchService.getMatches(status);

			return res.status(200).send({
				data: {
					matches
				},
				success: true
			});
		} catch (error) {
			next(errorsGenerator.checkErrorType(error));
		}
	}
}

export const matchesController: MatchesController = new MatchesController();
