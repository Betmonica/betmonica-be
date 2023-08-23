import { AuthenticateError, ValidationError, ERROR_TYPES } from './errors';
import { responseGenerator } from './response';

class ErrorHandler {
	handleError(err, req, res, next) {
		if (!err) {
			return;
		}

		let type: string = ERROR_TYPES.UNEXPECTED;
		let message: string = err.message || 'Unexpected error!';

		if (err instanceof AuthenticateError || err instanceof ValidationError) {
			type = err.type;
			message = err.message;
		}

		console.log('Something went wrong', { type, message });
		res.status(200).send(responseGenerator.Error({ type, message }));
	}
}

export default new ErrorHandler();
