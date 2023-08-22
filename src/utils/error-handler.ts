class ErrorHandler {
  handleError = (err, req, res, next) => {
    if (err) {
      console.log("Something went wrong", JSON.stringify(err));
      res.status(400).send(err);
    }
  };
}

export default new ErrorHandler();
