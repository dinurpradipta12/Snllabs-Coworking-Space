import { motion } from 'motion/react';
import { Calendar as CalendarIcon, Bell, CheckSquare, MessageSquare, Smile, BarChart2, Award, TrendingUp, Clock, Plus, ChevronRight, Star, Activity, X } from 'lucide-react';
import Calendar from 'react-calendar';
import { useState } from 'react';

const Card = ({ title, icon: Icon, children, accentColor = "#22d3ee", showFooter = true, onDetailClick = () => {} }) => (
  <div className="bg-[#fffdf5] p-5 rounded-2xl border-2 border-black shadow-[4px_4px_0px_#000000] mb-5 group hover:-translate-y-1 transition-all duration-200">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div 
          className="p-2 rounded-xl border-2 border-black shadow-[2px_2px_0px_#000000]"
          style={{ backgroundColor: accentColor }}
        >
          {Icon && <Icon size={18} className="text-black" strokeWidth={2.5} />}
        </div>
        <h3 className="font-black text-xs uppercase tracking-wider">{title}</h3>
      </div>
      <div className="w-2 h-2 rounded-full bg-black/20 group-hover:bg-[#ff4757] transition-colors" />
    </div>
    <div className="space-y-3">
      {children}
    </div>
    {showFooter && (
      <div className="mt-4 pt-3 border-t-2 border-black/5 flex justify-end">
        <button 
          onClick={onDetailClick}
          className="text-[10px] font-black uppercase flex items-center gap-1 hover:text-[#ff4757] transition-colors"
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
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative w-full max-w-2xl bg-[#fffdf5] border-4 border-black shadow-[8px_8px_0px_#000000] rounded-3xl overflow-hidden"
      >
        {/* Modal Header */}
        <div className="p-6 border-b-4 border-black flex items-center justify-between" style={{ backgroundColor: accentColor }}>
          <h2 className="font-black text-xl md:text-2xl uppercase italic tracking-tight">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2 bg-white border-2 border-black rounded-xl shadow-[3px_3px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
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
  const [activeModal, setActiveModal] = useState(null);
  const [date, setDate] = useState(new Date());
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

  const evaluasiHistory = [
    { date: '12 Mar', mentor: 'Coach Ryan', feedback: 'Penggunaan Hook di 3 detik pertama sangat kuat, namun Call-To-Action (CTA) di akhir video masih kurang jelas.', strengths: 'Video Editing, Copywriting', improvements: 'Call-To-Action' },
    { date: '10 Mar', mentor: 'Coach Ryan', feedback: 'Content calendar bulan ini cukup variatif. Lanjutkan riset hashtag yang lebih tertarget.', strengths: 'Content Planning', improvements: 'Hashtag Research' },
  ];

  const taskList = [
    { id: 1, task: 'M1: Copywriting AIDA', status: 'Pending', due: 'Besok', desc: 'Terapkan formula AIDA untuk draft caption Instagram.' },
    { id: 2, task: 'Riset Kompetitor', status: 'In Progress', due: '15 Mar', desc: 'Analisis 3 brand kompetitor di TikTok & Instagram.' },
    { id: 3, task: 'Optimasi Profil IG', status: 'Done', due: '10 Mar', desc: 'Perbaiki Bio dan letakkan Linktree yang relevan.' },
  ];

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
              <div key={i} className="bg-white border-2 border-black p-4 rounded-xl shadow-[3px_3px_0px_#000000]">
                <div className="flex justify-between mb-2">
                  <span className="text-[10px] font-black uppercase bg-[#22d3ee] px-2 py-0.5 rounded border border-black">{item.date}</span>
                  <span className="text-[10px] font-black uppercase opacity-40 italic">{item.mentor}</span>
                </div>
                <p className="font-bold text-sm mb-3">"{item.feedback}"</p>
                <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t-2 border-black/5">
                  <div>
                    <h5 className="text-[9px] font-black uppercase text-green-600 mb-1">Strengths</h5>
                    <p className="text-[10px] font-bold">{item.strengths}</p>
                  </div>
                  <div>
                    <h5 className="text-[9px] font-black uppercase text-red-600 mb-1">Improvements</h5>
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
                <button key={tab} className="bg-white border-2 border-black px-3 py-1 rounded-lg text-[10px] font-black uppercase hover:bg-[#22d3ee] transition-colors shadow-[2px_2px_0px_#000000]">
                  {tab}
                </button>
              ))}
            </div>
            {taskList.map((task) => (
              <div key={task.id} className="bg-white border-2 border-black p-4 rounded-xl shadow-[3px_3px_0px_#000000]">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-black text-sm uppercase">{task.task}</h4>
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border border-black uppercase ${task.status === 'Done' ? 'bg-green-400' : 'bg-[#22d3ee]'}`}>
                    {task.status}
                  </span>
                </div>
                <p className="text-xs font-bold text-black/60 mb-4">{task.desc}</p>
                <div className="flex justify-between items-center bg-[#fffdf5] border-2 border-black p-2 rounded-lg">
                  <span className="text-[9px] font-black uppercase">Deadline: {task.due}</span>
                  <button className="bg-black text-white text-[9px] font-black uppercase px-3 py-1 rounded hover:bg-[#ff4757] transition-colors">Upload Task</button>
                </div>
              </div>
            ))}
          </div>
        );
      case 'schedule':
        return (
          <div className="space-y-6">
            <div className="bg-[#ffda79] p-5 rounded-2xl border-4 border-black shadow-[6px_6px_0px_#000000]">
              <h4 className="font-black text-lg uppercase mb-2">Sesi Terdekat</h4>
              <p className="font-bold text-sm mb-4">Materi Live: Audit Akun TikTok & Instagram Client.</p>
              <div className="flex gap-3">
                <button className="flex-1 bg-white text-black py-3 rounded-xl border-2 border-black font-black uppercase tracking-tight text-sm shadow-[4px_4px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex justify-center items-center gap-2">
                  <CalendarIcon size={16} strokeWidth={3} /> Join Google Meet
                </button>
              </div>
            </div>
            <div>
              <h5 className="font-black text-xs uppercase mb-3 flex items-center gap-2 italic">
                <Plus size={14} /> Persiapan Sesi
              </h5>
              <ul className="space-y-2">
                {['Tonton video Module 4 (Analytics)', 'Siapkan URL profil TikTok Anda', 'Tulis kendala editing Capcut'].map((prep, i) => (
                  <li key={i} className="flex items-center gap-3 bg-white border-2 border-black p-2 rounded-lg font-bold text-xs">
                    <div className="w-2 h-2 bg-[#ff4757] rounded-full border border-black" />
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
              <div className="bg-white border-2 border-black p-4 rounded-xl shadow-[4px_4px_0px_#000000]">
                <h5 className="text-[10px] font-black uppercase text-black/40 mb-3">XP Logs</h5>
                <div className="space-y-2">
                  {xpLogs.map((log, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-black/5 pb-1">
                      <span className="text-[10px] font-bold">{log.activity}</span>
                      <span className="text-[10px] font-black text-green-600 italic">{log.xp}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white border-2 border-black p-4 rounded-xl shadow-[4px_4px_0px_#000000]">
                <h5 className="text-[10px] font-black uppercase text-black/40 mb-3">Leaderboard</h5>
                <div className="space-y-2">
                  {leaderboard.map((user, i) => (
                    <div key={i} className={`flex justify-between items-center p-1 rounded ${user.isUser ? 'bg-[#ffda79] border border-black' : ''}`}>
                      <span className="text-[10px] font-black">{user.rank}. {user.name}</span>
                      <span className="text-[9px] font-bold">{user.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-black text-white p-4 rounded-xl border-2 border-black">
              <h5 className="text-[10px] font-black uppercase text-[#22d3ee] mb-2">My Badges</h5>
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

      {/* Left Column */}
      <div className="space-y-4">
        <Card title="Evaluasi Mentoring" icon={MessageSquare} accentColor="#ffda79" onDetailClick={() => setActiveModal('evaluasi')}>
          <div className="bg-white border-2 border-black p-3 rounded-xl shadow-[2px_2px_0px_#000000]">
            <div className="flex justify-between items-start mb-2">
              <span className="bg-[#22d3ee] text-[10px] font-black px-2 py-0.5 rounded border border-black uppercase">Sesi Terakhir</span>
              <span className="text-[10px] font-bold opacity-50">12 Mar</span>
            </div>
            <p className="text-xs font-bold leading-relaxed">
              "Penggunaan Hook di 3 detik pertama sangat kuat, namun Call-To-Action (CTA)..."
            </p>
          </div>
        </Card>

        <Card title="Mentoring Task" icon={CheckSquare} accentColor="#22d3ee" onDetailClick={() => setActiveModal('tasks')}>
          <div className="space-y-2">
            {[
              { id: 1, task: 'Integrasi Firebase Auth', status: 'Pending', due: 'Besok' },
              { id: 2, task: 'Fix UI Dashboard', status: 'In Progress', due: '15 Mar' }
            ].map((task) => (
              <div key={task.id} className="bg-white border-2 border-black p-2 rounded-lg flex items-center justify-between shadow-[1px_1px_0px_#000000]">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-gray-500">Task #{task.id}</span>
                  <span className="text-xs font-bold">{task.task}</span>
                </div>
                <div className="text-right">
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border border-black uppercase ${task.status === 'Pending' ? 'bg-[#ffda79]' : 'bg-[#22d3ee]'}`}>
                    {task.due}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Notification" icon={Bell} accentColor="#ff4757">
          <div className="space-y-2">
            <div className="flex gap-3 items-center bg-[#fffdf5] border-b-2 border-black/5 pb-2">
              <div className="w-8 h-8 rounded-full bg-black border-2 border-black flex items-center justify-center text-white text-[10px] font-black">CR</div>
              <div className="flex-1">
                <p className="text-[10px] font-bold leading-tight">Coach Ryan mengomentari tugas Content Calendar Anda.</p>
                <span className="text-[9px] font-black opacity-40 uppercase">2 Jam yang lalu</span>
              </div>
            </div>
            <div className="flex gap-3 items-center bg-[#fffdf5]">
              <div className="w-8 h-8 rounded-full bg-[#22d3ee] border-2 border-black flex items-center justify-center text-black">
                <CalendarIcon size={14} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold leading-tight">Jadwal Mentoring besok telah dikonfirmasi.</p>
                <span className="text-[9px] font-black opacity-40 uppercase">5 Jam yang lalu</span>
              </div>
            </div>
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
                return 'text-black hover:bg-[#22d3ee]/20';
              }}
              tileContent={({ date: tileDate, view }) => {
                if (view === 'month' && hasEvent(tileDate)) {
                  return (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 pointer-events-none z-20">
                      <motion.div
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="bg-[#ffda79] p-1 rounded-full border-2 border-black shadow-[2px_2px_0px_#000000]"
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
            <h4 className="font-black text-xs uppercase italic mb-3 flex items-center gap-2">
              <TrendingUp size={14} className="text-[#ff4757]" />
              Upcoming Events
            </h4>
            <div className="space-y-3">
              {upcomingEvents.map((event, index) => (
                <div 
                  key={index}
                  onClick={() => setActiveModal('schedule')}
                  className="bg-white border-2 border-black p-3 rounded-xl shadow-[2px_2px_0px_#000000] flex justify-between items-center hover:translate-x-1 hover:-translate-y-1 transition-transform cursor-pointer"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-xs">{event.title}</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] uppercase font-black text-[#ff4757]">{event.date}</span>
                      <span className="text-[10px] uppercase font-black text-gray-500 flex items-center gap-1">
                        <Clock size={10} strokeWidth={3} />
                        {event.time}
                      </span>
                    </div>
                  </div>
                  <div className="w-6 h-6 bg-[#22d3ee] border-2 border-black rounded-md flex items-center justify-center shadow-[1px_1px_0px_#000000]">
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
            <div className="text-4xl bg-white border-2 border-black w-14 h-14 rounded-xl flex items-center justify-center shadow-[2px_2px_0px_#000000] cursor-pointer hover:bg-[#22d3ee]/10 transition-colors">
              😊
            </div>
            <div className="flex-1 ml-4 overflow-hidden">
               <div className="text-[10px] font-black uppercase opacity-40 mb-1">Status</div>
               <div className="text-xs font-bold truncate">Luar Biasa Semangat!</div>
            </div>

            {/* Hover Menu Popover */}
            <div className="absolute inset-0 bg-[#fffdf5] border-2 border-black rounded-xl p-1 shadow-[4px_4px_0px_#22d3ee] z-20 opacity-0 invisible group-hover/mood:opacity-100 group-hover/mood:visible transition-all flex items-center justify-around translate-y-1">
               {['😊', '😐', '😔', '🚀', '🔥', '✨'].map((emoji, i) => (
                <button key={i} className="text-3xl hover:scale-130 p-1 rounded-lg hover:bg-[#22d3ee] transition-all">
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </Card>

        <Card title="Mentoring Overview" icon={BarChart2} accentColor="#ffda79" onDetailClick={() => setActiveModal('performa')}>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                <span>Total Sesi</span>
                <span>8/12</span>
              </div>
              <div className="w-full h-3 bg-white border-2 border-black rounded-full overflow-hidden shadow-[1px_1px_0px_#000000]">
                <div className="h-full bg-[#ff4757]" style={{ width: '66%' }}></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white border-2 border-black p-2 rounded-lg text-center">
                <div className="text-xs font-black">14</div>
                <div className="text-[8px] uppercase font-bold opacity-50">Tugas Selesai</div>
              </div>
              <div className="bg-white border-2 border-black p-2 rounded-lg text-center">
                <div className="text-xs font-black">92%</div>
                <div className="text-[8px] uppercase font-bold opacity-50">Kehadiran</div>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Performance Detail" icon={Award} accentColor="#ff4757" onDetailClick={() => setActiveModal('performa')}>
          <div className="space-y-3">
            <div className="bg-[#fffdf5] p-5 rounded-xl border-2 border-black shadow-[4px_4px_0px_#22d3ee] flex items-center justify-between">
              <div className="flex flex-col items-center border-r-2 border-black/10 pr-8 leading-none">
                <div className="text-3xl font-black italic">94%</div>
                <div className="text-[9px] font-black uppercase opacity-60 text-center mt-1 tracking-tighter">Konsistensi</div>
              </div>
              <div className="pl-6 flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <TrendingUp size={18} className="text-[#22d3ee]" strokeWidth={4} />
                  <span className="text-lg font-black uppercase tracking-tight text-[#ff4757]">BAIK</span>
                </div>
                <p className="text-xs font-bold text-black/70 leading-tight border-t-2 border-black/5 pt-2">
                  Meningkat <span className="text-[#22d3ee]">15%</span> dari minggu sebelumnya.
                </p>
              </div>
            </div>
            
            {/* Small stat row inside the same card */}
            <div className="flex gap-2">
              <div className="flex-1 bg-white border-2 border-black p-2 rounded-lg text-center shadow-[1px_1px_0px_#000000]">
                <div className="text-[8px] font-black uppercase opacity-50">Score</div>
                <div className="text-xs font-black mb-1">850 XP</div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full border border-black overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#ff4757] to-[#ffda79]" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div className="flex-1 bg-white border-2 border-black p-2 rounded-lg text-center shadow-[1px_1px_0px_#000000]">
                <div className="text-[8px] font-black uppercase opacity-50">Streak</div>
                <div className="text-xs font-black mb-1">12 Hari</div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full border border-black overflow-hidden">
                  <div className="h-full bg-[#22d3ee]" style={{ width: '40%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
