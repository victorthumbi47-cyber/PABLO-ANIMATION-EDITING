
import React, { useState } from 'react';
import { MOCK_PROJECTS as INITIAL_PROJECTS } from '../constants';
import { Project, User } from '../types';

interface DashboardProps {
  user: User | null;
  onNewProject: () => void;
  onSelectProject: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onNewProject, onSelectProject }) => {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
    setDeletingId(null);
  };

  return (
    <div className="flex-1 flex flex-col relative">
      <header className="h-16 border-b border-white/5 px-8 flex items-center justify-between bg-[#141118]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-3xl">animation</span>
          <span className="text-lg font-bold">Animify Studio</span>
        </div>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
            <a href="#" className="text-white">Projects</a>
            <a href="#" className="hover:text-white transition-colors">Templates</a>
          </nav>
          <div className="flex items-center gap-3">
            {user?.isPremium && (
              <span className="bg-yellow-500/10 text-yellow-500 text-[10px] font-bold px-2 py-1 rounded border border-yellow-500/20 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm filled-icon">diamond</span>
                PREMIUM
              </span>
            )}
            <div className="size-9 rounded-full bg-cover bg-center border border-white/10" style={{backgroundImage: `url('https://picsum.photos/100/100')`}}></div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black tracking-tight">My Projects</h1>
            <p className="text-gray-400 mt-1">Manage your video-to-cartoon transformations.</p>
          </div>
          <button onClick={onNewProject} className="h-11 px-6 rounded-xl bg-primary hover:bg-[#7a25d0] font-bold flex items-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95">
            <span className="material-symbols-outlined">add</span>
            New Project
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div onClick={onNewProject} className="aspect-video rounded-2xl border-2 border-dashed border-white/10 hover:border-primary/50 hover:bg-white/5 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all">
            <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">add</span>
            </div>
            <span className="font-bold text-sm text-gray-400">Create New Project</span>
          </div>

          {projects.map((project) => (
            <div key={project.id} className="group bg-[#2a2433] rounded-2xl overflow-hidden border border-white/5 hover:border-primary/50 transition-all cursor-pointer relative">
              <div onClick={() => onSelectProject(project.id)} className="aspect-video relative overflow-hidden">
                <img src={project.thumbnail} alt={project.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100" />
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-[10px] font-bold px-1.5 py-0.5 rounded">{project.duration}</div>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="size-12 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-lg">
                    <span className="material-symbols-outlined text-3xl filled-icon">play_arrow</span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={(e) => { e.stopPropagation(); setDeletingId(project.id); }}
                className="absolute top-2 left-2 size-8 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20"
              >
                <span className="material-symbols-outlined text-sm">delete</span>
              </button>

              <div className="p-4" onClick={() => onSelectProject(project.id)}>
                <h3 className="font-bold truncate mb-1">{project.name}</h3>
                <p className="text-[10px] text-gray-500 mb-3">Edited {project.date}</p>
                <div className="flex gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    project.status === 'Rendered' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                    project.status === 'Processing' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 animate-pulse' :
                    'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                  }`}>
                    {project.status}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-white/5 text-gray-400">
                    {project.style}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      
      {deletingId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-[#1e1427] border border-white/10 rounded-[2rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="size-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-6 mx-auto">
              <span className="material-symbols-outlined text-3xl">warning</span>
            </div>
            <h3 className="text-xl font-bold text-center mb-2">Delete Project?</h3>
            <p className="text-gray-400 text-sm text-center mb-8">This action is permanent and your rendered assets will be removed from the cloud storage.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeletingId(null)} className="flex-1 h-12 rounded-xl bg-white/5 border border-white/10 font-bold text-sm hover:bg-white/10 transition-all">Cancel</button>
              <button onClick={() => handleDelete(deletingId)} className="flex-1 h-12 rounded-xl bg-red-500 hover:bg-red-600 font-bold text-sm shadow-lg shadow-red-500/20 transition-all">Delete</button>
            </div>
          </div>
        </div>
      )}

      <footer className="p-8 border-t border-white/5 text-center text-xs text-gray-600">
        © 2024 PABLO ACTOR 254 FILM APPS. All rights reserved.
      </footer>
    </div>
  );
};

export default Dashboard;
