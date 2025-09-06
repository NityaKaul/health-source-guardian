import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import AuthView from "@/components/auth/AuthView";
import HealthDashboard from "@/components/dashboard/HealthDashboard";
import { getAuthToken, removeAuthToken } from "@/lib/api";

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing auth token on app load
    const existingToken = getAuthToken();
    const userData = localStorage.getItem('userData');
    
    if (existingToken && userData) {
      setToken(existingToken);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogin = (userData: any, authToken: string) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('userData', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    removeAuthToken();
    localStorage.removeItem('userData');
  };

  return (
    <main className="min-h-screen">
      {user && token ? (
        <HealthDashboard 
          user={user} 
          onLogout={handleLogout}
        />
      ) : (
        <AuthView onLogin={handleLogin} />
      )}
      <Toaster />
    </main>
  );
};

export default Index;