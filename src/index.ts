import fetch from 'node-fetch';
import * as fs from'fs';

const SESSION_FILE = './session.json';
const OUTPUT_FILE = './users.json';
const BASE_URL = 'https://challenge.sunvoy.com';

function getSession(): string | null {
    if (!fs.existsSync(SESSION_FILE)) {
      console.warn(' session.json not found. Skipping authenticated requests.');
      return null;
    }
  
    const session = JSON.parse(fs.readFileSync(SESSION_FILE, 'utf-8'));
    return session.JSESSIONID || null;
  }
  
  async function fetchUsers(cookie: string): Promise<any|null> {
    const res = await fetch(`${BASE_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Cookie': `JSESSIONID=${cookie}`,
        'Content-Type': 'application/json'
      },
      body: '{}' 
    });
  
    if (!res.ok) throw new Error(`User fetch failed with status: ${res.status}`);
    return await res.json();
  }
  
  async function fetchCurrentUser(cookie: string): Promise<any|null> {
    try {
      const res = await fetch(`${BASE_URL}/api/settings`, {
        method: 'POST',
        headers: {
          'Cookie': `JSESSIONID=${cookie}`,
          'Content-Type': 'application/json'
        },
        body: '{}' 
      });
  
      if (!res.ok) throw new Error(`Current user fetch failed with status: ${res.status}`);
      return await res.json();
    } catch {
      return null;
    }
  }
  
  function saveOutput(users: any[] = [], currentUser: any = null) {
    const result = currentUser ? { users, currentUser } : { users };
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2));
    console.log('users.json written successfully.');
  }
  
  (async () => {
    const cookie = getSession();
    if (!cookie) {
      console.warn('No valid session. Skipping user fetch. Create session.json and retry.');
      saveOutput([], null); 
      return;
    }
  
    try {
      const users = await fetchUsers(cookie);
      const currentUser = await fetchCurrentUser(cookie);
      saveOutput(users, currentUser);
    } catch (err: any) {
      console.error('Failed during script execution:', err.message);
    }
  })();
  