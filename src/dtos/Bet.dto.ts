import { Schema } from 'mongoose';
import { BET_STATUSES } from '../enums';

export default class BetDto {
	id: Schema.Types.ObjectId;
	matchId: string;
	teamId: string;
	betAmount: number;
	betOdd: number;
	status: BET_STATUSES;

	constructor(model) {
		this.id = model._id;
		this.matchId = model.match._id;
		this.teamId = model.teamId;
		this.betAmount = model.betAmount;
		this.betOdd = model.betOdd;
		this.status = model.status;
	}
}
