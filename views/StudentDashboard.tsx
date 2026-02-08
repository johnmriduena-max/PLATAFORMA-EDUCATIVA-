
import React, { useState, useEffect } from 'react';
import { User, Resource, Submission } from '../types';
import Layout from '../components/Layout';
import { CheckCircle2, Video, FileText, Gamepad2, FileUp, Clock, X, Maximize2, BookMarked, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface StudentDashboardProps {
  user: User;
  onLogout: () => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [resources, setResources] = useState<Resource[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewingResource, setViewingResource] = useState<Resource | null>(null);

  useEffect(() => {
    fetchStudentData();
  }, [user.id]);

  const fetchStudentData = async () => {
    setLoading(true);
    // Obtener recursos donde el ID del alumno esté en el array
    const { data: resData } = await supabase
      .from('resources')
      .select('*')
      .contains('assigned_student_ids', [user.id]);
    
    if (resData) setResources(resData);
    setLoading(false);
  };

  const handleOpenResource = (res: any) => {
    if (res.type === 'HTML_GAME' && res.html_content) {
      setViewingResource(res); 
    } else {
      window.open(res.url, '_blank');
    }
  };

  const renderResources = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {resources.length === 0 ? (
        <div className="col-span-full py-40 flex flex-col items-center justify-center bg-gray-900 rounded-[3rem] border-4 border-dashed border-gray-800">
           <BookMarked size={64} className="text-gray-700 mb-4" />
           <p className="text-gray-500 font-black italic">No tienes tareas pendientes.</p>
        </div>
      ) :
        resources.map(res => (
          <div key={res.id} className="bg-gray-900 rounded-[2.5rem] border-2 border-gray-800 overflow-hidden group hover:border-lime-400 transition-all flex flex-col p-8">
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 bg-gray-800 rounded-2xl text-lime-400">
                {res.type === 'VIDEO' ? <Video size={32} /> : res.type === 'DOCUMENT' ? <FileText size={32} /> : <Gamepad2 size={32} />}
              </div>
              <span className="text-[10px] font-black px-3 py-1 bg-gray-800 text-gray-400 rounded-full">RECIBIDO</span>
            </div>
            <h3 className="text-xl font-black text-white mb-4">{res.title}</h3>
            <p className="text-xs text-gray-500 mb-8 line-clamp-3">{res.description}</p>
            
            <button onClick={() => handleOpenResource(res)} className="w-full bg-lime-400 text-navy-900 font-black py-4 rounded-2xl hover:bg-lime-500 transition-all flex items-center justify-center gap-2">
              <Maximize2 size={18} /> Iniciar Actividad
            </button>
          </div>
        ))
      }

      {viewingResource && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-gray-950 w-full h-full rounded-[3rem] border border-gray-800 overflow-hidden flex flex-col">
             <div className="p-6 bg-navy-900 text-white flex justify-between items-center">
                <h2 className="font-black text-lime-400">{viewingResource.title}</h2>
                <button onClick={() => setViewingResource(null)} className="p-2 bg-white/10 rounded-full hover:bg-red-500 transition-all"><X size={24} /></button>
             </div>
             <div className="flex-1">
                <iframe className="w-full h-full border-none" srcDoc={(viewingResource as any).html_content} title="Edu-BM App" />
             </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Layout user={user} onLogout={onLogout} activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="max-w-7xl mx-auto">
        {loading ? <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin text-lime-400" size={48} /></div> : renderResources()}
      </div>
    </Layout>
  );
};

export default StudentDashboard;
