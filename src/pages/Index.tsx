import { useState, useEffect } from "react";
import AuthView from "@/components/auth/AuthView";
import HealthDashboard from "@/components/dashboard/HealthDashboard";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing auth token
    const token = localStorage.getItem('ashaPlatformToken');
    const user = localStorage.getItem('ashaPlatformUser');
    
    if (token && user) {
      setCurrentUser(JSON.parse(user));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData: any, token: string) => {
    localStorage.setItem('ashaPlatformToken', token);
    localStorage.setItem('ashaPlatformUser', JSON.stringify(userData));
    setCurrentUser(userData);
    setIsAuthenticated(true);
    toast({
      title: "Login Successful",
      description: `Welcome back, ${userData.name}!`,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('ashaPlatformToken');
    localStorage.removeItem('ashaPlatformUser');
    setCurrentUser(null);
    setIsAuthenticated(false);
    toast({
      title: "Logged Out",
      description: "You have been safely logged out.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="droplet-spin text-primary text-4xl">💧</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      {isAuthenticated ? (
        <HealthDashboard 
          user={currentUser} 
          onLogout={handleLogout}
        />
      ) : (
        <AuthView onLogin={handleLogin} />
      )}
    </main>
  );
};

export default Index;