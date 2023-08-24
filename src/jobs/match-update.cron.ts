import axios from 'axios';
import MatchModel from '../models/Match.model';
import { UnexpectedError } from '../utils/errors';
import { MATCH_STATUSES } from '../enums';

class MatchUpdate {
	async updateMatches(): Promise<void> {
		try {
			const matches = await this._getMatches();
			await this._formatMatchesData(matches);
		} catch (error) {
			console.log(new UnexpectedError(error));
		}
	}

	async _formatMatchesData(matches): Promise<void> {
		for (const match of matches) {
			const delayToLive: number = 1000 * 60 * 5; // 5 minutes
			const currentTime: number = new Date().getTime();
			const matchTime: number = new Date(match.start_date).getTime();
			const isMatchStarted: boolean = matchTime < currentTime + delayToLive;

			await MatchModel.findByIdAndUpdate(
				match._id,
				{
					$set: {
						slug: match.slug,
						status: match.status,
						startDate: match.start_date,
						isLive: match.isLive || isMatchStarted || false,
						tournament: match.tournament,
						tournamentId: match.tournament_id,
						tournamentLogo: process.env.MATCHES_REFERER + match.tournament_logo,
						countMaps: parseInt(match.best_type.slice('Best of'.length)) || undefined,
						homeTeam: {
							teamId: match.home_team_id,
							odd: match.home_team_odd,
							name: match.home_team_name,
							countryCode: match.home_team_country_code,
							imageUrl: process.env.MATCHES_REFERER + match.home_team_logo
						},
						awayTeam: {
							teamId: match.away_team_id,
							odd: match.away_team_odd,
							name: match.away_team_name,
							countryCode: match.home_team_country_code,
							imageUrl: process.env.MATCHES_REFERER + match.away_team_logo
						}
					}
				},
				{ upsert: true }
			);
		}

		const objectMatches = matches.reduce((acc, match) => {
			acc[match._id] = match;
			return acc;
		}, {});
		const matchesFromDB: any = await MatchModel.find({ status: MATCH_STATUSES.UPCOMING });

		const matchesResult = await this._getMatchesResult();

		for (const match of matchesFromDB) {
			// if match does not exist in "matches" that comes from website, that means this match is end
			if (!objectMatches[match._id]) {
				const matchResult = await this._findMatchResultByMatchId(matchesResult, match._id);

				if (!matchResult) {
					match.teamWonId = null;
					match.status = MATCH_STATUSES.CANCELLED;
					match.isLive = false;

					match.homeTeam.score = 0;
					match.awayTeam.score = 0;
				} else {
					match.teamWonId =
						matchResult.home_team_score > matchResult.away_team_score
							? matchResult.home_team_id
							: matchResult.away_team_id;
					match.status = matchResult.status;
					match.isLive = false;

					match.homeTeam.score = matchResult.home_team_score;
					match.awayTeam.score = matchResult.away_team_score;
				}

				await match.save();
			}
		}
	}

	async _findMatchResultByMatchId(matchesResult, matchId) {
		return matchesResult.find((matchResult) => matchResult._id === matchId);
	}

	async _getMatches(game = 'counterstrike') {
		return axios
			.get(process.env.MATCHES_API + `/${game}/matches?lang=en`, {
				headers: {
					Referer: process.env.MATCHES_REFERER,
					'x-customheader': process.env.MATCHES_X_CUSTOM_HEAD
				}
			})
			.then((response) => response.data.recentMatches);
	}

	async _getMatchesResult(game = 'counterstrike') {
		return axios
			.get(process.env.MATCHES_API + `/${game}/matches/history?lang=en`, {
				headers: {
					Referer: process.env.MATCHES_REFERER,
					'x-customheader': process.env.MATCHES_RESULT_X_CUSTOM_HEAD
				}
			})
			.then((response) => response.data.finishedMatches);
	}
}

export default new MatchUpdate();
