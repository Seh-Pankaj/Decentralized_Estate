const index = require("../src/index");
const ethers = require("ethers");

const transferNft = async (req, res) => {
  try {
    const contractInstance = index.getDeployedContractInstance();
    const tokenId = req.body.tokenId;
    const oldOwner = await contractInstance.ownerOf(tokenId);
    const newOwner = req.body.newOwner;
    const propertyPrice = req.body.priceInEth;
    const priceInEth = ethers.parseEther(propertyPrice);

    // public to private key conversion stored in env file <- not the best practice
    const privateKey = addressToPrivateKey[newOwner];
    const hardhatURL = process.env.HARDHAT_URL;
    const provider = new ethers.JsonRpcProvider(hardhatURL);
    const wallet = new ethers.Wallet(privateKey, provider);
    const contractInstanceConnectedToNewOwner =
      contractInstance.connect(wallet);

    const transferTxn = await contractInstanceConnectedToNewOwner.transferItem(
      oldOwner,
      newOwner,
      tokenId,
      { value: priceInEth }
    );
    await transferTxn.wait(1);
    console.log("NFT Transfer successful");
    console.log("New owner of NFT with TOKEN ID %d is ", tokenId, newOwner);
    console.log("_______________________________________________");

    res.status(200).json("NFT Transfer successful");
  } catch (error) {
    console.error("Error in transferring NFT ", error);
    res.status(418).json(`Error in transferring NFT : ${error}`);
  }
};




module.exports = transferNft;
