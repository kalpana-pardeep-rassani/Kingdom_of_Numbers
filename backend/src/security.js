const crypto = require('crypto');

function createId(prefix = 'id') {
    return `${prefix}_${crypto.randomUUID()}`;
}

function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const derivedKey = crypto.scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${derivedKey}`;
}

function verifyPassword(password, storedHash) {
    const [salt, originalKey] = String(storedHash || '').split(':');
    if (!salt || !originalKey) {
        return false;
    }

    const derivedKey = crypto.scryptSync(password, salt, 64).toString('hex');
    const originalBuffer = Buffer.from(originalKey, 'hex');
    const derivedBuffer = Buffer.from(derivedKey, 'hex');

    if (originalBuffer.length !== derivedBuffer.length) {
        return false;
    }

    return crypto.timingSafeEqual(originalBuffer, derivedBuffer);
}

function createAccessToken() {
    return crypto.randomBytes(32).toString('hex');
}

function hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
}

module.exports = {
    createId,
    hashPassword,
    verifyPassword,
    createAccessToken,
    hashToken
};
