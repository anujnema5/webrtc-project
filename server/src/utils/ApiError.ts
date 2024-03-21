class ApiError extends Error {
    statusCode: number;
    success: boolean;
    error: string;

    constructor(
        statusCode: number,
        error: string = "Something went wrong",
        stack: string = ""
    ) {
        super(error);
        this.error = error
        this.statusCode = statusCode;
        this.success = false;
        this.error = error;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError };