import { useState } from 'react';
import { 
  BarChart3, Users, TrendingUp, Award, Clock, 
  ChevronRight, ArrowUpRight, ArrowDownRight, 
  Target, Zap, Flame, Calendar, Search, 
  Download, Filter, MoreHorizontal
} from 'lucide-react';
import { useData } from '../context/DataContext';

export default function UserStats() {
  const { allUsers, loading } = useData();
  const [timeframe, setTimeframe] = useState('7d');

  if (loading && allUsers.length === 0) {
    return <div className="p-10 font-black  italic animate-pulse">Syncing Global Analytics...</div>;
  }

  // Calculate dynamic stats from Firestore
  const totalUsersCount = allUsers.length;
  const avgLevel = allUsers.length > 0 
    ? Math.round(allUsers.reduce((acc, u) => acc + (u.dashboard?.level || 0), 0) / allUsers.length) 
    : 0;
  const totalXP = allUsers.reduce((acc, u) => acc + (u.dashboard?.currentXP || 0), 0);
  
  const stats = [
    { label: 'Total Registered Users', value: totalUsersCount.toString(), trend: '+100%', icon: Users, color: '#22d3ee' },
    { label: 'Avg. Student Level', value: `LVL ${avgLevel}`, trend: '+12%', icon: TrendingUp, color: '#ffda79' },
    { label: 'Total XP Distributed', value: totalXP.toLocaleString(), trend: '+100%', icon: Award, color: '#ff4757' },
    { label: 'Real-time Connections', value: 'Active', trend: 'Live', icon: Zap, color: '#a29bfe' },
  ];

  // Map Firestore users to the list format
  const userList = allUsers.map(u => ({
    id: u.id,
    name: u.displayName || u.id.substring(0, 10) + '...',
    photo: u.photoURL,
    level: u.dashboard?.level || 0,
    xp: u.dashboard?.currentXP || 0,
    status: u.lastUpdated || u.lastLogin ? 'Online' : 'Offline',
    trend: '+0%'
  })).sort((a, b) => b.xp - a.xp); // Rank by XP


  return (
    <div className="space-y-8 pb-20 text-[#1e293b]">
      {/* Header */}
      <div className="bg-white p-8 rounded-3xl border-4 border-[#1e293b] shadow-[8px_8px_0px_#ffda79] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black  italic tracking-tighter flex items-center gap-3">
            <BarChart3 size={40} className="text-[#ff4757]" /> User Analytics
          </h1>
          <p className="font-bold text-sm opacity-60 mt-2  tracking-wide">Monitoring pertumbuan & aktivitas user secara realtime.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 bg-[#22d3ee] text-[#1e293b] px-4 py-2 rounded-xl border-2 border-[#1e293b] font-black text-xs  shadow-[4px_4px_0px_#1e293b] hover:translate-y-1 hover:shadow-none transition-all"
          >
            <Zap size={16} /> Force Sync Data
          </button>
          <select 
            value={timeframe} 
            onChange={(e) => setTimeframe(e.target.value)}
            className="bg-[#1e293b] text-white px-4 py-2 rounded-xl border-2 border-[#1e293b] font-black text-xs  focus:outline-none shadow-[4px_4px_0px_#22d3ee]"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
          <button className="bg-white p-2 rounded-xl border-2 border-[#1e293b] shadow-[4px_4px_0px_#1e293b] hover:translate-y-1 hover:shadow-none transition-all">
            <Download size={20} />
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border-4 border-[#1e293b] shadow-[6px_6px_0px_#1e293b] relative overflow-hidden group hover:-translate-y-1 transition-all">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
              <stat.icon size={64} />
            </div>
            <div className="relative z-10">
              <span className="font-black text-[10px]  opacity-50 block mb-1">{stat.label}</span>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-black italic tracking-tighter">{stat.value}</span>
                <span className={`text-[10px] font-black pb-1 ${stat.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.trend}
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full mt-4 border border-[#1e293b] overflow-hidden">
                <div 
                  className="h-full bg-[#1e293b] transition-all duration-1000" 
                  style={{ width: '65%', backgroundColor: stat.color }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Progress List */}
        <div className="lg:col-span-2 bg-white rounded-3xl border-4 border-[#1e293b] shadow-[8px_8px_0px_#1e293b] overflow-hidden">
          <div className="bg-[#1e293b] text-white p-6 flex justify-between items-center border-b-4 border-[#1e293b]">
            <h3 className="font-black text-xl  italic flex items-center gap-2">
              <Users size={24} className="text-[#22d3ee]" /> Student Leaderboard
            </h3>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40 text-[#1e293b]" />
              <input 
                type="text" 
                placeholder="Search students..." 
                className="bg-white text-[#1e293b] text-xs font-bold pl-10 pr-4 py-2 rounded-xl border-2 border-white focus:outline-none focus:border-[#22d3ee] w-48"
              />
            </div>
          </div>
          <div className="p-0">
            <table className="w-full">
              <thead className="bg-[#fffdf5] border-b-2 border-[#1e293b]">
                <tr className="text-left font-black text-[10px]  opacity-50">
                  <th className="p-4 pl-6">Rank</th>
                  <th className="p-4">Student</th>
                  <th className="p-4 text-center">Level</th>
                  <th className="p-4 text-center">XP Total</th>
                  <th className="p-4">Growth</th>
                  <th className="p-4 pr-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-dashed divide-black/10">
                {userList.map((user, idx) => (
                  <tr key={user.id} className="hover:bg-[#22d3ee]/5 transition-colors group">
                    <td className="p-4 pl-6 font-black italic text-lg">#{idx + 1}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {user.photo ? (
                          <img 
                            src={user.photo} 
                            alt={user.name} 
                            className="w-10 h-10 border-2 border-[#1e293b] rounded-full shadow-[2px_2px_0px_#1e293b] object-cover" 
                          />
                        ) : (
                          <div className="w-10 h-10 bg-[#ffda79] border-2 border-[#1e293b] rounded-full shadow-[2px_2px_0px_#1e293b] flex items-center justify-center font-black text-xs">
                            {user.name.charAt(0)}
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="font-black text-sm ">{user.name}</span>
                          <span className="text-[8px] opacity-40 font-bold truncate w-32">{user.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="bg-[#1e293b] text-white px-2 py-0.5 rounded font-black italic text-xs">LVL {user.level}</span>
                    </td>
                    <td className="p-4 text-center font-bold text-sm">{user.xp.toLocaleString()} XP</td>
                    <td className="p-4">
                      <div className={`flex items-center gap-1 font-black text-xs ${user.xp > 0 ? 'text-green-500' : 'text-gray-400'}`}>
                        {user.xp > 0 ? <ArrowUpRight size={14} /> : <Zap size={14} />}
                        {user.xp > 0 ? '+100%' : 'Init'}
                      </div>
                    </td>
                    <td className="p-4 pr-6">
                      <div className={`text-[9px] font-black  px-2 py-1 rounded inline-block border-2 border-[#1e293b] shadow-[2px_2px_0px_#1e293b] ${user.status === 'Online' ? 'bg-[#22d3ee]' : 'bg-gray-200'}`}>
                        {user.status}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Learning Distribution */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border-4 border-[#1e293b] shadow-[8px_8px_0px_#1e293b]">
            <h3 className="font-black text-lg  italic border-b-2 border-[#1e293b] pb-3 mb-4 flex items-center gap-2">
              <Target size={20} className="text-[#ff4757]" /> Learning Pillars
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Copywriting', value: 78, color: '#ffda79' },
                { label: 'Platform Strategy', value: 65, color: '#22d3ee' },
                { label: 'Visual Design', value: 42, color: '#ff4757' },
                { label: 'Analytics Mastery', value: 25, color: '#a29bfe' }
              ].map((pillar, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-black  italic">
                    <span>{pillar.label}</span>
                    <span>{pillar.value}%</span>
                  </div>
                  <div className="w-full h-4 bg-gray-100 border-2 border-[#1e293b] rounded-lg overflow-hidden flex">
                    <div 
                      className="h-full border-r-2 border-[#1e293b] transition-all duration-700" 
                      style={{ width: `${pillar.value}%`, backgroundColor: pillar.color }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#1e293b] text-white p-6 rounded-3xl border-4 border-[#1e293b] shadow-[8px_8px_0px_#22d3ee]">
             <div className="flex items-start gap-4 mb-4">
                <div className="bg-[#22d3ee] p-2 rounded-xl text-[#1e293b] border-2 border-white">
                   <Flame size={20} fill="currentColor" />
                </div>
                <div>
                   <h4 className="font-black text-sm ">Engagement Peak</h4>
                   <p className="text-[10px] font-bold opacity-60">Pukul 20:00 - 22:00 WIB adalah waktu tersibuk user belajar.</p>
                </div>
             </div>
             <button className="w-full bg-white text-[#1e293b] py-3 rounded-xl border-4 border-white font-black  text-xs shadow-[4px_4px_0px_#22d3ee] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                Generate Growth Report
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
