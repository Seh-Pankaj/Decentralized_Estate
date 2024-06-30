// hasher.js
const crypto = require('crypto');

function hashBlock(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
}

module.exports = { hashBlock };
