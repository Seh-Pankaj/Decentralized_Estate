const express = require("express");
require("dotenv").configDotenv();
const cors = require("cors")
// Contract Related Imports
const ethers = require("ethers");
const contractMetaData = require("../artifacts/contracts/decentralized_estate.sol/DecentralizedEstate.json");

// File Imports
const uploadToIpfs = require("./uploadToIpfs");
const transferNft = require("./transferNft");
const updatePrice = require("./updatePrice");
const withdrawAmounts = require("./withdrawAmounts");

// Express app
const app = express();
app.use(express.json());
const allowedOrigins = [
  "http://192.168.38.99:5173"

  // Add more URLs as needed
];

app.use(cors({
  origin: (origin, callback) => {
    console.log('Incoming request origin:', origin); // Log the origin of the request
    // Allow requests with no origin (like mobile apps, curl requests, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Origin not allowed by CORS');
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
const PORT = process.env.PORT;

app.post("/api/upload_to_ipfs", uploadToIpfs);
app.post("/api/transfer_nft", transferNft);
app.post("/api/update_nft_price", updatePrice);
app.post("/api/withdraw_amounts", withdrawAmounts);

app.listen(PORT, async () => {
  console.log(`Have a nice day at http://localhost:${PORT}`);
  await deployDecentralizedContract();
});

let contractInstance;
const deployDecentralizedContract = async () => {
  // Contract Deployment Code
  const abi = contractMetaData.abi;
  const bytecode = contractMetaData.bytecode;
  let provider, wallet, privateKey;
  const HARDHAT_URL = process.env.HARDHAT_URL;
  const alchemyApiKey = process.env.ALCHEMY_API;

  const networkName = "hardhat";

  if (networkName == "hardhat") {
    try {
      privateKey = process.env.HARDHAT_ZERO_PRIVATE_KEY;
      provider = new ethers.JsonRpcProvider(HARDHAT_URL);
      wallet = new ethers.Wallet(privateKey, provider);
      console.log("Provider and wallet succesfully created in hardhat...");
    } catch (e) {
      console.error("Error in assigning provider and wallet in hardhat", e);
    }
  } else if (networkName == "sepolia") {
    try {
      privateKey = process.env.SEPOLIA_PRIVATE_KEY;
      provider = new ethers.AlchemyProvider("sepolia", alchemyApiKey);
      wallet = new ethers.Wallet(privateKey, provider);
      console.log("Provider and wallet succesfully created in sepolia...");
    } catch (e) {
      console.error("Error in assigning provider and wallet in sepolia", e);
    }
  } else {
    console.log("Unsupported Chain!");
  }

  try {
    const contractFactory = new ethers.ContractFactory(abi, bytecode, wallet);
    contractInstance = await contractFactory.deploy();
    console.log(
      "Decentralized Estate Contract Instance deployed at",
      contractInstance.target
    );
  } catch (error) {
    console.error(error);
  }
};

exports.getDeployedContractInstance = () => contractInstance;
