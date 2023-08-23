import { Schema } from 'mongoose';

export default class UserDto {
	id: Schema.Types.ObjectId;
	email: string;
	balance: number;

	constructor(model) {
		this.id = model._id || model.id;
		this.email = model.email;
		this.balance = model.balance;
	}
}
