import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  BookOpen, 
  Target, 
  Clock, 
  Users, 
  Video, 
  Globe, 
  FileText, 
  Brain, 
  CheckCircle2, 
  Lightbulb, 
  MessageSquare, 
  TrendingUp,
  Home,
  Edit3,
  Calendar,
  GraduationCap,
  Image,
  Play,
  Activity,
  HelpCircle,
  ChevronRight,
  ExternalLink,
  Save,
  Download,
  X,
  Edit,
  Trash2,
  Plus
} from 'lucide-react';
import axios from 'axios';
import config from '@/config';

const SessionPlanOutput = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const {
    lessonPlanData,
    originalTopic,
    onSaveSuccess,
    UnitId,
    Grade
  } = location.state || {};

  const [editableData, setEditableData] = useState(() => {
    const data = lessonPlanData?.structuredData || {};
    return {
      title: data.title || originalTopic || 'Session Plan',
      duration: data.duration || '45 minutes',
      learningObjectives: data.learningObjectives || [],
      materials: data.materials || [],
      keyVocabulary: data.keyVocabulary || [],
      lessonFlow: data.lessonFlow || {},
      activities: data.activities || [],
      assessment: data.assessment || {},
      differentiation: data.differentiation || {},
      resources: data.resources || [],
      metadata: {
        subject: data.metadata?.subject || '',
        grade: Grade || '',
        ...data.metadata
      }
    };
  });

  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingSection, setEditingSection] = useState(null);

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      const payload = {
        appcode: 'AP01',
        custcode: 'CU01',
        orgcode: 'OR01',
        usercode: 'UO01',
        classname: Grade || '',
        subjectname: editableData.metadata?.subject || '',
        lessonplanname: editableData.title || '',
        ailessonplan_json: JSON.stringify(lessonPlanData?.ailessonplan || editableData),
        modifiedlessonplan_json: JSON.stringify(editableData),
        inputtoken: lessonPlanData?.inputtoken || 0,
        responsetoken: lessonPlanData?.responsetoken || 0,
        unitplanid: UnitId || 0,
      };

      const response = await axios.post(config.ENDPOINTS.SAVE_LESSON_PLAN, JSON.stringify(payload), {
        headers: { 'Content-Type': 'application/json' }
      });

      toast({
        title: "Session Saved Successfully",
        description: "Your session plan has been saved to the system.",
      });

      setIsSaved(true);
      setEditingSection(null);
      
      if (onSaveSuccess) {
        onSaveSuccess();
      }

    } catch (error) {
      console.error('Failed to save session plan:', error);
      toast({
        title: "Save Failed",
        description: error.response?.data?.detail || "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    // Navigate back to session listing page
    const unitId = UnitId || location.state?.unitId;
    const grade = Grade || location.state?.grade;
    const subject = editableData.metadata?.subject || location.state?.subject;
    
    if (unitId && grade && subject) {
      navigate(`/session/${unitId}/${grade}/${subject}`);
    } else if (unitId) {
      navigate(`/session/${unitId}`);
    } else {
      navigate(-1);
    }
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
                onClick={handleBack}
                className="text-gray-600 hover:text-gray-900 hover:bg-blue-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Session Listing
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-800 rounded-xl flex items-center justify-center shadow-lg">
                  <FileText className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Session Plan Output</h1>
                  <p className="text-sm text-gray-500">Generated Learning Session</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">Grade {editableData.metadata.grade}</div>
                <div className="text-sm text-gray-500">{editableData.metadata.subject}</div>
              </div>
              {!isSaved && (
                <Button 
                  onClick={handleSaveAll}
                  disabled={isSaving}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Session'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        
        {/* Session Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <BookOpen className="h-6 w-6 text-primary" />
              {editableData.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Duration: {editableData.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Grade: {editableData.metadata.grade}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Subject: {editableData.metadata.subject}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Learning Objectives */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              Learning Objectives
            </CardTitle>
          </CardHeader>
          <CardContent>
            {editableData.learningObjectives.length > 0 ? (
              <ul className="space-y-2">
                {editableData.learningObjectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm">{objective}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No learning objectives specified.</p>
            )}
          </CardContent>
        </Card>

        {/* Lesson Flow */}
        {editableData.lessonFlow && Object.keys(editableData.lessonFlow).length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                Lesson Flow
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(editableData.lessonFlow).map(([phase, content], index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="font-semibold text-lg mb-2 capitalize">{phase}</h4>
                  <p className="text-sm text-muted-foreground">{String(content)}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Activities */}
        {editableData.activities && editableData.activities.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                Activities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {editableData.activities.map((activity, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">{activity.name || `Activity ${index + 1}`}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                  {activity.duration && (
                    <Badge variant="secondary" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {activity.duration}
                    </Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Key Vocabulary */}
        {editableData.keyVocabulary && editableData.keyVocabulary.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-orange-600" />
                Key Vocabulary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {editableData.keyVocabulary.map((vocab, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <h5 className="font-semibold text-sm">{vocab.term || vocab}</h5>
                    {vocab.definition && (
                      <p className="text-xs text-muted-foreground mt-1">{vocab.definition}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Materials */}
        {editableData.materials && editableData.materials.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-600" />
                Materials Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {editableData.materials.map((material, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full flex-shrink-0"></div>
                    <span className="text-sm">
                      {typeof material === 'string' ? material : `${material.name} (${material.quantity})`}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Assessment */}
        {editableData.assessment && (editableData.assessment.description || editableData.assessment.successCriteria) && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {editableData.assessment.description && (
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">{editableData.assessment.description}</p>
                </div>
              )}
              {editableData.assessment.successCriteria && editableData.assessment.successCriteria.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Success Criteria</h4>
                  <ul className="space-y-1">
                    {editableData.assessment.successCriteria.map((criteria, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{criteria}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Resources */}
        {editableData.resources && editableData.resources.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-600" />
                Educational Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {editableData.resources.map((resource, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h5 className="font-medium text-sm">{resource.title || resource.name || `Resource ${index + 1}`}</h5>
                    {resource.description && (
                      <p className="text-xs text-muted-foreground mt-1">{resource.description}</p>
                    )}
                  </div>
                  {resource.url && (
                    <Button variant="ghost" size="sm" asChild>
                      <a href={resource.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Success Message */}
        {isSaved && (
          <Alert className="mb-8">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              Your session plan has been successfully saved to the system.
            </AlertDescription>
          </Alert>
        )}

      </div>
    </div>
  );
};

export default SessionPlanOutput;