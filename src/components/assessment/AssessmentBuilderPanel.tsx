import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Settings, Plus, GripVertical, Trash2, FileText, Clock,
  School, Calendar, User, Building, Layout, Hash, BookOpen, Save
} from 'lucide-react';

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
}

interface AssessmentBuilderPanelProps {
  items: GeneratedItem[];
  assessmentData: any;
  onUpdateAssessmentData: (data: any) => void;
}

export const AssessmentBuilderPanel: React.FC<AssessmentBuilderPanelProps> = ({
  items,
  assessmentData,
  onUpdateAssessmentData
}) => {
  const [builderData, setBuilderData] = useState({
    assessmentTitle: assessmentData.assessmentName || '',
    subject: assessmentData.subject || '',
    classGrade: assessmentData.class || '',
    timeHours: '2',
    timeMinutes: '0',
    examDate: '',
    schoolName: '',
    schoolLogo: '',
    totalMarks: items.reduce((sum, item) => sum + item.marks, 0).toString(),
    generalInstructions: 'Read all instructions carefully before attempting the questions.',
    sections: [
      {
        id: 1,
        title: 'Section A',
        instructions: 'Answer all questions in this section.',
        questions: items.slice(0, Math.ceil(items.length / 2))
      },
      {
        id: 2,
        title: 'Section B',
        instructions: 'Choose any three questions from this section.',
        questions: items.slice(Math.ceil(items.length / 2))
      }
    ]
  });

  const updateBuilderData = (field: string, value: any) => {
    setBuilderData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addSection = () => {
    const newSection = {
      id: Date.now(),
      title: `Section ${String.fromCharCode(65 + builderData.sections.length)}`,
      instructions: 'Answer the questions in this section.',
      questions: []
    };
    setBuilderData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  };

  const updateSection = (sectionId: number, field: string, value: any) => {
    setBuilderData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? { ...section, [field]: value } : section
      )
    }));
  };

  const removeSection = (sectionId: number) => {
    setBuilderData(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== sectionId)
    }));
  };

  const saveAssessmentStructure = () => {
    onUpdateAssessmentData({
      ...assessmentData,
      ...builderData,
      structuredItems: builderData.sections
    });
  };

  if (items.length === 0) {
    return (
      <Card className="border-0 shadow-sm bg-white/80">
        <CardContent className="p-12 text-center">
          <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No items selected</h3>
          <p className="text-gray-500">Select items from the generation panel to build your assessment</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-sm bg-white/80">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Layout className="h-5 w-5 text-indigo-600" />
            <span>Assessment Structure Builder</span>
            <Badge variant="secondary">{items.length} items</Badge>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Assessment Details */}
      <Card className="border border-gray-200 bg-white">
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <span>Assessment Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center">
                <FileText className="h-4 w-4 mr-1" />
                Assessment Title
              </label>
              <Input
                value={builderData.assessmentTitle}
                onChange={(e) => updateBuilderData('assessmentTitle', e.target.value)}
                placeholder="Enter assessment title"
                className="bg-white border-gray-200"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center">
                <BookOpen className="h-4 w-4 mr-1" />
                Subject
              </label>
              <Input
                value={builderData.subject}
                onChange={(e) => updateBuilderData('subject', e.target.value)}
                placeholder="Enter subject"
                className="bg-white border-gray-200"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center">
                <User className="h-4 w-4 mr-1" />
                Class/Grade
              </label>
              <Input
                value={builderData.classGrade}
                onChange={(e) => updateBuilderData('classGrade', e.target.value)}
                placeholder="Enter class or grade"
                className="bg-white border-gray-200"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Duration
              </label>
              <div className="flex space-x-2">
                <Select
                  value={builderData.timeHours}
                  onValueChange={(value) => updateBuilderData('timeHours', value)}
                >
                  <SelectTrigger className="bg-white border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[0, 1, 2, 3, 4, 5].map(hour => (
                      <SelectItem key={hour} value={hour.toString()}>
                        {hour} {hour === 1 ? 'hour' : 'hours'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={builderData.timeMinutes}
                  onValueChange={(value) => updateBuilderData('timeMinutes', value)}
                >
                  <SelectTrigger className="bg-white border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[0, 15, 30, 45].map(minute => (
                      <SelectItem key={minute} value={minute.toString()}>
                        {minute} min
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Exam Date
              </label>
              <Input
                type="date"
                value={builderData.examDate}
                onChange={(e) => updateBuilderData('examDate', e.target.value)}
                className="bg-white border-gray-200"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center">
                <Building className="h-4 w-4 mr-1" />
                School/Institution
              </label>
              <Input
                value={builderData.schoolName}
                onChange={(e) => updateBuilderData('schoolName', e.target.value)}
                placeholder="Enter school name"
                className="bg-white border-gray-200"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">General Instructions</label>
            <Textarea
              value={builderData.generalInstructions}
              onChange={(e) => updateBuilderData('generalInstructions', e.target.value)}
              className="min-h-[80px] bg-white border-gray-200"
              placeholder="Enter general instructions for students"
            />
          </div>
        </CardContent>
      </Card>

      {/* Sections */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <Hash className="h-5 w-5 mr-2 text-indigo-600" />
            Assessment Sections
          </h3>
          <Button
            onClick={addSection}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Section
          </Button>
        </div>

        {builderData.sections.map((section, index) => (
          <Card key={section.id} className="border border-gray-200 bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <GripVertical className="h-5 w-5 text-gray-400 cursor-grab" />
                  <Input
                    value={section.title}
                    onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                    className="font-semibold text-lg bg-transparent border-none p-0 h-auto focus:ring-0"
                    placeholder="Section title"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">
                    {section.questions.length} questions
                  </Badge>
                  <Badge variant="outline">
                    {section.questions.reduce((sum, q) => sum + q.marks, 0)} marks
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSection(section.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    disabled={builderData.sections.length <= 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Section Instructions</label>
                <Textarea
                  value={section.instructions}
                  onChange={(e) => updateSection(section.id, 'instructions', e.target.value)}
                  className="min-h-[60px] bg-gray-50 border-gray-200"
                  placeholder="Instructions for this section"
                />
              </div>

              {/* Questions in Section */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-700 mb-2">Questions</div>
                {section.questions.length > 0 ? (
                  <div className="space-y-2">
                    {section.questions.map((question, qIndex) => (
                      <div
                        key={question.id}
                        className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <span className="text-sm font-medium text-gray-600 mt-1">
                          {qIndex + 1}.
                        </span>
                        <div className="flex-1">
                          <p className="text-sm text-gray-700 mb-2 line-clamp-2">
                            {question.question}
                          </p>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {question.itemType}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {question.bloomsLevel}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {question.marks} marks
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                    <p className="text-gray-500 text-sm">No questions in this section</p>
                    <p className="text-gray-400 text-xs mt-1">Drag questions here from other sections</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary */}
      <Card className="border border-indigo-200 bg-indigo-50">
        <CardHeader>
          <CardTitle className="text-lg text-indigo-800">Assessment Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">
                {items.length}
              </div>
              <div className="text-sm text-indigo-700">Total Questions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">
                {builderData.totalMarks}
              </div>
              <div className="text-sm text-indigo-700">Total Marks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">
                {builderData.sections.length}
              </div>
              <div className="text-sm text-indigo-700">Sections</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">
                {builderData.timeHours}h {builderData.timeMinutes}m
              </div>
              <div className="text-sm text-indigo-700">Duration</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={saveAssessmentStructure}
          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Assessment Structure
        </Button>
      </div>
    </div>
  );
};