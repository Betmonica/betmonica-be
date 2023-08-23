import { model, Schema } from 'mongoose';

const matchSchema: Schema<any> = new Schema({
	_id: String,
	startDate: String,
	slug: String,
	isLive: Boolean,
	status: String,
	countMaps: Number,
	tournament: String,
	tournamentId: String,
	tournamentLogo: String,
	teamWonId: String,
	homeTeam: {
		teamId: String,
		name: String,
		imageUrl: String,
		score: Number,
		odd: Number
	},
	awayTeam: {
		teamId: String,
		name: String,
		imageUrl: String,
		score: Number,
		odd: Number
	}
});

export default model('match', matchSchema);
