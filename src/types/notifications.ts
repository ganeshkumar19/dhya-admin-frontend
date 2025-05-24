export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Notification {
  id: number;
  userId: string;
  type: string;
  farmId: string | null;
  pondId: string | null;
  notifyType: string;
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'info' | 'warning';
  expiresAt: string;
  createdAt: string;
  user: User;
}
