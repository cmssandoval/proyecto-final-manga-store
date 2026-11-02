import getDatabaseError from '../lib/errors/database.error.js';

const errorHandler = ( err, req, res, next ) => {
    console.log(err);

    if ( err.code ) {
        const { code, message } = getDatabaseError( err.code );
        return res.status(code).json({ message });
    }

    const status = err.status || 500;
    const message = ( status === 500 ) ? 'Internal Server Error' : err.message;    

    return res.status(status).json({ message });
};

export default errorHandler;
