function chunkData(jsonData, chunkSize) {
    const data = Buffer.from(JSON.stringify(jsonData));
    console.log(data, data.length)
    const chunks = [];
    for (let i = 0; i < data.length; i += chunkSize) {
        chunks.push(data.slice(i, i + chunkSize));
    }
    return chunks;
}

module.exports = { chunkData };