const pinataSdk = require("@pinata/sdk");
const mintNft = require("./mintNft");

const uploadToIpfs = async (req, res) => {
  try {
    const hash = req.body.hash;
    const propertyPrice = req.body.priceInEth;
    const ownerAddress = req.body.ownerAddress;
    const ipfsUri = `${hash}`;
    const data=await mintNft(ownerAddress, propertyPrice, ipfsUri);
    console.log("data is ",data)
    res.status(201).send({...data, hash});
  } catch (e) {
    res.status(418).json(`Upload to IPFS failed : ${e}`);
  }
};

module.exports = uploadToIpfs;
