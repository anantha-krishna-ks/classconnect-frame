import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import { generateCourseOutcomes } from './api';

interface ELO {
  id: string;
  title: string;
  description: string;
  selected: boolean;
}

interface ItemConfigRow {
  id: string;
  bloomsLevel: string;
  itemType: string;
  difficulty: string;
  noOfItems: number;
  marksPerItem: number;
}

const AssessmentELOSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { formData, selectedChapters, gradeName, subjectName } = location.state || {};

  const [chapterELOs, setChapterELOs] = useState<{ [key: string]: ELO[] }>({});
  const [selectedELOs, setSelectedELOs] = useState<ELO[]>([]);
  const [itemConfig, setItemConfig] = useState<ItemConfigRow[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock data - in real app, this would come from API
  const bloomsLevels = [
    'Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'
  ];

  const itemTypes = [
    'Multiple Choice', 'True/False', 'Short Answer', 'Long Answer', 
    'Problem Solving', 'Case Study', 'Essay'
  ];

  const difficultyLevels = ['Easy', 'Medium', 'Hard'];

  useEffect(() => {
    if (!formData || !selectedChapters) {
      navigate('/assessment-assist/create');
      return;
    }
    
    // Generate ELOs for each chapter
    generateELOsForChapters();
  }, [formData, selectedChapters]);

  const generateELOsForChapters = async () => {
    setLoading(true);
    const newChapterELOs: { [key: string]: ELO[] } = {};

    for (const chapter of selectedChapters) {
      try {
        // Generate ELOs using AI API
        const response = await generateCourseOutcomes(
          formData.board, 
          gradeName, 
          subjectName, 
          chapter.chapterName
        );

        if (response && response.course_outcomes) {
          const elos: ELO[] = response.course_outcomes.map((outcome: any, index: number) => ({
            id: `${chapter.chapterId}-${index}`,
            title: outcome.co_title || `ELO ${index + 1}`,
            description: outcome.co_description || 'Learning outcome description',
            selected: false
          }));
          newChapterELOs[chapter.chapterId] = elos;
        } else {
          // Fallback mock data
          newChapterELOs[chapter.chapterId] = generateMockELOs(chapter.chapterId);
        }
      } catch (error) {
        console.error('Error generating ELOs for chapter:', chapter.chapterName, error);
        // Fallback to mock data
        newChapterELOs[chapter.chapterId] = generateMockELOs(chapter.chapterId);
      }
    }

    setChapterELOs(newChapterELOs);
    setLoading(false);
  };

  const generateMockELOs = (chapterId: string): ELO[] => {
    return [
      {
        id: `${chapterId}-1`,
        title: 'Define key concepts and terminology',
        description: 'Students will be able to define and explain the fundamental concepts and terminology related to this chapter.',
        selected: false
      },
      {
        id: `${chapterId}-2`,
        title: 'Analyze relationships and patterns',
        description: 'Students will be able to analyze relationships between different elements and identify patterns.',
        selected: false
      },
      {
        id: `${chapterId}-3`,
        title: 'Apply knowledge to solve problems',
        description: 'Students will be able to apply their understanding to solve real-world problems and scenarios.',
        selected: false
      }
    ];
  };

  const handleELOSelection = (elo: ELO, checked: boolean) => {
    // Update the specific ELO in chapterELOs
    const updatedChapterELOs = { ...chapterELOs };
    Object.keys(updatedChapterELOs).forEach(chapterId => {
      updatedChapterELOs[chapterId] = updatedChapterELOs[chapterId].map(e => 
        e.id === elo.id ? { ...e, selected: checked } : e
      );
    });
    setChapterELOs(updatedChapterELOs);

    // Update selectedELOs
    if (checked) {
      setSelectedELOs(prev => [...prev, { ...elo, selected: true }]);
    } else {
      setSelectedELOs(prev => prev.filter(e => e.id !== elo.id));
    }
  };

  const addItemConfigRow = () => {
    const newRow: ItemConfigRow = {
      id: Date.now().toString(),
      bloomsLevel: '',
      itemType: '',
      difficulty: '',
      noOfItems: 1,
      marksPerItem: 1
    };
    setItemConfig(prev => [...prev, newRow]);
  };

  const updateItemConfigRow = (id: string, field: keyof ItemConfigRow, value: any) => {
    setItemConfig(prev => prev.map(row => 
      row.id === id ? { ...row, [field]: value } : row
    ));
  };

  const removeItemConfigRow = (id: string) => {
    setItemConfig(prev => prev.filter(row => row.id !== id));
  };

  const calculateTotals = () => {
    const totalItems = itemConfig.reduce((sum, row) => sum + row.noOfItems, 0);
    const totalMarks = itemConfig.reduce((sum, row) => sum + (row.noOfItems * row.marksPerItem), 0);
    return { totalItems, totalMarks };
  };

  const handleGenerateItems = () => {
    if (selectedELOs.length === 0) {
      alert('Please select at least one ELO.');
      return;
    }
    if (itemConfig.length === 0) {
      alert('Please configure at least one item type.');
      return;
    }
    
    // Navigate to item generation/preview page
    navigate('/assessment-assist/item-generation', {
      state: {
        formData,
        selectedChapters,
        selectedELOs,
        itemConfig,
        gradeName,
        subjectName
      }
    });
  };

  const { totalItems, totalMarks } = calculateTotals();

  if (!formData) {
    return null;
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8 animate-fade-in">
          <Button
            variant="ghost"
            onClick={() => navigate('/assessment-assist/create')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-purple-50 transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Assessment Details
          </Button>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center animate-fade-in">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Choose Expected Learning Outcomes
            </h1>
            <p className="text-xl text-muted-foreground mb-4 max-w-2xl mx-auto">
              Select the learning outcomes you want to assess with AI-powered precision
            </p>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="outline">{gradeName}</Badge>
              <Badge variant="outline">{subjectName}</Badge>
              <Badge variant="outline">{formData.assessmentType}</Badge>
              <Badge variant="outline">{formData.marks} marks</Badge>
            </div>
          </div>

          <div className="space-y-8">
            {/* ELO Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Expected Learning Outcomes by Chapter</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Select the learning outcomes you want to include in your assessment
                </p>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Generating learning outcomes...</p>
                  </div>
                ) : (
                  <Accordion type="multiple" className="w-full">
                    {selectedChapters.map((chapter: any) => (
                      <AccordionItem key={chapter.chapterId} value={chapter.chapterId}>
                        <AccordionTrigger className="text-left">
                          <div className="flex items-center justify-between w-full">
                            <span className="font-medium">{chapter.chapterName}</span>
                            <Badge variant="secondary" className="ml-2">
                              {chapterELOs[chapter.chapterId]?.filter(elo => elo.selected).length || 0} selected
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4 pt-4">
                            {chapterELOs[chapter.chapterId]?.map(elo => (
                              <div key={elo.id} className="flex items-start space-x-3 p-4 border rounded-lg">
                                <Checkbox
                                  checked={elo.selected}
                                  onCheckedChange={(checked) => handleELOSelection(elo, checked as boolean)}
                                />
                                <div className="flex-1">
                                  <h4 className="font-medium text-foreground">{elo.title}</h4>
                                  <p className="text-sm text-muted-foreground mt-1">{elo.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </CardContent>
            </Card>

            {/* Item Configuration Panel */}
            {selectedELOs.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Item Configuration</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Configure the types of questions for your selected learning outcomes
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Configuration Table */}
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-muted/30 px-4 py-3 grid grid-cols-6 gap-4 font-medium text-sm">
                      <div>Bloom's Level</div>
                      <div>Item Type</div>
                      <div>Difficulty</div>
                      <div>No. of Items</div>
                      <div>Marks/Item</div>
                      <div>Actions</div>
                    </div>
                    {itemConfig.map(row => (
                      <div key={row.id} className="px-4 py-3 grid grid-cols-6 gap-4 border-t">
                        <Select 
                          value={row.bloomsLevel} 
                          onValueChange={(value) => updateItemConfigRow(row.id, 'bloomsLevel', value)}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {bloomsLevels.map(level => (
                              <SelectItem key={level} value={level}>{level}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <Select 
                          value={row.itemType} 
                          onValueChange={(value) => updateItemConfigRow(row.id, 'itemType', value)}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {itemTypes.map(type => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <Select 
                          value={row.difficulty} 
                          onValueChange={(value) => updateItemConfigRow(row.id, 'difficulty', value)}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {difficultyLevels.map(level => (
                              <SelectItem key={level} value={level}>{level}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <Input
                          type="number"
                          min="1"
                          value={row.noOfItems}
                          onChange={(e) => updateItemConfigRow(row.id, 'noOfItems', parseInt(e.target.value) || 1)}
                          className="h-9"
                        />
                        
                        <Input
                          type="number"
                          min="1"
                          value={row.marksPerItem}
                          onChange={(e) => updateItemConfigRow(row.id, 'marksPerItem', parseInt(e.target.value) || 1)}
                          className="h-9"
                        />
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItemConfigRow(row.id)}
                          className="h-9 w-9 p-0"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* Add Item Button */}
                  <div className="flex justify-start">
                    <Button 
                      variant="outline" 
                      onClick={addItemConfigRow}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Item
                    </Button>
                  </div>

                  {/* Summary */}
                  {itemConfig.length > 0 && (
                    <div className="bg-muted/20 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Summary</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Total Items:</span>
                          <span className="ml-2 font-medium">{totalItems}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Total Marks:</span>
                          <span className="ml-2 font-medium">{totalMarks}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Generate Items Button */}
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleGenerateItems}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-8"
                      disabled={selectedELOs.length === 0 || itemConfig.length === 0}
                    >
                      Generate Items
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentELOSelection;