import { Schema } from 'mongoose';

export default class TeamDto {
	id: Schema.Types.ObjectId;
	odd: number;
	name: string;
	imageUrl: string;
	countryCode: string;

	constructor(model) {
		this.id = model.teamId;
		this.odd = model.odd;
		this.name = model.name;
		this.imageUrl = model.imageUrl;
		this.countryCode = model.countryCode;
	}
}
