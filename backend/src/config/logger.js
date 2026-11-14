import winston from 'winston';
const { combine, timestamp, printf, colorize, json } = winston.format;

const uppercaseLevel = winston.format((info) => {
    info.level = info.level.toUpperCase();
    return info;
});

const consoleFormat = combine(
    uppercaseLevel(),
    colorize({ all: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    printf(({ timestamp, level, message, clientIp, userId, method, url, status, contentLength, responseTime, ...meta }) => {
        if (method && url) {
            return `${timestamp} [${level}]: ${clientIp} [${userId}] - ${method} ${url} ${status} ${contentLength} - ${responseTime} ms`;
        }
        
        const extra = Object.keys(meta).length ? JSON.stringify(meta) : '';
        return `${timestamp} [${level}]: ${message} ${extra}`;
    }),
);

const fileFormat = combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    json(),
);

const filterLevel = (targetLevel) => {
  return winston.format((info) => {
    return info.level === targetLevel ? info : false;
  })();
};

const logger = winston.createLogger({
    level: 'http',
    transports: [
        new winston.transports.File({
            filename: 'src/logs/error.log',
            level: 'error',
            format: combine(filterLevel('error'), fileFormat),
        }),
        new winston.transports.File({
            filename: 'src/logs/info.log',
            level: 'info',
            format: combine(filterLevel('info'), fileFormat),
        }),
        new winston.transports.File({
            filename: 'src/logs/http.log',
            level: 'http',
            format: combine(filterLevel('http'), fileFormat),
        }),
    ],
    exitOnError: false,
});

const env = process.env.NODE_ENV;

if ( env === 'development' ) {
    logger.add(new winston.transports.Console({
        level: 'http',
        format: consoleFormat,
    }));
}

export default logger;