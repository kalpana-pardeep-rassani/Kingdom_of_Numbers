const path = require('path');

module.exports = {
    port: Number(process.env.PORT || 3100),
    dbPath: process.env.DB_PATH || path.join(__dirname, '..', 'data', 'kingdom-of-numbers.sqlite'),
    accessTokenTtlMs: 1000 * 60 * 60 * 24 * 7,
    adminEmail: process.env.ADMIN_EMAIL || 'kalpanapardeeprassani@gmail.com',
    adminPassword: process.env.ADMIN_PASSWORD || 'kp9999',
    adminName: process.env.ADMIN_NAME || 'Kalpana Pardeep'
};
