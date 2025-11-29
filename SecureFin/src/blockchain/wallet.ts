import { ethers } from "ethers";
import { GANACHE_RPC, CHAIN_ID, CHAIN_ID_HEX, SFT_TOKEN_ADDRESS } from "./config";
import SFT_ABI from "./sft-abi.json";

declare global {
    interface Window {
        ethereum?: any;
    }
}

let provider: ethers.BrowserProvider | null = null;
let signer: ethers.Signer | null = null;
let contract: ethers.Contract | null = null;

export async function connectWallet(): Promise<string> {
    try {
        if (typeof window === "undefined" || !window.ethereum) {
            throw new Error("MetaMask is not installed. Please install it to use this app.");
        }

        provider = new ethers.BrowserProvider(window.ethereum);

        // Request account access
        const accounts = await provider.send("eth_requestAccounts", []);
        if (!accounts || accounts.length === 0) {
            throw new Error("No accounts found");
        }

        // Check Network
        const network = await provider.getNetwork();
        if (Number(network.chainId) !== CHAIN_ID) {
            try {
                await window.ethereum.request({
                    method: "wallet_switchEthereumChain",
                    params: [{ chainId: CHAIN_ID_HEX }],
                });
            } catch (switchError: any) {
                // This error code indicates that the chain has not been added to MetaMask.
                if (switchError.code === 4902) {
                    await window.ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: [
                            {
                                chainId: CHAIN_ID_HEX,
                                chainName: "Ganache Local",
                                rpcUrls: [GANACHE_RPC],
                                nativeCurrency: {
                                    name: "ETH",
                                    symbol: "ETH",
                                    decimals: 18,
                                },
                            },
                        ],
                    });
                } else {
                    throw switchError;
                }
            }
        }

        signer = await provider.getSigner();
        const address = await signer.getAddress();

        // Initialize Contract
        contract = new ethers.Contract(SFT_TOKEN_ADDRESS, SFT_ABI, signer);

        return address;
    } catch (err) {
        console.error("Failed to connect wallet:", err);
        throw err;
    }
}

export async function getSFTBalance(address: string): Promise<string> {
    try {
        if (!contract) {
            // Try to initialize read-only if not connected
            if (window.ethereum) {
                const tempProvider = new ethers.BrowserProvider(window.ethereum);
                contract = new ethers.Contract(SFT_TOKEN_ADDRESS, SFT_ABI, tempProvider);
            } else {
                return "0.00";
            }
        }

        const rawBalance = await contract.balanceOf(address);
        return ethers.formatUnits(rawBalance, 18);
    } catch (err) {
        console.error("Error fetching SFT balance:", err);
        return "0.00";
    }
}

export async function getEthBalance(address: string): Promise<string> {
    try {
        if (!provider) {
            if (window.ethereum) {
                provider = new ethers.BrowserProvider(window.ethereum);
            } else {
                return "0.00";
            }
        }
        const balance = await provider.getBalance(address);
        return ethers.formatEther(balance);
    } catch (err) {
        console.error("Error fetching ETH balance:", err);
        return "0.00";
    }
}

export async function transferSFT(to: string, amount: string): Promise<string> {
    if (!signer || !contract) {
        throw new Error("Wallet not connected. Please connect your wallet first.");
    }

    try {
        const parsedAmount = ethers.parseUnits(amount, 18);
        const tx = await contract.transfer(to, parsedAmount);
        const receipt = await tx.wait();
        return receipt.hash;
    } catch (err: any) {
        console.error("Transfer failed:", err);
        throw new Error(err.reason || err.message || "Transaction failed");
    }
}

export function getShortAddress(address: string): string {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function subscribeToAccountChanges(callback: (address: string | null) => void) {
    if (typeof window !== "undefined" && window.ethereum) {
        window.ethereum.on("accountsChanged", async (accounts: string[]) => {
            if (accounts.length > 0) {
                // Re-initialize provider/signer with new account
                provider = new ethers.BrowserProvider(window.ethereum);
                signer = await provider.getSigner();
                contract = new ethers.Contract(SFT_TOKEN_ADDRESS, SFT_ABI, signer);
                callback(accounts[0]);
            } else {
                // Disconnected
                signer = null;
                contract = null;
                callback(null);
            }
        });

        window.ethereum.on("chainChanged", () => {
            window.location.reload();
        });
    }
}
