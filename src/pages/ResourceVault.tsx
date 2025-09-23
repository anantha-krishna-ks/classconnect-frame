import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { Textarea } from '@/components/ui/textarea';

const ResourceVault = () => {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [searchTopic, setSearchTopic] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [showStudyPal, setShowStudyPal] = useState(false);
  const [resources, setResources] = useState<any[]>([]);
  const [chatHistory, setChatHistory] = useState<any[]>([]);

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

  // Mock resources data
  const mockResources = [
    {
      id: 1,
      title: 'NCERT Mathematics Textbook',
      type: 'PDF',
      description: 'Official NCERT textbook for Class 10 Mathematics',
      icon: FileText,
      link: '#'
    },
    {
      id: 2,
      title: 'Khan Academy - Algebra Basics',
      type: 'Video',
      description: 'Comprehensive video series on algebra fundamentals',
      icon: Video,
      link: '#'
    },
    {
      id: 3,
      title: 'RD Sharma Solutions',
      type: 'PDF',
      description: 'Step-by-step solutions for RD Sharma problems',
      icon: FileText,
      link: '#'
    },
    {
      id: 4,
      title: 'Interactive Geometry Tool',
      type: 'Link',
      description: 'Online tool for geometric constructions and visualizations',
      icon: ExternalLink,
      link: '#'
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
        bot: "I understand you're looking for help with this concept. Let me provide a simpler explanation with examples..."
      };
      setChatHistory([...chatHistory, newMessage]);
      setChatMessage('');
    }
  };

  const handleQuickTest = () => {
    // Navigate to a quick test page or show inline test
    alert('Quick Test feature will be implemented soon!');
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
    <div className="min-h-screen bg-white">
      {/* Main Header */}
      <header className="border-b border-gray-100 px-6 py-3" style={{ backgroundColor: '#3B54A5' }}>
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
                className="text-white hover:bg-white/20 hover:text-white border border-white/20 hover:border-white/40 transition-all duration-200"
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
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Home className="w-4 h-4" />
            <span className="mx-2">/</span>
            <button 
              onClick={handleBack}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Student Dashboard
            </button>
            <span className="mx-2">/</span>
            <span className="text-blue-600 font-medium">Resource Vault</span>
          </nav>
          <Button
            variant="outline"
            size="sm"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Resource Vault</h1>
              <p className="text-gray-600">Access all your study materials and get help with any concept</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="finder" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="finder">My Resource Finder</TabsTrigger>
            <TabsTrigger value="search">Search by Topic</TabsTrigger>
          </TabsList>

          {/* Resource Finder Tab */}
          <TabsContent value="finder" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Find Resources by Subject & Chapter</CardTitle>
                <CardDescription>
                  Select your subject and chapter to access relevant study materials
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Subject</label>
                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Chapter</label>
                    <Select 
                      value={selectedChapter} 
                      onValueChange={setSelectedChapter}
                      disabled={!selectedSubject}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a chapter" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedSubject && chapters[selectedSubject as keyof typeof chapters]?.map((chapter) => (
                          <SelectItem key={chapter.id} value={chapter.id}>
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
                  className="w-full bg-pink-500 hover:bg-pink-600"
                >
                  Provide Resources
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Search by Topic Tab */}
          <TabsContent value="search" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Search by Concept or Topic</CardTitle>
                <CardDescription>
                  Type any specific concept or phrase to find related resources
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter a concept, topic, or phrase..."
                    value={searchTopic}
                    onChange={(e) => setSearchTopic(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleTopicSearch()}
                  />
                  <Button onClick={handleTopicSearch} className="bg-pink-500 hover:bg-pink-600">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Resources Display */}
        {resources.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Available Resources</CardTitle>
              <CardDescription>
                Found {resources.length} resources for your selection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resources.map((resource) => {
                  const IconComponent = getResourceIcon(resource.type);
                  return (
                    <div key={resource.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3 mb-3">
                        <IconComponent className="w-5 h-5 text-pink-500 mt-1" />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{resource.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                        </div>
                        <Badge variant="secondary">{resource.type}</Badge>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Access Resource
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Resource Usefulness Feedback */}
        {resources.length > 0 && (
          <Card className="mt-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Were these resources useful?</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    Yes
                  </Button>
                  <Button variant="outline" size="sm">
                    <ThumbsDown className="w-4 h-4 mr-2" />
                    No
                  </Button>
                  <Button onClick={handleQuickTest} className="bg-blue-500 hover:bg-blue-600" size="sm">
                    <Brain className="w-4 h-4 mr-2" />
                    Take a Quick Test
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* StudyPal Floating Chatbot */}
      <Dialog open={showStudyPal} onOpenChange={setShowStudyPal}>
        <DialogTrigger asChild>
          <Button
            className="fixed bottom-6 right-6 rounded-full w-14 h-14 bg-pink-500 hover:bg-pink-600 shadow-lg"
            size="icon"
          >
            <MessageSquare className="w-6 h-6 text-white" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md max-h-96">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-pink-500" />
              StudyPal
            </DialogTitle>
            <DialogDescription>
              Ask me anything about the concepts you're studying!
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Chat History */}
            <div className="max-h-40 overflow-y-auto space-y-2">
              {chatHistory.map((chat) => (
                <div key={chat.id} className="space-y-2">
                  <div className="bg-blue-50 p-2 rounded text-sm">
                    <strong>You:</strong> {chat.user}
                  </div>
                  <div className="bg-pink-50 p-2 rounded text-sm">
                    <strong>StudyPal:</strong> {chat.bot}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Message Input */}
            <div className="space-y-2">
              <Textarea
                placeholder="Type your question or concept you need help with..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                rows={3}
              />
              <Button onClick={handleStudyPalMessage} className="w-full bg-pink-500 hover:bg-pink-600">
                Send Message
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResourceVault;