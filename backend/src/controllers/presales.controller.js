import Presales from '../models/presales.model.js';
import {
    createPresaleSchema,
    presaleParamsSchema,
} from '../schemas/presales.schema.js';
import parseRequest from '../utils/parse-request.js';

/** @type {import('express').RequestHandler} */
export const getPresales = async (req, res) => {
    const presales = await Presales.findAllByUserId(req.user.id);
    return res.json({ presales });
};

/** @type {import('express').RequestHandler} */
export const getPresaleById = async (req, res) => {
    const params = parseRequest(presaleParamsSchema, req.params, res);
    if (!params) return;

    const presale = await Presales.findById(params.id, req.user.id);
    if (!presale) return res.status(404).json({ message: 'Presale not found' });
    return res.json({ presale });
};

/** @type {import('express').RequestHandler} */
export const createPresale = async (req, res) => {
    const input = parseRequest(createPresaleSchema, req.body, res);
    if (!input) return;

    const presaleId = await Presales.create({ userId: req.user.id, ...input });
    const presale = await Presales.findById(presaleId, req.user.id);
    return res.status(201).json({ presale });
};
