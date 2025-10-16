import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Brain, 
  UserCheck, 
  GraduationCap, 
  FileText, 
  UserSearch, 
  AlertTriangle,
  ArrowLeft,
  LogOut,
  Home
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/admin-login');
  };

  const adminTools = [
    {
      id: 'teacher-insight',
      title: 'Teacher Insight AI',
      description: 'Evaluates recorded classes to assess teaching clarity, pedagogy, and engagement — with growth suggestions.',
      icon: Brain,
      color: 'bg-blue-500',
      buttonColor: 'bg-blue-500 hover:bg-blue-600',
      route: '/teacher-insight'
    },
    {
      id: 'student-profiling',
      title: 'Student Profiling AI',
      description: 'Builds a longitudinal view of each student\'s academic, behavioral, and engagement trends to guide decisions.',
      icon: Users,
      color: 'bg-green-500',
      buttonColor: 'bg-green-500 hover:bg-green-600',
      route: '/student-profiling'
    },
    {
      id: 'parent-interview',
      title: 'Parent Interview Analyzer',
      description: 'Assesses recorded parent interviews to evaluate alignment with school culture and long-term commitment.',
      icon: UserCheck,
      color: 'bg-purple-500',
      buttonColor: 'bg-purple-500 hover:bg-purple-600',
      route: '/parent-interview'
    },
    {
      id: 'alumni-feedback',
      title: 'Alumni Feedback Miner',
      description: 'Extracts insights from alumni stories to inform school improvement, branding, and outcome tracking.',
      icon: GraduationCap,
      color: 'bg-orange-500',
      buttonColor: 'bg-orange-500 hover:bg-orange-600',
      route: '/alumni-feedback'
    },
    {
      id: 'teacher-hiring',
      title: 'Teacher Hiring Evaluator',
      description: 'Reviews demo class recordings with AI to support bias-free, evidence-based teacher recruitment.',
      icon: FileText,
      color: 'bg-indigo-500',
      buttonColor: 'bg-indigo-500 hover:bg-indigo-600',
      route: '/teacher-hiring'
    },
    {
      id: 'admission-fit',
      title: 'Admission Fit Evaluator',
      description: 'Analyzes student and parent interviews to assess cultural fit, preparedness, and potential for success.',
      icon: UserSearch,
      color: 'bg-teal-500',
      buttonColor: 'bg-teal-500 hover:bg-teal-600',
      route: '/admission-fit'
    },
    {
      id: 'student-risk',
      title: 'Student Risk Radar',
      description: 'Flags students at risk of disengagement or exit using academic, behavioral, and parental signals — with early alerts.',
      icon: AlertTriangle,
      color: 'bg-red-500',
      buttonColor: 'bg-red-500 hover:bg-red-600',
      route: '/student-risk'
    },
    {
      id: 'subscription-allocation',
      title: 'Subscription Allocation',
      description: 'Customize and assign learning tools to individual teachers, manage subscriptions, and activate SarasSchool AI for your institution.',
      icon: Users,
      color: 'bg-cyan-500',
      buttonColor: 'bg-cyan-500 hover:bg-cyan-600',
      route: '/subscription-allocation'
    }
  ];

  const handleToolClick = (route: string) => {
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Main Header with Logo */}
      <header className="border-b border-gray-100 px-6 py-3" style={{ backgroundColor: '#3B54A5' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <img 
            src="/lovable-uploads/c278e3c9-20de-45b8-a466-41c546111a8a.png" 
            alt="ExcelSchoolAi" 
            className="h-10 w-auto"
          />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 hover:text-white border border-white/20 hover:border-white/40 transition-all duration-200"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to logout? You will be redirected to the admin login page.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout} className="bg-red-600 hover:bg-red-700">
                  Yes, Logout
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </header>

      {/* Header with Breadcrumbs */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <Home className="w-4 h-4" />
            <span className="mx-2">/</span>
            <span className="text-blue-600 font-medium">Admin Dashboard</span>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {adminTools.map((tool) => {
            const IconComponent = tool.icon;
            return (
              <div key={tool.id} className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-start gap-4 mb-6">
                  <div className={`w-12 h-12 ${tool.color} rounded-xl flex items-center justify-center`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{tool.title}</h3>
                    <p className="text-gray-600 text-sm">{tool.description}</p>
                  </div>
                </div>
                <Button 
                  className={`w-full ${tool.buttonColor} text-white`}
                  onClick={() => handleToolClick(tool.route)}
                >
                  Launch Tool
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;