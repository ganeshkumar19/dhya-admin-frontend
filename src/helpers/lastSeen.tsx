export const LAST_SEEN_KEY = 'lastSeenNotifications';
export const getLastSeen = () => new Date(localStorage.getItem(LAST_SEEN_KEY) || 0);
export const setLastSeen = () => localStorage.setItem(LAST_SEEN_KEY, new Date().toISOString());