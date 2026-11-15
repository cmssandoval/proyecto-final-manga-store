import User from '../models/user.model.js';

/** @type {import('express').RequestHandler} */
export const registerUser = async ( req, res ) => {
    const userData = req.body;
    const user = await User.createUser(userData);
    return res.status(201).json({message: 'User created successfully!', user});
};

/** @type {import('express').RequestHandler} */
export const loginUser = async ( req, res ) => {
    const { email, password } = req.body;
    const token  = await User.verifyUserCredentials({ email, password });    
    return res.json({token});
};

/** @type {import('express').RequestHandler} */
export const getProfile = async ( req, res ) => {
    return res.json({
        user: req.user
        ? await User.findUserById(req.user.id)
        : null
    });
};

/** @type {import('express').RequestHandler} */
export const getUserWishlist = async (req, res) => {
    const wishlist = await User.findAllWishlist(req.user.id);
    return res.json({ wishlist });
};

/** @type {import('express').RequestHandler} */
export const addUserWishlist = async (req, res) => {
    const { mangaId } = req.body ?? {};

    if (typeof mangaId !== 'string' || mangaId.length === 0) {
        return res.status(400).json({ message: 'mangaId is required' });
    }

    const added = await User.addToWishlist(req.user.id, mangaId);
    if (added === null) {
        return res.status(404).json({ message: 'Manga not found' });
    }

    return res.status(added ? 201 : 200).json({ message: 'Manga added to wishlist' });
};
