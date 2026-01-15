import React, { createContext, useContext, useState, useEffect } from 'react';
import Web3 from 'web3';
import { CONTRACT_ADDRESS } from '../constants';
import LibraryABI from '../abi/Library.json';

const Web3Context = createContext();

export const useWeb3 = () => {
    const context = useContext(Web3Context);
    if (!context) {
        throw new Error('useWeb3 must be used within Web3Provider');
    }
    return context;
};

export const Web3Provider = ({ children }) => {
    const [web3, setWeb3] = useState(null);
    const [contract, setContract] = useState(null);
    const [account, setAccount] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isMember, setIsMember] = useState(false);
    const [loading, setLoading] = useState(false);

    const connectWallet = async () => {
        try {
            setLoading(true);

            if (!window.ethereum) {
                alert('Please install MetaMask!');
                return;
            }

            console.log('🔌 [Web3Context] Requesting wallet connection...');

            // IMPORTANT: Use eth_requestAccounts to force MetaMask permission popup
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });

            console.log('✅ [Web3Context] Accounts received:', accounts);

            const web3Instance = new Web3(window.ethereum);
            const chainId = await web3Instance.eth.getChainId();

            console.log('🌐 [Web3Context] Network chainId:', chainId);

            if (Number(chainId) !== 11155111) {
                alert('Please switch to Sepolia network');
                return;
            }

            console.log('✅ [Web3Context] Connected to Sepolia network');
            console.log('📍 [Web3Context] Contract address:', CONTRACT_ADDRESS);
            console.log('📄 [Web3Context] Loading ABI...');

            const contractInstance = new web3Instance.eth.Contract(
                LibraryABI.abi,
                CONTRACT_ADDRESS
            );

            console.log('✅ [Web3Context] Contract instance created');
            console.log('🔧 [Web3Context] Available contract methods:', Object.keys(contractInstance.methods));

            // Verify critical methods exist
            const criticalMethods = ['getAllBorrowHistory', 'getMemberBorrowHistory', 'getBook', 'borrowBook', 'returnBook'];
            const missingMethods = criticalMethods.filter(method => !contractInstance.methods[method]);

            if (missingMethods.length > 0) {
                console.error('❌ [Web3Context] Missing critical methods:', missingMethods);
            } else {
                console.log('✅ [Web3Context] All critical methods available');
            }

            const adminAddress = await contractInstance.methods.admin().call();
            const isAdminUser = adminAddress.toLowerCase() === accounts[0].toLowerCase();

            console.log('👤 [Web3Context] Connected account:', accounts[0]);
            console.log('👑 [Web3Context] Admin address:', adminAddress);
            console.log('🔐 [Web3Context] Is admin:', isAdminUser);

            let isMemberUser = false;
            try {
                isMemberUser = await contractInstance.methods.isMember(accounts[0]).call();
                console.log('📝 [Web3Context] Is member:', isMemberUser);
            } catch (error) {
                console.log('ℹ️ [Web3Context] Not a member yet');
            }

            setWeb3(web3Instance);
            setContract(contractInstance);
            setAccount(accounts[0]);
            setIsAdmin(isAdminUser);
            setIsMember(isMemberUser);

            console.log('✅ [Web3Context] Wallet connected successfully');

        } catch (error) {
            console.error('❌ [Web3Context] Error connecting wallet:', error);
            alert('Failed to connect wallet: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const disconnectWallet = async () => {
        console.log('🔌 [Web3Context] Disconnecting wallet...');

        try {
            // Revoke permissions to force MetaMask to ask for connection again next time
            if (window.ethereum) {
                await window.ethereum.request({
                    method: "wallet_revokePermissions",
                    params: [
                        {
                            eth_accounts: {}
                        }
                    ]
                });
                console.log('🔒 [Web3Context] Permissions revoked');
            }
        } catch (error) {
            console.error('⚠️ [Web3Context] Error revoking permissions:', error);
        }

        // Reset all states
        setWeb3(null);
        setContract(null);
        setAccount(null);
        setIsAdmin(false);
        setIsMember(false);

        // Clear any stored data
        localStorage.clear();
        sessionStorage.clear();

        console.log('✅ [Web3Context] Wallet disconnected, state cleared');
        console.log('🔄 [Web3Context] Reloading page to ensure clean state...');

        // Reload to ensure complete reset
        window.location.href = '/';
    };

    useEffect(() => {
        if (window.ethereum) {
            // Handle account changes
            const handleAccountsChanged = (accounts) => {
                console.log('🔄 [Web3Context] Accounts changed:', accounts);
                if (accounts.length === 0) {
                    console.log('🔌 [Web3Context] No accounts available, disconnecting...');
                    disconnectWallet();
                } else {
                    console.log('🔄 [Web3Context] Account changed, reloading...');
                    window.location.reload();
                }
            };

            // Handle chain changes
            const handleChainChanged = (chainId) => {
                console.log('🔄 [Web3Context] Chain changed to:', chainId);
                console.log('🔄 [Web3Context] Reloading page...');
                window.location.reload();
            };

            // Add event listeners
            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('chainChanged', handleChainChanged);

            console.log('👂 [Web3Context] Event listeners registered');

            // Cleanup function
            return () => {
                console.log('🧹 [Web3Context] Cleaning up event listeners');
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
                window.ethereum.removeListener('chainChanged', handleChainChanged);
            };
        }
    }, []);

    const value = {
        web3,
        contract,
        account,
        isAdmin,
        isMember,
        loading,
        connectWallet,
        disconnectWallet,
        setIsMember
    };

    return (
        <Web3Context.Provider value={value}>
            {children}
        </Web3Context.Provider>
    );
};
