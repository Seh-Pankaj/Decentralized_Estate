import React, { useContext, useState } from 'react'
import { AuthContext } from "../../context/AuthContext";
import "./metamask.scss"
import { BLOCKCHAIN_SERVER } from '../../../api';
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
const Metamask = () => {
  const { walletAddress, setWalletAddress } = useContext(AuthContext);

  // Helper Functions

  // Requests access to the user's META MASK WALLET
  // https://metamask.io

  const releaseFunds = async ()=>{
    console.log("came here")
    try{
    const resp= await axios.post(`${BLOCKCHAIN_SERVER}/api/withdraw_amounts`,{
      "owner" : walletAddress
  })
  console.log(resp);
  toast(JSON.stringify(resp.data));
}catch(err){
  console.log(err.response.data);
  toast(`error : ${err.response.data}`);
}
  }

  async function requestAccount() {
    console.log('Requesting account...');

    // ❌ Check if Meta Mask Extension exists 
    if(window.ethereum) {
      console.log('detected');

      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
      } catch (error) {
        console.log('Error connecting...');
      }

    } else {
      alert('Meta Mask not detected');
    }
  }

  // Create a provider to interact with a smart contract
  async function connectWallet() {
    if(typeof window.ethereum !== 'undefined') {
      await requestAccount();

      const provider = new ethers.providers.Web3Provider(window.ethereum);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <button
        
        onClick={requestAccount}
        
        >Request Account</button>
        <h3 style={{paddingTop:10, paddingBottom:10}} >Wallet Address: {walletAddress}</h3>

        <button
        
        onClick={releaseFunds}
        
        >Release My funds</button>
        <ToastContainer/>
      </header>
    </div>
  );
}

export default Metamask