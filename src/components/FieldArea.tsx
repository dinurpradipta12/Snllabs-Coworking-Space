import { useState, useEffect } from 'react';
import { 
  Database, Users, LayoutDashboard, BookOpen, Save, Plus, Trash2, 
  ExternalLink, Video, FileText, Zap, ChevronRight, Search, Edit3, 
  Settings, CheckCircle2, AlertCircle, Terminal, Globe,
  MessageSquare, Calendar, UserPlus, Star, X, PlusCircle, HelpCircle, CheckSquare,
  Bell, Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../context/DataContext';
import { supabase } from '../supabase';

export default function FieldArea() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { 
    dashboardData, setDashboardData,
    allUsers, saveData, activeUser, setActiveUser,
    masterCurriculums, updateGlobalCurriculum,
    curriculums, setCurriculums,
    sendNotification, sendDirectMessage
  } = useData();
  
  const [msgTarget, setMsgTarget] = useState<string | null>(null);
  const [msgText, setMsgText] = useState('');
  const [notifForm, setNotifForm] = useState({ title: '', desc: '', type: 'info' });
  const [chatHistory, setChatHistory] = useState<any[]>([]);

  // Listen to selected user messages (Supabase)
  useEffect(() => {
    if (!msgTarget) {
      setChatHistory([]);
      return;
    }
    
    const fetchChat = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('user_id', msgTarget)
        .order('timestamp', { ascending: true });
      if (data) setChatHistory(data);
    };
    fetchChat();

    const channel = supabase
      .channel(`chat-room-${msgTarget}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages'
      }, (payload) => {
        if (payload.new.user_id === msgTarget) {
          fetchChat();
        }
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [msgTarget]);
  
  const [isSaving, setIsSaving] = useState(false);
  const [editingMasterCurrs, setEditingMasterCurrs] = useState<any[]>([]);
  const [activeQuizEdit, setActiveQuizEdit] = useState<{currId: number, modId: string} | null>(null);

  // Sync editing state with master curriculums when tab changes or data loads
  useEffect(() => {
    if (activeTab === 'learning_global') {
      setEditingMasterCurrs(JSON.parse(JSON.stringify(masterCurriculums)));
    }
  }, [activeTab, masterCurriculums]);

  const handleSaveUserSpecific = async () => {
    setIsSaving(true);
    try {
      await saveData();
      alert('🚀 Data User Berhasil Di-Update!');
    } catch (err) {
      alert('Gagal menyimpan data user.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveGlobalLearning = async () => {
    setIsSaving(true);
    try {
      await updateGlobalCurriculum(editingMasterCurrs);
      alert('🌏 Kurikulum Global Berhasil Di-Update untuk Semua User!');
    } catch (err) {
      alert('Gagal memperbarui kurikulum global.');
    } finally {
      setIsSaving(false);
    }
  };

  // Dashboard Helpers
  const updateDashboardField = (field: string, value: any) => {
    setDashboardData({ ...dashboardData, [field]: value });
  };

  const addTask = () => {
    const newTask = { id: Date.now(), task: 'Tugas Baru', status: 'Pending', desc: 'Deskripsi tugas baru', due: 'Besok' };
    setDashboardData({ ...dashboardData, tasks: [...(dashboardData.tasks || []), newTask] });
  };

  const removeTask = (id: number) => {
    setDashboardData({ ...dashboardData, tasks: dashboardData.tasks.filter((t: any) => t.id !== id) });
  };

  const updateTask = (id: number, field: string, value: any) => {
    const newTasks = dashboardData.tasks.map((t: any) => 
      t.id === id ? { ...t, [field]: value } : t
    );
    setDashboardData({ ...dashboardData, tasks: newTasks });
  };

  const addEval = () => {
    const newEval = { 
      id: Date.now(), 
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }), 
      coach: 'Coach Baru', 
      comment: 'Feedback baru...', 
      strengths: '-', 
      improvements: '-' 
    };
    setDashboardData({ ...dashboardData, evaluations: [...(dashboardData.evaluations || []), newEval] });
  };

  const removeEval = (id: number) => {
    setDashboardData({ ...dashboardData, evaluations: dashboardData.evaluations.filter((e: any) => e.id !== id) });
  };

  const updateEval = (id: number, field: string, value: any) => {
    const newEvals = dashboardData.evaluations.map((e: any) => 
      e.id === id ? { ...e, [field]: value } : e
    );
    setDashboardData({ ...dashboardData, evaluations: newEvals });
  };

  // Admin notes helper
  const updateAdminNotes = (notes: string) => {
    setDashboardData({ ...dashboardData, adminNotes: notes });
  };

  // Module status toggle per user
  const toggleModuleStatus = (currId: number, modId: string) => {
    const updated = curriculums.map((c: any) => {
      if (c.id !== currId) return c;
      return {
        ...c,
        modules: c.modules.map((m: any) => {
          if (m.id !== modId) return m;
          const next = m.status === 'Locked' ? 'Unlocked' : m.status === 'Unlocked' ? 'Done' : 'Locked';
          return { ...m, status: next };
        })
      };
    });
    setCurriculums(updated);
  };

  // Global Learning Helpers
  const updateGlobalModule = (currId: number, modId: string, field: string, value: any) => {
    const updated = editingMasterCurrs.map(c => {
      if (c.id === currId) {
        return {
          ...c,
          modules: c.modules.map((m: any) => m.id === modId ? { ...m, [field]: value } : m)
        };
      }
      return c;
    });
    setEditingMasterCurrs(updated);
  };

  const updateQuizQuestion = (currId: number, modId: string, qIdx: number, field: string, value: any) => {
    const updated = editingMasterCurrs.map(c => {
      if (c.id === currId) {
        return {
          ...c,
          modules: c.modules.map((m: any) => {
            if (m.id === modId) {
              const newQs = [...(m.questions || [])];
              if (field === 'options') {
                 // value is { idx, text }
                 newQs[qIdx].options[value.idx] = value.text;
              } else {
                 newQs[qIdx][field] = value;
              }
              return { ...m, questions: newQs };
            }
            return m;
          })
        };
      }
      return c;
    });
    setEditingMasterCurrs(updated);
  };

  const addQuizQuestion = (currId: number, modId: string) => {
    const updated = editingMasterCurrs.map(c => {
      if (c.id === currId) {
        return {
          ...c,
          modules: c.modules.map((m: any) => {
            if (m.id === modId) {
              const newQ = { id: Date.now(), q: 'Pertanyaan Baru?', options: ['', '', '', ''], correct: 0 };
              return { ...m, questions: [...(m.questions || []), newQ] };
            }
            return m;
          })
        };
      }
      return c;
    });
    setEditingMasterCurrs(updated);
  };

  const removeQuizQuestion = (currId: number, modId: string, qIdx: number) => {
    const updated = editingMasterCurrs.map(c => {
      if (c.id === currId) {
        return {
          ...c,
          modules: c.modules.map((m: any) => {
            if (m.id === modId) {
              return { ...m, questions: m.questions.filter((_: any, i: number) => i !== qIdx) };
            }
            return m;
          })
        };
      }
      return c;
    });
    setEditingMasterCurrs(updated);
  };

  const addNewModule = (currId: number) => {
    const updated = editingMasterCurrs.map(c => {
      if (c.id === currId) {
        const newMod = {
          id: `${c.id}${String.fromCharCode(97 + (c.modules?.length || 0))}`, // e.g. 1c
          title: 'Sesi Baru',
          status: 'Locked',
          xp: 100,
          videoUrl: '',
          desc: 'Deskripsi sesi baru...',
          submissionType: 'url',
          assetName: '',
          assetUrl: '',
          insight: '',
          coach: '',
          questions: []
        };
        return { ...c, modules: [...(c.modules || []), newMod] };
      }
      return c;
    });
    setEditingMasterCurrs(updated);
  };

  const removeModule = (currId: number, modId: string) => {
    if (!confirm('Hapus sesi ini secara global?')) return;
    const updated = editingMasterCurrs.map(c => {
      if (c.id === currId) {
        return { ...c, modules: c.modules.filter((m: any) => m.id !== modId) };
      }
      return c;
    });
    setEditingMasterCurrs(updated);
  };

  const addAssetToModule = (currId: number, modId: string) => {
    const updated = editingMasterCurrs.map(c => {
      if (c.id === currId) {
        return {
          ...c,
          modules: c.modules.map((m: any) => {
            if (m.id === modId) {
              const newAsset = { name: '', url: '' };
              return { ...m, assets: [...(m.assets || []), newAsset] };
            }
            return m;
          })
        };
      }
      return c;
    });
    setEditingMasterCurrs(updated);
  };

  const removeAssetFromModule = (currId: number, modId: string, assetIdx: number) => {
    const updated = editingMasterCurrs.map(c => {
      if (c.id === currId) {
        return {
          ...c,
          modules: c.modules.map((m: any) => {
            if (m.id === modId) {
              return { ...m, assets: m.assets.filter((_: any, i: number) => i !== assetIdx) };
            }
            return m;
          })
        };
      }
      return c;
    });
    setEditingMasterCurrs(updated);
  };

  const updateAssetInModule = (currId: number, modId: string, assetIdx: number, field: string, value: string) => {
    const updated = editingMasterCurrs.map(c => {
      if (c.id === currId) {
        return {
          ...c,
          modules: c.modules.map((m: any) => {
            if (m.id === modId) {
              const newAssets = [...(m.assets || [])];
              newAssets[assetIdx] = { ...newAssets[assetIdx], [field]: value };
              return { ...m, assets: newAssets };
            }
            return m;
          })
        };
      }
      return c;
    });
    setEditingMasterCurrs(updated);
  };

  return (
    <div className="min-h-screen pb-20 text-[#1e293b] bg-[#f8fafc] p-6 lg:p-10 font-sans">
      {/* Background Decor */}
      <div className="fixed top-[-100px] left-[-100px] w-[500px] h-[500px] bg-[#22d3ee]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-[#ffda79]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Quiz Modal Editor */}
      <AnimatePresence>
        {activeQuizEdit && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1e293b]/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white border-8 border-[#1e293b] w-full max-w-4xl rounded-3xl overflow-hidden shadow-[12px_12px_0px_#ff4757] flex flex-col max-h-[90vh]"
            >
              <div className="bg-[#ff4757] p-6 border-b-8 border-[#1e293b] flex justify-between items-center text-white">
                <h3 className="font-black text-xl italic tracking-tighter flex items-center gap-2">
                  <Zap size={24} fill="white" /> Editor Pertanyaan Post-Test
                </h3>
                <button onClick={() => setActiveQuizEdit(null)} className="bg-white text-[#1e293b] p-2 rounded-xl border-4 border-[#1e293b] hover:bg-gray-100"><X size={20} /></button>
              </div>
              <div className="p-8 overflow-y-auto space-y-8">
                 {editingMasterCurrs.find(c => c.id === activeQuizEdit.currId)?.modules.find((m: any) => m.id === activeQuizEdit.modId)?.questions?.map((q: any, qIdx: number) => (
                   <div key={q.id} className="bg-gray-50 border-4 border-[#1e293b] p-6 rounded-2xl relative shadow-[4px_4px_0px_#1e293b]">
                      <button 
                        onClick={() => removeQuizQuestion(activeQuizEdit.currId, activeQuizEdit.modId, qIdx)}
                        className="absolute -top-3 -right-3 bg-red-500 text-white p-2 rounded-full border-2 border-[#1e293b] hover:scale-110 transition-transform"
                      >
                        <Trash2 size={16} />
                      </button>
                      <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          <span className="bg-[#1e293b] text-white w-8 h-8 rounded-lg flex items-center justify-center font-black shrink-0">{qIdx + 1}</span>
                          <input 
                            type="text" 
                            placeholder="Tulis pertanyaan..."
                            value={q.q}
                            onChange={(e) => updateQuizQuestion(activeQuizEdit.currId, activeQuizEdit.modId, qIdx, 'q', e.target.value)}
                            className="w-full bg-white border-2 border-[#1e293b] p-3 rounded-xl font-black text-lg outline-none focus:bg-[#22d3ee]/10"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-12">
                           {q.options.map((opt: string, optI: number) => (
                             <div key={optI} className="flex items-center gap-2">
                               <button 
                                 onClick={() => updateQuizQuestion(activeQuizEdit.currId, activeQuizEdit.modId, qIdx, 'correct', optI)}
                                 className={`w-4 h-4 rounded-full border-2 border-[#1e293b] ${q.correct === optI ? 'bg-green-500' : 'bg-white'}`}
                               />
                               <input 
                                 type="text" 
                                 placeholder={`Pilihan ${optI + 1}...`}
                                 value={opt}
                                 onChange={(e) => updateQuizQuestion(activeQuizEdit.currId, activeQuizEdit.modId, qIdx, 'options', { idx: optI, text: e.target.value })}
                                 className="flex-1 bg-white border-2 border-[#1e293b] p-2 rounded-lg font-bold text-sm outline-none focus:bg-[#22d3ee]/5"
                               />
                             </div>
                           ))}
                        </div>
                      </div>
                   </div>
                 ))}
                 <button 
                   onClick={() => addQuizQuestion(activeQuizEdit.currId, activeQuizEdit.modId)}
                   className="w-full p-4 border-4 border-dashed border-[#1e293b] rounded-2xl flex items-center justify-center gap-2 font-black text-[#1e293b]/40 hover:text-[#1e293b] hover:bg-gray-50 transition-all"
                 >
                   <Plus size={20} /> Tambah Pertanyaan Baru
                 </button>
              </div>
              <div className="p-6 bg-gray-50 border-t-8 border-[#1e293b] flex justify-end">
                  <button 
                    onClick={() => setActiveQuizEdit(null)}
                    className="bg-[#1e293b] text-white px-8 py-3 rounded-2xl border-4 border-[#1e293b] font-black italic shadow-[4px_4px_0px_#22d3ee] active:translate-y-1 active:shadow-none transition-all"
                  >
                    Simpan Perubahan
                  </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Unified Top Command Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-12 relative z-10">
        <div className="flex items-center gap-4 group">
          <div className="w-14 h-14 bg-[#1e293b] rounded-2xl flex items-center justify-center text-[#22d3ee] border-4 border-[#1e293b] shadow-[4px_4px_0px_#22d3ee] group-hover:shadow-none group-hover:translate-x-1 group-hover:translate-y-1 transition-all">
            <Terminal size={28} />
          </div>
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter text-[#1e293b]">Field Area <span className="text-[#22d3ee]">cms</span></h1>
            <p className="text-[10px] font-bold text-[#1e293b]/40 tracking-wider">Pusat kendali data & kurikulum</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
           {activeTab === 'dashboard' && (
             <div className="bg-white p-3 rounded-2xl border-4 border-[#1e293b] shadow-[4px_4px_0px_#1e293b] flex items-center gap-3">
                <Users size={20} className="text-[#22d3ee]" />
                <select 
                  value={activeUser || ''}
                  onChange={(e) => setActiveUser(e.target.value)}
                  className="bg-transparent font-black text-xs focus:outline-none pr-4"
                >
                  {allUsers.map(u => <option key={u.id} value={u.id} className="text-[#1e293b]">{u.displayName || u.id}</option>)}
                </select>
             </div>
           )}
           
           <button 
             onClick={activeTab === 'dashboard' ? handleSaveUserSpecific : handleSaveGlobalLearning}
             disabled={isSaving}
             className="bg-[#22d3ee] text-[#1e293b] px-8 py-3 rounded-2xl border-4 border-[#1e293b] font-black text-sm shadow-[6px_6px_0px_#1e293b] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2 group"
           >
             <Save size={20} className={`${isSaving ? 'animate-spin' : 'group-hover:rotate-12 transition-transform'}`} /> 
             {isSaving ? 'Menyimpan...' : 'Deploy Perubahan'}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
        {/* Sidebar Nav */}
        <div className="lg:col-span-3 space-y-4">
          <div className="space-y-2">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full p-5 rounded-2xl border-4 border-[#1e293b] flex items-center gap-4 transition-all font-black text-sm italic ${activeTab === 'dashboard' ? 'bg-[#22d3ee] translate-x-1 shadow-[8px_8px_0px_#1e293b]' : 'bg-white hover:bg-gray-50 shadow-[4px_4px_0px_#1e293b]'}`}
            >
              <LayoutDashboard size={22} /> Dashboard Manager
            </button>
            <button 
              onClick={() => setActiveTab('learning_global')}
              className={`w-full p-5 rounded-2xl border-4 border-[#1e293b] flex items-center gap-4 transition-all font-black text-sm italic ${activeTab === 'learning_global' ? 'bg-[#ffda79] translate-x-1 shadow-[8px_8px_0px_#1e293b]' : 'bg-white hover:bg-gray-50 shadow-[4px_4px_0px_#1e293b]'}`}
            >
              <BookOpen size={22} /> Learning Page (Global)
            </button>
            <button 
              onClick={() => setActiveTab('inbox')}
              className={`w-full p-5 rounded-2xl border-4 border-[#1e293b] flex items-center gap-4 transition-all font-black text-sm italic ${activeTab === 'inbox' ? 'bg-[#ff4757] text-white translate-x-1 shadow-[8px_8px_0px_#1e293b]' : 'bg-white hover:bg-gray-50 shadow-[4px_4px_0px_#1e293b]'}`}
            >
              <MessageSquare size={22} /> Admin Inbox & Notif
            </button>
          </div>
          
          <div className="p-6 bg-[#1e293b] text-white rounded-3xl border-4 border-[#1e293b] shadow-[6px_6px_0px_#ff4757] mt-10">
             <h4 className="font-black text-xs mb-3 flex items-center gap-2 text-[#ff4757]">
               <Zap size={14} fill="currentColor" /> Status CMS
             </h4>
             <p className="text-[10px] font-bold opacity-60 mb-4 leading-relaxed">
                {activeTab === 'dashboard' ? 'Anda sedang mengecek data spesifik untuk satu siswa yang dipilih.' : 
                 activeTab === 'inbox' ? 'Kirim pesan atau buat pengumuman global untuk semua siswa.' :
                 'Hati-hati, perubahan di sini akan berdampak pada semua siswa secara global.'}
             </p>
             <div className="space-y-2 border-t border-white/10 pt-4">
                <div className="flex justify-between items-center text-[10px]">
                   <span className="font-bold opacity-60">Peran Admin</span>
                   <span className="bg-[#22d3ee] text-[#1e293b] px-2 py-0.5 rounded font-black italic">Superuser</span>
                </div>
             </div>
          </div>

          {/* Admin Notes Sticky Note — shows when there's a note for active user */}
          {activeUser && dashboardData.adminNotes && (
            <div 
              onClick={() => setActiveTab('dashboard')}
              className="p-5 bg-[#ffda79] border-4 border-[#1e293b] rounded-2xl shadow-[4px_4px_0px_#1e293b] mt-4 cursor-pointer hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#1e293b] transition-all group"
            >
              <div className="flex items-center gap-2 mb-2">
                <Edit3 size={13} className="text-[#1e293b] shrink-0" />
                <span className="font-black text-[10px] text-[#1e293b] opacity-60 text-sentence">Catatan admin</span>
                <span className="ml-auto text-[9px] font-bold opacity-40 group-hover:opacity-80 transition-opacity text-sentence">Edit →</span>
              </div>
              <p className="text-xs font-bold text-[#1e293b] leading-relaxed line-clamp-4 whitespace-pre-wrap">
                {dashboardData.adminNotes}
              </p>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9">
          {activeTab === 'inbox' && (
            <div className="space-y-8">
               {/* Global Notification Form */}
               <div className="bg-white border-4 border-[#1e293b] rounded-3xl shadow-[8px_8px_0px_#1e293b] overflow-hidden">
                  <div className="bg-[#1e293b] p-6 text-white font-black italic flex items-center gap-3">
                    <Bell size={24} className="text-[#22d3ee]" /> Broadcast Global Notification
                  </div>
                  <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black opacity-40">Judul pengumuman</label>
                        <input 
                          type="text" 
                          placeholder="Contoh: Modul baru terbuka!"
                          value={notifForm.title}
                          onChange={(e) => setNotifForm({...notifForm, title: e.target.value})}
                          className="w-full p-3 border-4 border-[#1e293b] rounded-xl font-black outline-none focus:bg-[#22d3ee]/10 shadow-[3px_3px_0px_#1e293b]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black opacity-40">Isi pesan pendek</label>
                        <textarea 
                          placeholder="Deskripsi singkat..."
                          value={notifForm.desc}
                          onChange={(e) => setNotifForm({...notifForm, desc: e.target.value})}
                          className="w-full p-3 border-4 border-[#1e293b] rounded-xl font-black outline-none h-24 focus:bg-[#22d3ee]/10 shadow-[3px_3px_0px_#1e293b]"
                        />
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black opacity-40">Tipe notifikasi</label>
                        <div className="flex gap-2">
                          {['info', 'success', 'warning'].map(t => (
                            <button 
                              key={t}
                              onClick={() => setNotifForm({...notifForm, type: t})}
                              className={`flex-1 py-2 rounded-xl border-4 border-[#1e293b] font-black italic text-[10px] capitalize transition-all ${notifForm.type === t ? 'bg-[#ffda79] shadow-[3px_3px_0px_#1e293b] -translate-y-1' : 'bg-white opacity-40 hover:opacity-100'}`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          sendNotification(notifForm);
                          setNotifForm({ title: '', desc: '', type: 'info' });
                          alert('Notifikasi Terkirim!');
                        }}
                        className="w-full bg-[#1e293b] text-white py-4 rounded-2xl border-4 border-[#1e293b] font-black italic text-sm shadow-[6px_6px_0px_#22d3ee] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3"
                      >
                        <Send size={18} /> Kirim Pengumuman Global
                      </button>
                    </div>
                  </div>
               </div>

               {/* Direct User Messaging */}
               <div className="bg-white border-4 border-[#1e293b] rounded-3xl shadow-[8px_8px_0px_#1e293b] overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[500px]">
                  <div className="md:col-span-4 border-r-4 border-[#1e293b] bg-gray-50 flex flex-col">
                    <div className="p-4 bg-[#1e293b] text-white font-black italic text-xs flex items-center gap-2">
                       <Users size={16} /> Direktori Siswa
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                       {allUsers.map((u: any) => (
                         <div 
                           key={u.id} 
                           onClick={() => setMsgTarget(u.id)}
                           className={`p-3 rounded-xl border-4 border-[#1e293b] cursor-pointer transition-all ${msgTarget === u.id ? 'bg-[#22d3ee] shadow-none translate-x-1' : 'bg-white shadow-[3px_3px_0px_#1e293b] hover:bg-blue-50'}`}
                         >
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-full border-2 border-[#1e293b] bg-[#ffda79] flex items-center justify-center font-black text-[10px]">
                                  {u.displayName?.substring(0,2).toUpperCase() || '??'}
                               </div>
                               <div className="flex-1 min-w-0">
                                  <p className="font-black text-[11px] truncate leading-none mb-1">{u.displayName || 'Siswa anonim'}</p>
                                  <p className="text-[9px] font-bold opacity-40 truncate italic">{u.id.substring(0,8)}...</p>
                               </div>
                            </div>
                         </div>
                       ))}
                    </div>
                  </div>
                  <div className="md:col-span-8 flex flex-col bg-white overflow-hidden">
                    {msgTarget ? (
                       <>
                         <div className="p-4 border-b-4 border-[#1e293b] bg-white flex justify-between items-center">
                            <div>
                               <p className="text-[10px] font-black opacity-30 uppercase tracking-widest leading-none">Chatting with</p>
                               <p className="font-black text-sm italic">{allUsers.find((u: any) => u.id === msgTarget)?.displayName || 'Anon User'}</p>
                            </div>
                            <div className="flex items-center gap-2">
                               <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                               <span className="text-[10px] font-black opacity-60 uppercase">Active</span>
                            </div>
                         </div>
                         <div className="flex-1 p-6 bg-[#fffdf5]/50 overflow-y-auto space-y-4 no-scrollbar">
                             {chatHistory.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-30 italic space-y-3">
                                   <MessageSquare size={48} />
                                   <p className="text-xs font-black">Belum ada percakapan dengan user ini.</p>
                                </div>
                             ) : (
                                chatHistory.map((m) => {
                                      const isStudent = m.sender === allUsers.find(u => u.id === msgTarget)?.displayName;
                                      return (
                                        <div key={m.id} className={`flex ${!isStudent ? 'justify-end' : 'justify-start'}`}>
                                          <div className={`max-w-[80%] p-3 rounded-2xl border-4 border-[#1e293b] font-bold text-[11px] shadow-[3px_3px_0px_#1e293b] ${!isStudent ? 'bg-[#22d3ee]' : 'bg-white'}`}>
                                         <p>{m.text}</p>
                                         <p className="text-[8px] opacity-40 mt-1 uppercase font-black">
                                            {m.timestamp ? (
                                               typeof m.timestamp === 'string' 
                                               ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                               : typeof m.timestamp === 'number' 
                                                  ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                                  : m.timestamp.toDate?.() 
                                                     ? m.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                                     : '??:??'
                                            ) : '??:??'}
                                         </p>
                                      </div>
                                   </div>
                                        );
                                  })
                             )}
                          </div>
                         <div className="p-6 border-t-4 border-[#1e293b] bg-white">
                            <div className="flex gap-3">
                               <input 
                                 type="text" 
                                 placeholder="Tulis pesan untuk siswa..."
                                 value={msgText}
                                 onChange={(e) => setMsgText(e.target.value)}
                                 className="flex-1 p-4 border-4 border-[#1e293b] rounded-2xl font-black text-sm outline-none focus:bg-[#ffda79]/10"
                               />
                               <button 
                                   onClick={() => {
                                   if (!msgText.trim()) return;
                                   const adminUser = allUsers.find(u => u.id === activeUser);
                                   sendDirectMessage(msgTarget, { 
                                     sender: adminUser?.displayName || 'Mentor', 
                                     text: msgText 
                                   });
                                   setMsgText('');
                                 }}
                                 className="bg-[#1e293b] text-white px-6 rounded-2xl border-4 border-[#1e293b] shadow-[4px_4px_0px_#22d3ee] active:translate-y-1 active:shadow-none transition-all"
                               >
                                 <Send size={24} />
                               </button>
                            </div>
                         </div>
                       </>
                    ) : (
                       <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4 opacity-20">
                          <MessageSquare size={80} strokeWidth={1} />
                          <h4 className="font-black italic text-xl">Pilih user untuk mulai berkirim pesan.</h4>
                       </div>
                    )}
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div className="space-y-6">

              {/* Section 1: Tugas yang Diberikan */}
              <div className="bg-white border-4 border-[#1e293b] p-6 rounded-3xl shadow-[6px_6px_0px_#1e293b]">
                <h3 className="font-black text-lg italic border-b-4 border-[#1e293b] pb-3 mb-4 flex items-center gap-2">
                  <CheckSquare size={20} className="text-[#22d3ee]" /> Tugas yang diberikan
                </h3>
                <div className="space-y-3">
                  {dashboardData.tasks?.map((task: any) => (
                    <div key={task.id} className="bg-gray-50 border-4 border-[#1e293b] p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center shadow-[4px_4px_0px_#1e293b]">
                      <input 
                        type="text" 
                        value={task.task} 
                        onChange={(e) => updateTask(task.id, 'task', e.target.value)}
                        className="flex-1 min-w-0 bg-transparent font-black text-sm focus:bg-white p-1 rounded transition-colors outline-none"
                        placeholder="Nama tugas..."
                      />
                      <input 
                        type="text" 
                        value={task.due || ''} 
                        onChange={(e) => updateTask(task.id, 'due', e.target.value)}
                        className="w-24 bg-white border-2 border-[#1e293b] px-2 py-1 rounded-lg text-xs font-bold text-center outline-none"
                        placeholder="Deadline"
                      />
                      <select 
                        value={task.status} 
                        onChange={(e) => updateTask(task.id, 'status', e.target.value)}
                        className="bg-[#1e293b] text-white px-3 py-1 rounded-lg border-2 border-[#1e293b] font-black text-[10px] focus:outline-none"
                      >
                        <option>Pending</option>
                        <option>In Progress</option>
                        <option>Done</option>
                      </select>
                      <button 
                        onClick={() => removeTask(task.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border-2 border-transparent hover:border-red-500"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                  {(!dashboardData.tasks || dashboardData.tasks.length === 0) && (
                    <p className="text-xs font-bold opacity-30 italic text-center py-3">Belum ada tugas. Tambahkan tugas baru untuk siswa ini.</p>
                  )}
                </div>
                <button 
                  onClick={addTask}
                  className="flex items-center gap-2 font-black text-xs text-[#22d3ee] underline mt-4 hover:text-[#1e293b] transition-colors"
                >
                  <PlusCircle size={16} /> Tambah tugas baru
                </button>
              </div>

              {/* Section 2: Kontrol Status Modul */}
              <div className="bg-white border-4 border-[#1e293b] p-6 rounded-3xl shadow-[6px_6px_0px_#1e293b]">
                <h3 className="font-black text-lg italic border-b-4 border-[#1e293b] pb-3 mb-4 flex items-center gap-2">
                  <BookOpen size={20} className="text-[#ffda79]" /> Kontrol status modul
                  <span className="ml-auto text-[10px] font-bold opacity-40 not-italic">Klik untuk ubah status</span>
                </h3>
                {!activeUser ? (
                  <p className="text-xs font-bold opacity-30 italic text-center py-4">Pilih siswa terlebih dahulu dari sidebar.</p>
                ) : curriculums.length === 0 ? (
                  <p className="text-xs font-bold opacity-30 italic text-center py-4">Tidak ada kurikulum tersedia.</p>
                ) : (
                  <div className="space-y-4">
                    {curriculums.map((curr: any) => (
                      <div key={curr.id} className="border-4 border-[#1e293b] rounded-2xl overflow-hidden shadow-[4px_4px_0px_#ffda79]">
                        <div className="bg-[#ffda79] border-b-4 border-[#1e293b] px-5 py-3 flex items-center gap-2">
                          <span className="font-black italic text-sm">{curr.title}</span>
                          <span className="text-[10px] opacity-50 ml-auto">
                            {curr.modules?.filter((m: any) => m.status === 'Done').length || 0}/{curr.modules?.length || 0} modul selesai
                          </span>
                        </div>
                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                          {curr.modules?.map((mod: any) => {
                            const colorMap: Record<string, string> = {
                              'Done':     'bg-green-50 border-green-400 text-green-700',
                              'Unlocked': 'bg-[#22d3ee]/10 border-[#22d3ee] text-[#1e293b]',
                              'Locked':   'bg-gray-50 border-gray-300 text-gray-400'
                            };
                            const iconMap: Record<string, string> = { 'Done': '✓', 'Unlocked': '▶', 'Locked': '🔒' };
                            return (
                              <button
                                key={mod.id}
                                onClick={() => toggleModuleStatus(curr.id, mod.id)}
                                className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all hover:scale-[1.02] active:scale-100 ${colorMap[mod.status] || colorMap['Locked']}`}
                              >
                                <span className="text-base w-6 text-center shrink-0">{iconMap[mod.status] || '🔒'}</span>
                                <div className="min-w-0">
                                  <p className="font-black text-xs truncate">{mod.title}</p>
                                  <p className="text-[9px] font-bold opacity-60">{mod.status}</p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Section 3: Catatan Admin */}
              <div className="bg-white border-4 border-[#1e293b] p-6 rounded-3xl shadow-[6px_6px_0px_#1e293b]">
                <h3 className="font-black text-lg italic border-b-4 border-[#1e293b] pb-3 mb-4 flex items-center gap-2">
                  <Edit3 size={20} className="text-[#ff4757]" /> Catatan admin
                  <span className="ml-auto text-[9px] font-bold opacity-40 not-italic bg-red-50 px-2 py-0.5 rounded border border-red-200 normal-case">Tidak terlihat oleh siswa</span>
                </h3>
                <textarea
                  value={dashboardData.adminNotes || ''}
                  onChange={(e) => updateAdminNotes(e.target.value)}
                  placeholder="Tulis catatan pribadi untuk siswa ini: kelemahan, kemajuan, hal yang perlu diperhatikan..."
                  className="w-full bg-gray-50 border-2 border-[#1e293b]/20 focus:border-[#1e293b] rounded-2xl p-4 font-bold text-sm outline-none min-h-[120px] transition-all resize-none"
                />
              </div>

            </div>
          )}


          {activeTab === 'learning_global' && (
             <div className="space-y-8">
               <div className="bg-[#ff4757] p-4 rounded-xl border-4 border-[#1e293b] text-white font-black  italic text-sm shadow-[4px_4px_0px_#1e293b] flex items-center gap-3">
                  <AlertCircle size={20} /> Perhatian: Anda sedang mengubah Kurikulum Master secara global!
               </div>
               
               {editingMasterCurrs.map((curr) => (
                 <div key={curr.id} className="bg-white border-4 border-[#1e293b] rounded-3xl shadow-[8px_8px_0px_#ffda79] overflow-hidden">
                    <div className="bg-[#ffda79] p-5 border-b-4 border-[#1e293b] flex justify-between items-center font-black  italic">
                       <div className="flex-1 flex flex-col">
                         <span className="text-[10px] opacity-60">Module {curr.id}</span>
                         <input 
                           value={curr.title}
                           onChange={(e) => {
                             const updated = editingMasterCurrs.map(c => c.id === curr.id ? { ...c, title: e.target.value } : c);
                             setEditingMasterCurrs(updated);
                           }}
                           className="bg-transparent text-[#1e293b] font-black text-xl w-full outline-none"
                         />
                       </div>
                    </div>
                    <div className="p-6 space-y-6">
                       {curr.modules?.map((mod: any) => (
                         <div key={mod.id} className="bg-[#fffdf5] border-4 border-[#1e293b] p-6 rounded-2xl space-y-4 relative group hover:shadow-[6px_6px_0px_#1e293b] transition-all">
                            <div className="flex items-center justify-between border-b-2 border-dashed border-[#1e293b]/20 pb-4">
                               <div className="flex-1 space-y-1">
                                  <label className="text-[9px] font-black  opacity-40">Session Title</label>
                                  <input 
                                    type="text" 
                                    value={mod.title} 
                                    onChange={(e) => updateGlobalModule(curr.id, mod.id, 'title', e.target.value)}
                                    className="bg-transparent font-black  text-lg w-full outline-none focus:text-[#ff4757] border-b-2 border-transparent focus:border-[#1e293b]/10" 
                                  />
                               </div>
                               <div className="flex gap-2 shrink-0">
                                  <button 
                                    onClick={() => removeModule(curr.id, mod.id)}
                                    className="p-2 bg-red-400 text-[#1e293b] rounded-lg border-2 border-[#1e293b] shadow-[2px_2px_0px_#1e293b] hover:shadow-none transition-all"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                               </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                               <div className="space-y-2">
                                  <label className="text-[10px] font-black  opacity-60 flex items-center gap-1"><Video size={14} className="text-red-500" /> YouTube/Vimeo ID or URL</label>
                                  <input 
                                    type="text" 
                                    placeholder="e.g. https://youtube.com/embed/..."
                                    value={mod.videoUrl} 
                                    onChange={(e) => updateGlobalModule(curr.id, mod.id, 'videoUrl', e.target.value)}
                                    className="w-full p-3 bg-white border-2 border-[#1e293b] rounded-xl text-xs font-bold outline-none focus:bg-[#ffda79]/10" 
                                  />
                               </div>
                               <div className="space-y-4 bg-gray-50/50 p-4 rounded-xl border-2 border-[#1e293b]/10">
                                  <label className="text-[10px] font-black opacity-60 flex items-center justify-between">
                                     <span className="flex items-center gap-1"><FileText size={14} className="text-[#22d3ee]" /> Asset Kelas (Multiple)</span>
                                     <button 
                                       onClick={() => addAssetToModule(curr.id, mod.id)}
                                       className="text-[#22d3ee] hover:text-[#1e293b] flex items-center gap-1 transition-colors"
                                     >
                                       <PlusCircle size={14} /> Add Asset
                                     </button>
                                  </label>
                                  
                                  <div className="space-y-3">
                                     {Array.isArray(mod.assets) && mod.assets.map((asset: any, aIdx: number) => (
                                       <div key={aIdx} className="bg-white p-3 rounded-lg border-2 border-[#1e293b]/10 space-y-2 relative group">
                                          <button 
                                            onClick={() => removeAssetFromModule(curr.id, mod.id, aIdx)}
                                            className="absolute -top-2 -right-2 bg-red-400 text-white p-1.5 rounded-full border-2 border-[#1e293b] shadow-[2px_2px_0px_#1e293b] hover:bg-red-500 hover:shadow-none transition-all z-10"
                                            title="Hapus Asset"
                                          >
                                            <Trash2 size={12} />
                                          </button>
                                          <input 
                                             type="text" 
                                             placeholder="Nama Asset (Contoh: Template_M1.pdf)"
                                             value={asset.name} 
                                             onChange={(e) => updateAssetInModule(curr.id, mod.id, aIdx, 'name', e.target.value)}
                                             className="w-full p-2 bg-gray-50 border-2 border-[#1e293b]/10 rounded-lg text-[10px] font-bold outline-none focus:border-[#22d3ee]" 
                                          />
                                          <input 
                                             type="text" 
                                             placeholder="Link Asset (Drive/URL)"
                                             value={asset.url} 
                                             onChange={(e) => updateAssetInModule(curr.id, mod.id, aIdx, 'url', e.target.value)}
                                             className="w-full p-2 bg-gray-50 border-2 border-[#1e293b]/10 rounded-lg text-[10px] font-bold outline-none focus:border-[#ff4757]" 
                                          />
                                       </div>
                                     ))}
                                     {(!Array.isArray(mod.assets) || mod.assets.length === 0) && (
                                       <p className="text-[9px] font-bold opacity-30 italic text-center py-2">Belum ada asset ditambahkan.</p>
                                     )}
                                  </div>
                               </div>
                            </div>
                            
                            <div className="space-y-2">
                               <label className="text-[10px] font-black  opacity-60">Session Description</label>
                               <textarea 
                                 value={mod.desc} 
                                 onChange={(e) => updateGlobalModule(curr.id, mod.id, 'desc', e.target.value)}
                                 className="w-full bg-white border-2 border-[#1e293b] p-3 rounded-xl text-xs font-bold outline-none focus:bg-gray-50 min-h-[60px]"
                               />
                            </div>

                            <div className="bg-[#22d3ee]/10 border-4 border-[#1e293b] p-5 rounded-2xl space-y-4">
                               <h4 className="font-black text-[10px] flex items-center gap-2 italic uppercase">
                                  <Zap size={14} className="text-[#ffda79]" fill="currentColor" /> Insight Mentor Editor
                               </h4>
                               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                  <div className="md:col-span-3 space-y-2">
                                     <label className="text-[9px] font-black opacity-40">Insight Quote</label>
                                     <textarea 
                                       placeholder="Tulis insight untuk sesi ini..."
                                       value={mod.insight || ''} 
                                       onChange={(e) => updateGlobalModule(curr.id, mod.id, 'insight', e.target.value)}
                                       className="w-full bg-white border-2 border-[#1e293b] p-3 rounded-xl text-[10px] font-bold outline-none focus:bg-white min-h-[50px]"
                                     />
                                  </div>
                                  <div className="space-y-2">
                                     <label className="text-[9px] font-black opacity-40">Nama Coach</label>
                                     <input 
                                       type="text" 
                                       placeholder="Coach Name"
                                       value={mod.coach || ''} 
                                       onChange={(e) => updateGlobalModule(curr.id, mod.id, 'coach', e.target.value)}
                                       className="w-full bg-white border-2 border-[#1e293b] p-3 rounded-xl text-[10px] font-black outline-none" 
                                     />
                                  </div>
                               </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-6 pt-4 border-t-2 border-dashed border-[#1e293b]/10">
                               <div className="flex items-center gap-6">
                                  <div className="flex items-center gap-2">
                                     <span className="text-[10px] font-black  opacity-60">Module Reward:</span>
                                     <div className="flex items-center bg-[#1e293b] text-white px-3 py-1 rounded-lg border-2 border-[#1e293b]">
                                       <input 
                                         type="number" 
                                         value={mod.xp} 
                                         onChange={(e) => updateGlobalModule(curr.id, mod.id, 'xp', parseInt(e.target.value))}
                                         className="w-12 bg-transparent text-white font-black text-sm text-center outline-none" 
                                       />
                                       <span className="text-[10px] font-black ml-1">XP</span>
                                     </div>
                                  </div>
                                  <div 
                                    onClick={() => updateGlobalModule(curr.id, mod.id, 'quiz', !mod.quiz)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border-4 border-[#1e293b] cursor-pointer transition-all ${mod.quiz ? 'bg-[#ff4757] text-white shadow-[4px_4px_0px_#1e293b]' : 'bg-gray-100 text-[#1e293b] shadow-none opacity-40 hover:opacity-100'}`}
                                  >
                                     <Zap size={16} fill={mod.quiz ? "currentColor" : "none"} />
                                     <span className="text-xs font-black ">Has Post-Test</span>
                                  </div>
                               </div>
                               
                               <button 
                                 onClick={() => setActiveQuizEdit({ currId: curr.id, modId: mod.id })}
                                 className="bg-[#1e293b] text-white text-[10px] font-black  px-6 py-2.5 rounded-xl border-4 border-[#1e293b] shadow-[4px_4px_0px_#22d3ee] active:translate-y-1 active:shadow-none hover:bg-[#22d3ee] hover:text-[#1e293b] transition-all flex items-center gap-2 group/btn"
                               >
                                  <HelpCircle size={16} /> Manage Questions ({mod.questions?.length || 0}) <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                               </button>
                            </div>
                         </div>
                       ))}
                       <button 
                         onClick={() => addNewModule(curr.id)}
                         className="w-full bg-white border-4 border-dashed border-[#1e293b]/10 p-6 rounded-3xl font-black  text-sm text-[#1e293b]/30 hover:border-[#1e293b] hover:text-[#1e293b] hover:bg-gray-50 transition-all flex items-center justify-center gap-3"
                       >
                          <PlusCircle size={20} /> Create New Session Module for {curr.title}
                       </button>
                     </div>
                  </div>
               ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
