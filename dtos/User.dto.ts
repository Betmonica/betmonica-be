import { Schema } from 'mongoose';

export default class UserDto {
	id: Schema.Types.ObjectId;
	username: string;
	email: string;

	constructor(model) {
		this.id = model._id || model.id;
		this.username = model.username;
		this.email = model.email;
	}
}
