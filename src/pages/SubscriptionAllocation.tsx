import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, Home, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
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

// Mock data - Replace with actual API calls
const SCHOOL_NAME = "Saras International School";

const TEACHERS = [
  { id: 1, name: "Dr. Rajesh Kumar", department: "Mathematics" },
  { id: 2, name: "Ms. Priya Sharma", department: "Science" },
  { id: 3, name: "Mr. Amit Patel", department: "English" },
  { id: 4, name: "Mrs. Sunita Reddy", department: "Social Studies" },
  { id: 5, name: "Mr. Vikram Singh", department: "Physics" },
  { id: 6, name: "Ms. Anita Desai", department: "Chemistry" },
  { id: 7, name: "Dr. Ramesh Nair", department: "Biology" },
  { id: 8, name: "Mrs. Kavita Joshi", department: "History" },
  { id: 9, name: "Mr. Suresh Menon", department: "Geography" },
  { id: 10, name: "Ms. Deepa Agarwal", department: "Computer Science" },
];

const AVAILABLE_TOOLS = [
  { id: 'lesson-plan', name: 'Lesson Plan Assistant' },
  { id: 'assessment', name: 'Assessment Creator' },
  { id: 'slide-generator', name: 'Slide Generator' },
  { id: 'exam-prep', name: 'Exam Prep Assistant' },
  { id: 'video-editor', name: 'Video Clip Editor' },
  { id: 'resource-vault', name: 'Resource Vault' },
];

type TeacherToolSelection = {
  [teacherId: number]: string[];
};

const SubscriptionAllocation = () => {
  const navigate = useNavigate();
  const [teacherTools, setTeacherTools] = useState<TeacherToolSelection>({});

  const handleToolToggle = (teacherId: number, toolId: string) => {
    setTeacherTools(prev => {
      const currentTools = prev[teacherId] || [];
      const updatedTools = currentTools.includes(toolId)
        ? currentTools.filter(id => id !== toolId)
        : [...currentTools, toolId];
      
      return {
        ...prev,
        [teacherId]: updatedTools
      };
    });
  };

  const handleSaveAndSubscribe = () => {
    const teachersWithTools = Object.entries(teacherTools).filter(
      ([_, tools]) => tools.length > 0
    );

    if (teachersWithTools.length === 0) {
      toast.error('Please assign at least one tool to a teacher');
      return;
    }

    toast.success('Subscription activated successfully!', {
      description: `${teachersWithTools.length} teacher(s) configured with tools`,
    });
    
    setTimeout(() => {
      navigate('/admin-dashboard');
    }, 2000);
  };

  const handleLogout = () => {
    navigate('/admin-login');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Main Header */}
      <header className="border-b border-gray-100 px-6 py-3" style={{ backgroundColor: '#3B54A5' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <img 
            src="/lovable-uploads/c278e3c9-20de-45b8-a466-41c546111a8a.png" 
            alt="ExcelSchoolAi" 
            className="h-10 w-auto"
          />
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 hover:text-white border border-white/20 hover:border-white/40"
              onClick={() => navigate('/admin-dashboard')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 hover:text-white border border-white/20 hover:border-white/40"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to logout?
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
        </div>
      </header>

      {/* Breadcrumb Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
            <Home className="w-4 h-4" />
            <span className="mx-2">/</span>
            <span className="text-gray-900">Admin Dashboard</span>
            <span className="mx-2">/</span>
            <span className="text-blue-600 font-medium">Subscription Allocation</span>
          </nav>
          <div className="mt-2">
            <h1 className="text-2xl font-bold text-gray-900">Subscription Allocation</h1>
            <p className="text-gray-600 text-sm mt-1">
              School: <span className="font-semibold text-gray-900">{SCHOOL_NAME}</span>
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {TEACHERS.map((teacher) => {
            const assignedTools = teacherTools[teacher.id] || [];
            
            return (
              <Card key={teacher.id} className="border border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{teacher.name}</CardTitle>
                  <CardDescription>{teacher.department}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {AVAILABLE_TOOLS.map((tool) => {
                      const isAssigned = assignedTools.includes(tool.id);
                      return (
                        <div key={tool.id} className="flex items-center justify-between">
                          <Label 
                            htmlFor={`${teacher.id}-${tool.id}`}
                            className="text-sm font-normal cursor-pointer flex-1"
                          >
                            {tool.name}
                          </Label>
                          <Switch
                            id={`${teacher.id}-${tool.id}`}
                            checked={isAssigned}
                            onCheckedChange={() => handleToolToggle(teacher.id, tool.id)}
                          />
                        </div>
                      );
                    })}
                  </div>
                  {assignedTools.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-600">
                        {assignedTools.length} tool{assignedTools.length !== 1 ? 's' : ''} assigned
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Save Button */}
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={handleSaveAndSubscribe}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Save & Activate Subscription
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionAllocation;
