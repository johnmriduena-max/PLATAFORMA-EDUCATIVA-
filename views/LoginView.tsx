
import React, { useState } from 'react';
import { User, Role } from '../types';
import { User as UserIcon, GraduationCap, ArrowLeft, Lock, Mail, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface LoginViewProps {
  onLogin: (user: User) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (selectedRole === 'TEACHER') {
        // Docente Admin Hardcoded o tabla teachers
        if (email === 'admin@edu.ec' && password === 'admin123') {
          onLogin({
            id: 'teacher-1',
            email: 'admin@edu.ec',
            name: 'Profesor Principal',
            role: 'TEACHER',
          });
          return;
        }
        setError('Credenciales de docente incorrectas.');
      } else {
        // Consultar estudiante en Supabase
        const { data, error: sbError } = await supabase
          .from('students')
          .select('*')
          .eq('email', email)
          .eq('password', password)
          .single();
        
        if (data) {
          onLogin(data);
        } else {
          setError('Estudiante no encontrado o contraseña incorrecta.');
        }
      }
    } catch (err) {
      setError('Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  const renderRoleSelection = () => (
    <div className="space-y-6 animate-in fade-in zoom-in duration-300">
      <h2 className="text-xl font-bold text-center text-white mb-8">
        Selecciona tu perfil para ingresar
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setSelectedRole('TEACHER')}
          className="group flex flex-col items-center justify-center p-6 bg-gray-800 rounded-2xl border-2 border-transparent hover:border-lime-400 hover:shadow-xl transition-all"
        >
          <div className="w-16 h-16 bg-navy-900 rounded-full flex items-center justify-center text-lime-400 mb-4 group-hover:scale-110 transition-transform">
            <GraduationCap size={32} />
          </div>
          <span className="font-bold text-white">Docente</span>
          <span className="text-[10px] text-gray-500 text-center mt-1">Gestionar clases</span>
        </button>

        <button
          onClick={() => setSelectedRole('STUDENT')}
          className="group flex flex-col items-center justify-center p-6 bg-gray-800 rounded-2xl border-2 border-transparent hover:border-lime-400 hover:shadow-xl transition-all"
        >
          <div className="w-16 h-16 bg-lime-400 rounded-full flex items-center justify-center text-navy-900 mb-4 group-hover:scale-110 transition-transform">
            <UserIcon size={32} />
          </div>
          <span className="font-bold text-white">Estudiante</span>
          <span className="text-[10px] text-gray-500 text-center mt-1">Ver mis tareas</span>
        </button>
      </div>
    </div>
  );

  const renderLoginForm = () => (
    <div className="animate-in slide-in-from-right duration-300">
      <button 
        onClick={() => { setSelectedRole(null); setError(''); }}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-lime-400 mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> Volver
      </button>

      <div className="mb-8">
        <h2 className="text-2xl font-black text-white">
          Acceso {selectedRole === 'TEACHER' ? 'Docente' : 'Alumno'}
        </h2>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <Mail size={14} className="text-lime-400" /> Correo
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-lime-400 outline-none transition-all"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <Lock size={14} className="text-lime-400" /> Contraseña
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-lime-400 outline-none transition-all"
            required
          />
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-900/20 border border-red-500/50 text-red-400 text-xs font-bold">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-lime-400 hover:bg-lime-500 text-navy-900 font-black py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : 'Entrar a la Plataforma'}
        </button>
      </form>
    </div>
  );

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-black overflow-hidden relative">
      <div className="absolute top-0 left-0 w-64 h-64 bg-lime-400/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div className="w-full max-w-md bg-gray-900 rounded-[3rem] shadow-2xl overflow-hidden p-8 md:p-12 border-t-8 border-lime-400 z-10">
        <div className="text-center mb-10">
          <div className="inline-block w-20 h-20 bg-lime-400 rounded-3xl flex items-center justify-center text-navy-900 font-black text-4xl mb-4 shadow-2xl transform rotate-3">
            EB
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter">EDUCA-BM</h1>
          <p className="text-gray-500 mt-1 font-bold text-xs uppercase tracking-widest">Base de Datos Supabase</p>
        </div>
        {!selectedRole ? renderRoleSelection() : renderLoginForm()}
      </div>
    </div>
  );
};

export default LoginView;
