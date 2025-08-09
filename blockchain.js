const contractAddress = '0x55fa2b4C7703Deb461352aaf9952000E1543167c'; // Replace with your deployed address
let abi; // Will be loaded dynamically

let provider;
let signer;
let contract;

async function loadAbi() {
  if (!abi) {
    const response = await fetch('path/to/your/abi.json'); // relative path to your ABI file
    if (!response.ok) {
      throw new Error('Failed to load ABI file');
    }
    abi = await response.json();
  }
  return abi;
}

async function connectWallet() {
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();

    await loadAbi(); // ensure ABI is loaded
    contract = new ethers.Contract(contractAddress, abi, signer);

    return await signer.getAddress();
  } else {
    alert("Please install MetaMask to interact with this dApp.");
    throw new Error("No Ethereum wallet found");
  }
}

async function getContract() {
  if (!contract) {
    await connectWallet();
  }
  return contract;
}

async function getBalance() {
  const contract = await getContract();
  const balance = await contract.getBalance();
  return ethers.utils.formatEther(balance);
}
