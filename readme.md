# Blockchain Mortgage DApp

A simple decentralized mortgage application built using **Ethereum, Solidity, Truffle, and React** with **Tailwind CSS**.  
This DApp allows users to create mortgages, approve them, and make payments, all directly via **MetaMask** without a backend server.

---

## Features

- Connect with MetaMask and display your wallet address.  
- Create a new mortgage.  
- View all existing mortgages in a table.  
- Approve mortgages (bank/admin role).  
- Make payments only for approved mortgages.  
- Tab-based interface for a clean UI.  
- Fully styled with **Tailwind CSS**.

---

## Folder Structure

```
mortgage-blockchain/
├─ contracts/        # Solidity smart contract
├─ migrations/       # Truffle migrations
├─ build/            # Compiled contract ABI & JSON
├─ src/              # React frontend source code
├─ public/           # HTML template
├─ package.json
└─ README.md
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)  
- [npm](https://www.npmjs.com/)  
- [MetaMask](https://metamask.io/) browser extension  
- [Truffle](https://www.trufflesuite.com/truffle) (`npm install -g truffle`)  
- [Ganache](https://www.trufflesuite.com/ganache) for local blockchain development  

---

## Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd mortgage-blockchain
```

2. Install dependencies:

```bash
npm install
```

3. Compile and migrate the smart contract to Ganache:

```bash
truffle compile
truffle migrate --network development --reset
```

> Ensure Ganache is running and the network ID matches your Truffle config.

4. Update `src/web3.js` (or equivalent) if your contract address changes after migration.

---

## Running the Frontend

```bash
npm run dev
```

- Open the URL provided by Vite (usually `http://localhost:5173`)  
- Click **Connect Wallet** to connect MetaMask.  
- Use the **tabs** to create, approve, or pay mortgages.  

---

## How It Works

1. **Create Mortgage** – Any user can create a mortgage by entering an amount.  
2. **View Mortgages** – All mortgages are listed in a table.  
3. **Approve Mortgage** – Only the bank/admin account can approve a mortgage.  
4. **Make Payment** – Only available if the mortgage is approved.  

All transactions are directly signed via **MetaMask** and executed on the blockchain.  

---

## Notes

- This is a **POC / learning project**, not production-ready.  
- No backend server is required; the frontend interacts directly with the smart contract.  
- Make sure to use the correct **network in MetaMask** (Ganache local network).  

---

## License

MIT License