module.exports = class TeamDto {
  odd;
  id;
  name;
  imageUrl;
  countryCode;

  constructor(model) {
    this.id = model.teamId;
    this.odd = model.odd;
    this.name = model.name;
    this.imageUrl = model.imageUrl;
    this.countryCode = model.countryCode;
  }
};
