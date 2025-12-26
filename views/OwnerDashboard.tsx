
// Fix: Import useState to handle dynamic state and satisfy TypeScript type checking
import React, { useState, useMemo } from 'react';

interface OwnerDashboardProps {
  onNewProject: () => void;
}

interface ActivityRow {
  id: string;
  user: string;
  project: string;
  status: string;
  style: string;
}

interface UserRecord {
  id: string;
  email: string;
  joined: string;
  status: 'Active' | 'Suspended' | 'Banned';
}

interface AdminLog {
  id: string;
  action: string;
  admin: string;
  timestamp: string;
}

interface SessionRecord {
  id: string;
  ip: string;
  lastActivity: string;
  location: string;
}

const INITIAL_ACTIVITY: ActivityRow[] = [
  { id: '1', user: 'kevin.o@gmail.com', project: 'Dance_Challenge_01.mp4', status: 'Exported', style: 'Anime High' },
  { id: '2', user: 'sonia_m@vimeo.com', project: 'Vlog_Draft_B.mov', status: 'Rendering', style: 'Claymation' },
  { id: '3', user: 'victor.t@kenya.co', project: 'Studio_Shoot.mp4', status: 'Payment Due', style: 'Cyberpunk' },
];

const INITIAL_USERS: UserRecord[] = [
  { id: 'u1', email: 'vickthumbi47@gmail.com', joined: '2023-10-01', status: 'Active' },
  { id: 'u2', email: 'kevin.o@gmail.com', joined: '2023-11-15', status: 'Active' },
  { id: 'u3', email: 'sonia_m@vimeo.com', joined: '2023-12-05', status: 'Suspended' },
  { id: 'u4', email: 'troll@bot.net', joined: '2024-01-10', status: 'Banned' },
];

const INITIAL_SESSIONS: SessionRecord[] = [
  { id: 's1', ip: '197.248.31.22', lastActivity: '2 mins ago', location: 'Nairobi, KE' },
  { id: 's2', ip: '102.33.1.5', lastActivity: 'Just now', location: 'Mombasa, KE' },
];

const OwnerDashboard: React.FC<OwnerDashboardProps> = ({ onNewProject }) => {
  const [showSecret, setShowSecret] = useState(false);
  const [activity, setActivity] = useState<ActivityRow[]>(INITIAL_ACTIVITY);
  const [users, setUsers] = useState<UserRecord[]>(INITIAL_USERS);
  const [sessions] = useState<SessionRecord[]>(INITIAL_SESSIONS);
  const [adminLogs, setAdminLogs] = useState<AdminLog[]>([
    { id: 'l1', action: 'System Login', admin: 'Vick Thumbi', timestamp: new Date().toLocaleString() }
  ]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [userSearch, setUserSearch] = useState('');
  const [isNoticeDismissed, setIsNoticeDismissed] = useState(false);
  const [lastAckTime, setLastAckTime] = useState<string | null>(null);

  const PLATFORM_SECRET = 'PABLO-ACTOR-254-XP-PRO-X';

  const addLog = (action: string) => {
    const newLog: AdminLog = {
      id: Date.now().toString(),
      action,
      admin: 'Vick Thumbi',
      timestamp: new Date().toLocaleString()
    };
    setAdminLogs(prev => [newLog, ...prev]);
  };

  const handleDeleteActivity = (id: string) => {
    const item = activity.find(a => a.id === id);
    if (item) addLog(`Purged project log: ${item.project}`);
    setActivity(activity.filter(a => a.id !== id));
    setDeletingId(null);
  };

  const handleUserAction = (id: string, newStatus: UserRecord['status']) => {
    const user = users.find(u => u.id === id);
    if (user) addLog(`${newStatus} user: ${user.email}`);
    setUsers(users.map(u => u.id === id ? { ...u, status: newStatus } : u));
  };

  const filteredUsers = useMemo(() => 
    users.filter(u => u.email.toLowerCase().includes(userSearch.toLowerCase())),
    [users, userSearch]
  );

  const dismissNotice = () => {
    setIsNoticeDismissed(true);
    setLastAckTime(new Date().toLocaleTimeString());
    addLog('Dismissed Admin Notice');
  };

  // Fix: Use state for gpuStatus and gpuUtilization instead of constants to avoid TypeScript's exhaustive narrowing.
  // This allows the variable to be compared against all members of the union type 'Online' | 'Degraded' | 'Offline'.
  const [gpuStatus] = useState<'Online' | 'Degraded' | 'Offline'>('Degraded');
  const [gpuUtilization] = useState(88);

  return (
    <div className="flex-1 flex flex-col bg-[#0d0a11] relative">
      <header className="h-20 border-b border-amber-500/20 px-10 flex items-center justify-between bg-[#140e15]/95 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="size-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
            <span className="material-symbols-outlined text-amber-500 text-2xl filled-icon">admin_panel_settings</span>
          </div>
          <div>
            <span className="text-xl font-black tracking-tight uppercase">Master <span className="text-amber-500">Dashboard</span></span>
            <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mt-0.5">Pablo Actor 254 Command Center</p>
          </div>
        </div>
        <div className="flex items-center gap-10">
          <nav className="hidden lg:flex gap-10 text-[10px] font-black uppercase tracking-widest text-gray-500">
            <a href="#" className="text-amber-500">System State</a>
            <a href="#" className="hover:text-white transition-colors">Registry</a>
            <a href="#" className="hover:text-white transition-colors">Finance</a>
            <a href="#" className="hover:text-white transition-colors">Health</a>
          </nav>
          <div className="flex items-center gap-3 pl-10 border-l border-white/5">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold">Vick Thumbi</p>
              <p className="text-[9px] text-amber-500 font-black uppercase">Main Owner</p>
            </div>
            <div className="size-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 p-0.5 shadow-lg shadow-amber-500/20">
              <div className="w-full h-full rounded-[0.9rem] bg-black flex items-center justify-center">
                <span className="material-symbols-outlined text-amber-500 text-xl">person</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1500px] mx-auto w-full p-10 space-y-12">
        {/* Statistics Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-7 rounded-[2rem] border border-blue-500/20 bg-blue-500/5 backdrop-blur-sm relative group">
             <span className="material-symbols-outlined text-blue-400 text-3xl mb-4">groups</span>
             <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Creators</p>
             <h2 className="text-3xl font-black mt-1">1,284</h2>
          </div>
          <div className="p-7 rounded-[2rem] border border-green-500/20 bg-green-500/5 backdrop-blur-sm">
             <span className="material-symbols-outlined text-green-400 text-3xl mb-4">payments</span>
             <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Revenue</p>
             <h2 className="text-3xl font-black mt-1">KES 45,200</h2>
          </div>
          
          {/* GPU Status Card */}
          <div className={`p-7 rounded-[2rem] border backdrop-blur-sm relative overflow-hidden transition-all ${
            gpuStatus === 'Online' ? 'border-green-500/20 bg-green-500/5' :
            gpuStatus === 'Degraded' ? 'border-amber-500/40 bg-amber-500/10' :
            'border-red-500/40 bg-red-500/10'
          }`}>
             <div className="flex justify-between items-start mb-4">
               <span className={`material-symbols-outlined text-3xl ${gpuStatus === 'Online' ? 'text-green-400' : gpuStatus === 'Degraded' ? 'text-amber-500' : 'text-red-500'}`}>bolt</span>
               <div className="text-right">
                 <p className={`text-[9px] font-black uppercase tracking-widest ${gpuStatus === 'Online' ? 'text-green-400' : 'text-amber-500'}`}>{gpuStatus}</p>
                 <p className="text-[14px] font-bold">{gpuUtilization}% Load</p>
               </div>
             </div>
             <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Neural Render Nodes</p>
             <div className="h-1.5 w-full bg-white/5 rounded-full mt-4 overflow-hidden">
               <div 
                 className={`h-full transition-all duration-1000 ${gpuStatus === 'Online' ? 'bg-green-500' : 'bg-amber-500'}`} 
                 style={{ width: `${gpuUtilization}%` }}
               ></div>
             </div>
          </div>

          <div className="p-7 rounded-[2rem] border border-purple-500/20 bg-purple-500/5 backdrop-blur-sm">
             <span className="material-symbols-outlined text-purple-400 text-3xl mb-4">cloud_done</span>
             <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Platform Uptime</p>
             <h2 className="text-3xl font-black mt-1">99.9%</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
          {/* Main Workspace & Activity */}
          <div className="xl:col-span-8 space-y-10">
            {/* User Management Section */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-sm">person_search</span>
                  User Management
                </h3>
                <div className="relative">
                  <input 
                    type="text" 
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search users by email..." 
                    className="w-64 h-10 bg-black/40 border border-white/5 rounded-full px-10 text-[10px] outline-none focus:border-primary transition-all"
                  />
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-600 text-sm">search</span>
                </div>
              </div>
              <div className="bg-[#1a1421]/40 border border-white/5 rounded-[2rem] overflow-hidden">
                 <table className="w-full text-left">
                   <thead className="text-[9px] font-black text-gray-500 uppercase tracking-widest bg-white/5">
                     <tr>
                       <th className="p-5">User Email</th>
                       <th className="p-5">Joined</th>
                       <th className="p-5">Status</th>
                       <th className="p-5 text-right">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="text-xs">
                     {filteredUsers.map(u => (
                       <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                         <td className="p-5 font-bold text-gray-300">{u.email}</td>
                         <td className="p-5 text-gray-500">{u.joined}</td>
                         <td className="p-5">
                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                              u.status === 'Active' ? 'bg-green-500/10 text-green-400' : 
                              u.status === 'Suspended' ? 'bg-amber-500/10 text-amber-500' : 
                              'bg-red-500/10 text-red-500'
                            }`}>{u.status}</span>
                         </td>
                         <td className="p-5 text-right space-x-2">
                           <button onClick={() => handleUserAction(u.id, 'Suspended')} className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-black transition-all text-[9px] font-black uppercase">Suspend</button>
                           <button onClick={() => handleUserAction(u.id, 'Banned')} className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all text-[9px] font-black uppercase">Ban</button>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
              </div>
            </section>

            {/* Admin Action Logs */}
            <section className="space-y-6">
              <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-3">
                <span className="material-symbols-outlined text-amber-500 text-sm">terminal</span>
                Administrative Session Logs
              </h3>
              <div className="bg-[#0a070c] border border-white/5 rounded-[2rem] p-2 overflow-hidden h-64 overflow-y-auto custom-scrollbar">
                 <table className="w-full text-left">
                    <thead className="text-[9px] font-black text-gray-600 uppercase tracking-widest sticky top-0 bg-[#0a070c] z-10">
                      <tr>
                        <th className="p-4">Action Event</th>
                        <th className="p-4">Authority</th>
                        <th className="p-4 text-right">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="text-[10px] font-mono">
                      {adminLogs.map(log => (
                        <tr key={log.id} className="border-b border-white/5 hover:bg-white/5 transition-colors text-amber-500/80">
                          <td className="p-4"><span className="text-gray-500 mr-2">></span>{log.action}</td>
                          <td className="p-4 text-gray-400">{log.admin}</td>
                          <td className="p-4 text-right text-gray-600">{log.timestamp}</td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
              </div>
            </section>
          </div>

          {/* Right Column Controls */}
          <div className="xl:col-span-4 space-y-10">
            {/* Active Sessions */}
            <section className="space-y-6">
              <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-3">
                <span className="material-symbols-outlined text-green-500 text-sm">sensors</span>
                Live Sessions
              </h3>
              <div className="bg-gradient-to-br from-[#1a1421]/60 to-[#0d0a11]/40 border border-white/5 rounded-[2rem] p-6 space-y-4 backdrop-blur-md">
                 {sessions.map(s => (
                   <div key={s.id} className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/5">
                     <div>
                       <p className="text-xs font-bold text-gray-300">{s.ip}</p>
                       <p className="text-[9px] text-gray-500 font-medium">{s.location}</p>
                     </div>
                     <div className="text-right">
                       <p className="text-[9px] font-black text-green-500 uppercase tracking-widest">{s.lastActivity}</p>
                     </div>
                   </div>
                 ))}
              </div>
            </section>

            {/* Platform Master Controls */}
            <section className="bg-[#1a1421]/40 border border-white/5 rounded-[3rem] p-8 space-y-6 backdrop-blur-md">
               <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                 <span className="material-symbols-outlined text-amber-500">security</span>
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Master Console</h4>
               </div>

               {/* Secret Code Section */}
               <div className="p-6 rounded-3xl bg-amber-500/5 border border-amber-500/20 space-y-4">
                 <div className="flex items-center justify-between">
                   <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Security Token</h4>
                   <button onClick={() => setShowSecret(!showSecret)} className="size-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                     <span className="material-symbols-outlined text-sm text-amber-500">{showSecret ? 'visibility_off' : 'visibility'}</span>
                   </button>
                 </div>
                 <div className="bg-black/60 p-4 rounded-xl border border-white/5 flex items-center justify-center font-mono text-xs text-amber-400">
                    {showSecret ? PLATFORM_SECRET : '•••• ••••• ••• ••'}
                 </div>
               </div>

               <div className="space-y-3">
                 <button onClick={() => { addLog('Purged system temporary cache'); alert('Cache Purged'); }} className="w-full py-4 rounded-2xl bg-white/5 border border-white/5 font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                   <span className="material-symbols-outlined text-sm">restart_alt</span>
                   Purge Cache
                 </button>
               </div>
            </section>

            {/* Admin Notice Component */}
            {!isNoticeDismissed && (
              <section className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-6 relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                   <button onClick={dismissNotice} className="material-symbols-outlined text-amber-500/50 hover:text-amber-500 transition-colors">close</button>
                </div>
                <div className="flex items-start gap-4 pr-6">
                   <span className="material-symbols-outlined text-amber-500">warning</span>
                   <div className="space-y-2">
                     <h4 className="text-xs font-bold text-amber-500 uppercase tracking-widest">Maintenance Window</h4>
                     <p className="text-[10px] text-gray-400 leading-relaxed font-medium">Platform upgrade scheduled for Dec 20th. GPU nodes will experience 30% latency during migration.</p>
                     {lastAckTime && <p className="text-[8px] text-amber-500/40 font-bold uppercase tracking-widest">Ack at: {lastAckTime}</p>}
                   </div>
                </div>
              </section>
            )}
            
            {isNoticeDismissed && (
              <div className="text-center">
                <p className="text-[9px] font-black text-gray-700 uppercase tracking-widest">Notice Acknowledged at {lastAckTime}</p>
                <button onClick={() => setIsNoticeDismissed(false)} className="text-[9px] text-amber-500/30 hover:text-amber-500 mt-2 uppercase underline">Restore Alert</button>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Delete Activity Confirmation Dialog */}
      {deletingId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
          <div className="w-full max-sm bg-[#1e1427] border border-amber-500/20 rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="size-20 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mb-8 mx-auto">
              <span className="material-symbols-outlined text-4xl">admin_panel_settings</span>
            </div>
            <h3 className="text-2xl font-black text-center mb-3 tracking-tight">Master Delete?</h3>
            <p className="text-gray-400 text-sm text-center mb-10 leading-relaxed">Confirm deletion of system record. This bypasses user logs and permanently wipes metadata.</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => handleDeleteActivity(deletingId)} className="w-full h-14 rounded-2xl bg-amber-500 hover:bg-amber-600 text-black font-black text-sm">Authorize Delete</button>
              <button onClick={() => setDeletingId(null)} className="w-full h-12 rounded-2xl bg-white/5 border border-white/10 font-bold text-[10px] uppercase tracking-widest text-gray-500">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <footer className="p-10 border-t border-white/5 text-center text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">
        Secure Owner Terminal • Pablo Actor 254 Proprietary System
      </footer>
    </div>
  );
};

export default OwnerDashboard;
