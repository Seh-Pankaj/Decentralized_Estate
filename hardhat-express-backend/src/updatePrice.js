const index = require("../src/index");
const ethers = require("ethers");

const updatePrice = async (req, res) => {
  try {
    const contractInstance = index.getDeployedContractInstance();
    const tokenId = req.body.tokenId;
    const owner = req.body.owner;
    const newPropertyPrice = req.body.priceInEth;
    const newPriceInEth = ethers.parseEther(newPropertyPrice);

    // public to private key conversion stored in env file <- not the best practice
    const privateKey = addressToPrivateKey[owner];
    const hardhatURL = process.env.HARDHAT_URL;
    const provider = new ethers.JsonRpcProvider(hardhatURL);
    const wallet = new ethers.Wallet(privateKey, provider);
    const contractInstanceConnectedToNewOwner =
      contractInstance.connect(wallet);

    const updateTxn = await contractInstanceConnectedToNewOwner.updateItem(
      owner,
      tokenId,
      newPriceInEth
    );
    await updateTxn.wait(1);
    console.log("NFT Update successful!");

    const priceFromNFT =
      await contractInstanceConnectedToNewOwner.getEstatePrice(owner, tokenId);
    console.log("New price of NFT with TOKEN ID %d is ", tokenId, priceFromNFT);
    console.log("_______________________________________________");
    res.status(200).json("NFT Update successful");
  } catch (error) {
    console.error("Error in updating NFT ", error);
    res.status(418).json(`Error in updating NFT : ${error}`);
  }
};

module.exports = updatePrice;
