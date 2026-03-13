import { LayoutDashboard, Calendar, ListTodo, BarChart3, User, Settings, Plus } from 'lucide-react';

export default function BottomNav({ activePage, setActivePage }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'schedule', label: 'Meeting', icon: Calendar },
    { id: 'tasks', label: 'Tasklist', icon: ListTodo },
    { id: 'monitor', label: 'Analytic', icon: BarChart3 }, // Label shortened for layout, full: Personal Performance Analytic
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const leftItems = menuItems.slice(0, 3);
  const rightItems = menuItems.slice(3);

  return (
    <div className="fixed bottom-6 left-6 right-6 z-50">
      <div className="flex items-center justify-between bg-[#e0e5ec] px-6 py-3 rounded-full shadow-[8px_8px_16px_#babecc,-8px_-8px_16px_#ffffff]">
        {leftItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`flex flex-col items-center gap-1 p-2 rounded-full transition-all ${
              activePage === item.id 
                ? 'text-[#ff4757]' 
                : 'text-[#4a5568] hover:text-[#ff4757]'
            }`}
          >
            <item.icon size={20} />
            <span className="text-[10px] font-bold tracking-wider">{item.label}</span>
          </button>
        ))}
        
        {/* Central Plus Button */}
        <button 
          title="Gunakan untuk Meet Request ke mentor"
          className="w-14 h-14 rounded-full bg-[#ff4757] text-white shadow-[4px_4px_8px_rgba(166,50,60,0.4),-4px_-4px_8px_rgba(255,100,110,0.4)] flex items-center justify-center hover:scale-105 transition-transform"
        >
          <Plus size={28} />
        </button>

        {rightItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`flex flex-col items-center gap-1 p-2 rounded-full transition-all ${
              activePage === item.id 
                ? 'text-[#ff4757]' 
                : 'text-[#4a5568] hover:text-[#ff4757]'
            }`}
          >
            <item.icon size={20} />
            <span className="text-[10px] font-bold tracking-wider">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
