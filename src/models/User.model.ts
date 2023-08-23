import { model, Schema } from 'mongoose';

const userSchema: Schema<any> = new Schema({
	email: { type: String, required: true },
	password: { type: String, required: true },
	balance: { type: Number, required: true },
	bets: [
		{
			type: Schema.Types.ObjectId,
			ref: 'bet'
		}
	]
});

export default model('user', userSchema);
