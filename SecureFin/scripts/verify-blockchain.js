const { ethers } = require("ethers");

// Configuration
const RPC_URL = "http://127.0.0.1:8545";
const SFT_ADDRESS = "0xeCe93A27254d238200824b9D5e1E532133772C20"; // Replace if needed

async function main() {
    console.log("🔄 Connecting to Ganache...");
    const provider = new ethers.JsonRpcProvider(RPC_URL);

    try {
        const network = await provider.getNetwork();
        console.log(`✅ Connected to network: ${network.name} (Chain ID: ${network.chainId})`);

        console.log("🔍 Checking SFT Contract...");
        const code = await provider.getCode(SFT_ADDRESS);
        if (code === "0x") {
            console.error("❌ No contract found at SFT_ADDRESS. Please check deployment.");
        } else {
            console.log("✅ Contract found at address.");

            // Basic ABI to check details
            const abi = [
                "function name() view returns (string)",
                "function symbol() view returns (string)",
                "function totalSupply() view returns (uint256)"
            ];
            const contract = new ethers.Contract(SFT_ADDRESS, abi, provider);

            try {
                const name = await contract.name();
                const symbol = await contract.symbol();
                const supply = await contract.totalSupply();
                console.log(`📜 Token Details: ${name} (${symbol})`);
                console.log(`💰 Total Supply: ${ethers.formatUnits(supply, 18)} ${symbol}`);
            } catch (e) {
                console.error("⚠️ Could not fetch token details (Check ABI or Contract):", e.message);
            }
        }

    } catch (error) {
        console.error("❌ Connection Failed:", error.message);
        console.log("👉 Make sure Ganache is running on port 8545");
    }
}

main();
