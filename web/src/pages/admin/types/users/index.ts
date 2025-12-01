export interface User {
  id: string;
  create_time?: number;
  create_date?: string;
  update_time?: number;
  update_date?: string;
  access_token?: string;
  nickname: string;
  password?: string;
  email: string;
  avatar?: string;
  language?: string;
  color_schema?: string;
  timezone?: string;
  last_login_time?: string;
  is_authenticated: string; // '1' | '0'
  is_active: string; // '1' | '0'
  is_anonymous: string; // '1' | '0'
  login_channel?: string;
  status?: string; // '1' | '0'
  is_superuser: boolean;

  // UI Display Helper (Optional/Joined)
  role?: string;
  department?: string;
}

export interface UserSession {
  id: string;
  user: string;
  ip: string;
  device: string;
  loginTime: string;
  lastActive: string;
}

export interface Session {
  id: string;
  user: string;
  ip: string;
  device: string;
  time: string;
}
