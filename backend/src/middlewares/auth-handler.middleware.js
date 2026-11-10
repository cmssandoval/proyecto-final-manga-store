import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

const authHandler = ( req, res, next ) => {
    try {
        const [ scheme, token ] = ( req.headers.authorization ?? '' ).split(" ");
        if ( scheme !== 'Bearer' || !token ) return res.status(401).json({ message: 'No token provided' });
        if ( !token ) return res.status(401).json({ message: 'No token provided' });

        const payload = jwt.verify( token, JWT_SECRET, { algorithms: ['HS256'] });
        req.user = payload;
        
        return next();
    } catch (error) {
        if ( error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError' ) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
        return next(error);
    }
};

export default authHandler;
