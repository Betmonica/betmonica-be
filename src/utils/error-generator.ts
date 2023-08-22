export const errorTypes = {
	VALIDATION: '[VALIDATION]',
	UNEXPECTED: '[UNEXPECTED]',
	AUTHENTICATE: '[AUTHENTICATE]',
	CRON_JOB: '[CRON_JOB]'
};

class ErrorsGenerator {
	checkErrorType(error) {
		let errorType;
		let errorMessage;

		if (typeof error === 'object' && error.message) {
			errorMessage = error.message;
			errorType = errorMessage.split(' ')[0].trim();

			if (Object.values(errorTypes).includes(errorType)) {
				errorMessage = errorMessage.slice(errorType.length).trim();
				errorType = errorType.slice(1, -1);
			} else {
				errorType = errorTypes.UNEXPECTED;
			}
		} else if (typeof error === 'string') {
			errorType = error.split(' ')[0].trim().slice(1, -1);
			errorMessage = error.slice(errorType.length + 2).trim();
		} else {
			return this._generateError(errorTypes.UNEXPECTED.slice(1, -1), error);
		}

		return this._generateError(errorType, errorMessage);
	}

	_generateError(type, message) {
		return {
			error: {
				type,
				message
			},
			success: false
		};
	}
}

export const errorsGenerator = new ErrorsGenerator();
