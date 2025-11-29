
let provider;
let signer;
let contract;
let userAddress;

const connectBtn = document.getElementById("connectBtn");
const walletSection = document.getElementById("wallet-section");
const connectSection = document.getElementById("connect-section");
const userAddressSpan = document.getElementById("userAddress");
const userBalanceSpan = document.getElementById("userBalance");
const statusDiv = document.getElementById("status");
const sendBtn = document.getElementById("sendBtn");

async function connectWallet() {
    statusDiv.innerText = "";
    statusDiv.className = "";

    if (!window.ethereum) {
        showStatus("MetaMask is not installed!", "error");
        return;
    }

    try {
        provider = new ethers.BrowserProvider(window.ethereum);

        // Request Accounts
        await provider.send("eth_requestAccounts", []);

        // Check Network
        const network = await provider.getNetwork();
        if (Number(network.chainId) !== CHAIN_ID) {
            try {
                await window.ethereum.request({
                    method: "wallet_switchEthereumChain",
                    params: [{ chainId: CHAIN_ID_HEX }],
                });
            } catch (err) {
                if (err.code === 4902) {
                    await window.ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: [{
                            chainId: CHAIN_ID_HEX,
                            chainName: "Ganache Local",
                            rpcUrls: [GANACHE_RPC],
                            nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 }
                        }]
                    });
                } else {
                    throw err;
                }
            }
        }

        signer = await provider.getSigner();
        userAddress = await signer.getAddress();

        // Setup Contract
        contract = new ethers.Contract(SFT_TOKEN_ADDRESS, ERC20_ABI, signer);

        // Update UI
        userAddressSpan.innerText = `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;
        connectSection.style.display = "none";
        walletSection.style.display = "block";

        await updateBalance();
        showStatus("Connected successfully!", "success");

    } catch (error) {
        console.error(error);
        showStatus(error.message || "Connection failed", "error");
    }
}

async function updateBalance() {
    if (!contract || !userAddress) return;
    try {
        const rawBalance = await contract.balanceOf(userAddress);
        const balance = ethers.formatUnits(rawBalance, 18);
        userBalanceSpan.innerText = parseFloat(balance).toFixed(2);
    } catch (error) {
        console.error("Balance fetch error:", error);
    }
}

async function sendSFT() {
    const recipient = document.getElementById("recipient").value;
    const amount = document.getElementById("amount").value;

    if (!ethers.isAddress(recipient)) {
        showStatus("Invalid recipient address", "error");
        return;
    }
    if (!amount || parseFloat(amount) <= 0) {
        showStatus("Invalid amount", "error");
        return;
    }

    sendBtn.disabled = true;
    sendBtn.innerText = "Processing...";
    showStatus("Confirm transaction in MetaMask...", "success");

    try {
        const parsedAmount = ethers.parseUnits(amount, 18);
        const tx = await contract.transfer(recipient, parsedAmount);

        showStatus("Transaction sent! Waiting for confirmation...", "success");

        const receipt = await tx.wait();

        showStatus(`Mock Payment Successful! Hash: ${receipt.hash.slice(0, 10)}...`, "success");
        document.getElementById("amount").value = "";

        await updateBalance();
    } catch (error) {
        console.error(error);
        showStatus(error.reason || error.message || "Transaction failed", "error");
    } finally {
        sendBtn.disabled = false;
        sendBtn.innerText = "Send SFT";
    }
}

function showStatus(msg, type) {
    statusDiv.innerText = msg;
    statusDiv.className = type;
}

// Auto connect if already authorized
if (window.ethereum && window.ethereum.selectedAddress) {
    connectWallet();
}
