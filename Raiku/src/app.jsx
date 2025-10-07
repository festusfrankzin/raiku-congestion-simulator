
import React, { useState, useEffect } from 'react';
import { Activity, Zap, AlertTriangle, CheckCircle, TrendingUp, Radio, Cpu, Gauge } from 'lucide-react';

function App() {
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
  }, [tps, criticalThreshold, congestionThreshold, maxTps]);

  const getStatusColor = () => {
    switch (congestionLevel) {
      case 'critical': return 'text-red-400';
      case 'warning': return 'text-amber-400';
      default: return 'text-emerald-400';
    }
  };

  const getStatusBg = () => {
    switch (congestionLevel) {
      case 'critical': return 'bg-red-500';
      case 'warning': return 'bg-amber-500';
      default: return 'bg-emerald-500';
    }
  };

  const getStatusGlow = () => {
    switch (congestionLevel) {
      case 'critical': return 'shadow-red-500/50';
      case 'warning': return 'shadow-amber-500/50';
      default: return 'shadow-emerald-500/50';
    }
  };

  const utilization = (tps / maxTps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      <div className="fixed inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      
      <div className="relative z-10 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center justify-center gap-3 mb-4 relative">
              <div className="absolute inset-0 bg-emerald-500/20 blur-3xl"></div>
              <Radio className="text-emerald-400 relative animate-pulse" size={48} />
              <h1 className="text-4xl md:text-6xl font-black text-white relative bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                SOLANA NETWORK
              </h1>
            </div>
            <p className="text-emerald-400/70 text-sm md:text-lg font-mono tracking-wider">
              REAL-TIME CONGESTION MONITORING SYSTEM
            </p>
          </div>

          <div className="bg-gradient-to-r from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl p-4 md:p-6 mb-6 border border-emerald-500/20 shadow-xl shadow-emerald-500/10">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`w-full md:w-auto px-8 py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 ${
                  isRunning 
                    ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg shadow-red-500/50' 
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-500/50'
                } text-white`}
              >
                <span className="flex items-center gap-2 justify-center">
                  {isRunning ? <Radio size={20} className="animate-pulse" /> : <Cpu size={20} />}
                  {isRunning ? 'STOP SIMULATION' : 'START SIMULATION'}
                </span>
              </button>
              
              <div className="flex items-center gap-3 w-full md:w-auto">
                <span className="text-emerald-400/70 font-mono text-sm uppercase tracking-wider">Raiku Protocol</span>
                <button
                  onClick={() => setRaikuActive(!raikuActive)}
                  className={`flex-1 md:flex-none px-8 py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 ${
                    raikuActive 
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg shadow-emerald-500/50 animate-pulse' 
                      : 'bg-gray-700/50 hover:bg-gray-700'
                  } text-white`}
                >
                  {raikuActive ? '⚡ ACTIVE' : 'INACTIVE'}
                </button>
              </div>
            </div>
          </div>

          <div className={`relative overflow-hidden rounded-2xl p-6 mb-6 border-2 ${
            congestionLevel === 'critical' 
              ? 'bg-gradient-to-r from-red-950/50 to-red-900/30 border-red-500/50' 
              : congestionLevel === 'warning'
              ? 'bg-gradient-to-r from-amber-950/50 to-amber-900/30 border-amber-500/50'
              : 'bg-gradient-to-r from-emerald-950/50 to-emerald-900/30 border-emerald-500/50'
          } shadow-2xl ${getStatusGlow()}`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full blur-3xl"></div>
            
            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-xl bg-gray-900/50 backdrop-blur-sm ${
                  congestionLevel === 'critical' ? 'animate-pulse' : ''
                }`}>
                  {congestionLevel === 'critical' ? (
                    <AlertTriangle className="text-red-400" size={40} />
                  ) : congestionLevel === 'warning' ? (
                    <TrendingUp className="text-amber-400" size={40} />
                  ) : (
                    <CheckCircle className="text-emerald-400" size={40} />
                  )}
                </div>
                <div>
                  <h2 className={`text-2xl md:text-3xl font-black ${getStatusColor()} tracking-tight`}>
                    {congestionLevel === 'critical' 
                      ? 'NETWORK CONGESTED' 
                      : congestionLevel === 'warning'
                      ? 'HIGH TRAFFIC DETECTED'
                      : 'OPTIMAL PERFORMANCE'}
                  </h2>
                  <p className="text-gray-400 text-sm md:text-base font-mono mt-1">
                    {congestionLevel === 'critical' 
                      ? 'Critical: Transaction delays occurring' 
                      : congestionLevel === 'warning'
                      ? 'Warning: Monitoring traffic patterns'
                      : 'Status: All systems nominal'}
                  </p>
                </div>
              </div>
              
              {raikuIntervention && (
                <div className="animate-pulse">
                  <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 rounded-xl shadow-lg shadow-emerald-500/50">
                    <Zap className="text-white" size={24} />
                    <span className="text-white font-bold tracking-wider">OPTIMIZING</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="group relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all"></div>
              
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-emerald-400/70 font-mono text-sm uppercase tracking-wider">Transactions/sec</h3>
                  <div className="p-2 rounded-lg bg-emerald-500/10">
                    <Activity className="text-emerald-400" size={24} />
                  </div>
                </div>
                
                <div className="text-5xl font-black text-white mb-4 tracking-tight">
                  {Math.round(tps).toLocaleString()}
                </div>
                
                <div className="relative w-full h-2 bg-gray-700/50 rounded-full overflow-hidden">
                  <div 
                    className={`absolute inset-y-0 left-0 ${getStatusBg()} transition-all duration-300 rounded-full`}
                    style={{ width: `${utilization}%` }}
                  ></div>
                  <div 
                    className={`absolute inset-y-0 left-0 ${getStatusBg()} opacity-50 blur-sm transition-all duration-300`}
                    style={{ width: `${utilization}%` }}
                  ></div>
                </div>
                
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-gray-500 text-xs font-mono uppercase">Utilization</span>
                  <span className={`text-sm font-bold ${getStatusColor()}`}>
                    {utilization.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-amber-500/20 hover:border-amber-500/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-amber-500/20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all"></div>
              
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-amber-400/70 font-mono text-sm uppercase tracking-wider">Mempool Size</h3>
                  <div className="p-2 rounded-lg bg-amber-500/10">
                    <TrendingUp className="text-amber-400" size={24} />
                  </div>
                </div>
                
                <div className="text-5xl font-black text-white mb-4 tracking-tight">
                  {Math.round(mempool)}K
                </div>
                
                <div className="relative w-full h-2 bg-gray-700/50 rounded-full overflow-hidden">
                  <div 
                    className={`absolute inset-y-0 left-0 ${
                      mempool > 70 ? 'bg-red-500' : mempool > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                    } transition-all duration-300 rounded-full`}
                    style={{ width: `${mempool}%` }}
                  ></div>
                  <div 
                    className={`absolute inset-y-0 left-0 ${
                      mempool > 70 ? 'bg-red-500' : mempool > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                    } opacity-50 blur-sm transition-all duration-300`}
                    style={{ width: `${mempool}%` }}
                  ></div>
                </div>
                
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-gray-500 text-xs font-mono uppercase">Queue Status</span>
                  <span className={`text-sm font-bold ${
                    mempool > 70 ? 'text-red-400' : mempool > 50 ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {mempool > 70 ? 'HIGH' : mempool > 50 ? 'MODERATE' : 'LOW'}
                  </span>
                </div>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-teal-500/20 hover:border-teal-500/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-teal-500/20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl group-hover:bg-teal-500/10 transition-all"></div>
              
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-teal-400/70 font-mono text-sm uppercase tracking-wider">Avg Latency</h3>
                  <div className="p-2 rounded-lg bg-teal-500/10">
                    <Zap className="text-teal-400" size={24} />
                  </div>
                </div>
                
                <div className="text-5xl font-black text-white mb-4 tracking-tight">
                  {Math.round(latency)}<span className="text-2xl text-gray-500">ms</span>
                </div>
                
                <div className="relative w-full h-2 bg-gray-700/50 rounded-full overflow-hidden">
                  <div 
                    className={`absolute inset-y-0 left-0 ${
                      latency > 800 ? 'bg-red-500' : latency > 600 ? 'bg-amber-500' : 'bg-emerald-500'
                    } transition-all duration-300 rounded-full`}
                    style={{ width: `${Math.min((latency / 1200) * 100, 100)}%` }}
                  ></div>
                  <div 
                    className={`absolute inset-y-0 left-0 ${
                      latency > 800 ? 'bg-red-500' : latency > 600 ? 'bg-amber-500' : 'bg-emerald-500'
                    } opacity-50 blur-sm transition-all duration-300`}
                    style={{ width: `${Math.min((latency / 1200) * 100, 100)}%` }}
                  ></div>
                </div>
                
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-gray-500 text-xs font-mono uppercase">Response Time</span>
                  <span className={`text-sm font-bold ${
                    latency > 800 ? 'text-red-400' : latency > 600 ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {latency > 800 ? 'SLOW' : latency > 600 ? 'MODERATE' : 'FAST'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className={`relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 md:p-8 border-2 transition-all duration-300 shadow-2xl ${
            raikuActive 
              ? 'border-emerald-500/50 shadow-emerald-500/20' 
              : 'border-gray-700/50'
          }`}>
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full blur-3xl"></div>
            
            <div className="relative flex flex-col md:flex-row items-start gap-6">
              <div className={`p-5 rounded-2xl transition-all duration-300 ${
                raikuActive 
                  ? 'bg-gradient-to-br from-emerald-600 to-teal-600 shadow-lg shadow-emerald-500/50' 
                  : 'bg-gray-700/50'
              }`}>
                <Zap className="text-white" size={40} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-2xl md:text-3xl font-black text-white">
                    RAIKU PROTOCOL
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider ${
                    raikuActive 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' 
                      : 'bg-gray-700/50 text-gray-500 border border-gray-600/50'
                  }`}>
                    {raikuActive ? 'ONLINE' : 'OFFLINE'}
                  </span>
                </div>
                
                <p className="text-gray-400 mb-6 leading-relaxed font-mono text-sm">
                  {raikuActive 
                    ? 'Advanced AI-powered optimization system actively monitoring network conditions. Intelligent transaction routing and dynamic fee adjustment prevent congestion before it impacts performance.'
                    : 'Enable Raiku Protocol to activate real-time network optimization, smart routing algorithms, and predictive congestion prevention systems.'}
                </p>
                
                {raikuActive && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-emerald-950/50 to-emerald-900/30 rounded-xl p-4 border border-emerald-500/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Gauge className="text-emerald-400" size={18} />
                        <div className="text-emerald-400 font-bold text-sm">Smart Routing</div>
                      </div>
                      <div className="text-white font-mono text-xs">OPERATIONAL</div>
                    </div>
                    <div className="bg-gradient-to-br from-teal-950/50 to-teal-900/30 rounded-xl p-4 border border-teal-500/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="text-teal-400" size={18} />
                        <div className="text-teal-400 font-bold text-sm">Fee Optimization</div>
                      </div>
                      <div className="text-white font-mono text-xs">ACTIVE</div>
                    </div>
                    <div className="bg-gradient-to-br from-cyan-950/50 to-cyan-900/30 rounded-xl p-4 border border-cyan-500/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Cpu className="text-cyan-400" size={18} />
                        <div className="text-cyan-400 font-bold text-sm">Load Balancing</div>
                      </div>
                      <div className="text-white font-mono text-xs">RUNNING</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 font-mono text-xs tracking-wider">
              POWERED BY RAIKU • REAL-TIME NETWORK INTELLIGENCE
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
