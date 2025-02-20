import CustomError from "../utils/CustomError.js"
import { logError } from "../utils/logger.js"

export const errorHandler = (err, req, res, next) => {
    if (err instanceof CustomError) {
        logError(err);

        return res.status(err.statusCode).json({
            errorType: err.errorType,
            message: err.message
        })
    }

    logError(err);

    return res.status(500).json({
        message: 'Internal Server Error'
    })
}