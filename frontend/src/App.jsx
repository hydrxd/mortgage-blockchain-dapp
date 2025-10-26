// src/App.jsx
import { useEffect, useState } from "react";
import {
  initWeb3,
  createMortgage,
  approveMortgage,
  makePayment,
  getAllMortgages,
} from "./ethereum";

function App() {
  const [web3Data, setWeb3Data] = useState({});
  const [activeTab, setActiveTab] = useState("create");
  const [amount, setAmount] = useState("");
  const [payAmount, setPayAmount] = useState({});
  const [mortgages, setMortgages] = useState([]);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  const connectWallet = async () => {
    try {
      const data = await initWeb3();
      setWeb3Data(data);
      setWalletConnected(true);
      setWalletAddress(data.accounts[0]);
      loadMortgages(data.mortgage);
    } catch (err) {
      alert("Failed to connect wallet: " + err.message);
    }
  };

  const loadMortgages = async (contractInstance) => {
    const all = await getAllMortgages(contractInstance);
    setMortgages(all);
  };

  const handleCreate = async () => {
    if (!amount) return alert("Enter a valid amount!");
    await createMortgage(amount, web3Data.mortgage, web3Data.accounts[0]);
    setAmount("");
    loadMortgages(web3Data.mortgage);
  };

  const handleApprove = async (id) => {
    await approveMortgage(id, web3Data.mortgage, web3Data.accounts[0]);
    loadMortgages(web3Data.mortgage);
  };

  const handlePay = async (id) => {
    const amt = payAmount[id] || "0";
    if (amt <= 0) return alert("Enter a valid payment amount!");
    await makePayment(id, amt, web3Data.mortgage, web3Data.accounts[0]);
    setPayAmount((prev) => ({ ...prev, [id]: "" }));
    loadMortgages(web3Data.mortgage);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 to-purple-100 p-6 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-indigo-700">Blockchain Mortgage DApp</h1>
        {!walletConnected ? (
          <button
            onClick={connectWallet}
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
          >
            Connect Wallet
          </button>
        ) : (
          <span className="bg-white px-4 py-2 rounded-lg shadow text-indigo-700 font-mono">
            {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-8 space-x-4">
        {["create", "view"].map((tab) => (
          <button
            key={tab}
            className={`px-6 py-2 rounded-full font-semibold transition ${activeTab === tab
              ? "bg-indigo-600 text-white shadow-lg"
              : "bg-white text-indigo-600 border border-indigo-300 hover:bg-indigo-100"
              }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "create" ? "Create Mortgage" : "View Mortgages"}
          </button>
        ))}
      </div>

      {/* Create Mortgage Tab */}
      {activeTab === "create" && walletConnected && (
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-indigo-700 mb-6">Create a Mortgage</h2>
          <input
            type="number"
            placeholder="Amount in ETH"
            className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold shadow hover:bg-indigo-700 transition"
            onClick={handleCreate}
          >
            Create Mortgage
          </button>
        </div>
      )}

      {/* View Mortgages Tab */}
      {activeTab === "view" && walletConnected && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow-lg overflow-hidden">
            <thead className="bg-indigo-600 text-white text-left">
              <tr>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Borrower</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Paid</th>
                <th className="py-3 px-4">Approved</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mortgages.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    No mortgages found.
                  </td>
                </tr>
              ) : (
                mortgages.map((m) => (
                  <tr key={m.id} className="border-b hover:bg-indigo-50 transition">
                    <td className="py-2 px-4 font-mono">{m.id}</td>
                    <td className="py-2 px-4 font-mono">{m.borrower}</td>
                    <td className="py-2 px-4">{m.amount}</td>
                    <td className="py-2 px-4">{m.paidAmount}</td>
                    <td className="py-2 px-4 text-center">
                      {m.approved ? (
                        <span className="text-green-600 font-bold">✅</span>
                      ) : (
                        <span className="text-red-600 font-bold">❌</span>
                      )}
                    </td>
                    <td className="py-2 px-4 flex items-center space-x-2">
                      {!m.approved && (
                        <button
                          className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition"
                          onClick={() => handleApprove(m.id)}
                        >
                          Approve
                        </button>
                      )}
                      {m.approved && (
                        <>
                          <input
                            type="number"
                            placeholder="Pay"
                            className="w-20 border rounded-lg px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            value={payAmount[m.id] || ""}
                            onChange={(e) =>
                              setPayAmount((prev) => ({ ...prev, [m.id]: e.target.value }))
                            }
                          />
                          <button
                            className="px-3 py-1 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition"
                            onClick={() => handlePay(m.id)}
                          >
                            Pay
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {!walletConnected && (
        <p className="text-center text-red-500 mt-6">
          Please connect your wallet to interact with the DApp.
        </p>
      )}
    </div>
  );
}

export default App;
