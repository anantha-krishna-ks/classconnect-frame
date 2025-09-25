import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Plus } from 'lucide-react';
import { generateCourseOutcomes } from '../pages/api';
import { useToast } from '@/hooks/use-toast';

interface ItemConfigRow {
  id: string;
  bloomsLevel: string;
  itemType: string;
  itemSubType?: string;
  difficulty: string;
  noOfItems: number;
  marksPerItem: number;
}

interface ELO {
  id: string;
  title: string;
  description: string;
  selected: boolean;
  previousAssessments?: string[];
  itemConfigRows: ItemConfigRow[];
  maxItems: number;
  maxMarks: number;
}

interface AssessmentELOSelectionProps {
  assessmentData: any;
  updateAssessmentData: (data: any) => void;
  onComplete?: () => void;
}

const AssessmentELOSelection = ({ assessmentData, updateAssessmentData, onComplete }: AssessmentELOSelectionProps) => {
  const [chapterELOs, setChapterELOs] = useState<{ [key: string]: ELO[] }>({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Item configuration options
  const bloomsLevels = [
    'Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'
  ];

  const itemTypes = [
    'Multiple Choice', 'True/False', 'Others', 'Problem Solving', 'Case Study', 'Essay'
  ];

  const difficultyLevels = ['Easy', 'Medium', 'Hard'];

  useEffect(() => {
    if (assessmentData.selectedChapters && assessmentData.selectedChapters.length > 0) {
      generateELOsForChapters();
    }
  }, [assessmentData.selectedChapters]);

  const generateELOsForChapters = async () => {
    setLoading(true);
    const newChapterELOs: { [key: string]: ELO[] } = {};

    for (const chapter of assessmentData.selectedChapters) {
      try {
        const gradeName = `Grade ${assessmentData.grade}`;
        const subjectName = assessmentData.subject; // You might need to get the actual subject name
        
        const response = await generateCourseOutcomes(
          assessmentData.board, 
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
            previousAssessments: Math.random() > 0.5 ? ['PA1', 'PA2'].slice(0, Math.floor(Math.random() * 3)) : [],
            itemConfigRows: [],
            maxItems: 10,
            maxMarks: 20
          }));
          newChapterELOs[chapter.chapterId] = elos;
        } else {
          newChapterELOs[chapter.chapterId] = generateMockELOs(chapter.chapterId);
        }
      } catch (error) {
        console.error('Error generating ELOs for chapter:', chapter.chapterName, error);
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
        previousAssessments: ['PA1', 'Mid-Term'],
        itemConfigRows: [],
        maxItems: 10,
        maxMarks: 20
      },
      {
        id: `${chapterId}-2`,
        title: 'Analyze relationships and patterns',
        description: 'Students will be able to analyze relationships between different elements and identify patterns.',
        selected: false,
        previousAssessments: ['PA2'],
        itemConfigRows: [],
        maxItems: 10,
        maxMarks: 20
      },
      {
        id: `${chapterId}-3`,
        title: 'Apply knowledge to solve problems',
        description: 'Students will be able to apply their understanding to solve real-world problems and scenarios.',
        selected: false,
        previousAssessments: [],
        itemConfigRows: [],
        maxItems: 10,
        maxMarks: 20
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

    // Update selectedELOs in assessmentData
    const allELOs = Object.values(updatedChapterELOs).flat();
    const selectedELOs = allELOs.filter(elo => elo.selected);
    updateAssessmentData({ selectedELOs });
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
      toast({
        title: "Item Limit Exceeded",
        description: `Cannot add more items. ELO limit: ${currentELO.maxItems} items`,
        variant: "destructive"
      });
      return;
    }

    if (currentTotalMarks >= currentELO.maxMarks) {
      toast({
        title: "Mark Limit Exceeded", 
        description: `Cannot add more items. ELO limit: ${currentELO.maxMarks} marks`,
        variant: "destructive"
      });
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
        toast({
          title: "Item Limit Exceeded",
          description: `Cannot exceed ELO limit of ${currentELO.maxItems} items`,
          variant: "destructive"
        });
        return;
      }

      if (totalMarks > currentELO.maxMarks) {
        toast({
          title: "Mark Limit Exceeded",
          description: `Cannot exceed ELO limit of ${currentELO.maxMarks} marks`,
          variant: "destructive"
        });
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

  const getSelectedCount = () => {
    return Object.values(chapterELOs).flat().filter(elo => elo.selected).length;
  };

  const getTotalCount = () => {
    return Object.values(chapterELOs).flat().length;
  };

  return (
    <div className="space-y-8">
      {/* Progress Indicator */}
      <Card className="border border-border/50 bg-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">ELO Selection Progress</h3>
              <p className="text-muted-foreground">Select learning outcomes for your assessment</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{getSelectedCount()}</div>
              <div className="text-sm text-muted-foreground">of {getTotalCount()} ELOs selected</div>
            </div>
          </div>
          
          {assessmentData.selectedChapters && assessmentData.selectedChapters.length > 0 && (
            <div className="mt-4">
              <div className="text-sm font-medium text-foreground mb-2">Selected Chapters:</div>
              <div className="flex flex-wrap gap-2">
                {assessmentData.selectedChapters.map((chapter: any) => (
                  <Badge key={chapter.chapterId} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {chapter.chapterName}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ELO Selection */}
      <Card className="border border-border/50 bg-white">
        <CardHeader className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-t-lg">
          <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Test Blueprint Creation
          </CardTitle>
          <p className="text-muted-foreground">
            Select the learning outcomes you want to include in your assessment
          </p>
        </CardHeader>
        <CardContent className="p-8">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="text-muted-foreground">Generating learning outcomes...</p>
              </div>
            </div>
          ) : (
            <Accordion type="multiple" className="w-full">
              {assessmentData.selectedChapters?.map((chapter: any) => (
                <AccordionItem key={chapter.chapterId} value={chapter.chapterId}>
                  <AccordionTrigger className="text-left hover:no-underline">
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="flex items-center gap-4">
                        <span className="font-medium text-lg">{chapter.chapterName}</span>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                          {chapterELOs[chapter.chapterId]?.filter(elo => elo.selected).length || 0} selected
                        </Badge>
                      </div>
                      <div className="flex items-center gap-6 bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-2 rounded-lg border border-blue-200/50">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-blue-800">No. of Items:</span>
                          <Input
                            type="number"
                            min="1"
                            defaultValue="10"
                            onClick={(e) => e.stopPropagation()}
                            className="h-8 w-20 border-blue-300 focus:border-blue-500 bg-white font-medium"
                          />
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-blue-800">Total Marks:</span>
                          <Input
                            type="number"
                            min="1"
                            defaultValue="20"
                            onClick={(e) => e.stopPropagation()}
                            className="h-8 w-20 border-blue-300 focus:border-blue-500 bg-white font-medium"
                          />
                        </div>
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
                              <div className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-3 flex-1">
                                  <Checkbox
                                    checked={elo.selected}
                                    onCheckedChange={(checked) => handleELOSelection(elo, checked as boolean)}
                                  />
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h4 className="font-medium text-foreground">{elo.title}</h4>
                                      <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                          {totalItems}/{elo.maxItems} items
                                        </Badge>
                                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                          {totalMarks}/{elo.maxMarks} marks
                                        </Badge>
                                      </div>
                                      {elo.previousAssessments && elo.previousAssessments.length > 0 && (
                                        <div className="flex gap-1">
                                          {elo.previousAssessments.map(assessment => (
                                            <Badge key={assessment} variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                                              {assessment}
                                            </Badge>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                    <p className="text-sm text-muted-foreground">{elo.description}</p>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-4">
                                  <AccordionTrigger className="w-6 h-6 p-0" />
                                </div>
                              </div>
                                <AccordionContent className="px-4 pb-4">
                                  <div className="space-y-4">
                                    {/* ELO Item Configuration Table */}
                                    <div className="border-2 border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                      <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 grid grid-cols-7 gap-4 font-medium text-sm text-slate-600">
                                        <div>Bloom's Level</div>
                                        <div>Item Type</div>
                                        <div>Item Sub-type</div>
                                        <div>Difficulty</div>
                                        <div>No. of Items</div>
                                        <div>Marks/Item</div>
                                        <div>Actions</div>
                                      </div>
                                      
                                      {/* Default empty row */}
                                      {elo.itemConfigRows.length === 0 && (
                                        <div className="px-4 py-3 grid grid-cols-7 gap-4 border-t">
                                          <Select>
                                            <SelectTrigger className="h-9">
                                              <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {bloomsLevels.map(level => (
                                                <SelectItem key={level} value={level}>{level}</SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>

                                          <Select>
                                            <SelectTrigger className="h-9">
                                              <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {itemTypes.map(type => (
                                                <SelectItem key={type} value={type}>{type}</SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>

                                          <div className="h-9 flex items-center text-muted-foreground text-sm">-</div>

                                          <Select>
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
                                            placeholder="1"
                                            className="h-9"
                                          />

                                          <Input
                                            type="number"
                                            min="1"
                                            placeholder="1"
                                            className="h-9"
                                          />

                                            <Button
                                              variant="default"
                                              size="sm"
                                              onClick={() => addItemConfigRow(elo.id)}
                                              className="h-9 px-3"
                                            >
                                              <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                      )}
                                      
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

                                          <div className="flex items-center gap-2">
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => removeItemConfigRow(elo.id, row.id)}
                                              className="h-9 w-9 p-0"
                                            >
                                              <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                             <Button
                                               variant="default"
                                               size="sm"
                                               onClick={() => addItemConfigRow(elo.id)}
                                               className="h-9 px-3"
                                             >
                                               <Plus className="h-4 w-4" />
                                             </Button>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </AccordionContent>
                            </AccordionItem>
                          );
                        })}
                      </Accordion>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>

      {/* Continue Button */}
      {getSelectedCount() > 0 && (
        <div className="text-center animate-fade-in">
          <Button
            onClick={onComplete}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold px-12 py-4 h-auto text-lg rounded-xl border border-blue-400/20 hover:scale-105 transition-all duration-300 transform"
          >
            Generate Items
          </Button>
        </div>
      )}
    </div>
  );
};

export default AssessmentELOSelection;