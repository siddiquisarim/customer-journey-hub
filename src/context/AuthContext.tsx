import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Customer } from '@/types';
import { mockCustomers } from '@/data/mockData';

interface AuthContextType {
  customer: Customer | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(() => {
    const stored = localStorage.getItem('customer');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Mock validation - in production, this would be a real API call
    const foundCustomer = mockCustomers.find(c => c.email.toLowerCase() === email.toLowerCase());
    
    if (!foundCustomer) {
      return { success: false, error: 'Invalid email or password' };
    }

    // For demo, accept any password
    if (password.length < 4) {
      return { success: false, error: 'Invalid email or password' };
    }

    setCustomer(foundCustomer);
    localStorage.setItem('customer', JSON.stringify(foundCustomer));
    return { success: true };
  };

  const logout = () => {
    setCustomer(null);
    localStorage.removeItem('customer');
    localStorage.removeItem('cart');
  };

  return (
    <AuthContext.Provider value={{ 
      customer, 
      login, 
      logout, 
      isAuthenticated: !!customer 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
