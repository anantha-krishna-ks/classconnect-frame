import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, LogIn, Mail, Lock, Sparkles, User, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PageLoader } from "@/components/ui/loader"
import axios from "axios";
import config from '@/config.js';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Simple validation
  if (!formData.username && !formData.password) {
    toast({
      title: "Missing Information",
      description: "Both username and password are required. Please fill out these fields.",
      variant: "destructive"
    });
    return;
  }
  if (!formData.username) {
    toast({
      title: "Missing Information",
      description: "Username is required. Please fill out this field.",
      variant: "destructive"
    });
    return;
  }
  if (!formData.password) {
    toast({
      title: "Missing Information",
      description: "Password is required. Please fill out this field.",
      variant: "destructive"
    });
    return;
  }

  setLoading(true);
  try {
    const response = await axios.post(
      config.LOGIN_CHECK_USER_URL,
      {
        username: formData.username,
        password: formData.password
      }
    );
  
    // Handle successful login (adjust as per your API's response)
    if (
      response.data && (
        response.data.status === "success" ||
        response.data.Status === "success" ||
        response.data.status === "S001" ||
        response.data.Status === "S001" ||
        (Array.isArray(response.data.data) && response.data.data.length > 0)
      )
    ) {
      toast({
        title: "Welcome back!",
        description: "Successfully logged in.",
      });
      // Save user info to localStorage
      if (response.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
        localStorage.setItem('user', JSON.stringify(response.data.data[0]));
      }
      navigate('/tools');
    } else {
      toast({
        title: "Login Failed",
        description: response.data?.message || response.data?.Message || "Invalid credentials.",
        variant: "destructive"
      });
    }
  } catch (err) {
    toast({
      title: "Login Error",
      description: "Unable to login. Please try again.",
      variant: "destructive"
    });
  } finally {
    setLoading(false);
  }

  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
     {/* Back Button */}
     <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 text-gray-600 hover:text-gray-900 hover:bg-white/50 transition-colors z-10 border border-gray-300 hover:border-gray-400 rounded-lg"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
   
    {loading && <PageLoader text="Signing you in..." />}
       {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-indigo-200/20 rounded-full blur-xl animate-float animation-delay-2s"></div>
        <div className="absolute bottom-20 left-20 w-16 h-16 bg-purple-200/20 rounded-full blur-xl animate-float animation-delay-4s"></div>
      </div>

      <div className="w-full max-w-md relative">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/25">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">
            Sign in to continue to Excel School AI
          </p>
        </div>

        {/* Login Card */}
        <Card className="backdrop-blur-lg bg-white/80 border-0 shadow-2xl shadow-blue-500/10">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl text-center font-semibold text-gray-900">
              Teacher Login
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <User className="h-4 w-4" />
                  </span>
                  <Input
                    id="username"
                    type="text"
                    autoComplete="username"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                    className="mt-1 pl-9"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="pl-10 pr-10 h-12 bg-white/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                   />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium shadow-lg shadow-blue-500/25 transition-all duration-200"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
             
            </form>

            {/* Footer Links */}
            
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          Powered by Excel School AI Platform
        </div>
      </div>
    </div>
    
  );
};

export default Login;