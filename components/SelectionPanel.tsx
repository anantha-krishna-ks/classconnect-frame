import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Plus, Upload, BookOpen, Target, X } from 'lucide-react';
import { Grade, Subject, Chapter } from '@/pages/api';

interface SelectionPanelProps {
  board: string;
  setBoard: (value: string) => void;
  grade: string;
  subject: string;
  onSubjectChange: (value: string) => void;
  chapters: string;
  setChapters: (value: string) => void;
  
  grades: Grade[];
  subjects: Subject[];
  chaptersData: Chapter[];
  onGradeChange: (value: string) => void;
  isLoadingGrades: boolean;
  isLoadingSubjects: boolean;
  isLoadingChapters: boolean;
  onGenerateCOs: () => void;
}

const SelectionPanel = ({
  board,
  setBoard,
  grade,
  subject,
  chapters,
  setChapters,
  grades,
  subjects,
  chaptersData,
  onGradeChange,
  isLoadingGrades,
  isLoadingSubjects,
  isLoadingChapters,
  onGenerateCOs,
  onSubjectChange
}: SelectionPanelProps) => {

  return <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-green-500"></div>
      
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
          <BookOpen className="text-blue-600" size={20} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Basic Setup</h3>
          <p className="text-gray-600 text-sm">Configure your lesson details in just a few clicks</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <label className="text-sm font-medium text-gray-700">Board/Standard</label>
          </div>
          <Select value={board} onValueChange={setBoard}>
            <SelectTrigger className="h-11 bg-gray-50 border-gray-300 hover:bg-white transition-colors">
              <SelectValue placeholder="CBSE" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cbse">CBSE</SelectItem>
              <SelectItem value="icse">ICSE</SelectItem>
              <SelectItem value="state">State Board</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <label className="text-sm font-medium text-gray-700">Grade</label>
          </div>
          <Select value={grade} onValueChange={onGradeChange}>
            <SelectTrigger className="h-11 bg-gray-50 border-gray-300 hover:bg-white transition-colors">
              <SelectValue placeholder="Select Grade" />
            </SelectTrigger>
            <SelectContent>
              {isLoadingGrades ? (
                <SelectItem value="loading" disabled>Loading...</SelectItem>
              ) : (
                grades.map((g) => (
                  <SelectItem key={g.ClassId} value={String(g.ClassId)}>
                    {g.ClassName}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <label className="text-sm font-medium text-gray-700">Subject</label>
          </div>
          <Select value={subject} onValueChange={onSubjectChange}>
            <SelectTrigger className="h-11 bg-gray-50 border-gray-300 hover:bg-white transition-colors">
              <SelectValue placeholder="Select Subject" />
            </SelectTrigger>
            <SelectContent>
              {isLoadingSubjects ? (
                <SelectItem value="loading" disabled>Loading...</SelectItem>
              ) : (
                subjects.map((s) => (
                  <SelectItem key={s.SubjectId} value={String(s.SubjectId)}>
                    {s.SubjectName}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Chapter/Unit Row */}
      <div className="grid grid-cols-1 gap-6 mb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <label className="text-sm font-medium text-gray-700">Chapter/Unit</label>
          </div>
          <Select value={chapters} onValueChange={setChapters}>
            <SelectTrigger className="h-11 bg-gray-50 border-gray-300 hover:bg-white transition-colors">
              <SelectValue placeholder="Select chapter/unit..." />
            </SelectTrigger>
            <SelectContent>
              {isLoadingChapters ? (
                <SelectItem value="loading" disabled>Loading...</SelectItem>
              ) : (
                chaptersData.map((c) => (
                  <SelectItem key={c.chapterId} value={c.chapterId}>
                    {c.chapterName}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>


      {/* Generate COs Button */}
      <div className="text-center">
        <Button 
          onClick={onGenerateCOs}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Target className="mr-2" size={18} />
          Generate COs
        </Button>
      </div>
    </div>;
};
export default SelectionPanel;