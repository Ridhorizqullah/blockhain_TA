// Test script to check contract methods
// Run this in browser console after connecting wallet

async function testHistoryFetch() {
    try {
        // Get Web3 instance
        const Web3 = window.Web3 || require('web3');
        const web3 = new Web3(window.ethereum);

        // Get account
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        console.log('Account:', account);

        // Contract details
        const contractAddress = '0x190f3557ae406b7720B77e8aa4E4E7B27E3a3727';

        // You'll need to paste the ABI here
        const contractABI = []; // Paste ABI from Library.json

        const contract = new web3.eth.Contract(contractABI, contractAddress);

        // Test getMemberBorrowHistory
        console.log('Calling getMemberBorrowHistory...');
        const history = await contract.methods.getMemberBorrowHistory(account).call();
        console.log('History data:', history);
        console.log('Number of records:', history.length);

        // Test getAllBorrowHistory (admin only)
        console.log('Calling getAllBorrowHistory...');
        const allHistory = await contract.methods.getAllBorrowHistory().call();
        console.log('All history data:', allHistory);
        console.log('Number of all records:', allHistory.length);

    } catch (error) {
        console.error('Error:', error);
    }
}

// Run the test
testHistoryFetch();
