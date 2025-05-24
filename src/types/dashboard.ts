export type Activity = {
  id: number;
  type: 'add' | 'alert' | 'device';
  message: string;
  timestamp: string;
}