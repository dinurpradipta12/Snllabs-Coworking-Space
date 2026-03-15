import { Mail, MapPin, Building, CreditCard, Github, Linkedin, ExternalLink, Download, Trophy, Target, Hexagon, Star } from 'lucide-react';

export default function Profile() {
  const badges = [
    { id: 1, icon: '🚀', name: 'First Blood', desc: 'Submit tugas < 10 menit', color: 'bg-[#22d3ee]' },
    { id: 2, icon: '🐛', name: 'Bug Hunter', desc: 'Menemukan 5 bug logic', color: 'bg-[#ff4757]' },
    { id: 3, icon: '💯', name: 'Perfect Attend', desc: 'Hadir 100% sesi bulan 1', color: 'bg-[#ffda79]' },
    { id: 4, icon: '📦', name: 'UI Master', desc: 'Komponen pixel perfect', color: 'bg-white' },
    { id: 5, icon: '🔒', name: 'Locked', desc: 'Butuh Level 10', color: 'bg-gray-200 opacity-50 border-dashed' },
    { id: 6, icon: '🔒', name: 'Locked', desc: 'Raih 5.000 XP', color: 'bg-gray-200 opacity-50 border-dashed' },
    { id: 7, icon: '🔒', name: 'Locked', desc: 'Bantu 3 teman', color: 'bg-gray-200 opacity-50 border-dashed' },
    { id: 8, icon: '🔒', name: 'Locked', desc: 'Presentasi Final', color: 'bg-gray-200 opacity-50 border-dashed' },
  ];

  return (
    <div className="space-y-6 pb-24">
      {/* ID Card Hero Banner */}
      <div className="bg-[#ffda79] rounded-2xl border-4 border-[#1e293b] shadow-[6px_6px_0px_#1e293b] overflow-hidden relative group">
        
        {/* Decorative ID Card Elements */}
        <div className="absolute top-0 right-0 w-48 h-full opacity-5 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 2px, transparent 2px, transparent 10px)' }}></div>
        <div className="absolute bottom-4 right-4 hidden md:flex items-center gap-1 opacity-20 transform -rotate-90 origin-bottom-right translate-x-12 cursor-default pointer-events-none">
           {[...Array(12)].map((_, i) => <div key={i} className={`h-6 ${i % 3 === 0 ? 'w-1' : i % 2 === 0 ? 'w-1.5' : 'w-0.5'} bg-[#1e293b]`}></div>)}
           <span className="font-mono text-[10px] ml-2 tracking-widest font-black">ID:8902-X</span>
        </div>

        <div className="p-4 md:p-6 flex flex-col md:flex-row items-center gap-6 relative z-10">
          {/* Avatar Container */}
          <div className="relative shrink-0">
            <div className="w-28 h-28 rounded-xl bg-[#ff4757] border-4 border-[#1e293b] flex items-center justify-center overflow-hidden shadow-[4px_4px_0px_#1e293b] rotate-2 group-hover:rotate-0 transition-transform">
              <img src="https://ui-avatars.com/api/?name=Dinur+Pradipta&background=ff4757&color=fff&size=150" alt="Profile" className="w-full h-full object-cover scale-110" />
            </div>
            <div className="absolute -bottom-3 -right-3 bg-[#22d3ee] px-3 py-1 rounded-md border-2 border-[#1e293b] shadow-[2px_2px_0px_#1e293b] transform -rotate-3">
              <span className="font-black text-[10px]  underline">Level 5</span>
            </div>
          </div>

          <div className="text-center md:text-left flex-1 lg:pl-2">
            <h4 className="text-[8px] md:text-[9px] font-black  tracking-widest bg-[#1e293b] text-white px-2 py-0.5 inline-block border-2 border-white mb-2 shadow-[2px_2px_0px_#1e293b] transform -rotate-1">OFFICIAL MENTEE</h4>
            <h1 className="font-black text-3xl md:text-4xl lg:text-5xl  italic leading-none mb-3 drop-shadow-[2px_2px_0px_#fff]">Dinur M. Pradipta</h1>
            
            <div className="flex flex-col md:flex-row gap-3 items-center mb-4 text-[#1e293b]/80 text-sm">
              <span className="font-bold flex items-center gap-1.5"><Mail size={14} /> dinur.pradipta@snllabs.co</span>
              <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-[#1e293b]"></span>
              <span className="font-bold flex items-center gap-1.5 text-[#ff4757]"><MapPin size={14} /> Jakarta, ID</span>
            </div>

            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
               <span className="bg-white px-2.5 py-1 rounded-md border-2 border-[#1e293b] text-[10px] font-black  shadow-[2px_2px_0px_#1e293b] hover:-translate-y-0.5 transition-transform cursor-default">Frontend Dev</span>
               <span className="bg-[#22d3ee] px-2.5 py-1 rounded-md border-2 border-[#1e293b] text-[10px] font-black  shadow-[2px_2px_0px_#1e293b] hover:-translate-y-0.5 transition-transform cursor-default">React.js</span>
               <span className="bg-[#ff4757] text-white px-2.5 py-1 rounded-md border-2 border-[#1e293b] text-[10px] font-black  shadow-[2px_2px_0px_#1e293b] hover:-translate-y-0.5 transition-transform cursor-default">Tailwind</span>
            </div>
          </div>
          
          <button className="md:absolute top-4 right-4 bg-white p-2.5 rounded-xl border-4 border-[#1e293b] shadow-[4px_4px_0px_#1e293b] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
            <Hexagon size={20} className="text-[#1e293b]" />
          </button>
        </div>
      </div>

      {/* Grid Layout (2 Cols: Main Info + Bento Sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column (Spans 2): Quests & Badges */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Current Mentoring Quest */}
          <div className="bg-[#fffdf5] p-6 rounded-2xl border-4 border-[#1e293b] shadow-[6px_6px_0px_#1e293b] relative overflow-hidden">
            <Target size={120} className="absolute -top-10 -right-10 text-[#22d3ee]/20" />
            <h3 className="font-black text-xl  flex items-center gap-2 mb-6 border-b-4 border-[#1e293b] pb-3 relative z-10">
              <Target size={24} className="text-[#ff4757]" strokeWidth={3} /> Status Mentoring
            </h3>
            
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-stretch relative z-10">
              <div className="w-full md:w-1/3 bg-[#22d3ee] p-4 rounded-xl border-2 border-[#1e293b] shadow-[4px_4px_0px_#1e293b] text-center flex flex-col justify-center">
                <span className="text-[10px] font-black  block mb-2 opacity-60">Mentor Utama</span>
                <div className="w-16 h-16 rounded-full border-2 border-[#1e293b] bg-white mx-auto mb-2 overflow-hidden">
                  <img src="https://ui-avatars.com/api/?name=Andi+Setiawan&background=000&color=fff" alt="Mentor" className="w-full h-full object-cover" />
                </div>
                <h5 className="font-black text-base ">Andi Setiawan</h5>
                <span className="text-[10px] font-bold">Sr. Engineering</span>
              </div>
              
              <div className="w-full md:w-2/3 bg-white p-5 rounded-xl border-2 border-[#1e293b] border-dashed flex flex-col justify-center">
                <div className="flex justify-between items-start mb-2">
                  <span className="bg-[#ff4757] text-white text-[9px] font-black  px-2 py-0.5 rounded border border-[#1e293b]">Active Quest</span>
                  <span className="text-[10px] font-black opacity-50">Bergabung: 01 Jan 2026</span>
                </div>
                <h4 className="font-black text-2xl  italic leading-none mb-2">Fase 2: React Component & Hooks</h4>
                <p className="text-sm font-bold text-[#1e293b]/70 mb-4">Fokus pembelajaran minggu ini adalah state management per-komponen dan perancangan UI yang atomic.</p>
                <div className="w-full bg-gray-100 h-2 rounded-full border border-[#1e293b]/20 overflow-hidden">
                  <div className="bg-[#ffda79] h-full w-[45%]"></div>
                </div>
                <span className="text-[9px] font-black  text-right block mt-1 opacity-50">Misi selesai: 45%</span>
              </div>
            </div>
          </div>

          {/* Badge Inventory (Showcase) */}
          <div className="bg-white p-6 rounded-2xl border-4 border-[#1e293b] shadow-[6px_6px_0px_#1e293b]">
            <div className="flex justify-between items-center border-b-4 border-[#1e293b] pb-3 mb-6">
               <h3 className="font-black text-xl  flex items-center gap-2">
                 <Trophy size={24} className="text-[#ffda79]" strokeWidth={3} /> Koleksi Badge
               </h3>
               <span className="bg-[#1e293b] text-white px-3 py-1 rounded-lg text-xs font-black border-2 border-[#1e293b] shadow-[2px_2px_0px_#ffda79]">4 / 8</span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {badges.map(badge => (
                <div 
                  key={badge.id} 
                  className={`relative group bg-[#fffdf5] border-2 border-[#1e293b] rounded-xl aspect-square flex flex-col items-center justify-center p-2 text-center transition-all ${badge.color.includes('opacity-50') ? 'opacity-50 hover:opacity-100 grayscale hover:grayscale-0 border-dashed' : 'shadow-[4px_4px_0px_#1e293b] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#1e293b]'}`}
                >
                  <div className={`w-12 h-12 rounded-full border-2 border-[#1e293b] flex items-center justify-center text-xl mb-2 shadow-[2px_2px_0px_#1e293b] ${badge.color}`}>
                    {badge.icon}
                  </div>
                  <h5 className="font-black text-xs  leading-tight px-1">{badge.name}</h5>
                  
                  {/* Tooltip Hover */}
                  <div className="absolute -top-12 inset-x-0 bg-[#1e293b] text-white text-[9px] font-black p-2 rounded-lg border-2 border-[#1e293b] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-20 shadow-[2px_2px_0px_#ff4757]">
                    {badge.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Spans 1): Bento Grid for Links & Actions */}
        <div className="space-y-6">
          
          <h3 className="font-black text-lg  italic border-b-4 border-[#1e293b] pb-2 pl-2">Koneksi & Tautan</h3>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Github Button */}
            <a href="#" className="col-span-2 bg-[#1e293b] text-white p-4 rounded-xl border-4 border-[#22d3ee] shadow-[4px_4px_0px_#22d3ee] flex items-center justify-between group hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
              <div className="flex items-center gap-3">
                <Github size={28} />
                <div>
                  <span className="block font-black text-sm ">GitHub</span>
                  <span className="block text-[10px] font-bold opacity-60">@dinurpradipta</span>
                </div>
              </div>
              <ExternalLink size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>

            {/* LinkedIn Button */}
            <a href="#" className="bg-[#fffdf5] p-4 rounded-xl border-4 border-[#1e293b] shadow-[4px_4px_0px_#1e293b] flex flex-col items-center justify-center gap-2 group hover:translate-x-1 hover:-translate-y-1 hover:bg-[#22d3ee] transition-all text-center">
              <Linkedin size={28} className="text-[#0077b5] group-hover:text-[#1e293b]" />
              <span className="font-black text-[10px] ">LinkedIn</span>
            </a>

            {/* Portfolio Button */}
            <a href="#" className="bg-[#fffdf5] p-4 rounded-xl border-4 border-[#1e293b] shadow-[4px_4px_0px_#1e293b] flex flex-col items-center justify-center gap-2 group hover:-translate-x-1 hover:-translate-y-1 hover:bg-[#ffda79] transition-all text-center">
              <Building size={28} className="text-[#1e293b]" />
              <span className="font-black text-[10px] ">Portofolio</span>
            </a>

            {/* Download CV */}
            <button className="col-span-2 bg-[#ff4757] text-white p-4 rounded-xl border-4 border-[#1e293b] shadow-[4px_4px_0px_#1e293b] flex items-center justify-center gap-3 group hover:translate-y-1 hover:shadow-[0px_0px_0px_#1e293b] transition-all">
               <Download size={20} className="group-hover:animate-bounce" />
               <span className="font-black text-sm ">Unduh CV (PDF)</span>
            </button>
            
            {/* Edit Profile Quick Action */}
            <button className="col-span-2 mt-4 bg-white text-[#1e293b] p-3 rounded-xl border-2 border-dashed border-[#1e293b] hover:border-solid hover:bg-[#1e293b] hover:text-white transition-colors flex items-center justify-center gap-2 text-xs font-black ">
               Sesuaikan Profil <Star size={14} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
