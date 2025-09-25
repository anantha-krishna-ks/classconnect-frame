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
            <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Exam Prep Room</h1>
              <p className="text-muted-foreground">Prepare for exams with AI-powered practice tests and mock exams</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="evaluate-candidate" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-muted/30 p-1 rounded-lg">
            <TabsTrigger 
              value="evaluate-candidate" 
              className="flex items-center gap-2 rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <FileText className="w-4 h-4" />
              Evaluate Candidate
            </TabsTrigger>
            <TabsTrigger 
              value="review-evaluation" 
              className="flex items-center gap-2 rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Clock className="w-4 h-4" />
              Review Evaluation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="evaluate-candidate">
            <CreateQuiz />
          </TabsContent>

          <TabsContent value="review-evaluation">
            <MyMockExam />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ExamPrepRoom;