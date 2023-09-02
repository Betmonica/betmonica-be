import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Schema } from 'mongoose';
import { TokenData } from '../interfaces';
import UserDto from '../dtos/User.dto';
import UserModel from '../models/User.model';
import TokenModel from '../models/Token.model';
import { AuthenticateError, UnexpectedError, ValidationError } from '../utils/errors';

class UserService {
	login = async (email: string, password: string): Promise<TokenData> => {
		if (!email) {
			throw new ValidationError(`Miss "email" field!`);
		}

		if (!password) {
			throw new ValidationError(`Miss "password" field!`);
		}

		const user = await UserModel.findOne({ email });
		if (!user) {
			throw new AuthenticateError(`User with email: ${email}, does not exist!`);
		}

		const isPasswordCorrect = await bcrypt.compare(password, user.password);
		if (!isPasswordCorrect) {
			throw new AuthenticateError('Incorrect password!');
		}

		const userData = {
			_id: user._id,
			username: user.username,
			email,
			balance: user.balance
		};

		const accessToken = this.generateAccessToken(new UserDto(userData));
		const refreshToken = this.generateRefreshToken(new UserDto(userData));

		await TokenModel.create({
			userId: user._id,
			accessToken,
			refreshToken
		});

		return {
			accessToken,
			refreshToken
		};
	};

	logout = async (refreshToken: string) => {
		if (!refreshToken) {
			throw new ValidationError(`Miss "refreshToken" field!`);
		}

		await TokenModel.findOneAndDelete({ refreshToken });
		return {};
	};

	registration = async (username: string, email: string, password: string): Promise<TokenData> => {
		if (!username) {
			throw new ValidationError(`Miss "username" field!`);
		}

		if (!email) {
			throw new ValidationError(`Miss "email" field!`);
		}

		if (!password) {
			throw new ValidationError(`Miss "password" field!`);
		}

		const isUserWithSameEmailExist = !!(await UserModel.findOne({ email }));
		if (isUserWithSameEmailExist) {
			throw new AuthenticateError(`User with email: ${email}, already exist!`);
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const user = await UserModel.create({
			email,
			username,
			password: hashedPassword,
			balance: 1000,
			bets: []
		});

		const accessToken = this.generateAccessToken(new UserDto(user));
		const refreshToken = this.generateRefreshToken(new UserDto(user));

		await TokenModel.create({
			userId: user._id,
			accessToken,
			refreshToken
		});

		return {
			accessToken,
			refreshToken
		};
	};

	getBalance = async (userId: Schema.Types.ObjectId): Promise<number> => {
		if (!userId) {
			throw new ValidationError(`Miss "userId" field!`);
		}

		const user = await UserModel.findById(userId);
		if (!user) {
			throw new UnexpectedError(`User were not founded!`);
		}

		return user.balance;
	};

	refreshAccessToken = async (refreshToken: string): Promise<TokenData> => {
		if (!refreshToken) {
			throw new AuthenticateError(`Miss "refreshToken" field!`);
		}

		try {
			const tokens = await TokenModel.findOne({ refreshToken });
			if (!tokens) {
				throw new AuthenticateError(`Refresh token invalid!`);
			}

			const user = await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
			const accessToken = this.generateAccessToken(new UserDto(user));

			tokens.accessToken = accessToken;
			await tokens.save();

			return {
				accessToken
			};
		} catch (err) {
			throw new AuthenticateError(`Refresh token invalid!`);
		}
	};

	private generateAccessToken = (user): string => {
		return jwt.sign({ ...user }, process.env.ACCESS_TOKEN_SECRET, {
			expiresIn: '3h'
		});
	};

	private generateRefreshToken = (user): string => {
		return jwt.sign({ ...user }, process.env.REFRESH_TOKEN_SECRET);
	};
}

export default new UserService();
