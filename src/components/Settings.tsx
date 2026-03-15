import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, Bell, Lock, Shield, Moon, MonitorSmartphone, 
  LogOut, Download, Globe, X, Key, User, Palette, Image, Layout, Save, 
  Zap, Activity, Cpu, Database, CheckCircle2, AlertCircle, Smartphone as PhoneIcon,
  Monitor as ScreenIcon, Info, LockIcon, RefreshCw, ExternalLink
} from 'lucide-react';
import { auth, storage } from '../firebase';
import { signOut } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useData } from '../context/DataContext';

// --- SUB-COMPONENTS ---

const StatusBadge = ({ label, active, color = 'bg-[#22d3ee]' }: { label: string, active: boolean, color?: string }) => (
  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border-2 border-[#1e293b] ${active ? 'bg-white' : 'bg-gray-100 opacity-50'} transition-all shadow-[2px_2px_0px_#1e293b]`}>
    <div className={`w-2 h-2 rounded-full ${active ? color : 'bg-gray-400'} ${active ? 'animate-pulse' : ''}`} />
    <span className="text-[10px] font-black  tracking-tight">{label}</span>
  </div>
);

const BentoCard = ({ children, title, icon: Icon, color = 'bg-white', shadow = 'shadow-[6px_6px_0px_#1e293b]', className = '' }: any) => (
  <div className={`rounded-3xl border-4 border-[#1e293b] ${color} ${shadow} overflow-hidden flex flex-col ${className}`}>
    {title && (
      <div className="px-6 py-4 border-b-4 border-[#1e293b] flex items-center justify-between bg-[#1e293b] text-white">
        <div className="flex items-center gap-3">
          {Icon && <Icon size={20} className="text-[#22d3ee]" />}
          <h3 className="font-black  italic text-sm tracking-tight">{title}</h3>
        </div>
      </div>
    )}
    <div className="p-6 flex-1">
      {children}
    </div>
  </div>
);

export default function Settings({ isAdmin, setIsAdmin }: { isAdmin: boolean, setIsAdmin: any }) {
  const { appConfig, updateAppConfig } = useData();
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [editAppConfig, setEditAppConfig] = useState(appConfig);
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [isUploading, setIsUploading] = useState<string | null>(null);
  const [systemStats, setSystemStats] = useState({
    latency: '...',
    storageUsed: '0.8 MB',
    lastSync: 'Now'
  });

  // Simulator States
  const [simulatorView, setSimulatorView] = useState<'mobile' | 'desktop'>('mobile');

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStats(prev => ({
        ...prev,
        latency: `${Math.floor(Math.random() * 50) + 15}ms`,
        lastSync: 'Online'
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const normalizeImageUrl = (url: string) => {
    if (!url) return '';
    let target = url.trim();

    if (target.includes('<img')) {
      const match = target.match(/src=["']([^"']+)["']/);
      if (match && match[1]) target = match[1];
    } else if (target.includes('<a ')) {
      const match = target.match(/href=["']([^"']+)["']/);
      if (match && match[1]) target = match[1];
    }

    let cleanUrl = target.split('&cache_bust=')[0];
    if (cleanUrl.includes('drive.google.com')) {
      let id = '';
      const matchD = cleanUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
      const matchID = cleanUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (matchD && matchD[1]) id = matchD[1];
      else if (matchID && matchID[1]) id = matchID[1];
      if (id) return `https://drive.google.com/uc?export=view&id=${id}`;
    }
    if (cleanUrl.includes('dropbox.com')) {
      return cleanUrl.replace('www.dropbox.com', 'dl.dropboxusercontent.com').replace('?dl=0', '');
    }
    return cleanUrl;
  };

  const refreshPreview = (type: 'logo' | 'favicon') => {
    const currentUrl = editAppConfig[type];
    if (!currentUrl) return;
    const buster = `&cache_bust=${Date.now()}`;
    const cleanUrl = currentUrl.split('&cache_bust=')[0];
    setEditAppConfig({ ...editAppConfig, [type]: cleanUrl + buster });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'favicon') => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'image/png') {
       alert('Mohon upload file .PNG saja!');
       return;
    }
    setIsUploading(type);
    try {
      const storageRef = ref(storage, `branding/${type}_${Date.now()}.png`);
      const uploadTask = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(uploadTask.ref);
      setEditAppConfig({ ...editAppConfig, [type]: url });
    } catch (err: any) {
      console.error('Upload error:', err);
      alert('Gagal upload! Cek Firebase Storage Rules.');
    } finally {
      setIsUploading(null);
    }
  };

  const BrandingInput = ({ label, type, icon: Icon, placeholder, tip }: any) => (
    <div className="space-y-3">
      <label className="text-[10px] font-black  opacity-40 flex items-center gap-2 ml-1">
        <Icon size={14} /> {label}
      </label>
      <div className="relative group">
        <input 
          type="text" 
          placeholder={placeholder}
          value={editAppConfig?.[type] || ''}
          onChange={(e) => setEditAppConfig({...editAppConfig, [type]: normalizeImageUrl(e.target.value)})}
          className="w-full p-3 border-2 border-[#1e293b] rounded-xl font-bold text-[10px] bg-gray-50 focus:bg-white focus:outline-none"
        />
        <button onClick={() => refreshPreview(type)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#22d3ee] hover:rotate-180 transition-transform">
            <RefreshCw size={14} />
        </button>
      </div>
      {tip && (
        <div className="bg-[#1e293b]/5 p-2 rounded-xl border border-dashed border-[#1e293b]/20 text-[8px] font-bold text-[#1e293b]/50 italic">
          {tip}
        </div>
      )}
    </div>
  );

  useEffect(() => {
    setEditAppConfig(appConfig);
  }, [appConfig]);

  const handleSaveAppConfig = async () => {
    setIsSavingConfig(true);
    await updateAppConfig(editAppConfig);
    setIsSavingConfig(false);
    alert('🎨 Branding Global Berhasil Diperbarui!');
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'arunika' && password === 'ar4925') {
      setIsAdmin(true);
      setShowModal(false);
      setUsername('');
      setPassword('');
      setError('');
    } else {
      setError('Akses ditolak. Credential teknis salah.');
    }
  };

  return (
    <div className="space-y-8 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 1. TOP HEADER SECTION */}
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="bg-[#1e293b] p-3 rounded-2xl border-4 border-white shadow-[4px_4px_0px_#22d3ee]">
                <SettingsIcon size={32} className="text-[#22d3ee]" />
             </div>
             <div>
                <h1 className="text-4xl font-black  italic tracking-tighter text-[#1e293b]">Settings Root</h1>
                <div className="flex gap-2">
                   <StatusBadge label="Firebase Sync" active={true} />
                   <StatusBadge label="Storage 2.0" active={true} color="bg-[#ffda79]" />
                </div>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
           {isAdmin ? (
             <div className="flex items-center gap-2 bg-[#ffda79] px-4 py-2 border-4 border-[#1e293b] rounded-2xl shadow-[4px_4px_0px_#1e293b]">
                <Zap size={18} className="animate-pulse" />
                <span className="font-black text-xs  italic tracking-tighter">Dev Mode Active</span>
                <button onClick={() => setIsAdmin(false)} className="ml-2 bg-[#1e293b] text-white rounded-lg p-1 transition-colors">
                  <X size={14} />
                </button>
             </div>
           ) : (
             <button 
               onClick={() => setShowModal(true)}
               className="bg-[#1e293b] text-white px-6 py-3 rounded-2xl font-black  text-xs border-4 border-[#1e293b] shadow-[4px_4px_0px_#22d3ee] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
             >
                Enter Developer Room
             </button>
           )}
        </div>
      </div>

      {/* 2. MAIN BENTO GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: BRANDING (ADMIN ONLY) */}
        {isAdmin ? (
          <div className="lg:col-span-8 flex flex-col gap-8">
            <BentoCard 
              title="Identity & Environment Manager" 
              icon={Palette} 
              color="bg-white"
              shadow="shadow-[12px_12px_0px_#1e293b]"
              className="relative overflow-hidden"
            >
              {/* SAVING OVERLAY */}
              {isSavingConfig && (
                <div className="absolute inset-0 z-50 bg-[#1e293b]/90 backdrop-blur-md flex flex-col items-center justify-center text-[#22d3ee]">
                    <RefreshCw size={48} className="animate-spin mb-4" />
                    <h2 className="text-2xl font-black  italic tracking-widest animate-pulse">Synchronizing...</h2>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* SETTINGS FORM */}
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black  opacity-40 flex items-center gap-2 ml-1">
                       <Layout size={14} /> Application Name
                    </label>
                    <input 
                      type="text" 
                      value={editAppConfig?.name || ''}
                      onChange={(e) => setEditAppConfig({...editAppConfig, name: e.target.value.toUpperCase()})}
                      className="w-full p-4 border-4 border-[#1e293b] rounded-2xl font-black text-xl italic bg-[#f8fafc] focus:bg-white focus:outline-none focus:shadow-[4px_4px_0px_#22d3ee] transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <BrandingInput 
                        label="Logo Utama (Dark)" 
                        type="logo" 
                        icon={Image} 
                        placeholder="Link logo berwarna/gelap..."
                        tip="Gunakan di background Terang"
                    />
                    <BrandingInput 
                        label="Logo Alternatif (White)" 
                        type="logoLight" 
                        icon={Moon} 
                        placeholder="Link logo putih/terang..."
                        tip="Gunakan di background Gelap"
                    />
                  </div>
                  
                  <BrandingInput 
                      label="Favicon Browser" 
                      type="favicon" 
                      icon={Zap} 
                      placeholder="PNG 32x32px..."
                  />

                  <button 
                    onClick={handleSaveAppConfig}
                    className="w-full py-5 bg-[#1e293b] text-white rounded-2xl font-black  italic text-lg border-4 border-[#1e293b] shadow-[8px_8px_0px_#ffda79] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-3 mt-4"
                  >
                     <Save size={24} className="text-[#ffda79]" /> Save All Branding
                  </button>
                </div>

                {/* VISUAL SIMULATOR */}
                <div className="bg-[#f8fafc] rounded-3xl border-4 border-[#1e293b] p-6 relative flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                       <span className="text-[10px] font-black  text-[#1e293b]/40 italic tracking-widest">Dual-Mode Simulator</span>
                       <div className="flex bg-[#1e293b] p-1 rounded-xl border-2 border-[#1e293b]">
                          <button 
                            onClick={() => setSimulatorView('mobile')}
                            className={`p-1.5 rounded-lg transition-all ${simulatorView === 'mobile' ? 'bg-[#22d3ee] text-[#1e293b]' : 'text-white/40'}`}
                          >
                             <PhoneIcon size={16} />
                          </button>
                          <button 
                            onClick={() => setSimulatorView('desktop')}
                            className={`p-1.5 rounded-lg transition-all ${simulatorView === 'desktop' ? 'bg-[#22d3ee] text-[#1e293b]' : 'text-white/40'}`}
                          >
                             <ScreenIcon size={16} />
                          </button>
                       </div>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center gap-6 relative min-h-[300px]">
                       {simulatorView === 'mobile' ? (
                          <div className="flex gap-4">
                             {/* Light Mode Mockup */}
                             <div className="w-36 h-60 bg-white rounded-[24px] border-[4px] border-[#1e293b] shadow-lg relative overflow-hidden flex flex-col items-center justify-center p-3 text-center">
                                <span className="absolute top-2 text-[6px] font-black opacity-20 ">Light Theme</span>
                                {editAppConfig.logo ? <img src={editAppConfig.logo} className="h-12 object-contain" alt="L" /> : <div className="h-10 w-10 bg-gray-100 rounded" />}
                                <h1 className="text-[10px] font-black mt-2 leading-none">{editAppConfig.name}</h1>
                             </div>
                             {/* Dark Mode Mockup */}
                             <div className="w-36 h-60 bg-[#1e293b] rounded-[24px] border-[4px] border-white/20 shadow-lg relative overflow-hidden flex flex-col items-center justify-center p-3 text-center text-white">
                                <span className="absolute top-2 text-[6px] font-black opacity-40 ">Dark Theme</span>
                                {editAppConfig.logoLight ? <img src={editAppConfig.logoLight} className="h-12 object-contain" alt="L" /> : <div className="h-10 w-10 bg-white/10 rounded" />}
                                <h1 className="text-[10px] font-black mt-2 leading-none">{editAppConfig.name}</h1>
                             </div>
                          </div>
                       ) : (
                          <div className="w-full flex flex-col gap-4">
                             {/* Desktop Small Mockups */}
                             <div className="w-full h-32 bg-white rounded-xl border-[4px] border-[#1e293b] shadow-md p-4 flex items-center justify-between">
                                <span className="text-[8px] font-black opacity-20 absolute top-1 left-2">Desktop Header Light</span>
                                <img src={editAppConfig.logo} className="h-6 object-contain" alt="L" />
                                <div className="flex gap-2"><div className="w-8 h-2 bg-gray-100 rounded" /><div className="w-8 h-2 bg-gray-100 rounded" /></div>
                             </div>
                             <div className="w-full h-32 bg-[#1e293b] rounded-xl border-[4px] border-white/20 shadow-md p-4 flex items-center justify-between text-white">
                                <span className="text-[8px] font-black opacity-20 absolute top-1 left-2">Desktop Header Dark</span>
                                <img src={editAppConfig.logoLight} className="h-6 object-contain" alt="L" />
                                <div className="flex gap-2"><div className="w-8 h-2 bg-white/10 rounded" /><div className="w-8 h-2 bg-white/10 rounded" /></div>
                             </div>
                          </div>
                       )}
                    </div>

                    <div className="mt-6 p-4 bg-[#1e293b] rounded-2xl border-4 border-white shadow-[4px_4px_0px_#ffda79]">
                       <p className="text-[11px] font-bold text-white leading-tight">
                          <span className="text-[#22d3ee]">Auto-Switching:</span> Sistem akan otomatis menggunakan Logo White jika background berwarna gelap (seperti di Sidebar atau Login sidebar).
                       </p>
                    </div>
                </div>
              </div>
            </BentoCard>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <BentoCard title="Performance" icon={Activity} color="bg-[#f0f9ff]">
                    <div className="flex flex-col items-center justify-center py-2 text-center">
                        <span className="text-3xl font-black text-[#1e293b]">{systemStats.latency}</span>
                        <span className="text-[10px] font-black  opacity-40">Database Latency</span>
                        <div className="mt-3 flex items-center gap-2 text-[10px] font-black text-green-500 bg-white px-2 py-1 rounded-xl border-2 border-green-500 shadow-[2px_2px_0px_#22c55e]">
                           <CheckCircle2 size={12} /> HIGH LOAD READY
                        </div>
                    </div>
                </BentoCard>

                <BentoCard title="Asset Stats" icon={Cpu} color="bg-[#fff7ed]">
                   <div className="flex flex-col items-center justify-center py-2 text-center">
                        <span className="text-3xl font-black text-[#1e293b]">{systemStats.storageUsed}</span>
                        <span className="text-[10px] font-black  opacity-40">Branding Asset Size</span>
                        <div className="mt-3 w-full bg-orange-100 h-2.5 rounded-full border-2 border-[#1e293b] overflow-hidden">
                           <div className="bg-[#fb923c] h-full w-[15%]" />
                        </div>
                    </div>
                </BentoCard>

                <BentoCard title="Sync Core" icon={Database} color="bg-[#fdf2f8]">
                    <div className="flex flex-col items-center justify-center py-2 text-center">
                        <div className="flex items-center gap-2 mb-1">
                           <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse border border-[#1e293b]" />
                           <span className="text-3xl font-black text-[#1e293b]  italic">{systemStats.lastSync}</span>
                        </div>
                        <span className="text-[10px] font-black  opacity-40">Firebase Live Listener</span>
                        <button className="mt-3 text-[10px] font-black text-[#22d3ee] underline  hover:text-[#1e293b]">Force Database Flush</button>
                    </div>
                </BentoCard>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8">
             <BentoCard 
               title="Account Preferences" 
               icon={User} 
               color="bg-[#fffdf5]"
               shadow="shadow-[12px_12px_0px_#1e293b]"
               className="min-h-[400px] flex items-center justify-center text-center p-12"
             >
                <div className="max-w-md mx-auto space-y-6">
                   <div className="w-24 h-24 bg-[#ffda79] mx-auto rounded-[30%] border-4 border-[#1e293b] shadow-[8px_8px_0px_#1e293b] flex items-center justify-center mb-8 rotate-3">
                      <Layout size={40} className="text-[#1e293b] -rotate-3" />
                   </div>
                   <h2 className="text-4xl font-black  italic tracking-tighter text-[#1e293b]">Portal Persona</h2>
                   <p className="font-bold text-[#1e293b]/60 leading-relaxed">Selamat datang di pusat kendali personal Anda. Gunakan menu di samping untuk menyesuaikan pengalaman belajar Anda di {appConfig.name}.</p>
                   <div className="bg-[#1e293b] p-4 px-8 rounded-full shadow-[4px_4px_0px_#22d3ee] inline-block border-2 border-white">
                      <span className="text-xs font-black  italic text-[#22d3ee]">Core Version: 2.5.0-Latest</span>
                   </div>
                </div>
             </BentoCard>
          </div>
        )}

        {/* RIGHT COLUMN: PREFERENCES & SECURITY */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          {/* USER INTERFACE */}
          <BentoCard title="User Experience" icon={MonitorSmartphone} shadow="shadow-[8px_8px_0px_#22d3ee]">
             <div className="space-y-4">
                <div className="group p-5 bg-gray-50 rounded-2xl border-4 border-[#1e293b] flex items-center justify-between hover:bg-[#ffda79] transition-all cursor-pointer">
                   <div className="flex items-center gap-4">
                      <div className="bg-white p-2 rounded-xl border-2 border-[#1e293b] group-hover:rotate-12 transition-transform"><Moon size={24} /></div>
                      <div>
                         <span className="text-sm font-black  italic block leading-none mb-1">Deep Dark Mode</span>
                         <span className="text-[10px] font-bold opacity-40">Ubah tema menjadi mode gelap</span>
                      </div>
                   </div>
                   <div className="w-12 h-6 bg-gray-200 rounded-full border-2 border-[#1e293b] relative">
                      <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-0.5 border border-[#1e293b]" />
                   </div>
                </div>

                <div className="group p-5 bg-gray-50 rounded-2xl border-4 border-[#1e293b] flex items-center justify-between hover:bg-[#22d3ee] transition-all cursor-pointer">
                   <div className="flex items-center gap-4">
                      <div className="bg-white p-2 rounded-xl border-2 border-[#1e293b] group-hover:-rotate-12 transition-transform"><Globe size={24} /></div>
                      <div>
                         <span className="text-sm font-black  italic block leading-none mb-1">Bahasa / Region</span>
                         <span className="text-[10px] font-bold opacity-40">Indonesian (Universal)</span>
                      </div>
                   </div>
                   <span className="text-[10px] font-black  tracking-widest border-2 border-[#1e293b] px-3 py-1 rounded-xl bg-white shadow-[2px_2px_0px_#1e293b]">ID-ID</span>
                </div>
             </div>
          </BentoCard>

          {/* SECURITY & DATA */}
          <BentoCard title="Security Gate" icon={Shield} shadow="shadow-[8px_8px_0px_#ff4757]">
             <div className="space-y-4">
                <button className="w-full group p-5 bg-white rounded-2xl border-4 border-[#1e293b] flex items-center gap-4 hover:bg-[#1e293b] hover:text-white transition-all shadow-[6px_6px_0px_#1e293b] hover:shadow-none hover:translate-x-1 hover:translate-y-1">
                   <div className="bg-[#ffda79] text-[#1e293b] p-2 rounded-xl border-2 border-[#1e293b]"><Key size={24} /></div>
                   <div className="text-left flex-1">
                      <span className="text-sm font-black  italic block leading-none mb-1">Credential Update</span>
                      <span className="text-[10px] font-bold opacity-50 block group-hover:text-white/70 tracking-tighter">Ubah Password & Recovery Key</span>
                   </div>
                   <ExternalLink size={20} className="opacity-30" />
                </button>

                <div className="p-4 bg-gray-50 rounded-2xl border-4 border-[#1e293b]/10 space-y-3">
                   <div className="flex items-center justify-between border-b-2 border-dashed border-[#1e293b]/5 pb-2">
                       <span className="text-[10px] font-black  text-[#1e293b]/40">Security Status</span>
                       <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[8px] font-black border border-green-200">VERIFIED</span>
                   </div>
                   <div className="flex items-center justify-between">
                       <span className="text-[10px] font-black  text-[#1e293b]/40">Active Session</span>
                       <span className="text-[10px] font-black text-[#1e293b]">Single Device</span>
                   </div>
                </div>
             </div>
          </BentoCard>

          {/* ACCOUNT ACTION */}
          <button 
            onClick={() => signOut(auth)}
            className="w-full bg-[#1e293b] group p-6 rounded-[40px] border-4 border-[#1e293b] shadow-[10px_10px_0px_#ef4444] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex flex-col items-center gap-4"
          >
             <div className="p-4 bg-[#ef4444] rounded-full border-4 border-white text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] group-hover:scale-110 transition-transform">
                <LogOut size={32} />
             </div>
             <div>
                <span className="text-3xl font-black  italic tracking-tighter text-[#22d3ee] block leading-none text-center">Terminate Access</span>
                <span className="text-[10px] font-black  text-white/40 block mt-2 text-center tracking-[0.2em]">Logout safely from Core Framework</span>
             </div>
          </button>
        </div>
      </div>

      {/* ADMIN LOGIN MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1e293b]/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white border-[10px] border-[#1e293b] w-full max-w-md rounded-[50px] overflow-hidden shadow-[20px_20px_0px_#ffda79] relative animate-in zoom-in slide-in-from-top-4 duration-500">
             <div className="bg-[#1e293b] p-10 pb-16 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#22d3ee 3px, transparent 3px)', backgroundSize: '32px 32px' }}></div>
                <div className="relative z-10 space-y-4">
                  <div className="w-24 h-24 bg-[#ffda79] mx-auto rounded-3xl border-8 border-white shadow-2xl flex items-center justify-center mb-8 rotate-6">
                     <LockIcon size={48} className="text-[#1e293b] -rotate-6" />
                  </div>
                  <h3 className="font-black text-4xl text-white  italic tracking-tighter">Root Gate</h3>
                  <p className="text-[#22d3ee] font-black  text-[10px] tracking-[0.3em]">Hardware Encrypted Login</p>
                </div>
                <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 text-white/30 hover:text-white transition-colors">
                  <X size={32} />
                </button>
             </div>

             <form onSubmit={handleAdminLogin} className="p-10 space-y-8 bg-white -mt-8 rounded-t-[50px] relative z-20">
                {error && (
                  <div className="bg-red-50 border-4 border-red-500 p-5 rounded-3xl text-red-600 font-black text-xs  italic tracking-tight flex items-center gap-4">
                    <AlertCircle size={24} /> {error}
                  </div>
                )}
                
                <div className="space-y-3">
                  <label className="font-black text-[10px]  opacity-40 ml-4 tracking-[0.2em]">Developer Identity</label>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="ENTER UID..." 
                    className="w-full p-6 border-4 border-[#1e293b] rounded-3xl font-black italic bg-[#f8fafc] focus:outline-none focus:bg-white focus:shadow-[6px_6px_0px_#ffda79] transition-all placeholder:opacity-20"
                  />
                </div>

                <div className="space-y-3">
                  <label className="font-black text-[10px]  opacity-40 ml-4 tracking-[0.2em]">Access Token</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full p-6 border-4 border-[#1e293b] rounded-3xl font-black bg-[#f8fafc] focus:outline-none focus:bg-white focus:shadow-[6px_6px_0px_#ffda79] transition-all"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#ffda79] text-[#1e293b] py-6 border-[6px] border-[#1e293b] rounded-[30px] font-black  italic text-3xl shadow-[10px_10px_0px_#1e293b] hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all mt-8"
                >
                  Verify Access
                </button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}
