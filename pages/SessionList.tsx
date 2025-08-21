import React, { useState } from 'react';
import { useParams, useNavigate,useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Clock, BookOpen, Users, Calendar, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import axios from 'axios';
import config from '@/config'; 

const SessionList = () => {
  const { id } = useParams();
  const { grade } = useParams();
  const { subject } = useParams();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [lessonPlans, setLessonPlans] = useState([]);
  const location = useLocation();
  const {
    selectedsubject,Selectedunittitle,selectedGrade,selectedunitdata
  } = location.state || {};
  
  // Mock data - in real app this would come from API based on lesson plan ID
  const lessonPlan = {
    id: parseInt(id || '0'),
    title: Selectedunittitle,
    grade: selectedGrade,
    subject: selectedsubject,
    selectedunitdata: selectedunitdata,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const GetLessonPlan = async () => {
    try {
      const response = await axios.post(config.ENDPOINTS.GET_LESSON_PLANS, {
        appcode: "AP01",
        custcode: "CU01",
        orgcode: "OR01",
        usercode: "UO01",
        classid: grade,
        subjectid: subject,
        lessonplanname: "",
        unitid:lessonPlan.id
      });
      setLessonPlans(response.data.lesson_plans || []);
    } catch (err) {
      console.error(err);
    } finally {
    }
  };

  React.useEffect(() => {
    GetLessonPlan();
  }, []);

const togglePreview = (plan) => {
    try {
      const rawJson = typeof plan.lessonplanjson === 'string'
        ? JSON.parse(plan.lessonplanjson)
        : plan.lessonplanjson || {};
  
      const base = rawJson.structuredData || rawJson;
  
      const lessonData = {
        title: base.title || plan.lessonplanname || 'Untitled',
        metadata: {
          grade: plan.classname,
          subject: base.metadata?.subject || plan.subjectname || 'Not specified',
          duration: base.metadata?.duration || 'Not specified',
        },
        learningObjectives: base.learningObjectives || [],
        materials: base.materials || [],
        keyVocabulary: base.keyVocabulary || [],
        assessment: base.assessment || { description: '', successCriteria: [] },
        differentiation: base.differentiation || { support: '' },
        lessonFlow: {
          introduction: {
            hook: base.lessonFlow?.introduction?.hook || base.lessonFlow?.introduction?.hookActivity || '',
            priorKnowledge: base.lessonFlow?.introduction?.priorKnowledge || base.lessonFlow?.introduction?.priorKnowledgeConnection || '',
            duration: base.lessonFlow?.introduction?.duration || ''
          },
          activities: Array.isArray(base.lessonFlow?.activities)
            ? base.lessonFlow.activities.map((act) => ({
                title: act?.title || '',
                description: act?.description || '',
                objective: act?.objective || '',
                duration: act?.duration || ''
              }))
            : [],
          closure: base.lessonFlow?.closure || { summary: '' }
        },
        realWorldExamples: base.realWorldExamples || [],
        discussionQuestions: base.discussionQuestions || [],
        resources: base.resources?.length ? base.resources : (base.educationalDocuments || base.additionalSections?.educationalDocuments || []),
        currentAffairs: base.currentAffairs || base.additionalSections?.currentAffairs || [],
        educationalVideos: base.educationalVideos || base.additionalSections?.educationalVideos || [],
        educationalDocuments: base.educationalDocuments || base.additionalSections?.educationalDocuments || [],
        visualAids: (base.visualAids || base.visualaids || base.images || []).map((img) => {
          if (typeof img === 'string') {
            return { url: img, alt_description: '' };
          } else if (img?.url || img?.urls?.small) {
            return {
              url: img.url || img.urls?.small,
              alt_description: img.alt_description || img.title || ''
            };
          }
          return img;
        }),
        
      };
      const newLessonPlanData = {
         structuredData: lessonData,
        markdown: ''
      };
  
      setSelectedPlan(newLessonPlanData);
      navigate('/session-plan-preview', {
        state: {
          selectedLessonPlan: newLessonPlanData         
        }
      }); 
      //setPreviewOpen(true);
    } catch (err) {
      console.error("❌ Error parsing preview plan:", err);
      alert("Failed to load preview. Try again.");
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
                onClick={() => navigate('/lesson-plan-assistant')}
                className="text-gray-600 hover:text-gray-900 hover:bg-blue-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Repository
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center shadow-lg">
                  <BookOpen className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Session Manager</h1>
                  <p className="text-sm text-gray-500">Organize & Plan Individual Learning Sessions</p>
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
        {/* Lesson Plan Info & Content */}
        <div className="mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{lessonPlan.title}</h2>
                <p className="text-gray-600 mb-4">Manage sessions for this lesson plan</p>
                <div className="flex gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    {lessonPlans.length} Sessions
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    Grade {lessonPlan.grade}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Button 
                  onClick={() => navigate(`/session/create/${lessonPlan.id}`,
                    {
                      state: {
                              selectedGrade: lessonPlan.grade,
                              selectedsubject: lessonPlan.subject,
                              Selectedunittitle: lessonPlan.title,
                              selectedGradeId:grade,
                              selectedSubjectId:subject,
                              selectedunitplandata:lessonPlan.selectedunitdata
                            }
                    }
                  )}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Session
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Sessions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessonPlans.map((session, index) => (
            <Card key={session.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => togglePreview(session)}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-semibold text-foreground leading-tight">
                    {session.lessonplanname}
                  </CardTitle>
                  <Badge className={getStatusColor('completed')}>
                    completed
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {session.lessonplanjson.structuredData?.metadata?.duration
    || session.lessonplanjson.metadata?.duration
    || "N/A"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(session.date).toLocaleDateString('en-GB')}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-foreground">{session.lessonplanjson.structuredData?.learningObjectives.length || 0}</div>
                    <div className="text-xs text-muted-foreground">Objectives</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-foreground">1</div>
                    <div className="text-xs text-muted-foreground">Outcomes</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {lessonPlans.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Session Plans Available</h3>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
         
export default SessionList;