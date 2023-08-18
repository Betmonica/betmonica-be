require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookies = require("cookie-parser");
const cron = require("node-cron");
const errorHandler = require("./utils/error-handler");
const MatchesRouter = require("./routes/Match.router");
const UserRouter = require("./routes/User.router");
const matchUpdateCron = require("./jobs/match-update.cron");
const userBetsUpdate = require("./jobs/user-bets-update.cron");
const PORT = process.env.PORT || 10000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookies());
app.use("/api/matches", MatchesRouter);
app.use("/api/user", UserRouter);
app.use(errorHandler.handleError);

const start = async () => {
  return mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("Success connect to mongoDB!");

    return app.listen(PORT, () => {
      console.log("Server start!");
    });
  });
};

start().then(() => {
  // Update matches and bets
  cron.schedule("*/5 * * * *", async () => {
    console.log('-----------------')
    console.log("Start updating!", new Date().toISOString());
    await matchUpdateCron.updateMatches().then(() => {
      console.log('Matches updated!', new Date().toISOString())
      return userBetsUpdate.updateBetsStatuses().then(() => {
        console.log('Bets updated!', new Date().toISOString())
      })
    });
    console.log("Updated!", new Date().toISOString());
    console.log('-----------------')
  });
});
