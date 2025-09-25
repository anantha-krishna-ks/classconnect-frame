import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Upload, FileText, CheckCircle, X, Search, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import QuizDisplay from '@/components/exam-prep/QuizDisplay';
import { examPrepData } from '@/data/examPrepData';

const CreateQuiz = () => {
  const { toast } = useToast();
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const [selectedConcepts, setSelectedConcepts] = useState<string[]>([]);
  const [chapterSearch, setChapterSearch] = useState('');
  const [conceptSearch, setConceptSearch] = useState('');
  const [chapterDropdownOpen, setChapterDropdownOpen] = useState(false);
  const [conceptDropdownOpen, setConceptDropdownOpen] = useState(false);
  const [isTimedQuiz, setIsTimedQuiz] = useState(false);
  const [timeLimit, setTimeLimit] = useState('');
  const [generatedQuiz, setGeneratedQuiz] = useState<any>(null);
  const [uploadedAnswers, setUploadedAnswers] = useState(false);
  const [showEvaluation, setShowEvaluation] = useState(false);

  const subjects = examPrepData.subjects;
  const chapters = selectedSubject ? examPrepData.chapters[selectedSubject] || [] : [];
  const concepts = selectedChapters.length > 0 
    ? selectedChapters.flatMap(chapter => examPrepData.concepts[chapter] || [])
    : [];
  
  const filteredChapters = chapters.filter(chapter => 
    chapter.name.toLowerCase().includes(chapterSearch.toLowerCase())
  );
  
  const filteredConcepts = concepts.filter(concept => 
    concept.name.toLowerCase().includes(conceptSearch.toLowerCase())
  );

  const handleChapterSelect = (chapterId: string) => {
    setSelectedChapters(prev => 
      prev.includes(chapterId) 
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId]
    );
    setSelectedConcepts([]); // Reset concepts when chapters change
  };

  const removeChapter = (chapterId: string) => {
    setSelectedChapters(prev => prev.filter(id => id !== chapterId));
    setSelectedConcepts([]);
  };

  const handleConceptSelect = (conceptId: string) => {
    setSelectedConcepts(prev => 
      prev.includes(conceptId) 
        ? prev.filter(id => id !== conceptId)
        : [...prev, conceptId]
    );
  };

  const removeConcept = (conceptId: string) => {
    setSelectedConcepts(prev => prev.filter(id => id !== conceptId));
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
    <Card>
      <CardHeader>
        <CardTitle>Create Practice Quiz</CardTitle>
        <CardDescription>
          Generate customized quizzes based on specific concepts and chapters
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 bg-muted/20 rounded-lg p-6">
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
          <div className="space-y-3">
            <Label>Chapters (Select multiple)</Label>
            
            <Popover open={chapterDropdownOpen} onOpenChange={setChapterDropdownOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={chapterDropdownOpen}
                  className="w-full justify-between h-auto min-h-10 p-3"
                >
                  <div className="flex flex-wrap gap-1 flex-1 items-center">
                    {selectedChapters.length === 0 ? (
                      <span className="text-muted-foreground">Select chapters...</span>
                    ) : (
                      <>
                        {selectedChapters.slice(0, 2).map(chapterId => {
                          const chapter = chapters.find(ch => ch.id === chapterId);
                          return (
                            <Badge key={chapterId} variant="secondary" className="flex items-center gap-1 px-2 py-0">
                              {chapter?.name}
                              <X 
                                className="w-3 h-3 cursor-pointer hover:text-destructive" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeChapter(chapterId);
                                }}
                              />
                            </Badge>
                          );
                        })}
                        {selectedChapters.length > 2 && (
                          <Badge variant="outline" className="px-2 py-0">
                            +{selectedChapters.length - 2} more
                          </Badge>
                        )}
                      </>
                    )}
                  </div>
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput 
                    placeholder="Search chapters..." 
                    value={chapterSearch}
                    onValueChange={setChapterSearch}
                  />
                  <CommandEmpty>No chapters found.</CommandEmpty>
                  <CommandGroup>
                    <ScrollArea className="h-60">
                      <CommandList>
                        {filteredChapters.map((chapter) => (
                          <CommandItem
                            key={chapter.id}
                            onSelect={() => handleChapterSelect(chapter.id)}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              checked={selectedChapters.includes(chapter.id)}
                              onChange={() => handleChapterSelect(chapter.id)}
                            />
                            <span className="flex-1">{chapter.name}</span>
                          </CommandItem>
                        ))}
                      </CommandList>
                    </ScrollArea>
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        )}

        {/* Concept Selection */}
        {selectedChapters.length > 0 && (
          <div className="space-y-3">
            <Label>Concepts/Topics (Select multiple)</Label>
            
            <Popover open={conceptDropdownOpen} onOpenChange={setConceptDropdownOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={conceptDropdownOpen}
                  className="w-full justify-between h-auto min-h-10 p-3"
                >
                  <div className="flex flex-wrap gap-1 flex-1 items-center">
                    {selectedConcepts.length === 0 ? (
                      <span className="text-muted-foreground">Select concepts...</span>
                    ) : (
                      <>
                        {selectedConcepts.slice(0, 2).map(conceptId => {
                          const concept = concepts.find(c => c.id === conceptId);
                          return (
                            <Badge key={conceptId} variant="secondary" className="flex items-center gap-1 px-2 py-0">
                              {concept?.name}
                              <X 
                                className="w-3 h-3 cursor-pointer hover:text-destructive" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeConcept(conceptId);
                                }}
                              />
                            </Badge>
                          );
                        })}
                        {selectedConcepts.length > 2 && (
                          <Badge variant="outline" className="px-2 py-0">
                            +{selectedConcepts.length - 2} more
                          </Badge>
                        )}
                      </>
                    )}
                  </div>
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput 
                    placeholder="Search concepts..." 
                    value={conceptSearch}
                    onValueChange={setConceptSearch}
                  />
                  <CommandEmpty>No concepts found.</CommandEmpty>
                  <CommandGroup>
                    <ScrollArea className="h-60">
                      <CommandList>
                        {filteredConcepts.map((concept) => (
                          <CommandItem
                            key={concept.id}
                            onSelect={() => handleConceptSelect(concept.id)}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              checked={selectedConcepts.includes(concept.id)}
                              onChange={() => handleConceptSelect(concept.id)}
                            />
                            <span className="flex-1">{concept.name}</span>
                          </CommandItem>
                        ))}
                      </CommandList>
                    </ScrollArea>
                  </CommandGroup>
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
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
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