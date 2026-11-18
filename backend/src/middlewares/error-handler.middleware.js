import logger from '../config/logger.js';
import getDatabaseError from '../lib/errors/database.error.js';

const errorHandler = ( err, req, res, next ) => {
    logger.error(err.message || 'Error no controlado', {
        stack: err.stack,
        method: req.method,
        url: req.originalUrl,
        clientIp: req.ip,
        userId: req.user?.id || 'anonymous',
        code: err.code
    });

    if ( err.code ) {
        const { code, message } = getDatabaseError( err.code );
        return res.status(code).json({ message });
    }

    const status = err.status || 500;
    const message = ( status === 500 ) ? 'Internal Server Error' : err.message;    

    return res.status(status).json({ message });
};

export default errorHandler;
