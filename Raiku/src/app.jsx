import React, { useState, useEffect } from 'react';
import { Activity, Zap, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';

const App = () => {
  const [tps, setTps] = useState(2500);
  const [mempool, setMempool] = useState(30);
  const [latency, setLatency] = useState(400);
  const [raikuActive, setRaikuActive] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [congestionLevel, setCongestionLevel] = useState('normal');
  const [raikuIntervention, setRaikuIntervention] = useState(false);

  const maxTps = 5000;
  const congestionThreshold = 70;
  const criticalThreshold = 85;

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTps(prev => {
        let newTps = prev + (Math.random() * 400 - 150);
        
        if (Math.random() > 0.92) {
          newTps += 800;
        }
        
        const utilizationPercent = (newTps / maxTps) * 100;
        if (utilizationPercent > congestionThreshold && raikuActive && !raikuIntervention) {
          setRaikuIntervention(true);
          setTimeout(() => setRaikuIntervention(false), 3000);
        }
        
        if (raikuActive && utilizationPercent > congestionThreshold) {
          newTps = Math.max(newTps - 600, 2000);
        }
        
        return Math.max(1500, Math.min(newTps, maxTps));
      });

      setMempool(prev => {
        const tpsRatio = tps / maxTps;
        let change = (tpsRatio - 0.5) * 15;
        
        if (raikuActive && tpsRatio > 0.7) {
          change -= 10;
        }
        
        let newMempool = prev + change + (Math.random() * 8 - 4);
        return Math.max(5, Math.min(newMempool, 100));
      });

      setLatency(prev => {
        const baseLatency = 400;
        const congestionFactor = (tps / maxTps) * 600;
        
        let targetLatency = baseLatency + congestionFactor;
        
        if (raikuActive && tps / maxTps > 0.7) {
          targetLatency = baseLatency + congestionFactor * 0.4;
        }
        
        return prev + (targetLatency - prev) * 0.3;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning, tps, raikuActive, raikuIntervention]);

  useEffect(() => {
    const utilization = (tps / maxTps) * 100;
    if (utilization >= criticalThreshold) {
      setCongestionLevel('critical');
    } else if (utilization >= congestionThreshold) {
      setCongestionLevel('warning');
    } else {
      setCongestionLevel('normal');
    }
  }, [tps]);

  const getStatusColor = () => {
    switch (congestionLevel) {
      case 'critical': return 'text-red-500';
      case 'warning': return 'text-yellow-500';
      default: return 'text-green-500';
    }
  };

  const getStatusBg = () => {
    switch (congestionLevel) {
      case 'critical': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  const utilization = (tps / maxTps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Activity className="text-purple-400" size={40} />
            Solana Network Congestion Simulator
          </h1>
          <p className="text-blue-200">Watch how Raiku prevents network congestion in real-time</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-6 border border-white/20">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                isRunning 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-green-500 hover:bg-green-600'
              } text-white`}
            >
              {isRunning ? 'Stop Simulation' : 'Start Simulation'}
            </button>
            
            <div className="flex items-center gap-3">
              <span className="text-white font-medium">Raiku Protocol:</span>
              <button
                onClick={() => setRaikuActive(!raikuActive)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  raikuActive 
                    ? 'bg-purple-500 hover:bg-purple-600 shadow-lg shadow-purple-500/50' 
                    : 'bg-gray-600 hover:bg-gray-700'
                } text-white`}
              >
                {raikuActive ? '✓ Active' : 'Inactive'}
              </button>
            </div>
          </div>
        </div>

        <div className={`rounded-xl p-6 mb-6 border-2 ${
          congestionLevel === 'critical' 
            ? 'bg-red-500/20 border-red-500' 
            : congestionLevel === 'warning'
            ? 'bg-yellow-500/20 border-yellow-500'
            : 'bg-green-500/20 border-green-500'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {congestionLevel === 'critical' ? (
                <AlertTriangle className="text-red-500" size={32} />
              ) : congestionLevel === 'warning' ? (
                <TrendingUp className="text-yellow-500" size={32} />
              ) : (
                <CheckCircle className="text-green-500" size={32} />
              )}
              <div>
                <h2 className={`text-2xl font-bold ${getStatusColor()}`}>
                  {congestionLevel === 'critical' 
                    ? 'NETWORK CONGESTED' 
                    : congestionLevel === 'warning'
                    ? 'APPROACHING CONGESTION'
                    : 'NETWORK HEALTHY'}
                </h2>
                <p className="text-white/80">
                  {congestionLevel === 'critical' 
                    ? 'High transaction volume causing delays' 
                    : congestionLevel === 'warning'
                    ? 'Traffic increasing, monitoring closely'
                    : 'All systems operating normally'}
                </p>
              </div>
            </div>
            
            {raikuIntervention && (
              <div className="animate-pulse">
                <div className="flex items-center gap-2 bg-purple-500 px-4 py-2 rounded-lg">
                  <Zap className="text-white" size={24} />
                  <span className="text-white font-bold">Raiku Optimizing</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Transactions/sec</h3>
              <Activity className="text-blue-400" size={24} />
            </div>
            <div className="text-4xl font-bold text-white mb-2">
              {Math.round(tps).toLocaleString()}
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
              <div 
                className={`h-3 rounded-full transition-all duration-300 ${getStatusBg()}`}
                style={{ width: `${utilization}%` }}
              />
            </div>
            <div className="text-sm text-white/70">
              {utilization.toFixed(1)}% network utilization
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Mempool Size</h3>
              <TrendingUp className="text-yellow-400" size={24} />
            </div>
            <div className="text-4xl font-bold text-white mb-2">
              {Math.round(mempool)}K
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
              <div 
                className={`h-3 rounded-full transition-all duration-300 ${
                  mempool > 70 ? 'bg-red-500' : mempool > 50 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${mempool}%` }}
              />
            </div>
            <div className="text-sm text-white/70">
              Pending transactions in queue
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Avg Latency</h3>
              <Zap className="text-purple-400" size={24} />
            </div>
            <div className="text-4xl font-bold text-white mb-2">
              {Math.round(latency)}ms
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
              <div 
                className={`h-3 rounded-full transition-all duration-300 ${
                  latency > 800 ? 'bg-red-500' : latency > 600 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min((latency / 1200) * 100, 100)}%` }}
              />
            </div>
            <div className="text-sm text-white/70">
              Transaction confirmation time
            </div>
          </div>
        </div>

        <div className={`bg-white/10 backdrop-blur-lg rounded-xl p-6 border-2 transition-all ${
          raikuActive ? 'border-purple-500 shadow-lg shadow-purple-500/30' : 'border-white/20'
        }`}>
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-lg ${raikuActive ? 'bg-purple-500' : 'bg-gray-600'}`}>
              <Zap className="text-white" size={32} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">
                Raiku Protocol {raikuActive ? '(Active)' : '(Inactive)'}
              </h3>
              <p className="text-white/80 mb-4">
                {raikuActive 
                  ? 'Raiku is actively monitoring network conditions. When utilization exceeds 70%, it optimizes transaction routing, implements intelligent fee markets, and prioritizes critical transactions to prevent congestion.'
                  : 'Enable Raiku to see how it prevents network congestion through real-time optimization and intelligent transaction management.'}
              </p>
              {raikuActive && (
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="bg-purple-500/20 rounded p-3">
                    <div className="text-purple-300 font-semibold">Smart Routing</div>
                    <div className="text-white">Active</div>
                  </div>
                  <div className="bg-purple-500/20 rounded p-3">
                    <div className="text-purple-300 font-semibold">Fee Optimization</div>
                    <div className="text-white">Enabled</div>
                  </div>
                  <div className="bg-purple-500/20 rounded p-3">
                    <div className="text-purple-300 font-semibold">Load Balancing</div>
                    <div className="text-white">Running</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
