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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  Eye, Edit, Trash2, CheckCircle2, Clock, BookOpen, Target, 
  BarChart3, PieChart, Save, Filter, X, Sparkles, Image, Upload,
  GripVertical, Plus, FileDown, Settings, ChevronDown
} from 'lucide-react';
import { toast } from 'sonner';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
  PointerSensor,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [showAssessmentBuilder, setShowAssessmentBuilder] = useState(false);
  
  // Drag and drop state
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDragOverlay, setIsDragOverlay] = useState(false);
  
  // Configure sensors for smooth drag experience
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 8,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 200,
      tolerance: 5,
    },
  });
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8,
    },
  });
  
  const sensors = useSensors(mouseSensor, touchSensor, pointerSensor);
  const [builderData, setBuilderData] = useState({
    totalMarks: assessmentData.marks || '',
    totalTime: assessmentData.duration ? 
      (parseInt(assessmentData.duration.split(':')[0]) * 60 + parseInt(assessmentData.duration.split(':')[1] || '0')).toString() 
      : '',
    numberingStyle: 'continuous',
    generalInstructions: 'Read all instructions carefully before attempting the questions.',
    sections: [] as any[],
    assessmentTitle: '',
    subject: '',
    classGrade: '',
    timeHours: '',
    timeMinutes: '',
    examDate: '',
    schoolName: '',
    schoolLogo: ''
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

  useEffect(() => {
    generateItems();
  }, []);

  // Sync builder data when assessment data changes
  useEffect(() => {
    setBuilderData(prev => ({
      ...prev,
      totalMarks: assessmentData.marks || '',
      totalTime: assessmentData.duration ? 
        (parseInt(assessmentData.duration.split(':')[0]) * 60 + parseInt(assessmentData.duration.split(':')[1] || '0')).toString() 
        : ''
    }));
  }, [assessmentData.marks, assessmentData.duration]);

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

  // Export functions
  const exportAsQTI = () => {
    toast.success('QTI export initiated', {
      description: 'Your assessment will be exported in QTI format shortly.'
    });
    
    // Create QTI XML structure (simplified)
    const qtiContent = `<?xml version="1.0" encoding="UTF-8"?>
<assessmentItem xmlns="http://www.imsglobal.org/xsd/imsqti_v2p1">
  <itemBody>
    <!-- Assessment content would go here -->
  </itemBody>
</assessmentItem>`;
    
    const blob = new Blob([qtiContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${assessmentData.assessmentName || 'assessment'}.qti`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportAsPDF = () => {
    toast.success('PDF export initiated', {
      description: 'Your assessment will be exported as PDF shortly.'
    });
    
    // In a real implementation, you'd use a PDF library like jsPDF
    // For now, we'll just show success message
    console.log('PDF export would be implemented here');
  };

  // Drag and drop handlers
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    setIsDragOverlay(true);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    // Handle drag over for sections in assessment builder
    if (showAssessmentBuilder) {
      const activeQuestion = generatedItems.find(item => item.id === activeId);
      const overSection = builderData.sections.find(section => section.id === overId);
      
      if (activeQuestion && overSection) {
        // Move question to different section
        const updatedSections = builderData.sections.map(section => {
          if (section.id === overId) {
            return {
              ...section,
              questions: [...section.questions, activeQuestion]
            };
          }
          return {
            ...section,
            questions: section.questions.filter((q: any) => q.id !== activeId)
          };
        });

        setBuilderData(prev => ({
          ...prev,
          sections: updatedSections
        }));
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveId(null);
    setIsDragOverlay(false);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    if (showAssessmentBuilder) {
      // Handle reordering within sections
      builderData.sections.forEach((section, sectionIndex) => {
        const activeIndex = section.questions.findIndex((q: any) => q.id === activeId);
        const overIndex = section.questions.findIndex((q: any) => q.id === overId);
        
        if (activeIndex !== -1 && overIndex !== -1) {
          const reorderedQuestions = arrayMove(section.questions, activeIndex, overIndex);
          
          const updatedSections = [...builderData.sections];
          updatedSections[sectionIndex] = {
            ...section,
            questions: reorderedQuestions
          };

          setBuilderData(prev => ({
            ...prev,
            sections: updatedSections
          }));
        }
      });
    } else {
      // Handle reordering in the main items list
      const activeIndex = generatedItems.findIndex(item => item.id === activeId);
      const overIndex = generatedItems.findIndex(item => item.id === overId);

      if (activeIndex !== -1 && overIndex !== -1) {
        setGeneratedItems(items => arrayMove(items, activeIndex, overIndex));
        toast.success('Question reordered successfully');
      }
    }
  };

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
          <TabsTrigger value="all" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-lg font-medium transition-all duration-200 hover:scale-105 hover:bg-blue-50 hover:text-blue-700 py-3 px-4 text-blue-600 border border-transparent data-[state=active]:border-blue-600">All Items ({generatedItems.length})</TabsTrigger>
          <TabsTrigger value="selected" className="data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-lg font-medium transition-all duration-200 hover:scale-105 hover:bg-green-50 hover:text-green-700 py-3 px-4 text-green-600 border border-transparent data-[state=active]:border-green-600">Selected ({getSelectedItems().length})</TabsTrigger>
          <TabsTrigger value="historical" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-lg font-medium transition-all duration-200 hover:scale-105 hover:bg-orange-50 hover:text-orange-700 py-3 px-4 text-orange-600 border border-transparent data-[state=active]:border-orange-600">Historical Questions</TabsTrigger>
        </TabsList>

        {/* All Items Tab */}
        <TabsContent value="all" className="space-y-6">
          {/* Filters */}
          <div className="flex items-center justify-between">
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
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const filteredItems = getItemsByType(filterType);
                  setGeneratedItems(prev => 
                    prev.map(item => 
                      filteredItems.find(filtered => filtered.id === item.id) 
                        ? { ...item, isSelected: true }
                        : item
                    )
                  );
                }}
                className="text-xs"
              >
                Select All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const filteredItems = getItemsByType(filterType);
                  setGeneratedItems(prev => 
                    prev.map(item => 
                      filteredItems.find(filtered => filtered.id === item.id) 
                        ? { ...item, isSelected: false }
                        : item
                    )
                  );
                }}
                className="text-xs"
              >
                Clear
              </Button>
            </div>
          </div>

          {/* Items Grid with Drag and Drop */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={getItemsByType(filterType).map(item => item.id)} strategy={verticalListSortingStrategy}>
              <div className="grid gap-4">
                {getItemsByType(filterType).map((item, index) => (
                  <DraggableQuestionCard
                    key={item.id}
                    item={item}
                    index={index}
                    onSelect={() => toggleItemSelection(item.id)}
                    onPreview={() => setPreviewItem(item)}
                    onEdit={() => setEditingItem(item)}
                    onDelete={() => deleteItem(item.id)}
                    getTypeColor={getTypeColor}
                    getBadgeColor={getBadgeColor}
                  />
                ))}
              </div>
            </SortableContext>
            
            <DragOverlay>
              {activeId ? (
                <DragOverlayContent 
                  item={generatedItems.find(item => item.id === activeId)}
                  getTypeColor={getTypeColor}
                  getBadgeColor={getBadgeColor}
                />
              ) : null}
            </DragOverlay>
          </DndContext>
          
          {/* Edit Dialog */}
          {editingItem && (
            <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
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
          )}
          
          {/* Preview Dialog */}
          {previewItem && (
            <Dialog open={!!previewItem} onOpenChange={() => setPreviewItem(null)}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Preview Question</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Badge className={getTypeColor(previewItem.itemType)}>{previewItem.itemType}</Badge>
                    <Badge className={getBadgeColor(previewItem.bloomsLevel)}>{previewItem.bloomsLevel}</Badge>
                    <Badge variant="outline">{previewItem.marks} marks</Badge>
                  </div>
                  <p className="text-lg font-medium">{previewItem.question}</p>
                  {previewItem.options && (
                    <div className="space-y-2">
                      <p className="font-medium">Options:</p>
                      {previewItem.options.map((option, idx) => (
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
          )}
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
                  // Auto-fetch selected items and organize them into sections
                  const selectedItemsData = getSelectedItems();
                  
                  // Group items by type for better organization
                  const itemsByType = selectedItemsData.reduce((acc: any, item) => {
                    if (!acc[item.itemType]) {
                      acc[item.itemType] = [];
                    }
                    acc[item.itemType].push(item);
                    return acc;
                  }, {});

                  // Create sections based on item types
                  const autoSections = Object.keys(itemsByType).map((itemType, index) => {
                    const items = itemsByType[itemType];
                    return {
                      id: Date.now() + index,
                      title: `SECTION ${String.fromCharCode(65 + index)} - ${itemType.toUpperCase()}`,
                      instruction: `Answer all questions`,
                      questions: items.map((item: any, qIndex: number) => ({
                        id: Date.now() + index * 1000 + qIndex,
                        text: item.question,
                        marks: item.marks,
                        subQuestions: [],
                        hasOROption: false,
                        orQuestion: '',
                        hasImage: false,
                        imageUrl: null
                      }))
                    };
                  });

                  // Update builder data with auto-populated sections
                  setBuilderData(prev => ({
                    ...prev,
                    sections: autoSections,
                    assessmentTitle: assessmentData.assessmentName || prev.assessmentTitle,
                    subject: assessmentData.subject || prev.subject,
                    classGrade: assessmentData.grade || prev.classGrade
                  }));

                  setShowAssessmentBuilder(true);
                  
                  updateAssessmentData({ 
                    finalizedItems: selectedItemsData,
                    assessmentOverview: {
                      totalChapters: assessmentData.selectedChapters?.length || 0,
                      totalELOs: assessmentData.selectedELOs?.length || 0,
                      totalItems: selectedItems.length,
                      totalMarks: totalSelectedMarks,
                      bloomsDistribution
                    }
                  });
                  
                  toast.success(`Assessment created with ${selectedItemsData.length} items organized into ${autoSections.length} sections!`);
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
        <Card className="border border-border/50 bg-white mt-8">
          <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10">
            <CardTitle className="flex items-center gap-2 text-2xl bg-gradient-to-r from-blue-600 to-purple-800 bg-clip-text text-transparent">
              <Settings className="h-6 w-6 text-blue-600" />
              Assessment Builder
            </CardTitle>
            <p className="text-muted-foreground">Configure and build your assessment paper</p>
          </CardHeader>
          <CardContent className="space-y-8 p-8">
            
            {/* Question Numbering Control */}
            <Card className="border border-blue-200 bg-blue-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-blue-800">Question Numbering Settings</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-blue-700">Numbering Style:</label>
                  <Select 
                    value={builderData.numberingStyle || 'continuous'} 
                    onValueChange={(value) => setBuilderData(prev => ({ ...prev, numberingStyle: value }))}
                  >
                    <SelectTrigger className="w-64 bg-white border-blue-300 shadow-sm">
                      <SelectValue placeholder="Select numbering style" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                      <SelectItem value="continuous" className="hover:bg-blue-50 cursor-pointer">
                        Continuous Numbering (1, 2, 3, 4...)
                      </SelectItem>
                      <SelectItem value="reset" className="hover:bg-blue-50 cursor-pointer">
                        Reset per Section (1, 2... then 1, 2...)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-slate-300 bg-gradient-to-r from-slate-50 to-gray-50">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-center">Assessment Paper Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Assessment Title</label>
                    <Input 
                      placeholder="e.g., Annual Examination 2024"
                      value={builderData.assessmentTitle || assessmentData.assessmentName || ''}
                      onChange={(e) => setBuilderData(prev => ({ ...prev, assessmentTitle: e.target.value }))}
                      className="font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Subject</label>
                    <Input 
                      placeholder="e.g., Mathematics / Science"
                      value={builderData.subject || assessmentData.subject || ''}
                      onChange={(e) => setBuilderData(prev => ({ ...prev, subject: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Class/Grade</label>
                    <Input 
                      placeholder="e.g., Class X / Grade 10"
                      value={builderData.classGrade || assessmentData.grade || ''}
                      onChange={(e) => setBuilderData(prev => ({ ...prev, classGrade: e.target.value }))}
                    />
                  </div>
                 </div>
                 
                 {/* School Name & Logo */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <label className="text-sm font-semibold">School Name</label>
                     <Input 
                       placeholder="e.g., ABC High School"
                       value={builderData.schoolName || ''}
                       onChange={(e) => setBuilderData(prev => ({ ...prev, schoolName: e.target.value }))}
                     />
                   </div>
                   <div className="space-y-2">
                     <label className="text-sm font-semibold">School Logo</label>
                     <input
                       type="file"
                       accept="image/*"
                       onChange={(e) => {
                         const file = e.target.files?.[0];
                         if (file) {
                           const reader = new FileReader();
                           reader.onload = (event) => {
                             setBuilderData(prev => ({
                               ...prev,
                               schoolLogo: event.target?.result as string
                             }));
                           };
                           reader.readAsDataURL(file);
                         }
                       }}
                       className="w-full file:mr-2 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border rounded-md h-10"
                     />
                   </div>
                 </div>
                 
                 {/* Time & Marks */}
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-white rounded-lg border">
                   <div className="space-y-2">
                     <label className="text-sm font-semibold text-blue-700">Total Marks</label>
                     <Input 
                       type="number"
                       placeholder="100"
                       value={builderData.totalMarks}
                       onChange={(e) => {
                         const value = e.target.value;
                         setBuilderData(prev => ({ ...prev, totalMarks: value }));
                         updateAssessmentData({ marks: value });
                       }}
                       className="h-12 text-lg font-bold text-center text-blue-700"
                     />
                   </div>
                   <div className="space-y-2">
                     <label className="text-sm font-semibold text-green-700">Time Duration</label>
                     <div className="grid grid-cols-2 gap-2">
                       <div>
                         <Input 
                           type="number"
                           placeholder="3"
                           value={builderData.timeHours || ''}
                           onChange={(e) => setBuilderData(prev => ({ ...prev, timeHours: e.target.value }))}
                           className="h-12 text-lg font-bold text-center text-green-700"
                         />
                         <label className="text-xs text-green-600 block text-center mt-1">Hours</label>
                       </div>
                       <div>
                         <Input 
                           type="number"
                           max="59"
                           placeholder="30"
                           value={builderData.timeMinutes || ''}
                           onChange={(e) => setBuilderData(prev => ({ ...prev, timeMinutes: e.target.value }))}
                           className="h-12 text-lg font-bold text-center text-green-700"
                         />
                         <label className="text-xs text-green-600 block text-center mt-1">Minutes</label>
                       </div>
                     </div>
                   </div>
                   <div className="space-y-2">
                     <label className="text-sm font-semibold text-purple-700">Exam Date</label>
                     <Input 
                       type="date"
                       value={builderData.examDate || ''}
                       onChange={(e) => setBuilderData(prev => ({ ...prev, examDate: e.target.value }))}
                       className="h-12"
                     />
                   </div>
                 </div>
              </CardContent>
            </Card>

            {/* General Instructions */}
            <Card className="border border-blue-200 bg-blue-50/50">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-blue-800">General Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={builderData.generalInstructions}
                  onChange={(e) => setBuilderData(prev => ({ ...prev, generalInstructions: e.target.value }))}
                  className="min-h-[120px] border-blue-200 bg-white font-medium"
                  placeholder="1. Read all instructions carefully before attempting the questions.&#10;2. Answer all questions.&#10;3. All questions are compulsory.&#10;4. Use blue or black pen only."
                />
              </CardContent>
            </Card>

            {/* Assessment Preview */}
            <Card className="border border-border bg-card">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                <CardTitle className="text-center">Assessment Paper Preview</CardTitle>
              </CardHeader>
              
              <CardContent className="p-4 space-y-6">
                {/* Paper Header Preview */}
                <Card className="border-2 border-gray-800">
                   <CardHeader className="bg-gray-50 border-b-2 border-gray-800 p-4">
                     {/* Header Layout */}
                     <div className="space-y-2">
                       {/* Logo area with consistent height */}
                       <div className="flex justify-center mb-2 h-12">
                         {builderData.schoolLogo ? (
                           <img 
                             src={builderData.schoolLogo} 
                             alt="School Logo" 
                             className="w-12 h-12 object-contain"
                           />
                         ) : (
                           <div className="w-12 h-12"></div>
                         )}
                       </div>
                       
                       {/* Center - Title */}
                       <div className="text-center mb-4">
                         <h2 className="text-lg font-bold uppercase leading-tight">
                           {builderData.schoolName || 'SCHOOL NAME'}
                         </h2>
                         <h3 className="text-base font-semibold uppercase mt-1">
                           {builderData.assessmentTitle || 'ASSESSMENT PAPER'}
                         </h3>
                       </div>
                       
                       {/* Row 1: Class and Marks */}
                       <div className="flex justify-between items-center">
                         <div className="text-sm font-medium">
                           <span className="italic">Class:</span> {builderData.classGrade || '____'}
                         </div>
                         <div className="text-sm font-medium">
                           <span className="font-bold">Marks:</span> {builderData.totalMarks || '__'}
                         </div>
                       </div>
                       
                       {/* Row 2: Subject and Time */}
                       <div className="flex justify-between items-center">
                         <div className="text-sm font-medium">
                           <span className="italic">Subject:</span> {builderData.subject || '____'}
                         </div>
                         <div className="text-sm font-medium">
                           <span className="font-bold">Time:</span> {builderData.timeHours || '__'} hours {builderData.timeMinutes ? `${builderData.timeMinutes} mins` : ''}
                         </div>
                       </div>
                     </div>
                  </CardHeader>
                  <CardContent className="p-3">
                    <div className="text-xs">
                      <strong>Instructions:</strong> {builderData.generalInstructions || 'Read all questions carefully.'}
                    </div>
                  </CardContent>
                </Card>

                {/* Sections Management */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Question Sections</h3>
                    <Button 
                      onClick={() => {
                        const newSection = {
                          id: Date.now(),
                          title: `SECTION ${String.fromCharCode(65 + builderData.sections.length)}`,
                          instruction: 'Answer all questions',
                          questions: []
                        };
                        setBuilderData(prev => ({ 
                          ...prev, 
                          sections: [...prev.sections, newSection] 
                        }));
                      }}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Section
                    </Button>
                  </div>

                  {/* Global DndContext for cross-section drag and drop */}
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragOver={(event) => {
                      const { active, over } = event;
                      if (!over) return;

                      const activeId = active.id as string;
                      const overId = over.id as string;

                      if (activeId === overId) return;

                      // Find which sections contain the active and over items
                      let activeSection = null;
                      let overSection = null;
                      let activeIndex = -1;
                      let overIndex = -1;

                      builderData.sections.forEach((section, sectionIdx) => {
                        const activeIdx = section.questions.findIndex((q: any) => q.id === activeId);
                        const overIdx = section.questions.findIndex((q: any) => q.id === overId);
                        
                        if (activeIdx !== -1) {
                          activeSection = sectionIdx;
                          activeIndex = activeIdx;
                        }
                        if (overIdx !== -1) {
                          overSection = sectionIdx;
                          overIndex = overIdx;
                        }
                      });

                      // If dragging to a different section, move the question
                      if (activeSection !== null && overSection !== null && activeSection !== overSection) {
                        const updatedSections = [...builderData.sections];
                        const activeQuestion = updatedSections[activeSection].questions[activeIndex];
                        
                        // Remove from active section
                        updatedSections[activeSection].questions.splice(activeIndex, 1);
                        
                        // Add to over section at the right position
                        updatedSections[overSection].questions.splice(overIndex, 0, activeQuestion);
                        
                        setBuilderData(prev => ({ ...prev, sections: updatedSections }));
                      }
                    }}
                    onDragEnd={(event) => {
                      const { active, over } = event;
                      setActiveId(null);
                      setIsDragOverlay(false);

                      if (!over || active.id === over.id) return;

                      const activeId = active.id as string;
                      const overId = over.id as string;

                      // Find sections and indices
                      let activeSection = null;
                      let overSection = null;
                      let activeIndex = -1;
                      let overIndex = -1;

                      builderData.sections.forEach((section, sectionIdx) => {
                        const activeIdx = section.questions.findIndex((q: any) => q.id === activeId);
                        const overIdx = section.questions.findIndex((q: any) => q.id === overId);
                        
                        if (activeIdx !== -1) {
                          activeSection = sectionIdx;
                          activeIndex = activeIdx;
                        }
                        if (overIdx !== -1) {
                          overSection = sectionIdx;
                          overIndex = overIdx;
                        }
                      });

                      if (activeSection !== null && overSection !== null) {
                        const updatedSections = [...builderData.sections];
                        
                        if (activeSection === overSection) {
                          // Reorder within same section
                          const reorderedQuestions = arrayMove(updatedSections[activeSection].questions, activeIndex, overIndex);
                          updatedSections[activeSection].questions = reorderedQuestions;
                        } else {
                          // Move between sections (already handled in onDragOver, but ensure final position)
                          const activeQuestion = updatedSections[activeSection].questions[activeIndex];
                          updatedSections[activeSection].questions.splice(activeIndex, 1);
                          updatedSections[overSection].questions.splice(overIndex, 0, activeQuestion);
                        }
                        
                        setBuilderData(prev => ({ ...prev, sections: updatedSections }));
                        toast.success(activeSection === overSection ? 'Question reordered successfully' : 'Question moved to different section');
                      }
                    }}
                  >
                    {/* Create sortable context with all questions across all sections */}
                    <SortableContext 
                      items={builderData.sections.flatMap(section => section.questions.map((q: any) => q.id))} 
                      strategy={verticalListSortingStrategy}
                    >
                      {builderData.sections.map((section: any, sectionIdx: number) => (
                        <DroppableSectionCard
                          key={section.id}
                          section={section}
                          sectionIdx={sectionIdx}
                          builderData={builderData}
                          setBuilderData={setBuilderData}
                        />
                      ))}
                    </SortableContext>
                    
                    <DragOverlay>
                      {activeId ? (
                        <div className="rotate-3 scale-105">
                          <ExamQuestionCard
                            question={builderData.sections.flatMap(s => s.questions).find((q: any) => q.id === activeId) || {}}
                            questionNumber="•"
                            onUpdate={() => {}}
                            onDelete={() => {}}
                            isDragOverlay={true}
                          />
                        </div>
                      ) : null}
                    </DragOverlay>
                  </DndContext>
                </div>
              </CardContent>
            </Card>

            {/* Export Options */}
            <Card className="border border-green-200 bg-green-50/30">
              <CardHeader>
                <CardTitle className="text-green-800">Export Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Button 
                    onClick={() => setIsPreviewOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Assessment
                  </Button>
                  <Button 
                    onClick={exportAsPDF}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <FileDown className="h-4 w-4 mr-2" />
                    Export as PDF
                  </Button>
                  <Button 
                    onClick={exportAsQTI}
                    variant="outline"
                  >
                    <FileDown className="h-4 w-4 mr-2" />
                    Export as QTI
                  </Button>
                  <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white">
                    <Save className="h-4 w-4 mr-2" />
                    Save Paper
                  </Button>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      )}
      
      {/* Assessment Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            {builderData.schoolLogo && (
              <div className="flex justify-center mt-2">
                <img 
                  src={builderData.schoolLogo} 
                  alt="School Logo" 
                  className="w-16 h-16"
                />
              </div>
            )}
          </DialogHeader>
          <div className="space-y-6 p-4">
            {/* Paper Header */}
            <div className="border-b-2 border-black pb-6 mb-6">
              {/* Top Section - School Name and Assessment Title */}
              <div className="text-center space-y-1 mb-4">
                <h1 className="text-xl font-bold uppercase tracking-wide">
                  {builderData.schoolName || "EXCEL PUBLIC SCHOOL, MYSURU"}
                </h1>
                <h2 className="text-lg font-semibold uppercase">
                  {builderData.assessmentTitle || "TERM 1 ASSESSMENT"} - {builderData.examDate ? new Date(builderData.examDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase() : "SEPTEMBER 2025"}
                </h2>
              </div>
              
              {/* Middle Section - Class/Marks and Subject/Time */}
              <div className="space-y-3 mb-4">
                {/* First Row - Class and Marks */}
                <div className="flex justify-between items-center">
                  <p className="text-lg font-medium italic">
                    <span className="font-semibold">Class:</span> {builderData.classGrade || "VII"}
                  </p>
                  <div className="text-right">
                    <div className="text-sm font-medium mb-1">
                    </div>
                    <p className="text-lg font-bold">
                      <span className="font-semibold">Marks:</span> {builderData.totalMarks || "80"}
                    </p>
                  </div>
                </div>
                
                {/* Second Row - Subject and Time */}
                <div className="flex justify-between items-center">
                  <p className="text-lg font-medium italic">
                    <span className="font-semibold">Subject:</span> {builderData.subject?.toUpperCase() || "SCIENCE"}
                  </p>
                  <p className="text-lg font-bold">
                    <span className="font-semibold">Time:</span> {builderData.timeHours || "3"} hours {builderData.timeMinutes ? `${builderData.timeMinutes} minutes` : ''}
                  </p>
                </div>
              </div>
              
              {/* Bottom border line */}
              <div className="border-t border-gray-400 pt-2"></div>
            </div>

            {/* General Instructions */}
            {builderData.generalInstructions && (
              <div className="border rounded-lg p-4 bg-blue-50">
                <h3 className="font-semibold mb-2">General Instructions:</h3>
                <p className="whitespace-pre-line">{builderData.generalInstructions}</p>
              </div>
            )}

            {/* Sections */}
            {builderData.sections?.map((section: any, sectionIdx: number) => (
              <div key={sectionIdx} className="border rounded-lg p-4">
                <div className="mb-4">
                  <h3 className="text-lg font-bold">Section {String.fromCharCode(65 + sectionIdx)}: {section.title}</h3>
                  {section.instruction && (
                    <p className="text-sm text-gray-600 mt-1">{section.instruction}</p>
                  )}
                </div>
                
                {section.questions?.map((question: any, qIdx: number) => (
                  <div key={question.id} className="mb-6 p-4 border-l-4 border-blue-500 bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold text-lg">Question {qIdx + 1}:</h4>
                      <div className="flex gap-2">
                        <span className="text-sm font-medium bg-blue-100 px-2 py-1 rounded">
                          [{question.marks} marks]
                        </span>
                        {question.itemType && (
                          <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                            {question.itemType}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-base leading-relaxed">{question.question}</p>
                    </div>
                    
                    {/* Main Question Image */}
                    {question.imageUrl && (
                      <div className="mb-4 flex justify-center">
                        <img 
                          src={question.imageUrl} 
                          alt="Question Image" 
                          className="max-w-full max-h-64 rounded border shadow-sm"
                        />
                      </div>
                    )}
                    
                    {/* Question Options */}
                    {question.options && question.options.length > 0 && (
                      <div className="ml-6 mb-4 space-y-2">
                        <p className="font-medium text-gray-700 mb-2">Options:</p>
                        {question.options.map((option: string, optIdx: number) => (
                          <div key={optIdx} className="flex items-start gap-3">
                            <span className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                              {String.fromCharCode(97 + optIdx)})
                            </span>
                            <span className="text-base">{option}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Sub-Questions */}
                    {question.subQuestions && question.subQuestions.length > 0 && (
                      <div className="ml-6 mt-4 space-y-4">
                        <p className="font-medium text-gray-700">Sub-questions:</p>
                        {question.subQuestions.map((subQ: any, subIdx: number) => (
                          <div key={subQ.id} className="border-l-3 border-gray-300 pl-4 bg-white p-3 rounded">
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-medium text-base">({String.fromCharCode(97 + subIdx)})</span>
                              <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                                [{subQ.marks} marks]
                              </span>
                            </div>
                            <p className="mb-2">{subQ.question}</p>
                            {subQ.imageUrl && (
                              <div className="mt-3 flex justify-center">
                                <img 
                                  src={subQ.imageUrl} 
                                  alt="Sub-question Image" 
                                  className="max-w-full max-h-48 rounded border shadow-sm"
                                />
                              </div>
                            )}
                            {/* Sub-question options if any */}
                            {subQ.options && subQ.options.length > 0 && (
                              <div className="ml-4 mt-3 space-y-1">
                                {subQ.options.map((option: string, optIdx: number) => (
                                  <div key={optIdx} className="flex items-start gap-2">
                                    <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium">
                                      {String.fromCharCode(105 + optIdx)})
                                    </span>
                                    <span className="text-sm">{option}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* OR Question */}
                    {question.orQuestion && (
                      <div className="mt-6 pt-4 border-t-2 border-dashed border-gray-400">
                        <div className="text-center mb-3">
                          <h5 className="font-bold text-lg bg-gray-200 inline-block px-4 py-1 rounded">OR</h5>
                        </div>
                        <p className="mb-3 text-base">{question.orQuestion}</p>
                        {question.orQuestionImage && (
                          <div className="mb-3 flex justify-center">
                            <img 
                              src={question.orQuestionImage} 
                              alt="OR Question Image" 
                              className="max-w-full max-h-64 rounded border shadow-sm"
                            />
                          </div>
                        )}
                        {/* OR Question options if any */}
                        {question.orOptions && question.orOptions.length > 0 && (
                          <div className="ml-6 space-y-2">
                            <p className="font-medium text-gray-700">Options:</p>
                            {question.orOptions.map((option: string, optIdx: number) => (
                              <div key={optIdx} className="flex items-start gap-3">
                                <span className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium">
                                  {String.fromCharCode(97 + optIdx)})
                                </span>
                                <span className="text-base">{option}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Droppable Section Card Component
const DroppableSectionCard = ({ section, sectionIdx, builderData, setBuilderData }: any) => {
  return (
    <Card className="border border-blue-200 transition-all duration-200 hover:border-blue-300">
      <CardHeader className="bg-blue-50 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Input 
              value={section.title}
              onChange={(e) => {
                const updatedSections = [...builderData.sections];
                updatedSections[sectionIdx].title = e.target.value;
                setBuilderData((prev: any) => ({ ...prev, sections: updatedSections }));
              }}
              className="font-bold text-sm w-32"
            />
            <Input 
              placeholder="Instructions"
              value={section.instruction || ''}
              onChange={(e) => {
                const updatedSections = [...builderData.sections];
                updatedSections[sectionIdx].instruction = e.target.value;
                setBuilderData((prev: any) => ({ ...prev, sections: updatedSections }));
              }}
              className="text-sm flex-1"
            />
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              const updatedSections = builderData.sections.filter((_: any, idx: number) => idx !== sectionIdx);
              setBuilderData((prev: any) => ({ ...prev, sections: updatedSections }));
            }}
            className="text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-3 min-h-[100px] border-2 border-dashed border-transparent hover:border-blue-200 transition-all duration-200">
        <div className="space-y-3">
          {section.questions.map((question: any, questionIdx: number) => (
            <DraggableExamQuestionCard
              key={question.id}
              question={question}
              questionNumber={
                builderData.numberingStyle === 'continuous' 
                  ? builderData.sections.slice(0, sectionIdx).reduce((sum: number, s: any) => sum + s.questions.length, 0) + questionIdx + 1
                  : questionIdx + 1
              }
              onUpdate={(updatedQuestion: any) => {
                const updatedSections = [...builderData.sections];
                updatedSections[sectionIdx].questions[questionIdx] = updatedQuestion;
                setBuilderData((prev: any) => ({ ...prev, sections: updatedSections }));
              }}
              onDelete={() => {
                const updatedSections = [...builderData.sections];
                updatedSections[sectionIdx].questions = updatedSections[sectionIdx].questions.filter((_: any, idx: number) => idx !== questionIdx);
                setBuilderData((prev: any) => ({ ...prev, sections: updatedSections }));
              }}
            />
          ))}
          
          {section.questions.length === 0 && (
            <div className="text-center py-8 text-gray-400 text-sm">
              Drop questions here or click "Add Question" to create new ones
            </div>
          )}
        </div>
        
        <Button 
          variant="outline" 
          size="sm"
          className="w-full border-dashed text-blue-600 mt-4"
          onClick={() => {
            const newQuestion = {
              id: Date.now(),
              text: 'Enter your question here...',
              marks: 5,
              subQuestions: [],
              hasOROption: false,
              orQuestion: '',
              hasImage: false,
              imageUrl: null
            };
            const updatedSections = [...builderData.sections];
            updatedSections[sectionIdx].questions.push(newQuestion);
            setBuilderData((prev: any) => ({ ...prev, sections: updatedSections }));
          }}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Question
        </Button>
      </CardContent>
    </Card>
  );
};

// Draggable Exam Question Card Component for Assessment Builder  
const DraggableExamQuestionCard = ({ question, questionNumber, onUpdate, onDelete }: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <ExamQuestionCard
        question={question}
        questionNumber={questionNumber}
        onUpdate={onUpdate}
        onDelete={onDelete}
        dragHandleProps={{ ...attributes, ...listeners }}
        isDragging={isDragging}
      />
    </div>
  );
};


// Exam Question Card Component for Assessment Preview
const ExamQuestionCard = ({ question, questionNumber, onUpdate, onDelete, dragHandleProps, isDragging, isDragOverlay }: any) => {
  const [imageFiles, setImageFiles] = useState<{[key: string]: File}>({});
  const [imagePreviews, setImagePreviews] = useState<{[key: string]: string}>({});
  const [subQuestionNumbering, setSubQuestionNumbering] = useState('123');
  const [isCustomNumbering, setIsCustomNumbering] = useState(false);
  const [customLabels, setCustomLabels] = useState<{[key: number]: string}>({});

  const handleImageUpload = (id: string, file: File, type: 'main' | 'subQuestion' | 'orQuestion') => {
    setImageFiles(prev => ({ ...prev, [id]: file }));
    
    const reader = new FileReader();
    reader.onload = () => {
      const imageUrl = reader.result as string;
      setImagePreviews(prev => ({ ...prev, [id]: imageUrl }));
      
      if (type === 'main') {
        onUpdate({ 
          ...question, 
          hasImage: true,
          imageUrl: imageUrl 
        });
      } else if (type === 'subQuestion') {
        const subIdx = question.subQuestions.findIndex((sq: any) => sq.id === id);
        if (subIdx !== -1) {
          const updatedSubQuestions = [...question.subQuestions];
          updatedSubQuestions[subIdx] = {
            ...updatedSubQuestions[subIdx],
            hasImage: true,
            imageUrl: imageUrl
          };
          onUpdate({ ...question, subQuestions: updatedSubQuestions });
        }
      } else if (type === 'orQuestion') {
        onUpdate({ 
          ...question, 
          orQuestionImage: imageUrl,
          hasOrQuestionImage: true 
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (id: string, type: 'main' | 'subQuestion' | 'orQuestion') => {
    setImageFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[id];
      return newFiles;
    });
    setImagePreviews(prev => {
      const newPreviews = { ...prev };
      delete newPreviews[id];
      return newPreviews;
    });
    
    if (type === 'main') {
      onUpdate({ 
        ...question, 
        hasImage: false,
        imageUrl: null 
      });
    } else if (type === 'subQuestion') {
      const subIdx = question.subQuestions.findIndex((sq: any) => sq.id === id);
      if (subIdx !== -1) {
        const updatedSubQuestions = [...question.subQuestions];
        updatedSubQuestions[subIdx] = {
          ...updatedSubQuestions[subIdx],
          hasImage: false,
          imageUrl: null
        };
        onUpdate({ ...question, subQuestions: updatedSubQuestions });
      }
    } else if (type === 'orQuestion') {
      onUpdate({ 
        ...question, 
        orQuestionImage: null,
        hasOrQuestionImage: false 
      });
    }
  };

  const deleteSubQuestion = (subIdx: number) => {
    const updatedSubQuestions = question.subQuestions.filter((_: any, idx: number) => idx !== subIdx);
    // Clean up custom labels
    const newCustomLabels = { ...customLabels };
    delete newCustomLabels[subIdx];
    setCustomLabels(newCustomLabels);
    onUpdate({ ...question, subQuestions: updatedSubQuestions });
  };

  const getSubQuestionLabel = (index: number) => {
    if (isCustomNumbering) {
      return customLabels[index] || `${index + 1}.`;
    }
    
    switch (subQuestionNumbering) {
      case '123': return `${index + 1}.`;
      case 'abc': return `${String.fromCharCode(97 + index)}.`;
      case 'roman': return `${['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'][index] || (index + 1)}.`;
      default: return `${index + 1}.`;
    }
  };

  const handleNumberingChange = (value: string) => {
    if (value === 'custom') {
      setIsCustomNumbering(true);
      setSubQuestionNumbering('custom');
    } else {
      setIsCustomNumbering(false);
      setSubQuestionNumbering(value);
      setCustomLabels({}); // Clear custom labels when switching away from custom
    }
  };

  const updateCustomLabel = (index: number, label: string) => {
    setCustomLabels(prev => ({
      ...prev,
      [index]: label
    }));
  };
  
  return (
    <Card className={`border border-gray-300 bg-white transition-all duration-200 ${isDragging ? 'shadow-xl scale-105 rotate-2' : 'shadow-sm hover:shadow-md'} ${isDragOverlay ? 'shadow-2xl' : ''}`}>
      <CardContent className="p-4">
        {/* Main Question */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            {dragHandleProps && (
              <button
                {...dragHandleProps}
                className="p-1 hover:bg-gray-100 rounded cursor-grab active:cursor-grabbing mt-1"
                aria-label="Drag to reorder question"
              >
                <GripVertical className="h-4 w-4 text-gray-400" />
              </button>
            )}
            <span className="font-bold text-lg min-w-[30px] mt-1">{questionNumber})</span>
            <div className="flex-1">
              <Textarea
                value={question.text}
                onChange={(e) => onUpdate({ ...question, text: e.target.value })}
                className="min-h-[60px] resize-none font-medium"
                placeholder="Enter question text..."
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="text-center">
                <label className="text-xs text-muted-foreground">Marks</label>
                <Input
                  type="number"
                  value={question.marks}
                  onChange={(e) => onUpdate({ ...question, marks: parseInt(e.target.value) || 0 })}
                  className="w-14 h-8 text-center font-bold"
                  min="1"
                />
              </div>
              <div className="text-sm font-bold border px-2 py-1 rounded">
                [{question.marks}]
              </div>
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDelete}
                  className="text-red-500 hover:text-red-700 hover:bg-red-100"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          {/* Main Question Image Upload */}
          <div className="ml-8">
            {(imagePreviews[`main-${question.id}`] || question.imageUrl) ? (
              <div className="relative bg-gray-50 p-2 rounded border">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-blue-700 flex items-center gap-1">
                    <Image className="h-3 w-3" />
                    Question Image
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeImage(`main-${question.id}`, 'main')}
                    className="h-5 w-5 p-0 text-red-500 hover:bg-red-100 rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <img 
                  src={imagePreviews[`main-${question.id}`] || question.imageUrl} 
                  alt="Question image" 
                  className="max-w-full h-auto max-h-32 rounded border object-contain"
                />
              </div>
            ) : (
              <div className="bg-blue-50 border border-dashed border-blue-300 rounded p-2">
                <div className="text-center">
                  <Upload className="h-3 w-3 text-blue-500 mx-auto mb-1" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(`main-${question.id}`, file, 'main');
                    }}
                    className="hidden"
                    id={`main-image-upload-${question.id}`}
                  />
                  <label 
                    htmlFor={`main-image-upload-${question.id}`}
                    className="inline-flex items-center px-2 py-1 bg-blue-600 text-white text-xs rounded cursor-pointer hover:bg-blue-700"
                  >
                    <Image className="h-3 w-3 mr-1" />
                    Add Image
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
          
        {/* Sub-questions */}
        {question.subQuestions && question.subQuestions.length > 0 && (
          <div className="ml-8 mt-4 space-y-3 border-l-2 border-gray-300 pl-4">
            {/* Sub-question Numbering Control */}
            <div className="flex items-center gap-3 p-2 bg-blue-50 rounded border border-blue-200">
              <span className="text-sm font-medium text-blue-700">Sub-question style:</span>
              <Select value={subQuestionNumbering} onValueChange={handleNumberingChange}>
                <SelectTrigger className="w-32 h-7 text-xs bg-white border-blue-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-300 shadow-lg z-50">
                  <SelectItem value="123" className="hover:bg-blue-50 cursor-pointer">1, 2, 3...</SelectItem>
                  <SelectItem value="abc" className="hover:bg-blue-50 cursor-pointer">a, b, c...</SelectItem>
                  <SelectItem value="roman" className="hover:bg-blue-50 cursor-pointer">i, ii, iii...</SelectItem>
                  <SelectItem value="custom" className="hover:bg-blue-50 cursor-pointer">Custom...</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {question.subQuestions.map((subQ: any, subIdx: number) => (
              <div key={subQ.id} className="p-2 bg-gray-50 rounded border">
                <div className="flex items-start gap-2">
                  {isCustomNumbering ? (
                    <Input
                      value={customLabels[subIdx] || `${subIdx + 1}.`}
                      onChange={(e) => updateCustomLabel(subIdx, e.target.value)}
                      className="min-w-[50px] max-w-[80px] h-6 text-xs font-medium text-center"
                      placeholder="Label"
                    />
                  ) : (
                    <span className="font-medium min-w-[20px] mt-1">{getSubQuestionLabel(subIdx)}</span>
                  )}
                  <Textarea
                    value={subQ.text}
                    onChange={(e) => {
                      const updatedSubQuestions = [...(question.subQuestions || [])];
                      updatedSubQuestions[subIdx] = { ...subQ, text: e.target.value };
                      onUpdate({ ...question, subQuestions: updatedSubQuestions });
                    }}
                    className="flex-1 min-h-[30px] text-sm resize-none"
                    placeholder="Enter sub-question..."
                  />
                  <Input
                    type="number"
                    value={subQ.marks}
                    onChange={(e) => {
                      const updatedSubQuestions = [...(question.subQuestions || [])];
                      updatedSubQuestions[subIdx] = { ...subQ, marks: parseInt(e.target.value) || 0 };
                      onUpdate({ ...question, subQuestions: updatedSubQuestions });
                    }}
                    className="w-12 h-6 text-xs text-center"
                    min="1"
                  />
                  <div className="text-xs font-medium">
                    [{subQ.marks}]
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteSubQuestion(subIdx)}
                    className="h-6 w-6 p-0 text-red-500 hover:bg-red-100"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                
                {/* Sub-question Image */}
                <div className="ml-6 mt-2">
                  {(imagePreviews[subQ.id] || subQ.imageUrl) ? (
                    <div className="relative bg-white p-1 rounded border">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-purple-700 flex items-center gap-1">
                          <Image className="h-2 w-2" />
                          Image
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeImage(subQ.id, 'subQuestion')}
                          className="h-4 w-4 p-0 text-red-500 hover:bg-red-100 rounded-full"
                        >
                          <X className="h-2 w-2" />
                        </Button>
                      </div>
                      <img 
                        src={imagePreviews[subQ.id] || subQ.imageUrl} 
                        alt="Sub-question image" 
                        className="max-w-full h-auto max-h-20 rounded border object-contain"
                      />
                    </div>
                  ) : (
                    <div className="bg-purple-50 border border-dashed border-purple-300 rounded p-1">
                      <div className="text-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(subQ.id, file, 'subQuestion');
                          }}
                          className="hidden"
                          id={`sub-image-upload-${subQ.id}`}
                        />
                        <label 
                          htmlFor={`sub-image-upload-${subQ.id}`}
                          className="inline-flex items-center px-1 py-0.5 bg-purple-600 text-white text-xs rounded cursor-pointer hover:bg-purple-700"
                        >
                          <Image className="h-2 w-2 mr-1" />
                          +Image
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* OR Option */}
        {question.hasOROption && (
          <div className="ml-8 mt-4 p-3 bg-orange-50 rounded border border-orange-300">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-center bg-orange-200 px-2 py-1 rounded text-sm">OR</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onUpdate({ ...question, hasOROption: false, orQuestion: '', orQuestionImage: null, hasOrQuestionImage: false })}
                className="h-6 w-6 p-0 text-red-500 hover:bg-red-100"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
            <Textarea
              value={question.orQuestion || ''}
              onChange={(e) => onUpdate({ ...question, orQuestion: e.target.value })}
              className="w-full min-h-[40px] resize-none bg-white"
              placeholder="Enter alternative question..."
            />
            
            {/* OR Question Image */}
            <div className="mt-2">
              {(imagePreviews[`or-${question.id}`] || question.orQuestionImage) ? (
                <div className="relative bg-white p-2 rounded border">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-orange-700 flex items-center gap-1">
                      <Image className="h-3 w-3" />
                      OR Image
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeImage(`or-${question.id}`, 'orQuestion')}
                      className="h-5 w-5 p-0 text-red-500 hover:bg-red-100 rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <img 
                    src={imagePreviews[`or-${question.id}`] || question.orQuestionImage} 
                    alt="OR question image" 
                    className="max-w-full h-auto max-h-24 rounded border object-contain"
                  />
                </div>
              ) : (
                <div className="bg-orange-50 border border-dashed border-orange-300 rounded p-2">
                  <div className="text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(`or-${question.id}`, file, 'orQuestion');
                      }}
                      className="hidden"
                      id={`or-image-upload-${question.id}`}
                    />
                    <label 
                      htmlFor={`or-image-upload-${question.id}`}
                      className="inline-flex items-center px-2 py-1 bg-orange-600 text-white text-xs rounded cursor-pointer hover:bg-orange-700"
                    >
                      <Image className="h-3 w-3 mr-1" />
                      Add Image
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Controls */}
        <div className="flex gap-2 mt-3 pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newSubQuestion = {
                id: Date.now(),
                text: 'New sub-question',
                marks: 1,
                hasImage: false,
                imageUrl: null
              };
              onUpdate({
                ...question,
                subQuestions: [...(question.subQuestions || []), newSubQuestion]
              });
            }}
            className="text-blue-600 border-blue-300 hover:bg-blue-50"
          >
            <Plus className="h-3 w-3 mr-1" />
            Sub-Q
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUpdate({ ...question, hasOROption: !question.hasOROption })}
            className="text-orange-600 border-orange-300 hover:bg-orange-50"
          >
            {question.hasOROption ? 'Remove OR' : 'Add OR'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-red-500 hover:bg-red-100"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Question Card Component
const QuestionCard = ({ question, questionNumber, onUpdate, onDelete }: any) => {
  const [subQuestionNumbering, setSubQuestionNumbering] = useState('123');
  const [imageFiles, setImageFiles] = useState<{[key: string]: File}>({});
  const [imagePreviews, setImagePreviews] = useState<{[key: string]: string}>({});
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const addSubQuestion = () => {
    const newSubQuestion = {
      id: Date.now(),
      text: 'New sub-question',
      marks: 2,
      hasImage: false,
      imageUrl: null
    };
    onUpdate({
      ...question,
      subQuestions: [...(question.subQuestions || []), newSubQuestion]
    });
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const updatedSubQuestions = [...(question.subQuestions || [])];
    const draggedItem = updatedSubQuestions[draggedIndex];
    
    // Remove dragged item
    updatedSubQuestions.splice(draggedIndex, 1);
    
    // Insert at new position
    const insertIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex;
    updatedSubQuestions.splice(insertIndex, 0, draggedItem);
    
    onUpdate({
      ...question,
      subQuestions: updatedSubQuestions
    });
    
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleImageUpload = (subIdx: number, file: File) => {
    const subQuestionId = question.subQuestions[subIdx].id;
    setImageFiles(prev => ({ ...prev, [subQuestionId]: file }));
    
    const reader = new FileReader();
    reader.onload = () => {
      const imageUrl = reader.result as string;
      setImagePreviews(prev => ({ ...prev, [subQuestionId]: imageUrl }));
      
      // Update sub-question with image data
      updateSubQuestion(subIdx, {
        ...question.subQuestions[subIdx],
        hasImage: true,
        imageUrl: imageUrl
      });
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (subIdx: number) => {
    const subQuestionId = question.subQuestions[subIdx].id;
    setImageFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[subQuestionId];
      return newFiles;
    });
    setImagePreviews(prev => {
      const newPreviews = { ...prev };
      delete newPreviews[subQuestionId];
      return newPreviews;
    });
    
    updateSubQuestion(subIdx, {
      ...question.subQuestions[subIdx],
      hasImage: false,
      imageUrl: null
    });
  };

  const updateSubQuestion = (subIdx: number, updatedSub: any) => {
    const updatedSubQuestions = [...(question.subQuestions || [])];
    updatedSubQuestions[subIdx] = updatedSub;
    onUpdate({
      ...question,
      subQuestions: updatedSubQuestions
    });
  };

  const deleteSubQuestion = (subIdx: number) => {
    const updatedSubQuestions = (question.subQuestions || []).filter((_: any, idx: number) => idx !== subIdx);
    onUpdate({
      ...question,
      subQuestions: updatedSubQuestions
    });
  };

  const getSubQuestionLabel = (index: number) => {
    switch (subQuestionNumbering) {
      case '123': return `${index + 1}.`;
      case 'abc': return `${String.fromCharCode(97 + index)}.`;
      case 'roman': return `${['i', 'ii', 'iii', 'iv', 'v', 'vi'][index] || (index + 1)}.`;
      default: return `${index + 1}.`;
    }
  };

  return (
    <Card className="border border-gray-200 bg-white">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-start gap-4">
          <div className="flex items-center gap-2 mt-1">
            <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
            <span className="text-sm font-semibold text-gray-600 min-w-[24px]">Q{questionNumber}</span>
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex gap-4">
              <Textarea
                value={question.text}
                onChange={(e) => onUpdate({ ...question, text: e.target.value })}
                className="flex-1 min-h-[60px] resize-none"
                placeholder="Enter question text..."
              />
              <div className="space-y-2">
                <label className="text-xs text-gray-500">Marks</label>
                <Input
                  type="number"
                  value={question.marks}
                  onChange={(e) => onUpdate({ ...question, marks: parseInt(e.target.value) || 0 })}
                  className="w-20 h-8 text-center"
                  min="1"
                />
              </div>
            </div>
            
            {/* Sub-questions */}
            {question.subQuestions && question.subQuestions.length > 0 && (
              <div className="ml-6 space-y-3 border-l-2 border-gray-200 pl-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">Sub-questions:</span>
                  <Select value={subQuestionNumbering} onValueChange={setSubQuestionNumbering}>
                    <SelectTrigger className="w-24 h-6 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="123">1, 2, 3...</SelectItem>
                      <SelectItem value="abc">a, b, c...</SelectItem>
                      <SelectItem value="roman">i, ii, iii...</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {question.subQuestions.map((subQ: any, subIdx: number) => (
                  <div 
                    key={subQ.id} 
                    className={`space-y-3 p-4 bg-gradient-to-r from-blue-50/30 to-purple-50/30 rounded-lg border border-blue-100 transition-all duration-200 ${
                      draggedIndex === subIdx ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
                    } hover:shadow-sm cursor-move`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, subIdx)}
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDrop={(e) => handleDrop(e, subIdx)}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="flex items-start gap-2">
                      <div className="flex items-center gap-2 mt-2">
                        <GripVertical className="h-4 w-4 text-gray-400 cursor-grab active:cursor-grabbing" />
                        <span className="text-sm font-medium text-gray-500 min-w-[20px]">
                          {getSubQuestionLabel(subIdx)}
                        </span>
                      </div>
                      <Textarea
                        value={subQ.text}
                        onChange={(e) => updateSubQuestion(subIdx, { ...subQ, text: e.target.value })}
                        className="flex-1 min-h-[40px] text-sm resize-none"
                        placeholder="Enter sub-question..."
                      />
                      <div className="flex flex-col items-center">
                        <label className="text-xs text-muted-foreground mb-1">Marks</label>
                        <Input
                          type="number"
                          value={subQ.marks}
                          onChange={(e) => updateSubQuestion(subIdx, { ...subQ, marks: parseInt(e.target.value) || 0 })}
                          className="w-16 h-8 text-xs text-center"
                          min="1"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteSubQuestion(subIdx)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-100"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    {/* Image Upload Section */}
                    <div className="ml-6 space-y-3">
                      {(imagePreviews[subQ.id] || subQ.imageUrl) ? (
                        <div className="relative bg-white p-3 rounded-lg border border-purple-200 shadow-sm">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-purple-700 flex items-center gap-1">
                              <Image className="h-3 w-3" />
                              Question Image
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeImage(subIdx)}
                              className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                          <img 
                            src={imagePreviews[subQ.id] || subQ.imageUrl} 
                            alt="Sub-question image" 
                            className="max-w-full h-auto max-h-48 rounded-md border border-gray-200 shadow-sm object-contain"
                          />
                        </div>
                      ) : (
                        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-dashed border-purple-300 rounded-lg p-2">
                          <div className="text-center">
                            <Upload className="h-4 w-4 text-purple-500 mx-auto mb-1" />
                            <p className="text-xs text-purple-600 mb-1 font-medium">Add image</p>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageUpload(subIdx, file);
                              }}
                              className="hidden"
                              id={`image-upload-${subQ.id}`}
                            />
                            <label 
                              htmlFor={`image-upload-${subQ.id}`}
                              className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs rounded-md hover:from-purple-600 hover:to-blue-600 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md"
                            >
                              <Image className="h-3 w-3 mr-1" />
                              Choose Image
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={addSubQuestion}
                className="text-blue-600 border-blue-300 hover:bg-blue-50"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Sub-question
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
                className="text-red-500 hover:text-red-700 hover:bg-red-100"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Draggable Question Card Component
const DraggableQuestionCard = ({ 
  item, 
  index, 
  onSelect, 
  onPreview, 
  onEdit, 
  onDelete, 
  getTypeColor, 
  getBadgeColor 
}: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card 
      ref={setNodeRef} 
      style={style}
      className={`border border-border/50 ${item.isSelected ? 'ring-2 ring-green-500 bg-green-50/50' : 'bg-white'} ${isDragging ? 'shadow-lg scale-105' : ''} transition-all duration-200`}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex items-center gap-2">
            <Checkbox 
              checked={item.isSelected}
              onCheckedChange={onSelect}
              className="mt-1"
            />
            <button
              {...attributes}
              {...listeners}
              className="p-1 hover:bg-gray-100 rounded cursor-grab active:cursor-grabbing"
              aria-label="Drag to reorder"
            >
              <GripVertical className="h-4 w-4 text-gray-400" />
            </button>
          </div>
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
                <Button variant="ghost" size="sm" onClick={onPreview}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={onEdit}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={onDelete}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Drag Overlay Content Component
const DragOverlayContent = ({ item, getTypeColor, getBadgeColor }: any) => {
  if (!item) return null;

  return (
    <Card className="border border-border/50 bg-white shadow-xl rotate-3 scale-105">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <GripVertical className="h-4 w-4 text-gray-400 mt-1" />
          <div className="flex-1 space-y-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge className={getTypeColor(item.itemType)}>{item.itemType}</Badge>
                <Badge className={getBadgeColor(item.bloomsLevel)}>{item.bloomsLevel}</Badge>
                <Badge variant="outline">{item.marks} marks</Badge>
              </div>
              <p className="text-foreground font-medium">{item.question}</p>
              <p className="text-sm text-muted-foreground">ELO: {item.eloTitle}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssessmentItemGeneration;