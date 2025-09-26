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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [showAssessmentBuilder, setShowAssessmentBuilder] = useState(false);
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
    examDate: ''
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
                  toast.success('Assessment builder opened!');
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
            
            {/* Assessment Header Configuration */}
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
                      value={builderData.assessmentTitle || ''}
                      onChange={(e) => setBuilderData(prev => ({ ...prev, assessmentTitle: e.target.value }))}
                      className="font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Subject</label>
                    <Input 
                      placeholder="e.g., Mathematics / Science"
                      value={builderData.subject || ''}
                      onChange={(e) => setBuilderData(prev => ({ ...prev, subject: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Class/Grade</label>
                    <Input 
                      placeholder="e.g., Class X / Grade 10"
                      value={builderData.classGrade || ''}
                      onChange={(e) => setBuilderData(prev => ({ ...prev, classGrade: e.target.value }))}
                    />
                  </div>
                </div>
                
                {/* Time & Marks */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-white rounded-lg border">
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
                    <label className="text-sm font-semibold text-green-700">Time (Hours)</label>
                    <Input 
                      type="number"
                      step="0.5"
                      placeholder="3"
                      value={builderData.timeHours || ''}
                      onChange={(e) => setBuilderData(prev => ({ ...prev, timeHours: e.target.value }))}
                      className="h-12 text-lg font-bold text-center text-green-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-purple-700">Date</label>
                    <Input 
                      type="date"
                      value={builderData.examDate || ''}
                      onChange={(e) => setBuilderData(prev => ({ ...prev, examDate: e.target.value }))}
                      className="h-12"
                    />
                  </div>
                  <div className="flex flex-col justify-end gap-2">
                    <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white h-12">
                      <Save className="h-4 w-4 mr-2" />
                      Save Paper
                    </Button>
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
            <Card className="border-2 border-gray-400 bg-white">
              <CardHeader className="text-center border-b border-gray-300 bg-gray-50">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold uppercase tracking-wide">{builderData.assessmentTitle || 'ASSESSMENT PAPER'}</h2>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold">Subject: {builderData.subject || '________'}</span>
                    <span className="font-semibold">Class: {builderData.classGrade || '________'}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Time: {builderData.timeHours || '__'} Hours</span>
                    <span>Maximum Marks: {builderData.totalMarks || '__'}</span>
                    <span>Date: {builderData.examDate || '__________'}</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6 space-y-6">
                {/* Instructions Box */}
                <div className="border border-gray-300 p-4 bg-gray-50/50">
                  <h4 className="font-bold mb-2">GENERAL INSTRUCTIONS:</h4>
                  <div className="text-sm whitespace-pre-line">
                    {builderData.generalInstructions || 'No instructions added yet.'}
                  </div>
                </div>

                {/* Sections */}
                <div className="space-y-8">
                  {builderData.sections.map((section: any, sectionIdx: number) => (
                    <div key={section.id} className="space-y-4">
                      {/* Section Header */}
                      <div className="flex items-center justify-between border-b-2 border-gray-400 pb-2">
                        <div className="space-y-1">
                          <h3 className="text-xl font-bold uppercase tracking-wider">
                            {section.title}
                          </h3>
                          <p className="text-sm font-medium">
                            ({section.instruction || 'Answer all questions'})
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            [{section.questionsCount || section.questions.length} × {section.marksPerQuestion || 'varies'} = {section.totalMarks || section.questions.reduce((sum: number, q: any) => sum + (q.marks || 0), 0)}]
                          </div>
                        </div>
                      </div>

                      {/* Section Controls */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="space-y-1">
                          <label className="text-xs font-medium">Section Instruction</label>
                          <Input 
                            placeholder="Answer all questions"
                            value={section.instruction || ''}
                            onChange={(e) => {
                              const updatedSections = [...builderData.sections];
                              updatedSections[sectionIdx].instruction = e.target.value;
                              setBuilderData(prev => ({ ...prev, sections: updatedSections }));
                            }}
                            className="h-8 text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium">Questions Count</label>
                          <Input 
                            type="number"
                            placeholder="Auto"
                            value={section.questionsCount || ''}
                            onChange={(e) => {
                              const updatedSections = [...builderData.sections];
                              updatedSections[sectionIdx].questionsCount = e.target.value;
                              setBuilderData(prev => ({ ...prev, sections: updatedSections }));
                            }}
                            className="h-8 text-sm text-center"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium">Marks/Question</label>
                          <Input 
                            placeholder="varies"
                            value={section.marksPerQuestion || ''}
                            onChange={(e) => {
                              const updatedSections = [...builderData.sections];
                              updatedSections[sectionIdx].marksPerQuestion = e.target.value;
                              setBuilderData(prev => ({ ...prev, sections: updatedSections }));
                            }}
                            className="h-8 text-sm text-center"
                          />
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            const updatedSections = builderData.sections.filter((_, idx) => idx !== sectionIdx);
                            setBuilderData(prev => ({ ...prev, sections: updatedSections }));
                          }}
                          className="text-red-500 hover:text-red-700 hover:bg-red-100 h-8"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Questions */}
                      <div className="space-y-4 pl-4">
                        {section.questions.map((question: any, questionIdx: number) => (
                          <ExamQuestionCard
                            key={question.id}
                            question={question}
                            questionNumber={builderData.numberingStyle === 'continuous' 
                              ? builderData.sections.slice(0, sectionIdx).reduce((sum, s) => sum + s.questions.length, 0) + questionIdx + 1
                              : questionIdx + 1
                            }
                            onUpdate={(updatedQuestion) => {
                              const updatedSections = [...builderData.sections];
                              updatedSections[sectionIdx].questions[questionIdx] = updatedQuestion;
                              setBuilderData(prev => ({ ...prev, sections: updatedSections }));
                            }}
                            onDelete={() => {
                              const updatedSections = [...builderData.sections];
                              updatedSections[sectionIdx].questions = updatedSections[sectionIdx].questions.filter((_: any, idx: number) => idx !== questionIdx);
                              setBuilderData(prev => ({ ...prev, sections: updatedSections }));
                            }}
                          />
                        ))}
                        
                        <Button 
                          variant="outline" 
                          className="w-full border-dashed border-blue-300 text-blue-600 hover:bg-blue-50"
                          onClick={() => {
                            const availableItems = selectedItemsData.filter(item => 
                              !builderData.sections.some(s => 
                                s.questions.some((q: any) => q.text === item.question)
                              )
                            );
                            if (availableItems.length > 0) {
                              const newQuestion = {
                                id: Date.now(),
                                text: availableItems[0].question,
                                marks: availableItems[0].marks,
                                subQuestions: [],
                                hasOROption: false,
                                orQuestion: ''
                              };
                              const updatedSections = [...builderData.sections];
                              updatedSections[sectionIdx].questions.push(newQuestion);
                              setBuilderData(prev => ({ ...prev, sections: updatedSections }));
                            }
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Question
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Add Section Button */}
                  <div className="text-center pt-4 border-t border-gray-300">
                    <Button 
                      onClick={() => {
                        const newSection = {
                          id: Date.now(),
                          title: `SECTION - ${String.fromCharCode(65 + builderData.sections.length)}`,
                          instruction: 'Answer all questions',
                          questions: [],
                          questionsCount: '',
                          marksPerQuestion: '',
                          totalMarks: ''
                        };
                        setBuilderData(prev => ({ 
                          ...prev, 
                          sections: [...prev.sections, newSection] 
                        }));
                      }}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Section
                    </Button>
                  </div>
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
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Exam Question Card Component for Assessment Preview
const ExamQuestionCard = ({ question, questionNumber, onUpdate, onDelete }: any) => {
  const [imageFiles, setImageFiles] = useState<{[key: string]: File}>({});
  const [imagePreviews, setImagePreviews] = useState<{[key: string]: string}>({});

  const handleImageUpload = (id: string, file: File, type: 'subQuestion' | 'orQuestion') => {
    setImageFiles(prev => ({ ...prev, [id]: file }));
    
    const reader = new FileReader();
    reader.onload = () => {
      const imageUrl = reader.result as string;
      setImagePreviews(prev => ({ ...prev, [id]: imageUrl }));
      
      if (type === 'subQuestion') {
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

  const removeImage = (id: string, type: 'subQuestion' | 'orQuestion') => {
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
    
    if (type === 'subQuestion') {
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
    onUpdate({ ...question, subQuestions: updatedSubQuestions });
  };
  
  return (
    <div className="space-y-3 border-l-4 border-gray-400 pl-4">
      <div className="flex items-start gap-4">
        <span className="font-bold text-lg min-w-[40px] mt-1">{questionNumber})</span>
        <div className="flex-1 space-y-2">
          <div className="flex gap-4">
            <Textarea
              value={question.text}
              onChange={(e) => onUpdate({ ...question, text: e.target.value })}
              className="flex-1 min-h-[60px] resize-none font-medium border-gray-300"
              placeholder="Enter question text..."
            />
            <div className="flex flex-col gap-2">
              <div className="text-center">
                <label className="text-xs text-gray-600">Marks</label>
                <Input
                  type="number"
                  value={question.marks}
                  onChange={(e) => onUpdate({ ...question, marks: parseInt(e.target.value) || 0 })}
                  className="w-16 h-8 text-center font-bold"
                  min="1"
                />
              </div>
              <div className="text-right">
                <div className="text-sm font-bold border border-gray-400 px-2 py-1 rounded">
                  [{question.marks}]
                </div>
              </div>
            </div>
          </div>
          
          {/* Sub-questions */}
          {question.subQuestions && question.subQuestions.length > 0 && (
            <div className="ml-4 space-y-3 border-l-2 border-gray-300 pl-4">
              {question.subQuestions.map((subQ: any, subIdx: number) => (
                <div key={subQ.id} className="space-y-2 p-3 bg-gray-50 rounded border">
                  <div className="flex items-start gap-2">
                    <span className="font-medium min-w-[20px] mt-2">{['i)', 'ii)', 'iii)', 'iv)', 'v)'][subIdx] || `${subIdx + 1})`}</span>
                    <Textarea
                      value={subQ.text}
                      onChange={(e) => {
                        const updatedSubQuestions = [...(question.subQuestions || [])];
                        updatedSubQuestions[subIdx] = { ...subQ, text: e.target.value };
                        onUpdate({ ...question, subQuestions: updatedSubQuestions });
                      }}
                      className="flex-1 min-h-[40px] text-sm resize-none"
                      placeholder="Enter sub-question..."
                    />
                    <div className="flex flex-col gap-2">
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
                      <div className="text-xs font-medium text-center">
                        [{subQ.marks}]
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteSubQuestion(subIdx)}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-100"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Sub-question Image Upload */}
                  <div className="ml-6">
                    {(imagePreviews[subQ.id] || subQ.imageUrl) ? (
                      <div className="relative bg-white p-2 rounded border border-purple-200">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-purple-700 flex items-center gap-1">
                            <Image className="h-3 w-3" />
                            Image
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeImage(subQ.id, 'subQuestion')}
                            className="h-5 w-5 p-0 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <img 
                          src={imagePreviews[subQ.id] || subQ.imageUrl} 
                          alt="Sub-question image" 
                          className="max-w-full h-auto max-h-32 rounded border shadow-sm object-contain"
                        />
                      </div>
                    ) : (
                      <div className="bg-gray-50 border border-dashed border-gray-300 rounded p-2">
                        <div className="text-center">
                          <Upload className="h-3 w-3 text-gray-400 mx-auto mb-1" />
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
                            className="inline-flex items-center px-2 py-1 bg-gray-600 text-white text-xs rounded cursor-pointer hover:bg-gray-700"
                          >
                            <Image className="h-3 w-3 mr-1" />
                            Add Image
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
            <div className="ml-4 space-y-3 border-l-2 border-orange-300 pl-4 bg-orange-50/50 p-3 rounded">
              <div className="flex items-center justify-between">
                <span className="font-bold text-center bg-orange-200 px-2 py-1 rounded text-sm">OR</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onUpdate({ ...question, hasOROption: false, orQuestion: '', orQuestionImage: null, hasOrQuestionImage: false })}
                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-100"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              <Textarea
                value={question.orQuestion || ''}
                onChange={(e) => onUpdate({ ...question, orQuestion: e.target.value })}
                className="w-full min-h-[60px] resize-none bg-white"
                placeholder="Enter alternative question..."
              />
              
              {/* OR Question Image Upload */}
              <div>
                {(imagePreviews[`or-${question.id}`] || question.orQuestionImage) ? (
                  <div className="relative bg-white p-2 rounded border border-purple-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-purple-700 flex items-center gap-1">
                        <Image className="h-3 w-3" />
                        OR Question Image
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeImage(`or-${question.id}`, 'orQuestion')}
                        className="h-5 w-5 p-0 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <img 
                      src={imagePreviews[`or-${question.id}`] || question.orQuestionImage} 
                      alt="OR question image" 
                      className="max-w-full h-auto max-h-32 rounded border shadow-sm object-contain"
                    />
                  </div>
                ) : (
                  <div className="bg-orange-50 border border-dashed border-orange-300 rounded p-2">
                    <div className="text-center">
                      <Upload className="h-3 w-3 text-orange-400 mx-auto mb-1" />
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
          <div className="flex gap-2 pt-2">
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
              Add Sub-question
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
              className="text-red-500 hover:text-red-700 hover:bg-red-100"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
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

export default AssessmentItemGeneration;