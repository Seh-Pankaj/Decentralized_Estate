// const { network } = require("hardhat");

// module.exports = async function ({ getNamedAccounts, deployments }) {
//   const { deploy } = deployments;
//   const { deployer } = await getNamedAccounts();

//   console.log("%s network detected...", network.name);
//   console.log("Deploying Decentralized Estate smart contract...");
//   console.log("Deployer : " + deployer);
//   const decEstate = await deploy("DecentralizedEstate", {
//     from: deployer,
//     log: true,
//     args: [],
//   });
//   const decAddress = decEstate.address;
//   console.log("Contract deployed at : " + decAddress);
//   console.log("_____________________________________________");
// };

// module.exports.tags = ["all", "contract"];

module.exports = () => {};
