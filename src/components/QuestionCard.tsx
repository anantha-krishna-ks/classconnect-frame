import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Edit, Trash2, Eye, Expand } from 'lucide-react';

interface GeneratedItem {
  id: string;
  question: string;
  itemType: string;
  eloName: string;
  bloomsLevel: string;
  options?: string[];
  answer?: string;
  context?: string;
}

interface QuestionCardProps {
  item: GeneratedItem;
  index: number;
  eloId: string;
  onEdit: (eloId: string, itemId: string, updatedItem: Partial<GeneratedItem>) => void;
  onDelete: (eloId: string, itemId: string) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ item, index, eloId, onEdit, onDelete }) => {
  const [isSelected, setIsSelected] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState(item.question);
  const [editedOptions, setEditedOptions] = useState<string[]>(item.options ? [...item.options] : []);
  const [editedAnswer, setEditedAnswer] = useState(item.answer || "");
  const [editedContext, setEditedContext] = useState(item.context || "");
  const [editError, setEditError] = useState<string>("");

  // Reset local edit state when dialog is opened
  React.useEffect(() => {
    if (isEditOpen) {
      setEditedQuestion(item.question);
      setEditedOptions(item.options ? [...item.options] : []);
      setEditedAnswer(item.answer || "");
      setEditedContext(item.context || "");
      setEditError("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditOpen]);

  const getTypeColor = (type: string) => {
    const colors = {
      'mcq': 'bg-blue-100 text-blue-800 border-blue-200',
      'fill-blank': 'bg-green-100 text-green-800 border-green-200',
      'short-description': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'long-description': 'bg-purple-100 text-purple-800 border-purple-200',
      'open-ended': 'bg-pink-100 text-pink-800 border-pink-200',
      'case-study': 'bg-indigo-100 text-indigo-800 border-indigo-200'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const renderPreviewContent = () => {
    switch (item.itemType) {
      case 'mcq': {
        // Use backend options if present, else fallback to old logic
        const options = item.options && item.options.length > 0
          ? item.options
          : [
              'A) Option A',
              'B) Option B',
              'C) Option C',
              'D) Option D'
            ];
        return (
          <div className="space-y-4">
            <div className="font-medium">{item.question}</div>
            <div className="space-y-2">
              {options.map((option, idx) => (
                <div
                  key={idx}
                  className="flex flex-row items-start gap-2 pl-2 py-1"
                >
                  <span className="font-semibold w-6 min-w-[1.5rem] text-right">{String.fromCharCode(65 + idx)}:</span>
                  <span className="flex-1 break-words">{option}</span>
                </div>
              ))}
            </div>
            {item.answer && (
              <div className="text-sm text-green-700 mt-2">
                <strong>Answer:</strong> {item.answer}
              </div>
            )}
          </div>
        );
      }
      case 'fill-blank': {
        // Use backend answer if present
        const answer = item.answer || '';
        return (
          <div className="space-y-4">
            <div className="font-medium">{item.question}</div>
            <div className="border-b-2 border-gray-300 inline-block min-w-[200px] pb-1">
              <span className="text-transparent">{answer}</span>
            </div>
            {answer && (
              <div className="text-sm text-green-700 mt-2">
                <strong>Answer:</strong> {answer}
              </div>
            )}
          </div>
        );
      }
      case 'case-study': {
        // Use backend context if present
        const context = item.context || '';
        return (
          <div className="space-y-4">
            {context && (
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Case Study</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  {context}
                </p>
              </div>
            )}
            <div className="font-medium">{item.question}</div>
            {/* Do NOT show answer for case-study */}
          </div>
        );
      }
      case 'short-description':
      case 'long-description':
      case 'open-ended':
        return (
          <div className="space-y-4">
            <div className="font-medium">{item.question}</div>
            {/* Do NOT show answer for these types */}
            <div className="border rounded-lg p-4 bg-muted/30">
              <span className="text-muted-foreground text-sm">Answer space</span>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-4">
            <div className="font-medium">{item.question}</div>
            {item.answer && (
              <div className="text-sm text-green-700 mt-2">
                <strong>Answer:</strong> {item.answer}
              </div>
            )}
            <div className="border rounded-lg p-4 bg-muted/30">
              <span className="text-muted-foreground text-sm">Answer space</span>
            </div>
          </div>
        );
    }
  };

  const handleSaveEdit = () => {
    // Validation
    if (!editedQuestion.trim()) {
      setEditError("Question cannot be empty.");
      return;
    }
    if (item.itemType === "mcq") {
      if (editedOptions.length < 2 || editedOptions.some(opt => !opt.trim())) {
        setEditError("All MCQ options must be filled (minimum 2).");
        return;
      }
      if (!editedAnswer.trim() || !editedOptions.map(opt => opt.trim()).includes(editedAnswer.trim())) {
        setEditError("Answer must match one of the options.");
        return;
      }
    }
    if (item.itemType === "fill-blank" && !editedAnswer.trim()) {
      setEditError("Answer cannot be empty for fill in the blank.");
      return;
    }
    // No error, proceed
    setEditError("");
    const updatedItem: Partial<GeneratedItem> = {
      question: editedQuestion,
      answer: editedAnswer,
      context: editedContext,
    };
    if (item.itemType === "mcq") {
      updatedItem.options = editedOptions;
    }
    onEdit(eloId, item.id, updatedItem);
    setIsEditOpen(false);
  };

  return (
    <>
      <Card className={`border-l-4 transition-all duration-200 hover:shadow-md ${isSelected ? 'border-l-primary bg-primary/5' : 'border-l-muted'}`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {/* Checkbox */}
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked) => setIsSelected(checked === true)}
              className="mt-1"
            />
            
            {/* Question Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      {index + 1}.
                    </span>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getTypeColor(item.itemType)}`}
                    >
                      {item.itemType.replace('-', ' ').toUpperCase()}
                    </Badge>
                    <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800">
                      {item.bloomsLevel}
                    </Badge>
                  </div>
                  
                  <p className="text-foreground leading-relaxed mb-3">
                    {item.question}
                  </p>
                  
                  
                </div>
                
                <div className="flex gap-1 flex-shrink-0">
                 {/* Preview Button with Tooltip */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setIsPreviewOpen(true)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Preview question</p>
                    </TooltipContent>
                  </Tooltip>
                  <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Question Preview</DialogTitle>
                      </DialogHeader>
                      <div className="py-4">
                        {renderPreviewContent()}
                      </div>
                    </DialogContent>
                  </Dialog>
                    
                    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit question</p>
                        </TooltipContent>
                      </Tooltip>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Edit Question</DialogTitle>
                        </DialogHeader>
                        <div className="py-4 space-y-4">
                          <div>
                            <Label htmlFor="question">Question</Label>
                            <Textarea
                              id="question"
                              value={editedQuestion}
                              onChange={(e) => setEditedQuestion(e.target.value)}
                              className="mt-1"
                              rows={4}
                            />
                          </div>
                          
                           {item.itemType === 'mcq' && (
                             <div className="space-y-3">
                               <Label>Options</Label>
                               {Array.isArray(editedOptions) && editedOptions.length > 0 ? (
                                 editedOptions.map((option, idx) => (
                                   <div key={idx} className="flex items-center gap-2">
                                     <span className="text-sm font-medium w-6">{String.fromCharCode(65 + idx)}:</span>
                                     <Input
                                       value={option}
                                       onChange={e => {
                                         const newOptions = [...editedOptions];
                                         newOptions[idx] = e.target.value;
                                         setEditedOptions(newOptions);
                                       }}
                                     />
                                   </div>
                                 ))
                               ) : (
                                 ['A', 'B', 'C', 'D'].map((option, idx) => (
                                   <div key={option} className="flex items-center gap-2">
                                     <span className="text-sm font-medium w-6">{option}:</span>
                                     <Input
                                       placeholder={`Option ${option}`}
                                       value={editedOptions[idx] || ""}
                                       onChange={e => {
                                         const newOptions = [...editedOptions];
                                         newOptions[idx] = e.target.value;
                                         setEditedOptions(newOptions);
                                       }}
                                     />
                                   </div>
                                 ))
                               )}
                             </div>
                           )}

                          {/* Editable answer for MCQ and fill-blank only */}
                          {(item.itemType === "mcq" || item.itemType === "fill-blank") && (
                            <div>
                              <Label htmlFor="answer">Answer</Label>
                              <Input
                                id="answer"
                                value={editedAnswer}
                                onChange={e => setEditedAnswer(e.target.value)}
                                className="mt-1"
                              />
                            </div>
                          )}

                          {/* Editable context for case-study */}
                          {item.itemType === "case-study" && (
                            <div>
                              <Label htmlFor="context">Context</Label>
                              <Textarea
                                id="context"
                                value={editedContext}
                                onChange={e => setEditedContext(e.target.value)}
                                className="mt-1"
                                rows={3}
                              />
                            </div>
                          )}

                          {editError && (
                            <div className="text-red-500 text-sm pb-2">{editError}</div>
                          )}
                          <div className="flex justify-end gap-2 pt-4">
                            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                              Cancel
                            </Button>
                            <Button
                              onClick={handleSaveEdit}
                            >
                              Save Changes
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          onClick={() => onDelete(eloId, item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete question</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default QuestionCard;
