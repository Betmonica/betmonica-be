import { TokenData } from '../interfaces';
import UserService from '../Services/User.service';
import { responseGenerator } from '../utils/response';

class UserController {
	login = async (req: any, res: any, next: Function) => {
		try {
			const { email, password } = req.body;

			const tokens: TokenData = await UserService.login(email, password);

			res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true });
			res.status(200).send(
				responseGenerator.Success({
					accessToken: tokens.accessToken
				})
			);
		} catch (error) {
			next(error);
		}
	};

	logout = async (req, res, next) => {
		try {
			const refreshToken = req.cookies['refreshToken'];

			const data: {} = await UserService.logout(refreshToken);

			res.clearCookie('refreshToken');
			res.status(200).send(responseGenerator.Success(data));
		} catch (error) {
			next(error);
		}
	};

	registration = async (req, res, next) => {
		try {
			const { username, email, password } = req.body;

			const tokens: TokenData = await UserService.registration(username, email, password);

			res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true });
			res.status(200).send(
				responseGenerator.Success({
					accessToken: tokens.accessToken
				})
			);
		} catch (error) {
			next(error);
		}
	};

	getBalance = async (req, res, next) => {
		try {
			const { id: userId } = req.user;

			const balance: number = await UserService.getBalance(userId);

			res.status(200).send(responseGenerator.Success({ balance }));
		} catch (error) {
			next(error);
		}
	};

	token = async (req, res, next) => {
		try {
			const refreshToken = req.cookies['refreshToken'];

			const tokens: TokenData = await UserService.refreshAccessToken(refreshToken);

			res.status(200).send(
				responseGenerator.Success({
					accessToken: tokens.accessToken
				})
			);
		} catch (error) {
			next(error);
		}
	};
}

export default new UserController();
