/**
 * Truffle Configuration untuk Library Blockchain Project
 * 
 * DEPLOYMENT TARGET: Ethereum Sepolia Testnet
 * RPC PROVIDER: Alchemy
 * 
 * SETUP INSTRUCTIONS:
 * 1. Buat file .env di root folder
 * 2. Tambahkan:
 *    MNEMONIC="your twelve word mnemonic phrase here"
 *    ALCHEMY_API_KEY="your_alchemy_api_key_here"
 */

require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

const { MNEMONIC, ALCHEMY_API_KEY } = process.env;

module.exports = {
    networks: {
        // Local (Ganache) - untuk testing lokal
        development: {
            host: "127.0.0.1",
            port: 7545,
            network_id: "*",
        },

        // Sepolia testnet - Using Alchemy (more generous free tier)
        sepolia: {
            provider: () =>
                new HDWalletProvider({
                    mnemonic: { phrase: MNEMONIC },
                    providerOrUrl: ALCHEMY_API_KEY
                        ? `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`
                        : "https://eth-sepolia.g.alchemy.com/v2/demo",
                    pollingInterval: 15000,
                    numberOfAddresses: 1,
                    timeout: 120000,
                }),
            network_id: 11155111,
            confirmations: 2,
            timeoutBlocks: 500,
            skipDryRun: true,
            networkCheckTimeout: 300000,
            deploymentPollingInterval: 15000,
            gas: 3000000,
            gasPrice: 5000000000, // 5 Gwei (lebih murah)
        },
    },

    mocha: {
        // timeout: 100000
    },

    compilers: {
        solc: {
            version: "0.8.20",
        },
    },
};
