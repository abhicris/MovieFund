// Client-side authentication utilities
'use client';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'investor' | 'producer' | 'admin';
  accountStatus: 'pending' | 'verified' | 'rejected' | 'suspended';
}

export interface AuthResponse {
  user: User;
  sessionToken: string;
  expiresAt: string;
}

// Store session token in localStorage
export function setSessionToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('sessionToken', token);
  }
}

export function getSessionToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('sessionToken');
  }
  return null;
}

export function removeSessionToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('sessionToken');
  }
}

// Login function
export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Login failed');
  }

  setSessionToken(data.data.sessionToken);
  return data.data;
}

// Register function
export async function register(userData: {
  email: string;
  password: string;
  name: string;
  role: 'investor' | 'producer';
  phone?: string;
  productionCompany?: string;
  companyRegistration?: string;
  taxId?: string;
}): Promise<{ user: User }> {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Registration failed');
  }

  return data;
}

// Logout function
export async function logout(): Promise<void> {
  const token = getSessionToken();
  if (token) {
    await fetch('/api/auth/session', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }
  removeSessionToken();
}

// Get current user
export async function getCurrentUser(): Promise<User | null> {
  const token = getSessionToken();
  if (!token) {
    return null;
  }

  try {
    const response = await fetch('/api/auth/session', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      removeSessionToken();
      return null;
    }

    return data.data;
  } catch (error) {
    removeSessionToken();
    return null;
  }
}

// Make authenticated API requests
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getSessionToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(url, {
    ...options,
    headers,
  });
}
