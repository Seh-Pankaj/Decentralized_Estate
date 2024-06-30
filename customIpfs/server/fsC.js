const fs = require('fs');

// Sample JSON object


const writeJsonFileSync=(jsonObject)=>{
// Convert JSON object to string
const jsonString = JSON.stringify(jsonObject, null, 2);

// Write JSON string to a file synchronously
try {
    fs.writeFileSync('output.json', jsonString);
    console.log('Successfully wrote file');
} catch (err) {
    console.error('Error writing file', err);
}
}

function readJsonFileSync(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        const jsonObject = JSON.parse(data);
        return jsonObject;
    } catch (err) {
        console.error('Error reading or parsing file', err);
        return null;
    }
}

function pushJsonFileSync(filePath,cid, clintId) {
    let data= readJsonFileSync(filePath);
    data={...data,[cid]:clintId }
    writeJsonFileSync(data)
}

module.exports={readJsonFileSync, writeJsonFileSync, pushJsonFileSync}