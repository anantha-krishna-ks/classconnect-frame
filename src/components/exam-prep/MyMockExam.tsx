import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Clock, FileText, Upload, CheckCircle, ChevronDown, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { useToast } from '@/hooks/use-toast';
import MockExamDisplay from '@/components/exam-prep/MockExamDisplay';
import { examPrepData } from '@/data/examPrepData';

const MyMockExam = () => {
  const { toast } = useToast();
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const [timeLimit, setTimeLimit] = useState('');
  const [generatedExam, setGeneratedExam] = useState<any>(null);
  const [uploadedAnswers, setUploadedAnswers] = useState(false);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [chapterDropdownOpen, setChapterDropdownOpen] = useState(false);

  const subjects = examPrepData.subjects;
  const chapters = selectedSubject ? examPrepData.chapters[selectedSubject] || [] : [];

  const handleChapterSelect = (chapterId: string) => {
    setSelectedChapters(prev => 
      prev.includes(chapterId) 
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  const generateMockExam = () => {
    if (!selectedSubject || selectedChapters.length === 0 || !timeLimit) {
      toast({
        title: "Missing Information",
        description: "Please select subject, chapters, and time duration.",
        variant: "destructive"
      });
      return;
    }

    // Generate mock exam based on selected chapters
    const exam = {
      id: Date.now().toString(),
      subject: subjects.find(s => s.id === selectedSubject)?.name || '',
      chapters: selectedChapters.map(chId => chapters.find(ch => ch.id === chId)?.name).join(', '),
      timeLimit: parseInt(timeLimit),
      sections: {
        A: examPrepData.mockExamQuestions.sectionA.slice(0, 5),
        B: examPrepData.mockExamQuestions.sectionB.slice(0, 4),
        C: examPrepData.mockExamQuestions.sectionC.slice(0, 3),
        D: examPrepData.mockExamQuestions.sectionD.slice(0, 2)
      },
      totalMarks: 100,
      createdAt: new Date().toLocaleString()
    };

    setGeneratedExam(exam);
    toast({
      title: "Mock Exam Generated!",
      description: "Your practice exam has been created successfully.",
    });
  };

  const handleFileUpload = () => {
    setUploadedAnswers(true);
    toast({
      title: "Answer Sheet Uploaded",
      description: "Your answer sheet has been uploaded successfully.",
    });
  };

  const evaluateAnswers = () => {
    setShowEvaluation(true);
    toast({
      title: "Evaluation Complete",
      description: "Your exam has been evaluated with detailed feedback.",
    });
  };

  if (generatedExam) {
    return (
      <MockExamDisplay 
        exam={generatedExam}
        uploadedAnswers={uploadedAnswers}
        showEvaluation={showEvaluation}
        onUpload={handleFileUpload}
        onEvaluate={evaluateAnswers}
        onBack={() => setGeneratedExam(null)}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Mock Exam</CardTitle>
        <CardDescription>
          Generate full-length mock exams with structured sections A, B, C, and D
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Subject Selection */}
        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger>
              <SelectValue placeholder="Select a subject" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Chapter Selection */}
        {selectedSubject && (
          <div className="space-y-2">
            <Label>Chapters (Select multiple)</Label>
            <Popover open={chapterDropdownOpen} onOpenChange={setChapterDropdownOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={chapterDropdownOpen}
                  className="w-full justify-between min-h-12 p-3"
                >
                  <div className="flex flex-wrap gap-1 flex-1 items-center">
                    {selectedChapters.length === 0 ? (
                      <span className="text-muted-foreground">Select chapters...</span>
                    ) : (
                      selectedChapters.map((chapterId) => {
                        const chapter = chapters.find(ch => ch.id === chapterId);
                        return (
                          <Badge
                            key={chapterId}
                            variant="secondary"
                            className="flex items-center gap-1 px-2 py-1"
                          >
                            {chapter?.name}
                            <X
                              className="h-3 w-3 cursor-pointer hover:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleChapterSelect(chapterId);
                              }}
                            />
                          </Badge>
                        );
                      })
                    )}
                  </div>
                  <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0 bg-background z-50" align="start">
                <Command>
                  <CommandInput placeholder="Search chapters..." className="h-9" />
                  <CommandEmpty>No chapters found.</CommandEmpty>
                  <CommandList>
                    <CommandGroup className="max-h-64 overflow-auto">
                      {chapters.map((chapter) => (
                        <CommandItem
                          key={chapter.id}
                          value={chapter.name}
                          onSelect={() => handleChapterSelect(chapter.id)}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <Checkbox
                            checked={selectedChapters.includes(chapter.id)}
                            className="pointer-events-none"
                          />
                          <span className="flex-1">{chapter.name}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        )}

        {/* Time Selection */}
        <div className="space-y-2">
          <Label htmlFor="time">Exam Duration</Label>
          <Select value={timeLimit} onValueChange={setTimeLimit}>
            <SelectTrigger>
              <SelectValue placeholder="Select exam duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="80">80 minutes</SelectItem>
              <SelectItem value="90">90 minutes</SelectItem>
              <SelectItem value="120">120 minutes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Selected Items Display */}
        {selectedChapters.length > 0 && (
          <div className="space-y-2">
            <Label>Selected Chapters</Label>
            <div className="flex flex-wrap gap-1">
              {selectedChapters.map(chapterId => {
                const chapter = chapters.find(ch => ch.id === chapterId);
                return (
                  <Badge key={chapterId} variant="secondary">
                    {chapter?.name}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}

        {/* Exam Info */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <h4 className="font-medium">Mock Exam Structure:</h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <div>• Section A: Multiple Choice Questions (20 marks)</div>
            <div>• Section B: Short Answer Questions (30 marks)</div>
            <div>• Section C: Long Answer Questions (30 marks)</div>
            <div>• Section D: Application Based Questions (20 marks)</div>
            <div className="font-medium text-foreground">Total: 100 marks</div>
          </div>
        </div>

        {/* Generate Mock Exam Button */}
        <Button 
          onClick={generateMockExam}
          className="w-full"
          disabled={!selectedSubject || selectedChapters.length === 0 || !timeLimit}
        >
          <Clock className="w-4 h-4 mr-2" />
          Generate Mock Exam
        </Button>
      </CardContent>
    </Card>
  );
};

export default MyMockExam;