class ErrorHandler {
  handleError(err, req, res) {
    if (err) {
      console.log("Something went wrong", JSON.stringify(err));
      res.status(400).send(err);
    }
  }
}

module.exports = new ErrorHandler();
