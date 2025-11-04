import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, Lock, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SuperAdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication (replace with actual authentication)
    setTimeout(() => {
      if (email && password) {
        localStorage.setItem("superAdminAuth", "true");
        if (rememberMe) {
          localStorage.setItem("superAdminRemember", "true");
        }
        toast({
          title: "Welcome back!",
          description: "Successfully logged in as Super Administrator",
        });
        navigate("/super-admin");
      } else {
        toast({
          title: "Authentication failed",
          description: "Please check your credentials",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-muted/30">
      {/* Login card */}
      <Card className="w-full max-w-md mx-4 border shadow-sm">
        <CardHeader className="space-y-4 text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl font-semibold text-foreground">
              Super Admin Portal
            </CardTitle>
            <CardDescription className="text-sm">
              System Administration Access
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@sarasschool.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
              />
              <Label
                htmlFor="remember"
                className="text-sm font-normal cursor-pointer"
              >
                Keep me signed in
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full h-11"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                "Sign In Securely"
              )}
            </Button>

            <div className="text-center pt-2">
              <p className="text-xs text-muted-foreground">
                Secure enterprise access
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
