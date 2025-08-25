import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Plus, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import { generateCourseOutcomes } from './api';

interface ELO {
  id: string;
  title: string;
  description: string;
  selected: boolean;
  itemConfigRows: ItemConfigRow[];
  maxItems: number;
  maxMarks: number;
}

interface ItemConfigRow {
  id: string;
  bloomsLevel: string;
  itemType: string;
  itemSubType?: string;
  difficulty: string;
  noOfItems: number;
  marksPerItem: number;
}

interface ELOLimits {
  [eloId: string]: {
    maxItems: number;
    maxMarks: number;
  };
}

const AssessmentELOSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { formData, selectedChapters, gradeName, subjectName } = location.state || {};

  const [chapterELOs, setChapterELOs] = useState<{ [key: string]: ELO[] }>({});
  const [eloLimits, setELOLimits] = useState<ELOLimits>({});
  const [loading, setLoading] = useState(false);

  // Mock data - in real app, this would come from API
  const bloomsLevels = [
    'Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'
  ];

  const itemTypes = [
    'Multiple Choice', 'True/False', 'Others', 'Problem Solving', 'Case Study', 'Essay'
  ];

  const difficultyLevels = ['Easy', 'Medium', 'Hard'];

  useEffect(() => {
    if (!formData || !selectedChapters) {
      navigate('/assessment-assist/create');
      return;
    }
    
    // Initialize ELO limits will be done after ELOs are generated
    
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
            selected: false,
            itemConfigRows: [],
            maxItems: 10,
            maxMarks: 20
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
        selected: false,
        itemConfigRows: [],
        maxItems: 10,
        maxMarks: 20
      },
      {
        id: `${chapterId}-2`,
        title: 'Analyze relationships and patterns',
        description: 'Students will be able to analyze relationships between different elements and identify patterns.',
        selected: false,
        itemConfigRows: [],
        maxItems: 10,
        maxMarks: 20
      },
      {
        id: `${chapterId}-3`,
        title: 'Apply knowledge to solve problems',
        description: 'Students will be able to apply their understanding to solve real-world problems and scenarios.',
        selected: false,
        itemConfigRows: [],
        maxItems: 10,
        maxMarks: 20
      }
    ];
  };

  const handleELOSelection = (elo: ELO, checked: boolean) => {
    const updatedChapterELOs = { ...chapterELOs };
    Object.keys(updatedChapterELOs).forEach(chapterId => {
      updatedChapterELOs[chapterId] = updatedChapterELOs[chapterId].map(e => 
        e.id === elo.id ? { ...e, selected: checked } : e
      );
    });
    setChapterELOs(updatedChapterELOs);
  };

  const updateELOLimits = (eloId: string, field: 'maxItems' | 'maxMarks', value: number) => {
    const updatedChapterELOs = { ...chapterELOs };
    Object.keys(updatedChapterELOs).forEach(chapterId => {
      updatedChapterELOs[chapterId] = updatedChapterELOs[chapterId].map(elo =>
        elo.id === eloId ? { ...elo, [field]: value } : elo
      );
    });
    setChapterELOs(updatedChapterELOs);
  };

  const addItemConfigRow = (eloId: string) => {
    // Find the specific ELO
    const currentELO = Object.values(chapterELOs)
      .flat()
      .find(elo => elo.id === eloId);
    
    if (!currentELO) return;

    // Calculate current totals for this ELO
    const currentTotalItems = currentELO.itemConfigRows.reduce((sum, row) => sum + row.noOfItems, 0);
    const currentTotalMarks = currentELO.itemConfigRows.reduce((sum, row) => sum + (row.noOfItems * row.marksPerItem), 0);

    if (currentTotalItems >= currentELO.maxItems) {
      alert(`Cannot add more items. ELO limit: ${currentELO.maxItems} items`);
      return;
    }

    if (currentTotalMarks >= currentELO.maxMarks) {
      alert(`Cannot add more items. ELO limit: ${currentELO.maxMarks} marks`);
      return;
    }

    const newRow: ItemConfigRow = {
      id: Date.now().toString(),
      bloomsLevel: '',
      itemType: '',
      difficulty: '',
      noOfItems: 1,
      marksPerItem: 1
    };

    const updatedChapterELOs = { ...chapterELOs };
    Object.keys(updatedChapterELOs).forEach(chapterId => {
      updatedChapterELOs[chapterId] = updatedChapterELOs[chapterId].map(elo =>
        elo.id === eloId 
          ? { ...elo, itemConfigRows: [...elo.itemConfigRows, newRow] }
          : elo
      );
    });
    setChapterELOs(updatedChapterELOs);
  };

  const updateItemConfigRow = (eloId: string, rowId: string, field: keyof ItemConfigRow, value: any) => {
    // Find the specific ELO
    const currentELO = Object.values(chapterELOs)
      .flat()
      .find(elo => elo.id === eloId);
    
    if (!currentELO) return;

    const updatedChapterELOs = { ...chapterELOs };
    
    // Check limits before updating
    if (field === 'noOfItems' || field === 'marksPerItem') {
      let totalItems = 0;
      let totalMarks = 0;
      
      currentELO.itemConfigRows.forEach(row => {
        if (row.id === rowId) {
          const newNoOfItems = field === 'noOfItems' ? value : row.noOfItems;
          const newMarksPerItem = field === 'marksPerItem' ? value : row.marksPerItem;
          totalItems += newNoOfItems;
          totalMarks += newNoOfItems * newMarksPerItem;
        } else {
          totalItems += row.noOfItems;
          totalMarks += row.noOfItems * row.marksPerItem;
        }
      });

      if (totalItems > currentELO.maxItems) {
        alert(`Cannot exceed ELO limit of ${currentELO.maxItems} items`);
        return;
      }

      if (totalMarks > currentELO.maxMarks) {
        alert(`Cannot exceed ELO limit of ${currentELO.maxMarks} marks`);
        return;
      }
    }

    Object.keys(updatedChapterELOs).forEach(chapterId => {
      updatedChapterELOs[chapterId] = updatedChapterELOs[chapterId].map(elo =>
        elo.id === eloId 
          ? {
              ...elo,
              itemConfigRows: elo.itemConfigRows.map(row =>
                row.id === rowId ? { ...row, [field]: value } : row
              )
            }
          : elo
      );
    });
    setChapterELOs(updatedChapterELOs);
  };

  const removeItemConfigRow = (eloId: string, rowId: string) => {
    const updatedChapterELOs = { ...chapterELOs };
    Object.keys(updatedChapterELOs).forEach(chapterId => {
      updatedChapterELOs[chapterId] = updatedChapterELOs[chapterId].map(elo =>
        elo.id === eloId 
          ? {
              ...elo,
              itemConfigRows: elo.itemConfigRows.filter(row => row.id !== rowId)
            }
          : elo
      );
    });
    setChapterELOs(updatedChapterELOs);
  };

  const calculateELOTotals = (elo: ELO) => {
    const totalItems = elo.itemConfigRows.reduce((sum, row) => sum + row.noOfItems, 0);
    const totalMarks = elo.itemConfigRows.reduce((sum, row) => sum + (row.noOfItems * row.marksPerItem), 0);
    return { totalItems, totalMarks };
  };

  const calculateChapterTotals = (chapterId: string) => {
    const chapterELOsList = chapterELOs[chapterId] || [];
    const totalItems = chapterELOsList.reduce((sum, elo) => 
      sum + elo.itemConfigRows.reduce((eloSum, row) => eloSum + row.noOfItems, 0), 0
    );
    const totalMarks = chapterELOsList.reduce((sum, elo) => 
      sum + elo.itemConfigRows.reduce((eloSum, row) => eloSum + (row.noOfItems * row.marksPerItem), 0), 0
    );
    return { totalItems, totalMarks };
  };

  const handleGenerateItems = () => {
    const selectedELOs = Object.values(chapterELOs).flat().filter(elo => elo.selected);
    
    if (selectedELOs.length === 0) {
      alert('Please select at least one ELO.');
      return;
    }
    
    const hasItemConfig = selectedELOs.some(elo => elo.itemConfigRows.length > 0);
    if (!hasItemConfig) {
      alert('Please configure at least one item type for selected ELOs.');
      return;
    }
    
    // Navigate to item generation/preview page
    navigate('/assessment-assist/item-generation', {
      state: {
        formData,
        selectedChapters,
        selectedELOs,
        gradeName,
        subjectName
      }
    });
  };

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
            <div className="flex gap-2 flex-wrap justify-center">
              <Badge variant="outline">{gradeName}</Badge>
              <Badge variant="outline">{subjectName}</Badge>
              <Badge variant="outline">{formData.assessmentType}</Badge>
              <Badge variant="outline">{formData.marks} marks</Badge>
            </div>
          </div>

          <div className="space-y-8">
            {/* ELO Selection with Chapter Limits */}
            <Card>
              <CardHeader>
                <CardTitle>Expected Learning Outcomes by Chapter</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Set chapter limits and select learning outcomes for assessment
                </p>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Generating learning outcomes...</p>
                  </div>
                ) : (
                  <Accordion type="multiple" className="w-full">
                    {selectedChapters.map((chapter: any) => {
                      const { totalItems, totalMarks } = calculateChapterTotals(chapter.chapterId);
                      
                      return (
                        <AccordionItem key={chapter.chapterId} value={chapter.chapterId}>
                          <AccordionTrigger className="text-left">
                            <div className="flex items-center justify-between w-full">
                              <span className="font-medium">{chapter.chapterName}</span>
                              <div className="flex items-center gap-4">
                                <Badge variant="secondary">
                                  {chapterELOs[chapter.chapterId]?.filter(elo => elo.selected).length || 0} ELOs
                                </Badge>
                                <Badge variant="outline">
                                  {totalItems} items
                                </Badge>
                                <Badge variant="outline">
                                  {totalMarks} marks
                                </Badge>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-4 pt-4">
                              {/* ELOs as Accordions */}
                              <Accordion type="multiple" className="w-full">
                                {chapterELOs[chapter.chapterId]?.map(elo => {
                                  const { totalItems, totalMarks } = calculateELOTotals(elo);
                                  
                                  return (
                                    <AccordionItem key={elo.id} value={elo.id} className="border rounded-lg mb-4">
                                      <AccordionTrigger 
                                        className="text-left px-4"
                                        onClick={() => handleELOSelection(elo, !elo.selected)}
                                      >
                                        <div className="flex items-center justify-between w-full">
                                          <div className="flex-1">
                                            <h4 className="font-medium text-foreground">{elo.title}</h4>
                                            <p className="text-sm text-muted-foreground mt-1">{elo.description}</p>
                                          </div>
                                          <div className="flex items-center gap-4 mr-4">
                                            <Badge variant="outline">
                                              {totalItems}/{elo.maxItems} items
                                            </Badge>
                                            <Badge variant="outline">
                                              {totalMarks}/{elo.maxMarks} marks
                                            </Badge>
                                          </div>
                                        </div>
                                      </AccordionTrigger>
                                      <AccordionContent className="px-4 pb-4">
                                        <div className="space-y-4">
                                          {/* ELO Limits */}
                                          <div className="bg-muted/20 p-4 rounded-lg">
                                            <h5 className="font-medium mb-3">ELO Limits</h5>
                                            <div className="grid grid-cols-2 gap-4">
                                              <div>
                                                <label className="text-sm font-medium block mb-2">No. of Items</label>
                                                <Input
                                                  type="number"
                                                  min="1"
                                                  value={elo.maxItems}
                                                  onChange={(e) => updateELOLimits(elo.id, 'maxItems', parseInt(e.target.value) || 10)}
                                                  className="h-9"
                                                />
                                              </div>
                                              <div>
                                                <label className="text-sm font-medium block mb-2">Total Marks</label>
                                                <Input
                                                  type="number"
                                                  min="1"
                                                  value={elo.maxMarks}
                                                  onChange={(e) => updateELOLimits(elo.id, 'maxMarks', parseInt(e.target.value) || 20)}
                                                  className="h-9"
                                                />
                                              </div>
                                            </div>
                                          </div>

                                          {/* ELO Item Configuration Table */}
                                          <div className="border rounded-lg overflow-hidden">
                                            <div className="bg-muted/30 px-4 py-3 grid grid-cols-7 gap-4 font-medium text-sm">
                                              <div>Bloom's Level</div>
                                              <div>Item Type</div>
                                              <div>Item Sub-type</div>
                                              <div>Difficulty</div>
                                              <div>No. of Items</div>
                                              <div>Marks/Item</div>
                                              <div>Actions</div>
                                            </div>
                                            {elo.itemConfigRows.map(row => (
                                              <div key={row.id} className="px-4 py-3 grid grid-cols-7 gap-4 border-t">
                                                <Select
                                                  value={row.bloomsLevel}
                                                  onValueChange={(value) => updateItemConfigRow(elo.id, row.id, 'bloomsLevel', value)}
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
                                                  onValueChange={(value) => updateItemConfigRow(elo.id, row.id, 'itemType', value)}
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

                                                <div>
                                                  {row.itemType === 'Others' ? (
                                                    <Textarea
                                                      placeholder="Enter item sub-type..."
                                                      value={row.itemSubType || ''}
                                                      onChange={(e) => updateItemConfigRow(elo.id, row.id, 'itemSubType', e.target.value)}
                                                      className="h-9 resize-none"
                                                      rows={1}
                                                    />
                                                  ) : (
                                                    <div className="h-9 flex items-center text-muted-foreground text-sm">-</div>
                                                  )}
                                                </div>

                                                <Select
                                                  value={row.difficulty}
                                                  onValueChange={(value) => updateItemConfigRow(elo.id, row.id, 'difficulty', value)}
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
                                                  onChange={(e) => updateItemConfigRow(elo.id, row.id, 'noOfItems', parseInt(e.target.value) || 1)}
                                                  className="h-9"
                                                />

                                                <Input
                                                  type="number"
                                                  min="1"
                                                  value={row.marksPerItem}
                                                  onChange={(e) => updateItemConfigRow(elo.id, row.id, 'marksPerItem', parseInt(e.target.value) || 1)}
                                                  className="h-9"
                                                />

                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => removeItemConfigRow(elo.id, row.id)}
                                                  className="h-9 w-9 p-0"
                                                >
                                                  <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                              </div>
                                            ))}
                                          </div>

                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => addItemConfigRow(elo.id)}
                                            className="flex items-center gap-2"
                                          >
                                            <Plus className="h-4 w-4" />
                                            Add Item Configuration
                                          </Button>
                                        </div>
                                      </AccordionContent>
                                    </AccordionItem>
                                  );
                                })}
                              </Accordion>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                )}
              </CardContent>
            </Card>

            {/* Generate Items Button */}
            <div className="flex justify-end">
              <Button
                onClick={handleGenerateItems}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-8"
                disabled={Object.values(chapterELOs).flat().filter(elo => elo.selected).length === 0}
              >
                Generate Items
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentELOSelection;