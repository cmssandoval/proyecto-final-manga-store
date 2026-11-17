import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const JWT_SECRET = process.env.JWT_SECRET;

export const authHandler = (req, res, next) => {
  const [scheme, token] = (req.headers.authorization ?? '').split(" ");
  
  if (scheme !== 'Bearer' || !token) {
    req.user = null;
    return next();
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    return next(error);
  }
};

export const authGuard = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Authentication required' });
  next();
};

export const requireAdmin = async (req, res, next) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const isAdmin = await User.hasRole(userId, 'admin');
  if (!isAdmin) {
    return res.status(403).json({ message: 'Administrator access required' });
  }

  return next();
};
