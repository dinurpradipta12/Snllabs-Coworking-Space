import { Settings as SettingsIcon, Bell, Lock, Shield, Moon, MonitorSmartphone, LogOut, Download, Globe } from 'lucide-react';

export default function Settings() {
  return (
    <div className="space-y-6 pb-24">
      {/* Header Container */}
      <div className="bg-[#fffdf5] p-6 lg:p-8 rounded-2xl border-4 border-black shadow-[6px_6px_0px_#22d3ee] relative overflow-hidden">
        {/* Background decorative grid */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '20px 20px' }}></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-black text-3xl md:text-4xl uppercase italic flex items-center gap-3 mb-2 drop-shadow-[2px_2px_0px_#fff]">
              <SettingsIcon size={36} className="text-[#ff4757]" /> Sistem Akun
            </h2>
            <p className="font-bold text-sm text-black/70 bg-white inline-block px-2 py-1 border-2 border-black rounded-lg">Sesuaikan preferensi belajar & konfigurasi interface LMS Anda.</p>
          </div>
          
          <div className="text-right">
            <span className="bg-black text-[#22d3ee] px-4 py-2 flex items-center gap-2 rounded-xl border-2 border-black font-black text-xs shadow-[4px_4px_0px_#22d3ee] uppercase">
              App Version: 2.4.0 <MonitorSmartphone size={16} />
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Kolom 1 */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border-4 border-black shadow-[6px_6px_0px_#000000] overflow-hidden">
            <div className="bg-[#22d3ee] text-black font-black text-lg uppercase p-4 border-b-4 border-black flex items-center gap-2">
              <Bell size={24} /> Preferensi Notifikasi
            </div>
            
            <div className="p-5 border-b-2 border-dashed border-black hover:bg-[#ffda79] transition-colors cursor-pointer group flex items-center justify-between">
              <div>
                 <span className="font-black text-sm uppercase block mb-1">Pengingat Tugas & Modul</span>
                 <p className="text-[10px] font-bold text-black/50 leading-tight">Dapatkan push notification jika deadline &lt; 24 jam</p>
              </div>
              <div className="w-12 h-6 bg-[#22d3ee] rounded-full border-2 border-black flex items-center p-1 cursor-pointer transition-colors shadow-[2px_2px_0px_#000000] group-hover:-translate-y-0.5">
                 <div className="w-4 h-4 bg-white rounded-full border-2 border-black transform translate-x-5"></div>
              </div>
            </div>

            <div className="p-5 hover:bg-[#ffda79] transition-colors cursor-pointer group flex items-center justify-between">
              <div>
                 <span className="font-black text-sm uppercase block mb-1">Pesan dari Mentor</span>
                 <p className="text-[10px] font-bold text-black/50 leading-tight">Email & notifikasi in-app untuk evaluasi baru</p>
              </div>
              <div className="w-12 h-6 bg-[#22d3ee] rounded-full border-2 border-black flex items-center p-1 cursor-pointer transition-colors shadow-[2px_2px_0px_#000000] group-hover:-translate-y-0.5">
                 <div className="w-4 h-4 bg-white rounded-full border-2 border-black transform translate-x-5"></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border-4 border-black shadow-[6px_6px_0px_#000000] overflow-hidden">
            <div className="bg-[#ffda79] text-black font-black text-lg uppercase p-4 border-b-4 border-black flex items-center gap-2">
              <MonitorSmartphone size={24} /> Antarmuka (UI)
            </div>
            
            <div className="p-5 border-b-2 border-dashed border-black hover:bg-black hover:text-white transition-colors cursor-pointer group flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <Moon size={24} className="group-hover:text-[#ffda79]" /> 
                 <div>
                   <span className="font-black text-sm uppercase block mb-1">Mode Gelap (Dark Mode)</span>
                   <p className="text-[10px] font-bold opacity-60">Ubah background menjadi warna gelap pekat</p>
                 </div>
              </div>
              <div className="w-12 h-6 bg-gray-300 rounded-full border-2 border-black flex items-center p-1 cursor-pointer shadow-[2px_2px_0px_#000000] group-hover:bg-black group-hover:border-white">
                 <div className="w-4 h-4 bg-white rounded-full border-2 border-black transform translate-x-0"></div>
              </div>
            </div>
            
            <div className="p-5 hover:bg-[#fffdf5] transition-colors cursor-pointer group flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <Globe size={24} className="text-[#22d3ee]" /> 
                 <div>
                   <span className="font-black text-sm uppercase block mb-1">Bahasa Aplikasi</span>
                   <p className="text-[10px] font-bold opacity-60">Bahasa form dan notifikasi sistem</p>
                 </div>
              </div>
              <span className="bg-black text-white px-3 py-1 text-xs font-black border-2 border-black rounded-xl">INDONESIA</span>
            </div>
          </div>
        </div>
        
        {/* Kolom 2 */}
        <div className="space-y-6">
          <div className="bg-black text-white rounded-2xl border-4 border-black shadow-[6px_6px_0px_#ff4757] overflow-hidden">
            <div className="bg-[#ff4757] text-white font-black text-lg uppercase p-4 border-b-4 border-black flex items-center gap-2">
              <Shield size={24} /> Keamanan & Akses
            </div>
            
            <div className="p-5 border-b-2 border-dashed border-white/20 hover:bg-[#ff4757] transition-colors cursor-pointer group flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="bg-white text-black p-2 rounded-lg border-2 border-black group-hover:rotate-12 transition-transform"><Lock size={20} /></div> 
                 <div>
                   <span className="font-black text-sm uppercase block mb-1">Ubah Kata Sandi</span>
                   <p className="text-[10px] font-bold opacity-80">Terakhir diubah 3 bulan yang lalu</p>
                 </div>
              </div>
            </div>

            <div className="p-5 border-b-2 border-dashed border-white/20 hover:bg-[#ff4757] transition-colors cursor-pointer group flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="bg-white text-black p-2 rounded-lg border-2 border-black group-hover:-rotate-12 transition-transform"><Shield size={20} /></div> 
                 <div>
                   <span className="font-black text-sm uppercase block mb-1">Autentikasi 2 Langkah</span>
                   <p className="text-[10px] font-bold opacity-80">SMS PIN & Authenticator App</p>
                 </div>
              </div>
              <div className="bg-[#22d3ee] px-2 py-0.5 rounded text-[10px] font-black uppercase text-black border border-black transform group-hover:scale-110 transition-transform">AKTIF</div>
            </div>
            
            <div className="p-5 hover:bg-white/10 transition-colors cursor-pointer group flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="bg-[#ffda79] text-black p-2 rounded-lg border-2 border-black group-hover:-translate-y-1 transition-transform"><Download size={20} /></div> 
                 <div>
                   <span className="font-black text-sm uppercase block mb-1">Unduh Data Personal</span>
                   <p className="text-[10px] font-bold opacity-80">Export seluruh CV, Tugas & Sertifikat Mentoring</p>
                 </div>
              </div>
            </div>
          </div>
          
          <button className="w-full bg-[#ff4757] text-white p-6 rounded-2xl border-4 border-black shadow-[6px_6px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex flex-col items-center justify-center gap-2 group">
             <div className="bg-black p-3 rounded-full border-2 border-black group-hover:-translate-y-2 transition-transform group-hover:bg-white group-hover:text-black">
               <LogOut size={24} />
             </div>
             <span className="font-black text-2xl uppercase italic drop-shadow-[2px_2px_0px_#000000] group-hover:drop-shadow-[2px_2px_0px_#000000]">Logout Sesi</span>
             <span className="text-[10px] font-bold">Pastikan seluruh tugas telah disimpan.</span>
          </button>
        </div>

      </div>
    </div>
  );
}
