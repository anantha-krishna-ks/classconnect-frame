import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
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
  Brain,
  Lightbulb,
  Target,
  Trash2,
  Copy,
  StickyNote,
  X
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
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

const ResourceVault = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [searchTopic, setSearchTopic] = useState('');
  const [searchHighlight, setSearchHighlight] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [showStudyPal, setShowStudyPal] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [selectedResource, setSelectedResource] = useState<any>(null);
  const [resources, setResources] = useState<any[]>([]);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [showQuickTest, setShowQuickTest] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [testAnswers, setTestAnswers] = useState<number[]>([]);
  const [resourceFeedback, setResourceFeedback] = useState<string | null>(null);
  const [notes, setNotes] = useState<any[]>([]);
  const [currentNote, setCurrentNote] = useState({ title: '', content: '', tags: '' });
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [selectionPosition, setSelectionPosition] = useState<{ x: number; y: number } | null>(null);
  const [isAddingToNotes, setIsAddingToNotes] = useState(false);
  const [showStudyPalInDialog, setShowStudyPalInDialog] = useState(true);

  const handleLogout = () => {
    navigate('/student-login');
  };

  const handleBack = () => {
    navigate('/student-dashboard');
  };

  // Text selection handlers
  useEffect(() => {
    const handleTextSelection = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();
      
      if (text && text.length > 0) {
        const range = selection?.getRangeAt(0);
        const rect = range?.getBoundingClientRect();
        
        if (rect) {
          setSelectedText(text);
          setSelectionPosition({
            x: rect.left + rect.width / 2,
            y: rect.top - 10
          });
        }
      } else {
        setSelectedText('');
        setSelectionPosition(null);
      }
    };

    document.addEventListener('mouseup', handleTextSelection);
    document.addEventListener('touchend', handleTextSelection);

    return () => {
      document.removeEventListener('mouseup', handleTextSelection);
      document.removeEventListener('touchend', handleTextSelection);
    };
  }, []);

  // Reset Study Pal visibility when dialog opens
  useEffect(() => {
    if (selectedResource) {
      setShowStudyPalInDialog(true);
    }
  }, [selectedResource]);

  const handleCopyText = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (selectedText) {
      navigator.clipboard.writeText(selectedText);
      toast({
        title: "Copied!",
        description: "Text copied to clipboard.",
      });
      setSelectedText('');
      setSelectionPosition(null);
    }
  };

  const handleAddToNotes = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!selectedText?.trim() || isAddingToNotes) return;
    
    setIsAddingToNotes(true);
    
    try {
      const newNote = {
        id: Date.now(),
        title: `Note ${notes.length + 1}`,
        content: selectedText,
        tags: selectedResource?.subject || '',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setNotes((prev) => [...prev, newNote]);
      
      toast({
        title: "Added to Notes",
        description: "Your selected text has been saved to My Notes.",
      });
      
      // Delay clearing selection to ensure toast shows and UI doesn't break
      setTimeout(() => {
        setSelectedText('');
        setSelectionPosition(null);
        setIsAddingToNotes(false);
      }, 300);
    } catch (error) {
      console.error('Error adding note:', error);
      setIsAddingToNotes(false);
      toast({
        title: "Error",
        description: "Failed to add note. Please try again.",
        variant: "destructive"
      });
    }
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

  const handleInModalSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      const filtered = mockResources.filter(r => 
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.content.keyTopics.some((topic: string) => 
          topic.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setResources(filtered);
      setSearchHighlight(searchQuery.toLowerCase());
      // Close the modal to show the filtered results
      setSelectedResource(null);
    }
  };

  // Helper function to highlight matching text
  const highlightText = (text: string, highlight: string) => {
    if (!highlight) return text;
    
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? 
        React.createElement('mark', { 
          key: index, 
          className: 'bg-yellow-200 text-yellow-900 px-1 rounded' 
        }, part) : part
    );
  };

  // Safe date formatting helpers to avoid runtime errors with legacy notes
  const safeFormatDate = (d: any) => {
    try {
      if (!d) return '';
      const date = typeof d === 'string' ? new Date(d) : d;
      return date.toLocaleDateString();
    } catch {
      return '';
    }
  };

  const safeFormatDateTime = (d: any) => {
    try {
      if (!d) return '';
      const date = typeof d === 'string' ? new Date(d) : d;
      return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString();
    } catch {
      return '';
    }
  };

  // Notes management functions
  const handleSaveNote = () => {
    if (currentNote.title.trim() && currentNote.content.trim()) {
      if (editingNoteId !== null) {
        // Edit existing note
        setNotes(notes.map(note => 
          note.id === editingNoteId 
            ? { ...currentNote, id: editingNoteId, updatedAt: new Date() }
            : note
        ));
        setEditingNoteId(null);
      } else {
        // Add new note
        const newNote = {
          ...currentNote,
          id: Date.now(),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        setNotes([...notes, newNote]);
      }
      setCurrentNote({ title: '', content: '', tags: '' });
    }
  };

  const handleEditNote = (note: any) => {
    setCurrentNote({ title: note.title, content: note.content, tags: note.tags });
    setEditingNoteId(note.id);
  };

  const handleDeleteNote = (id: number) => {
    setNotes(notes.filter(note => note.id !== id));
    if (editingNoteId === id) {
      setEditingNoteId(null);
      setCurrentNote({ title: '', content: '', tags: '' });
    }
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setCurrentNote({ title: '', content: '', tags: '' });
  };

  const handleStudyPalMessage = () => {
    if (chatMessage.trim()) {
      const topic = chatMessage.trim();
      const newMessage = {
        id: Date.now(),
        user: chatMessage,
        bot: `Great question about "${topic}"! Let me break this down for you with a clear explanation and provide some visual resources to help you understand better.`,
        topic: topic,
        hasResources: true
      };
      setChatHistory([...chatHistory, newMessage]);
      setChatMessage('');
    }
  };

  const openResourceWindow = (topic: string, resourceType: 'mindmap' | 'diagram' | 'flowchart' | 'concept-map') => {
    const windowFeatures = 'width=1000,height=700,scrollbars=yes,resizable=yes';
    const resourceWindow = window.open('', '_blank', windowFeatures);
    
    if (resourceWindow) {
      resourceWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${resourceType.charAt(0).toUpperCase() + resourceType.slice(1)} - ${topic}</title>
          <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
          <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body { margin: 0; font-family: system-ui, -apple-system, sans-serif; }
          </style>
        </head>
        <body>
          <div id="root"></div>
          <script>
            const { useState, useEffect } = React;
            
            const ResourceViewer = () => {
              const generateContent = () => {
                const topic = "${topic}";
                const resourceType = "${resourceType}";
                
                switch (resourceType) {
                  case 'mindmap':
                    return React.createElement('div', { className: 'relative' },
                      React.createElement('div', { className: 'text-center mb-8' },
                        React.createElement('div', { className: 'inline-block bg-blue-500 text-white px-6 py-3 rounded-full text-lg font-semibold' }, topic)
                      ),
                      React.createElement('div', { className: 'grid grid-cols-2 gap-8' },
                        React.createElement('div', { className: 'space-y-4' },
                          React.createElement('div', { className: 'flex items-center' },
                            React.createElement('div', { className: 'w-3 h-3 bg-green-500 rounded-full mr-3' }),
                            React.createElement('div', { className: 'bg-green-100 px-4 py-2 rounded-lg' },
                              React.createElement('span', { className: 'font-medium' }, 'Key Concepts')
                            )
                          ),
                          React.createElement('div', { className: 'ml-6 space-y-2' },
                            React.createElement('div', { className: 'bg-white p-3 rounded border-l-4 border-green-500 shadow-sm' }, 'Definition & Properties'),
                            React.createElement('div', { className: 'bg-white p-3 rounded border-l-4 border-green-500 shadow-sm' }, 'Core Principles')
                          )
                        ),
                        React.createElement('div', { className: 'space-y-4' },
                          React.createElement('div', { className: 'flex items-center' },
                            React.createElement('div', { className: 'w-3 h-3 bg-purple-500 rounded-full mr-3' }),
                            React.createElement('div', { className: 'bg-purple-100 px-4 py-2 rounded-lg' },
                              React.createElement('span', { className: 'font-medium' }, 'Applications')
                            )
                          ),
                          React.createElement('div', { className: 'ml-6 space-y-2' },
                            React.createElement('div', { className: 'bg-white p-3 rounded border-l-4 border-purple-500 shadow-sm' }, 'Real-world Examples'),
                            React.createElement('div', { className: 'bg-white p-3 rounded border-l-4 border-purple-500 shadow-sm' }, 'Problem Solving')
                          )
                        )
                      )
                    );
                  
                  case 'diagram':
                    return React.createElement('div', { className: 'space-y-6' },
                      React.createElement('div', { className: 'text-center' },
                        React.createElement('h2', { className: 'text-2xl font-bold text-gray-800 mb-2' }, topic + ' - Process Diagram'),
                        React.createElement('p', { className: 'text-gray-600' }, 'Visual representation of the concept')
                      ),
                      React.createElement('div', { className: 'flex justify-center' },
                        React.createElement('div', { className: 'space-y-4' },
                          React.createElement('div', { className: 'flex items-center justify-center' },
                            React.createElement('div', { className: 'bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md' }, 'Start: Input/Problem')
                          ),
                          React.createElement('div', { className: 'flex justify-center' },
                            React.createElement('div', { className: 'w-px h-8 bg-gray-300' })
                          ),
                          React.createElement('div', { className: 'flex items-center justify-center' },
                            React.createElement('div', { className: 'bg-green-500 text-white px-6 py-3 rounded-lg shadow-md' }, 'Process: Apply Concept')
                          ),
                          React.createElement('div', { className: 'flex justify-center' },
                            React.createElement('div', { className: 'w-px h-8 bg-gray-300' })
                          ),
                          React.createElement('div', { className: 'flex items-center justify-center' },
                            React.createElement('div', { className: 'bg-orange-500 text-white px-6 py-3 rounded-lg shadow-md' }, 'Output: Solution/Answer')
                          )
                        )
                      )
                    );
                  
                  default:
                    return React.createElement('div', { className: 'text-center p-8' },
                      React.createElement('h2', { className: 'text-2xl font-bold mb-4' }, 'Visual Resource'),
                      React.createElement('p', { className: 'text-gray-600' }, 'Interactive visual content for: ' + topic)
                    );
                }
              };
              
              return React.createElement('div', { className: 'min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6' },
                React.createElement('div', { className: 'max-w-4xl mx-auto' },
                  React.createElement('div', { className: 'bg-white rounded-lg shadow-lg border-0' },
                    React.createElement('div', { className: 'border-b p-6' },
                      React.createElement('div', { className: 'flex items-center justify-between' },
                        React.createElement('div', { className: 'flex items-center gap-3' },
                          React.createElement('div', { className: 'w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center' },
                            React.createElement('span', { className: 'text-white font-bold' }, '🧠')
                          ),
                          React.createElement('div', null,
                            React.createElement('h1', { className: 'text-xl font-bold text-gray-800' }, "${resourceType.charAt(0).toUpperCase() + resourceType.slice(1).replace('-', ' ')}"),
                            React.createElement('p', { className: 'text-sm text-gray-600' }, 'Visual learning resource')
                          )
                        ),
                        React.createElement('button', { 
                          className: 'px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600',
                          onClick: () => window.close()
                        }, 'Close')
                      )
                    ),
                    React.createElement('div', { className: 'p-8' }, generateContent())
                  )
                )
              );
            };
            
            ReactDOM.render(React.createElement(ResourceViewer), document.getElementById('root'));
          </script>
        </body>
        </html>
      `);
      resourceWindow.document.close();
    }
  };

  const openTestWindow = (topic: string) => {
    const windowFeatures = 'width=800,height=600,scrollbars=yes,resizable=yes';
    const testWindow = window.open('', '_blank', windowFeatures);
    
    if (testWindow) {
      testWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Quick Test - ${topic}</title>
          <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
          <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body { margin: 0; font-family: system-ui, -apple-system, sans-serif; }
          </style>
        </head>
        <body>
          <div id="root"></div>
          <script>
            const { useState } = React;
            
            const TestWindow = () => {
              const [currentQuestion, setCurrentQuestion] = useState(0);
              const [selectedAnswers, setSelectedAnswers] = useState([]);
              const [showResults, setShowResults] = useState(false);
              const [score, setScore] = useState(0);
              
              const questions = ${JSON.stringify(mockQuestions)};
              
              const handleAnswerSelect = (answerIndex) => {
                const newAnswers = [...selectedAnswers];
                newAnswers[currentQuestion] = answerIndex;
                setSelectedAnswers(newAnswers);
              };
              
              const handleNext = () => {
                if (currentQuestion < questions.length - 1) {
                  setCurrentQuestion(currentQuestion + 1);
                } else {
                  const finalScore = selectedAnswers.reduce((acc, answer, index) => {
                    return acc + (answer === questions[index].correct ? 1 : 0);
                  }, 0);
                  setScore(finalScore);
                  setShowResults(true);
                }
              };
              
              const progress = ((currentQuestion + 1) / questions.length) * 100;
              
              if (showResults) {
                return React.createElement('div', { className: 'min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6' },
                  React.createElement('div', { className: 'max-w-2xl mx-auto' },
                    React.createElement('div', { className: 'bg-white rounded-lg shadow-lg p-8' },
                      React.createElement('div', { className: 'text-center mb-6' },
                        React.createElement('h1', { className: 'text-2xl font-bold mb-4' }, 'Test Results'),
                        React.createElement('div', { className: 'text-6xl font-bold mb-2 text-blue-500' }, Math.round((score / questions.length) * 100) + '%'),
                        React.createElement('p', { className: 'text-gray-600' }, \`You scored \${score} out of \${questions.length} questions correctly\`)
                      ),
                      React.createElement('button', { 
                        className: 'w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600',
                        onClick: () => window.close()
                      }, 'Close')
                    )
                  )
                );
              }
              
              return React.createElement('div', { className: 'min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6' },
                React.createElement('div', { className: 'max-w-2xl mx-auto' },
                  React.createElement('div', { className: 'bg-white rounded-lg shadow-lg' },
                    React.createElement('div', { className: 'p-6 border-b' },
                      React.createElement('div', { className: 'flex items-center justify-between mb-4' },
                        React.createElement('h1', { className: 'text-xl font-bold' }, 'Quick Test: ${topic}'),
                        React.createElement('div', { className: 'text-sm text-gray-500' }, \`Question \${currentQuestion + 1} of \${questions.length}\`)
                      ),
                      React.createElement('div', { className: 'w-full bg-gray-200 rounded-full h-2' },
                        React.createElement('div', { 
                          className: 'bg-blue-500 h-2 rounded-full transition-all',
                          style: { width: progress + '%' }
                        })
                      )
                    ),
                    React.createElement('div', { className: 'p-6' },
                      React.createElement('h3', { className: 'text-lg font-medium mb-4' }, questions[currentQuestion].question),
                      React.createElement('div', { className: 'space-y-3 mb-6' },
                        ...questions[currentQuestion].options.map((option, index) =>
                          React.createElement('button', {
                            key: index,
                            className: \`w-full text-left p-4 rounded-lg border-2 transition-colors \${
                              selectedAnswers[currentQuestion] === index 
                                ? 'bg-blue-500 text-white border-blue-500' 
                                : 'bg-gray-50 border-gray-200 hover:bg-blue-50 hover:border-blue-300'
                            }\`,
                            onClick: () => handleAnswerSelect(index)
                          },
                            React.createElement('span', { className: 'font-medium mr-3' }, String.fromCharCode(65 + index) + '.'),
                            option
                          )
                        )
                      ),
                      React.createElement('button', {
                        className: 'w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50',
                        disabled: selectedAnswers[currentQuestion] === undefined,
                        onClick: handleNext
                      }, currentQuestion === questions.length - 1 ? 'Finish Test' : 'Next Question')
                    )
                  )
                )
              );
            };
            
            ReactDOM.render(React.createElement(TestWindow), document.getElementById('root'));
          </script>
        </body>
        </html>
      `);
      testWindow.document.close();
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

  // StudyPal Component
  const StudyPalContent = ({ inDialog = false }: { inDialog?: boolean }) => (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b flex items-center gap-3 flex-shrink-0">
        {inDialog ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowStudyPalInDialog(false)}
            className="h-8 w-8"
            title="Hide Study Pal"
          >
            <X className="w-4 h-4" />
          </Button>
        ) : !isMobile ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowStudyPal(false)}
            className="h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>
        ) : null}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">StudyPal</h3>
            <p className="text-xs text-gray-500">Your AI learning assistant</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col min-h-0">
        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
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

                  {/* Additional Resources Section */}
                  {chat.hasResources && (
                    <div className="flex justify-start mt-4">
                      <div className="flex items-start gap-2 max-w-[85%]">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Lightbulb className="w-4 h-4 text-blue-500" />
                        </div>
                        <div className="bg-blue-50 rounded-2xl rounded-bl-md px-4 py-3 border border-blue-200">
                          <p className="text-sm text-gray-800 mb-3">Here are some visual resources to help you understand better:</p>
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openResourceWindow(chat.topic, 'mindmap')}
                              className="text-xs h-8 border-blue-300 text-blue-700 hover:bg-blue-100"
                            >
                              <Brain className="w-3 h-3 mr-1" />
                              Mind Map
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openResourceWindow(chat.topic, 'diagram')}
                              className="text-xs h-8 border-green-300 text-green-700 hover:bg-green-100"
                            >
                              <Target className="w-3 h-3 mr-1" />
                              Diagram
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openResourceWindow(chat.topic, 'flowchart')}
                              className="text-xs h-8 border-purple-300 text-purple-700 hover:bg-purple-100"
                            >
                              <BookOpen className="w-3 h-3 mr-1" />
                              Flowchart
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openResourceWindow(chat.topic, 'concept-map')}
                              className="text-xs h-8 border-orange-300 text-orange-700 hover:bg-orange-100"
                            >
                              <Lightbulb className="w-3 h-3 mr-1" />
                              Concept Map
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
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
              {chatHistory.length > 0 && (
                <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <div className="flex items-start gap-2 mb-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Brain className="w-4 h-4 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Test Your Knowledge</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Ready to test what you've learned? Take a quick 5-question quiz in a new window!
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => openTestWindow(chatHistory[chatHistory.length - 1]?.topic || 'General Knowledge')} 
                    className="w-full bg-blue-500 hover:bg-blue-600"
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    Start Quick Test
                  </Button>
                </div>
              )}
            </>
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
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Main Header */}
      <header className="border-b border-gray-100 px-6 py-3 flex-shrink-0" style={{ backgroundColor: '#3B54A5' }}>
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
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex-shrink-0">
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

      {/* Main Content Area with Split Screen */}
      {showStudyPal && !isMobile ? (
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          <ResizablePanel defaultSize={75} minSize={50}>
            <div className="h-full overflow-y-auto">
              <div className="max-w-7xl mx-auto px-6 py-8 bg-slate-50/30 animate-fade-in">
                {/* Page Header */}
                <div className="mb-10 animate-fade-in">
                  <div className="flex items-center gap-5 mb-6 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-md">
                    <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center border-2 border-purple-200 hover:scale-105 transition-transform duration-200">
                      <BookOpen className="w-7 h-7 text-purple-600" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-slate-800 mb-1">Resource Vault</h1>
                      <p className="text-slate-600">Access all your study materials and get help with any concept</p>
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="space-y-8">
                  {/* Resource Finder */}
                  <Card className="border-2 border-slate-200/80 shadow-sm bg-white/90 backdrop-blur-sm">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-slate-800 flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        Find Resources by Subject & Chapter
                      </CardTitle>
                      <CardDescription className="text-slate-600">
                        Select your subject and chapter to access relevant study materials
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-3 group">
                          <label className="text-sm font-medium text-slate-700 group-hover:text-purple-600 transition-colors duration-200">Subject</label>
                          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                            <SelectTrigger className="hover:border-purple-300 transition-colors duration-200 bg-slate-50/50 hover:bg-white">
                              <SelectValue placeholder="Select a subject" />
                            </SelectTrigger>
                            <SelectContent>
                              {subjects.map((subject) => (
                                <SelectItem key={subject.id} value={subject.id} className="hover:bg-purple-50">
                                  {subject.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-3 group">
                          <label className="text-sm font-medium text-slate-700 group-hover:text-purple-600 transition-colors duration-200">Chapter</label>
                          <Select 
                            value={selectedChapter} 
                            onValueChange={setSelectedChapter}
                            disabled={!selectedSubject}
                          >
                            <SelectTrigger className="hover:border-purple-300 transition-colors duration-200 bg-slate-50/50 hover:bg-white disabled:opacity-50">
                              <SelectValue placeholder="Select a chapter" />
                            </SelectTrigger>
                            <SelectContent>
                              {selectedSubject && chapters[selectedSubject as keyof typeof chapters]?.map((chapter) => (
                                <SelectItem key={chapter.id} value={chapter.id} className="hover:bg-purple-50">
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
                        className="w-full bg-purple-500 hover:bg-purple-600 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] disabled:hover:scale-100"
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Provide Resources
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Resources Display */}
                  {resources.length > 0 && (
                    <Card className="border-2 border-slate-200/80 shadow-sm bg-white/90 backdrop-blur-sm animate-fade-in">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-slate-800 flex items-center gap-2">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                          Available Resources
                        </CardTitle>
                        <CardDescription className="text-slate-600">
                          Found {resources.length} resources for your selection
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {resources.map((resource, index) => {
                            const IconComponent = getResourceIcon(resource.type);
                            return (
                              <div 
                                key={resource.id} 
                                className="group border-2 border-slate-200/80 hover:border-purple-300/60 rounded-xl p-5 hover:shadow-md transition-all duration-300 cursor-pointer bg-white/70 backdrop-blur-sm hover:bg-white hover:scale-[1.02] animate-fade-in"
                                style={{ animationDelay: `${index * 100}ms` }}
                                onClick={() => setSelectedResource(resource)}
                              >
                                <div className="flex items-start gap-4 mb-4">
                                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-purple-100 transition-colors duration-200">
                                    <IconComponent className="w-5 h-5 text-purple-600 group-hover:text-purple-700 transition-colors duration-200" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-slate-800 mb-1 group-hover:text-purple-700 transition-colors duration-200 line-clamp-2">
                                      {highlightText(resource.title, searchHighlight)}
                                    </h4>
                                    <p className="text-sm text-slate-600 group-hover:text-slate-700 transition-colors duration-200 line-clamp-2">
                                      {highlightText(resource.description, searchHighlight)}
                                    </p>
                                  </div>
                                  <Badge variant="secondary" className="bg-slate-100 text-slate-700 group-hover:bg-purple-100 group-hover:text-purple-700 transition-colors duration-200 shrink-0">
                                    {resource.type}
                                  </Badge>
                                </div>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="w-full group-hover:bg-purple-50 group-hover:border-purple-300 group-hover:text-purple-700 transition-all duration-200 hover:scale-105" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedResource(resource);
                                  }}
                                >
                                  <ExternalLink className="w-4 h-4 mr-2" />
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

              </div>
            </div>
          </ResizablePanel>
          
          <ResizableHandle withHandle className="w-2 bg-slate-200 hover:bg-purple-300 transition-colors" />
          
          <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
            <StudyPalContent />
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-8 bg-slate-50/30 animate-fade-in">
            {/* Page Header */}
            <div className="mb-10 animate-fade-in">
              <div className="flex items-center gap-5 mb-6 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-md">
                <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center border-2 border-purple-200 hover:scale-105 transition-transform duration-200">
                  <BookOpen className="w-7 h-7 text-purple-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-800 mb-1">Resource Vault</h1>
                  <p className="text-slate-600">Access all your study materials and get help with any concept</p>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="space-y-8">
              {/* Resource Finder */}
              <Card className="border-2 border-slate-200/80 shadow-sm bg-white/90 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-slate-800 flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    Find Resources by Subject & Chapter
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Select your subject and chapter to access relevant study materials
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-3 group">
                      <label className="text-sm font-medium text-slate-700 group-hover:text-purple-600 transition-colors duration-200">Subject</label>
                      <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                        <SelectTrigger className="hover:border-purple-300 transition-colors duration-200 bg-slate-50/50 hover:bg-white">
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjects.map((subject) => (
                            <SelectItem key={subject.id} value={subject.id} className="hover:bg-purple-50">
                              {subject.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3 group">
                      <label className="text-sm font-medium text-slate-700 group-hover:text-purple-600 transition-colors duration-200">Chapter</label>
                      <Select 
                        value={selectedChapter} 
                        onValueChange={setSelectedChapter}
                        disabled={!selectedSubject}
                      >
                        <SelectTrigger className="hover:border-purple-300 transition-colors duration-200 bg-slate-50/50 hover:bg-white disabled:opacity-50">
                          <SelectValue placeholder="Select a chapter" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedSubject && chapters[selectedSubject as keyof typeof chapters]?.map((chapter) => (
                            <SelectItem key={chapter.id} value={chapter.id} className="hover:bg-purple-50">
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
                    className="w-full bg-purple-500 hover:bg-purple-600 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] disabled:hover:scale-100"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Provide Resources
                  </Button>
                </CardContent>
              </Card>

              {/* Resources Display */}
              {resources.length > 0 && (
                <Card className="border-2 border-slate-200/80 shadow-sm bg-white/90 backdrop-blur-sm animate-fade-in">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-slate-800 flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      Available Resources
                    </CardTitle>
                    <CardDescription className="text-slate-600">
                      Found {resources.length} resources for your selection
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {resources.map((resource, index) => {
                        const IconComponent = getResourceIcon(resource.type);
                        return (
                          <div 
                            key={resource.id} 
                            className="group border-2 border-slate-200/80 hover:border-purple-300/60 rounded-xl p-5 hover:shadow-md transition-all duration-300 cursor-pointer bg-white/70 backdrop-blur-sm hover:bg-white hover:scale-[1.02] animate-fade-in"
                            style={{ animationDelay: `${index * 100}ms` }}
                            onClick={() => setSelectedResource(resource)}
                          >
                            <div className="flex items-start gap-4 mb-4">
                              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-purple-100 transition-colors duration-200">
                                <IconComponent className="w-5 h-5 text-purple-600 group-hover:text-purple-700 transition-colors duration-200" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-slate-800 mb-1 group-hover:text-purple-700 transition-colors duration-200 line-clamp-2">
                                  {highlightText(resource.title, searchHighlight)}
                                </h4>
                                <p className="text-sm text-slate-600 group-hover:text-slate-700 transition-colors duration-200 line-clamp-2">
                                  {highlightText(resource.description, searchHighlight)}
                                </p>
                              </div>
                              <Badge variant="secondary" className="bg-slate-100 text-slate-700 group-hover:bg-purple-100 group-hover:text-purple-700 transition-colors duration-200 shrink-0">
                                {resource.type}
                              </Badge>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full group-hover:bg-purple-50 group-hover:border-purple-300 group-hover:text-purple-700 transition-all duration-200 hover:scale-105" 
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedResource(resource);
                              }}
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
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


          </div>
        </div>
      )}

      {/* Text Selection Popup */}
      {selectedText && selectionPosition && (
        <div
          data-selection-popup="true"
          className="fixed z-[200] bg-white rounded-lg shadow-xl border-2 border-purple-300 p-2 flex gap-2 pointer-events-none"
          style={{
            left: `${selectionPosition.x}px`,
            top: `${selectionPosition.y}px`,
            transform: 'translate(-50%, -100%)',
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
          }}
        >
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleCopyText(e);
            }}
            onMouseDown={(e) => e.stopPropagation()}
            className="h-8 px-3 pointer-events-auto hover:bg-blue-50 hover:border-blue-300"
          >
            <Copy className="w-3 h-3 mr-1" />
            Copy
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleAddToNotes(e);
            }}
            onMouseDown={(e) => e.stopPropagation()}
            disabled={isAddingToNotes}
            className="h-8 px-3 pointer-events-auto hover:bg-purple-50 hover:border-purple-300"
          >
            <StickyNote className="w-3 h-3 mr-1" />
            {isAddingToNotes ? 'Adding...' : 'Add to Notes'}
          </Button>
        </div>
      )}

      {/* Resource Detail Dialog */}
      <Dialog open={!!selectedResource} onOpenChange={() => setSelectedResource(null)}>
        <DialogContent 
          className="max-w-[100vw] w-[100vw] h-[100vh] p-0 select-text overflow-hidden m-0 rounded-none"
          onInteractOutside={(e) => {
            const el = (e.target as HTMLElement)?.closest('[data-selection-popup="true"]');
            if (el) e.preventDefault();
          }}
          onPointerDownOutside={(e) => {
            const el = (e.target as HTMLElement)?.closest('[data-selection-popup="true"]');
            if (el) e.preventDefault();
          }}
        >
          {selectedResource && (
            <>
              {/* Desktop Layout - Resizable Panels */}
              {!isMobile ? (
                <ResizablePanelGroup direction="horizontal" className="h-full">
                  {/* Resource Content Panel */}
                  <ResizablePanel defaultSize={showStudyPalInDialog ? 60 : 100} minSize={40}>
                    <div className="h-full flex flex-col">
                      <div className="flex-shrink-0 p-6 pb-4 border-b">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-3">
                            {React.createElement(getResourceIcon(selectedResource.type), { className: "w-6 h-6 text-purple-600" })}
                            {selectedResource.title}
                          </DialogTitle>
                          <DialogDescription>
                            {selectedResource.description}
                          </DialogDescription>
                        </DialogHeader>
                        
                        {/* Toggle Study Pal Button */}
                        {!showStudyPalInDialog && (
                          <div className="mt-4">
                            <Button
                              onClick={() => setShowStudyPalInDialog(true)}
                              className="bg-purple-500 hover:bg-purple-600"
                              size="sm"
                            >
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Show StudyPal
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 overflow-y-auto p-6">
                        <div className="space-y-6">
                          {/* Summary Section */}
                          <div>
                            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                              Summary
                            </h3>
                            <p className="text-gray-700 leading-relaxed">{selectedResource.content.summary}</p>
                          </div>

                          {/* Key Topics */}
                          <div>
                            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                              Key Topics Covered
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {selectedResource.content.keyTopics.map((topic: string, index: number) => (
                                <div key={index} className="flex items-start gap-2 bg-blue-50 p-3 rounded-lg border border-blue-100">
                                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                  <span className="text-sm text-gray-700">{topic}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Examples/Features Section */}
                          {(selectedResource.content.examples || selectedResource.content.features) && (
                            <div>
                              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                {selectedResource.content.examples ? 'Examples Included' : 'Features'}
                              </h3>
                              <div className="space-y-2">
                                {(selectedResource.content.examples || selectedResource.content.features).map((item: string, index: number) => (
                                  <div key={index} className="flex items-start gap-2 bg-green-50 p-3 rounded-lg border border-green-100">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <span className="text-sm text-gray-700">{item}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Additional Info */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {selectedResource.content.exercises && (
                              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                                <h4 className="font-medium text-purple-900 mb-1">Exercises</h4>
                                <p className="text-sm text-purple-700">{selectedResource.content.exercises}</p>
                              </div>
                            )}
                            {selectedResource.content.difficulty && (
                              <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                                <h4 className="font-medium text-orange-900 mb-1">Difficulty Level</h4>
                                <p className="text-sm text-orange-700">{selectedResource.content.difficulty}</p>
                              </div>
                            )}
                            {selectedResource.content.duration && (
                              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                <h4 className="font-medium text-blue-900 mb-1">Duration</h4>
                                <p className="text-sm text-blue-700">{selectedResource.content.duration}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </ResizablePanel>

                  {showStudyPalInDialog && (
                    <>
                      <ResizableHandle withHandle />

                      {/* Study Pal Panel - Fixed Height */}
                      <ResizablePanel defaultSize={40} minSize={30}>
                        <div className="h-full">
                          <StudyPalContent inDialog={true} />
                        </div>
                      </ResizablePanel>
                    </>
                  )}
                </ResizablePanelGroup>
              ) : (
                /* Mobile Layout - Single Scrollable View */
                <div className="h-full flex flex-col">
                  <div className="flex-shrink-0 p-4 pb-3 border-b">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-base">
                        {React.createElement(getResourceIcon(selectedResource.type), { className: "w-5 h-5 text-purple-600" })}
                        {selectedResource.title}
                      </DialogTitle>
                      <DialogDescription className="text-sm">
                        {selectedResource.description}
                      </DialogDescription>
                    </DialogHeader>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-4">
                      {/* Summary Section */}
                      <div>
                        <h3 className="font-semibold text-base mb-2 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                          Summary
                        </h3>
                        <p className="text-gray-700 text-sm leading-relaxed">{selectedResource.content.summary}</p>
                      </div>

                      {/* Key Topics */}
                      <div>
                        <h3 className="font-semibold text-base mb-2 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          Key Topics
                        </h3>
                        <div className="space-y-2">
                          {selectedResource.content.keyTopics.map((topic: string, index: number) => (
                            <div key={index} className="flex items-start gap-2 bg-blue-50 p-2 rounded-lg border border-blue-100">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                              <span className="text-sm text-gray-700">{topic}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Examples/Features */}
                      {(selectedResource.content.examples || selectedResource.content.features) && (
                        <div>
                          <h3 className="font-semibold text-base mb-2 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            {selectedResource.content.examples ? 'Examples' : 'Features'}
                          </h3>
                          <div className="space-y-2">
                            {(selectedResource.content.examples || selectedResource.content.features).map((item: string, index: number) => (
                              <div key={index} className="flex items-start gap-2 bg-green-50 p-2 rounded-lg border border-green-100">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                <span className="text-sm text-gray-700">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Additional Info */}
                      <div className="space-y-2">
                        {selectedResource.content.exercises && (
                          <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                            <h4 className="font-medium text-purple-900 text-sm mb-1">Exercises</h4>
                            <p className="text-xs text-purple-700">{selectedResource.content.exercises}</p>
                          </div>
                        )}
                        {selectedResource.content.difficulty && (
                          <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                            <h4 className="font-medium text-orange-900 text-sm mb-1">Difficulty Level</h4>
                            <p className="text-xs text-orange-700">{selectedResource.content.difficulty}</p>
                          </div>
                        )}
                        {selectedResource.content.duration && (
                          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                            <h4 className="font-medium text-blue-900 text-sm mb-1">Duration</h4>
                            <p className="text-xs text-blue-700">{selectedResource.content.duration}</p>
                          </div>
                        )}
                      </div>

                      {/* Study Pal Section on Mobile */}
                      <div className="border-t pt-4 mt-4">
                        <h3 className="font-semibold text-base mb-3 flex items-center gap-2">
                          <MessageCircle className="w-4 h-4 text-purple-500" />
                          Ask StudyPal
                        </h3>
                        <Button
                          onClick={() => setShowStudyPal(true)}
                          className="w-full bg-purple-500 hover:bg-purple-600"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Open StudyPal
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* My Notes Sheet */}
      <Sheet open={showNotes} onOpenChange={setShowNotes}>
        <SheetTrigger asChild>
          <Button
            className="fixed bottom-8 left-8 rounded-full w-14 h-14 bg-blue-500 hover:bg-blue-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border-2 border-white/20 backdrop-blur-sm z-[100]"
            size="icon"
            aria-label="Open My Notes"
          >
            <StickyNote className="w-6 h-6 text-white" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-full sm:max-w-lg flex flex-col h-screen">
          <SheetHeader className="pb-4 border-b flex-shrink-0">
            <SheetTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <StickyNote className="w-4 h-4 text-white" />
              </div>
              My Notes
            </SheetTitle>
            <SheetDescription>
              Save and organize your study notes
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 flex flex-col min-h-0">
            {/* Notes List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {notes.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <StickyNote className="w-8 h-8 text-blue-500" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">No notes yet</h3>
                    <p className="text-sm text-gray-500 max-w-xs">
                      Select text from resources and click "Add to Notes" to save them here.
                    </p>
                  </div>
                </div>
              ) : (
                notes.map((note) => (
                  <div key={note.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{note.title}</h4>
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEditNote(note)}
                          className="h-6 w-6"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Note</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this note? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteNote(note.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-2 whitespace-pre-wrap">{note.content}</p>
                    {note.tags && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {note.tags.split(',').map((tag: string, idx: number) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {tag.trim()}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-gray-500">
                      {note.updatedAt && `Updated: ${safeFormatDateTime(note.updatedAt)}`}
                      {!note.updatedAt && note.createdAt && `Created: ${safeFormatDateTime(note.createdAt)}`}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Note Editor */}
            <div className="border-t p-4 bg-white flex-shrink-0 space-y-3">
              <Input
                placeholder="Note title"
                value={currentNote.title}
                onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
              />
              <Textarea
                placeholder="Write your note here..."
                value={currentNote.content}
                onChange={(e) => setCurrentNote({ ...currentNote, content: e.target.value })}
                rows={3}
                className="resize-none"
              />
              <Input
                placeholder="Tags (comma separated)"
                value={currentNote.tags}
                onChange={(e) => setCurrentNote({ ...currentNote, tags: e.target.value })}
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleSaveNote}
                  disabled={!currentNote.title.trim() || !currentNote.content.trim()}
                  className="flex-1 bg-blue-500 hover:bg-blue-600"
                >
                  {editingNoteId !== null ? 'Update Note' : 'Save Note'}
                </Button>
                {editingNoteId !== null && (
                  <Button
                    onClick={handleCancelEdit}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* StudyPal Floater Button & Mobile Bottom Sheet */}
      {!showStudyPal && !selectedResource && (
        <Button
          onClick={() => setShowStudyPal(true)}
          className="fixed bottom-8 right-8 rounded-full w-16 h-16 bg-purple-500 hover:bg-purple-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border-2 border-white/20 backdrop-blur-sm z-[100]"
          size="icon"
          aria-label="Open Study Pal"
        >
          <MessageSquare className="w-7 h-7 text-white" />
        </Button>
      )}

      {/* Mobile Bottom Sheet for StudyPal */}
      {isMobile && (
        <Sheet open={showStudyPal} onOpenChange={setShowStudyPal}>
          <SheetContent side="bottom" className="h-[80vh] flex flex-col">
            <StudyPalContent />
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
};

export default ResourceVault;