import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Edit, Download, Save } from 'lucide-react';
import Header from '@/components/Header';

interface LessonPlanPreviewProps {
  lessonPlan: any;
  unitPlan: any;
  onBack: () => void;
  onEdit: () => void;
}

const LessonPlanPreview: React.FC<LessonPlanPreviewProps> = ({
  lessonPlan,
  unitPlan,
  onBack,
  onEdit
}) => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            onClick={onBack}
            variant="ghost"
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Repository
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 mb-6">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onEdit}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="outline" size="sm">
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>

        {/* Traditional Lesson Plan Format */}
        <Card className="max-w-5xl mx-auto bg-card border-border shadow-lg print:shadow-none print:border-none">
          <CardContent className="p-0">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-8 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                    <div className="text-primary-foreground font-bold text-xl">EXCEL</div>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground mb-1">Excel Public School, Mysuru</h1>
                    <h2 className="text-xl font-semibold text-primary tracking-wide">LESSON PLAN</h2>
                  </div>
                </div>
                <div className="text-right text-muted-foreground">
                  <div className="text-sm">Academic Year</div>
                  <div className="font-semibold">2024-25</div>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="p-8 bg-muted/30">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Board/Standard</span>
                    <span className="text-lg font-semibold text-foreground">CBSE</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Grade</span>
                    <span className="text-lg font-semibold text-foreground">{lessonPlan.grade}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Subject</span>
                    <span className="text-lg font-semibold text-foreground">{lessonPlan.subject}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Chapter/Unit</span>
                    <span className="text-lg font-semibold text-foreground">{lessonPlan.title}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Teacher's Name</span>
                    <span className="text-lg font-semibold text-foreground">Dr. Sriman S Kamath</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Planned Date</span>
                    <span className="text-lg font-semibold text-foreground">28/05/2025</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Class & Section</span>
                    <span className="text-lg font-semibold text-foreground">{lessonPlan.grade} A & B</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Execution Period</span>
                    <span className="text-lg font-semibold text-foreground">03/06/2025 to 31/07/2025</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Core Objectives */}
            <div className="p-8">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-foreground mb-2">Core Objectives</h3>
                <p className="text-muted-foreground text-sm">Reference to daily life, long lasting values, and skills</p>
              </div>
              
              <div className="space-y-6">
                {unitPlan.coreObjectives.map((objective: any, index: number) => (
                  <div key={index} className="bg-card border border-border rounded-lg p-6 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-bold text-sm">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-foreground leading-relaxed">{objective.text}</p>
                        <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          {objective.label?.value || "Learning"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* List of COs */}
            <div className="p-8 bg-muted/20">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-foreground mb-2">List of COs</h3>
                <p className="text-muted-foreground text-sm">Curriculum Objectives aligned with the lesson</p>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-primary">CO 1:</span>
                    <p className="text-sm text-foreground">Understand the basic structure and bonding in organic compounds</p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-primary">CO 2:</span>
                    <p className="text-sm text-foreground">Classify organic compounds based on functional groups</p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-primary">CO 3:</span>
                    <p className="text-sm text-foreground">Analyze isomerism in organic compounds</p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-primary">CO 4:</span>
                    <p className="text-sm text-foreground">Apply knowledge to real-world organic chemistry problems</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Expected Learning Outcomes */}
            <div className="p-8">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-foreground mb-2">Expected Learning Outcomes</h3>
                <p className="text-muted-foreground text-sm">Please refer to the LO mentioned in the Curriculum document</p>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6 mb-8">
                <p className="font-semibold text-foreground mb-4">Students should be able to:</p>
                <ul className="space-y-3">
                  {unitPlan.expectedLearningOutcomes.map((outcome: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-foreground">{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bloom's Taxonomy - Higher Order Thinking Skills */}
            <div className="p-8 bg-muted/20">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-foreground mb-2">Bloom's Taxonomy - Higher Order Thinking Skills</h3>
                <p className="text-muted-foreground text-sm">Focus on Analysis, Synthesis, and Evaluation levels</p>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6 mb-8">
                <div className="space-y-4">
                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-semibold text-green-700">Analyze</span>
                    </div>
                    <p className="text-sm text-foreground">Break down organic compounds into their structural components and identify functional groups</p>
                  </div>
                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="font-semibold text-blue-700">Evaluate</span>
                    </div>
                    <p className="text-sm text-foreground">Assess the stability and reactivity of different organic compounds based on their structure</p>
                  </div>
                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="font-semibold text-purple-700">Create</span>
                    </div>
                    <p className="text-sm text-foreground">Design synthesis pathways for organic compounds using knowledge of reactions and mechanisms</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="p-8">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-foreground mb-2">Skills</h3>
                <p className="text-muted-foreground text-sm">21st Century Skills developed through this lesson</p>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold text-primary mb-2">Critical Thinking</h4>
                    <p className="text-xs text-muted-foreground">Analyzing molecular structures and predicting properties</p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold text-primary mb-2">Problem Solving</h4>
                    <p className="text-xs text-muted-foreground">Identifying unknown compounds using structural clues</p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold text-primary mb-2">Scientific Communication</h4>
                    <p className="text-xs text-muted-foreground">Explaining concepts using proper chemical terminology</p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold text-primary mb-2">Digital Literacy</h4>
                    <p className="text-xs text-muted-foreground">Using molecular modeling software and databases</p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold text-primary mb-2">Collaboration</h4>
                    <p className="text-xs text-muted-foreground">Working in teams on laboratory experiments</p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold text-primary mb-2">Data Analysis</h4>
                    <p className="text-xs text-muted-foreground">Interpreting spectroscopic data for structure determination</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Competencies */}
            <div className="p-8 bg-muted/20">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-foreground mb-2">Competencies</h3>
                <p className="text-muted-foreground text-sm">Key competencies developed in this lesson</p>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6 mb-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-primary font-bold text-xs">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Scientific Inquiry</h4>
                      <p className="text-sm text-muted-foreground">Ability to formulate hypotheses and design experiments to test organic chemistry concepts</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-primary font-bold text-xs">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Mathematical Reasoning</h4>
                      <p className="text-sm text-muted-foreground">Applying mathematical concepts to understand molecular geometry and reaction kinetics</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-primary font-bold text-xs">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Environmental Awareness</h4>
                      <p className="text-sm text-muted-foreground">Understanding the environmental impact of organic compounds and sustainable chemistry practices</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Attitudes */}
            <div className="p-8">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-foreground mb-2">Attitudes</h3>
                <p className="text-muted-foreground text-sm">Values and attitudes fostered through learning</p>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-medium text-foreground">Curiosity</span>
                    </div>
                    <p className="text-sm text-muted-foreground ml-4">Developing inquisitive nature about molecular structures and their properties</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="font-medium text-foreground">Perseverance</span>
                    </div>
                    <p className="text-sm text-muted-foreground ml-4">Persistence in solving complex organic chemistry problems</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="font-medium text-foreground">Precision</span>
                    </div>
                    <p className="text-sm text-muted-foreground ml-4">Attention to detail in laboratory work and structural analysis</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="font-medium text-foreground">Ethical Responsibility</span>
                    </div>
                    <p className="text-sm text-muted-foreground ml-4">Understanding responsible use of chemical knowledge and environmental stewardship</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Generated Learning Outcomes */}
            <div className="p-8 bg-muted/20">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-foreground mb-2">Generated Learning Outcomes</h3>
                <p className="text-muted-foreground text-sm">AI-generated specific learning outcomes for this lesson</p>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6 mb-8">
                <div className="space-y-4">
                  <div className="border-l-4 border-primary pl-4">
                    <h4 className="font-semibold text-primary mb-1">Knowledge Outcomes</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>Define and distinguish between different types of organic compounds</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>Explain the concept of covalent bonding in carbon compounds</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>Identify functional groups in organic molecules</span>
                      </li>
                    </ul>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold text-green-700 mb-1">Application Outcomes</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-green-500">•</span>
                        <span>Predict properties of organic compounds based on their structure</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500">•</span>
                        <span>Draw structural formulas for given organic compounds</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500">•</span>
                        <span>Relate molecular structure to real-world applications</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Objective Mapping */}
            <div className="p-8">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-foreground mb-2">Objective Mapping</h3>
                <p className="text-muted-foreground text-sm">Alignment between curriculum objectives, learning outcomes, and assessment</p>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6 mb-8">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-3 font-semibold text-foreground">Curriculum Objective</th>
                        <th className="text-left p-3 font-semibold text-foreground">Learning Outcome</th>
                        <th className="text-left p-3 font-semibold text-foreground">Assessment Method</th>
                        <th className="text-left p-3 font-semibold text-foreground">Bloom's Level</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border">
                        <td className="p-3 text-muted-foreground">CO1: Basic structure understanding</td>
                        <td className="p-3 text-foreground">Identify functional groups</td>
                        <td className="p-3 text-muted-foreground">Formative Quiz</td>
                        <td className="p-3">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Understand</span>
                        </td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="p-3 text-muted-foreground">CO2: Classification of compounds</td>
                        <td className="p-3 text-foreground">Categorize organic molecules</td>
                        <td className="p-3 text-muted-foreground">Laboratory Activity</td>
                        <td className="p-3">
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Apply</span>
                        </td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="p-3 text-muted-foreground">CO3: Isomerism analysis</td>
                        <td className="p-3 text-foreground">Analyze structural differences</td>
                        <td className="p-3 text-muted-foreground">Problem Solving</td>
                        <td className="p-3">
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Analyze</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3 text-muted-foreground">CO4: Real-world application</td>
                        <td className="p-3 text-foreground">Connect to daily life</td>
                        <td className="p-3 text-muted-foreground">Project Work</td>
                        <td className="p-3">
                          <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">Evaluate</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Learning Progression */}
            <div className="p-8 bg-muted/20">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-foreground mb-2">Learning Progression</h3>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6 mb-8">
                <div className="space-y-4">
                  {unitPlan.learningProgression.map((step: any, index: number) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-bold text-sm">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground mb-1">{step.step}</p>
                        <p className="text-sm text-muted-foreground">{step.example}</p>
                        <p className="text-xs text-muted-foreground mt-1">{step.rationale}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Assessment */}
            <div className="p-8">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-foreground mb-2">Assessment</h3>
                <p className="text-muted-foreground text-sm">Formative or Summative, with tools, techniques or test items, aligning well with the LO's mentioned above</p>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6 mb-8">
                <div className="space-y-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm"><span className="font-semibold text-primary">Stimulus:</span> {unitPlan.assessment.stimulus}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm"><span className="font-semibold text-primary">STEM:</span> {unitPlan.assessment.stem}</p>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    {unitPlan.assessment.questions.map((question: any, index: number) => (
                      <div key={index} className="p-4 border border-border rounded-lg">
                        <span className="font-semibold text-primary">{index + 1}.</span> {question.text}
                        <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          {question.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Assignments */}
            <div className="p-8 bg-muted/20">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-foreground mb-2">Assignments</h3>
                <p className="text-muted-foreground text-sm">During or/and after the completion of the Unit/Lesson</p>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6 mb-8">
                {unitPlan.assignments.map((assignment: any, index: number) => (
                  <div key={index} className="mb-4 last:mb-0">
                    <h4 className="font-semibold text-foreground mb-2">{assignment.title}</h4>
                    <p className="text-sm text-muted-foreground">{assignment.purpose}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Experiences */}
            <div className="p-8">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-foreground mb-2">Learning Experiences</h3>
                <p className="text-muted-foreground text-sm">3E Model/Experiential Learning/Art-Sports Integrated/Inter-Cross Disciplinary etc. with clear mention of digital tools and resources used</p>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6 mb-8">
                <h5 className="font-semibold text-primary mb-3">5E Model - Tools used:</h5>
                
                <div className="space-y-4">
                  {unitPlan.learningExperiences.map((experience: any, index: number) => (
                    <div key={index} className="border-l-4 border-primary pl-4">
                      <p className="font-semibold text-foreground mb-2">{experience.phase} Phase</p>
                      <ul className="space-y-1">
                        {experience.activities.map((activity: string, actIndex: number) => (
                          <li key={actIndex} className="text-sm text-muted-foreground">• {activity}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LessonPlanPreview;