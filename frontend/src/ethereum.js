import Web3 from "web3";
import Mortgage from "../../build/contracts/Mortgage.json";

let web3;
let mortgage;
let accounts;

export const initWeb3 = async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        accounts = await web3.eth.getAccounts();

        const networkId = await web3.eth.net.getId(); //add 5777 if ganache gui is used
        const deployedNetwork = Mortgage.networks[networkId];
        
        // Add this check:
        if (!deployedNetwork) {
            throw new Error(`Contract not deployed on network ${networkId}. Please switch to the correct network (e.g., Ganache, Sepolia, etc.)`);
        }
        
        mortgage = new web3.eth.Contract(Mortgage.abi, deployedNetwork.address);
        return { web3, accounts, mortgage };
    } else {
        throw new Error("MetaMask not detected!");
    }
};

export const createMortgage = async (amount) => {
    await mortgage.methods.createMortgage(amount).send({ from: accounts[0] });
};

export const approveMortgage = async (id) => {
    await mortgage.methods.approveMortgage(id).send({ from: accounts[0] });
};

export const makePayment = async (id, amount) => {
    await mortgage.methods.makePayment(id, amount).send({ from: accounts[0] });
};

export const getMortgage = async (id) => {
    return await mortgage.methods.getMortgage(id).call();
};

export const getAllMortgages = async () => {
    const count = await mortgage.methods.mortgageCount().call();
    const all = [];
    for (let i = 1; i <= count; i++) {
        const m = await mortgage.methods.getMortgage(i).call();
        all.push({
            id: i,
            borrower: m[0],
            amount: m[1],
            paidAmount: m[2],
            approved: m[3],
        });
    }
    return all;
};
