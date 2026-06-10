import { useState } from 'react';
import { 
  FiEye, FiTrendingUp, FiShield, FiCpu, FiActivity, FiUsers, 
  FiGitCommit, FiAward, FiArrowRight, FiInfo, FiLayers, FiCompass
} from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function About() {
  const [activeTab, setActiveTab] = useState('ecosystem'); // 'ecosystem' | 'anatomy' | 'roadmap'

  const products = [
    {
      name: 'REKTINA MARKET',
      subtitle: 'University Marketplace — Flagship Launch Product',
      icon: FiTrendingUp,
      status: 'Launching This Semester',
      statusColor: 'bg-emerald-500 text-white',
      desc: 'A peer marketplace built specifically for university environments. Solves low vendor visibility, delivery logistics, and restocking inefficiencies for both buyers and sellers. Feeds real market data to vendors through intelligent analytics, helping them grow revenue.',
      anatomy: 'Retina — the core vision processor',
      meaning: 'Serves as the central interface and visual hub of the marketplace.',
      color: 'border-blue-500 bg-blue-50/20'
    },
    {
      name: 'SEAL',
      subtitle: 'Smart Contract Backed by Real Market Data',
      icon: FiAward,
      status: 'Planned',
      statusColor: 'bg-gray-400 text-white',
      desc: 'An investment product combining the trust of traditional stocks with the automation of smart contracts. Backed by real transaction data generated within the REKTINA ecosystem rather than speculation. Brand symbol: the seal (strong, trustworthy, unmovable).',
      anatomy: 'Seal — Trust, strength, unmovable investment',
      meaning: 'Underpins the monetary trust layers of the financial systems.',
      color: 'border-purple-500 bg-purple-50/20'
    },
    {
      name: 'UVEA',
      subtitle: 'Ecosystem Escrow Layer',
      icon: FiShield,
      status: 'Planned (Escrow active on Market)',
      statusColor: 'bg-blue-500 text-white',
      desc: 'Named after the middle protective layer of the eye that nourishing the retina. UVEA acts as the escrow infrastructure within the REKTINA ecosystem, sitting between transacting parties and holding funds securely until transaction terms are completed.',
      anatomy: 'Uvea — middle protective eye layer',
      meaning: 'Acts as the protective middle layer securing all transaction values.',
      color: 'border-indigo-500 bg-indigo-50/20'
    },
    {
      name: 'CAMILA',
      subtitle: 'Customer Care AI Specialist',
      icon: FiCpu,
      status: 'Planned',
      statusColor: 'bg-gray-400 text-white',
      desc: 'An AI-powered customer care specialist designed to help businesses manage customer interactions intelligently and efficiently. Fully integrates with other REKTINA products and operates as a standalone business integration tool.',
      anatomy: 'Camila — Human-like soft eye focus',
      meaning: 'Represents the gentle, soft-focus, customer-facing AI agent.',
      color: 'border-rose-500 bg-rose-50/20'
    },
    {
      name: 'BIVERGENCE',
      subtitle: 'Sister Company — IP Licensing & Research',
      icon: FiLayers,
      status: 'Planned',
      statusColor: 'bg-gray-400 text-white',
      desc: 'Operates as an IP licensing and idea-selling research sister company alongside REKTINA LLC. Designed to run hand-in-hand: REKTINA generates transaction data and software infrastructure, while BIVERGENCE monetizes IP assets.',
      anatomy: 'Bivergence — synchronized double-eye focus',
      meaning: 'Runs parallel to REKTINA, aligning research and implementation.',
      color: 'border-amber-500 bg-amber-50/20'
    },
    {
      name: 'CORNEAclear',
      subtitle: 'Next-Gen Camera Frame Quality Processor',
      icon: FiEye,
      status: 'Planned (IP under BIVERGENCE)',
      statusColor: 'bg-gray-400 text-white',
      desc: 'Next-generation camera quality processor software that provides ideal camera frame recommendations, lens type details, and optimal screen display configurations. Delivers superior visual clarity across devices for major manufacturers.',
      anatomy: 'Cornea — front transparent layer',
      meaning: 'Represents clarity and focus — what you see through first.',
      color: 'border-teal-500 bg-teal-50/20'
    }
  ];

  const roadmapPhases = [
    {
      phase: 'Phase 1',
      title: 'Launch Flagship',
      status: 'Active',
      desc: 'Deploy and launch REKTINA MARKET within the current university semester to establish transaction liquidity.',
      badge: 'bg-emerald-500 text-white'
    },
    {
      phase: 'Phase 2',
      title: 'Scale & Corporate foundation',
      status: 'Upcoming',
      desc: 'Scale REKTINA MARKET across campus networks and firmly establish REKTINA LLC corporate structures.',
      badge: 'bg-blue-600 text-white'
    },
    {
      phase: 'Phase 3',
      title: 'CAMILA & UVEA integration',
      status: 'Planned',
      desc: 'Roll out the CAMILA customer care AI agent and modular UVEA escrow services as integrated products.',
      badge: 'bg-gray-200 text-gray-600'
    },
    {
      phase: 'Phase 4',
      title: 'SEAL financial extension',
      status: 'Planned',
      desc: 'Introduce SEAL, the financial investment system backed by authentic, non-speculative ecosystem transaction metrics.',
      badge: 'bg-gray-200 text-gray-600'
    },
    {
      phase: 'Phase 5',
      title: 'Launch BIVERGENCE',
      status: 'Planned',
      desc: 'Inaugurate BIVERGENCE sister research group and initiate camera quality IP licensing (CORNEAclear).',
      badge: 'bg-gray-200 text-gray-600'
    },
    {
      phase: 'Long Term',
      title: 'Renewable R&D',
      status: 'Ultimate Goal',
      desc: 'Re-invest software holding company profits to fund original TECH-GORGE renewable energy hardware research.',
      badge: 'bg-blue-950 text-white'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-16">
      
      {/* Brand Hero Panel */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white py-16 px-4 relative overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-10 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-4">
          <span className="px-3.5 py-1 rounded-full bg-blue-500/25 border border-blue-500/30 text-blue-300 text-[10px] font-bold uppercase tracking-widest">
            Vision & Product Architecture
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
            REKTINA <span className="text-blue-500">LLC.</span>
          </h1>
          <p className="text-gray-400 text-xs md:text-sm max-w-xl mx-auto leading-relaxed">
            "Connecting University Communities — Buy, Sell & Transact with Confidence"
          </p>
          <div className="pt-4 flex justify-center gap-6 text-[11px] text-gray-300">
            <div>
              <span className="text-gray-500 block uppercase font-bold">FOUNDER</span>
              <span className="font-semibold text-white">Prince (Aquila.Script)</span>
            </div>
            <div className="border-l border-gray-800" />
            <div>
              <span className="text-gray-500 block uppercase font-bold">TEAM SIZE</span>
              <span className="font-semibold text-white">12 Members</span>
            </div>
            <div className="border-l border-gray-800" />
            <div>
              <span className="text-gray-500 block uppercase font-bold">STAGE</span>
              <span className="font-semibold text-blue-400">Pre-launch / Dev V2</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left: Origin story & Flywheel */}
          <div className="md:col-span-1 space-y-6">
            
            {/* Overview Card */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
              <h2 className="text-sm font-black text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                <FiInfo className="text-blue-600" /> Company Overview
              </h2>
              <p className="text-xs text-gray-500 leading-relaxed">
                REKTINA LLC. is a software holding company designed to own, develop, and scale multiple software products that aid businesses and consumers.
              </p>
              <div className="p-3.5 bg-blue-50/50 rounded-2xl border border-blue-100/50 text-[11px] text-blue-900 leading-relaxed">
                <strong>Origin story:</strong> Evolved from <strong>TECH-GORGE INNOVATIONS (TFI)</strong>, which originally pursued renewable energy hardware. The pivot to software generates the capital required to fund hardware ambitions.
              </div>
            </div>

            {/* Flywheel Card */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
              <h2 className="text-sm font-black text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                <FiActivity className="text-blue-600" /> The REKTINA Flywheel
              </h2>
              <p className="text-xs text-gray-500 leading-relaxed">
                REKTINA MARKET attracts buyers & sellers. Real transactions generate data that powers SEAL's investment engine, while UVEA protects checkout escrow and CAMILA automates user care.
              </p>

              {/* Styled Flow Diagram */}
              <div className="p-3 bg-gray-50 rounded-2xl space-y-2 border border-gray-100 text-[10px]">
                <div className="flex items-center justify-between font-bold text-gray-700">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg">REKTINA MARKET</span>
                  <FiArrowRight />
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg">Real Data</span>
                </div>
                <div className="h-6 border-l-2 border-dashed border-gray-200 ml-6" />
                <div className="flex items-center justify-between font-bold text-gray-700">
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg">SEAL (Investments)</span>
                  <FiArrowRight />
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-lg">UVEA (Escrow)</span>
                </div>
                <div className="pt-2 text-[9px] text-gray-400 text-center italic">
                  Data-backed security replaces speculation.
                </div>
              </div>
            </div>

          </div>

          {/* Right: Tabbed Details */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Tabs Selector */}
            <div className="flex rounded-2xl bg-gray-100 p-1.5 shadow-sm">
              {[
                { id: 'ecosystem', label: 'Product Ecosystem', Icon: FiLayers },
                { id: 'anatomy', label: 'Anatomy System', Icon: FiEye },
                { id: 'roadmap', label: 'Strategic Roadmap', Icon: FiGitCommit }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex-1 py-3 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${activeTab === t.id ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <t.Icon size={14} />
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab Contents: Ecosystem */}
            {activeTab === 'ecosystem' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map(p => {
                  const Icon = p.icon;
                  return (
                    <div key={p.name} className={`p-5 rounded-3xl border shadow-sm transition-all hover:scale-[1.01] ${p.color}`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm text-gray-700">
                          <Icon size={18} />
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${p.statusColor}`}>
                          {p.status}
                        </span>
                      </div>
                      <h3 className="text-xs font-black text-gray-900">{p.name}</h3>
                      <p className="text-[9px] text-gray-400 font-medium uppercase mt-0.5">{p.subtitle}</p>
                      <p className="text-[11px] text-gray-500 mt-2.5 leading-relaxed">
                        {p.desc}
                      </p>
                      <div className="mt-4 pt-3 border-t border-gray-100/50 text-[10px] text-gray-400">
                        <span className="font-bold text-gray-600">Origin: </span> {p.anatomy}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Tab Contents: Anatomy System */}
            {activeTab === 'anatomy' && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
                <div>
                  <h3 className="text-sm font-black text-gray-900">The Eye Anatomy Naming System</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Understanding the biological roots of each REKTINA LLC and BIVERGENCE brand asset.</p>
                </div>
                <div className="overflow-x-auto rounded-2xl border border-gray-100">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-gray-50 text-gray-400 font-bold uppercase tracking-wider border-b border-gray-100">
                        <th className="p-3">Product Name</th>
                        <th className="p-3">Eye Anatomy Origin</th>
                        <th className="p-3">Business / Ecosystem Meaning</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                      <tr>
                        <td className="p-3 font-semibold text-gray-900">REKTINA</td>
                        <td className="p-3">Retina — core vision processor</td>
                        <td className="p-3">The parent holding company. Central ecosystem processor.</td>
                      </tr>
                      <tr className="bg-blue-50/10">
                        <td className="p-3 font-semibold text-blue-600">REKTINA MARKET</td>
                        <td className="p-3">Retina visual sensor</td>
                        <td className="p-3">The flagship peer marketplace platform and core database interface.</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-purple-600">SEAL</td>
                        <td className="p-3">Seal (the animal)</td>
                        <td className="p-3">Ecosystem financial engine representing strength, trust, and unmovable contracts.</td>
                      </tr>
                      <tr className="bg-indigo-50/10">
                        <td className="p-3 font-semibold text-indigo-600">UVEA</td>
                        <td className="p-3">Uvea — middle protective eye layer</td>
                        <td className="p-3">The checkout transaction escrow layer protecting all buyers/sellers.</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-rose-500">CAMILA</td>
                        <td className="p-3">Camila focus definition</td>
                        <td className="p-3">Human-like soft customer care AI assistant automated service model.</td>
                      </tr>
                      <tr className="bg-teal-50/10">
                        <td className="p-3 font-semibold text-teal-600">CORNEAclear</td>
                        <td className="p-3">Cornea — front transparent layer</td>
                        <td className="p-3">IP asset for next-generation camera quality software displays.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab Contents: Roadmap */}
            {activeTab === 'roadmap' && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-black text-gray-900">Strategic Product Roadmap</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Phased execution leading to the core hardware development goals.</p>
                </div>
                <div className="relative pl-6 border-l-2 border-blue-100 space-y-6">
                  {roadmapPhases.map(r => (
                    <div key={r.phase} className="relative">
                      {/* dot icon indicator */}
                      <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full border-2 border-white bg-blue-600 shadow-sm" />
                      
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${r.badge}`}>
                            {r.phase}
                          </span>
                          <h4 className="text-xs font-bold text-gray-900">{r.title}</h4>
                          <span className="text-[9px] text-gray-400 font-semibold italic">• {r.status}</span>
                        </div>
                        <p className="text-[11px] text-gray-500 leading-relaxed">
                          {r.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
      
      {/* Platform Info Banner */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="p-4 bg-gray-900 text-white rounded-3xl text-center text-xs space-y-1">
          <p>© 2026 REKTINA LLC. Confidential Internal Document — All rights reserved.</p>
          <p className="text-gray-400 text-[10px]">Proprietary brand assets governed under global holding trademarks.</p>
        </div>
      </div>
    </div>
  );
}
