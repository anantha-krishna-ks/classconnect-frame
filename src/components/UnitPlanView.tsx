
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  BookOpen, 
  Target, 
  Users, 
  CheckCircle, 
  FileText, 
  Clock,
  ArrowLeft,
  Edit,
  Download,
  Share
} from 'lucide-react';

interface UnitPlanViewProps {
  unitPlan: any;
  onBack: () => void;
  onEdit: () => void;
}

const UnitPlanView: React.FC<UnitPlanViewProps> = ({ unitPlan, onBack, onEdit }) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Repository
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Understanding Microorganisms</h1>
                <p className="text-gray-600 mt-1">Grade VII • General Science</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button size="sm" onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="objectives">Objectives</TabsTrigger>
            <TabsTrigger value="outcomes">Outcomes</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="assessment">Assessment</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Stats */}
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    Unit Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">{unitPlan.coreObjectives?.length || 5}</div>
                      <div className="text-sm text-gray-600">Core Objectives</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">{unitPlan.expectedLearningOutcomes?.length || 12}</div>
                      <div className="text-sm text-gray-600">Learning Outcomes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">{unitPlan.learningProgression?.length || 6}</div>
                      <div className="text-sm text-gray-600">Learning Steps</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600">{unitPlan.assignments?.length || 5}</div>
                      <div className="text-sm text-gray-600">Assignments</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Learning Progression */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-purple-600" />
                    Learning Progression
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {unitPlan.learningProgression?.slice(0, 4).map((step: any, index: number) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-purple-600 font-medium text-sm">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">{step.step}</h4>
                          <p className="text-sm text-gray-600">{step.example}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Learning Experiences */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    Learning Phases
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {unitPlan.learningExperiences?.map((phase: any, index: number) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div>
                          <div className="font-medium text-gray-900">{phase.phase}</div>
                          <div className="text-sm text-gray-600">{phase.activities?.length || 0} activities</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="objectives" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Core Objectives</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {unitPlan.coreObjectives?.map((objective: any, index: number) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-blue-600 font-medium text-sm">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-900 mb-2">{objective.text}</p>
                          <div className="flex flex-wrap gap-1">
                            {objective.label?.value?.split(';').map((label: string, idx: number) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {label.trim()}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="outcomes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Expected Learning Outcomes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {unitPlan.expectedLearningOutcomes?.map((outcome: string, index: number) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                        <p className="text-gray-900 text-sm">{outcome}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities" className="space-y-6">
            {unitPlan.learningExperiences?.map((phase: any, index: number) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="capitalize">{phase.phase} Phase</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {phase.activities?.map((activity: string, actIndex: number) => (
                      <div key={actIndex} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-gray-900 text-sm">{activity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="assessment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Assessment Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Context & Stimulus</h4>
                    <p className="text-blue-800 text-sm">{unitPlan.assessment?.stimulus}</p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Assessment Stem</h4>
                    <p className="text-green-800 text-sm">{unitPlan.assessment?.stem}</p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Assessment Questions</h4>
                    {unitPlan.assessment?.questions?.map((question: any, index: number) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start gap-3">
                          <Badge variant="outline" className="mt-1">
                            {question.type}
                          </Badge>
                          <p className="text-gray-900 text-sm flex-1">{question.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assignments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Assignments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {unitPlan.assignments?.map((assignment: any, index: number) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <FileText className="h-4 w-4 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-2">{assignment.title}</h4>
                          <p className="text-sm text-gray-600">{assignment.purpose}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UnitPlanView;
