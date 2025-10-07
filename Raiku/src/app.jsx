<>
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
</>