import { MATCH_STATUSES } from '../enums';
import MatchDto from '../dtos/Match.dto';
import MatchModel from '../models/Match.model';

class MatchesService {
	async getMatches(status: MATCH_STATUSES): Promise<MatchDto[]> {
		const matches = await MatchModel.find({ status: status || MATCH_STATUSES.UPCOMING });

		return matches.map((match) => new MatchDto(match));
	}
}

export default new MatchesService();
