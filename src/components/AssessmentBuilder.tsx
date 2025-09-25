import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft, Save, Download, FileText, Plus, GripVertical, Minus
} from 'lucide-react';
import { toast } from 'sonner';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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

interface SubQuestion {
  id: string;
  text: string;
  marks: number;
  numberingStyle: 'numeric' | 'alpha' | 'roman' | 'custom';
  customLabel?: string;
}

interface QuestionCard {
  id: string;
  questionText: string;
  marks: number;
  subQuestions: SubQuestion[];
  originalItem?: GeneratedItem;
}

interface AssessmentSection {
  id: string;
  title: string;
  questions: QuestionCard[];
}

interface AssessmentBuilderData {
  generalInstructions: string;
  totalMarks: number;
  totalTime: number;
  mainNumbering: 'continuous' | 'reset-per-section';
  sections: AssessmentSection[];
}

interface AssessmentBuilderProps {
  selectedItems: GeneratedItem[];
  onBack: () => void;
}

const AssessmentBuilder = ({ selectedItems, onBack }: AssessmentBuilderProps) => {
  const [assessmentData, setAssessmentData] = useState<AssessmentBuilderData>({
    generalInstructions: 'Read all questions carefully before attempting. Write your answers clearly and legibly.',
    totalMarks: selectedItems.reduce((sum, item) => sum + item.marks, 0),
    totalTime: 120,
    mainNumbering: 'continuous',
    sections: [
      {
        id: 'section-1',
        title: 'SECTION - A',
        questions: selectedItems.map(item => ({
          id: `question-${item.id}`,
          questionText: item.question,
          marks: item.marks,
          subQuestions: [],
          originalItem: item
        }))
      }
    ]
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Helper functions
  const addSection = () => {
    const newSection: AssessmentSection = {
      id: `section-${Date.now()}`,
      title: `SECTION - ${String.fromCharCode(65 + assessmentData.sections.length)}`,
      questions: []
    };
    setAssessmentData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  };

  const updateSectionTitle = (sectionId: string, title: string) => {
    setAssessmentData(prev => ({
      ...prev,
      sections: prev.sections.map(section => 
        section.id === sectionId ? { ...section, title } : section
      )
    }));
  };

  const addQuestionToSection = (sectionId: string) => {
    const newQuestion: QuestionCard = {
      id: `question-${Date.now()}`,
      questionText: 'Enter your question here...',
      marks: 1,
      subQuestions: []
    };
    
    setAssessmentData(prev => ({
      ...prev,
      sections: prev.sections.map(section => 
        section.id === sectionId 
          ? { ...section, questions: [...section.questions, newQuestion] }
          : section
      )
    }));
  };

  const updateQuestion = (sectionId: string, questionId: string, updates: Partial<QuestionCard>) => {
    setAssessmentData(prev => ({
      ...prev,
      sections: prev.sections.map(section => 
        section.id === sectionId 
          ? {
              ...section,
              questions: section.questions.map(q => 
                q.id === questionId ? { ...q, ...updates } : q
              )
            }
          : section
      )
    }));
  };

  const addSubQuestion = (sectionId: string, questionId: string) => {
    const newSubQuestion: SubQuestion = {
      id: `sub-${Date.now()}`,
      text: 'Enter sub-question...',
      marks: 1,
      numberingStyle: 'alpha'
    };

    setAssessmentData(prev => ({
      ...prev,
      sections: prev.sections.map(section => 
        section.id === sectionId 
          ? {
              ...section,
              questions: section.questions.map(q => 
                q.id === questionId 
                  ? { ...q, subQuestions: [...q.subQuestions, newSubQuestion] }
                  : q
              )
            }
          : section
      )
    }));
  };

  const updateSubQuestion = (sectionId: string, questionId: string, subQuestionId: string, updates: Partial<SubQuestion>) => {
    setAssessmentData(prev => ({
      ...prev,
      sections: prev.sections.map(section => 
        section.id === sectionId 
          ? {
              ...section,
              questions: section.questions.map(q => 
                q.id === questionId 
                  ? {
                      ...q,
                      subQuestions: q.subQuestions.map(sub => 
                        sub.id === subQuestionId ? { ...sub, ...updates } : sub
                      )
                    }
                  : q
              )
            }
          : section
      )
    }));
  };

  const removeSubQuestion = (sectionId: string, questionId: string, subQuestionId: string) => {
    setAssessmentData(prev => ({
      ...prev,
      sections: prev.sections.map(section => 
        section.id === sectionId 
          ? {
              ...section,
              questions: section.questions.map(q => 
                q.id === questionId 
                  ? { ...q, subQuestions: q.subQuestions.filter(sub => sub.id !== subQuestionId) }
                  : q
              )
            }
          : section
      )
    }));
  };

  const calculateTotalMarks = () => {
    return assessmentData.sections.reduce((total, section) => {
      return total + section.questions.reduce((sectionTotal, question) => {
        const subTotal = question.subQuestions.reduce((subSum, sub) => subSum + sub.marks, 0);
        return sectionTotal + question.marks + subTotal;
      }, 0);
    }, 0);
  };

  const getSectionTotal = (section: AssessmentSection) => {
    return section.questions.reduce((total, question) => {
      const subTotal = question.subQuestions.reduce((subSum, sub) => subSum + sub.marks, 0);
      return total + question.marks + subTotal;
    }, 0);
  };

  const getSubQuestionNumber = (subQuestion: SubQuestion, index: number) => {
    switch (subQuestion.numberingStyle) {
      case 'numeric':
        return `${index + 1}.`;
      case 'alpha':
        return `${String.fromCharCode(97 + index)}.`;
      case 'roman':
        const romanNumerals = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'];
        return `${romanNumerals[index] || index + 1}.`;
      case 'custom':
        return subQuestion.customLabel || `${index + 1}.`;
      default:
        return `${index + 1}.`;
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const activeSectionId = active.data.current?.sectionId;
    const overSectionId = over.data.current?.sectionId;
    
    if (activeSectionId && overSectionId && activeSectionId === overSectionId) {
      setAssessmentData(prev => ({
        ...prev,
        sections: prev.sections.map(section => {
          if (section.id === activeSectionId) {
            const oldIndex = section.questions.findIndex(q => q.id === active.id);
            const newIndex = section.questions.findIndex(q => q.id === over.id);
            
            return {
              ...section,
              questions: arrayMove(section.questions, oldIndex, newIndex)
            };
          }
          return section;
        })
      }));
    }
  };

  // Sortable Question Card Component
  const SortableQuestionCard = ({ question, sectionId, index }: { question: QuestionCard, sectionId: string, index: number }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
    } = useSortable({ 
      id: question.id,
      data: { sectionId }
    });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <Card ref={setNodeRef} style={style} className="mb-4 border-l-4 border-l-primary">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Drag Handle */}
            <button
              {...attributes}
              {...listeners}
              className="mt-1 p-1 hover:bg-muted rounded cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </button>

            <div className="flex-1 space-y-3">
              {/* Question Number and Text */}
              <div className="flex items-start gap-3">
                <span className="font-semibold text-primary min-w-8">
                  {assessmentData.mainNumbering === 'continuous' 
                    ? `${assessmentData.sections.reduce((total, section, sIndex) => 
                        sIndex < assessmentData.sections.findIndex(s => s.id === sectionId) 
                          ? total + section.questions.length 
                          : total, 0) + index + 1}.`
                    : `${index + 1}.`
                  }
                </span>
                <div className="flex-1">
                  <Textarea
                    value={question.questionText}
                    onChange={(e) => updateQuestion(sectionId, question.id, { questionText: e.target.value })}
                    className="min-h-16 border-none p-0 resize-none focus:ring-0"
                    placeholder="Enter your question here..."
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={question.marks}
                    onChange={(e) => updateQuestion(sectionId, question.id, { marks: parseInt(e.target.value) || 0 })}
                    className="w-16 text-center"
                    min="0"
                  />
                  <span className="text-sm text-muted-foreground">marks</span>
                </div>
              </div>

              {/* Sub-questions */}
              {question.subQuestions.length > 0 && (
                <div className="ml-8 space-y-2 border-l-2 border-muted pl-4">
                  {question.subQuestions.map((subQ, subIndex) => (
                    <div key={subQ.id} className="flex items-start gap-3">
                      <span className="font-medium text-sm min-w-8">
                        {getSubQuestionNumber(subQ, subIndex)}
                      </span>
                      <div className="flex-1">
                        <Textarea
                          value={subQ.text}
                          onChange={(e) => updateSubQuestion(sectionId, question.id, subQ.id, { text: e.target.value })}
                          className="min-h-12 border-none p-0 resize-none text-sm focus:ring-0"
                          placeholder="Enter sub-question..."
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Select
                          value={subQ.numberingStyle}
                          onValueChange={(value) => updateSubQuestion(sectionId, question.id, subQ.id, { numberingStyle: value as SubQuestion['numberingStyle'] })}
                        >
                          <SelectTrigger className="w-24 h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="numeric">1, 2, 3</SelectItem>
                            <SelectItem value="alpha">a, b, c</SelectItem>
                            <SelectItem value="roman">i, ii, iii</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                        {subQ.numberingStyle === 'custom' && (
                          <Input
                            value={subQ.customLabel || ''}
                            onChange={(e) => updateSubQuestion(sectionId, question.id, subQ.id, { customLabel: e.target.value })}
                            className="w-16 h-8 text-xs"
                            placeholder="Label"
                          />
                        )}
                        <Input
                          type="number"
                          value={subQ.marks}
                          onChange={(e) => updateSubQuestion(sectionId, question.id, subQ.id, { marks: parseInt(e.target.value) || 0 })}
                          className="w-12 h-8 text-center text-xs"
                          min="0"
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeSubQuestion(sectionId, question.id, subQ.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Sub-question Button */}
              <Button
                size="sm"
                variant="outline"
                onClick={() => addSubQuestion(sectionId, question.id)}
                className="ml-8 h-8 text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Sub-question
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const handleSave = () => {
    toast.success('Assessment saved successfully!');
  };

  const handleExportPDF = () => {
    toast.info('Exporting as PDF...');
  };

  const handleExportQTI = () => {
    toast.info('Exporting as QTI...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Items
          </Button>
          
          <h1 className="text-2xl font-bold text-gray-800">Assessment Builder</h1>
          <div className="w-24" />
        </div>

        {/* Top Controls */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Total Marks:</label>
                  <Input
                    type="number"
                    value={calculateTotalMarks()}
                    readOnly
                    className="w-20 text-center bg-muted"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Total Time:</label>
                  <Input
                    type="number"
                    value={assessmentData.totalTime}
                    onChange={(e) => setAssessmentData(prev => ({ ...prev, totalTime: parseInt(e.target.value) || 0 }))}
                    className="w-20 text-center"
                  />
                  <span className="text-sm text-muted-foreground">minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Numbering:</label>
                  <Select
                    value={assessmentData.mainNumbering}
                    onValueChange={(value) => setAssessmentData(prev => ({ ...prev, mainNumbering: value as 'continuous' | 'reset-per-section' }))}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="continuous">Continuous Numbering</SelectItem>
                      <SelectItem value="reset-per-section">Reset per Section</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button onClick={handleExportPDF} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export as PDF
                </Button>
                <Button onClick={handleExportQTI} variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Export as QTI
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* General Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>General Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={assessmentData.generalInstructions}
              onChange={(e) => setAssessmentData(prev => ({ ...prev, generalInstructions: e.target.value }))}
              className="min-h-20"
              placeholder="Enter general instructions for the assessment..."
            />
          </CardContent>
        </Card>

        {/* Assessment Sections */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          {assessmentData.sections.map((section, sectionIndex) => (
            <Card key={section.id} className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <Input
                    value={section.title}
                    onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                    className="text-xl font-bold border-none p-0 focus:ring-0 bg-transparent"
                    placeholder="Section Title"
                  />
                  <div className="text-right">
                    <p className="text-lg font-semibold text-primary">
                      Total: {getSectionTotal(section)} marks
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <SortableContext items={section.questions.map(q => q.id)} strategy={verticalListSortingStrategy}>
                  {section.questions.map((question, index) => (
                    <SortableQuestionCard
                      key={question.id}
                      question={question}
                      sectionId={section.id}
                      index={index}
                    />
                  ))}
                </SortableContext>
                
                <Button
                  variant="outline"
                  onClick={() => addQuestionToSection(section.id)}
                  className="w-full border-dashed"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
                </Button>
              </CardContent>
            </Card>
          ))}
        </DndContext>

        {/* Add Section Button */}
        <div className="text-center">
          <Button
            onClick={addSection}
            variant="outline"
            size="lg"
            className="border-dashed"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Section
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentBuilder;