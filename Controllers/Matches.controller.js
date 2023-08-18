const MatchService = require("../Services/Matches.service");
const {errorsGenerator} = require("../utils/error-generator");

class MatchesController {
  async getMatches(req, res, next) {
    try {
      const {status} = req.query;

      const matches = await MatchService.getMatches(status);

      return res.status(200).send({
        data: {
          matches,
        },
        success: true,
      });
    } catch (error) {
      next(errorsGenerator.checkErrorType(error));
    }
  }
}

module.exports = new MatchesController();
