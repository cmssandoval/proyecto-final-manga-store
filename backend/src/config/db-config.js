const dbconfig = process.env.NODE_ENV === 'production'
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: true,
            ca: fs.readFileSync('/etc/secrets/prod-ca-2021.crt', 'utf8'),
        },
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
    } : {
        allowExitOnIdle: true,
    };

export default dbconfig;
