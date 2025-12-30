export interface UserType {
  id: string;
  full_name: string;
  role: 'student' | 'guardian' | 'teacher' | 'admin';
  grade?: string;
  class?: string;
  phone?: string;
  email: string;
}

export interface Toast {
  id: string;
  msg: string;
  type: 'success' | 'error' | 'info';
}
