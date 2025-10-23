import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Plus, GitMerge } from 'lucide-react';
import { generateCourseOutcomes, getSubjects, getChapters, Subject, Chapter } from '../pages/api';
import { useToast } from '@/hooks/use-toast';
import AssessmentItemGeneration from './AssessmentItemGeneration';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

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
  const [showItemGeneration, setShowItemGeneration] = useState(false);
  const [generationKey, setGenerationKey] = useState(0);
  const [mergeDialogOpen, setMergeDialogOpen] = useState(false);
  const [mergeSubjects, setMergeSubjects] = useState<Subject[]>([]);
  const [mergeChapters, setMergeChapters] = useState<Chapter[]>([]);
  const [mergeELOs, setMergeELOs] = useState<ELO[]>([]);
  const [selectedMergeSubject, setSelectedMergeSubject] = useState<string>('');
  const [selectedMergeChapter, setSelectedMergeChapter] = useState<string>('');
  const [selectedMergeELO, setSelectedMergeELO] = useState<string>('');
  const [loadingMergeData, setLoadingMergeData] = useState(false);
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

  const handleGenerateItems = () => {
    // Get all selected ELOs with their configurations
    const allELOs = Object.values(chapterELOs).flat();
    const selectedELOs = allELOs.filter(elo => elo.selected && elo.itemConfigRows.length > 0);
    
    if (selectedELOs.length === 0) {
      toast({
        title: "No configured ELOs",
        description: "Please select and configure at least one ELO with item details",
        variant: "destructive"
      });
      return;
    }

    // Update assessment data with selected ELOs and their configurations
    updateAssessmentData({
      ...assessmentData,
      selectedELOs,
      configuredItems: selectedELOs.flatMap(elo => 
        elo.itemConfigRows.map(row => ({
          eloId: elo.id,
          eloTitle: elo.title,
          ...row
        }))
      )
    });

    // Increment generation key to trigger regeneration
    setGenerationKey(prev => prev + 1);
    
    // Show the item generation component
    setShowItemGeneration(true);
    
    toast({
      title: showItemGeneration ? "Regenerating Items" : "Generating Items",
      description: "Creating assessment items based on your configuration...",
    });
  };

  const loadMergeSubjects = async () => {
    try {
      setLoadingMergeData(true);
      const orgcode = localStorage.getItem('orgcode') || 'DEMO';
      const classId = parseInt(assessmentData.grade) || 1;
      const subjects = await getSubjects(orgcode, classId);
      
      // If API returns empty, use mock data
      if (!subjects || subjects.length === 0) {
        console.log('No subjects from API, using mock data');
        const mockSubjects: Subject[] = [
          { SubjectId: 1, SubjectName: 'Mathematics', PlanClassId: `${classId}-math` },
          { SubjectId: 2, SubjectName: 'English', PlanClassId: `${classId}-english` },
          { SubjectId: 3, SubjectName: 'Science', PlanClassId: `${classId}-science` },
          { SubjectId: 4, SubjectName: 'Social Studies', PlanClassId: `${classId}-social` },
          { SubjectId: 5, SubjectName: 'Hindi', PlanClassId: `${classId}-hindi` }
        ];
        setMergeSubjects(mockSubjects);
      } else {
        setMergeSubjects(subjects);
      }
    } catch (error) {
      console.error('Error loading subjects:', error);
      // Use mock data as fallback
      const classId = parseInt(assessmentData.grade) || 1;
      const mockSubjects: Subject[] = [
        { SubjectId: 1, SubjectName: 'Mathematics', PlanClassId: `${classId}-math` },
        { SubjectId: 2, SubjectName: 'English', PlanClassId: `${classId}-english` },
        { SubjectId: 3, SubjectName: 'Science', PlanClassId: `${classId}-science` },
        { SubjectId: 4, SubjectName: 'Social Studies', PlanClassId: `${classId}-social` },
        { SubjectId: 5, SubjectName: 'Hindi', PlanClassId: `${classId}-hindi` }
      ];
      setMergeSubjects(mockSubjects);
      toast({
        title: "Using Demo Data",
        description: "Showing sample subjects for demonstration",
      });
    } finally {
      setLoadingMergeData(false);
    }
  };

  const loadMergeChapters = async (planClassId: string) => {
    try {
      setLoadingMergeData(true);
      const orgcode = localStorage.getItem('orgcode') || 'DEMO';
      const chapters = await getChapters(orgcode, planClassId);
      
      // Filter out invalid/null chapter entries
      const validChapters = (chapters || []).filter(
        c => c && c.chapterId && c.chapterName && String(c.chapterName).trim() !== ''
      );
      
      // If no valid chapters, use mock data
      if (validChapters.length === 0) {
        console.log('No valid chapters from API, using mock data');
        const mockChapters: Chapter[] = [
          { chapterId: `${planClassId}-ch1`, chapterName: 'Chapter 1 - Introduction' },
          { chapterId: `${planClassId}-ch2`, chapterName: 'Chapter 2 - Fundamentals' },
          { chapterId: `${planClassId}-ch3`, chapterName: 'Chapter 3 - Advanced Topics' },
          { chapterId: `${planClassId}-ch4`, chapterName: 'Chapter 4 - Applications' }
        ];
        setMergeChapters(mockChapters);
        console.log('Set mock chapters:', mockChapters.length);
      } else {
        setMergeChapters(validChapters);
        console.log('Set valid chapters from API:', validChapters.length);
      }
    } catch (error) {
      console.error('Error loading chapters:', error);
      // Use mock data as fallback
      const mockChapters: Chapter[] = [
        { chapterId: `${planClassId}-ch1`, chapterName: 'Chapter 1 - Introduction' },
        { chapterId: `${planClassId}-ch2`, chapterName: 'Chapter 2 - Fundamentals' },
        { chapterId: `${planClassId}-ch3`, chapterName: 'Chapter 3 - Advanced Topics' },
        { chapterId: `${planClassId}-ch4`, chapterName: 'Chapter 4 - Applications' }
      ];
      setMergeChapters(mockChapters);
      toast({
        title: "Using Demo Data",
        description: "Showing sample chapters for demonstration",
      });
    } finally {
      setLoadingMergeData(false);
    }
  };

  const loadMergeELOs = async (chapterName: string) => {
    try {
      setLoadingMergeData(true);
      
      // Guard: if chapterName is empty or blank, use mock data immediately
      if (!chapterName || String(chapterName).trim() === '') {
        console.log('Empty chapter name, using mock ELOs');
        const mockELOs: ELO[] = [
          {
            id: 'merge-mock-1',
            title: 'Understanding Core Concepts',
            description: 'Students will be able to understand and explain the fundamental concepts of this chapter',
            selected: false,
            itemConfigRows: [],
            maxItems: 10,
            maxMarks: 20
          },
          {
            id: 'merge-mock-2',
            title: 'Application of Knowledge',
            description: 'Students will be able to apply learned concepts to solve practical problems',
            selected: false,
            itemConfigRows: [],
            maxItems: 10,
            maxMarks: 20
          },
          {
            id: 'merge-mock-3',
            title: 'Analysis and Critical Thinking',
            description: 'Students will be able to analyze situations and demonstrate critical thinking skills',
            selected: false,
            itemConfigRows: [],
            maxItems: 10,
            maxMarks: 20
          }
        ];
        setMergeELOs(mockELOs);
        setLoadingMergeData(false);
        return;
      }
      
      const gradeName = `Grade ${assessmentData.grade}`;
      const subjectName = mergeSubjects.find(s => s.SubjectId.toString() === selectedMergeSubject)?.SubjectName || '';
      
      const response = await generateCourseOutcomes(
        assessmentData.board,
        gradeName,
        subjectName,
        chapterName
      );

      if (response && response.course_outcomes && response.course_outcomes.length > 0) {
        const elos: ELO[] = response.course_outcomes.map((outcome: any, index: number) => ({
          id: `merge-${index}`,
          title: outcome.co_title || `ELO ${index + 1}`,
          description: outcome.co_description || 'Learning outcome description',
          selected: false,
          itemConfigRows: [],
          maxItems: 10,
          maxMarks: 20
        }));
        setMergeELOs(elos);
        console.log('Set ELOs from API:', elos.length);
      } else {
        // Use mock ELOs if API returns empty
        console.log('No ELOs from API, using mock data');
        const mockELOs: ELO[] = [
          {
            id: 'merge-mock-1',
            title: 'Understanding Core Concepts',
            description: 'Students will be able to understand and explain the fundamental concepts of this chapter',
            selected: false,
            itemConfigRows: [],
            maxItems: 10,
            maxMarks: 20
          },
          {
            id: 'merge-mock-2',
            title: 'Application of Knowledge',
            description: 'Students will be able to apply learned concepts to solve practical problems',
            selected: false,
            itemConfigRows: [],
            maxItems: 10,
            maxMarks: 20
          },
          {
            id: 'merge-mock-3',
            title: 'Analysis and Critical Thinking',
            description: 'Students will be able to analyze situations and demonstrate critical thinking skills',
            selected: false,
            itemConfigRows: [],
            maxItems: 10,
            maxMarks: 20
          }
        ];
        setMergeELOs(mockELOs);
      }
    } catch (error) {
      console.error('Error loading ELOs:', error);
      // Use mock data as fallback
      const mockELOs: ELO[] = [
        {
          id: 'merge-mock-1',
          title: 'Understanding Core Concepts',
          description: 'Students will be able to understand and explain the fundamental concepts of this chapter',
          selected: false,
          itemConfigRows: [],
          maxItems: 10,
          maxMarks: 20
        },
        {
          id: 'merge-mock-2',
          title: 'Application of Knowledge',
          description: 'Students will be able to apply learned concepts to solve practical problems',
          selected: false,
          itemConfigRows: [],
          maxItems: 10,
          maxMarks: 20
        },
        {
          id: 'merge-mock-3',
          title: 'Analysis and Critical Thinking',
          description: 'Students will be able to analyze situations and demonstrate critical thinking skills',
          selected: false,
          itemConfigRows: [],
          maxItems: 10,
          maxMarks: 20
        }
      ];
      setMergeELOs(mockELOs);
      toast({
        title: "Using Demo Data",
        description: "Showing sample ELOs for demonstration",
      });
    } finally {
      setLoadingMergeData(false);
    }
  };

  const handleMergeDialogOpen = () => {
    setMergeDialogOpen(true);
    loadMergeSubjects();
  };

  const handleSubjectChange = (value: string) => {
    setSelectedMergeSubject(value);
    setSelectedMergeChapter('');
    setSelectedMergeELO('');
    setMergeChapters([]);
    setMergeELOs([]);
    
    const subject = mergeSubjects.find(s => s.SubjectId.toString() === value);
    if (subject) {
      loadMergeChapters(subject.PlanClassId);
    }
  };

  const handleChapterChange = (value: string) => {
    setSelectedMergeChapter(value);
    setSelectedMergeELO('');
    setMergeELOs([]);
    
    const chapter = mergeChapters.find(c => c.chapterId === value);
    if (chapter) {
      loadMergeELOs(chapter.chapterName);
    }
  };

  const handleMerge = () => {
    if (!selectedMergeSubject || !selectedMergeChapter || !selectedMergeELO) {
      toast({
        title: "Incomplete Selection",
        description: "Please select Subject, Chapter, and ELO to merge",
        variant: "destructive"
      });
      return;
    }

    const selectedELO = mergeELOs.find(elo => elo.id === selectedMergeELO);
    if (selectedELO) {
      const updatedChapterELOs = { ...chapterELOs };
      const selectedChapter = mergeChapters.find(c => c.chapterId === selectedMergeChapter);
      
      if (selectedChapter) {
        if (!updatedChapterELOs[selectedChapter.chapterId]) {
          updatedChapterELOs[selectedChapter.chapterId] = [];
        }
        
        updatedChapterELOs[selectedChapter.chapterId].push({
          ...selectedELO,
          id: `${selectedChapter.chapterId}-merged-${Date.now()}`,
          selected: true
        });
        
        setChapterELOs(updatedChapterELOs);
        
        toast({
          title: "ELO Merged Successfully",
          description: `${selectedELO.title} has been added to ${selectedChapter.chapterName}`,
        });
        
        setMergeDialogOpen(false);
        setSelectedMergeSubject('');
        setSelectedMergeChapter('');
        setSelectedMergeELO('');
      }
    }
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
                                               variant="outline"
                                               size="sm"
                                               onClick={handleMergeDialogOpen}
                                               className="h-9 px-3"
                                               title="Merge ELO from another chapter"
                                             >
                                               <GitMerge className="h-4 w-4" />
                                             </Button>
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
            onClick={handleGenerateItems}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold px-12 py-4 h-auto text-lg rounded-xl border border-blue-400/20 hover:scale-105 transition-all duration-300 transform"
          >
            {showItemGeneration ? 'Regenerate Items' : 'Generate Items Now'}
          </Button>
        </div>
      )}

      {/* Assessment Item Generation */}
      {showItemGeneration && (
        <AssessmentItemGeneration
          key={generationKey}
          assessmentData={assessmentData}
          updateAssessmentData={updateAssessmentData}
        />
      )}

      {/* Merge ELO Dialog */}
      <Dialog open={mergeDialogOpen} onOpenChange={setMergeDialogOpen}>
        <DialogContent className="max-w-2xl" onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Merge ELO from Another Chapter</DialogTitle>
            <DialogDescription>
              Select a subject, chapter, and ELO to merge into your current assessment
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Subject Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Subject</label>
              <Select
                value={selectedMergeSubject}
                onValueChange={handleSubjectChange}
                disabled={loadingMergeData}
              >
                <SelectTrigger className="w-full bg-background">
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-900 z-[1000]">
                  {mergeSubjects.length === 0 ? (
                    <SelectItem value="no-subjects" disabled>No subjects found</SelectItem>
                  ) : (
                    mergeSubjects.map(subject => (
                      <SelectItem key={subject.SubjectId} value={subject.SubjectId.toString()}>
                        {subject.SubjectName}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Chapter Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Chapter</label>
              <Select
                value={selectedMergeChapter}
                onValueChange={handleChapterChange}
                disabled={!selectedMergeSubject || loadingMergeData}
              >
                <SelectTrigger className="w-full bg-background">
                  <SelectValue placeholder="Select a chapter" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-900 z-[1000]">
                  {mergeChapters.length === 0 ? (
                    <SelectItem value="no-chapters" disabled>No chapters found</SelectItem>
                  ) : (
                    mergeChapters.map(chapter => (
                      <SelectItem key={chapter.chapterId} value={chapter.chapterId}>
                        {chapter.chapterName}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* ELO Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Expected Learning Outcome (ELO)</label>
              <Select
                value={selectedMergeELO}
                onValueChange={setSelectedMergeELO}
                disabled={!selectedMergeChapter || loadingMergeData}
              >
                <SelectTrigger className="w-full bg-background">
                  <SelectValue placeholder="Select an ELO" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-900 z-[1000]">
                  {mergeELOs.length === 0 ? (
                    <SelectItem value="no-elos" disabled>No ELOs found</SelectItem>
                  ) : (
                    mergeELOs.map(elo => (
                      <SelectItem key={elo.id} value={elo.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{elo.title}</span>
                          <span className="text-xs text-muted-foreground">{elo.description}</span>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Loading Indicator */}
            {loadingMergeData && (
              <div className="flex items-center justify-center gap-2 py-4">
                <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            )}

            {/* Merge Info */}
            {selectedMergeELO && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <GitMerge className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-blue-900 mb-1">Ready to Merge</h4>
                    <p className="text-sm text-blue-700">
                      The selected ELO will be added to your current assessment and marked as selected.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setMergeDialogOpen(false);
                setSelectedMergeSubject('');
                setSelectedMergeChapter('');
                setSelectedMergeELO('');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleMerge}
              disabled={!selectedMergeELO || loadingMergeData}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              <GitMerge className="h-4 w-4 mr-2" />
              Merge ELO
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AssessmentELOSelection;