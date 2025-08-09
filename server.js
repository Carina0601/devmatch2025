// server.js
const express = require('express');
const { ethers } = require('ethers');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config(); // To load PRIVATE_KEY and RPC_URL from .env

const app = express();
app.use(bodyParser.json());

// Load env vars from .env or set here directly
const privateKey = process.env.PRIVATE_KEY || 'YOUR_ADMIN_PRIVATE_KEY_HERE';
const rpcUrl = process.env.RPC_URL || 'https://your-rpc-url-for-network';
const contractAddress = '0xe3D13c05C2aA9f85F25Ec721cCf60B22CC772db2';
const abi = require('./abi/DonationApproval.json'); // place ABI JSON file here

const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
const wallet = new ethers.Wallet(privateKey, provider);
const contract = new ethers.Contract(contractAddress, abi, wallet);

// Serve static frontend files (optional)
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/approve-request', async (req, res) => {
  try {
    const { id, amount } = req.body;
    if (!id || !amount) {
      return res.status(400).json({ error: 'Missing id or amount' });
    }

    console.log(`Approving request id: ${id}, amount: ${amount}`);

    const tx = await contract.approveRequest(ethers.BigNumber.from(id), ethers.BigNumber.from(amount));
    await tx.wait();

    res.json({ success: true, txHash: tx.hash });
  } catch (err) {
    console.error('Error in approve-request:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend API server listening on port ${PORT}`);
});
