import jwt from 'jsonwebtoken';
import TokenModel from '../models/Token.model';
import { AuthenticateError, TokenExpiredError } from './errors';

const authenticateToken = async (req, res, next) => {
	const authHeader = req.headers['authorization'];

	const token = authHeader?.split(' ')[1];

	if (token == null) {
		next(new AuthenticateError(`Miss bearer token!`));
		return;
	}

	const tokens = await TokenModel.findOne({ accessToken: token });
	if (!tokens) {
		next(new AuthenticateError(`Access token is not defined in DB!`));
		return;
	}

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
		if (err) {
			if (err.name === 'TokenExpiredError') {
				await TokenModel.findOneAndDelete({ accessToken: token });
				next(new TokenExpiredError(`Token expired!`));
				return;
			}

			next(new AuthenticateError(`Bearer token error ${JSON.stringify(err)}!`));
			return;
		}

		req.user = user;
		next();
	});
};

export default authenticateToken;
