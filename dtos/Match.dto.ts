import { Schema } from 'mongoose';
import { MATCH_STATUSES } from '../enums';
import TeamDto from './Team.dto';

export default class MatchDto {
	id: Schema.Types.ObjectId;
	startDate: Date;
	slug: string;
	isLive: boolean;
	countMaps: number;
	tournament: string;
	tournamentId: string;
	tournamentLogo: string;
	teamWonId: string;
	homeTeam: TeamDto;
	awayTeam: TeamDto;
	status: MATCH_STATUSES;

	constructor(model) {
		this.id = model._id;
		this.status = model.status;
		this.startDate = model.startDate;
		this.slug = model.slug;
		this.isLive = model.isLive;
		this.countMaps = model.countMaps;
		this.tournament = model.tournament;
		this.tournamentId = model.tournamentId;
		this.tournamentLogo = model.tournamentLogo;
		this.teamWonId = model.teamWonId;
		this.homeTeam = new TeamDto(model.homeTeam);
		this.awayTeam = new TeamDto(model.awayTeam);
	}
}
