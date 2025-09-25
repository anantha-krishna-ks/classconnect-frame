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

  const generateItems = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
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
        `Evaluate the significance of ${eloTitle.toLowerCase()} in modern applications.`,
        `Discuss the theoretical framework underlying ${eloTitle.toLowerCase()}.`
      ],
      'Short Answer': [
        `Define ${eloTitle.toLowerCase()} and explain its importance.`,
        `List the main components of ${eloTitle.toLowerCase()}.`,
        `Briefly describe the process involved in ${eloTitle.toLowerCase()}.`
      ]
    };
    
    const typeQuestions = questions[type as keyof typeof questions] || questions['Short Answer'];
    return typeQuestions[Math.floor(Math.random() * typeQuestions.length)];
  };

  const generateMockOptions = () => {
    const options = [
      'Option A - First possible answer',
      'Option B - Second possible answer', 
      'Option C - Third possible answer',
      'Option D - Fourth possible answer'
    ];
    return options;
  };

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
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
    toast.success('Item updated successfully');
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const saveItemWithImage = () => {
    if (editingItem && imageFile) {
      const updatedItem = {
        ...editingItem,
        hasImage: true,
        imageUrl: imagePreview || undefined
      };
      updateItem(updatedItem);
      removeImage();
    }
  };

  const getSelectedItems = () => {
    return generatedItems.filter(item => selectedItems.includes(item.id));
  };

  const calculateBloomsTaxonomyDistribution = () => {
    const selectedItemsData = getSelectedItems();
    const distribution: { [key: string]: number } = {};
    
    selectedItemsData.forEach(item => {
      distribution[item.bloomsLevel] = (distribution[item.bloomsLevel] || 0) + 1;
    });
    
    return distribution;
  };

  const getBadgeColor = (type: string) => {
    const colors = {
      'Multiple Choice': 'bg-blue-100 text-blue-700',
      'Long Answer': 'bg-green-100 text-green-700',
      'Short Answer': 'bg-purple-100 text-purple-700',
      'Remember': 'bg-red-100 text-red-700',
      'Understand': 'bg-orange-100 text-orange-700',
      'Apply': 'bg-yellow-100 text-yellow-700',
      'Analyze': 'bg-green-100 text-green-700',
      'Evaluate': 'bg-blue-100 text-blue-700',
      'Create': 'bg-purple-100 text-purple-700'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const itemTypes = [...new Set(generatedItems.map(item => item.itemType))];
  const selectedItemsData = getSelectedItems();
  const totalSelectedMarks = selectedItemsData.reduce((sum, item) => sum + item.marks, 0);
  const bloomsDistribution = calculateBloomsTaxonomyDistribution();

  if (showAssessmentBuilder) {
    return (
      <AssessmentBuilder
        selectedItems={selectedItemsData}
        onBack={() => setShowAssessmentBuilder(false)}
      />
    );
  }

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
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">{generatedItems.length}</p>
                <p className="text-sm text-muted-foreground">Items Generated</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">{selectedItems.length}</p>
                <p className="text-sm text-muted-foreground">Items Selected</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Card className="border border-border/50 bg-white">
        <CardHeader className="border-b border-border/50 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Assessment Item Management</CardTitle>
            <div className="flex items-center gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {itemTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button size="sm" variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="p-6 pb-0">
              <TabsList className="w-full bg-card shadow-sm border border-border/50 p-2 rounded-xl h-14 gap-1">
                <TabsTrigger 
                  value="all" 
                  className="flex-1 h-10 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:scale-105 transition-all duration-200 rounded-lg"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  All Items ({generatedItems.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="selected" 
                  className="flex-1 h-10 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:scale-105 transition-all duration-200 rounded-lg"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Selected ({selectedItems.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="historical" 
                  className="flex-1 h-10 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:scale-105 transition-all duration-200 rounded-lg"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Historical ({historicalQuestions.length})
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="p-6 pt-4 space-y-4">
              <div className="grid gap-4">
                {generatedItems
                  .filter(item => filterType === 'all' || item.itemType === filterType)
                  .map((item) => (
                    <Card key={item.id} className={`border transition-all duration-200 hover:shadow-md ${
                      selectedItems.includes(item.id) ? 'ring-2 ring-green-500 bg-green-50/50' : 'hover:border-primary/50'
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <Checkbox
                            checked={selectedItems.includes(item.id)}
                            onCheckedChange={() => toggleItemSelection(item.id)}
                            className="mt-1"
                          />
                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between">
                              <p className="font-medium leading-6">{item.question}</p>
                              <div className="flex items-center gap-2 ml-4">
                                <span className="font-bold text-primary">{item.marks} marks</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge className={getBadgeColor(item.itemType)}>{item.itemType}</Badge>
                              <Badge className={getBadgeColor(item.bloomsLevel)}>{item.bloomsLevel}</Badge>
                              <Badge variant="outline">{item.difficulty}</Badge>
                              <Badge variant="outline" className="text-xs">{item.eloTitle}</Badge>
                            </div>
                            {item.options && (
                              <div className="mt-3 grid grid-cols-2 gap-2">
                                {item.options.map((option, index) => (
                                  <div key={index} className="text-sm bg-gray-50 p-2 rounded border">
                                    {option}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col gap-1">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="ghost" onClick={() => setPreviewItem(item)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Question Preview</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-medium mb-2">Question:</h4>
                                    <p className="text-sm">{item.question}</p>
                                  </div>
                                  {item.options && (
                                    <div>
                                      <h4 className="font-medium mb-2">Options:</h4>
                                      <div className="space-y-2">
                                        {item.options.map((option, index) => (
                                          <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                                            {String.fromCharCode(65 + index)}. {option}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  <div className="flex gap-4 text-sm">
                                    <span><strong>Type:</strong> {item.itemType}</span>
                                    <span><strong>Bloom's Level:</strong> {item.bloomsLevel}</span>
                                    <span><strong>Marks:</strong> {item.marks}</span>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="ghost" onClick={() => setEditingItem(item)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Edit Question</DialogTitle>
                                </DialogHeader>
                                {editingItem && (
                                  <div className="space-y-4">
                                    <div>
                                      <label className="text-sm font-medium">Question:</label>
                                      <Textarea
                                        value={editingItem.question}
                                        onChange={(e) => setEditingItem(prev => prev ? {...prev, question: e.target.value} : null)}
                                        className="mt-1"
                                      />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <label className="text-sm font-medium">Marks:</label>
                                        <Input
                                          type="number"
                                          value={editingItem.marks}
                                          onChange={(e) => setEditingItem(prev => prev ? {...prev, marks: parseInt(e.target.value)} : null)}
                                          className="mt-1"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium">Difficulty:</label>
                                        <Select
                                          value={editingItem.difficulty}
                                          onValueChange={(value) => setEditingItem(prev => prev ? {...prev, difficulty: value} : null)}
                                        >
                                          <SelectTrigger className="mt-1">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="Easy">Easy</SelectItem>
                                            <SelectItem value="Medium">Medium</SelectItem>
                                            <SelectItem value="Hard">Hard</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                    
                                    {/* Image Upload Section */}
                                    <div>
                                      <label className="text-sm font-medium">Add Image (Optional):</label>
                                      <div className="mt-2 space-y-3">
                                        <div className="flex items-center gap-2">
                                          <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => document.getElementById('image-upload')?.click()}
                                          >
                                            <Upload className="h-4 w-4 mr-2" />
                                            Choose Image
                                          </Button>
                                          <input
                                            id="image-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                          />
                                          {imageFile && (
                                            <Button
                                              type="button"
                                              variant="outline"
                                              size="sm"
                                              onClick={removeImage}
                                            >
                                              <X className="h-4 w-4 mr-2" />
                                              Remove
                                            </Button>
                                          )}
                                        </div>
                                        {imagePreview && (
                                          <div className="border rounded-lg p-3">
                                            <img
                                              src={imagePreview}
                                              alt="Preview"
                                              className="max-w-full h-40 object-contain mx-auto"
                                            />
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    <div className="flex justify-end gap-2">
                                      <Button variant="outline" onClick={() => setEditingItem(null)}>
                                        Cancel
                                      </Button>
                                      <Button onClick={() => updateItem(editingItem)}>
                                        Save Changes
                                      </Button>
                                      {imageFile && (
                                        <Button onClick={saveItemWithImage} className="bg-green-600 hover:bg-green-700">
                                          <Image className="h-4 w-4 mr-2" />
                                          Save with Image
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            <Button size="sm" variant="ghost" onClick={() => deleteItem(item.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="selected" className="p-6 pt-4">
              {selectedItemsData.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
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
                                <div className="flex items-start justify-between">
                                  <div className="space-y-2">
                                    <p className="font-medium">{item.question}</p>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <Badge className={getBadgeColor(item.bloomsLevel)}>{item.bloomsLevel}</Badge>
                                      <Badge variant="outline">{item.difficulty}</Badge>
                                      <Badge variant="outline" className="text-xs">{item.eloTitle}</Badge>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <span className="font-bold text-primary">{item.marks} marks</span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="historical" className="p-6 pt-4">
              <div className="space-y-4">
                {historicalQuestions.map((item) => (
                  <Card key={item.id} className="border hover:border-primary/50 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <Checkbox
                          checked={selectedItems.includes(item.id)}
                          onCheckedChange={() => toggleItemSelection(item.id)}
                        />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <p className="font-medium">{item.question}</p>
                            <span className="font-bold text-primary">{item.marks} marks</span>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge className={getBadgeColor(item.itemType)}>{item.itemType}</Badge>
                            <Badge className={getBadgeColor(item.bloomsLevel)}>{item.bloomsLevel}</Badge>
                            <Badge variant="outline">{item.difficulty}</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Selection Summary & Actions */}
          <div className="p-6 border-t border-border/50 bg-gray-50/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Selection Summary</h3>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">{totalSelectedMarks} Marks</p>
                <p className="text-sm text-muted-foreground">{selectedItems.length} Questions Selected</p>
              </div>
            </div>

            {/* Bloom's Taxonomy Distribution */}
            <div className="mb-6">
              <h4 className="text-md font-medium mb-3">Bloom's Taxonomy Distribution</h4>
              <div className="space-y-2">
                {Object.entries(bloomsDistribution).map(([level, count]) => (
                  <div key={level} className="flex items-center justify-between">
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssessmentItemGeneration;