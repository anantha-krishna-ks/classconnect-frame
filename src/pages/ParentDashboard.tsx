import { TrendingUp, Compass, Heart, BookOpen, MessageCircle, Calendar, Library, LogOut, Home, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
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

const ParentDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/parent-login');
  };

  const parentTools = [
    {
      id: 'progress-pulse',
      title: 'Progress Pulse',
      description: 'Weekly insights into your child\'s learning progress — strengths, struggles, and effort.',
      icon: TrendingUp,
      color: 'bg-blue-500',
      buttonColor: 'bg-blue-500 hover:bg-blue-600',
      route: '/progress-pulse'
    },
    {
      id: 'career-spark',
      title: 'Career Spark',
      description: 'Uncover your child\'s interests and talents through school activities and performance patterns.',
      icon: Compass,
      color: 'bg-purple-500',
      buttonColor: 'bg-purple-500 hover:bg-purple-600',
      route: '/career-spark'
    },
    {
      id: 'focus-wellbeing',
      title: 'Focus & Wellbeing Meter',
      description: 'Track subtle signs of stress or distraction, with tips to support your child\'s focus.',
      icon: Heart,
      color: 'bg-pink-500',
      buttonColor: 'bg-pink-500 hover:bg-pink-600',
      route: '/focus-wellbeing'
    },
    {
      id: 'study-recommender',
      title: 'Smart Study Recommender',
      description: 'Personalized videos, articles, and activities based on your child\'s current topics and needs.',
      icon: BookOpen,
      color: 'bg-green-500',
      buttonColor: 'bg-green-500 hover:bg-green-600',
      route: '/study-recommender'
    },
    {
      id: 'concept-checkin',
      title: 'Concept Check-In',
      description: 'A simple way to reflect on and share how confident your child feels about each topic.',
      icon: MessageCircle,
      color: 'bg-orange-500',
      buttonColor: 'bg-orange-500 hover:bg-orange-600',
      route: '/concept-checkin'
    },
    {
      id: 'attendance-monitor',
      title: 'Attendance & Schedule Monitor',
      description: 'Stay updated on your child\'s attendance, timetable, and upcoming school events.',
      icon: Calendar,
      color: 'bg-indigo-500',
      buttonColor: 'bg-indigo-500 hover:bg-indigo-600',
      route: '/attendance-monitor'
    },
    {
      id: 'resource-library',
      title: 'Learning Resource Library',
      description: 'Access curated learning materials that support your child\'s classwork and revision.',
      icon: Library,
      color: 'bg-cyan-500',
      buttonColor: 'bg-cyan-500 hover:bg-cyan-600',
      route: '/resource-library'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Main Header with Logo */}
      <header className="border-b border-gray-100 px-6 py-3" style={{ backgroundColor: '#3B54A5' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <img 
            src="/lovable-uploads/saras-school-ai-logo.png" 
            alt="SarasSchoolAi" 
            className="h-12 w-auto"
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
                  Are you sure you want to logout? You will be redirected to the login page.
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
            <span className="text-blue-600 font-medium">Parent Dashboard</span>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Dashboard Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Parent Dashboard</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay connected with your child's learning journey through intelligent insights and personalized recommendations
          </p>
        </div>

        {/* Parent Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {parentTools.map((tool) => {
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
                  onClick={() => navigate(tool.route)}
                >
                  View Details
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;