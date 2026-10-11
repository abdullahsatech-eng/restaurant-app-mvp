import AsyncStorage from '@react-native-async-storage/async-storage';
// Android emulator: http://10.0.2.2:5000. Physical phone: use your laptop LAN IP.
export const BASE_URL = 'http://192.168.18.81:5000'; // Update this to the computer's current IPv4 address.
export async function apiRequest(path, options = {}) {
  const token = await AsyncStorage.getItem('authToken');
  const headers = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(options.headers || {}) };
  let response;
  try { response = await fetch(`${BASE_URL}${path}`, { ...options, headers }); }
  catch { throw new Error(`Cannot reach ${BASE_URL}. Check the server, laptop IP, firewall, and Wi-Fi.`); }
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || `Request failed (${response.status})`);
  return payload;
}
