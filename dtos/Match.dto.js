const TeamDto = require("./Team.dto");

module.exports = class MatchDto {
  id;
  startDate;
  slug;
  isLive;
  countMaps;
  tournament;
  tournamentId;
  tournamentLogo;
  teamWonId;
  homeTeam;
  awayTeam;
  status

  constructor(model) {
    this.id = model._id;
    this.status = model.status;
    this.startDate = model.startDate;
    this.slug = model.slug;
    this.isLive = model.isLive;
    this.countMaps = model.countMaps;
    this.tournament = model.tournament;
    this.tournamentId = model.tournamentId;
    this.tournamentLogo = model.tournamentLogo;
    this.teamWonId = model.teamWonId;
    this.homeTeam = new TeamDto(model.homeTeam);
    this.awayTeam = new TeamDto(model.awayTeam);
  }
};
