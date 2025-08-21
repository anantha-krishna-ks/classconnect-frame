import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { getGrades, getSubjects, getChapters, type Grade, type Subject, type Chapter } from '../pages/api';

interface AssessmentBasicSetupProps {
  assessmentData: any;
  updateAssessmentData: (data: any) => void;
  onComplete?: () => void;
}

const AssessmentBasicSetup = ({ assessmentData, updateAssessmentData, onComplete }: AssessmentBasicSetupProps) => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(false);

  // Fallback data
  const fallbackGrades = [
    { ClassId: 1, ClassName: 'Grade 1' },
    { ClassId: 2, ClassName: 'Grade 2' },
    { ClassId: 3, ClassName: 'Grade 3' },
    { ClassId: 4, ClassName: 'Grade 4' },
    { ClassId: 5, ClassName: 'Grade 5' },
    { ClassId: 6, ClassName: 'Grade 6' },
    { ClassId: 7, ClassName: 'Grade 7' },
    { ClassId: 8, ClassName: 'Grade 8' },
    { ClassId: 9, ClassName: 'Grade 9' },
    { ClassId: 10, ClassName: 'Grade 10' },
    { ClassId: 11, ClassName: 'Grade 11' },
    { ClassId: 12, ClassName: 'Grade 12' }
  ];

  const boards = [
    { value: 'cbse', label: 'CBSE' },
    { value: 'icse', label: 'ICSE' },
    { value: 'state', label: 'State Board' },
    { value: 'ib', label: 'IB' }
  ];

  // Duration will now be stored as "hrs:mins" format

  const assessmentTypes = [
    { value: 'PA1', label: 'PA1' },
    { value: 'PA2', label: 'PA2' },
    { value: 'Mid-term', label: 'Mid-term' },
    { value: 'Preparatory', label: 'Preparatory' },
    { value: 'Final', label: 'Final' }
  ];

  // Subject mapping based on grade
  const getSubjectsForGrade = (gradeId: string) => {
    const grade = parseInt(gradeId);
    
    if (grade <= 5) {
      return [
        { SubjectId: 1, SubjectName: 'Mathematics', PlanClassId: gradeId },
        { SubjectId: 2, SubjectName: 'English', PlanClassId: gradeId },
        { SubjectId: 3, SubjectName: 'Science', PlanClassId: gradeId },
        { SubjectId: 4, SubjectName: 'Social Studies', PlanClassId: gradeId },
        { SubjectId: 5, SubjectName: 'Hindi', PlanClassId: gradeId }
      ];
    } else if (grade <= 8) {
      return [
        { SubjectId: 1, SubjectName: 'Mathematics', PlanClassId: gradeId },
        { SubjectId: 2, SubjectName: 'English', PlanClassId: gradeId },
        { SubjectId: 3, SubjectName: 'General Science', PlanClassId: gradeId },
        { SubjectId: 4, SubjectName: 'Social Science', PlanClassId: gradeId },
        { SubjectId: 5, SubjectName: 'Hindi', PlanClassId: gradeId },
        { SubjectId: 6, SubjectName: 'Computer Science', PlanClassId: gradeId }
      ];
    } else if (grade <= 10) {
      return [
        { SubjectId: 1, SubjectName: 'Mathematics', PlanClassId: gradeId },
        { SubjectId: 2, SubjectName: 'English', PlanClassId: gradeId },
        { SubjectId: 3, SubjectName: 'Physics', PlanClassId: gradeId },
        { SubjectId: 4, SubjectName: 'Chemistry', PlanClassId: gradeId },
        { SubjectId: 5, SubjectName: 'Biology', PlanClassId: gradeId },
        { SubjectId: 6, SubjectName: 'Social Science', PlanClassId: gradeId },
        { SubjectId: 7, SubjectName: 'Hindi', PlanClassId: gradeId },
        { SubjectId: 8, SubjectName: 'Computer Science', PlanClassId: gradeId }
      ];
    } else {
      return [
        { SubjectId: 1, SubjectName: 'Mathematics', PlanClassId: gradeId },
        { SubjectId: 2, SubjectName: 'English', PlanClassId: gradeId },
        { SubjectId: 3, SubjectName: 'Physics', PlanClassId: gradeId },
        { SubjectId: 4, SubjectName: 'Chemistry', PlanClassId: gradeId },
        { SubjectId: 5, SubjectName: 'Biology', PlanClassId: gradeId },
        { SubjectId: 6, SubjectName: 'Economics', PlanClassId: gradeId },
        { SubjectId: 7, SubjectName: 'Political Science', PlanClassId: gradeId },
        { SubjectId: 8, SubjectName: 'History', PlanClassId: gradeId },
        { SubjectId: 9, SubjectName: 'Geography', PlanClassId: gradeId },
        { SubjectId: 10, SubjectName: 'Computer Science', PlanClassId: gradeId },
        { SubjectId: 11, SubjectName: 'Hindi', PlanClassId: gradeId }
      ];
    }
  };

  const getFallbackChapters = (subjectId: string) => {
    const subjectName = subjects.find(s => s.SubjectId.toString() === subjectId)?.SubjectName || '';
    
    if (subjectName.toLowerCase().includes('mathematics')) {
      return [
        { chapterId: '1', chapterName: 'Numbers and Operations' },
        { chapterId: '2', chapterName: 'Algebra and Patterns' },
        { chapterId: '3', chapterName: 'Geometry and Measurement' },
        { chapterId: '4', chapterName: 'Data and Probability' }
      ];
    } else if (subjectName.toLowerCase().includes('science')) {
      return [
        { chapterId: '1', chapterName: 'Living and Non-Living Things' },
        { chapterId: '2', chapterName: 'Plants and Animals' },
        { chapterId: '3', chapterName: 'Matter and Materials' },
        { chapterId: '4', chapterName: 'Forces and Motion' }
      ];
    } else if (subjectName.toLowerCase().includes('english')) {
      return [
        { chapterId: '1', chapterName: 'Reading Comprehension' },
        { chapterId: '2', chapterName: 'Grammar and Usage' },
        { chapterId: '3', chapterName: 'Vocabulary Building' },
        { chapterId: '4', chapterName: 'Writing Skills' }
      ];
    } else {
      return [
        { chapterId: '1', chapterName: 'Introduction to ' + subjectName },
        { chapterId: '2', chapterName: 'Fundamental Concepts' },
        { chapterId: '3', chapterName: 'Advanced Topics' },
        { chapterId: '4', chapterName: 'Applications and Practice' }
      ];
    }
  };

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const gradesData = await getGrades('ORG001');
        setGrades(gradesData.length > 0 ? gradesData : fallbackGrades);
      } catch (error) {
        console.error('Error fetching grades:', error);
        setGrades(fallbackGrades);
      }
    };
    fetchGrades();
  }, []);

  const handleGradeChange = async (gradeId: string) => {
    updateAssessmentData({ grade: gradeId, subject: '', selectedChapters: [] });
    setSubjects([]);
    setChapters([]);
    
    if (gradeId) {
      try {
        setLoading(true);
        const subjectsData = await getSubjects('ORG001', parseInt(gradeId));
        setSubjects(subjectsData.length > 0 ? subjectsData : getSubjectsForGrade(gradeId));
      } catch (error) {
        console.error('Error fetching subjects:', error);
        setSubjects(getSubjectsForGrade(gradeId));
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubjectChange = async (subjectId: string) => {
    updateAssessmentData({ subject: subjectId, selectedChapters: [] });
    setChapters([]);
    
    if (subjectId) {
      try {
        setLoading(true);
        const selectedSubject = subjects.find(s => s.SubjectId.toString() === subjectId);
        if (selectedSubject) {
          const chaptersData = await getChapters('ORG001', selectedSubject.PlanClassId);
          if (chaptersData && chaptersData.length > 0) {
            setChapters(chaptersData);
            updateAssessmentData({ selectedChapters: chaptersData });
          } else {
            const fallbackChapters = getFallbackChapters(subjectId);
            setChapters(fallbackChapters);
            updateAssessmentData({ selectedChapters: fallbackChapters });
          }
        }
      } catch (error) {
        console.error('Error fetching chapters:', error);
        const fallbackChapters = getFallbackChapters(subjectId);
        setChapters(fallbackChapters);
        updateAssessmentData({ selectedChapters: fallbackChapters });
      } finally {
        setLoading(false);
      }
    }
  };

  const removeChapter = (chapterId: string) => {
    const updatedChapters = assessmentData.selectedChapters.filter((chapter: any) => chapter.chapterId !== chapterId);
    updateAssessmentData({ selectedChapters: updatedChapters });
  };

  const isComplete = () => {
    return assessmentData.board && assessmentData.grade && assessmentData.subject && 
           assessmentData.assessmentName && assessmentData.duration && 
           assessmentData.marks && assessmentData.assessmentType && 
           assessmentData.selectedChapters.length > 0;
  };

  return (
    <div className="space-y-8">
      {/* Basic Information */}
      <Card className="border border-border/50 bg-white">
        <CardHeader className="pb-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-t-lg">
          <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8 p-8">
          {/* Board, Grade, Subject Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3 group">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full border border-blue-300/50 group-hover:scale-110 transition-transform duration-200"></div>
                <label className="text-sm font-semibold text-foreground">Board/Standard *</label>
              </div>
              <Select value={assessmentData.board} onValueChange={(value) => updateAssessmentData({ board: value })}>
                <SelectTrigger className="h-12 border-2 hover:border-blue-300 transition-colors duration-200 bg-white/50">
                  <SelectValue placeholder="Select Board" />
                </SelectTrigger>
                <SelectContent>
                  {boards.map(board => (
                    <SelectItem key={board.value} value={board.value}>{board.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3 group">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-green-600 rounded-full border border-green-300/50 group-hover:scale-110 transition-transform duration-200"></div>
                <label className="text-sm font-semibold text-foreground">Grade *</label>
              </div>
              <Select value={assessmentData.grade} onValueChange={handleGradeChange}>
                <SelectTrigger className="h-12 border-2 hover:border-green-300 transition-colors duration-200 bg-white/50">
                  <SelectValue placeholder="Select Grade" />
                </SelectTrigger>
                <SelectContent>
                  {(grades.length > 0 ? grades : fallbackGrades).map(grade => (
                    <SelectItem key={grade.ClassId} value={grade.ClassId.toString()}>
                      {grade.ClassName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3 group">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full border border-purple-300/50 group-hover:scale-110 transition-transform duration-200"></div>
                <label className="text-sm font-semibold text-foreground">Subject *</label>
              </div>
              <Select value={assessmentData.subject} onValueChange={handleSubjectChange} disabled={!assessmentData.grade}>
                <SelectTrigger className="h-12 border-2 hover:border-purple-300 transition-colors duration-200 bg-white/50 disabled:opacity-50">
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  {(subjects.length > 0 ? subjects : assessmentData.grade ? getSubjectsForGrade(assessmentData.grade) : []).map(subject => (
                    <SelectItem key={subject.SubjectId} value={subject.SubjectId.toString()}>
                      {subject.SubjectName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Chapter Selection */}
          {assessmentData.subject && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full border border-orange-300/50"></div>
                <label className="text-lg font-semibold text-foreground">Chapter Selection</label>
              </div>
              
              {loading ? (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">Loading chapters...</p>
                </div>
              ) : chapters.length > 0 ? (
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 p-6 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-base font-semibold text-orange-900">
                      Selected Chapters ({assessmentData.selectedChapters.length} of {chapters.length})
                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateAssessmentData({ selectedChapters: chapters })}
                        disabled={assessmentData.selectedChapters.length === chapters.length}
                        className="bg-white/70 border-orange-300 text-orange-700 hover:bg-orange-100"
                      >
                        Select All
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateAssessmentData({ selectedChapters: [] })}
                        disabled={assessmentData.selectedChapters.length === 0}
                        className="bg-white/70 border-orange-300 text-orange-700 hover:bg-orange-100"
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {assessmentData.selectedChapters.map((chapter: any) => (
                      <Badge 
                        key={chapter.chapterId} 
                        variant="secondary" 
                        className="flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-800"
                      >
                        {chapter.chapterName}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-red-100"
                          onClick={() => removeChapter(chapter.chapterId)}
                        >
                          <X className="h-3 w-3 text-red-500" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assessment Details */}
      <Card className="border border-border/50 bg-white">
        <CardHeader className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-t-lg">
          <CardTitle className="text-2xl bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Assessment Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8 p-8">
          <div className="space-y-3">
            <label className="text-base font-semibold text-foreground">Assessment Name *</label>
            <Input
              placeholder="Enter assessment name"
              value={assessmentData.assessmentName}
              onChange={(e) => updateAssessmentData({ assessmentName: e.target.value })}
              className="h-12 text-base border-2 hover:border-blue-300 focus:border-blue-500 transition-colors duration-200 bg-white/50"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <label className="text-base font-semibold text-foreground">Time Duration *</label>
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  min="0"
                  max="23"
                  placeholder="Hrs"
                  value={assessmentData.duration ? assessmentData.duration.split(':')[0] || '' : ''}
                  onChange={(e) => {
                    const hours = e.target.value;
                    const minutes = assessmentData.duration ? assessmentData.duration.split(':')[1] || '00' : '00';
                    updateAssessmentData({ duration: `${hours}:${minutes}` });
                  }}
                  className="h-12 text-base border-2 hover:border-purple-300 focus:border-purple-500 transition-colors duration-200 bg-white/50 flex-1"
                />
                <span className="text-muted-foreground font-semibold">:</span>
                <Input
                  type="number"
                  min="0"
                  max="59"
                  placeholder="Mins"
                  value={assessmentData.duration ? assessmentData.duration.split(':')[1] || '' : ''}
                  onChange={(e) => {
                    const minutes = e.target.value.padStart(2, '0');
                    const hours = assessmentData.duration ? assessmentData.duration.split(':')[0] || '0' : '0';
                    updateAssessmentData({ duration: `${hours}:${minutes}` });
                  }}
                  className="h-12 text-base border-2 hover:border-purple-300 focus:border-purple-500 transition-colors duration-200 bg-white/50 flex-1"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-base font-semibold text-foreground">Total Marks *</label>
              <Input
                type="number"
                placeholder="Enter marks"
                value={assessmentData.marks}
                onChange={(e) => updateAssessmentData({ marks: e.target.value })}
                className="h-12 text-base border-2 hover:border-green-300 focus:border-green-500 transition-colors duration-200 bg-white/50"
              />
            </div>

            <div className="space-y-3">
              <label className="text-base font-semibold text-foreground">Assessment Type *</label>
              <Select value={assessmentData.assessmentType} onValueChange={(value) => updateAssessmentData({ assessmentType: value })}>
                <SelectTrigger className="h-12 border-2 hover:border-orange-300 transition-colors duration-200 bg-white/50">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  {assessmentTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Continue Button */}
      {isComplete() && (
        <div className="text-center animate-fade-in">
          <Button
            onClick={onComplete}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-12 py-4 h-auto text-lg rounded-xl border border-purple-400/20 hover:scale-105 transition-all duration-300 transform"
          >
            Continue to ELO Selection
          </Button>
        </div>
      )}
    </div>
  );
};

export default AssessmentBasicSetup;