import React, { useState } from 'react';
import { Bell, MessageSquare, X, Check, Info, AlertCircle, Send } from 'lucide-react';
import { useData } from '../context/DataContext';

export default function SideActions() {
  const [activePanel, setActivePanel] = useState<'notifications' | 'messages' | null>(null);
  const { 
    globalNotifications, 
    userMessages, 
    markNotifRead, 
    markMessageRead,
    activeUser,
    allUsers,
    sendDirectMessage
  } = useData();

  const [userMsgInput, setUserMsgInput] = useState('');

  const markAllNotifsRead = async () => {
    for (const n of globalNotifications.filter(n => n.unread)) {
      await markNotifRead(n.id);
    }
  };

  const markMessagesRead = async () => {
    if (!activeUser) return;
    for (const m of userMessages.filter(m => m.unread)) {
      await markMessageRead(activeUser, m.id);
    }
  };

  const unreadNotifCount = globalNotifications.filter(n => n.unread).length;
  const unreadMsgCount = userMessages.filter(m => m.unread).length;

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[60] flex items-center gap-4 pointer-events-none">
      
      {/* Panel Area (Floating Card to the left of icons) */}
      <div className={`transition-all duration-300 pointer-events-auto transform ${activePanel ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-10 opacity-0 scale-95 pointer-events-none'}`}>
        {activePanel && (
          <div className="bg-white border-4 border-[#1e293b] w-80 rounded-3xl shadow-[8px_8px_0px_#1e293b] overflow-hidden">
            {/* Header Panel */}
            <div className="bg-[#1e293b] p-4 text-white flex justify-between items-center">
              <div className="flex flex-col">
                <h3 className="font-black italic uppercase text-xs flex items-center gap-2">
                  {activePanel === 'notifications' ? <Bell size={16} className="text-[#22d3ee]" /> : <MessageSquare size={16} className="text-[#ffda79]" />}
                  {activePanel === 'notifications' ? 'Pusat Notifikasi' : 'Inbox Chat'}
                </h3>
                {activePanel === 'notifications' && unreadNotifCount > 0 && (
                  <button onClick={markAllNotifsRead} className="text-[9px] font-black text-[#22d3ee] flex items-center gap-1 mt-1 hover:underline">
                    <Check size={12} /> Tandai semua dibaca
                  </button>
                )}
                {activePanel === 'messages' && unreadMsgCount > 0 && (
                  <button onClick={markMessagesRead} className="text-[9px] font-black text-[#ffda79] flex items-center gap-1 mt-1 hover:underline">
                    <Check size={12} /> Tandai semua dibaca
                  </button>
                )}
              </div>
              <button onClick={() => setActivePanel(null)} className="hover:rotate-90 transition-transform p-1">
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto no-scrollbar p-3 space-y-3 bg-[#fffdf5]">
              {activePanel === 'notifications' ? (
                globalNotifications.map(n => (
                  <div key={n.id} className={`p-4 rounded-2xl border-2 border-[#1e293b] bg-white shadow-[3px_3px_0px_#1e293b] relative group transition-all ${n.unread ? 'bg-blue-50/30' : 'opacity-60'}`}>
                    {n.unread && (
                      <button 
                         onClick={() => markNotifRead(n.id)}
                         className="absolute top-3 right-3 text-[#22d3ee] hover:scale-110 transition-transform p-1 bg-white rounded-lg border-2 border-[#1e293b] shadow-[2px_2px_0px_#1e293b] opacity-0 group-hover:opacity-100"
                         title="Tandai dibaca"
                      >
                        <Check size={10} strokeWidth={4} />
                      </button>
                    )}
                    <div className="flex gap-3">
                      <div className="mt-1">
                        {n.type === 'success' ? <Check className="text-green-500" size={16} /> : n.type === 'warning' ? <AlertCircle className="text-amber-500" size={16} /> : <Info className="text-[#22d3ee]" size={16} />}
                      </div>
                      <div>
                        <h4 className="font-black text-[11px] mb-0.5">{n.title}</h4>
                        <p className="text-[10px] font-bold opacity-60 leading-tight">{n.desc}</p>
                        <span className="text-[8px] font-black opacity-30 mt-2 block">
                          {n.timestamp ? (
                             typeof n.timestamp === 'string' 
                             ? new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                             : new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          ) : '??:??'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="space-y-4 py-2">
                  {userMessages.map(m => (
                    <div 
                      key={m.id} 
                      onClick={() => activeUser && markMessageRead(activeUser, m.id)}
                      className={`flex gap-3 hover:bg-white/50 p-2 rounded-xl transition-colors cursor-pointer group ${m.unread ? 'bg-amber-50/50 ring-2 ring-[#ffda79]/30' : ''}`}
                    >
                        <div className="w-10 h-10 rounded-full bg-[#ffda79] border-2 border-[#1e293b] flex items-center justify-center font-black text-xs shadow-[2px_2px_0px_#1e293b] group-hover:shadow-none transition-all">
                          {m.sender?.substring(0,2).toUpperCase() || 'AD'}
                        </div>
                        <div className="flex-1 border-b border-[#1e293b]/5 pb-2">
                            <div className="flex justify-between items-center mb-0.5">
                               <span className="font-black text-[11px]">{m.sender}</span>
                               <span className="text-[8px] opacity-40">
                                 {m.timestamp ? (
                                    typeof m.timestamp === 'string' 
                                    ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                    : new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                 ) : '??:??'}
                               </span>
                            </div>
                            <p className="text-[10px] font-bold opacity-60 line-clamp-1">{m.text}</p>
                        </div>
                    </div>
                  ))}
                                   {/* Internal Chat Input (Real) */}
                  <div className="mt-4 pt-4 border-t-2 border-[#1e293b]/5">
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!userMsgInput.trim() || !activeUser) return;
                        const currentUser = allUsers.find(u => u.id === activeUser);
                        sendDirectMessage(activeUser, { 
                          sender: currentUser?.displayName || 'Student', 
                          text: userMsgInput 
                        });
                        setUserMsgInput('');
                      }}
                      className="flex gap-2"
                    >
                      <input 
                        type="text" 
                        value={userMsgInput}
                        onChange={(e) => setUserMsgInput(e.target.value)}
                        placeholder="Tanya mentor..." 
                        className="flex-1 bg-white border-2 border-[#1e293b] rounded-xl px-3 py-2 text-[10px] font-bold outline-none focus:bg-[#ffda79]/10" 
                      />
                      <button 
                        type="submit"
                        className="bg-[#1e293b] text-white p-2 rounded-xl border-2 border-[#1e293b] shadow-[2px_2px_0px_#22d3ee] active:shadow-none active:translate-y-0.5 transition-all"
                      >
                        <Send size={14} />
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
            
            {/* Footer Panel */}
            <div className="p-3 bg-gray-50 text-center border-t-2 border-[#1e293b]/5">
               <button className="text-[9px] font-black uppercase tracking-widest text-[#1e293b]/40 hover:text-[#1e293b] transition-colors">
                 Lihat Semua {activePanel === 'notifications' ? 'Notifikasi' : 'Pesan'}
               </button>
            </div>
          </div>
        )}
      </div>

      {/* Vertical Icon Bar */}
      <div className="flex flex-col gap-3 pointer-events-auto">
        {/* Notification Button */}
        <button 
          onClick={() => setActivePanel(activePanel === 'notifications' ? null : 'notifications')}
          className={`w-14 h-14 rounded-2xl border-4 flex items-center justify-center shadow-[4px_4px_0px_#1e293b] transition-all relative transform group ${
            activePanel === 'notifications' 
            ? 'bg-[#22d3ee] border-[#1e293b] scale-110 shadow-none' 
            : 'bg-white border-[#1e293b] hover:-translate-x-1'
          }`}
        >
          {unreadNotifCount > 0 && (
            <div className="absolute -top-2 -left-2 bg-[#ff4757] text-white text-[9px] font-black w-6 h-6 rounded-lg border-2 border-[#1e293b] flex items-center justify-center shadow-[2px_2px_0px_#1e293b] z-10 animate-bounce">
              {unreadNotifCount}
            </div>
          )}
          <Bell size={24} className={activePanel === 'notifications' ? 'text-white' : 'text-[#1e293b]'} strokeWidth={3} />
        </button>

        {/* Message Button */}
        <button 
          onClick={() => setActivePanel(activePanel === 'messages' ? null : 'messages')}
          className={`w-14 h-14 rounded-2xl border-4 flex items-center justify-center shadow-[4px_4px_0px_#1e293b] transition-all relative transform group ${
            activePanel === 'messages' 
            ? 'bg-[#ffda79] border-[#1e293b] scale-110 shadow-none' 
            : 'bg-white border-[#1e293b] hover:-translate-x-1'
          }`}
        >
          {unreadMsgCount > 0 && (
            <div className="absolute -top-2 -left-2 bg-[#ffda79] text-[#1e293b] text-[9px] font-black w-6 h-6 rounded-lg border-2 border-[#1e293b] flex items-center justify-center shadow-[2px_2px_0px_#1e293b] z-10 animate-pulse">
              {unreadMsgCount}
            </div>
          )}
          <MessageSquare size={24} className={activePanel === 'messages' ? 'text-[#1e293b]' : 'text-[#1e293b]'} strokeWidth={3} />
        </button>
      </div>

    </div>
  );
}
