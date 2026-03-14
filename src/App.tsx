/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth } from './firebase';
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { LogIn } from 'lucide-react';
import Dashboard from './components/Dashboard';
import BottomNav from './components/BottomNav';
import TopNav from './components/TopNav';
import Schedule from './components/Schedule';
import Tasks from './components/Tasks';
import Monitor from './components/Monitor';
import Profile from './components/Profile';
import Settings from './components/Settings';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsAuthReady(true);
    });
    return unsubscribe;
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  if (!isAuthReady) return <div>Loading...</div>;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#e0e5ec]">
        <button
          onClick={handleLogin}
          className="flex items-center gap-2 bg-[#ff4757] text-white p-4 rounded-xl shadow-[8px_8px_16px_#babecc,-8px_-8px_16px_#ffffff] hover:scale-105 transition-transform"
        >
          <LogIn size={20} />
          Login with Google
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#2d3436] font-sans p-4 px-2 md:px-6">
      <div className="w-full">
        <TopNav user={user} />

        <main className="pb-24">
        {activePage === 'dashboard' && <Dashboard user={user} />}
        {activePage === 'admin' && <div>Admin Content</div>}
        {activePage === 'schedule' && <Schedule />}
        {activePage === 'tasks' && <Tasks />}
        {activePage === 'monitor' && <Monitor />}
        {activePage === 'profile' && <Profile />}
        {activePage === 'settings' && <Settings />}
      </main>

      <BottomNav activePage={activePage} setActivePage={setActivePage} />
      </div>
    </div>
  );
}
