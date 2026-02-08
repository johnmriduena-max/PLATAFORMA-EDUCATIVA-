
import React, { useState, useEffect } from 'react';
import { User, Resource, Submission, ResourceType, Course } from '../types';
import Layout from '../components/Layout';
import { 
  Video, FileText, Gamepad2, Plus, Trash2, Check, Send, 
  UserPlus, FileUp, Monitor, Clock, BookMarked, Users, X, Maximize2, Loader2 
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface TeacherDashboardProps {
  user: User;
  onLogout: () => void;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [students, setStudents] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [viewingResource, setViewingResource] = useState<Resource | null>(null);

  // Form states
  const [newResTitle, setNewResTitle] = useState('');
  const [newResDesc, setNewResDesc] = useState('');
  const [newResUrl, setNewResUrl] = useState('');
  const [newResHtml, setNewResHtml] = useState('');
  const [newResType, setNewResType] = useState<ResourceType>('VIDEO');
  const [durationHours, setDurationHours] = useState('24');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  const [newCourseName, setNewCourseName] = useState('');
  const [newStudName, setNewStudName] = useState('');
  const [newStudEmail, setNewStudEmail] = useState('');
  const [newStudPass, setNewStudPass] = useState('');
  const [selectedCourseForStudent, setSelectedCourseForStudent] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: resData } = await supabase.from('resources').select('*').order('created_at', { ascending: false });
      const { data: stdData } = await supabase.from('students').select('*');
      const { data: crsData } = await supabase.from('courses').select('*');
      const { data: subData } = await supabase.from('submissions').select('*');

      if (resData) setResources(resData);
      if (stdData) setStudents(stdData);
      if (crsData) setCourses(crsData);
      if (subData) setSubmissions(subData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const addResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStudentIds.length === 0) return alert("Por favor, selecciona al menos un estudiante.");

    const expiresAt = durationHours === 'INF' ? null : new Date(Date.now() + (parseInt(durationHours) * 3600000)).toISOString();

    const newRes = {
      title: newResTitle,
      description: newResDesc,
      type: newResType,
      url: newResType === 'HTML_GAME' ? null : newResUrl,
      html_content: newResType === 'HTML_GAME' ? newResHtml : null,
      teacher_id: user.id,
      assigned_student_ids: selectedStudentIds,
      expires_at: expiresAt
    };

    const { error } = await supabase.from('resources').insert([newRes]);
    if (!error) {
      alert("Recurso publicado con éxito en Supabase");
      fetchData();
      setNewResTitle(''); setNewResDesc(''); setNewResUrl(''); setNewResHtml(''); setSelectedStudentIds([]);
      setActiveTab('dashboard');
    } else {
      alert("Error: " + error.message);
    }
  };

  const deleteResource = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este recurso?')) {
      await supabase.from('resources').delete().eq('id', id);
      fetchData();
    }
  };

  const addCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('courses').insert([{ name: newCourseName, teacher_id: user.id }]);
    if (!error) {
      setNewCourseName('');
      fetchData();
    }
  };

  const addStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('students').insert([{
      name: newStudName,
      email: newStudEmail,
      password: newStudPass,
      course_id: selectedCourseForStudent || null,
      role: 'STUDENT'
    }]);
    if (!error) {
      alert("Estudiante registrado");
      fetchData();
      setNewStudName(''); setNewStudEmail(''); setNewStudPass('');
    } else {
      alert("Error: " + error.message);
    }
  };

  const renderDashboard = () => (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-900 p-6 rounded-[2rem] border border-gray-800 shadow-xl">
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Alumnos</p>
          <h3 className="text-4xl font-black mt-2 text-lime-400">{students.length}</h3>
        </div>
        <div className="bg-gray-900 p-6 rounded-[2rem] border border-gray-800 shadow-xl">
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Biblioteca</p>
          <h3 className="text-4xl font-black mt-2 text-lime-400">{resources.length}</h3>
        </div>
        <div className="bg-gray-900 p-6 rounded-[2rem] border border-gray-800 shadow-xl">
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Cursos</p>
          <h3 className="text-4xl font-black mt-2 text-lime-400">{courses.length}</h3>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
           <h3 className="text-2xl font-black text-white">Biblioteca en Supabase</h3>
           <button onClick={() => fetchData()} className="text-xs font-bold text-lime-400 hover:underline">Actualizar Datos</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.length === 0 ? (
            <div className="col-span-full py-20 bg-gray-900/50 rounded-[3rem] border-2 border-dashed border-gray-800 flex flex-col items-center">
               <BookMarked size={48} className="text-gray-700 mb-4" />
               <p className="text-gray-500 font-medium italic">Sin recursos en la base de datos.</p>
            </div>
          ) : (
            resources.map(res => (
              <div key={res.id} className="bg-gray-900 rounded-[2.5rem] border-2 border-gray-800 p-6 hover:border-lime-400 transition-all flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-2xl ${res.type === 'VIDEO' ? 'bg-red-900/20 text-red-500' : res.type === 'DOCUMENT' ? 'bg-blue-900/20 text-blue-500' : 'bg-lime-900/20 text-lime-400'}`}>
                    {res.type === 'VIDEO' ? <Video size={24} /> : res.type === 'DOCUMENT' ? <FileText size={24} /> : <Gamepad2 size={24} />}
                  </div>
                  <button onClick={() => deleteResource(res.id)} className="text-gray-600 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                </div>
                <h4 className="font-black text-white text-lg leading-tight mb-2 truncate">{res.title}</h4>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-4">{res.type}</p>
                <div className="mt-auto pt-4 border-t border-gray-800 flex flex-col gap-3">
                   <div className="flex justify-between items-center text-[10px] font-bold">
                      <span className="text-gray-500 flex items-center gap-1"><Users size={12}/> {res.assigned_student_ids?.length || 0} Alumnos</span>
                      <span className="text-lime-600 flex items-center gap-1"><Clock size={12}/> {res.expires_at ? new Date(res.expires_at).toLocaleDateString() : 'Eterno'}</span>
                   </div>
                   <button 
                     onClick={() => res.type === 'HTML_GAME' ? setViewingResource(res) : window.open(res.url)} 
                     className="w-full bg-gray-800 hover:bg-navy-900 text-white py-3 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2"
                   >
                     <Maximize2 size={16} /> Abrir Contenido
                   </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {viewingResource && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-black/95 backdrop-blur-xl animate-in zoom-in duration-300">
          <div className="bg-gray-950 w-full h-full rounded-[3rem] border border-gray-800 overflow-hidden flex flex-col">
             <div className="p-6 bg-navy-900 text-white flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-lime-400 rounded-xl text-navy-900"><Monitor size={20}/></div>
                  <h2 className="font-black text-xl">Previsualización: {viewingResource.title}</h2>
                </div>
                <button onClick={() => setViewingResource(null)} className="p-2 bg-white/10 hover:bg-red-500 rounded-full transition-all"><X size={24} /></button>
             </div>
             <div className="flex-1 bg-black">
                <iframe 
                  className="w-full h-full border-none" 
                  srcDoc={`
                    <!DOCTYPE html>
                    <html style="height: 100%; margin: 0;">
                      <body style="margin:0; padding:0; height:100vh; overflow:hidden; background:#000; display:flex; align-items:center; justify-content:center;">
                        <div style="width:100%; height:100%;">${viewingResource.html_content}</div>
                      </body>
                    </html>
                  `} 
                  title="Preview" 
                />
             </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderResourcesTab = () => (
    <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom duration-500">
      <div className="bg-gray-900 p-10 rounded-[3rem] border border-gray-800 shadow-2xl">
        <h3 className="text-3xl font-black text-lime-400 mb-8 flex items-center gap-4">
          <FileUp size={32} /> Sincronizar con Supabase
        </h3>
        <form onSubmit={addResource} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase px-2">Nombre del Recurso</label>
              <input placeholder="Ej: Introducción a la IA" value={newResTitle} onChange={e => setNewResTitle(e.target.value)} className="w-full bg-gray-800 p-4 rounded-2xl border border-gray-700 text-white outline-none focus:border-lime-400 transition-all" required />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase px-2">Tipo de Material</label>
              <select value={newResType} onChange={e => setNewResType(e.target.value as any)} className="w-full bg-gray-800 p-4 rounded-2xl border border-gray-700 text-white outline-none focus:border-lime-400 cursor-pointer">
                <option value="VIDEO">Video YouTube / Drive</option>
                <option value="DOCUMENT">Documento PDF / Enlace</option>
                <option value="HTML_GAME">Actividad Interactiva (Código/Iframe)</option>
              </select>
            </div>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-3xl border-2 border-dashed border-gray-700">
            {newResType === 'HTML_GAME' ? (
              <div className="space-y-4">
                <p className="text-xs text-lime-400 font-bold flex items-center gap-2 px-2"><Monitor size={14}/> Pega el código HTML o Iframe aquí:</p>
                <textarea 
                  value={newResHtml} 
                  onChange={e => setNewResHtml(e.target.value)} 
                  placeholder="<div...> o <iframe...>" 
                  className="w-full h-48 bg-gray-950 p-4 rounded-2xl border border-gray-800 font-mono text-xs text-lime-500 outline-none focus:border-lime-400" 
                  required 
                />
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-lime-400 font-bold flex items-center gap-2 px-2"><Send size={14}/> Enlace del Recurso:</p>
                <input 
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..." 
                  value={newResUrl} 
                  onChange={e => setNewResUrl(e.target.value)} 
                  className="w-full bg-gray-800 p-4 rounded-2xl border border-gray-700 text-white outline-none focus:border-lime-400" 
                  required 
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-3xl border border-gray-700">
              <h4 className="text-xs font-black text-gray-500 uppercase mb-4 flex items-center gap-2"><Clock size={14}/> Tiempo de disponibilidad</h4>
              <select value={durationHours} onChange={e => setDurationHours(e.target.value)} className="w-full bg-gray-900 p-3 rounded-xl border border-gray-800 text-sm text-white">
                <option value="24">24 Horas</option>
                <option value="48">48 Horas</option>
                <option value="168">1 Semana</option>
                <option value="INF">Sin límite de tiempo</option>
              </select>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-3xl border border-gray-700">
              <h4 className="text-xs font-black text-gray-500 uppercase mb-4 flex items-center gap-2"><Users size={14}/> Asignar a estudiantes</h4>
              <div className="max-h-32 overflow-y-auto grid grid-cols-1 gap-2 p-2 bg-gray-950 rounded-xl">
                {students.map(s => (
                  <label key={s.id} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
                    <input 
                      type="checkbox" 
                      checked={selectedStudentIds.includes(s.id)} 
                      onChange={e => e.target.checked ? setSelectedStudentIds([...selectedStudentIds, s.id]) : setSelectedStudentIds(selectedStudentIds.filter(id => id !== s.id))} 
                      className="w-4 h-4 rounded text-lime-400 bg-gray-800 border-gray-700 focus:ring-0 focus:ring-offset-0" 
                    />
                    <span className="text-xs text-gray-300 font-medium">{s.name}</span>
                  </label>
                ))}
                {students.length === 0 && <p className="text-[10px] text-gray-600 text-center italic">No hay estudiantes registrados.</p>}
              </div>
            </div>
          </div>

          <button type="submit" className="w-full bg-lime-400 hover:bg-lime-500 text-navy-900 font-black py-5 rounded-3xl shadow-2xl transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 text-lg">
            <Send size={24} /> Publicar en EDUCA-BM
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <Layout user={user} onLogout={onLogout} activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="flex h-96 flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-lime-400" size={64} />
            <p className="text-gray-500 font-black italic animate-pulse">Sincronizando con Supabase...</p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'resources' && renderResourcesTab()}
            {activeTab === 'students' && (
              <div className="max-w-3xl mx-auto bg-gray-900 p-10 rounded-[3rem] border border-gray-800 shadow-2xl animate-in slide-in-from-right duration-500">
                <h3 className="text-2xl font-black text-lime-400 mb-8 flex items-center gap-3"><UserPlus /> Registro de Alumnos</h3>
                <form onSubmit={addStudent} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase px-2">Nombre Completo</label>
                        <input placeholder="Nombre" value={newStudName} onChange={e => setNewStudName(e.target.value)} className="w-full bg-gray-800 p-4 rounded-2xl border border-gray-700 text-white" required />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase px-2">Email de acceso</label>
                        <input placeholder="Email" value={newStudEmail} onChange={e => setNewStudEmail(e.target.value)} className="w-full bg-gray-800 p-4 rounded-2xl border border-gray-700 text-white" required />
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase px-2">Contraseña Inicial</label>
                        <input type="password" placeholder="Min. 6 caracteres" value={newStudPass} onChange={e => setNewStudPass(e.target.value)} className="w-full bg-gray-800 p-4 rounded-2xl border border-gray-700 text-white" required />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase px-2">Curso / Asignatura</label>
                        <select value={selectedCourseForStudent} onChange={e => setSelectedCourseForStudent(e.target.value)} className="w-full bg-gray-800 p-4 rounded-2xl border border-gray-700 text-white">
                          <option value="">Seleccionar Curso...</option>
                          {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                     </div>
                  </div>
                  <button className="w-full bg-lime-400 text-navy-900 font-black py-4 rounded-2xl hover:bg-lime-500 transition-all">Registrar en Base de Datos</button>
                </form>

                <div className="mt-12 border-t border-gray-800 pt-8">
                   <h4 className="text-sm font-black text-white mb-4">Alumnos Registrados</h4>
                   <div className="space-y-3">
                      {students.map(s => (
                        <div key={s.id} className="bg-gray-800/50 p-4 rounded-2xl flex justify-between items-center border border-gray-700">
                           <div>
                              <p className="font-bold text-white">{s.name}</p>
                              <p className="text-[10px] text-gray-500">{s.email}</p>
                           </div>
                           <button onClick={async () => { if(confirm('¿Eliminar?')) { await supabase.from('students').delete().eq('id', s.id); fetchData(); } }} className="text-gray-600 hover:text-red-500 p-2"><Trash2 size={16}/></button>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            )}
            {activeTab === 'courses' && (
              <div className="max-w-xl mx-auto bg-gray-900 p-10 rounded-[3rem] border border-gray-800 shadow-2xl">
                 <h3 className="text-xl font-black text-lime-400 mb-6 flex items-center gap-2"><BookMarked /> Gestión de Cursos</h3>
                 <form onSubmit={addCourse} className="flex gap-2 mb-8">
                   <input placeholder="Nombre del curso" required value={newCourseName} onChange={e => setNewCourseName(e.target.value)} className="flex-1 bg-gray-800 p-3 rounded-xl border border-gray-700" />
                   <button className="bg-lime-400 text-navy-900 font-black px-6 rounded-xl">Crear</button>
                 </form>
                 <div className="grid grid-cols-1 gap-4">
                    {courses.map(c => (
                      <div key={c.id} className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex justify-between items-center">
                         <span className="font-bold">{c.name}</span>
                         <button onClick={async () => { if(confirm('¿Borrar?')) { await supabase.from('courses').delete().eq('id', c.id); fetchData(); } }} className="text-gray-500 hover:text-red-500"><Trash2 size={16}/></button>
                      </div>
                    ))}
                 </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default TeacherDashboard;
