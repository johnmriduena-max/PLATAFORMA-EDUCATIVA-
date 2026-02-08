
import React, { useState, useEffect } from 'react';
import { User } from './types';
import LoginView from './views/LoginView';
import TeacherDashboard from './views/TeacherDashboard';
import StudentDashboard from './views/StudentDashboard';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  // Forzamos el modo oscuro al iniciar la aplicación
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-gray-100 transition-colors duration-300">
      {!user ? (
        <LoginView onLogin={handleLogin} />
      ) : user.role === 'TEACHER' ? (
        <TeacherDashboard 
          user={user} 
          onLogout={handleLogout} 
        />
      ) : (
        <StudentDashboard 
          user={user} 
          onLogout={handleLogout} 
        />
      )}
    </div>
  );
};

export default App;
