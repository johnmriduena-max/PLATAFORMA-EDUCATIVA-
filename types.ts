
export type Role = 'TEACHER' | 'STUDENT';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  password?: string;
  avatar?: string;
  subject?: string;
  course_id?: string; // Camel case a Snake case para Supabase
}

export type ResourceType = 'VIDEO' | 'DOCUMENT' | 'HTML_GAME';

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  url: string;
  html_content?: string; // Consistente con la DB
  teacher_id: string;
  assigned_student_ids: string[];
  created_at: string;
  expires_at?: string;
}

export interface Course {
  id: string;
  name: string;
  teacher_id: string;
}

export interface Submission {
  id: string;
  resource_id: string;
  resource_title: string;
  student_id: string;
  student_name: string;
  file_data: string;
  status: 'PENDING' | 'REVIEWED';
  timestamp: string;
}

export interface Message {
  id: string;
  from_id: string;
  to_id: string;
  content: string;
  timestamp: string;
}
