import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { generateCourseOutcomes } from '../pages/api';

interface ELO {
  id: string;
  title: string;
  description: string;
  selected: boolean;
  previousAssessments?: string[];
}

interface AssessmentELOSelectionProps {
  assessmentData: any;
  updateAssessmentData: (data: any) => void;
  onComplete?: () => void;
}

const AssessmentELOSelection = ({ assessmentData, updateAssessmentData, onComplete }: AssessmentELOSelectionProps) => {
  const [chapterELOs, setChapterELOs] = useState<{ [key: string]: ELO[] }>({});
  const [loading, setLoading] = useState(false);

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
            previousAssessments: Math.random() > 0.5 ? ['PA1', 'PA2'].slice(0, Math.floor(Math.random() * 3)) : []
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
        previousAssessments: ['PA1', 'Mid-Term']
      },
      {
        id: `${chapterId}-2`,
        title: 'Analyze relationships and patterns',
        description: 'Students will be able to analyze relationships between different elements and identify patterns.',
        selected: false,
        previousAssessments: ['PA2']
      },
      {
        id: `${chapterId}-3`,
        title: 'Apply knowledge to solve problems',
        description: 'Students will be able to apply their understanding to solve real-world problems and scenarios.',
        selected: false,
        previousAssessments: []
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
            Expected Learning Outcomes by Chapter
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
                      <span className="font-medium text-lg">{chapter.chapterName}</span>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        {chapterELOs[chapter.chapterId]?.filter(elo => elo.selected).length || 0} selected
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-4">
                      {chapterELOs[chapter.chapterId]?.map(elo => (
                        <div key={elo.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:border-blue-200 hover:bg-blue-50/30 transition-colors duration-200">
                          <Checkbox
                            checked={elo.selected}
                            onCheckedChange={(checked) => handleELOSelection(elo, checked as boolean)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-foreground">{elo.title}</h4>
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
                      ))}
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
            Continue to Item Configuration
          </Button>
        </div>
      )}
    </div>
  );
};

export default AssessmentELOSelection;