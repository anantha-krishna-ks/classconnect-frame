import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Timer, 
  Brain, 
  Shuffle, 
  Zap, 
  TrendingUp, 
  BookOpen, 
  FileText,
  FolderOpen,
  Megaphone,
  Calendar,
  Heart,
  Users,
  Target,
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

const StudentDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/student-login');
  };

  const studentTools = [
    {
      id: 'focus-buddy',
      title: 'Focus Buddy',
      description: 'Helps students stay focused using timed study sessions with breaks — inspired by the Pomodoro technique.',
      icon: Timer,
      color: 'bg-blue-500',
      buttonColor: 'bg-blue-500 hover:bg-blue-600',
      route: '/focus-buddy'
    },
    {
      id: 'smart-revision',
      title: 'Smart Revision Planner',
      description: 'Automatically schedules revisions using spaced repetition, so concepts stick long-term.',
      icon: Brain,
      color: 'bg-green-500',
      buttonColor: 'bg-green-500 hover:bg-green-600',
      route: '/smart-revision'
    },
    {
      id: 'mix-master',
      title: 'Mix & Master',
      description: 'Mixes questions from different chapters and subjects to strengthen retention and adaptability — based on interleaving.',
      icon: Shuffle,
      color: 'bg-purple-500',
      buttonColor: 'bg-purple-500 hover:bg-purple-600',
      route: '/mix-master'
    },
    {
      id: 'quick-recall',
      title: 'Quick Recall AI',
      description: 'Offers short, daily quizzes to practice active recall and strengthen memory — not just passive review.',
      icon: Zap,
      color: 'bg-yellow-500',
      buttonColor: 'bg-yellow-500 hover:bg-yellow-600',
      route: '/quick-recall'
    },
    {
      id: 'confidence-tracker',
      title: 'Confidence Tracker',
      description: 'Lets students rate their confidence after each topic or quiz to build self-awareness and guide study focus.',
      icon: TrendingUp,
      color: 'bg-orange-500',
      buttonColor: 'bg-orange-500 hover:bg-orange-600',
      route: '/confidence-tracker'
    },
    {
      id: 'exam-prep',
      title: 'Exam Prep Room',
      description: 'Central hub for practice tests, past papers, and chapter-wise mock tests — personalized to the student\'s syllabus.',
      icon: BookOpen,
      color: 'bg-indigo-500',
      buttonColor: 'bg-indigo-500 hover:bg-indigo-600',
      route: '/exam-prep'
    },
    {
      id: 'mock-test',
      title: 'Mock Test Generator',
      description: 'Generate full-length mock tests using past papers and AI-similar questions — with scoring and feedback.',
      icon: FileText,
      color: 'bg-teal-500',
      buttonColor: 'bg-teal-500 hover:bg-teal-600',
      route: '/mock-test'
    },
    {
      id: 'resource-vault',
      title: 'Resource Vault',
      description: 'Access all school-approved study materials, notes, and video lessons in one place.',
      icon: FolderOpen,
      color: 'bg-purple-500',
      buttonColor: 'bg-purple-500 hover:bg-purple-600',
      route: '/resource-vault'
    },
    {
      id: 'announcements',
      title: 'School Announcements Hub',
      description: 'Stay informed about exams, events, holidays, and circulars — all in one dashboard.',
      icon: Megaphone,
      color: 'bg-red-500',
      buttonColor: 'bg-red-500 hover:bg-red-600',
      route: '/announcements'
    },
    {
      id: 'calendar',
      title: 'Calendar & Deadlines Tracker',
      description: 'See upcoming assignments, tests, holidays, and revision milestones — auto-linked with class tools.',
      icon: Calendar,
      color: 'bg-emerald-500',
      buttonColor: 'bg-emerald-500 hover:bg-emerald-600',
      route: '/calendar'
    },
    {
      id: 'mood-mirror',
      title: 'Mood Mirror',
      description: 'Daily check-ins and tips to manage stress, anxiety, and focus — promoting emotional self-awareness.',
      icon: Heart,
      color: 'bg-rose-500',
      buttonColor: 'bg-rose-500 hover:bg-rose-600',
      route: '/mood-mirror'
    },
    {
      id: 'study-buddy',
      title: 'Study Buddy Connect',
      description: 'Find classmates with similar topics or goals to study collaboratively and stay motivated.',
      icon: Users,
      color: 'bg-cyan-500',
      buttonColor: 'bg-cyan-500 hover:bg-cyan-600',
      route: '/study-buddy'
    },
    {
      id: 'goal-setter',
      title: 'Goal Setter',
      description: 'Set personal academic goals and track progress — encouraging ownership and accountability.',
      icon: Target,
      color: 'bg-violet-500',
      buttonColor: 'bg-violet-500 hover:bg-violet-600',
      route: '/goal-setter'
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
            src="/lovable-uploads/saras-school-ai-logo.png" 
            alt="SarasSchoolAi" 
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
                  Are you sure you want to logout? You will be redirected to the student login page.
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
            <span className="text-blue-600 font-medium">Student Dashboard</span>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {studentTools.map((tool) => {
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

export default StudentDashboard;