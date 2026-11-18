import User from '../models/user.model.js';
import parseRequest from '../utils/parse-request.js';
import { loginUserSchema, registerUserSchema } from '../schemas/user.schema.js';

/** @type {import('express').RequestHandler} */
export const registerUser = async ( req, res ) => {
    const userData = parseRequest(registerUserSchema, req.body, res);
    if (!userData) return;

    const user = await User.createUser(userData);
    return res.status(201).json({message: 'User created successfully!', user});
};

/** @type {import('express').RequestHandler} */
export const loginUser = async ( req, res ) => {
    const credentials = parseRequest(loginUserSchema, req.body, res);
    if (!credentials) return;

    const { email, password } = credentials;
    const token  = await User.verifyUserCredentials({ email, password });    
    return res.json({token});
};
