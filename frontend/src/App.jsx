import { useEffect, useState, useRef, useCallback } from "react";
import { animate } from 'animejs';
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
  const [loading, setLoading] = useState(false);
  const [showHollowPurple, setShowHollowPurple] = useState(false);
  const containerRef = useRef(null);
  const animationsRef = useRef([]);

  // Purple energy particles floating in background
  useEffect(() => {
    const createEnergyParticles = () => {
      const container = containerRef.current;
      if (!container) return;

      const particles = [];
      
      // Create 15 purple energy particles
      for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'energy-particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        particle.style.animationDuration = `${Math.random() * 10 + 15}s`;
        container.appendChild(particle);
        particles.push(particle);
      }

      return () => {
        particles.forEach(p => p.remove());
      };
    };

    const cleanup = createEnergyParticles();
    return cleanup;
  }, []);

  // Animate tab transitions
  useEffect(() => {
    const anim = animate('.content-area', {
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 400,
      ease: 'outCubic'
    });
    animationsRef.current.push(anim);
  }, [activeTab]);

  // Hollow Purple Animation
  const triggerHollowPurple = useCallback(() => {
    setShowHollowPurple(true);
    
    // Auto hide after animation
    setTimeout(() => {
      setShowHollowPurple(false);
    }, 3000);
  }, []);

  const connectWallet = async () => {
    try {
      setLoading(true);
      const data = await initWeb3();
      setWeb3Data(data);
      setWalletConnected(true);
      setWalletAddress(data.accounts[0]);
      await loadMortgages();
      
      // Success animation
      const anim = animate('.wallet-badge', {
        scale: [0, 1],
        duration: 500,
        ease: 'outBack'
      });
      animationsRef.current.push(anim);
    } catch (err) {
      alert("Failed to connect wallet: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMortgages = async () => {
    try {
      setLoading(true);
      const all = await getAllMortgages();
      setMortgages(all);
    } catch (err) {
      console.error("Failed to load mortgages:", err);
      alert("Failed to load mortgages: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!amount || amount <= 0) return alert("Enter a valid amount!");
    
    try {
      setLoading(true);
      await createMortgage(amount);
      setAmount("");
      await loadMortgages();
      triggerHollowPurple();
      setTimeout(() => alert("Mortgage created successfully!"), 500);
    } catch (err) {
      console.error("Failed to create mortgage:", err);
      alert("Failed to create mortgage: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      setLoading(true);
      await approveMortgage(id);
      await loadMortgages();
      triggerHollowPurple();
      setTimeout(() => alert("Mortgage approved successfully!"), 500);
    } catch (err) {
      console.error("Failed to approve mortgage:", err);
      alert("Failed to approve mortgage: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async (id) => {
    const amt = payAmount[id] || "0";
    if (amt <= 0) return alert("Enter a valid payment amount!");
    
    try {
      setLoading(true);
      await makePayment(id, amt);
      setPayAmount((prev) => ({ ...prev, [id]: "" }));
      await loadMortgages();
      triggerHollowPurple();
      setTimeout(() => alert("Payment made successfully!"), 500);
    } catch (err) {
      console.error("Failed to make payment:", err);
      alert("Failed to make payment: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatAmount = (amount) => {
    if (!amount) return "0";
    return amount.toString();
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen p-6 font-sans relative overflow-hidden transition-all duration-1000"
      style={{
        background: showHollowPurple 
          ? 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #d946ef 100%)'
          : 'linear-gradient(to right, #1e3a8a 0%, #1e40af 30%, #000000 50%, #7f1d1d 70%, #991b1b 100%)'
      }}
    >
      {/* Hollow Purple Effect */}
      {showHollowPurple && (
        <div className="hollow-purple-container">
          {/* Charge Phase - Blue and Red orbs */}
          <div className="energy-orb blue-orb"></div>
          <div className="energy-orb red-orb"></div>
          
          {/* Fusion Phase - Purple orb */}
          <div className="purple-orb">
            <div className="purple-core"></div>
          </div>
          
          {/* Blast Phase */}
          <div className="purple-blast"></div>
          <div className="shockwave"></div>
          
          {/* Particles */}
          <div className="particles">
            {[...Array(30)].map((_, i) => (
              <div 
                key={i} 
                className="particle" 
                style={{
                  left: `${50 + (Math.random() - 0.5) * 20}%`,
                  top: `${50 + (Math.random() - 0.5) * 20}%`,
                  '--tx': `${(Math.random() - 0.5) * 800}px`,
                  '--ty': `${(Math.random() - 0.5) * 800}px`
                }}
              ></div>
            ))}
          </div>
          
          {/* Distortion effect */}
          <div className="distortion-wave"></div>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-slate-800/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-purple-500/30">
            <div className="loading-spinner">
              <div className="spinner-orb"></div>
            </div>
            <p className="mt-4 text-purple-300 font-semibold text-center">Processing Transaction...</p>
          </div>
        </div>
      )}

      {/* Animated background grid */}
      <div className="grid-background"></div>

      {/* Purple energy glow orbs */}
      <div className="glow-orb glow-1"></div>
      <div className="glow-orb glow-2"></div>
      <div className="glow-orb glow-3"></div>

      {/* Header */}
      <div className="flex justify-between items-center mb-8 relative z-10">
        <div className="flex items-center space-x-4">
          <div className="header-icon">∞</div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-500 via-purple-600 to-red-600 bg-clip-text text-transparent">
            Hollow Purple Finance
          </h1>
        </div>
        {!walletConnected ? (
          <button
            onClick={connectWallet}
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-6 py-3 rounded-xl shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/70 hover:scale-105 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed border border-purple-400/30"
          >
            ⚡ Connect Wallet
          </button>
        ) : (
          <span className="wallet-badge bg-slate-800/80 backdrop-blur-md px-5 py-3 rounded-xl shadow-lg border border-purple-500/50 text-purple-300 font-mono">
            {formatAddress(walletAddress)}
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-10 space-x-4 relative z-10">
        {["create", "view"].map((tab) => (
          <button
            key={tab}
            className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === tab
                ? "bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-lg shadow-purple-500/50 scale-105 border border-purple-400/50"
                : "bg-slate-800/80 backdrop-blur-sm text-purple-300 border border-purple-500/30 hover:bg-slate-700/80 hover:scale-105 hover:border-purple-400/50"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "create" ? "⚡ Create Mortgage" : "📊 View Mortgages"}
          </button>
        ))}
      </div>

      {/* Create Mortgage Tab */}
      {activeTab === "create" && walletConnected && (
        <div className="content-area max-w-md mx-auto bg-slate-800/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-purple-500/30 relative z-10">
          <div className="text-center mb-6">
            <div className="inline-block text-7xl purple-glow-text">∞</div>
          </div>
          <h2 className="text-3xl font-semibold text-center bg-gradient-to-r from-blue-500 via-purple-600 to-red-600 bg-clip-text text-transparent mb-6">
            Create a Mortgage
          </h2>
          <input
            type="number"
            placeholder="Amount (e.g., 1000)"
            className="w-full border-2 border-purple-500/50 bg-slate-900/50 rounded-xl p-4 mb-6 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all text-purple-100 placeholder-purple-400/50"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={loading}
          />
          <button
            className="create-btn w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white py-4 rounded-xl font-semibold shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/70 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-purple-400/30"
            onClick={handleCreate}
            disabled={loading}
          >
            ✨ Create Mortgage
          </button>
        </div>
      )}

      {/* View Mortgages Tab */}
      {activeTab === "view" && walletConnected && (
        <div className="content-area relative z-10 max-w-6xl mx-auto">
          <div className="bg-slate-800/90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-purple-500/30">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-purple-600 to-purple-800 text-white">
                  <tr>
                    <th className="py-4 px-6 text-left font-semibold">ID</th>
                    <th className="py-4 px-6 text-left font-semibold">Borrower</th>
                    <th className="py-4 px-6 text-left font-semibold">Amount</th>
                    <th className="py-4 px-6 text-left font-semibold">Paid</th>
                    <th className="py-4 px-6 text-center font-semibold">Status</th>
                    <th className="py-4 px-6 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mortgages.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-10 text-purple-400">
                        <span className="text-5xl mb-2 block">∞</span>
                        No mortgages found.
                      </td>
                    </tr>
                  ) : (
                    mortgages.map((m, index) => (
                      <tr 
                        key={m.id} 
                        className="border-b border-purple-500/20 hover:bg-purple-900/20 transition-all duration-300 fade-in-row"
                        style={{
                          animationDelay: `${index * 0.05}s`
                        }}
                      >
                        <td className="py-4 px-6 font-mono text-purple-300 font-semibold">{m.id}</td>
                        <td className="py-4 px-6 font-mono text-purple-400">{formatAddress(m.borrower)}</td>
                        <td className="py-4 px-6 font-semibold text-purple-400">{formatAmount(m.amount)}</td>
                        <td className="py-4 px-6 font-semibold text-purple-500">{formatAmount(m.paidAmount)}</td>
                        <td className="py-4 px-6 text-center">
                          {m.approved ? (
                            <span className="inline-flex items-center justify-center w-8 h-8 bg-green-500/20 rounded-full border border-green-500/50">
                              <span className="text-green-400 text-xl">✓</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center w-8 h-8 bg-red-500/20 rounded-full border border-red-500/50">
                              <span className="text-red-400 text-xl">✕</span>
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            {!m.approved && (
                              <button
                                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:scale-105 transition-all duration-300 shadow-md shadow-green-500/30 hover:shadow-lg hover:shadow-green-500/50 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => handleApprove(m.id)}
                                disabled={loading}
                              >
                                ✓ Approve
                              </button>
                            )}
                            {m.approved && (
                              <>
                                <input
                                  type="number"
                                  placeholder="Amount"
                                  className="w-24 border-2 border-purple-500/50 bg-slate-900/50 rounded-lg px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-purple-500 text-purple-100 placeholder-purple-400/50 disabled:opacity-50"
                                  value={payAmount[m.id] || ""}
                                  onChange={(e) =>
                                    setPayAmount((prev) => ({ ...prev, [m.id]: e.target.value }))
                                  }
                                  disabled={loading}
                                />
                                <button
                                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:scale-105 transition-all duration-300 shadow-md shadow-blue-500/30 hover:shadow-lg hover:shadow-blue-500/50 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                  onClick={() => handlePay(m.id)}
                                  disabled={loading}
                                >
                                  💰 Pay
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {!walletConnected && (
        <div className="content-area text-center mt-12 relative z-10">
          <div className="bg-slate-800/90 backdrop-blur-md p-8 rounded-3xl shadow-xl max-w-md mx-auto border border-purple-500/30">
            <div className="text-7xl mb-4 purple-glow-text">∞</div>
            <p className="text-purple-300 text-lg font-semibold">
              Connect your wallet to access Hollow Purple Finance
            </p>
          </div>
        </div>
      )}

      <style>{`
        /* Background Grid */
        .grid-background {
          position: fixed;
          inset: 0;
          background-image: 
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(220, 38, 38, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          z-index: 0;
        }

        /* Floating Energy Particles */
        .energy-particle {
          position: fixed;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          animation: floatParticle linear infinite;
          pointer-events: none;
          z-index: 1;
          opacity: 0.6;
        }

        .energy-particle:nth-child(odd) {
          background: radial-gradient(circle, #3b82f6, #60a5fa);
          box-shadow: 0 0 10px #3b82f6;
          left: 25% !important;
        }

        .energy-particle:nth-child(even) {
          background: radial-gradient(circle, #dc2626, #ef4444);
          box-shadow: 0 0 10px #dc2626;
          left: 75% !important;
        }

        @keyframes floatParticle {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-100vh) translateX(50px);
            opacity: 0;
          }
        }

        /* Glow Orbs */
        .glow-orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
          animation: pulse 8s ease-in-out infinite;
        }
        .glow-1 {
          top: 20%;
          left: 10%;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, #3b82f6, transparent);
        }
        .glow-2 {
          bottom: 20%;
          right: 10%;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, #dc2626, transparent);
          animation-delay: 2s;
        }
        .glow-3 {
          top: 60%;
          left: 5%;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, #1e40af, transparent);
          animation-delay: 4s;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.2);
          }
        }

        /* Header Icon */
        .header-icon {
          font-size: 3rem;
          background: linear-gradient(135deg, #3b82f6, #a855f7, #dc2626);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: iconPulse 3s ease-in-out infinite;
        }

        @keyframes iconPulse {
          0%, 100% {
            filter: drop-shadow(0 0 10px #3b82f6) drop-shadow(0 0 10px #dc2626);
          }
          50% {
            filter: drop-shadow(0 0 20px #3b82f6) drop-shadow(0 0 20px #dc2626);
          }
        }

        /* Purple Glow Text */
        .purple-glow-text {
          filter: drop-shadow(0 0 20px #a855f7) drop-shadow(0 0 40px #7c3aed);
          animation: textPulse 2s ease-in-out infinite;
        }

        @keyframes textPulse {
          0%, 100% {
            filter: drop-shadow(0 0 20px #a855f7);
          }
          50% {
            filter: drop-shadow(0 0 40px #a855f7) drop-shadow(0 0 60px #7c3aed);
          }
        }

        /* Loading Spinner */
        .loading-spinner {
          width: 80px;
          height: 80px;
          margin: 0 auto;
          position: relative;
        }

        .spinner-orb {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: radial-gradient(circle, #a855f7, #7c3aed);
          box-shadow: 0 0 30px #a855f7, 0 0 60px #7c3aed;
          animation: spinOrb 2s linear infinite;
        }

        @keyframes spinOrb {
          0% {
            transform: rotate(0deg) scale(1);
          }
          50% {
            transform: rotate(180deg) scale(1.1);
          }
          100% {
            transform: rotate(360deg) scale(1);
          }
        }

        /* Fade in animation */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fade-in-row {
          animation: fadeInUp 0.4s ease-out both;
        }

        /* HOLLOW PURPLE EFFECTS */
        .hollow-purple-container {
          position: fixed;
          inset: 0;
          z-index: 9999;
          pointer-events: none;
          overflow: hidden;
          background: radial-gradient(circle at center, rgba(139, 92, 246, 0.1), transparent);
        }

        /* Blue and Red Energy Orbs (Charge Phase) */
        .energy-orb {
          position: absolute;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: orbCharge 0.8s ease-out forwards;
        }

        .blue-orb {
          background: radial-gradient(circle, #60a5fa, #3b82f6, #1d4ed8);
          box-shadow: 0 0 60px #3b82f6, 0 0 120px #60a5fa;
          animation-delay: 0s;
          transform: translate(-120%, -50%);
        }

        .red-orb {
          background: radial-gradient(circle, #f87171, #ef4444, #dc2626);
          box-shadow: 0 0 60px #ef4444, 0 0 120px #f87171;
          animation-delay: 0.1s;
          transform: translate(20%, -50%);
        }

        @keyframes orbCharge {
          0% {
            width: 0;
            height: 0;
            opacity: 0;
          }
          50% {
            width: 120px;
            height: 120px;
            opacity: 1;
          }
          100% {
            width: 0;
            height: 0;
            opacity: 0;
            transform: translate(-50%, -50%);
          }
        }

        /* Purple Fusion Orb */
        .purple-orb {
          position: absolute;
          width: 250px;
          height: 250px;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, #d946ef, #a855f7, #7c3aed);
          box-shadow: 
            0 0 80px #d946ef,
            0 0 160px #a855f7,
            0 0 240px #7c3aed,
            inset 0 0 80px rgba(255, 255, 255, 0.3);
          animation: purpleOrb 1.2s ease-out 0.8s forwards;
          opacity: 0;
        }

        .purple-core {
          position: absolute;
          inset: 20%;
          border-radius: 50%;
          background: radial-gradient(circle, #ffffff, #d946ef);
          animation: coreRotate 2s linear infinite;
        }

        @keyframes purpleOrb {
          0% {
            width: 0;
            height: 0;
            opacity: 0;
          }
          30% {
            width: 300px;
            height: 300px;
            opacity: 1;
          }
          60% {
            width: 250px;
            height: 250px;
            opacity: 1;
          }
          100% {
            width: 200px;
            height: 200px;
            opacity: 0;
          }
        }

        @keyframes coreRotate {
          to {
            transform: rotate(360deg);
          }
        }

        /* Purple Blast (Expansion) */
        .purple-blast {
          position: absolute;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, 
            rgba(217, 70, 239, 0.8) 0%,
            rgba(168, 85, 247, 0.6) 30%,
            rgba(124, 58, 237, 0.3) 60%,
            transparent 100%
          );
          animation: blastExpand 0.8s ease-out 1.8s forwards;
          opacity: 0;
        }

        @keyframes blastExpand {
          0% {
            width: 200px;
            height: 200px;
            opacity: 1;
          }
          100% {
            width: 2500px;
            height: 2500px;
            opacity: 0;
          }
        }

        /* Shockwave */
        .shockwave {
          position: absolute;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border: 3px solid #d946ef;
          animation: shockwaveExpand 1s ease-out 1.9s forwards;
          opacity: 0;
        }

        @keyframes shockwaveExpand {
          0% {
            width: 200px;
            height: 200px;
            opacity: 1;
          }
          100% {
            width: 2000px;
            height: 2000px;
            opacity: 0;
          }
        }

        /* Particles */
        .particles {
          position: absolute;
          inset: 0;
        }

        .particle {
          position: absolute;
          width: 8px;
          height: 8px;
          background: radial-gradient(circle, #d946ef, #a855f7);
          border-radius: 50%;
          box-shadow: 0 0 15px #d946ef;
          animation: particleExplosion 1.2s ease-out 1.6s forwards;
          opacity: 0;
        }

        @keyframes particleExplosion {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(var(--tx), var(--ty)) scale(0);
            opacity: 0;
          }
        }

        /* Distortion Wave */
        .distortion-wave {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, 
            transparent 0%,
            rgba(168, 85, 247, 0.1) 50%,
            transparent 100%
          );
          animation: distort 2s ease-out 1.5s forwards;
          opacity: 0;
        }

        @keyframes distort {
          0% {
            opacity: 0;
            transform: scale(0.5);
          }
          50% {
            opacity: 1;
            transform: scale(1.5);
          }
          100% {
            opacity: 0;
            transform: scale(3);
          }
        }

        /* Performance optimizations */
        .energy-orb,
        .purple-orb,
        .purple-blast,
        .shockwave,
        .particle,
        .distortion-wave,
        .energy-particle {
          will-change: transform, opacity;
          transform: translateZ(0);
          backface-visibility: hidden;
        }
      `}</style>
    </div>
  );
}

export default App;