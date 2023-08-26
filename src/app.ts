import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookies from 'cookie-parser';
import cron from 'node-cron';

import errorHandler from './utils/error-handler';
import accessControlAllowValidation from './utils/access-control-allow-validation';
import MatchesRouter from './routes/Match.router';
import UserRouter from './routes/User.router';
import matchUpdateCron from './jobs/match-update.cron';
import userBetsUpdate from './jobs/user-bets-update.cron';

const PORT: number = +process.env.PORT || 10000;

dotenv.config();

const app = express();

app.use(cookies());
app.use(accessControlAllowValidation.validate);
app.use(
	cors({
		origin: process.env.ORIGIN_LINK
	})
);
app.use(express.json());
app.use('/api/matches', MatchesRouter);
app.use('/api/user', UserRouter);
app.use(errorHandler.handleError);

const start = async () => {
	return mongoose.connect(process.env.MONGO_URL).then(() => {
		console.log('Success connect to mongoDB!');

		return app.listen(PORT, () => {
			console.log('Server start!');
		});
	});
};

start().then(() => {
	// Update matches and bets
	cron.schedule('*/5 * * * *', async () => {
		console.log('-----------------');
		console.log('Start updating!', new Date().toISOString());
		await matchUpdateCron.updateMatches().then(() => {
			console.log('Matches updated!', new Date().toISOString());
			return userBetsUpdate.updateBetsStatuses().then(() => {
				console.log('Bets updated!', new Date().toISOString());
			});
		});
		console.log('Updated!', new Date().toISOString());
		console.log('-----------------');
	});
});
