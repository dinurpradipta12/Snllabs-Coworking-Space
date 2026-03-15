import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, onSnapshot, setDoc, collection } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { supabase } from '../supabase';

interface DataContextType {
  dashboardData: any;
  setDashboardData: (data: any) => void;
  curriculums: any[];
  setCurriculums: (data: any[]) => void;
  allUsers: any[];
  loading: boolean;
  saveData: () => Promise<void>;
  masterCurriculums: any[];
  updateGlobalCurriculum: (curriculums: any[]) => Promise<void>;
  isOffline: boolean;
  appConfig: any;
  updateAppConfig: (config: any) => Promise<void>;
  globalNotifications: any[];
  userMessages: any[];
  sendNotification: (notif: any) => Promise<void>;
  sendDirectMessage: (userId: string, msg: any) => Promise<void>;
  markNotifRead: (notifId: string) => Promise<void>;
  markMessageRead: (userId: string, msgId: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const DEFAULT_CURRICULUMS = [
  // ... (keep current default)
  {
    id: 1,
    title: 'M1: Fundamental Social Media',
    desc: 'Pahami lanskap media sosial, peran spesialis, dan mindset dasar yang dibutuhkan industri.',
    xpReward: 500,
    status: 'Done',
    totalModules: 3,
    coverColor: 'bg-[#ffda79]',
    modules: [
      { id: '1a', title: 'Peran Social Media Specialist', status: 'Done', xp: 100, videoUrl: '', desc: 'Pemahaman mendasar hari demi hari, tanggung jawab, dan mindset seorang Social Media Specialist yang sukses.', submissionType: 'url', submissionHint: 'Paste Link Dokumen Jawaban (Drive)', assets: [], questions: [] },
      { id: '1b', title: 'Anatomi Platform Platform Utama', status: 'Done', xp: 200, videoUrl: '', desc: 'Bagaimana membedakan target pasar yang ada di TikTok vs Instagram vs LinkedIn.', submissionType: 'url', submissionHint: 'Paste Link Dokumen Jawaban (Drive)', assets: [{ name: 'Analisis_Platform.pdf', url: 'https://docs.google.com/spreadsheets/d/1ovv_sQwU-k3o9ung9BnF2CztBnV6O_85Bv_7m_3_mY8/edit?usp=sharing' }], questions: [] },
    ]
  },
  {
    id: 2,
    title: 'M2: Platform Algorithm Mastery',
    desc: 'Kenali cara kerja algoritma Instagram, TikTok, LinkedIn, dan X secara mendalam.',
    xpReward: 800,
    status: 'In Progress',
    totalModules: 4,
    coverColor: 'bg-[#22d3ee]',
    modules: [
      { id: '2a', title: 'Algoritma Instagram & Reels', status: 'Done', xp: 200, videoUrl: '', desc: 'Prioritas metrik utama di Instagram adalah Saves dan Shares.', submissionType: 'url', submissionHint: 'Paste Link Analisa IG (Google Docs)', assets: [], questions: [] },
      { id: '2b', title: 'Algoritma FYP TikTok', status: 'In Progress', xp: 300, videoUrl: '', desc: 'Retention Rate dan Hook di 3 detik pertama.', submissionType: 'url', submissionHint: 'Paste Link Video TikTok Draft', assets: [], questions: [] },
    ]
  },
  {
    id: 3,
    title: 'M3: Target Audience & Persona',
    desc: 'Cara menentukan dan membedah profil buyer persona agar konten tepat sasaran.',
    xpReward: 600,
    status: 'Pending',
    totalModules: 2,
    coverColor: 'bg-[#ff4757]',
    modules: [
      { id: '3a', title: 'Riset Demografi & Psikografi', status: 'Pending', xp: 300, videoUrl: '', desc: 'Gunakan tools analisis audience.', submissionType: 'url', assets: [], questions: [] },
    ]
  },
  { id: 4, title: 'M4: Content Strategy & Pillar', desc: 'Menyusun pilar konten untuk 30 hari.', xpReward: 750, status: 'Locked', totalModules: 3, coverColor: 'bg-gray-300', modules: [] },
  { id: 5, title: 'M5: Copywriting for Social Media', desc: 'Formula AIDA, PAS, dan storytelling khusus caption dan hook.', xpReward: 600, status: 'Locked', totalModules: 4, coverColor: 'bg-gray-300', modules: [] },
  { id: 6, title: 'M6: Visual Creation (Canva)', desc: 'Dasar desain grafis, tipografi, dan komposisi warna untuk feed.', xpReward: 500, status: 'Locked', totalModules: 3, coverColor: 'bg-gray-300', modules: [] },
  { id: 7, title: 'M7: Short-Form Video (CapCut)', desc: 'Teknik editing Reels/TikTok.', xpReward: 900, status: 'Locked', totalModules: 5, coverColor: 'bg-gray-300', modules: [] },
  { id: 8, title: 'M8: Content Calendar & Tools', desc: 'Manajemen jadwal post.', xpReward: 400, status: 'Locked', totalModules: 2, coverColor: 'bg-gray-300', modules: [] },
  { id: 9, title: 'M9: Community Management', desc: 'Teknik membalas komentar.', xpReward: 500, status: 'Locked', totalModules: 2, coverColor: 'bg-gray-300', modules: [] },
  { id: 10, title: 'M10: Social Media Analytics', desc: 'Membaca data insight.', xpReward: 800, status: 'Locked', totalModules: 3, coverColor: 'bg-gray-300', modules: [] },
  { id: 11, title: 'M11: Influencer Marketing', desc: 'Cara mencari KOL.', xpReward: 600, status: 'Locked', totalModules: 3, coverColor: 'bg-gray-300', modules: [] },
  { id: 12, title: 'M12: Social Media Advertising', desc: 'Dasar Meta Ads & TikTok Ads.', xpReward: 1000, status: 'Locked', totalModules: 4, coverColor: 'bg-gray-300', modules: [] },
  { id: 13, title: 'M13: Audit & Optimization', desc: 'Melakukan audit kesehatan akun.', xpReward: 700, status: 'Locked', totalModules: 2, coverColor: 'bg-gray-300', modules: [] },
  { id: 14, title: 'M14: Crisis Management & PR', desc: 'Menangani bad review.', xpReward: 600, status: 'Locked', totalModules: 2, coverColor: 'bg-gray-300', modules: [] },
  { id: 15, title: 'M15: Capstone Project', desc: 'Membangun kampanye utuh.', xpReward: 2000, status: 'Locked', totalModules: 1, coverColor: 'bg-gray-300', modules: [] },
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeUser, setActiveUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [masterCurriculums, setMasterCurriculums] = useState<any[]>(DEFAULT_CURRICULUMS);
  const [isOffline, setIsOffline] = useState(false);
  const [appConfig, setAppConfig] = useState(() => {
    const local = localStorage.getItem('snl_app_config');
    return local ? JSON.parse(local) : {
      name: 'ARUNIKA LMS',
      logo: '',
      favicon: ''
    };
  });
  
  const [dashboardData, setDashboardData] = useState({
    mentoringDays: 14,
    currentXP: 0,
    level: 1,
    tasks: [],
    evaluations: []
  });

  const [curriculums, setCurriculums] = useState(DEFAULT_CURRICULUMS);
  const [globalNotifications, setGlobalNotifications] = useState<any[]>([]);
  const [userMessages, setUserMessages] = useState<any[]>([]);

  // 1. FETCH GLOBAL CONFIGS (Supabase)
  useEffect(() => {
    if (!activeUser) return;

    const fetchGlobals = async () => {
      try {
        // Master Curriculums
        const { data: mc } = await supabase.from('configs').select('data').eq('key', 'learning').maybeSingle();
        if (mc?.data) {
          setMasterCurriculums(mc.data);
          localStorage.setItem('snl_master_curriculums', JSON.stringify(mc.data));
        } else {
          // Initialize if empty
          await supabase.from('configs').upsert({ key: 'learning', data: DEFAULT_CURRICULUMS });
        }

        // All Users (Profiles)
      const { data: users } = await supabase.from('profiles').select('*');
      if (users) {
        const mappedUsers = users.map(u => ({
          ...u,
          displayName: u.display_name,
          photoURL: u.avatar_url,
          status: u.status || 'offline'
        }));
        setAllUsers(mappedUsers);
        localStorage.setItem('snl_all_users', JSON.stringify(mappedUsers));
      }
      } catch (err) {
        console.error("Supabase Global Fetch Error:", err);
      }
    };
    fetchGlobals();

    // Listen to Profiles Changes (Optimized: Only re-fetch if someone new joins or essential info changes)
    const profilesChan = supabase.channel('profiles-active')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'profiles' }, () => fetchGlobals())
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'profiles' }, () => fetchGlobals())
      .subscribe();

    // Global Notifications (Already Supabase)
    const fetchNotifs = async () => {
      const { data } = await supabase.from('notifications').select('*').order('timestamp', { ascending: false });
      if (data) setGlobalNotifications(data);
    };
    fetchNotifs();
    const notifChan = supabase.channel('notif-active')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, () => fetchNotifs())
      .subscribe();

    // Messages for Current User (Already Supabase)
    const fetchMsgs = async () => {
      const { data } = await supabase.from('messages').select('*').eq('user_id', activeUser).order('timestamp', { ascending: false });
      if (data) setUserMessages(data);
    };
    fetchMsgs();
    const msgChan = supabase.channel(`msgs-live-${activeUser}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        if (payload.new.user_id === activeUser) {
          fetchMsgs();
        }
      })
      .subscribe();

    return () => {
      profilesChan.unsubscribe();
      notifChan.unsubscribe();
      msgChan.unsubscribe();
    };
  }, [activeUser]);

  // 2. FETCH APP CONFIG (Supabase)
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data } = await supabase.from('configs').select('data').eq('key', 'app').maybeSingle();
        if (data?.data) {
          const config = data.data;
          setAppConfig(config);
          localStorage.setItem('snl_app_config', JSON.stringify(config));
          if (config.name) document.title = config.name;
          if (config.favicon) {
            let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
            if (!link) {
              link = document.createElement('link');
              link.rel = 'icon';
              document.getElementsByTagName('head')[0].appendChild(link);
            }
            link.href = config.favicon;
          }
        }
      } catch (err) {
        console.error("App Config Fetch Error:", err);
      }
    };
    fetchConfig();
  }, []);

  // 3. AUTH SYNC (Firebase -> Supabase Profile)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.uid).maybeSingle();
          
          if (!profile) {
            await supabase.from('profiles').insert({
              id: user.uid,
              display_name: user.displayName || 'Anonymous Student',
              email: user.email,
              avatar_url: user.photoURL || `https://ui-avatars.com/api/?name=${user.email}&background=random`,
              curriculums: masterCurriculums
            });
          } else {
            // Update last_login silently without triggering global loading
            supabase.from('profiles').update({ last_login: new Date().toISOString() }).eq('id', user.uid);
          }
          setActiveUser(user.uid);
        } catch (err) {
          console.error("Auth Sync Error:", err);
        }
      } else {
        setActiveUser(null);
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []); // Only run once on mount

  // 4. SYNC ACTIVE USER DATA (Supabase)
  useEffect(() => {
    if (!activeUser) return;

    const syncUserData = async () => {
      try {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', activeUser).maybeSingle();
        
        if (profile) {
          // Map to camelCase for UI
          const mappedProfile = {
            ...profile,
            displayName: profile.display_name,
            photoURL: profile.avatar_url,
          };

          if (profile.dashboard) setDashboardData(profile.dashboard);
          
          const userCurrs = profile.curriculums || [];
          const syncedCurrs = masterCurriculums.map(mc => {
            const userVersion = userCurrs.find((uc: any) => uc.id === mc.id);
            return {
              ...mc,
              status: userVersion?.status || mc.status,
              modules: mc.modules.map((m: any) => {
                const userMod = userVersion?.modules?.find((um: any) => um.id === m.id);
                return { ...m, status: userMod?.status || m.status };
              })
            };
          });
          setCurriculums(syncedCurrs);
          
          localStorage.setItem(`snl_user_cache_${activeUser}`, JSON.stringify({
            dashboard: profile.dashboard,
            curriculums: syncedCurrs,
            profile: mappedProfile
          }));
        }
      } catch (err) {
        console.error("User Data Sync Error:", err);
      }
      setLoading(false);
    };

    syncUserData();

    // Realtime Sync for Dashboard/Curriculum
    const userChan = supabase.channel(`user-sync-${activeUser}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${activeUser}` }, (payload) => {
        if (payload.new.dashboard) setDashboardData(payload.new.dashboard);
        // We don't necessarily update curriculums in realtime to avoid jumping UI while editing
      }).subscribe();

    return () => {
      userChan.unsubscribe();
    };
  }, [activeUser, masterCurriculums]);

  const saveData = async () => {
    if (!activeUser) return;
    
    const cleanData = {
      dashboard: dashboardData || {},
      curriculums: curriculums || [],
      xp: dashboardData?.currentXP || 0,
      level: dashboardData?.level || 1,
    };
    
    // Cache
    localStorage.setItem(`snl_user_cache_${activeUser}`, JSON.stringify(cleanData));

    try {
      await supabase.from('profiles').update({
        dashboard: cleanData.dashboard,
        curriculums: cleanData.curriculums,
        xp: cleanData.xp,
        level: cleanData.level
      }).eq('id', activeUser);
    } catch (error) {
      console.error("SUPABASE SAVE ERROR:", error);
    }
  };

  const updateGlobalCurriculum = async (newCurrs: any[]) => {
    localStorage.setItem('snl_master_curriculums', JSON.stringify(newCurrs));
    setMasterCurriculums(newCurrs);

    try {
      await supabase.from('configs').upsert({ key: 'learning', data: newCurrs });
    } catch (error) {
      console.error("SUPABASE CONFIG ERROR:", error);
    }
  };

  const updateAppConfig = async (config: any) => {
    setAppConfig(config);
    localStorage.setItem('snl_app_config', JSON.stringify(config));
    try {
      await supabase.from('configs').upsert({ key: 'app', data: config });
    } catch (error) {
      console.error("SUPABASE APP CONFIG ERROR:", error);
    }
  };

  const sendNotification = async (notif: any) => {
    try {
      await supabase.from('notifications').insert({
        title: notif.title,
        desc: notif.desc,
        type: notif.type,
        unread: true,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
       console.error("Notif Error:", error);
    }
  };

  const sendDirectMessage = async (userId: string, msg: any) => {
    try {
      await supabase.from('messages').insert({
        user_id: userId,
        sender: msg.sender,
        text: msg.text,
        unread: true,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Msg Error:", error);
    }
  };

  const markNotifRead = async (notifId: string) => {
    try {
      await supabase.from('notifications').update({ unread: false }).eq('id', notifId);
    } catch (err) {
      console.error(err);
    }
  };

  const markMessageRead = async (userId: string, msgId: string) => {
    try {
      await supabase.from('messages').update({ unread: false }).eq('id', msgId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DataContext.Provider value={{ 
      dashboardData, setDashboardData, 
      curriculums, setCurriculums, 
      allUsers,
      loading, saveData,
      activeUser, setActiveUser,
      masterCurriculums, updateGlobalCurriculum,
      isOffline,
      appConfig, updateAppConfig,
      globalNotifications, userMessages,
      sendNotification, sendDirectMessage, markNotifRead, markMessageRead
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};
