import { motion } from 'motion/react';
import { Calendar as CalendarIcon, Bell, CheckSquare, MessageSquare, Smile, BarChart2, Award, TrendingUp } from 'lucide-react';
import Calendar from 'react-calendar';
import { useState } from 'react';

const Card = ({ title, icon: Icon, children }) => (
  <div className="bg-[#fffdf5] p-4 rounded-2xl border-2 border-black shadow-[4px_4px_0px_#000000] mb-4">
    <div className="flex items-center gap-2 mb-3">
      {Icon && <Icon size={20} className="text-[#22d3ee]" />}
      <h3 className="font-bold text-sm uppercase">{title}</h3>
    </div>
    {children}
  </div>
);

export default function Dashboard({ user }) {
  const [date, setDate] = useState(new Date());
  const upcomingEvents = [
    { title: 'Mentoring Session', date: '14 Mar 2026' },
    { title: 'Project Review', date: '16 Mar 2026' },
    { title: 'Workshop', date: '18 Mar 2026' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      {/* Left Column */}
      <div>
        <Card title="Evaluasi Mentoring" icon={MessageSquare}>
          <p className="text-xs">Lihat hasil evaluasi sesi terakhir Anda.</p>
        </Card>
        <Card title="Mentoring Task" icon={CheckSquare}>
          <p className="text-xs">Selesaikan tugas sebelum deadline.</p>
        </Card>
        <Card title="Notification" icon={Bell}>
          <p className="text-xs">Anda memiliki 3 pesan baru.</p>
        </Card>
      </div>

      {/* Middle Column */}
      <div>
        <Card title="1:1 Schedule" icon={CalendarIcon}>
          <div className="react-calendar-wrapper">
            <Calendar onChange={setDate} value={date} />
          </div>
          <div className="mt-4">
            <h4 className="font-bold text-sm mb-2">Upcoming Events (Next 7 Days)</h4>
            {upcomingEvents.map((event, index) => (
              <div key={index} className="flex justify-between text-xs py-1 border-b border-black/10">
                <span>{event.title}</span>
                <span className="font-bold">{event.date}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Right Column */}
      <div>
        <Card title="Today Mood" icon={Smile}>
          <p className="text-xs">Bagaimana perasaan Anda hari ini?</p>
        </Card>
        <Card title="Mentoring Overview" icon={BarChart2}>
          <p className="text-xs">Progress mentoring Anda bulan ini.</p>
        </Card>
        <Card title="Performance Status" icon={TrendingUp}>
          <p className="text-xs">Status performa saat ini: Baik.</p>
        </Card>
        <Card title="Performance Rangking" icon={Award}>
          <p className="text-xs">Peringkat Anda: #5 dari 20.</p>
        </Card>
      </div>
    </motion.div>
  );
}
