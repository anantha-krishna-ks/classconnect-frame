import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  ExternalLink
} from 'lucide-react';
import Header from '@/components/Header';

const LessonPlanOutput = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get lesson data from navigation state or use defaults
  const lessonData = location.state?.lessonData || {
    grade: '8',
    subject: 'Science',
    lessonName: 'Understanding Climate Change'
  };

  const activities = [
    {
      title: "Exploring Climate Change Causes and Effects",
      duration: "13 minutes",
      grouping: "Small groups",
      materials: "Climate change infographic handouts, Whiteboard and markers",
      objective: "Students will analyze visual data to identify causes and effects of climate change.",
      steps: [
        "Step 1: Distribute infographics to small groups.",
        "Step 2: Groups analyze the infographic, highlighting causes (such as burning fossil fuels) and effects (like rising sea levels).",
        "Step 3: Each group shares one key cause and one effect with the class, while the teacher records responses on the whiteboard."
      ],
      teacherNotes: "Encourage students to use vocabulary like 'greenhouse gases' and 'fossil fuels' when discussing the infographic."
    }
  ];

  const visualAids = [
    {
      title: "CLIMATE CHANGE: UNDERSTANDING THE SCIENCE BEHIND IT",
      source: "Bing",
      type: "Infographic",
      description: "Comprehensive climate change data visualization showing temperature and precipitation changes"
    },
    {
      title: "Understanding Climate Change Unit Plan for 9th - 12th Grade | Lesson Planet",
      source: "Bing", 
      type: "Lesson Plan",
      description: "Complete unit plan with activities and resources for high school climate education"
    },
    {
      title: "Understanding Climate Change",
      source: "Science, Policy",
      type: "Educational Material",
      description: "Scientific policy documentation on climate change understanding"
    },
    {
      title: "Understanding Climate Change",
      source: "Green Environment",
      type: "Educational Resource",
      description: "Environmental education materials focusing on climate science"
    }
  ];

  const realWorldExamples = [
    {
      title: "Melting polar ice caps",
      description: "Polar ice caps are melting faster due to rising global temperatures, which is causing sea levels to rise."
    },
    {
      title: "Increased wildfires in California", 
      description: "Hotter and drier conditions, linked to climate change, are making wildfires more common and severe."
    }
  ];

  const discussionQuestions = [
    {
      question: "Why do you think climate change is happening faster now than in the past?",
      purpose: "Encourages students to connect human activity with changes in the environment."
    },
    {
      question: "How might climate change affect the place where you live?",
      purpose: "Helps students relate global issues to their own lives and communities."
    }
  ];

  const currentEvents = [
    "Recent climate summit agreements and commitments",
    "New renewable energy projects in our region",
    "Local environmental conservation efforts",
    "Youth climate activism movements"
  ];

  const educationalVideos = [
    {
      title: "Climate Change - The Facts in 4 minutes",
      source: "BBC",
      thumbnail: "/placeholder-video-1.jpg",
      description: "Comprehensive overview of climate change facts"
    },
    {
      title: "Science, Grade 2-3, 3/27 - Lesson 1,...",
      source: "YouTube", 
      thumbnail: "/placeholder-video-2.jpg",
      description: "Educational lesson on climate science for elementary students"
    }
  ];

  const resources = [
    {
      title: "Climate Change: The Greenhouse Effect",
      type: "Video",
      source: "National Geographic Kids"
    },
    {
      title: "Understanding Global Warming",
      type: "Interactive",
      source: "NASA Climate Kids"
    },
    {
      title: "Carbon Footprint Calculator",
      type: "Tool", 
      source: "EPA"
    },
    {
      title: "Climate Change Basics",
      type: "Article",
      source: "NOAA Climate.gov"
    }
  ];

  return (
    <div className="w-full min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/')}
            className="h-auto p-0 hover:text-foreground"
          >
            <Home className="h-4 w-4 mr-1" />
            Home
          </Button>
          <span>/</span>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/lesson-plan')}
            className="h-auto p-0 hover:text-foreground"
          >
            Lesson Planner
          </Button>
          <span>/</span>
          <span className="text-foreground">Lesson Plan Output</span>
        </div>

        {/* Back Button */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Lesson Planner
          </Button>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Lesson Plan Details Section */}
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-2xl font-bold text-primary mb-4">📚 Lesson Plan Details</CardTitle>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                  <Edit3 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Lesson Title</p>
                      <p className="font-semibold">{lessonData.lessonName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Grade</p>
                      <p className="font-semibold">{lessonData.grade}th Grade</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="font-semibold">60 minutes</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Subject</p>
                      <p className="font-semibold">{lessonData.subject}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Learning Objectives */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Learning Objectives
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                  <Edit3 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <p>Students will understand the basic concept of climate change and its causes.</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <p>Students will identify greenhouse gases and explain their role in global warming.</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <p>Students will demonstrate understanding through hands-on experiments and discussions.</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <p>Students will analyze real-world examples of climate change impacts.</p>
              </div>
            </CardContent>
          </Card>

          {/* Mathematical Link */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  Mathematical Link Present
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                  <Edit3 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Students will analyze temperature data graphs, calculate percentage increases in CO2 levels, 
                and interpret statistical information about climate trends over the past century. They will 
                work with data visualization and mathematical modeling concepts.
              </p>
            </CardContent>
          </Card>

          {/* Key Vocabulary */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Key Vocabulary
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                  <Edit3 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['Climate Change', 'Greenhouse Effect', 'Carbon Dioxide', 'Global Warming', 'Fossil Fuels', 'Renewable Energy', 'Carbon Footprint', 'Sustainability'].map((term) => (
                  <Badge key={term} variant="outline" className="justify-center py-2">
                    {term}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Introduction */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  Introduction
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                  <Edit3 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Climate change is one of the most pressing issues of our time. This lesson will help students understand 
                the science behind climate change, its causes, and its impacts on our planet. Through engaging activities 
                and discussions, students will explore how human activities contribute to climate change and what we can 
                do to address this global challenge.
              </p>
              <p className="text-muted-foreground">
                Students will begin by sharing their prior knowledge and then dive deep into the greenhouse effect, 
                examining data and conducting experiments to solidify their understanding.
              </p>
            </CardContent>
          </Card>

          {/* Visual Aids */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5 text-primary" />
                  Visual Aids
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                  <Edit3 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {visualAids.map((aid, index) => (
                  <div key={index} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="outline" className="text-xs">{aid.type}</Badge>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <h4 className="font-semibold mb-2 text-sm leading-snug">{aid.title}</h4>
                    <p className="text-xs text-muted-foreground mb-2">{aid.description}</p>
                    <p className="text-xs text-primary">Source: {aid.source}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Activities */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Activities
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                  <Edit3 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {activities.map((activity, index) => (
                <div key={index} className="border border-border rounded-lg p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold text-primary">{activity.title}</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm"><strong>Duration:</strong> {activity.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm"><strong>Grouping:</strong> {activity.grouping}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <span className="text-sm"><strong>Materials:</strong> {activity.materials}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Target className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span className="text-sm"><strong>Objective:</strong> {activity.objective}</span>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-semibold">Steps:</span>
                      </div>
                      <ol className="list-decimal list-inside space-y-1 ml-6">
                        {activity.steps.map((step, stepIndex) => (
                          <li key={stepIndex} className="text-sm text-muted-foreground">{step}</li>
                        ))}
                      </ol>
                    </div>
                    
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5" />
                        <div>
                          <span className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">Teacher Notes:</span>
                          <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1 italic">{activity.teacherNotes}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Real World Examples */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Real World Examples
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                  <Edit3 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {realWorldExamples.map((example, index) => (
                <div key={index} className="border-l-4 border-primary/30 pl-4 py-2">
                  <h4 className="font-semibold text-foreground mb-2">{example.title}</h4>
                  <p className="text-muted-foreground text-sm">{example.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Discussion Questions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  Discussion Questions
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                  <Edit3 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {discussionQuestions.map((item, index) => (
                <div key={index} className="border-l-4 border-blue-500/30 pl-4 py-2">
                  <h4 className="font-semibold text-foreground mb-2">{item.question}</h4>
                  <p className="text-muted-foreground text-sm italic">{item.purpose}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Current Events */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Current Events
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                  <Edit3 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {currentEvents.map((event, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-orange-600 mt-0.5" />
                    <span className="text-muted-foreground">{event}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Educational Videos */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5 text-primary" />
                  Educational Videos
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                  <Edit3 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {educationalVideos.map((video, index) => (
                  <div key={index} className="flex gap-4 p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
                    <div className="w-32 h-20 bg-muted rounded-lg flex items-center justify-center">
                      <Play className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-primary mb-1">{video.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{video.description}</p>
                      <p className="text-xs text-muted-foreground">Source: {video.source}</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Assessment */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Assessment
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                  <Edit3 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Formative Assessment</h4>
                <p className="text-muted-foreground">
                  Observe student participation during discussions and hands-on activities. 
                  Use exit tickets to assess understanding of key concepts. Monitor group work 
                  and provide feedback during experimental activities.
                </p>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Summative Assessment</h4>
                <p className="text-muted-foreground">
                  Students will create a poster or digital presentation explaining one solution to climate change, 
                  demonstrating their understanding of the topic. Assessment will include accuracy of scientific 
                  concepts, creativity, and ability to communicate solutions effectively.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Differentiation */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  Differentiation
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                  <Edit3 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="font-semibold">For Advanced Learners:</h4>
                <p className="text-muted-foreground">Research specific climate change impacts in different regions of the world. Analyze complex climate data and create predictive models.</p>
              </div>
              <div>
                <h4 className="font-semibold">For Struggling Learners:</h4>
                <p className="text-muted-foreground">Provide simplified diagrams and one-on-one support during activities. Use graphic organizers to help structure learning.</p>
              </div>
              <div>
                <h4 className="font-semibold">For ELL Students:</h4>
                <p className="text-muted-foreground">Include visual aids and bilingual resources where available. Pair with bilingual peers for support.</p>
              </div>
            </CardContent>
          </Card>

          {/* Educational Resources */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Educational Resources
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                  <Edit3 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {resources.map((resource, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <h4 className="font-medium">{resource.title}</h4>
                      <p className="text-sm text-muted-foreground">Source: {resource.source}</p>
                    </div>
                    <Badge variant="outline">{resource.type}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center pt-6">
            <Button variant="outline" size="lg">
              <FileText className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button size="lg">
              <BookOpen className="h-4 w-4 mr-2" />
              Save to Repository
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPlanOutput;