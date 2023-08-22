export default class UserDto {
	_id;
	email;
	balance;

	constructor(model) {
		this._id = model._id;
		this.email = model.email;
		this.balance = model.balance;
	}
};
