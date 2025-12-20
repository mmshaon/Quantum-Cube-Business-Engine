
import React, { useState } from 'react';
import { Upload, Clock, RotateCcw, FileImage, CheckCircle, History, MoreVertical } from 'lucide-react';
import { DesignProject, DesignVersion } from '../types';

// Mock initial data
const INITIAL_PROJECTS: DesignProject[] = [
  {
    id: 'dp-1',
    name: 'Neon Dashboard V2',
    description: 'Main layout update for Q4',
    currentVersion: 2,
    lastModified: Date.now(),
    versions: [
      {
        id: 'v2',
        versionNumber: 2,
        uploadedBy: 'Alpha User',
        timestamp: Date.now() - 3600000,
        fileUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
        thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=200',
        changesDescription: 'Updated color palette to Green/Pink accent',
        isActive: true
      },
      {
        id: 'v1',
        versionNumber: 1,
        uploadedBy: 'Alpha User',
        timestamp: Date.now() - 86400000,
        fileUrl: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&q=80&w=800',
        thumbnailUrl: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&q=80&w=200',
        changesDescription: 'Initial wireframe upload',
        isActive: false
      }
    ]
  },
  {
    id: 'dp-2',
    name: 'Mobile App Assets',
    description: 'Icons and splash screens',
    currentVersion: 1,
    lastModified: Date.now() - 172800000,
    versions: [
      {
        id: 'v1',
        versionNumber: 1,
        uploadedBy: 'Designer X',
        timestamp: Date.now() - 172800000,
        fileUrl: 'https://images.unsplash.com/photo-1626785774573-4b7993143a4d?auto=format&fit=crop&q=80&w=800',
        thumbnailUrl: 'https://images.unsplash.com/photo-1626785774573-4b7993143a4d?auto=format&fit=crop&q=80&w=200',
        changesDescription: 'Base set of icons',
        isActive: true
      }
    ]
  }
];

export const DesignVersionControl = () => {
  const [projects, setProjects] = useState<DesignProject[]>(INITIAL_PROJECTS);
  const [selectedProject, setSelectedProject] = useState<DesignProject | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Simulate upload
  const handleFileUpload = (projectId: string, file: File) => {
    setIsUploading(true);
    setTimeout(() => {
      setProjects(prev => prev.map(p => {
        if (p.id === projectId) {
          const newVersionNum = p.versions.length + 1;
          const newVersion: DesignVersion = {
            id: `v${newVersionNum}-${Date.now()}`,
            versionNumber: newVersionNum,
            uploadedBy: 'Alpha User', // In real app, use auth.currentUser.displayName
            timestamp: Date.now(),
            fileUrl: URL.createObjectURL(file), // Local preview for demo
            thumbnailUrl: URL.createObjectURL(file),
            changesDescription: `Update via upload: ${file.name}`,
            isActive: true
          };
          
          // Mark old versions inactive
          const updatedVersions = p.versions.map(v => ({ ...v, isActive: false }));
          
          return {
            ...p,
            currentVersion: newVersionNum,
            versions: [newVersion, ...updatedVersions], // Newest first
            lastModified: Date.now()
          };
        }
        return p;
      }));
      
      // Update selected project view
      if (selectedProject && selectedProject.id === projectId) {
        const project = projects.find(p => p.id === projectId);
        // We need to re-fetch because state update is async/batched, 
        // but for this simple mock, we can just force reload by closing/reopening or assuming success
      }
      setIsUploading(false);
    }, 1500);
  };

  const handleRevert = (projectId: string, versionId: string) => {
    if (!window.confirm("Are you sure you want to revert to this version? This will create a new rollback entry.")) return;

    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const targetVersion = p.versions.find(v => v.id === versionId);
        if (!targetVersion) return p;

        const newVersionNum = p.versions.length + 1;
        const newVersion: DesignVersion = {
          ...targetVersion,
          id: `v${newVersionNum}-rollback`,
          versionNumber: newVersionNum,
          timestamp: Date.now(),
          changesDescription: `Rollback to V${targetVersion.versionNumber}`,
          isActive: true
        };

        const updatedVersions = p.versions.map(v => ({ ...v, isActive: false }));

        return {
          ...p,
          currentVersion: newVersionNum,
          versions: [newVersion, ...updatedVersions],
          lastModified: Date.now()
        };
      }
      return p;
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Design Version Control</h2>
          <p className="text-slate-400">Manage asset revisions and history</p>
        </div>
        {selectedProject && (
           <button onClick={() => setSelectedProject(null)} className="text-sm text-qg-accent hover:underline">
             Back to Projects
           </button>
        )}
      </div>

      {!selectedProject ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div 
              key={project.id} 
              onClick={() => setSelectedProject(project)}
              className="glass-panel p-5 rounded-2xl hover:bg-white/5 cursor-pointer transition-all group border border-white/5 hover:border-qg-accent/30"
            >
              <div className="h-40 rounded-xl bg-black/40 mb-4 overflow-hidden relative">
                <img 
                  src={project.versions[0].fileUrl} 
                  alt={project.name} 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" 
                />
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-xs text-white border border-white/10">
                  V{project.currentVersion}
                </div>
              </div>
              <h3 className="font-semibold text-white text-lg">{project.name}</h3>
              <p className="text-slate-400 text-sm mb-3 line-clamp-1">{project.description}</p>
              <div className="flex justify-between items-center text-xs text-slate-500">
                <span className="flex items-center gap-1"><History size={12} /> {new Date(project.lastModified).toLocaleDateString()}</span>
                <span>{project.versions.length} versions</span>
              </div>
            </div>
          ))}
          
          {/* New Project Placeholder */}
          <div className="glass-panel p-5 rounded-2xl border border-dashed border-white/20 flex flex-col items-center justify-center h-[280px] text-slate-500 hover:text-qg-accent hover:border-qg-accent/50 cursor-pointer transition-all">
             <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
               <Upload size={24} />
             </div>
             <p>Create New Project</p>
          </div>
        </div>
      ) : (
        // Project Detail View
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Preview */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel p-1 rounded-2xl overflow-hidden relative group">
               <img src={selectedProject.versions[0].fileUrl} alt="Current" className="w-full h-auto rounded-xl" />
               <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-end">
                  <div>
                    <h3 className="text-white font-bold text-xl">Current Version (V{selectedProject.currentVersion})</h3>
                    <p className="text-slate-300 text-sm">{selectedProject.versions[0].changesDescription}</p>
                  </div>
                  <button className="px-4 py-2 bg-white/10 backdrop-blur hover:bg-white/20 rounded-lg text-white text-sm border border-white/10">
                    Download
                  </button>
               </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                 <Upload size={20} className="text-qg-accent" /> Upload New Version
              </h3>
              <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-qg-accent/30 transition-colors bg-black/20">
                 <input 
                   type="file" 
                   id="file-upload" 
                   className="hidden" 
                   onChange={(e) => e.target.files && handleFileUpload(selectedProject.id, e.target.files[0])}
                 />
                 <label htmlFor="file-upload" className="cursor-pointer">
                    {isUploading ? (
                       <div className="flex flex-col items-center">
                          <div className="w-8 h-8 border-2 border-qg-accent border-t-transparent rounded-full animate-spin mb-2"></div>
                          <span className="text-slate-400">Processing...</span>
                       </div>
                    ) : (
                       <div className="flex flex-col items-center gap-2">
                          <FileImage size={32} className="text-slate-500" />
                          <span className="text-slate-300">Click to upload or drag and drop</span>
                          <span className="text-xs text-slate-500">Supports PNG, JPG, Figma exports</span>
                       </div>
                    )}
                 </label>
              </div>
            </div>
          </div>

          {/* Version History Sidebar */}
          <div className="glass-panel p-6 rounded-2xl h-fit max-h-[800px] overflow-y-auto">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <History size={20} className="text-qg-pink" /> Version History
            </h3>
            
            <div className="relative pl-4 border-l border-white/10 space-y-8">
               {selectedProject.versions.map((version, index) => (
                 <div key={version.id} className="relative">
                    <div className={`absolute -left-[21px] top-0 w-3 h-3 rounded-full border-2 ${version.isActive ? 'bg-qg-accent border-qg-accent shadow-[0_0_10px_#00FFA3]' : 'bg-black border-slate-600'}`}></div>
                    
                    <div className={`p-4 rounded-xl border transition-all ${version.isActive ? 'bg-white/10 border-qg-accent/30' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
                       <div className="flex justify-between items-start mb-2">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded ${version.isActive ? 'bg-qg-accent text-black' : 'bg-slate-700 text-slate-300'}`}>
                            V{version.versionNumber}
                          </span>
                          <span className="text-xs text-slate-500">{new Date(version.timestamp).toLocaleDateString()}</span>
                       </div>
                       <p className="text-sm text-slate-300 mb-3">{version.changesDescription}</p>
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                             <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-[8px] text-white">
                                {version.uploadedBy.charAt(0)}
                             </div>
                             {version.uploadedBy}
                          </div>
                          
                          {!version.isActive && (
                            <button 
                              onClick={() => handleRevert(selectedProject.id, version.id)}
                              className="text-xs flex items-center gap-1 text-qg-pink hover:underline"
                            >
                              <RotateCcw size={12} /> Revert
                            </button>
                          )}
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
