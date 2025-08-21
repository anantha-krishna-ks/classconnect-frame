import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import AssessmentStepper from '@/components/AssessmentStepper';

const AssessmentCreate = () => {
  const navigate = useNavigate();

  const handleAssessmentComplete = (assessmentData: any) => {
    console.log('Assessment completed:', assessmentData);
    // Navigate to final generation or save the assessment
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8 animate-fade-in">
          <Button
            variant="ghost"
            onClick={() => navigate('/assessment-assist')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-purple-50 transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Assessment Repository
          </Button>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center animate-fade-in">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Create Assessment
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Design comprehensive assessments with intelligent AI assistance
            </p>
          </div>

          <AssessmentStepper onComplete={handleAssessmentComplete} />
        </div>
      </div>
    </div>
  );
};

export default AssessmentCreate;