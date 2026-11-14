import morgan from 'morgan';
import logger from '../config/logger.js';

morgan.token('client-ip', (req) => {
    return req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip;
});

morgan.token('user-id', (req) => {
    return req.user ? req.user.id : 'anonymous';
});

const morganJsonFormat = (tokens, req, res) => {
    return JSON.stringify({
        clientIp: tokens['client-ip'](req, res),
        userId: tokens['user-id'](req, res),
        method: tokens.method(req, res),
        url: tokens.url(req, res),
        status: Number(tokens.status(req, res)),
        contentLength: tokens.res(req, res, 'content-length') || 0,
        responseTime: Number(tokens['response-time'](req, res)),
    });
};

const stream = {
    write: (message) => {
        const data = JSON.parse(message);
        logger.http('HTTP Request', data);
    },
};

const morganHandler = morgan(morganJsonFormat, { stream });

export default morganHandler;