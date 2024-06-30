const index = require("../src/index");
const ethers = require("ethers");

const withdrawAmounts = async (req, res) => {
  try {
    const contractInstance = index.getDeployedContractInstance();
    const owner = req.body.owner;

    // public to private key conversion stored in env file <- not the best practice
    const privateKey = addressToPrivateKey[owner];
    const hardhatURL = process.env.HARDHAT_URL;
    const provider = new ethers.JsonRpcProvider(hardhatURL);
    const wallet = new ethers.Wallet(privateKey, provider);
    const contractInstanceConnectedToNewOwner =
      contractInstance.connect(wallet);

    const transferTxn =
      await contractInstanceConnectedToNewOwner.withdrawProceedings();
    await transferTxn.wait(1);
    console.log("Amounts withdrawn successfully!");
    console.log("_______________________________________________");

    res.status(200).json("Amounts withdrawn successfully!");
  } catch (error) {
    console.error("Error in withdrawing amounts ", error);
    res.status(418).json(`Error in withdrawing amounts : ${error}`);
  }
};

module.exports = withdrawAmounts;
