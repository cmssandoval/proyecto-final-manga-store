import User from '../models/user.model.js';

const notImplemented = (_req, res) =>
    res.status(501).json({ message: 'not implemented yet' });

/** @type {import('express').RequestHandler} */
export const registerUser = async ( req, res ) => {
    const userData = req.body;
    const user = await User.create(userData);
    return res.status(201).json({message: 'User created successfully!', user});
};

/** @type {import('express').RequestHandler} */
export const loginUser = async ( req, res ) => {
    const { email, password } = req.body;
    const token  = await User.verify({ email, password });    
    return res.json({token});
};

/** @type {import('express').RequestHandler} */
export const getProfile = async ( req, res ) => {
    return res.json({
        user: req.user
        ? await User.findById(req.user.id)
        : null
    });
};
