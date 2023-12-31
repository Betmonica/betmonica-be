import { model, Schema } from 'mongoose';

const betSchema: Schema<any> = new Schema({
	user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
	match: { type: String, ref: 'match', required: true },
	teamId: { type: String, required: true },
	betAmount: { type: Number, required: true },
	betOdd: { type: Number, required: true },
	status: { type: String, required: true }
});

export default model('bet', betSchema);
