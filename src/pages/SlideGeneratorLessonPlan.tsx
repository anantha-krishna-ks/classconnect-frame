import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, FileText, Loader2, Play, Edit, Save, Download, Plus, Trash2, Eye, Type, Table, List, MessageSquare, Image as ImageIcon, BarChart3, Video, Shapes, Layout, Grid, LayoutList, Lock, User, Clock, Copy, Move, BookOpen, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader } from '@/components/ui/loader';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger, ContextMenuSeparator } from '@/components/ui/context-menu';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface GeneratedSlide {
  id: string;
  title: string;
  content: string;
  type: 'title' | 'content' | 'image' | 'chart';
  thumbnail: string;
}

interface SavedPresentation {
  id: string;
  title: string;
  thumbnail: string;
  createdAt: Date;
  lastViewed: Date;
  isPrivate: boolean;
  slideCount: number;
  slides: GeneratedSlide[];
}

const SlideGeneratorLessonPlan = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [instructionsText, setInstructionsText] = useState('');
  const [generatedSlides, setGeneratedSlides] = useState<GeneratedSlide[]>([]);
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [isEditorMode, setIsEditorMode] = useState(false);
  const [savedPresentations, setSavedPresentations] = useState<SavedPresentation[]>([]);
  const [showSavedPresentations, setShowSavedPresentations] = useState(false);
  
  // New dropdown states
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedChapter, setSelectedChapter] = useState<string>('');
  const [selectedSessionPlans, setSelectedSessionPlans] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'database' | 'upload'>('database');

  // Mock data for dropdowns
  const classes = ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];
  const subjects = ['Science', 'Mathematics', 'English', 'Social Studies', 'Hindi', 'Physics', 'Chemistry', 'Biology'];
  const chapters = ['Chapter 1: Introduction', 'Chapter 2: Basic Concepts', 'Chapter 3: Advanced Topics', 'Chapter 4: Applications'];
  const sessionPlans = ['Session 1: Overview', 'Session 2: Theory', 'Session 3: Practical', 'Session 4: Review', 'Session 5: Assessment'];

  // Load saved presentations on mount
  useEffect(() => {
    const mockSavedPresentations: SavedPresentation[] = [
      {
        id: '1',
        title: 'Photosynthesis Overview',
        thumbnail: 'bg-gradient-to-br from-green-400 to-blue-500',
        createdAt: new Date('2024-01-15'),
        lastViewed: new Date('2024-01-20'),
        isPrivate: false,
        slideCount: 5,
        slides: []
      },
      {
        id: '2',
        title: 'Chemical Bonding',
        thumbnail: 'bg-gradient-to-br from-purple-400 to-pink-500',
        createdAt: new Date('2024-01-10'),
        lastViewed: new Date('2024-01-18'),
        isPrivate: true,
        slideCount: 8,
        slides: []
      }
    ];
    setSavedPresentations(mockSavedPresentations);
  }, []);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setIsUploading(true);
      
      setTimeout(() => {
        setIsUploading(false);
        toast.success('File uploaded successfully!');
      }, 1500);
    }
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
  }, []);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setIsUploading(true);
      
      setTimeout(() => {
        setIsUploading(false);
        toast.success('File uploaded successfully!');
      }, 1500);
    }
  }, []);

  const generatePPT = () => {
    if (activeTab === 'upload' && !file) {
      toast.error('Please upload a lesson plan first');
      return;
    }
    
    if (activeTab === 'database') {
      if (!selectedClass || !selectedSubject || !selectedChapter || selectedSessionPlans.length === 0) {
        toast.error('Please select Class, Subject, Chapter, and at least one Session Plan');
        return;
      }
    }

    setIsGenerating(true);
    
    setTimeout(() => {
      const mockSlides: GeneratedSlide[] = [
        {
          id: '1',
          title: 'Introduction to Photosynthesis',
          content: 'Welcome to our lesson on photosynthesis - the process by which plants make their own food.',
          type: 'title',
          thumbnail: 'bg-gradient-to-br from-green-400 to-blue-500'
        },
        {
          id: '2',
          title: 'What is Photosynthesis?',
          content: 'Photosynthesis is the process by which green plants use sunlight, water, and carbon dioxide to produce glucose and oxygen.',
          type: 'content',
          thumbnail: 'bg-gradient-to-br from-blue-400 to-purple-500'
        },
        {
          id: '3',
          title: 'The Photosynthesis Equation',
          content: '6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂',
          type: 'content',
          thumbnail: 'bg-gradient-to-br from-purple-400 to-pink-500'
        },
        {
          id: '4',
          title: 'Chloroplast Structure',
          content: 'Interactive diagram showing the internal structure of a chloroplast.',
          type: 'image',
          thumbnail: 'bg-gradient-to-br from-pink-400 to-red-500'
        },
        {
          id: '5',
          title: 'Factors Affecting Photosynthesis',
          content: 'Light intensity, temperature, and CO₂ concentration all affect the rate of photosynthesis.',
          type: 'chart',
          thumbnail: 'bg-gradient-to-br from-red-400 to-orange-500'
        }
      ];
      
      setGeneratedSlides(mockSlides);
      setIsGenerating(false);
      setIsEditorMode(true);
      toast.success('Presentation generated successfully!');
    }, 3000);
  };

  const handleSessionPlanChange = (sessionPlan: string, checked: boolean) => {
    if (checked) {
      setSelectedSessionPlans([...selectedSessionPlans, sessionPlan]);
    } else {
      setSelectedSessionPlans(selectedSessionPlans.filter(plan => plan !== sessionPlan));
    }
  };

  const handleSelectAllSessionPlans = (checked: boolean) => {
    if (checked) {
      setSelectedSessionPlans([...sessionPlans]);
    } else {
      setSelectedSessionPlans([]);
    }
  };

  const savePresentation = () => {
    const newPresentation: SavedPresentation = {
      id: Date.now().toString(),
      title: `${selectedSubject || 'New'} Presentation`,
      thumbnail: 'bg-gradient-to-br from-blue-400 to-purple-500',
      createdAt: new Date(),
      lastViewed: new Date(),
      isPrivate: false,
      slideCount: generatedSlides.length,
      slides: generatedSlides
    };
    
    setSavedPresentations(prev => [newPresentation, ...prev]);
    setShowSavedPresentations(true);
    toast.success('Presentation saved successfully!');
  };

  const deletePresentation = (id: string) => {
    setSavedPresentations(prev => prev.filter(p => p.id !== id));
    toast.success('Presentation deleted successfully!');
  };

  const duplicatePresentation = (presentation: SavedPresentation) => {
    const duplicated: SavedPresentation = {
      ...presentation,
      id: Date.now().toString(),
      title: `${presentation.title} (Copy)`,
      createdAt: new Date(),
      lastViewed: new Date()
    };
    setSavedPresentations(prev => [duplicated, ...prev]);
    toast.success('Presentation duplicated successfully!');
  };

  const openPresentation = (presentation: SavedPresentation) => {
    setGeneratedSlides(presentation.slides);
    setActiveSlide(0);
    setIsEditorMode(true);
    setSavedPresentations(prev => 
      prev.map(p => p.id === presentation.id ? { ...p, lastViewed: new Date() } : p)
    );
  };

  // Loading overlay during generation
  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 mb-4 mx-auto" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Creating Your Presentation</h2>
          <p className="text-gray-600 mb-4">Our AI is analyzing your lesson plan and generating slides...</p>
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-md mx-auto">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-700">Analyzing content structure</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-700">Generating slide layouts</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-purple-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-700">Optimizing visual elements</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Editor mode - show the slide editor
  if (isEditorMode && generatedSlides.length > 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditorMode(false)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Generator
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Photosynthesis Presentation</h1>
                <p className="text-sm text-gray-500">{generatedSlides.length} slides</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline" size="sm" onClick={savePresentation}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </header>

        <div className="flex-1 flex">
          {/* Left Panel - Slide Navigator */}
          <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
              <h3 className="font-medium text-gray-900 mb-4">Slides</h3>
              <div className="space-y-2">
                {generatedSlides.map((slide, index) => (
                  <div
                    key={slide.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      activeSlide === index 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveSlide(index)}
                  >
                    <div className={`w-full h-16 rounded mb-2 ${slide.thumbnail}`}></div>
                    <p className="text-sm font-medium text-gray-900 truncate">{slide.title}</p>
                    <p className="text-xs text-gray-500">Slide {index + 1}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Canvas */}
          <div className="flex-1 p-8 overflow-auto">
            <div className="max-w-4xl mx-auto">
              <div 
                className="rounded-lg shadow-lg relative bg-white" 
                style={{ aspectRatio: '16/9' }}
              >
                <div className="p-8 h-full flex flex-col justify-center">
                  <h1 
                    contentEditable
                    suppressContentEditableWarning
                    className="text-4xl font-bold mb-6 outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 rounded p-2 text-gray-900"
                  >
                    {generatedSlides[activeSlide]?.title}
                  </h1>
                  <div 
                    contentEditable
                    suppressContentEditableWarning
                    className="text-xl leading-relaxed outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 rounded p-2 min-h-[200px] text-gray-700"
                    dangerouslySetInnerHTML={{ __html: generatedSlides[activeSlide]?.content || '' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Tools */}
          <div className="w-72 bg-white border-l border-gray-200 overflow-y-auto">
            <div className="p-6">
              <h3 className="font-medium text-gray-900 mb-4">Add Elements</h3>
              
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Text & Content</h4>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" size="sm" className="text-xs h-12 flex flex-col p-3">
                    <Type className="w-4 h-4 mb-1" />
                    Text
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs h-12 flex flex-col p-3">
                    <Table className="w-4 h-4 mb-1" />
                    Table
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs h-12 flex flex-col p-3">
                    <List className="w-4 h-4 mb-1" />
                    List
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs h-12 flex flex-col p-3">
                    <MessageSquare className="w-4 h-4 mb-1" />
                    Callout
                  </Button>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Media</h4>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" size="sm" className="text-xs h-12 flex flex-col p-3">
                    <ImageIcon className="w-4 h-4 mb-1" />
                    Image
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs h-12 flex flex-col p-3">
                    <Video className="w-4 h-4 mb-1" />
                    Video
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs h-12 flex flex-col p-3">
                    <BarChart3 className="w-4 h-4 mb-1" />
                    Chart
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs h-12 flex flex-col p-3">
                    <Shapes className="w-4 h-4 mb-1" />
                    Shapes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Initial form view
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/slide-generator')}
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Slide Generator
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Lesson Plan to PPT
              </h1>
              <p className="text-xl text-gray-600">
                Transform your lesson plans into engaging presentations with AI assistance
              </p>
            </div>
            {savedPresentations.length > 0 && (
              <Button
                variant="outline"
                onClick={() => setShowSavedPresentations(!showSavedPresentations)}
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                {showSavedPresentations ? 'Hide' : 'View'} Saved PPTs ({savedPresentations.length})
              </Button>
            )}
          </div>
        </div>

        {/* Saved Presentations List */}
        {showSavedPresentations && savedPresentations.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Saved Presentations
              </CardTitle>
              <CardDescription>
                Manage your previously created presentations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedPresentations.map((presentation) => (
                  <ContextMenu key={presentation.id}>
                    <ContextMenuTrigger>
                      <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300 bg-gradient-to-br from-white to-gray-50/50 hover:from-white hover:to-blue-50/30 overflow-hidden">
                        <CardContent className="p-0">
                          {/* Thumbnail with overlay */}
                          <div className="relative">
                            <div className={`w-full h-32 ${presentation.thumbnail} relative`}>
                              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>
                              <div className="absolute top-3 right-3 flex gap-1">
                                {presentation.isPrivate && (
                                  <Badge variant="secondary" className="bg-white/90 text-gray-700 h-6 px-2">
                                    <Lock className="w-3 h-3 mr-1" />
                                    Private
                                  </Badge>
                                )}
                                <Badge variant="secondary" className="bg-white/90 text-gray-700 h-6 px-2">
                                  {presentation.slideCount} slides
                                </Badge>
                              </div>
                            </div>
                          </div>
                          
                          {/* Content */}
                          <div className="p-5">
                            <h3 className="font-bold text-gray-900 mb-2 text-lg leading-tight group-hover:text-blue-600 transition-colors truncate">
                              {presentation.title}
                            </h3>
                            
                            <div className="text-xs text-gray-500 space-y-1 mb-4">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Created {presentation.createdAt.toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                Last viewed {presentation.lastViewed.toLocaleDateString()}
                              </div>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="space-y-3">
                              {/* Primary Download Button */}
                              <Button 
                                size="sm" 
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-md hover:shadow-lg transition-all"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toast.success('Downloading presentation...');
                                }}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download PPT
                              </Button>
                              
                              {/* More Actions Dropdown */}
                              <div className="flex justify-center">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      className="border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <MoreHorizontal className="w-4 h-4 mr-2" />
                                      More Options
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="center" className="w-48">
                                    <DropdownMenuItem onClick={() => openPresentation(presentation)}>
                                      <Edit className="w-4 h-4 mr-2" />
                                      Edit Presentation
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => openPresentation(presentation)}>
                                      <Eye className="w-4 h-4 mr-2" />
                                      Preview Presentation
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                      onClick={() => deletePresentation(presentation.id)}
                                      className="text-red-600 focus:text-red-600"
                                    >
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Delete Presentation
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </ContextMenuTrigger>
                    <ContextMenuContent className="w-56">
                      <ContextMenuItem onClick={() => openPresentation(presentation)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Presentation
                      </ContextMenuItem>
                      <ContextMenuItem onClick={() => openPresentation(presentation)}>
                        <Eye className="w-4 h-4 mr-2" />
                        Preview Presentation
                      </ContextMenuItem>
                      <ContextMenuItem onClick={() => toast.success('Downloading presentation...')}>
                        <Download className="w-4 h-4 mr-2" />
                        Download PPT
                      </ContextMenuItem>
                      <ContextMenuItem onClick={() => duplicatePresentation(presentation)}>
                        <Copy className="w-4 h-4 mr-2" />
                        Duplicate
                      </ContextMenuItem>
                      <ContextMenuSeparator />
                      <ContextMenuItem 
                        onClick={() => deletePresentation(presentation.id)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Presentation
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Create Presentation
            </CardTitle>
            <CardDescription>
              Choose how you want to create your presentation from lesson plan content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'database' | 'upload')} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 h-auto bg-gray-100 p-1 rounded-2xl">
                <TabsTrigger 
                  value="database" 
                  className="flex items-center gap-3 h-14 px-6 rounded-xl transition-all font-medium text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-800 shadow-none data-[state=active]:shadow-lg"
                >
                  <BookOpen className="w-4 h-4" />
                  Select from Database
                </TabsTrigger>
                <TabsTrigger 
                  value="upload" 
                  className="flex items-center gap-3 h-14 px-6 rounded-xl transition-all font-medium text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-800 shadow-none data-[state=active]:shadow-lg"
                >
                  <Upload className="w-4 h-4" />
                  Upload Document
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="database" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Class Dropdown */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Class</label>
                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                      <SelectTrigger className="h-11 bg-background">
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent className="bg-background z-50">
                        {classes.map((cls) => (
                          <SelectItem key={cls} value={cls}>
                            {cls}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Subject Dropdown */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Subject</label>
                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                      <SelectTrigger className="h-11 bg-background">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent className="bg-background z-50">
                        {subjects.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Chapter Dropdown */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Chapter</label>
                    <Select value={selectedChapter} onValueChange={setSelectedChapter}>
                      <SelectTrigger className="h-11 bg-background">
                        <SelectValue placeholder="Select chapter" />
                      </SelectTrigger>
                      <SelectContent className="bg-background z-50">
                        {chapters.map((chapter) => (
                          <SelectItem key={chapter} value={chapter}>
                            {chapter}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Session Plan Multi-Select */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Session Plans</label>
                  <div className="border border-input rounded-lg p-4 bg-background">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 border-b border-border pb-2">
                        <Checkbox
                          id="select-all"
                          checked={selectedSessionPlans.length === sessionPlans.length}
                          onCheckedChange={handleSelectAllSessionPlans}
                          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <label htmlFor="select-all" className="text-sm font-semibold text-foreground cursor-pointer">
                          Select All
                        </label>
                        {selectedSessionPlans.length > 0 && (
                          <Badge variant="secondary" className="ml-auto">
                            {selectedSessionPlans.length} selected
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {sessionPlans.map((plan) => (
                          <div key={plan} className="flex items-center space-x-2 hover:bg-muted/50 p-2 rounded-md transition-colors">
                            <Checkbox
                              id={plan}
                              checked={selectedSessionPlans.includes(plan)}
                              onCheckedChange={(checked) => handleSessionPlanChange(plan, checked as boolean)}
                              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                            />
                            <label htmlFor={plan} className="text-sm text-foreground cursor-pointer flex-1">
                              {plan}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="upload" className="space-y-6 mt-6">
                <div
                  className="border-2 border-dashed border-input rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors bg-background"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  {isUploading ? (
                    <div className="flex flex-col items-center">
                      <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                      <p className="text-muted-foreground">Uploading your lesson plan...</p>
                    </div>
                  ) : file ? (
                    <div className="flex flex-col items-center">
                      <FileText className="w-12 h-12 text-green-600 mb-4" />
                      <p className="text-lg font-medium text-foreground mb-2">{file.name}</p>
                      <p className="text-muted-foreground mb-4">File uploaded successfully!</p>
                      <Button
                        variant="outline"
                        onClick={() => setFile(null)}
                        size="sm"
                      >
                        Remove File
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-lg font-medium text-foreground mb-2">
                        Drop your lesson plan here
                      </p>
                      <p className="text-muted-foreground mb-4">
                        or click to browse for files
                      </p>
                      <p className="text-sm text-muted-foreground/70 mb-4">
                        Supported formats: DOCX, PDF, TXT (Max 10MB)
                      </p>
                      <input
                        type="file"
                        accept=".docx,.pdf,.txt"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload">
                        <Button variant="outline" className="cursor-pointer">
                          <Upload className="w-4 h-4 mr-2" />
                          Browse Files
                        </Button>
                      </label>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Instructions Section */}
        {((activeTab === 'upload' && file) || (activeTab === 'database' && selectedClass && selectedSubject && selectedChapter && selectedSessionPlans.length > 0)) && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Additional Instructions
              </CardTitle>
              <CardDescription>
                Provide specific instructions or preferences for converting your lesson plan into a presentation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="e.g., Focus on visual diagrams for complex concepts, include interactive elements, emphasize key learning objectives..."
                value={instructionsText}
                onChange={(e) => setInstructionsText(e.target.value)}
                className="min-h-[100px]"
              />
              <p className="text-sm text-muted-foreground mt-2">
                These instructions will guide the AI in creating a customized presentation that meets your specific needs.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Convert Button */}
        {((activeTab === 'upload' && file) || (activeTab === 'database' && selectedClass && selectedSubject && selectedChapter && selectedSessionPlans.length > 0)) && (
          <div className="text-center mb-8">
            <Button
              onClick={generatePPT}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
            >
              <Play className="w-5 h-5 mr-2" />
              {activeTab === 'upload' ? 'Convert to PPT' : 'Generate PPT'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SlideGeneratorLessonPlan;