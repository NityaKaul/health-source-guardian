import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Droplets } from "lucide-react";
import heroImage from "@/assets/hero-health-water.jpg";

interface AuthViewProps {
  onLogin: (userData: any, token: string) => void;
}

const AuthView = ({ onLogin }: AuthViewProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Login with actual backend
        const { login } = await import('@/lib/api');
        const result = await login({
          email: formData.email,
          password: formData.password
        });
        
        onLogin(result.user, result.token);
        toast({
          title: "Login Successful",
          description: "Welcome back to the ASHA Health Platform!",
        });
      } else {
        // Signup with actual backend
        if (formData.password !== formData.confirmPassword) {
          toast({
            title: "Password Mismatch",
            description: "Please ensure both passwords match.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        const { signup } = await import('@/lib/api');
        const result = await signup({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });

        onLogin(result.user, result.token);
        toast({
          title: "Account Created",
          description: "Welcome to the ASHA Health Platform!",
        });
      }
    } catch (error) {
      toast({
        title: "Authentication Failed",
        description: error instanceof Error ? error.message : "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Hero Section */}
      <div 
        className="hidden lg:flex lg:w-1/2 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative flex flex-col justify-center items-center text-white p-8 text-center">
          <Droplets className="w-16 h-16 text-secondary mb-4" />
          <h1 className="text-4xl font-bold font-merriweather mb-4">
            Water Health Surveillance
          </h1>
          <p className="text-xl opacity-90">
            Empowering ASHA workers to protect communities from water-borne diseases
          </p>
        </div>
      </div>

      {/* Auth Form Section */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-8">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="text-center mb-8 lg:hidden">
            <Droplets className="w-12 h-12 text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold font-merriweather text-foreground">
              ASHA Health Platform
            </h1>
          </div>

          <Card className="health-card-hover shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-merriweather">
                {isLogin ? "Welcome Back" : "Create Account"}
              </CardTitle>
              <p className="text-muted-foreground">
                {isLogin 
                  ? "Sign in to access your health surveillance dashboard"
                  : "Join the community health surveillance network"
                }
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                    />
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="droplet-spin">💧</div>
                      {isLogin ? "Signing In..." : "Creating Account..."}
                    </div>
                  ) : (
                    isLogin ? "Sign In" : "Create Account"
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary hover:underline"
                >
                  {isLogin 
                    ? "Need an account? Sign up here" 
                    : "Already have an account? Sign in here"
                  }
                </button>
              </div>

              {isLogin && (
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                  >
                    Forgot your password?
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AuthView;