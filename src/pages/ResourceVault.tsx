import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  BookOpen, 
  MessageCircle, 
  Home, 
  ArrowLeft,
  LogOut,
  Download,
  Play,
  Link,
  FileText,
  Video,
  ExternalLink,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Brain
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';

const ResourceVault = () => {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [searchTopic, setSearchTopic] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [showStudyPal, setShowStudyPal] = useState(false);
  const [selectedResource, setSelectedResource] = useState<any>(null);
  const [resources, setResources] = useState<any[]>([]);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [showQuickTest, setShowQuickTest] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [testAnswers, setTestAnswers] = useState<number[]>([]);
  const [resourceFeedback, setResourceFeedback] = useState<string | null>(null);

  const handleLogout = () => {
    navigate('/student-login');
  };

  const handleBack = () => {
    navigate('/student-dashboard');
  };

  // Mock data for subjects and chapters
  const subjects = [
    { id: 'math', name: 'Mathematics' },
    { id: 'physics', name: 'Physics' },
    { id: 'chemistry', name: 'Chemistry' },
    { id: 'biology', name: 'Biology' },
    { id: 'english', name: 'English' },
    { id: 'history', name: 'History' }
  ];

  const chapters = {
    math: [
      { id: 'algebra', name: 'Algebra' },
      { id: 'geometry', name: 'Geometry' },
      { id: 'calculus', name: 'Calculus' }
    ],
    physics: [
      { id: 'mechanics', name: 'Mechanics' },
      { id: 'thermodynamics', name: 'Thermodynamics' },
      { id: 'optics', name: 'Optics' }
    ],
    chemistry: [
      { id: 'organic', name: 'Organic Chemistry' },
      { id: 'inorganic', name: 'Inorganic Chemistry' },
      { id: 'physical', name: 'Physical Chemistry' }
    ]
  };

  // Mock resources data with detailed content
  const mockResources = [
    {
      id: 1,
      title: 'NCERT Mathematics Textbook - Chapter 1: Real Numbers',
      type: 'PDF',
      description: 'Official NCERT textbook for Class 10 Mathematics',
      icon: FileText,
      link: '#',
      content: {
        summary: 'This chapter introduces the concept of real numbers, including rational and irrational numbers, their decimal expansions, and fundamental properties.',
        keyTopics: [
          'Euclid\'s Division Lemma',
          'The Fundamental Theorem of Arithmetic',
          'Revisiting Irrational Numbers',
          'Revisiting Rational Numbers and Their Decimal Expansions'
        ],
        examples: [
          'Finding HCF and LCM using prime factorization',
          'Proving √2 is irrational',
          'Decimal expansion of rational numbers'
        ],
        exercises: '1.1 to 1.4 with solutions',
        difficulty: 'Intermediate'
      }
    },
    {
      id: 2,
      title: 'Khan Academy - Algebra Basics: Linear Equations',
      type: 'Video',
      description: 'Comprehensive video series on algebra fundamentals',
      icon: Video,
      link: '#',
      content: {
        summary: 'Master the fundamentals of linear equations through step-by-step video explanations and practice problems.',
        keyTopics: [
          'What is a linear equation?',
          'Solving one-step equations',
          'Solving multi-step equations',
          'Equations with variables on both sides'
        ],
        duration: '2 hours 15 minutes',
        exercises: '25 practice problems with instant feedback',
        difficulty: 'Beginner to Intermediate',
        transcript: 'Full transcript available with timestamps'
      }
    },
    {
      id: 3,
      title: 'RD Sharma Solutions - Quadratic Equations',
      type: 'PDF',
      description: 'Step-by-step solutions for RD Sharma problems',
      icon: FileText,
      link: '#',
      content: {
        summary: 'Complete solutions manual for RD Sharma\'s Quadratic Equations chapter with detailed explanations.',
        keyTopics: [
          'Introduction to Quadratic Equations',
          'Solution of Quadratic Equations by Factorisation',
          'Solution of Quadratic Equations by Completing the Square',
          'Nature of Roots'
        ],
        examples: [
          '150+ solved problems',
          'Multiple solution methods for each problem',
          'Conceptual explanations for each step'
        ],
        exercises: 'Exercise 8.1 to 8.6 fully solved',
        difficulty: 'Intermediate to Advanced'
      }
    },
    {
      id: 4,
      title: 'Interactive Geometry Tool - Circle Properties',
      type: 'Link',
      description: 'Online tool for geometric constructions and visualizations',
      icon: ExternalLink,
      link: '#',
      content: {
        summary: 'Interactive web application to explore circle properties, construct geometric figures, and visualize theorems.',
        keyTopics: [
          'Circle construction and properties',
          'Tangent and chord relationships',
          'Angle theorems in circles',
          'Arc length and sector area calculations'
        ],
        features: [
          'Drag-and-drop construction tools',
          'Real-time measurements',
          'Step-by-step construction guides',
          'Export constructions as images'
        ],
        exercises: '20+ interactive activities',
        difficulty: 'All levels'
      }
    }
  ];

  const handleProvideResources = () => {
    if (selectedSubject && selectedChapter) {
      setResources(mockResources);
    }
  };

  const handleTopicSearch = () => {
    if (searchTopic.trim()) {
      setResources(mockResources.filter(r => 
        r.title.toLowerCase().includes(searchTopic.toLowerCase()) ||
        r.description.toLowerCase().includes(searchTopic.toLowerCase())
      ));
    }
  };

  const handleStudyPalMessage = () => {
    if (chatMessage.trim()) {
      const newMessage = {
        id: Date.now(),
        user: chatMessage,
        bot: "I understand you're looking for help with this concept. Let me provide a simpler explanation with examples and suggest some additional resources that might help clarify this topic for you."
      };
      setChatHistory([...chatHistory, newMessage]);
      setChatMessage('');
    }
  };

  const handleResourceFeedback = (feedback: string) => {
    setResourceFeedback(feedback);
    if (feedback === 'no') {
      const helpMessage = {
        id: Date.now(),
        user: 'The resources were not helpful',
        bot: "I'm sorry the resources weren't helpful. Can you tell me specifically what concept you're struggling with? I can provide alternative explanations or suggest different learning approaches."
      };
      setChatHistory([...chatHistory, helpMessage]);
    }
  };

  // Mock MCQ questions
  const mockQuestions = [
    {
      id: 1,
      question: "What is the square root of 144?",
      options: ["10", "12", "14", "16"],
      correct: 1
    },
    {
      id: 2,
      question: "Which of the following is an irrational number?",
      options: ["√4", "√9", "√2", "√16"],
      correct: 2
    },
    {
      id: 3,
      question: "What is the value of 3² + 4²?",
      options: ["25", "24", "49", "14"],
      correct: 0
    },
    {
      id: 4,
      question: "In the equation 2x + 5 = 13, what is the value of x?",
      options: ["3", "4", "5", "6"],
      correct: 1
    },
    {
      id: 5,
      question: "What is the perimeter of a rectangle with length 8 and width 5?",
      options: ["26", "40", "13", "30"],
      correct: 0
    }
  ];

  const handleQuickTest = () => {
    setShowQuickTest(true);
    setCurrentQuestion(0);
    setTestAnswers([]);
  };

  const handleTestAnswer = (answerIndex: number) => {
    const newAnswers = [...testAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setTestAnswers(newAnswers);
    
    if (currentQuestion < mockQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Test completed
      const score = newAnswers.reduce((acc, answer, index) => {
        return acc + (answer === mockQuestions[index].correct ? 1 : 0);
      }, 0);
      
      const resultMessage = {
        id: Date.now(),
        user: 'Quick test completed',
        bot: `Great job! You scored ${score}/${mockQuestions.length}. ${score >= 3 ? 'Well done! You have a good understanding of these concepts.' : 'Keep practicing! I can help explain the concepts you found challenging.'}`
      };
      setChatHistory([...chatHistory, resultMessage]);
      setShowQuickTest(false);
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'PDF': return FileText;
      case 'Video': return Video;
      case 'Link': return ExternalLink;
      default: return FileText;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Main Header */}
      <header className="border-b border-gray-100 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <img 
            src="/lovable-uploads/c278e3c9-20de-45b8-a466-41c546111a8a.png" 
            alt="ExcelSchoolAi" 
            className="h-10 w-auto"
          />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 hover:text-white border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to logout? You will be redirected to the student login page.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout} className="bg-red-600 hover:bg-red-700">
                  Yes, Logout
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </header>

      {/* Breadcrumbs Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Home className="w-4 h-4" />
            <span className="mx-2">/</span>
            <button 
              onClick={handleBack}
              className="text-purple-600 hover:text-purple-800 font-medium transition-colors duration-200 hover:underline"
            >
              Student Dashboard
            </button>
            <span className="mx-2">/</span>
            <span className="text-purple-600 font-medium">Resource Vault</span>
          </nav>
          <Button
            variant="outline"
            size="sm"
            onClick={handleBack}
            className="flex items-center gap-2 hover:bg-purple-50 hover:border-purple-200 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-300">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Resource Vault
              </h1>
              <p className="text-gray-600 text-lg">Access all your study materials and get help with any concept</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Resource Finder */}
          <Card className="overflow-hidden border-0 shadow-xl bg-white/70 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 animate-fade-in">
            <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 p-1">
              <CardHeader className="bg-white/80 backdrop-blur-sm">
                <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Find Resources by Subject & Chapter
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Select your subject and chapter to access relevant study materials
                </CardDescription>
              </CardHeader>
            </div>
            <CardContent className="space-y-6 p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700">Subject</label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-purple-300 focus:border-purple-500 transition-colors duration-200">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-2 border-gray-200 shadow-xl">
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id} className="hover:bg-purple-50 transition-colors duration-200">
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700">Chapter</label>
                  <Select 
                    value={selectedChapter} 
                    onValueChange={setSelectedChapter}
                    disabled={!selectedSubject}
                  >
                    <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-purple-300 focus:border-purple-500 transition-colors duration-200">
                      <SelectValue placeholder="Select a chapter" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-2 border-gray-200 shadow-xl">
                      {selectedSubject && chapters[selectedSubject as keyof typeof chapters]?.map((chapter) => (
                        <SelectItem key={chapter.id} value={chapter.id} className="hover:bg-purple-50 transition-colors duration-200">
                          {chapter.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={handleProvideResources}
                disabled={!selectedSubject || !selectedChapter}
                className="w-full h-12 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Provide Resources
              </Button>
            </CardContent>
          </Card>

          {/* Search by Topic */}
          <Card className="overflow-hidden border-0 shadow-xl bg-white/70 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 animate-fade-in">
            <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 p-1">
              <CardHeader className="bg-white/80 backdrop-blur-sm">
                <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Search by Concept or Topic
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Type any specific concept or phrase to find related resources
                </CardDescription>
              </CardHeader>
            </div>
            <CardContent className="p-8">
              <div className="flex gap-3">
                <Input
                  placeholder="Enter a concept, topic, or phrase..."
                  value={searchTopic}
                  onChange={(e) => setSearchTopic(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleTopicSearch()}
                  className="h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors duration-200"
                />
                <Button 
                  onClick={handleTopicSearch} 
                  className="h-12 px-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <Search className="w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resources Display */}
        {resources.length > 0 && (
          <Card className="mt-8 overflow-hidden border-0 shadow-xl bg-white/70 backdrop-blur-sm animate-fade-in">
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-1">
              <CardHeader className="bg-white/80 backdrop-blur-sm">
                <CardTitle className="text-2xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Available Resources
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Found {resources.length} resources for your selection
                </CardDescription>
              </CardHeader>
            </div>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {resources.map((resource, index) => {
                  const IconComponent = getResourceIcon(resource.type);
                  return (
                    <div 
                      key={resource.id} 
                      className="group border-2 border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:border-purple-200 transition-all duration-300 cursor-pointer bg-gradient-to-br from-white to-gray-50/50 hover:scale-105 animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                      onClick={() => setSelectedResource(resource)}
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <IconComponent className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors duration-200">
                            {resource.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{resource.description}</p>
                        </div>
                        <Badge variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors duration-200">
                          {resource.type}
                        </Badge>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full border-2 border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200" 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedResource(resource);
                        }}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Resource Detail Modal */}
      <Dialog open={!!selectedResource} onOpenChange={() => setSelectedResource(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedResource && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3 text-xl">
                  {React.createElement(getResourceIcon(selectedResource.type), { className: "w-6 h-6 text-purple-500" })}
                  {selectedResource.title}
                </DialogTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary">{selectedResource.type}</Badge>
                  {selectedResource.content.difficulty && (
                    <Badge variant="outline">{selectedResource.content.difficulty}</Badge>
                  )}
                </div>
              </DialogHeader>
              
              <div className="space-y-6 mt-6">
                {/* Summary */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Overview</h3>
                  <p className="text-gray-600">{selectedResource.content.summary}</p>
                </div>

                {/* Key Topics */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Key Topics Covered</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedResource.content.keyTopics.map((topic: string, index: number) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-purple-50 rounded">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-sm">{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Examples or Features */}
                {selectedResource.content.examples && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Examples & Applications</h3>
                    <ul className="space-y-2">
                      {selectedResource.content.examples.map((example: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-purple-500 mt-1">•</span>
                          <span className="text-sm text-gray-600">{example}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedResource.content.features && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Features</h3>
                    <ul className="space-y-2">
                      {selectedResource.content.features.map((feature: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-purple-500 mt-1">•</span>
                          <span className="text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Additional Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  {selectedResource.content.duration && (
                    <div>
                      <span className="font-medium text-sm">Duration:</span>
                      <p className="text-sm text-gray-600">{selectedResource.content.duration}</p>
                    </div>
                  )}
                  {selectedResource.content.exercises && (
                    <div>
                      <span className="font-medium text-sm">Exercises:</span>
                      <p className="text-sm text-gray-600">{selectedResource.content.exercises}</p>
                    </div>
                  )}
                  {selectedResource.content.transcript && (
                    <div>
                      <span className="font-medium text-sm">Additional:</span>
                      <p className="text-sm text-gray-600">{selectedResource.content.transcript}</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download Resource
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* StudyPal Right Side Drawer */}
      <Sheet open={showStudyPal} onOpenChange={setShowStudyPal}>
        <SheetTrigger asChild>
          <Button
            className="fixed bottom-6 right-6 rounded-full w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-2xl hover:shadow-purple-500/25 transform hover:scale-110 transition-all duration-300"
            size="icon"
          >
            <MessageSquare className="w-7 h-7 text-white" />
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-lg flex flex-col h-screen">
          <SheetHeader className="pb-4 border-b flex-shrink-0">
            <SheetTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              StudyPal
            </SheetTitle>
            <SheetDescription>
              Your AI learning assistant is here to help!
            </SheetDescription>
          </SheetHeader>
          
          <div className="flex-1 flex flex-col min-h-0">
            {/* Chat Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: 'calc(100vh - 200px)' }}>
              {chatHistory.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Brain className="w-8 h-8 text-purple-500" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">Hello! I'm StudyPal</h3>
                    <p className="text-sm text-gray-500 max-w-xs">
                      I'm here to help you understand any concept you're struggling with. Just ask me anything!
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {chatHistory.map((chat) => (
                    <div key={chat.id} className="space-y-3">
                      {/* User Message */}
                      <div className="flex justify-end">
                        <div className="max-w-[80%] bg-purple-500 text-white rounded-2xl rounded-br-md px-4 py-2">
                          <p className="text-sm">{chat.user}</p>
                        </div>
                      </div>
                      
                      {/* Bot Message */}
                      <div className="flex justify-start">
                        <div className="flex items-start gap-2 max-w-[80%]">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Brain className="w-4 h-4 text-purple-500" />
                          </div>
                          <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-2">
                            <p className="text-sm text-gray-800">{chat.bot}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Resource Feedback Section - Show after conversation */}
                  {chatHistory.length > 0 && resources.length > 0 && !resourceFeedback && (
                    <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100">
                      <div className="flex items-start gap-2 mb-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Brain className="w-4 h-4 text-purple-500" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">Quick Feedback</h4>
                          <p className="text-sm text-gray-600 mb-3">Were the resources I provided helpful for your learning?</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleResourceFeedback('yes')}
                          className="flex-1 border-green-200 text-green-700 hover:bg-green-50"
                        >
                          <ThumbsUp className="w-4 h-4 mr-2" />
                          Yes, helpful
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleResourceFeedback('no')}
                          className="flex-1 border-red-200 text-red-700 hover:bg-red-50"
                        >
                          <ThumbsDown className="w-4 h-4 mr-2" />
                          Not helpful
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Quick Test Section - Show after conversation */}
                  {chatHistory.length > 0 && resources.length > 0 && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                      <div className="flex items-start gap-2 mb-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Brain className="w-4 h-4 text-blue-500" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">Test Your Knowledge</h4>
                          <p className="text-sm text-gray-600 mb-3">
                            Ready to test what you've learned? Take a quick 5-question quiz!
                          </p>
                        </div>
                      </div>
                      <Button 
                        onClick={handleQuickTest} 
                        className="w-full bg-blue-500 hover:bg-blue-600"
                        disabled={showQuickTest}
                      >
                        <Brain className="w-4 h-4 mr-2" />
                        Start Quick Test
                      </Button>
                    </div>
                  )}
                </>
              )}

              {/* Quick Test Display */}
              {showQuickTest && (
                <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">Question {currentQuestion + 1}</h4>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 transition-all duration-300"
                          style={{ width: `${((currentQuestion + 1) / mockQuestions.length) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{currentQuestion + 1}/{mockQuestions.length}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="font-medium text-gray-900">{mockQuestions[currentQuestion].question}</p>
                    <div className="space-y-2">
                      {mockQuestions[currentQuestion].options.map((option, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="w-full text-left justify-start hover:bg-indigo-50 hover:border-indigo-200"
                          onClick={() => handleTestAnswer(index)}
                        >
                          <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium mr-3">
                            {String.fromCharCode(65 + index)}
                          </span>
                          {option}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Message Input Area */}
            <div className="border-t p-4 bg-white flex-shrink-0">
              <div className="flex gap-2">
                <Textarea
                  placeholder="Ask me about any concept you're struggling with..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  rows={2}
                  className="resize-none flex-1"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleStudyPalMessage();
                    }
                  }}
                />
                <Button 
                  onClick={handleStudyPalMessage} 
                  className="bg-purple-500 hover:bg-purple-600 px-4"
                  disabled={!chatMessage.trim()}
                  size="icon"
                >
                  <MessageSquare className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">Press Enter to send, Shift+Enter for new line</p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ResourceVault;