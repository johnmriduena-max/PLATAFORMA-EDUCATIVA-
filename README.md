
# 🚀 EDUCA-BM: Plataforma Educativa Inteligente

**EDUCA-BM** es una plataforma educativa de alto rendimiento diseñada para facilitar la interacción entre docentes y estudiantes. Utiliza un stack moderno con **React** para la interfaz, **Tailwind CSS** para un diseño oscuro (Dark Mode) inmersivo y **Supabase** como backend en la nube para persistencia de datos en tiempo real.

## ✨ Características Principales

- **🛡️ Panel de Docente**:
  - Registro y gestión de estudiantes.
  - Creación de cursos y asignaturas.
  - Biblioteca multimedia (Video, Documentos, Juegos Interactivos).
  - Sincronización instantánea con la base de datos.
- **🎓 Panel de Estudiante**:
  - Visualización de recursos asignados de forma personalizada.
  - Reproductor de contenido interactivo integrado.
  - Seguimiento de tareas y estados de revisión.
- **🌙 Diseño Dark Mode**: Interfaz optimizada para reducir la fatiga visual, con estética minimalista y profesional.
- **☁️ Backend Serverless**: Integración nativa con Supabase para manejo de datos y autenticación.

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 19 (ESM)
- **Estilos**: Tailwind CSS
- **Iconos**: Lucide React
- **Base de Datos**: Supabase (PostgreSQL)
- **Gestión de Estado**: React Hooks

## 🚀 Configuración de la Base de Datos (Supabase)

Para que el proyecto funcione, debes ejecutar el siguiente script SQL en el **SQL Editor** de tu proyecto en Supabase:

```sql
-- Tabla de Cursos
CREATE TABLE courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  teacher_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Estudiantes
CREATE TABLE students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  role TEXT DEFAULT 'STUDENT',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Recursos
CREATE TABLE resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL, 
  url TEXT,
  html_content TEXT,
  teacher_id TEXT NOT NULL,
  assigned_student_ids UUID[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Tabla de Entregas
CREATE TABLE submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  student_name TEXT,
  resource_title TEXT,
  file_data TEXT, 
  status TEXT DEFAULT 'PENDING',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Políticas RLS (Configuración para desarrollo)
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for demo" ON courses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for demo" ON students FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for demo" ON resources FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for demo" ON submissions FOR ALL USING (true) WITH CHECK (true);
```

## 📦 Instalación Local

1. Clona el repositorio:
   ```bash
   git clone https://github.com/johnmriduena-max/PLATAFORMA-EDUCA-.git
   ```
2. Instala las dependencias (si aplica):
   ```bash
   npm install
   ```
3. Configura tus credenciales en `lib/supabase.ts`.
4. Lanza el proyecto:
   ```bash
   npm start
   ```

---
Desarrollado con ❤️ para la comunidad educativa.
