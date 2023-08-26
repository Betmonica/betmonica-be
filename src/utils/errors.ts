class BaseError extends Error {
	type: string;

	constructor(type: string, description: string) {
		super(description);

		Object.setPrototypeOf(this, new.target.prototype);
		this.type = type;
		Error.captureStackTrace(this);
	}
}

export enum ERROR_TYPES {
	VALIDATION = 'Validation',
	UNEXPECTED = 'Unexpected',
	AUTHENTICATE = 'Authenticate',
	TOKEN_EXPIRED_ERROR = 'TokenExpiredError'
}

export class ValidationError extends BaseError {
	constructor(description: string = 'Validation Error') {
		super(ERROR_TYPES.VALIDATION, description);
	}
}

export class UnexpectedError extends BaseError {
	constructor(description: string = 'Unexpected Error') {
		super(ERROR_TYPES.UNEXPECTED, description);
	}
}

export class AuthenticateError extends BaseError {
	constructor(description: string) {
		super(ERROR_TYPES.AUTHENTICATE, description);
	}
}

export class TokenExpiredError extends BaseError {
	constructor(description: string) {
		super(ERROR_TYPES.TOKEN_EXPIRED_ERROR, description);
	}
}

export class CheckErrorType {
	error: any;

	constructor(error) {
		this.error = error;
	}

	checkErrorType() {
		if (this.error instanceof ValidationError) {
		}
	}
}
