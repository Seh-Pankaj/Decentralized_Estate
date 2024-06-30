// const { ethers } = require("hardhat");

// const TOKEN_ID = 0;
// const NFT_PRICE = ethers.parseEther("0.01");

// module.exports = async ({ deployments, getNamedAccounts }) => {
//   const { deployer, player } = await getNamedAccounts();
//   let decEstate, decAddress;

//   decEstate = await ethers.getContract("DecentralizedEstate", deployer);
//   decAddress = decEstate.target;

//   const transferTxn = await decEstate.transferItem(
//     deployer,
//     player,
//     TOKEN_ID,
//     NFT_PRICE
//   );
//   await transferTxn.wait(1);

//   console.log("Transferred NFT from %s to %s", deployer, player);
//   console.log("_____________________________________________");

//   const newOwner = await decEstate.ownerOf(TOKEN_ID);
//   console.log("New owner of the NFT with tokenId  0 is ", newOwner);
//   console.log("_____________________________________________");
// };

module.exports = () => {};
