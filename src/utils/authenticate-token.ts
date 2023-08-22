import jwt from 'jsonwebtoken';
import { errorsGenerator, errorTypes } from './error-generator';
import TokenModel from '../models/Token.model';

const authenticateToken = async (req, res, next) => {
	const authHeader = req.headers['authorization'];

	const token = authHeader?.split(' ')[1];

	if (token == null) {
		next(
			errorsGenerator.checkErrorType(
				`${errorTypes.AUTHENTICATE} Miss bearer token!`
			)
		);
		return;
	}

	const tokens = await TokenModel.findOne({ accessToken: token });
	if (!tokens) {
		next(
			errorsGenerator.checkErrorType(
				`${errorTypes.AUTHENTICATE} Access token is not defined in DB!`
			)
		);
		return;
	}

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
		if (err) {
			if (err.name === 'TokenExpiredError') {
				await TokenModel.findOneAndDelete({ accessToken: token });
				next(
					errorsGenerator.checkErrorType(
						`${errorTypes.AUTHENTICATE} Token expired!`
					)
				);
				return;
			}
			next(
				errorsGenerator.checkErrorType(
					`${errorTypes.AUTHENTICATE} Bearer token error ${JSON.stringify(
						err
					)}!`
				)
			);
			return;
		}

		req.user = user;
		next();
	});
};

export default authenticateToken
