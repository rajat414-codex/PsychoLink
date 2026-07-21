export const API_BASE = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1' || 
                        window.location.hostname.startsWith('192.168.') || 
                        window.location.hostname.startsWith('10.') || 
                        window.location.hostname.startsWith('172.')
  ? `http://${window.location.hostname}:3001`
  : 'https://psycholink-production.up.railway.app';
