const {io} = require("socket.io-client")
let address="http://192.168.38.99:4007"
const socket = io(address)
const express=require("express")
const { LocalStorage } = require('./storage');
const { MerkleDAG } = require('./dag');
require("dotenv").config()
const app= express();

const storageDir = './blocks';
const localStorage = new LocalStorage(storageDir);
const merkleDAG = new MerkleDAG(localStorage);

socket.on("createDag",async (msg,callback)=>{
    const chunkSize = 512; // example chunk size
    console.log(msg)
    const rootCID = await merkleDAG.createDAG(msg, chunkSize);
    const response = { response:rootCID };
    callback(response);
})

socket.on("getDag",async (msg,callback)=>{
    // const chunkSize = 8; // example chunk size
    const data = await merkleDAG.retrieveDAG(msg);
    // const response = { response:rootCID };

    callback(JSON.parse( data));
})


socket.on('connect', () => {
    console.log('Connected to server with socket ID:', socket.id);

    // Send clientId to the server for registration
    socket.emit('register',process.env.NAME);
});

socket.on("addData",(data)=>{
    console.log(data)
})

socket.on("getData",(msg,callback)=>{
    console.log('Message received:', msg);
    
    // Process the message and send a response back to the server
    const response = { status: 'Message received', timestamp: new Date() };
    callback(response);
})
app.listen("4006",()=>{
    console.log("client running at 4006")
    console.log(`${process.env.HOST}:4007`)

})
