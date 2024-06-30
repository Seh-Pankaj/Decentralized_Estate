// const { network, ethers } = require("hardhat");
// const {
//   developmentChains,
//   networkConfig,
// } = require("../helper-hardhat-config.js");
// const { verify } = require("../utils/verfiy.js");

// const NFT_PRICE = ethers.parseEther("0.01");

// module.exports = async function ({ getNamedAccounts }) {
//   const { deployer } = await getNamedAccounts();
//   let decEstate, decAddress;
//   const tokenURI =
//     "https://gateway.pinata.cloud/ipfs/QmSsngnBWX4D7sZ7UqDhwswFUsN8noYbGh3y9LjNjLeWZU";

//   decEstate = await ethers.getContract("DecentralizedEstate", deployer);
//   decAddress = decEstate.target;

//   const mintTxn = await decEstate.listItem(deployer, NFT_PRICE, tokenURI);
//   await mintTxn.wait(1);

//   if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API) {
//     console.log(
//       `NFT Minted! Check it out at: https://sepolia.etherscan.io/tx/${mintTxn.hash}`
//     );
//     await verify(decAddress, []);
//     console.log("Contract Code verified on Etherscan.");
//   } else {
//     console.log("NFT minted!");
//   }
//   console.log("_____________________________________________");

//   const tokenUri = await decEstate.getTokenUri(0);
//   const owner = await decEstate.ownerOf(0);
//   console.log("Token URI of NFT with token Id %d is %s", 0, tokenUri);
//   console.log("Owner of NFT with token Id %d is %s", 0, owner);
//   console.log("_____________________________________________");
// };

// module.exports.tags = ["all", "mint"];

module.exports = () => {};
