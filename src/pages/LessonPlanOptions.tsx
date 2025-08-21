import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Monitor, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';

const LessonPlanOptions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const lessonData = location.state?.lessonData || {
    grade: '8',
    subject: 'Science',
    lessonName: 'Understanding Climate Change'
  };

  const handleTraditionalFormat = () => {
    navigate('/lesson-plan-traditional', {
      state: { lessonData }
    });
  };

  const handleExistingFormat = () => {
    navigate('/lesson-plan-output', {
      state: { lessonData }
    });
  };

  return (
    <div className="w-full min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button
            onClick={() => navigate('/lesson-plan')}
            variant="ghost"
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Lesson Plan Assistant
          </Button>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Choose Your Lesson Plan Format
            </h1>
            <p className="text-lg text-muted-foreground mb-2">
              Select the format that best suits your teaching needs
            </p>
            <div className="flex justify-center gap-2 mb-8">
              <Badge variant="secondary">{lessonData.grade}</Badge>
              <Badge variant="secondary">{lessonData.subject}</Badge>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Traditional Format Option */}
          <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl mb-2">Traditional Format</CardTitle>
              <Badge variant="default" className="mx-auto">Recommended</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-center">
                Professional lesson plan format following educational standards with structured sections for objectives, assessments, and activities.
              </p>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Features:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• School header with branding</li>
                  <li>• Core objectives section</li>
                  <li>• Expected learning outcomes</li>
                  <li>• Assessment criteria</li>
                  <li>• Learning progression</li>
                  <li>• Structured activities</li>
                </ul>
              </div>
              
              <Button 
                onClick={handleTraditionalFormat}
                className="w-full bg-primary hover:bg-primary/90"
                size="lg"
              >
                Create Traditional Format
              </Button>
            </CardContent>
          </Card>

          {/* Existing Format Option */}
          <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 bg-secondary/10 rounded-full w-16 h-16 flex items-center justify-center">
                <Monitor className="h-8 w-8 text-secondary" />
              </div>
              <CardTitle className="text-2xl mb-2">Digital Format</CardTitle>
              <Badge variant="secondary" className="mx-auto">Interactive</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-center">
                Modern, interactive lesson plan with multimedia content, visual aids, and engaging digital elements.
              </p>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Features:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Interactive card layout</li>
                  <li>• Multimedia resources</li>
                  <li>• Video content links</li>
                  <li>• Discussion questions</li>
                  <li>• Real-world examples</li>
                  <li>• Downloadable resources</li>
                </ul>
              </div>
              
              <Button 
                onClick={handleExistingFormat}
                variant="secondary"
                className="w-full"
                size="lg"
              >
                Create Digital Format
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LessonPlanOptions;
