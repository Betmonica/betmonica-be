const {model, Schema} = require("mongoose");

const matchSchema = new Schema({
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
    odd: Number,
  },
  awayTeam: {
    teamId: String,
    name: String,
    imageUrl: String,
    score: Number,
    odd: Number,
  },
});

module.exports = model("match", matchSchema);
