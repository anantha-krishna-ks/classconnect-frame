import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Eye, Edit, Trash2, CheckCircle2, Clock, BookOpen, Target, 
  BarChart3, PieChart, Save, Filter, X, Sparkles, Image, Upload,
  GripVertical, Plus, Download, FileText, ArrowLeft, Minus
} from 'lucide-react';
import { toast } from 'sonner';
import AssessmentBuilder from './AssessmentBuilder';

interface GeneratedItem {
  id: string;
  question: string;
  itemType: string;
  bloomsLevel: string;
  difficulty: string;
  marks: number;
  eloId: string;
  eloTitle: string;
  isSelected: boolean;
  options?: string[];
  correctAnswer?: string;
  rubric?: string;
  hasImage?: boolean;
  imageUrl?: string;
}

interface SubQuestion {
  id: string;
  text: string;
  marks: number;
  numberingStyle: 'numeric' | 'alpha' | 'roman' | 'custom';
  customLabel?: string;
}

interface QuestionCard {
  id: string;
  questionText: string;
  marks: number;
  subQuestions: SubQuestion[];
  originalItem?: GeneratedItem;
}

interface AssessmentSection {
  id: string;
  title: string;
  questions: QuestionCard[];
}

interface AssessmentBuilder {
  generalInstructions: string;
  totalMarks: number;
  totalTime: number;
  mainNumbering: 'continuous' | 'reset-per-section';
  sections: AssessmentSection[];
}

interface AssessmentItemGenerationProps {
  assessmentData: any;
  updateAssessmentData: (data: any) => void;
}

const AssessmentItemGeneration = ({ assessmentData, updateAssessmentData }: AssessmentItemGenerationProps) => {
  const [generatedItems, setGeneratedItems] = useState<GeneratedItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [editingItem, setEditingItem] = useState<GeneratedItem | null>(null);
  const [previewItem, setPreviewItem] = useState<GeneratedItem | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [showAssessmentBuilder, setShowAssessmentBuilder] = useState(false);
  const [assessmentBuilder, setAssessmentBuilder] = useState<AssessmentBuilder>({
    generalInstructions: 'Read all questions carefully before attempting. Write your answers clearly and legibly.',
    totalMarks: 0,
    totalTime: 120,
    mainNumbering: 'continuous',
    sections: []
  });
  const [historicalQuestions] = useState<GeneratedItem[]>([
    {
      id: 'hist1',
      question: 'Explain the process of photosynthesis in detail.',
      itemType: 'Long Answer',
      bloomsLevel: 'Understand',
      difficulty: 'Medium',
      marks: 10,
      eloId: 'elo1',
      eloTitle: 'Understanding Plant Biology',
      isSelected: false
    },
    {
      id: 'hist2',
      question: 'What is the primary function of chloroplasts?',
      itemType: 'Multiple Choice',
      bloomsLevel: 'Remember',
      difficulty: 'Easy',
      marks: 2,
      eloId: 'elo1',
      eloTitle: 'Understanding Plant Biology',
      isSelected: false,
      options: ['Energy storage', 'Photosynthesis', 'Water absorption', 'Cell division'],
      correctAnswer: 'Photosynthesis'
    }
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  // Helper functions for assessment builder
  const addSection = () => {
    const newSection: AssessmentSection = {
      id: `section-${Date.now()}`,
      title: `SECTION - ${String.fromCharCode(65 + assessmentBuilder.sections.length)}`,
      questions: []
    };
    setAssessmentBuilder(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  };

  const updateSectionTitle = (sectionId: string, title: string) => {
    setAssessmentBuilder(prev => ({
      ...prev,
      sections: prev.sections.map(section => 
        section.id === sectionId ? { ...section, title } : section
      )
    }));
  };

  const addQuestionToSection = (sectionId: string, item?: GeneratedItem) => {
    const newQuestion: QuestionCard = {
      id: `question-${Date.now()}`,
      questionText: item?.question || 'Enter your question here...',
      marks: item?.marks || 1,
      subQuestions: [],
      originalItem: item
    };
    
    setAssessmentBuilder(prev => ({
      ...prev,
      sections: prev.sections.map(section => 
        section.id === sectionId 
          ? { ...section, questions: [...section.questions, newQuestion] }
          : section
      )
    }));
  };

  const updateQuestion = (sectionId: string, questionId: string, updates: Partial<QuestionCard>) => {
    setAssessmentBuilder(prev => ({
      ...prev,
      sections: prev.sections.map(section => 
        section.id === sectionId 
          ? {
              ...section,
              questions: section.questions.map(q => 
                q.id === questionId ? { ...q, ...updates } : q
              )
            }
          : section
      )
    }));
  };

  const addSubQuestion = (sectionId: string, questionId: string) => {
    const newSubQuestion: SubQuestion = {
      id: `sub-${Date.now()}`,
      text: 'Enter sub-question...',
      marks: 1,
      numberingStyle: 'alpha'
    };

    setAssessmentBuilder(prev => ({
      ...prev,
      sections: prev.sections.map(section => 
        section.id === sectionId 
          ? {
              ...section,
              questions: section.questions.map(q => 
                q.id === questionId 
                  ? { ...q, subQuestions: [...q.subQuestions, newSubQuestion] }
                  : q
              )
            }
          : section
      )
    }));
  };

  const updateSubQuestion = (sectionId: string, questionId: string, subQuestionId: string, updates: Partial<SubQuestion>) => {
    setAssessmentBuilder(prev => ({
      ...prev,
      sections: prev.sections.map(section => 
        section.id === sectionId 
          ? {
              ...section,
              questions: section.questions.map(q => 
                q.id === questionId 
                  ? {
                      ...q,
                      subQuestions: q.subQuestions.map(sub => 
                        sub.id === subQuestionId ? { ...sub, ...updates } : sub
                      )
                    }
                  : q
              )
            }
          : section
      )
    }));
  };

  const calculateTotalMarks = () => {
    return assessmentBuilder.sections.reduce((total, section) => {
      return total + section.questions.reduce((sectionTotal, question) => {
        const subTotal = question.subQuestions.reduce((subSum, sub) => subSum + sub.marks, 0);
        return sectionTotal + question.marks + subTotal;
      }, 0);
    }, 0);
  };

  const getSectionTotal = (section: AssessmentSection) => {
    return section.questions.reduce((total, question) => {
      const subTotal = question.subQuestions.reduce((subSum, sub) => subSum + sub.marks, 0);
      return total + question.marks + subTotal;
    }, 0);
  };

  const getSubQuestionNumber = (subQuestion: SubQuestion, index: number) => {
    switch (subQuestion.numberingStyle) {
      case 'numeric':
        return `${index + 1}.`;
      case 'alpha':
        return `${String.fromCharCode(97 + index)}.`;
      case 'roman':
        const romanNumerals = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'];
        return `${romanNumerals[index] || index + 1}.`;
      case 'custom':
        return subQuestion.customLabel || `${index + 1}.`;
      default:
        return `${index + 1}.`;
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const activeSectionId = active.data.current?.sectionId;
    const overSectionId = over.data.current?.sectionId;
    
    if (activeSectionId && overSectionId && activeSectionId === overSectionId) {
      setAssessmentBuilder(prev => ({
        ...prev,
        sections: prev.sections.map(section => {
          if (section.id === activeSectionId) {
            const oldIndex = section.questions.findIndex(q => q.id === active.id);
            const newIndex = section.questions.findIndex(q => q.id === over.id);
            
            return {
              ...section,
              questions: arrayMove(section.questions, oldIndex, newIndex)
            };
          }
          return section;
        })
      }));
    }
  };

  const initializeAssessmentBuilder = () => {
    const selectedItemsData = generatedItems.filter(item => selectedItems.includes(item.id));
    
    // Create initial section with selected questions
    const initialSection: AssessmentSection = {
      id: 'section-1',
      title: 'SECTION - A',
      questions: selectedItemsData.map(item => ({
        id: `question-${item.id}`,
        questionText: item.question,
        marks: item.marks,
        subQuestions: [],
        originalItem: item
      }))
    };

    setAssessmentBuilder(prev => ({
      ...prev,
      sections: [initialSection],
      totalMarks: selectedItemsData.reduce((total, item) => total + item.marks, 0)
    }));
    
    setShowAssessmentBuilder(true);
  };

  // Sortable Question Card Component
  const SortableQuestionCard = ({ question, sectionId, index }: { question: QuestionCard, sectionId: string, index: number }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
    } = useSortable({ 
      id: question.id,
      data: { sectionId }
    });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <Card ref={setNodeRef} style={style} className="mb-4 border-l-4 border-l-primary">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Drag Handle */}
            <button
              {...attributes}
              {...listeners}
              className="mt-1 p-1 hover:bg-muted rounded cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </button>

            <div className="flex-1 space-y-3">
              {/* Question Number and Text */}
              <div className="flex items-start gap-3">
                <span className="font-semibold text-primary min-w-8">
                  {assessmentBuilder.mainNumbering === 'continuous' 
                    ? `${assessmentBuilder.sections.reduce((total, section, sIndex) => 
                        sIndex < assessmentBuilder.sections.findIndex(s => s.id === sectionId) 
                          ? total + section.questions.length 
                          : total, 0) + index + 1}.`
                    : `${index + 1}.`
                  }
                </span>
                <div className="flex-1">
                  <Textarea
                    value={question.questionText}
                    onChange={(e) => updateQuestion(sectionId, question.id, { questionText: e.target.value })}
                    className="min-h-16 border-none p-0 resize-none focus:ring-0"
                    placeholder="Enter your question here..."
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={question.marks}
                    onChange={(e) => updateQuestion(sectionId, question.id, { marks: parseInt(e.target.value) || 0 })}
                    className="w-16 text-center"
                    min="0"
                  />
                  <span className="text-sm text-muted-foreground">marks</span>
                </div>
              </div>

              {/* Sub-questions */}
              {question.subQuestions.length > 0 && (
                <div className="ml-8 space-y-2 border-l-2 border-muted pl-4">
                  {question.subQuestions.map((subQ, subIndex) => (
                    <div key={subQ.id} className="flex items-start gap-3">
                      <span className="font-medium text-sm min-w-8">
                        {getSubQuestionNumber(subQ, subIndex)}
                      </span>
                      <div className="flex-1">
                        <Textarea
                          value={subQ.text}
                          onChange={(e) => updateSubQuestion(sectionId, question.id, subQ.id, { text: e.target.value })}
                          className="min-h-12 border-none p-0 resize-none text-sm focus:ring-0"
                          placeholder="Enter sub-question..."
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Select
                          value={subQ.numberingStyle}
                          onValueChange={(value) => updateSubQuestion(sectionId, question.id, subQ.id, { numberingStyle: value as SubQuestion['numberingStyle'] })}
                        >
                          <SelectTrigger className="w-24 h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="numeric">1, 2, 3</SelectItem>
                            <SelectItem value="alpha">a, b, c</SelectItem>
                            <SelectItem value="roman">i, ii, iii</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                        {subQ.numberingStyle === 'custom' && (
                          <Input
                            value={subQ.customLabel || ''}
                            onChange={(e) => updateSubQuestion(sectionId, question.id, subQ.id, { customLabel: e.target.value })}
                            className="w-16 h-8 text-xs"
                            placeholder="Label"
                          />
                        )}
                        <Input
                          type="number"
                          value={subQ.marks}
                          onChange={(e) => updateSubQuestion(sectionId, question.id, subQ.id, { marks: parseInt(e.target.value) || 0 })}
                          className="w-12 h-8 text-center text-xs"
                          min="0"
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setAssessmentBuilder(prev => ({
                              ...prev,
                              sections: prev.sections.map(section => 
                                section.id === sectionId 
                                  ? {
                                      ...section,
                                      questions: section.questions.map(q => 
                                        q.id === question.id 
                                          ? { ...q, subQuestions: q.subQuestions.filter(sub => sub.id !== subQ.id) }
                                          : q
                                      )
                                    }
                                  : section
                              )
                            }));
                          }}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Sub-question Button */}
              <Button
                size="sm"
                variant="outline"
                onClick={() => addSubQuestion(sectionId, question.id)}
                className="ml-8 h-8 text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Sub-question
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );

  useEffect(() => {
    generateItems();
  }, []);

  const generateItems = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockItems: GeneratedItem[] = [];
      let itemId = 1;
      
      // Use the new configuredItems structure from AssessmentELOSelection
      assessmentData.configuredItems?.forEach((config: any) => {
        for (let i = 0; i < config.noOfItems; i++) {
          mockItems.push({
            id: `item-${itemId++}`,
            question: generateMockQuestion(config.itemType, config.bloomsLevel, config.eloTitle),
            itemType: config.itemType,
            bloomsLevel: config.bloomsLevel,
            difficulty: config.difficulty,
            marks: config.marksPerItem,
            eloId: config.eloId,
            eloTitle: config.eloTitle,
            isSelected: false,
            ...(config.itemType === 'Multiple Choice' && {
              options: generateMockOptions(),
              correctAnswer: generateMockOptions()[0]
            })
          });
        }
      });
      
      setGeneratedItems(mockItems);
      toast.success(`Generated ${mockItems.length} assessment items successfully!`);
    } catch (error) {
      toast.error('Failed to generate items. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMockQuestion = (type: string, bloomsLevel: string, eloTitle: string) => {
    const questions = {
      'Multiple Choice': [
        `Which of the following best describes ${eloTitle.toLowerCase()}?`,
        `In the context of ${eloTitle.toLowerCase()}, what is the most accurate statement?`,
        `According to ${eloTitle.toLowerCase()}, which option is correct?`
      ],
      'Long Answer': [
        `Critically analyze the key concepts in ${eloTitle.toLowerCase()} and discuss their implications.`,
        `Explain the fundamental principles of ${eloTitle.toLowerCase()} with relevant examples.`,
        `Evaluate the importance of ${eloTitle.toLowerCase()} in the broader context of the subject.`
      ],
      'Short Answer': [
        `Define ${eloTitle.toLowerCase()} and explain its significance.`,
        `List the main components of ${eloTitle.toLowerCase()}.`,
        `Briefly describe the process involved in ${eloTitle.toLowerCase()}.`
      ]
    };
    
    const typeQuestions = questions[type as keyof typeof questions] || questions['Short Answer'];
    return typeQuestions[Math.floor(Math.random() * typeQuestions.length)];
  };

  const generateMockOptions = () => {
    return [
      'Primary metabolic process',
      'Secondary cellular function', 
      'Tertiary biochemical reaction',
      'Quaternary molecular structure'
    ];
  };

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
    
    setGeneratedItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, isSelected: !item.isSelected }
          : item
      )
    );
  };

  const deleteItem = (itemId: string) => {
    setGeneratedItems(prev => prev.filter(item => item.id !== itemId));
    setSelectedItems(prev => prev.filter(id => id !== itemId));
    toast.success('Item deleted successfully');
  };

  const updateItem = (updatedItem: GeneratedItem) => {
    setGeneratedItems(prev => 
      prev.map(item => item.id === updatedItem.id ? updatedItem : item)
    );
    setEditingItem(null);
    setImageFile(null);
    setImagePreview(null);
    toast.success('Item updated successfully');
  };

  const handleImageUpload = (file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (editingItem) {
      setEditingItem({
        ...editingItem,
        hasImage: false,
        imageUrl: undefined
      });
    }
  };

  const saveItemWithImage = () => {
    if (editingItem) {
      const updatedItem = {
        ...editingItem,
        hasImage: !!imagePreview || !!editingItem.imageUrl,
        imageUrl: imagePreview || editingItem.imageUrl
      };
      updateItem(updatedItem);
    }
  };

  const getItemsByType = (type: string) => {
    if (type === 'all') return generatedItems;
    return generatedItems.filter(item => item.itemType === type);
  };

  const getSelectedItems = () => {
    return generatedItems.filter(item => item.isSelected);
  };

  // Sync selectedItems array with isSelected properties
  useEffect(() => {
    const actualSelectedItems = generatedItems.filter(item => item.isSelected).map(item => item.id);
    setSelectedItems(actualSelectedItems);
  }, [generatedItems]);

  const calculateBloomsTaxonomyDistribution = () => {
    const selectedItems = getSelectedItems();
    const distribution: { [key: string]: number } = {};
    
    selectedItems.forEach(item => {
      distribution[item.bloomsLevel] = (distribution[item.bloomsLevel] || 0) + 1;
    });
    
    return distribution;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'Multiple Choice': 'bg-blue-100 text-blue-700',
      'True/False': 'bg-green-100 text-green-700',
      'Short Answer': 'bg-yellow-100 text-yellow-700',
      'Long Answer': 'bg-purple-100 text-purple-700',
      'Problem Solving': 'bg-orange-100 text-orange-700',
      'Case Study': 'bg-pink-100 text-pink-700',
      'Essay': 'bg-indigo-100 text-indigo-700'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const getBadgeColor = (level: string) => {
    const colors = {
      'Remember': 'bg-red-100 text-red-700',
      'Understand': 'bg-orange-100 text-orange-700',
      'Apply': 'bg-yellow-100 text-yellow-700',
      'Analyze': 'bg-green-100 text-green-700',
      'Evaluate': 'bg-blue-100 text-blue-700',
      'Create': 'bg-purple-100 text-purple-700'
    };
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const itemTypes = [...new Set(generatedItems.map(item => item.itemType))];
  const selectedItemsData = getSelectedItems();
  const totalSelectedMarks = selectedItemsData.reduce((sum, item) => sum + item.marks, 0);
  const bloomsDistribution = calculateBloomsTaxonomyDistribution();

  if (isGenerating) {
    return (
      <div className="space-y-8">
        <Card className="border border-border/50 bg-white">
          <CardContent className="p-12 text-center">
            <div className="space-y-6">
              <Sparkles className="h-16 w-16 text-green-600 mx-auto animate-spin" />
              <div>
                <h3 className="text-2xl font-semibold text-foreground mb-2">Generating Assessment Items</h3>
                <p className="text-muted-foreground">Please wait while we create your customized questions...</p>
              </div>
              <Progress value={66} className="w-full max-w-md mx-auto" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Generation Results Header */}
      <Card className="border border-border/50 bg-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-foreground">Assessment Items Generated</h3>
              <p className="text-muted-foreground">Review, edit, and select items for your final assessment</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600">{generatedItems.length}</div>
              <div className="text-sm text-muted-foreground">Total items generated</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-card p-1.5 rounded-xl border border-border shadow-sm h-16 gap-1">
          <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-lg font-medium transition-all duration-200 hover:scale-105 hover:bg-muted/80 py-3 px-4">All Items ({generatedItems.length})</TabsTrigger>
          <TabsTrigger value="selected" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-lg font-medium transition-all duration-200 hover:scale-105 hover:bg-muted/80 py-3 px-4">Selected ({getSelectedItems().length})</TabsTrigger>
          <TabsTrigger value="historical" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-lg font-medium transition-all duration-200 hover:scale-105 hover:bg-muted/80 py-3 px-4">Historical Questions</TabsTrigger>
        </TabsList>

        {/* All Items Tab */}
        <TabsContent value="all" className="space-y-6">
          {/* Filters */}
          <div className="flex items-center gap-4">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-border rounded-md px-3 py-2 text-sm"
            >
              <option value="all">All Types</option>
              {itemTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Items Grid */}
          <div className="grid gap-4">
            {getItemsByType(filterType).map((item, index) => (
              <Card key={item.id} className={`border border-border/50 ${item.isSelected ? 'ring-2 ring-green-500 bg-green-50/50' : 'bg-white'}`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Checkbox 
                      checked={item.isSelected}
                      onCheckedChange={() => toggleItemSelection(item.id)}
                      className="mt-1"
                    />
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                            <Badge className={getTypeColor(item.itemType)}>{item.itemType}</Badge>
                            <Badge className={getBadgeColor(item.bloomsLevel)}>{item.bloomsLevel}</Badge>
                            <Badge variant="outline">{item.marks} marks</Badge>
                            {item.hasImage && (
                              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                                <Image className="h-3 w-3 mr-1" />
                                Image
                              </Badge>
                            )}
                          </div>
                          <p className="text-foreground font-medium">{item.question}</p>
                          <p className="text-sm text-muted-foreground">ELO: {item.eloTitle}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => setPreviewItem(item)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Preview Question</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="flex gap-2">
                                  <Badge className={getTypeColor(item.itemType)}>{item.itemType}</Badge>
                                  <Badge className={getBadgeColor(item.bloomsLevel)}>{item.bloomsLevel}</Badge>
                                  <Badge variant="outline">{item.marks} marks</Badge>
                                </div>
                                <p className="text-lg font-medium">{item.question}</p>
                                {item.options && (
                                  <div className="space-y-2">
                                    <p className="font-medium">Options:</p>
                                    {item.options.map((option, idx) => (
                                      <div key={idx} className="flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-sm">
                                          {String.fromCharCode(65 + idx)}
                                        </span>
                                        <span>{option}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => setEditingItem(item)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                              <DialogHeader>
                                <DialogTitle>Edit Question</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-6">
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">Question Text</label>
                                  <Textarea 
                                    value={editingItem?.question || ''} 
                                    onChange={(e) => setEditingItem(prev => prev ? {...prev, question: e.target.value} : null)}
                                    className="min-h-[100px]"
                                  />
                                </div>
                                
                                <div className="space-y-4">
                                  <label className="text-sm font-medium">Image (Optional)</label>
                                  {(imagePreview || editingItem?.imageUrl) ? (
                                    <div className="space-y-3">
                                      <div className="relative border border-border rounded-lg p-4">
                                        <img 
                                          src={imagePreview || editingItem?.imageUrl} 
                                          alt="Question image" 
                                          className="max-w-full h-auto max-h-64 rounded-md"
                                        />
                                        <Button 
                                          variant="ghost" 
                                          size="sm" 
                                          onClick={removeImage}
                                          className="absolute top-2 right-2 bg-red-100 hover:bg-red-200"
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                                      <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                      <p className="text-sm text-muted-foreground mb-2">Upload an image for this question</p>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                                        className="hidden"
                                        id="image-upload"
                                      />
                                      <label 
                                        htmlFor="image-upload"
                                        className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 cursor-pointer"
                                      >
                                        Choose File
                                      </label>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex gap-2">
                                  <Button onClick={saveItemWithImage}>
                                    Save Changes
                                  </Button>
                                  <Button variant="outline" onClick={() => {
                                    setEditingItem(null);
                                    setImageFile(null);
                                    setImagePreview(null);
                                  }}>
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button variant="ghost" size="sm" onClick={() => deleteItem(item.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Selected Items Tab */}
        <TabsContent value="selected" className="space-y-6">
          <Card className="border border-border/50 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Finalized Assessment Items
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {selectedItemsData.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No items selected yet. Go to "All Items" tab to select questions.
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Group by type */}
                  {itemTypes.map(type => {
                    const typeItems = selectedItemsData.filter(item => item.itemType === type);
                    if (typeItems.length === 0) return null;
                    
                    return (
                      <div key={type} className="space-y-4">
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-semibold">{type}</h4>
                          <Badge variant="outline">{typeItems.length} questions</Badge>
                          <Badge variant="outline">{typeItems.reduce((sum, item) => sum + item.marks, 0)} marks</Badge>
                        </div>
                        <div className="grid gap-3">
                          {typeItems.map((item, index) => (
                            <Card key={item.id} className="border border-green-200 bg-green-50/50">
                              <CardContent className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-sm font-medium">Q{index + 1}</span>
                                  <Badge className={getBadgeColor(item.bloomsLevel)}>{item.bloomsLevel}</Badge>
                                  <Badge variant="outline">{item.marks} marks</Badge>
                                </div>
                                <p className="text-foreground">{item.question}</p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                        <Separator />
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Historical Questions Tab */}
        <TabsContent value="historical" className="space-y-6">
          <Card className="border border-border/50 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                Previously Asked Questions
              </CardTitle>
              <p className="text-muted-foreground">Review questions from previous assessments to avoid repetition</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {historicalQuestions.map((item, index) => (
                <Card key={item.id} className="border border-blue-200 bg-blue-50/50">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge className={getTypeColor(item.itemType)}>{item.itemType}</Badge>
                          <Badge className={getBadgeColor(item.bloomsLevel)}>{item.bloomsLevel}</Badge>
                          <Badge variant="outline">{item.marks} marks</Badge>
                        </div>
                        <p className="text-foreground">{item.question}</p>
                        <p className="text-sm text-muted-foreground">From: PA1 (Previous Assessment)</p>
                      </div>
                      <Badge variant="outline" className="text-blue-600">Historical</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>

      {/* Review & Create Assessment Section */}
      {selectedItems.length > 0 && (
        <Card className="border border-border/50 bg-gradient-to-br from-orange-50/50 to-white">
          <CardHeader className="bg-gradient-to-r from-orange-500/10 to-red-500/10">
            <CardTitle className="flex items-center gap-2 text-2xl bg-gradient-to-r from-orange-600 to-red-800 bg-clip-text text-transparent">
              <BarChart3 className="h-6 w-6 text-orange-600" />
              Review & Create Assessment
            </CardTitle>
            <p className="text-muted-foreground">Review your assessment overview and finalize the creation</p>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            {/* Summary Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">Total Chapters</div>
                <div className="text-2xl font-bold text-blue-700">{assessmentData.selectedChapters?.length || 0}</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">ELOs Addressed</div>
                <div className="text-2xl font-bold text-green-700">{assessmentData.selectedELOs?.length || 0}</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">Selected Items</div>
                <div className="text-2xl font-bold text-purple-700">{selectedItems.length}</div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">Total Marks</div>
                <div className="text-2xl font-bold text-orange-700">{totalSelectedMarks}</div>
              </div>
            </div>

            {/* Bloom's Taxonomy Distribution */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Bloom's Taxonomy Distribution
              </h4>
              <div className="space-y-2">
                {Object.entries(bloomsDistribution).map(([level, count]) => (
                  <div key={level} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="font-medium">{level}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getBadgeColor(level).split(' ')[0]}`}
                          style={{ width: `${selectedItems.length > 0 ? (count / selectedItems.length) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Create Assessment Button */}
            <div className="text-center pt-6">
              <Button 
                size="lg"
                disabled={selectedItems.length === 0}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold px-12 py-4 text-lg rounded-xl hover:scale-105 transition-all duration-300 transform disabled:hover:scale-100"
                onClick={() => {
                  setShowAssessmentBuilder(true);
                  toast.success('Opening Assessment Builder...');
                }}
              >
                <Save className="h-5 w-5 mr-2" />
                Create Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Assessment Builder */}
      {showAssessmentBuilder && (
        <AssessmentBuilder
          selectedItems={selectedItemsData}
          onBack={() => setShowAssessmentBuilder(false)}
        />
      )}
    </div>
  );
};

export default AssessmentItemGeneration;