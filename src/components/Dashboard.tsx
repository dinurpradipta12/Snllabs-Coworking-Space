import { motion } from 'motion/react';
import { Calendar as CalendarIcon, Bell, CheckSquare, BookOpen, Smile, BarChart2, Award, TrendingUp, Clock, Plus, Star, Activity, X, Info, AlertCircle, Check } from 'lucide-react';
import Calendar from 'react-calendar';
import { useState } from 'react';
import { useData } from '../context/DataContext';

const Card = ({ title, icon: Icon, children, accentColor = "#22d3ee", showFooter = true, onDetailClick = () => {} }) => (
  <div className="bg-[#fffdf5] p-5 rounded-2xl border-2 border-[#1e293b] shadow-[4px_4px_0px_#1e293b] mb-5 group hover:-translate-y-1 transition-all duration-200">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div 
          className="p-2 rounded-xl border-2 border-[#1e293b] shadow-[2px_2px_0px_#1e293b]"
          style={{ backgroundColor: accentColor }}
        >
          {Icon && <Icon size={18} className="text-[#1e293b]" strokeWidth={2.5} />}
        </div>
        <h3 className="font-black text-xs  tracking-wider">{title}</h3>
      </div>
      <div className="w-2 h-2 rounded-full bg-[#1e293b]/20 group-hover:bg-[#22d3ee] transition-colors" />
    </div>
    <div className="space-y-3">
      {children}
    </div>
    {showFooter && (
      <div className="mt-4 pt-3 border-t-2 border-[#1e293b]/5 flex justify-end">
        <button 
          onClick={onDetailClick}
          className="text-[10px] font-black  flex items-center gap-1 hover:text-[#ff4757] transition-colors"
        >
          Detail <Plus size={10} strokeWidth={4} />
        </button>
      </div>
    )}
  </div>
);

const BrutalistModal = ({ isOpen, onClose, title, children, accentColor = "#22d3ee" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#1e293b]/40 backdrop-blur-sm" 
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative w-full max-w-2xl bg-[#fffdf5] border-4 border-[#1e293b] shadow-[8px_8px_0px_#22d3ee] rounded-3xl overflow-hidden"
      >
        {/* Modal Header */}
        <div className="p-6 border-b-4 border-[#1e293b] flex items-center justify-between" style={{ backgroundColor: accentColor }}>
          <h2 className="font-black text-xl md:text-2xl  italic tracking-tight">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2 bg-white border-2 border-[#1e293b] rounded-xl shadow-[3px_3px_0px_#1e293b] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
          >
            <X size={20} strokeWidth={3} />
          </button>
        </div>
        
        {/* Modal Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default function Dashboard({ user }) {
  const { dashboardData, curriculums, globalNotifications, markNotifRead, loading } = useData();
  const [activeModal, setActiveModal] = useState(null);
  const [date, setDate] = useState(new Date());

  const relativeTime = (ts: any) => {
    if (!ts) return '';
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Baru saja';
    if (mins < 60) return `${mins} menit lalu`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} jam lalu`;
    return `${Math.floor(hours / 24)} hari lalu`;
  };

  if (loading) return <div className="p-10 font-black  italic animate-pulse">Synchronizing Database...</div>;

  const evaluasiHistory = dashboardData.evaluations || [];
  const taskList = dashboardData.tasks || [];

  // --- Derived real stats ---
  // Curriculum progress: total modules & done modules across all curricula
  const totalModules = curriculums.reduce((acc: number, c: any) => acc + (c.modules?.length || 0), 0);
  const doneModules  = curriculums.reduce((acc: number, c: any) => acc + (c.modules?.filter((m: any) => m.status === 'Done').length || 0), 0);
  const currProgress = totalModules > 0 ? Math.round((doneModules / totalModules) * 100) : 0;

  // Tasks
  const taskDone    = taskList.filter((t: any) => t.status === 'Done').length;
  const taskTotal   = taskList.length;

  // XP & level from dashboardData
  const currentXP     = dashboardData.currentXP || 0;
  const userLevel     = dashboardData.level || 0;
  const mentoringDays = dashboardData.mentoringDays || 0;

  // Consistency: percentage of modules done out of total (or use task completion rate if no curriculum)
  const consistencyPct = totalModules > 0 ? currProgress : (taskTotal > 0 ? Math.round((taskDone / taskTotal) * 100) : 0);
  const consistencyLabel = consistencyPct >= 80 ? 'Sangat Baik' : consistencyPct >= 60 ? 'Baik' : consistencyPct >= 40 ? 'Cukup' : 'Perlu Ditingkatkan';

  // Locked modules
  const lockedModules = curriculums.reduce((acc: number, c: any) => acc + (c.modules?.filter((m: any) => m.status === 'Locked').length || 0), 0);

  // XP progress: assume max XP per level = 1000
  const xpMaxPerLevel = 1000;
  const xpPct = Math.min(100, Math.round((currentXP % xpMaxPerLevel) / xpMaxPerLevel * 100));

  const upcomingEvents = [
    { title: 'Mentoring Session', date: '14 Mar 2026', time: '10:00 AM' },
    { title: 'Project Review', date: '16 Mar 2026', time: '02:30 PM' },
    { title: 'Workshop', date: '18 Mar 2026', time: '09:00 AM' },
  ];

  const hasEvent = (currentDate) => {
    return upcomingEvents.some(event => {
      const eventDate = new Date(event.date);
      return currentDate.getDate() === eventDate.getDate() &&
             currentDate.getMonth() === eventDate.getMonth() &&
             currentDate.getFullYear() === eventDate.getFullYear();
    });
  };


  const xpLogs = [
    { activity: 'Kumpul Draft Video', xp: '+20 XP', date: 'Hari ini' },
    { activity: 'Modul Copywriting', xp: '+50 XP', date: 'Kemarin' },
    { activity: 'Quiz Analytics', xp: '+10 XP', date: '12 Mar' },
  ];

  const leaderboard = [
    { rank: 1, name: 'Ananda R.', score: '1250 XP' },
    { rank: 2, name: 'Budi S.', score: '1100 XP' },
    { rank: 3, name: 'Citra W.', score: '980 XP' },
    { rank: 4, name: 'Doni K.', score: '920 XP' },
    { rank: 5, name: 'Dinur M. P.', score: '850 XP', isUser: true },
  ];

  const renderModalContent = () => {
    switch(activeModal) {
      case 'evaluasi':
        return (
          <div className="space-y-4">
            {evaluasiHistory.map((item, i) => (
              <div key={i} className="bg-white border-2 border-[#1e293b] p-4 rounded-xl shadow-[3px_3px_0px_#1e293b]">
                <div className="flex justify-between mb-2">
                  <span className="text-[10px] font-black  bg-[#22d3ee] px-2 py-0.5 rounded border border-[#1e293b]">{item.date}</span>
                  <span className="text-[10px] font-black  opacity-40 italic">{item.mentor}</span>
                </div>
                <p className="font-bold text-sm mb-3">"{item.feedback}"</p>
                <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t-2 border-[#1e293b]/5">
                  <div>
                    <h5 className="text-[9px] font-black  text-green-600 mb-1">Strengths</h5>
                    <p className="text-[10px] font-bold">{item.strengths}</p>
                  </div>
                  <div>
                    <h5 className="text-[9px] font-black  text-red-600 mb-1">Improvements</h5>
                    <p className="text-[10px] font-bold">{item.improvements}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      case 'tasks':
        return (
          <div className="space-y-3">
            <div className="flex gap-2 mb-4">
              {['Semua', 'Pending', 'Selesai'].map((tab) => (
                <button key={tab} className="bg-white border-2 border-[#1e293b] px-3 py-1 rounded-lg text-[10px] font-black  hover:bg-[#22d3ee] transition-colors shadow-[2px_2px_0px_#1e293b]">
                  {tab}
                </button>
              ))}
            </div>
            {taskList.map((task) => (
              <div key={task.id} className="bg-white border-2 border-[#1e293b] p-4 rounded-xl shadow-[3px_3px_0px_#1e293b]">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-black text-sm ">{task.task}</h4>
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border border-[#1e293b]  ${task.status === 'Done' ? 'bg-green-400' : 'bg-[#22d3ee]'}`}>
                    {task.status}
                  </span>
                </div>
                <p className="text-xs font-bold text-[#1e293b]/60 mb-4">{task.desc}</p>
                <div className="flex justify-between items-center bg-[#fffdf5] border-2 border-[#1e293b] p-2 rounded-lg">
                  <span className="text-[9px] font-black ">Deadline: {task.due}</span>
                  <button className="bg-[#1e293b] text-white text-[9px] font-black  px-3 py-1 rounded hover:bg-[#22d3ee] transition-colors">Upload Task</button>
                </div>
              </div>
            ))}
          </div>
        );
      case 'schedule':
        return (
          <div className="space-y-6">
            <div className="bg-[#ffda79] p-5 rounded-2xl border-4 border-[#1e293b] shadow-[6px_6px_0px_#1e293b]">
              <h4 className="font-black text-lg  mb-2">Sesi Terdekat</h4>
              <p className="font-bold text-sm mb-4">Materi Live: Audit Akun TikTok & Instagram Client.</p>
              <div className="flex gap-3">
                <button className="flex-1 bg-white text-[#1e293b] py-3 rounded-xl border-2 border-[#1e293b] font-black  tracking-tight text-sm shadow-[4px_4px_0px_#1e293b] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex justify-center items-center gap-2">
                  <CalendarIcon size={16} strokeWidth={3} /> Join Google Meet
                </button>
              </div>
            </div>
            <div>
              <h5 className="font-black text-xs  mb-3 flex items-center gap-2 italic">
                <Plus size={14} /> Persiapan Sesi
              </h5>
              <ul className="space-y-2">
                {['Tonton video Module 4 (Analytics)', 'Siapkan URL profil TikTok Anda', 'Tulis kendala editing Capcut'].map((prep, i) => (
                  <li key={i} className="flex items-center gap-3 bg-white border-2 border-[#1e293b] p-2 rounded-lg font-bold text-xs">
                    <div className="w-2 h-2 bg-[#22d3ee] rounded-full border border-[#1e293b]" />
                    {prep}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      case 'performa':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border-2 border-[#1e293b] p-4 rounded-xl shadow-[4px_4px_0px_#1e293b]">
                <h5 className="text-[10px] font-black  text-[#1e293b]/40 mb-3">XP Logs</h5>
                <div className="space-y-2">
                  {xpLogs.map((log, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-[#1e293b]/5 pb-1">
                      <span className="text-[10px] font-bold">{log.activity}</span>
                      <span className="text-[10px] font-black text-green-600 italic">{log.xp}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white border-2 border-[#1e293b] p-4 rounded-xl shadow-[4px_4px_0px_#1e293b]">
                <h5 className="text-[10px] font-black  text-[#1e293b]/40 mb-3">Leaderboard</h5>
                <div className="space-y-2">
                  {leaderboard.map((user, i) => (
                    <div key={i} className={`flex justify-between items-center p-1 rounded ${user.isUser ? 'bg-[#ffda79] border border-[#1e293b]' : ''}`}>
                      <span className="text-[10px] font-black">{user.rank}. {user.name}</span>
                      <span className="text-[9px] font-bold">{user.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-[#1e293b] text-white p-4 rounded-xl border-2 border-[#1e293b]">
              <h5 className="text-[10px] font-black  text-[#22d3ee] mb-2">My Badges</h5>
              <div className="flex gap-4">
                {[Award, Star, Activity].map((Icon, i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center hover:scale-110 transition-transform cursor-help shadow-[2px_2px_0px_#22d3ee]">
                    <Icon size={20} className="text-[#ffda79]" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'notif':
        return (
          <div className="space-y-3">
            {globalNotifications.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-10 opacity-30">
                <Bell size={48} strokeWidth={1} />
                <p className="text-sm font-bold italic">Tidak ada notifikasi.</p>
              </div>
            ) : globalNotifications.map((n: any) => (
              <div key={n.id} className={`flex gap-3 items-start p-4 rounded-2xl border-2 border-[#1e293b] shadow-[3px_3px_0px_#1e293b] transition-all ${n.unread ? 'bg-[#22d3ee]/5' : 'bg-white opacity-60'}`}>
                <div className={`w-10 h-10 rounded-full border-2 border-[#1e293b] flex items-center justify-center shrink-0 ${
                  n.type === 'success' ? 'bg-green-400' : 
                  n.type === 'warning' ? 'bg-[#ffda79]' : 'bg-[#22d3ee]'
                }`}>
                  {n.type === 'success' ? <Check size={18} strokeWidth={3} /> : n.type === 'warning' ? <AlertCircle size={18} strokeWidth={3} /> : <Info size={18} strokeWidth={3} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-black text-sm">{n.title}</h4>
                    {n.unread && (
                      <button 
                        onClick={() => markNotifRead(n.id)}
                        className="text-[9px] font-black bg-[#22d3ee] border border-[#1e293b] px-2 py-0.5 rounded-full shrink-0 hover:bg-[#1e293b] hover:text-white transition-colors"
                      >
                        Tandai dibaca
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] font-bold opacity-60 mt-0.5">{n.desc}</p>
                  <span className="text-[9px] font-black opacity-30 mt-1 block">{relativeTime(n.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        );
      case 'kurikulum':
        return (
          <div className="space-y-4">
            {curriculums.length === 0 ? (
              <p className="text-sm font-bold opacity-40 text-center py-8">Belum ada kurikulum aktif.</p>
            ) : curriculums.map((curr: any) => {
              const total = curr.modules?.length || 0;
              const done = curr.modules?.filter((m: any) => m.status === 'Done').length || 0;
              const pct = total > 0 ? Math.round((done / total) * 100) : 0;
              return (
                <div key={curr.id} className="bg-white border-2 border-[#1e293b] p-4 rounded-xl shadow-[3px_3px_0px_#1e293b] space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-black text-sm">{curr.title}</h4>
                    <span className="font-black text-xs bg-[#ffda79] border border-[#1e293b] px-2 py-0.5 rounded">{pct}%</span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 border-2 border-[#1e293b] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#22d3ee] to-[#ffda79]" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {curr.modules?.slice(0, 4).map((m: any) => (
                      <div key={m.id} className={`p-2 rounded-lg border-2 border-[#1e293b] text-[10px] font-black flex items-center gap-1.5 ${
                        m.status === 'Done' ? 'bg-green-100' : m.status === 'Unlocked' ? 'bg-[#22d3ee]/10' : 'bg-gray-50 opacity-50'
                      }`}>
                        <span>{m.status === 'Done' ? '✓' : m.status === 'Unlocked' ? '▶' : '🔒'}</span>
                        <span className="truncate">{m.title}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] font-bold opacity-40">{done} dari {total} modul selesai</p>
                </div>
              );
            })}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      {/* Modals Container */}
      <BrutalistModal 
        isOpen={activeModal === 'evaluasi'} 
        onClose={() => setActiveModal(null)}
        title="Evaluasi Mentoring History"
        accentColor="#ffda79"
      >
        {renderModalContent()}
      </BrutalistModal>

      <BrutalistModal 
        isOpen={activeModal === 'tasks'} 
        onClose={() => setActiveModal(null)}
        title="Mentoring Task Center"
        accentColor="#22d3ee"
      >
        {renderModalContent()}
      </BrutalistModal>

      <BrutalistModal 
        isOpen={activeModal === 'schedule'} 
        onClose={() => setActiveModal(null)}
        title="1:1 Session Detail"
        accentColor="#22d3ee"
      >
        {renderModalContent()}
      </BrutalistModal>

      <BrutalistModal 
        isOpen={activeModal === 'performa'} 
        onClose={() => setActiveModal(null)}
        title="Performance & XP Statistics"
        accentColor="#22d3ee"
      >
        {renderModalContent()}
      </BrutalistModal>

      <BrutalistModal 
        isOpen={activeModal === 'notif'} 
        onClose={() => setActiveModal(null)}
        title="Semua Notifikasi"
        accentColor="#22d3ee"
      >
        {renderModalContent()}
      </BrutalistModal>

      <BrutalistModal 
        isOpen={activeModal === 'kurikulum'} 
        onClose={() => setActiveModal(null)}
        title="Progres Kurikulum Belajar"
        accentColor="#ffda79"
      >
        {renderModalContent()}
      </BrutalistModal>

      {/* Left Column */}
      <div className="space-y-4">
        {/* Card 1: Progres Kurikulum */}
        <Card title="Progres Kurikulum" icon={BookOpen} accentColor="#ffda79" onDetailClick={() => setActiveModal('kurikulum')}>
          {curriculums.length === 0 ? (
            <p className="text-[10px] font-bold opacity-40 italic text-center py-2">Belum ada kurikulum aktif.</p>
          ) : (
            curriculums.slice(0, 2).map((curr: any) => {
              const total = curr.modules?.length || 0;
              const done = curr.modules?.filter((m: any) => m.status === 'Done').length || 0;
              const pct = total > 0 ? Math.round((done / total) * 100) : 0;
              return (
                <div key={curr.id} className="bg-white border-2 border-[#1e293b] p-3 rounded-xl shadow-[2px_2px_0px_#1e293b] space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-xs truncate max-w-[70%]">{curr.title}</span>
                    <span className="text-[9px] font-black bg-[#ffda79] px-1.5 py-0.5 rounded border border-[#1e293b]">{pct}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 border-2 border-[#1e293b] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#22d3ee] to-[#ffda79] transition-all" 
                      style={{ width: `${pct}%` }} 
                    />
                  </div>
                  <p className="text-[9px] font-bold opacity-40">{done} dari {total} modul selesai</p>
                </div>
              );
            })
          )}
        </Card>

        {/* Card 2: Tugas & Submission */}
        <Card title="Tugas & Submission" icon={CheckSquare} accentColor="#22d3ee" onDetailClick={() => setActiveModal('tasks')}>
          <div className="space-y-2">
            {taskList.length === 0 ? (
              <p className="text-[10px] font-bold opacity-40 italic text-center py-2">Tidak ada tugas saat ini. 🎉</p>
            ) : (
              taskList.slice(0, 3).map((task: any) => (
                <div key={task.id} className="bg-white border-2 border-[#1e293b] p-2 rounded-lg flex items-center justify-between shadow-[1px_1px_0px_#1e293b] gap-2">
                  <div className="flex flex-col min-w-0">
                    <span className="text-[9px] font-black text-[#1e293b]/40">Modul tugas</span>
                    <span className="text-xs font-bold truncate">{task.task}</span>
                  </div>
                  <span className={`text-[9px] font-black px-2 py-1 rounded border border-[#1e293b] shrink-0 ${
                    task.status === 'Done' ? 'bg-green-400' : 
                    task.status === 'In Progress' ? 'bg-[#22d3ee]' : 'bg-[#ffda79]'
                  }`}>
                    {task.status === 'Done' ? '✓ Selesai' : task.status === 'In Progress' ? 'Dikerjakan' : 'Pending'}
                  </span>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card 
          title="Notifikasi" 
          icon={Bell} 
          accentColor="#22d3ee"
          showFooter={globalNotifications.length > 0}
          onDetailClick={() => setActiveModal('notif')}
        >
          <div className="space-y-2">
            {globalNotifications.length === 0 ? (
              <div className="flex flex-col items-center gap-1 py-3 opacity-30">
                <Bell size={28} strokeWidth={1.5} />
                <p className="text-[10px] font-bold italic">Tidak ada notifikasi.</p>
              </div>
            ) : (
              globalNotifications.slice(0, 3).map((n: any) => (
                <div 
                  key={n.id} 
                  className={`flex gap-3 items-start p-2 rounded-xl transition-all border ${
                    n.unread 
                      ? 'border-[#22d3ee]/40 bg-[#22d3ee]/5' 
                      : 'border-transparent opacity-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full border-2 border-[#1e293b] flex items-center justify-center shrink-0 ${
                    n.type === 'success' ? 'bg-green-400' : 
                    n.type === 'warning' ? 'bg-[#ffda79]' : 'bg-[#22d3ee]'
                  }`}>
                    {n.type === 'success' 
                      ? <Check size={14} strokeWidth={3} /> 
                      : n.type === 'warning' 
                        ? <AlertCircle size={14} strokeWidth={3} /> 
                        : <Info size={14} strokeWidth={3} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black leading-tight truncate">{n.title}</p>
                    <p className="text-[9px] font-bold opacity-50 truncate">{n.desc}</p>
                    <span className="text-[8px] font-black opacity-30">{relativeTime(n.timestamp)}</span>
                  </div>
                  {n.unread && (
                    <button 
                      onClick={() => markNotifRead(n.id)}
                      className="w-2 h-2 rounded-full bg-[#22d3ee] border border-[#1e293b] shrink-0 mt-1.5 hover:scale-125 transition-transform"
                      title="Tandai dibaca"
                    />
                  )}
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Middle Column */}
      <div>
        <Card title="1:1 Schedule" icon={CalendarIcon} onDetailClick={() => setActiveModal('schedule')}>
          <div className="brutalist-calendar">
            <Calendar 
              onChange={setDate} 
              value={date} 
              tileClassName={({ date: tileDate, view }) => {
                if (view === 'month' && hasEvent(tileDate)) {
                  return 'has-event-tile relative';
                }
                return 'text-[#1e293b] hover:bg-[#22d3ee]/20';
              }}
              tileContent={({ date: tileDate, view }) => {
                if (view === 'month' && hasEvent(tileDate)) {
                  return (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 pointer-events-none z-20">
                      <motion.div
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="bg-[#ffda79] p-1 rounded-full border-2 border-[#1e293b] shadow-[2px_2px_0px_#1e293b]"
                      >
                        <Star size={10} fill="black" strokeWidth={3} />
                      </motion.div>
                    </div>
                  );
                }
                return null;
              }}
            />
          </div>
          <div className="mt-6">
            <h4 className="font-black text-xs  italic mb-3 flex items-center gap-2">
              <TrendingUp size={14} className="text-[#22d3ee]" />
              Upcoming Events
            </h4>
            <div className="space-y-3">
              {upcomingEvents.map((event, index) => (
                <div 
                  key={index}
                  onClick={() => setActiveModal('schedule')}
                  className="bg-white border-2 border-[#1e293b] p-3 rounded-xl shadow-[2px_2px_0px_#1e293b] flex justify-between items-center hover:translate-x-1 hover:-translate-y-1 transition-transform cursor-pointer"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-xs">{event.title}</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px]  font-black text-[#22d3ee]">{event.date}</span>
                      <span className="text-[10px]  font-black text-gray-500 flex items-center gap-1">
                        <Clock size={10} strokeWidth={3} />
                        {event.time}
                      </span>
                    </div>
                  </div>
                  <div className="w-6 h-6 bg-[#22d3ee] border-2 border-[#1e293b] rounded-md flex items-center justify-center shadow-[1px_1px_0px_#1e293b]">
                    <CalendarIcon size={12} strokeWidth={3} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Right Column */}
      <div className="space-y-4">
        <Card title="Today Mood" icon={Smile} accentColor="#22d3ee" showFooter={false}>
          <div className="flex items-center group/mood relative py-1 px-1 -mt-2">
            <div className="text-4xl bg-white border-2 border-[#1e293b] w-14 h-14 rounded-xl flex items-center justify-center shadow-[2px_2px_0px_#1e293b] cursor-pointer hover:bg-[#22d3ee]/10 transition-colors">
              😊
            </div>
            <div className="flex-1 ml-4 overflow-hidden">
               <div className="text-[10px] font-black  opacity-40 mb-1">Status</div>
               <div className="text-xs font-bold truncate">Luar Biasa Semangat!</div>
            </div>

            {/* Hover Menu Popover */}
            <div className="absolute inset-0 bg-[#fffdf5] border-2 border-[#1e293b] rounded-xl p-1 shadow-[4px_4px_0px_#22d3ee] z-20 opacity-0 invisible group-hover/mood:opacity-100 group-hover/mood:visible transition-all flex items-center justify-around translate-y-1">
               {['😊', '😐', '😔', '🚀', '🔥', '✨'].map((emoji, i) => (
                <button key={i} className="text-3xl hover:scale-130 p-1 rounded-lg hover:bg-[#22d3ee] transition-all">
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </Card>

        <Card title="Overview Belajar" icon={BarChart2} accentColor="#ffda79" onDetailClick={() => setActiveModal('performa')}>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-[10px] font-black mb-1">
                <span>Progres Modul</span>
                <span>{doneModules}/{totalModules}</span>
              </div>
              <div className="w-full h-3 bg-white border-2 border-[#1e293b] rounded-full overflow-hidden shadow-[1px_1px_0px_#1e293b]">
                <div 
                  className="h-full bg-gradient-to-r from-[#22d3ee] to-[#ffda79] transition-all" 
                  style={{ width: `${currProgress}%` }}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white border-2 border-[#1e293b] p-2 rounded-lg text-center">
                <div className="text-xs font-black">{taskDone}/{taskTotal}</div>
                <div className="text-[8px] font-bold opacity-50">Tugas Selesai</div>
              </div>
              <div className="bg-white border-2 border-[#1e293b] p-2 rounded-lg text-center">
                <div className="text-xs font-black">{lockedModules} modul</div>
                <div className="text-[8px] font-bold opacity-50">Modul Terkunci</div>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Performance Detail" icon={Award} accentColor="#22d3ee" onDetailClick={() => setActiveModal('performa')}>
          <div className="space-y-3">
            <div className="bg-[#fffdf5] p-4 rounded-xl border-2 border-[#1e293b] shadow-[4px_4px_0px_#22d3ee] flex items-center justify-between">
              <div className="flex flex-col items-center border-r-2 border-[#1e293b]/10 pr-5 leading-none">
                <div className="text-3xl font-black italic">{consistencyPct}%</div>
                <div className="text-[9px] font-black opacity-60 text-center mt-1 tracking-tighter">Konsistensi</div>
              </div>
              <div className="pl-4 flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <TrendingUp size={18} className="text-[#22d3ee]" strokeWidth={4} />
                  <span className="text-base font-black tracking-tight text-[#1e293b]">{consistencyLabel}</span>
                </div>
                <p className="text-xs font-bold text-[#1e293b]/70 leading-tight border-t-2 border-[#1e293b]/5 pt-2">
                  Level <span className="text-[#22d3ee]">{userLevel}</span> · {doneModules} modul selesai
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <div className="flex-1 bg-white border-2 border-[#1e293b] p-2 rounded-lg text-center shadow-[1px_1px_0px_#1e293b]">
                <div className="text-[8px] font-black opacity-50">XP Saat Ini</div>
                <div className="text-xs font-black mb-1">{currentXP.toLocaleString()} XP</div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full border border-[#1e293b] overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#22d3ee] to-[#ffda79]" style={{ width: `${xpPct}%` }} />
                </div>
              </div>
              <div className="flex-1 bg-white border-2 border-[#1e293b] p-2 rounded-lg text-center shadow-[1px_1px_0px_#1e293b]">
                <div className="text-[8px] font-black opacity-50">Tugas Done</div>
                <div className="text-xs font-black mb-1">{taskDone} tugas</div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full border border-[#1e293b] overflow-hidden">
                  <div className="h-full bg-[#22d3ee]" style={{ width: `${taskTotal > 0 ? Math.round(taskDone/taskTotal*100) : 0}%` }} />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
