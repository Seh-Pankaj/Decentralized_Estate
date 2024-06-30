// dag.js
const { hashBlock } = require('./hasher');
const { chunkData } = require('./chunker');
const { LocalStorage } = require('./storage');

class MerkleDAG {
    constructor(storage) {
        this.storage = storage;
    }

    async createDAG(data, chunkSize) {
        const chunks = chunkData(data, chunkSize);
        console.log('Chunks:', chunks); // Debug: Check the chunked data
        const nodes = [];

        for (const chunk of chunks) {
            const cid = hashBlock(chunk);
            console.log('Chunk CID:', cid); // Debug: Check the CID for each chunk
            const node = { data: chunk.toString('base64'), links: [] };
            this.storage.storeBlock(cid, JSON.stringify(node));
            nodes.push({ cid, node });
        }

        while (nodes.length > 1) {
            const newNodes = [];
            for (let i = 0; i < nodes.length; i += chunkSize) {
                const chunk = nodes.slice(i, i + chunkSize);
                console.log('Chunk:', chunk); // Debug: Check the chunks being combined
                const links = chunk.map(n => n.cid);
                const combinedData = links.join('');
                const cid = hashBlock(Buffer.from(combinedData));
                console.log('Combined CID:', cid); // Debug: Check the CID for combined node
                const node = { data: '', links };
                this.storage.storeBlock(cid, JSON.stringify(node));
                newNodes.push({ cid, node });
            }
            nodes.length = 0;
            nodes.push(...newNodes);
        }

        console.log('Root CID:', nodes[0].cid); // Debug: Check the root CID
        return nodes[0].cid;
    }

    retrieveDAG(cid) {
        const nodeData = this.storage.retrieveBlock(cid);
        if (!nodeData) return null;

        const node = JSON.parse(nodeData);
        if (node.data) {
            return Buffer.from(node.data, 'base64');
        }

        const data = [];
        for (const link of node.links) {
            const chunk = this.retrieveDAG(link);
            if (chunk) {
                data.push(chunk);
            } else {
                console.error(`Missing chunk for CID: ${link}`); // Debug: Missing chunk
            }
        }
        return Buffer.concat(data);
    }
}

module.exports = { MerkleDAG };
