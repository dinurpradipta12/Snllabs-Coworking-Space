import { useState } from 'react';
import Calendar from 'react-calendar';
import { Calendar as CalendarIcon, Clock, Video, FileText, Plus, Star, X } from 'lucide-react';
import { motion } from 'motion/react';
import 'react-calendar/dist/Calendar.css';

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
        <div className="p-6 border-b-4 border-black flex items-center justify-between" style={{ backgroundColor: accentColor }}>
          <h2 className="font-black text-xl md:text-2xl uppercase italic tracking-tight">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2 bg-white border-2 border-black rounded-xl shadow-[3px_3px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
          >
            <X size={20} strokeWidth={3} />
          </button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default function Schedule() {
  const [date, setDate] = useState(new Date());
  const [activeModal, setActiveModal] = useState(null);

  const events = [
    { id: 1, title: 'Mentoring Session', date: '14 Mar 2026', time: '10:00 AM', type: 'Video' },
    { id: 2, title: 'Project Review', date: '16 Mar 2026', time: '02:30 PM', type: 'Checklist' },
    { id: 3, title: 'Technical Workshop', date: '18 Mar 2026', time: '09:00 AM', type: 'Live' },
  ];

  const hasEvent = (currentDate) => {
    return events.some(event => {
      const eventDate = new Date(event.date);
      return currentDate.getDate() === eventDate.getDate() &&
             currentDate.getMonth() === eventDate.getMonth() &&
             currentDate.getFullYear() === eventDate.getFullYear();
    });
  };

  const renderModalContent = () => {
    if (activeModal === 'schedule') {
      return (
        <div className="space-y-6">
          <div className="bg-[#ffda79] p-5 rounded-2xl border-4 border-black shadow-[6px_6px_0px_#000000]">
            <h4 className="font-black text-lg uppercase mb-2">Sesi Terdekat</h4>
            <p className="font-bold text-sm mb-4">Pembahasan Final Project & Integrasi Firebase.</p>
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
              {['Tonton video tutorial Auth', 'Siapkan API Key Firebase', 'Tulis kendala yang dialami'].map((prep, i) => (
                <li key={i} className="flex items-center gap-3 bg-white border-2 border-black p-2 rounded-lg font-bold text-xs">
                  <div className="w-2 h-2 bg-[#ff4757] rounded-full border border-black" />
                  {prep}
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 pb-24">
      <BrutalistModal 
        isOpen={activeModal === 'schedule'} 
        onClose={() => setActiveModal(null)}
        title="1:1 Session Detail"
        accentColor="#22d3ee"
      >
        {renderModalContent()}
      </BrutalistModal>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Calendar Card */}
        <div className="bg-[#fffdf5] p-6 rounded-2xl border-2 border-black shadow-[4px_4px_0px_#000000]">
          <div className="flex items-center gap-2 mb-6">
            <CalendarIcon className="text-[#ff4757]" size={24} />
            <h2 className="font-black text-xl uppercase italic">1:1 Schedule</h2>
          </div>

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
        </div>

        {/* Upcoming Events Card */}
        <div className="bg-[#22d3ee] p-6 rounded-2xl border-2 border-black shadow-[4px_4px_0px_#000000]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-black text-xl uppercase italic">Upcoming Events</h2>
          <span className="bg-black text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">Next 7 Days</span>
        </div>

        <div className="grid gap-4">
          {events.map((event) => (
            <div 
              key={event.id}
              onClick={() => setActiveModal('schedule')}
              className="bg-[#fffdf5] p-4 rounded-xl border-2 border-black shadow-[3px_3px_0px_#000000] flex items-center justify-between hover:translate-x-1 hover:-translate-y-1 transition-transform cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#ffda79] rounded-lg border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000000]">
                  {event.type === 'Video' ? <Video size={20} /> : event.type === 'Checklist' ? <FileText size={20} /> : <Clock size={20} />}
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">{event.title}</h3>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs font-bold flex items-center gap-1">
                      <CalendarIcon size={12} /> {event.date}
                    </span>
                    <span className="text-xs font-bold flex items-center gap-1">
                      <Clock size={12} /> {event.time}
                    </span>
                  </div>
                </div>
              </div>
              <button className="bg-black text-white p-2 rounded-lg hover:bg-[#ff4757] transition-colors border-2 border-black">
                <Plus size={18} strokeWidth={3} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
}
