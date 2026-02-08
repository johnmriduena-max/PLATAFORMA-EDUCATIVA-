
import React from 'react';
import { User } from '../types';
import { 
  LogOut, LayoutDashboard, Users, FileUp, 
  CheckSquare, MessageCircle, BookOpen, UserCircle, BookMarked
} from 'lucide-react';

interface LayoutProps {
  user: User;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ 
  user, onLogout, activeTab, setActiveTab, children 
}) => {
  const menuItems = user.role === 'TEACHER' ? [
    { id: 'dashboard', label: 'Inicio', icon: LayoutDashboard },
    { id: 'courses', label: 'Cursos', icon: BookMarked },
    { id: 'students', label: 'Estudiantes', icon: Users },
    { id: 'resources', label: 'Subir Recursos', icon: FileUp },
    { id: 'tasks', label: 'Revisión Tareas', icon: CheckSquare },
    { id: 'messages', label: 'Mensajes', icon: MessageCircle },
    { id: 'profile', label: 'Mi Perfil', icon: UserCircle },
  ] : [
    { id: 'dashboard', label: 'Mis Recursos', icon: BookOpen },
    { id: 'messages', label: 'Chat Docente', icon: MessageCircle },
    { id: 'profile', label: 'Mi Perfil', icon: UserCircle },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-black text-gray-100">
      <aside className="w-64 bg-gray-900 text-white flex flex-col transition-all duration-300">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-lime-400 rounded-lg flex items-center justify-center text-navy-900 font-bold text-xl shadow-lg shadow-lime-400/20">EB</div>
          <h1 className="text-xl font-bold tracking-tight">EDUCA-BM</h1>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === item.id ? 'bg-lime-400 text-navy-900 font-bold' : 'hover:bg-white/10 text-gray-300'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 mt-auto border-t border-white/10 space-y-2">
           <div className="flex items-center gap-3 px-4 py-2 mb-2">
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center border-2 border-lime-400 overflow-hidden">
              {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user.name.charAt(0)}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold truncate">{user.name}</p>
              <p className="text-[10px] text-gray-400">{user.role}</p>
            </div>
          </div>
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-500/20 text-red-400 rounded-lg text-sm">
            <LogOut size={18} /> Salir
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-8 bg-black">
        {children}
      </main>
    </div>
  );
};

export default Layout;
