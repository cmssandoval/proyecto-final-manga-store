import 'dotenv/config';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

const authHandler = ( req, res, next ) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if ( !token ) return res.status(401).json({ message: 'No token provided' });

        const payload = jwt.verify( token, JWT_SECRET );
        req.user = payload;
        
        return next();
    } catch (error) {
        return next(error);
    }
};

export default authHandler;
