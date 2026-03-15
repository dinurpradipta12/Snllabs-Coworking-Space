/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { User, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from './firebase';
import { LogIn, Shield, Zap, CheckCircle2, ChevronRight } from 'lucide-react';
import 'react-calendar/dist/Calendar.css';
import Dashboard from './components/Dashboard';
import BottomNav from './components/BottomNav';
import TopNav from './components/TopNav';
import Schedule from './components/Schedule';
import Tasks from './components/Tasks';
import Monitor from './components/Monitor';
import Profile from './components/Profile';
import Settings from './components/Settings';
import FieldArea from './components/FieldArea';
import UserStats from './components/UserStats';
import SideActions from './components/SideActions';
import { DataProvider, useData } from './context/DataContext';

function AppContent() {
  const { setActiveUser, appConfig } = useData();
  const [logoError, setLogoError] = useState(false);
  const [activePage, setActivePage] = useState(() => {
    return localStorage.getItem('snl_active_page') || 'dashboard';
  });
  
  useEffect(() => {
    localStorage.setItem('snl_active_page', activePage);
  }, [activePage]);

  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('snl_dev_mode') === 'active';
  });

  useEffect(() => {
    if (isAdmin) {
      localStorage.setItem('snl_dev_mode', 'active');
    } else {
      localStorage.removeItem('snl_dev_mode');
    }
  }, [isAdmin]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        setActiveUser(user.uid);
      } else {
        setActiveUser(null);
        setIsAdmin(false);
        localStorage.removeItem('snl_dev_mode');
        setActivePage('dashboard');
      }
      setIsAuthReady(true);
    });
    return unsubscribe;
  }, [setActiveUser]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  if (!isAuthReady) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
      <div className="font-black  italic animate-bounce text-2xl">Initializing System...</div>
    </div>
  );
  if (!user) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex flex-col md:flex-row overflow-hidden font-sans">
        {/* LEFT SIDE: BRANDING VISUALS (Hidden on mobile if needed, or smaller) */}
        <div className="hidden md:flex md:w-1/2 bg-[#1e293b] relative overflow-hidden items-center justify-center p-12">
            {/* Background Effects */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#22d3ee 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#22d3ee]/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#ffda79]/10 rounded-full blur-[150px]" />
            
            <div className="relative z-10 space-y-8 max-w-lg text-white">
                <div className="space-y-4">
                   <div className="inline-block py-4">
                      {(appConfig.logoLight || appConfig.logo) && !logoError ? (
                        <img 
                          src={appConfig.logoLight || appConfig.logo} 
                          alt="Branding" 
                          onError={() => setLogoError(true)}
                          className="max-h-32 w-auto animate-float object-contain"
                        />
                      ) : (
                        <div className="w-24 h-24 flex items-center justify-center bg-[#22d3ee] rounded-full">
                           <Shield size={48} className="text-[#1e293b]" />
                        </div>
                      )}
                   </div>
                   <h1 className="text-6xl font-black  italic tracking-tighter leading-[0.9] drop-shadow-[4px_4px_0px_#22d3ee]">
                      {appConfig.name || 'SNLLABS'}
                   </h1>
                </div>
                
                <div className="space-y-6">
                   <div className="space-y-2">
                      <p className="text-2xl font-black italic  text-[#22d3ee] tracking-tight">The Modern Co-Learning Framework</p>
                      <p className="text-white/60 font-bold leading-relaxed text-sm">
                        Platform edukasi kolaboratif yang dirancang untuk mempercepat pertumbuhan skill Anda. 
                        Akses modul, kelola tugas, dan berinteraksi dengan mentor dalam satu ekosistem terpadu.
                      </p>
                   </div>
                </div>
            </div>
        </div>

        {/* RIGHT SIDE: LOGIN PANEL */}
        <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative">
           {/* Mobile Background Elements */}
           <div className="md:hidden absolute inset-0 bg-[#1e293b] -z-10" />
           <div className="md:hidden absolute inset-0 opacity-10 bg-[radial-gradient(#22d3ee_1px,transparent_1px)] [background-size:20px_20px] -z-10" />

           <div className="w-full max-w-md animate-in slide-in-from-right-12 duration-700">
              <div className="bg-white border-[8px] border-[#1e293b] p-10 md:p-12 rounded-[50px] shadow-[16px_16px_0px_#22d3ee] md:shadow-[24px_24px_0px_#1e293b] relative overflow-hidden">
                 
                 {/* Decorative Corner Tag */}
                 <div className="absolute top-8 right-[-40px] rotate-45 bg-[#ffda79] border-4 border-[#1e293b] px-12 py-1 font-black  text-[9px] tracking-[0.2em] shadow-lg">
                    Secure
                 </div>

                 <div className="space-y-10">
                    <div className="space-y-2">
                       <div className="flex items-center gap-3">
                          <div className="w-12 h-1 bg-[#1e293b] rounded-full" />
                          <span className="text-[10px] font-black  tracking-widest opacity-40 italic">Authentication Required</span>
                       </div>
                       <h2 className="text-4xl font-black  italic tracking-tighter text-[#1e293b]">Halo, Welcome!</h2>
                       <p className="font-bold text-[#1e293b]/50 leading-tight">Gunakan akun Google yang terdaftar untuk mengakses Portal {appConfig.name}.</p>
                    </div>

                    <div className="space-y-6">
                       <button
                         onClick={handleLogin}
                         className="group w-full flex items-center justify-center gap-4 bg-[#1e293b] text-white p-6 rounded-3xl border-4 border-[#1e293b] font-black  italic text-xl tracking-tight shadow-[8px_8px_0px_#ffda79] hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:scale-95 transition-all"
                       >
                         <div className="bg-white p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-[2px_2px_0px_rgba(255,255,255,0.2)]">
                            <img src="https://www.google.com/favicon.ico" className="w-6 h-6" alt="google" />
                         </div>
                         Login via Google
                         <ChevronRight size={24} className="text-[#ffda79]" />
                       </button>

                       {logoError && (
                          <div className="bg-red-50 border-4 border-red-500 p-4 rounded-2xl flex items-center gap-3 animate-shake">
                             <Zap className="text-red-600" size={20} />
                             <p className="text-[10px] font-black  text-red-600">Cross-Origin Data Locked. System using safety text-mode.</p>
                          </div>
                       )}
                    </div>
                 </div>
              </div>
              
              <div className="mt-8 flex items-center justify-center px-6 text-[10px] font-black  italic tracking-widest text-[#1e293b]/30">
                 <span>© 2026 SNLLABS OS</span>
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#2d3436] font-sans p-4 px-2 md:px-6">
      <div className="w-full">
        <TopNav user={user} isAdmin={isAdmin} />

        <main className="pb-24 pr-14 md:pr-20">
          {activePage === 'dashboard' && <Dashboard user={user} />}
          {activePage === 'schedule' && <Schedule />}
          {activePage === 'tasks' && <Tasks />}
          {activePage === 'field_area' && <FieldArea />}
          {activePage === 'monitor' && <Monitor />}
          {activePage === 'profile' && <Profile />}
          {activePage === 'settings' && <Settings isAdmin={isAdmin} setIsAdmin={setIsAdmin} />}
          {activePage === 'user_stats' && <UserStats />}
        </main>

        <BottomNav activePage={activePage} setActivePage={setActivePage} isAdmin={isAdmin} />
        <SideActions />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
}
