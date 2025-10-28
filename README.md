# Blockchain Mortgage DApp

A simple decentralized mortgage application built using **MetaMask, Solidity, Truffle, and React**.
This DApp allows users to create mortgages, approve them, and make payments, all directly via **MetaMask** without a backend server.

---

## Features

* Connect with MetaMask and display your wallet address.
* Create a new mortgage.
* View all existing mortgages in a table.
* Approve mortgages (bank/admin role) — As a POC, currently anyone can approve.
* Make payments only for approved mortgages.
* Tab-based interface for a clean UI.

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

* [Node.js](https://nodejs.org/)
* [npm](https://www.npmjs.com/)
* [MetaMask](https://metamask.io/) browser extension
* [Truffle](https://www.trufflesuite.com/truffle) (`npm install -g truffle`)
* [Ganache](https://www.trufflesuite.com/ganache) for local blockchain development (`npm install -g ganache`)

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/hydrxd/mortgage-blockchain-dapp.git
cd mortgage-blockchain
```

2. Install dependencies:

```bash
npm install -g ganache truffle
````

3. Run Ganache and compile Contracts:

```bash
npm run dev
```

---

## Import Ganache Account into MetaMask

Before running the frontend, you need to connect your MetaMask wallet to the Ganache local network and import an account:

1. Open MetaMask → click your account icon → **Import Account**.
2. Copy the **private key** of an account from Ganache.
3. Paste the private key in MetaMask and give it a name.
4. Make sure MetaMask is connected to the **Ganache local network** (URL `http://127.0.0.1:8545` with Chain ID `1337`).
5. Set symbol to `ETH`.
6. You should now see the imported account with its Ether balance from Ganache.

---

## Running the Frontend

1. Install dependencies:

```bash
cd frontend
npm install
````

2. Run the Frontend:

```bash
npm run dev
```

* Open the URL provided by Vite (usually `http://localhost:5173`)
* Click **Connect Wallet** to connect MetaMask.
* Use the **tabs** to create, approve, or pay mortgages.

---

## How It Works

1. **Create Mortgage** – Any user can create a mortgage by entering an amount.
2. **View Mortgages** – All mortgages are listed in a table.
3. **Approve Mortgage** – Only the bank/admin account can approve a mortgage.
4. **Make Payment** – Only available if the mortgage is approved.

All transactions are directly signed via **MetaMask** and executed on the blockchain.

---

## Screenshots

![gnc](https://github.com/lohithgsk/mortgage-blockchain-dapp/blob/main/gnc.png)

## Notes

* No backend server is required; the frontend interacts directly with the smart contract.
* Make sure to use the correct **network in MetaMask** (Ganache local network).

---

## License

MIT License
