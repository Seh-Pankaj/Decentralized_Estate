const ethers = require("ethers");
const index = require("../src/index");

const mintNft = async (ownerAddress, propertyPrice, ipfsUrl) => {
  try {
    const contractInstance = index.getDeployedContractInstance();
    const priceInEth = ethers.parseEther(propertyPrice);
    const tokenId = await contractInstance.getTokenId();
    const mintTxn = await contractInstance.listItem(
      ownerAddress,
      priceInEth,
      ipfsUrl
    );
    await mintTxn.wait(1);

    const tokenURI = await contractInstance.getTokenUri(tokenId);

    console.log("NFT minted Successfully with token Id : ", tokenId);
    console.log("Token URI : ", tokenURI);
    console.log("_______________________________________________");
    return {tokenId:`${tokenId}`, tokenURI}
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = mintNft;
