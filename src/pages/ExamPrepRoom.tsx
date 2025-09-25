import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Upload, BookOpen, Clock, FileText, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CreateQuiz from '@/components/exam-prep/CreateQuiz';
import MyMockExam from '@/components/exam-prep/MyMockExam';

const ExamPrepRoom = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background exam-prep-room" style={{
      '--primary': '238 84% 67%',
      '--primary-foreground': '210 40% 98%'
    } as React.CSSProperties}>
      {/* Main Header */}
      <header className="border-b border-gray-100 px-6 py-3" style={{ backgroundColor: '#3B54A5' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <img 
            src="/lovable-uploads/c278e3c9-20de-45b8-a466-41c546111a8a.png" 
            alt="ExcelSchoolAi" 
            className="h-10 w-auto"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/student-dashboard')}
            className="text-white hover:bg-white/20 hover:text-white border border-white/20 hover:border-white/40 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      {/* Breadcrumbs Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Home className="w-4 h-4" />
            <span className="mx-2">/</span>
            <button 
              onClick={() => navigate('/student-dashboard')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Student Dashboard
            </button>
            <span className="mx-2">/</span>
            <span className="text-blue-600 font-medium">Exam Prep Room</span>
          </nav>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Exam Prep Room</h1>
              <p className="text-gray-600 text-sm">Prepare for exams with AI-powered practice tests and mock exams</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="create-quiz" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 h-14 p-2 bg-card border border-border rounded-lg">
            <TabsTrigger 
              value="create-quiz" 
              className="flex items-center gap-3 h-10 px-6 text-base font-medium rounded-md border border-transparent data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary/20 hover:bg-accent hover:text-accent-foreground transition-all"
            >
              <FileText className="w-5 h-5" />
              Create Quiz
            </TabsTrigger>
            <TabsTrigger 
              value="mock-exam" 
              className="flex items-center gap-3 h-10 px-6 text-base font-medium rounded-md border border-transparent data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary/20 hover:bg-accent hover:text-accent-foreground transition-all"
            >
              <Clock className="w-5 h-5" />
              My Mock Exam
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create-quiz">
            <CreateQuiz />
          </TabsContent>

          <TabsContent value="mock-exam">
            <MyMockExam />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ExamPrepRoom;