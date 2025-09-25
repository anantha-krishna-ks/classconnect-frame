import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Upload, FileText, CheckCircle, X, Search } from 'lucide-react';
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
            
            {/* Selected Chapters Display */}
            {selectedChapters.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 bg-muted/20 rounded-lg border">
                {selectedChapters.map(chapterId => {
                  const chapter = chapters.find(ch => ch.id === chapterId);
                  return (
                    <Badge key={chapterId} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                      {chapter?.name}
                      <X 
                        className="w-3 h-3 cursor-pointer hover:text-destructive" 
                        onClick={() => removeChapter(chapterId)}
                      />
                    </Badge>
                  );
                })}
                <Badge variant="outline" className="px-2 py-1">
                  {selectedChapters.length}
                </Badge>
              </div>
            )}

            {/* Search and Selection */}
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="p-3 border-b bg-muted/10">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search chapters..."
                    value={chapterSearch}
                    onChange={(e) => setChapterSearch(e.target.value)}
                    className="pl-10 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
              </div>
              
              <ScrollArea className="h-40">
                <div className="p-2">
                  {filteredChapters.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">No chapters found</div>
                  ) : (
                    filteredChapters.map((chapter) => (
                      <div key={chapter.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-accent/50 transition-colors">
                        <Checkbox
                          id={chapter.id}
                          checked={selectedChapters.includes(chapter.id)}
                          onCheckedChange={() => handleChapterSelect(chapter.id)}
                        />
                        <Label htmlFor={chapter.id} className="text-sm cursor-pointer flex-1 font-medium">
                          {chapter.name}
                        </Label>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        )}

        {/* Concept Selection */}
        {selectedChapters.length > 0 && (
          <div className="space-y-3">
            <Label>Concepts/Topics (Select multiple)</Label>
            
            {/* Selected Concepts Display */}
            {selectedConcepts.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 bg-muted/20 rounded-lg border">
                {selectedConcepts.map(conceptId => {
                  const concept = concepts.find(c => c.id === conceptId);
                  return (
                    <Badge key={conceptId} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                      {concept?.name}
                      <X 
                        className="w-3 h-3 cursor-pointer hover:text-destructive" 
                        onClick={() => removeConcept(conceptId)}
                      />
                    </Badge>
                  );
                })}
                <Badge variant="outline" className="px-2 py-1">
                  {selectedConcepts.length}
                </Badge>
              </div>
            )}

            {/* Search and Selection */}
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="p-3 border-b bg-muted/10">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search concepts..."
                    value={conceptSearch}
                    onChange={(e) => setConceptSearch(e.target.value)}
                    className="pl-10 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
              </div>
              
              <ScrollArea className="h-40">
                <div className="p-2">
                  {filteredConcepts.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">No concepts found</div>
                  ) : (
                    filteredConcepts.map((concept) => (
                      <div key={concept.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-accent/50 transition-colors">
                        <Checkbox
                          id={concept.id}
                          checked={selectedConcepts.includes(concept.id)}
                          onCheckedChange={() => handleConceptSelect(concept.id)}
                        />
                        <Label htmlFor={concept.id} className="text-sm cursor-pointer flex-1 font-medium">
                          {concept.name}
                        </Label>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
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