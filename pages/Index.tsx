
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import MainStepper from '@/components/MainStepper';
import { CourseOutcome } from './api';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const [board, setBoard] = useState('cbse');
  const [grade, setGrade] = useState('');
  const [subject, setSubject] = useState('');
  const [chapters, setChapters] = useState<string>('');
  const [generatedCOs, setGeneratedCOs] = useState<CourseOutcome[]>([]);

  const handleGenerateCO = (objectives: CourseOutcome[]) => {
    setGeneratedCOs(objectives);
    console.log('Generated Course Objectives:', objectives);
  };

  const handleSaveCustomObjective = (objective: CourseOutcome) => {
    setGeneratedCOs(prev => [...prev, objective]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/lesson-plan-assistant')}
                className="text-gray-600 hover:text-gray-900 hover:bg-blue-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Repository
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
                  <BookOpen className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Lesson Plan Creator</h1>
                  <p className="text-sm text-gray-500">AI-Powered Smart Lesson Plan Generation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <MainStepper
        board={board}
        setBoard={setBoard}
        grade={grade}
        setGrade={setGrade}
        subject={subject}
        setSubject={setSubject}
        chapters={chapters}
        setChapters={setChapters}
        onGenerateCO={handleGenerateCO}
        generatedCOs={generatedCOs}
        onSaveCustomObjective={handleSaveCustomObjective}
      />
    </div>
  );
};

export default Index;