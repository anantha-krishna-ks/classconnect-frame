import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Eye, Edit, Trash2, CheckCircle2, Clock, BookOpen, Target, 
  BarChart3, PieChart, Save, Filter, X, Sparkles, Image, Upload,
  GripVertical, Plus, FileDown, Settings, ChevronDown, ArrowRight,
  Brain, Zap, Users, Award
} from 'lucide-react';
import { toast } from 'sonner';
import { ItemGenerationPanel } from './assessment/ItemGenerationPanel';
import { ItemEditorPanel } from './assessment/ItemEditorPanel';
import { AssessmentBuilderPanel } from './assessment/AssessmentBuilderPanel';
import { ExportFinalizePanel } from './assessment/ExportFinalizePanel';
import { QuickStatsPanel } from './assessment/QuickStatsPanel';

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
  const [activeView, setActiveView] = useState<'generate' | 'edit' | 'build' | 'finalize'>('generate');
  const [editingItem, setEditingItem] = useState<GeneratedItem | null>(null);

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
    toast.success('Item updated successfully');
  };

  const getSelectedItems = () => {
    return generatedItems.filter(item => item.isSelected);
  };

  const selectedItemsData = getSelectedItems();
  const totalSelectedMarks = selectedItemsData.reduce((sum, item) => sum + item.marks, 0);

  // Loading state
  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-6 py-12">
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-16 text-center">
              <div className="space-y-8">
                <div className="relative">
                  <div className="absolute inset-0 animate-ping">
                    <Sparkles className="h-16 w-16 text-indigo-400 mx-auto" />
                  </div>
                  <Sparkles className="h-16 w-16 text-indigo-600 mx-auto animate-pulse" />
                </div>
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Crafting Your Assessment
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-md mx-auto">
                    Our AI is generating personalized questions tailored to your learning objectives
                  </p>
                </div>
                <div className="space-y-4">
                  <Progress value={66} className="w-full max-w-sm mx-auto h-3" />
                  <div className="flex justify-center space-x-8">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Brain className="h-4 w-4 text-indigo-500" />
                      <span>Analyzing ELOs</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Zap className="h-4 w-4 text-purple-500" />
                      <span>Generating Items</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Assessment Workshop
                  </h1>
                  <p className="text-muted-foreground">
                    Generated {generatedItems.length} items • {selectedItemsData.length} selected • {totalSelectedMarks} marks
                  </p>
                </div>
                <QuickStatsPanel 
                  items={generatedItems}
                  selectedItems={selectedItemsData}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <Card className="border-0 shadow-sm bg-white/80">
            <CardContent className="p-2">
              <div className="flex space-x-1">
                {[
                  { key: 'generate', label: 'Review & Select', icon: Eye, description: 'Browse generated questions' },
                  { key: 'edit', label: 'Edit & Customize', icon: Edit, description: 'Modify selected items' },
                  { key: 'build', label: 'Build Assessment', icon: Settings, description: 'Structure your test' },
                  { key: 'finalize', label: 'Finalize & Export', icon: FileDown, description: 'Complete and download' }
                ].map((tab, index) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveView(tab.key as any)}
                    className={`flex-1 p-4 rounded-lg transition-all duration-200 ${
                      activeView === tab.key
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                        : 'hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2 mb-1">
                      <tab.icon className="h-5 w-5" />
                      <span className="font-medium">{tab.label}</span>
                      {index < 3 && activeView !== tab.key && (
                        <ArrowRight className="h-4 w-4 opacity-50" />
                      )}
                    </div>
                    <p className="text-xs opacity-75">{tab.description}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Panels */}
        <div className="space-y-6">
          {activeView === 'generate' && (
            <ItemGenerationPanel
              items={generatedItems}
              selectedItems={selectedItems}
              onToggleSelection={toggleItemSelection}
              onDeleteItem={deleteItem}
              onEditItem={setEditingItem}
              onRegenerateItems={generateItems}
              isGenerating={isGenerating}
            />
          )}

          {activeView === 'edit' && (
            <ItemEditorPanel
              items={selectedItemsData}
              onUpdateItem={updateItem}
              onDeleteItem={deleteItem}
              editingItem={editingItem}
              onSetEditingItem={setEditingItem}
            />
          )}

          {activeView === 'build' && (
            <AssessmentBuilderPanel
              items={selectedItemsData}
              assessmentData={assessmentData}
              onUpdateAssessmentData={updateAssessmentData}
            />
          )}

          {activeView === 'finalize' && (
            <ExportFinalizePanel
              items={selectedItemsData}
              assessmentData={assessmentData}
              totalMarks={totalSelectedMarks}
            />
          )}
        </div>

        {/* Floating Action Button */}
        {selectedItemsData.length > 0 && (
          <div className="fixed bottom-6 right-6">
            <Button
              onClick={() => setActiveView('finalize')}
              className="h-14 px-6 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Award className="h-5 w-5 mr-2" />
              Finalize Assessment
              <Badge className="ml-2 bg-white/20 text-white">
                {selectedItemsData.length}
              </Badge>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentItemGeneration;