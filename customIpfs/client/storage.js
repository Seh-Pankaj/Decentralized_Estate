const fs = require('fs');
const path = require('path');

class LocalStorage {
    constructor(storageDir) {
        this.storageDir = storageDir;
        if (!fs.existsSync(storageDir)) {
            fs.mkdirSync(storageDir);
        }
    }

    storeBlock(cid, data) {
        const filePath = path.join(this.storageDir, cid);
        fs.writeFileSync(filePath, data);
    }

    retrieveBlock(cid) {
        const filePath = path.join(this.storageDir, cid);
        if (fs.existsSync(filePath)) {
            return fs.readFileSync(filePath);
        }
        return null;
    }
}

module.exports = { LocalStorage };