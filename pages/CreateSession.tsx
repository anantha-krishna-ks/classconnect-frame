import React, { useState } from 'react';
import { useParams, useNavigate,useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save, Target, Lightbulb, Clock, BookOpen, Users } from 'lucide-react';
import Header from '@/components/Header';
import RichTextEditor from '@/components/RichTextEditor';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import config from '@/config';
import { PageLoader } from "@/components/ui/loader"

const CreateSession = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [lessonPlanData, setLessonPlanData] = useState(null);
  const location = useLocation();
      const {
      selectedsubject,Selectedunittitle,selectedGrade,selectedGradeId,selectedSubjectId,selectedunitplandata
    } = location.state || {};
  const [sessionData, setSessionData] = useState({
    title: '',
    duration: '',
    selectedCOs: [] as string[],
    selectedELOs: [] as string[],
    instructions: ''
  });

  // Mock data - in real app this would come from API
  const lessonPlan = {
    title: Selectedunittitle,
    grade: selectedGrade,
    subject: selectedsubject,
    unitdata:selectedunitplandata
  };
  const unitPlan = lessonPlan.unitdata;
  unitPlan.expectedLearningOutcomes = unitPlan.assessment.map((row: any) => row.fullText);
  const [availableCOs, setAvailableCOs] = useState<string[]>([]);
  const [availableELOs, setAvailableELOs] = useState<string[]>(lessonPlan.unitdata.expectedLearningOutcomes);
  const [error, setError] = useState<string | null>(null);
  
  // if (lessonPlan.unitdata.expectedLearningOutcomes) {
  //   setAvailableELOs(lessonPlan.unitdata.expectedLearningOutcomes);
  // }
  
  const handleCOToggle = (co: string) => {
    setSessionData(prev => ({
      ...prev,
      selectedCOs: prev.selectedCOs.includes(co)
        ? prev.selectedCOs.filter(item => item !== co)
        : [...prev.selectedCOs, co]
    }));
  };

  const handleELOToggle = (elo: string) => {
    setSessionData(prev => ({
      ...prev,
      selectedELOs: prev.selectedELOs.includes(elo)
        ? prev.selectedELOs.filter(item => item !== elo)
        : [...prev.selectedELOs, elo]
    }));
  };

  const handleSave = () => {
    if (!sessionData.title || !sessionData.duration || sessionData.selectedELOs.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and select at least one Core Objective.",
        variant: "destructive"
      });
      return;
    }
    GetLessonPlanData();
  };

   const GetLessonPlanData = async()=>{
    try {
      setLoading(true);
      const getDuration = (durationStr) => {
        return durationStr || '45'; 
      };
      const topic=lessonPlan.title;
      const subject = lessonPlan.subject;
      const grade = lessonPlan.grade; 
      const duration = sessionData.duration; 
      const keyVocabulary = ''; 
      const supportingMaterials = ''; 
      const currentTopic = lessonPlan.title || '';
      const currentSubject = lessonPlan.subject || '';
      const currentGrade = String(lessonPlan.grade || '');

      const payload = {
        "promptType": "lesson_plan",
        "subject": currentSubject,
        "grade": currentGrade,
        "lessonTitle": topic,
        "duration": duration,
        "keyVocabulary": keyVocabulary,
        "supportingMaterials": supportingMaterials,
        "sessionInstructions": sessionData.instructions,
        "expectedLearningOutcomes": sessionData.selectedELOs,
      };
  
      const response = await axios.post(config.ENDPOINTS.GENERATE_LESSON_PLAN, payload);
      const parsedLesson = JSON.parse(response.data.lessonPlan);
  
      const inputToken = response.data.inputtoken || 0;
      const responseToken = response.data.responsetoken || 0;
  
      const newLessonPlanData = {
        structuredData: {
          ...parsedLesson,
          currentAffairs: parsedLesson.additionalSections?.currentAffairs || [],
          educationalVideos: parsedLesson.additionalSections?.educationalVideos || []
        },
        markdown: response.data.markdown || '',
        inputtoken: inputToken,
        responsetoken: responseToken,
        ailessonplan: parsedLesson
      };

      setLessonPlanData(newLessonPlanData);
      setLoading(false);
      navigate('/session-plan-output', {
        state: {
          lessonPlanData: newLessonPlanData,
          originalTopic: topic,
          onSaveSuccess: true,
          UnitId: lessonId,
          Grade:currentGrade
        }
      });
    } catch (err) {
      setLoading(false);
      const errorMessage = err.response?.data?.message || 'Please check your input and try again.';
      let displayMessage = 'Failed to generate lesson plan.';
      if (errorMessage.includes('topic') && errorMessage.includes('subject')) {
        displayMessage = 'The topic does not match the selected subject.';
      }        
      console.error('Error generating lesson plan:', err);
    } finally {
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {loading && <PageLoader text="Please wait..." />}
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="text-gray-600 hover:text-gray-900 hover:bg-blue-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sessions
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-800 rounded-xl flex items-center justify-center shadow-lg">
                  <Target className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Create Session</h1>
                  <p className="text-sm text-gray-500">Design Individual Learning Sessions</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">Grade {lessonPlan.grade}</div>
              <div className="text-sm text-gray-500">{lessonPlan.subject}</div>
            </div>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-6">

        {/* Session Info & Content */}
        <div className="mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{lessonPlan.title}</h2>
              <p className="text-gray-600 mb-4">Create a new session for this lesson plan</p>
              <div className="flex gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  Session Creation
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  Grade {lessonPlan.grade}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Section 1: Session Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Session Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Session Title *
                </label>
                <Input
                  placeholder="Enter session title..."
                  value={sessionData.title}
                  onChange={(e) => setSessionData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Duration *
                </label>
                <Input
                  placeholder="e.g., 45 minutes"
                  value={sessionData.duration}
                  onChange={(e) => setSessionData(prev => ({ ...prev, duration: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Session Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Session Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <RichTextEditor
                content={sessionData.instructions}
                onChange={(content) => setSessionData(prev => ({ ...prev, instructions: content }))}
                placeholder="Write detailed instructions for this session..."
                className="w-full"
              />
            </CardContent>
          </Card>

          {/* Section 4: Expected Learning Outcomes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-green-600" />
                Expected Learning Outcomes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {availableELOs.map((elo, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <Checkbox
                    id={`elo-${index}`}
                    checked={sessionData.selectedELOs.includes(elo)}
                    onCheckedChange={() => handleELOToggle(elo)}
                  />
                  <label
                    htmlFor={`elo-${index}`}
                    className="text-sm text-foreground leading-tight cursor-pointer"
                  >
                    {elo}
                  </label>
                </div>
              ))}
              <div className="text-xs text-muted-foreground mt-2">
                Selected: {sessionData.selectedELOs.length} of {availableELOs.length}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 w-64" style={{float: 'right', marginBottom: '20px'}}>
            <Button style={{ display: 'none' }}
              onClick={() => {
                // Draft save logic
                toast({
                  title: "Draft Saved",
                  description: "Your session has been saved as a draft.",
                });
              }}
              variant="outline"
              className="flex-1"
              size="lg"
            >
              <Save className="h-4 w-4 mr-2" />
              Save as Draft
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              size="lg"
            >
              <Save className="h-4 w-4 mr-2" />
              Create Session
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSession;