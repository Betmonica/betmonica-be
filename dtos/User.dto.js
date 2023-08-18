module.exports = class UserDto {
  _id;
  email;

  constructor(model) {
    this._id = model._id;
    this.email = model.email;
  }
};
