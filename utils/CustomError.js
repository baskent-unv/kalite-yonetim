class CustomError extends Error {
    constructor(message, statusCode, errorType) {
        super(message);
        this.statusCode = statusCode;
        this.errorType = errorType;
        Error.captureStackTrace(this, this.constructor);
    }
}

export default CustomError;