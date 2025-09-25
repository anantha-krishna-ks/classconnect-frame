import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Upload, FileText, CheckCircle, ChevronDown, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import QuizDisplay from '@/components/exam-prep/QuizDisplay';
import { examPrepData } from '@/data/examPrepData';

const CreateQuiz = () => {
  const { toast } = useToast();
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const [selectedConcepts, setSelectedConcepts] = useState<string[]>([]);
  const [isTimedQuiz, setIsTimedQuiz] = useState(false);
  const [timeLimit, setTimeLimit] = useState('');
  const [generatedQuiz, setGeneratedQuiz] = useState<any>(null);
  const [uploadedAnswers, setUploadedAnswers] = useState(false);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [chapterDropdownOpen, setChapterDropdownOpen] = useState(false);
  const [conceptDropdownOpen, setConceptDropdownOpen] = useState(false);

  const subjects = examPrepData.subjects;
  const chapters = selectedSubject ? examPrepData.chapters[selectedSubject] || [] : [];
  const concepts = selectedChapters.length > 0 
    ? selectedChapters.flatMap(chapter => examPrepData.concepts[chapter] || [])
    : [];

  const handleChapterSelect = (chapterId: string) => {
    setSelectedChapters(prev => 
      prev.includes(chapterId) 
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId]
    );
    setSelectedConcepts([]); // Reset concepts when chapters change
  };

  const handleConceptSelect = (conceptId: string) => {
    setSelectedConcepts(prev => 
      prev.includes(conceptId) 
        ? prev.filter(id => id !== conceptId)
        : [...prev, conceptId]
    );
  };

  const generateQuiz = () => {
    if (!selectedSubject || selectedChapters.length === 0 || selectedConcepts.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please select subject, chapters, and concepts to generate quiz.",
        variant: "destructive"
      });
      return;
    }

    // Generate quiz based on selected concepts
    const quiz = {
      id: Date.now().toString(),
      subject: subjects.find(s => s.id === selectedSubject)?.name || '',
      chapters: selectedChapters.map(chId => chapters.find(ch => ch.id === chId)?.name).join(', '),
      concepts: selectedConcepts.map(cId => concepts.find(c => c.id === cId)?.name).join(', '),
      timeLimit: isTimedQuiz ? timeLimit : null,
      questions: examPrepData.sampleQuestions.slice(0, 5), // Take first 5 questions as sample
      totalMarks: 50,
      createdAt: new Date().toLocaleString()
    };

    setGeneratedQuiz(quiz);
    toast({
      title: "Quiz Generated!",
      description: "Your practice quiz has been created successfully.",
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
      description: "Your answers have been evaluated with detailed feedback.",
    });
  };

  if (generatedQuiz) {
    return (
      <QuizDisplay 
        quiz={generatedQuiz}
        uploadedAnswers={uploadedAnswers}
        showEvaluation={showEvaluation}
        onUpload={handleFileUpload}
        onEvaluate={evaluateAnswers}
        onBack={() => setGeneratedQuiz(null)}
      />
    );
  }

  return (
    <Card className="bg-gradient-to-br from-background/80 to-muted/30 backdrop-blur-sm border-2 shadow-lg">
      <CardHeader>
        <CardTitle>Create Practice Quiz</CardTitle>
        <CardDescription>
          Generate customized quizzes based on specific concepts and chapters
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
              <PopoverContent className="w-full p-0" align="start">
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

        {/* Concept Selection */}
        {selectedChapters.length > 0 && (
          <div className="space-y-2">
            <Label>Concepts/Topics (Select multiple)</Label>
            <Popover open={conceptDropdownOpen} onOpenChange={setConceptDropdownOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={conceptDropdownOpen}
                  className="w-full justify-between min-h-12 p-3"
                >
                  <div className="flex flex-wrap gap-1 flex-1 items-center">
                    {selectedConcepts.length === 0 ? (
                      <span className="text-muted-foreground">Select concepts...</span>
                    ) : (
                      selectedConcepts.map((conceptId) => {
                        const concept = concepts.find(c => c.id === conceptId);
                        return (
                          <Badge
                            key={conceptId}
                            variant="outline"
                            className="flex items-center gap-1 px-2 py-1"
                          >
                            {concept?.name}
                            <X
                              className="h-3 w-3 cursor-pointer hover:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleConceptSelect(conceptId);
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
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search concepts..." className="h-9" />
                  <CommandEmpty>No concepts found.</CommandEmpty>
                  <CommandList>
                    <CommandGroup className="max-h-64 overflow-auto">
                      {concepts.map((concept) => (
                        <CommandItem
                          key={concept.id}
                          value={concept.name}
                          onSelect={() => handleConceptSelect(concept.id)}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <Checkbox
                            checked={selectedConcepts.includes(concept.id)}
                            className="pointer-events-none"
                          />
                          <span className="flex-1">{concept.name}</span>
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
        <div className="space-y-4 p-4 bg-muted/30 border border-border rounded-lg">
          <div className="flex items-center space-x-3">
            <Checkbox
              id="timed-quiz"
              checked={isTimedQuiz}
              onCheckedChange={(checked) => setIsTimedQuiz(checked as boolean)}
            />
            <Label htmlFor="timed-quiz" className="font-medium cursor-pointer">Set time limit for quiz</Label>
          </div>
          
          {isTimedQuiz && (
            <Select value={timeLimit} onValueChange={setTimeLimit}>
              <SelectTrigger>
                <SelectValue placeholder="Select time duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="40">40 minutes</SelectItem>
                <SelectItem value="80">80 minutes</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Selected Items Display */}
        {(selectedChapters.length > 0 || selectedConcepts.length > 0) && (
          <div className="space-y-2">
            <Label>Selected Items</Label>
            <div className="space-y-2">
              {selectedChapters.length > 0 && (
                <div>
                  <span className="text-sm text-muted-foreground">Chapters: </span>
                  <div className="flex flex-wrap gap-1 mt-1">
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
              {selectedConcepts.length > 0 && (
                <div>
                  <span className="text-sm text-muted-foreground">Concepts: </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedConcepts.map(conceptId => {
                      const concept = concepts.find(c => c.id === conceptId);
                      return (
                        <Badge key={conceptId} variant="outline">
                          {concept?.name}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Generate Quiz Button */}
        <Button 
          onClick={generateQuiz}
          className="w-full"
          disabled={!selectedSubject || selectedChapters.length === 0 || selectedConcepts.length === 0}
        >
          <FileText className="w-4 h-4 mr-2" />
          Generate Quiz
        </Button>
      </CardContent>
    </Card>
  );
};

export default CreateQuiz;