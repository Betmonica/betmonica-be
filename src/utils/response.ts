interface Response<T> {
	data?: T;
	error?: T;
	success: boolean;
}

class ResponseGenerator {
	public Error<T>(error: T): Response<T> {
		return {
			error,
			success: false
		};
	}

	public Success<T>(data: T): Response<T> {
		return {
			data,
			success: true
		};
	}
}

export const responseGenerator: ResponseGenerator = new ResponseGenerator();
