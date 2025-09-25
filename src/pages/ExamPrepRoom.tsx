import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Upload, BookOpen, Clock, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CreateQuiz from '@/components/exam-prep/CreateQuiz';
import MyMockExam from '@/components/exam-prep/MyMockExam';

const ExamPrepRoom = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-4 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/student-dashboard')}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Exam Prep Room</h1>
              <p className="text-muted-foreground">Prepare for exams with AI-powered practice tests and mock exams</p>
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