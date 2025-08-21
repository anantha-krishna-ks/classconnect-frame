import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, GripVertical, Eye, Download, Save, Sparkles, Target, BookOpen, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import axios from 'axios';
import { PageLoader } from '@/components/ui/loader';
import { Document, Paragraph, TextRun, HeadingLevel, Packer } from 'docx';


interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'fill-in-the-blanks';
  options?: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  elo: string;
}

interface QuizData {
  name: string;
  grade: string;
  subject: string;
  chapter: string;
  questionCount: number;
  selectedELOs: Array<{ id: string; title: string; description: string }>;
}

const QuizPreview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const quizData = location.state?.quizData as QuizData;
  const initialQuestions = location.state?.questions as Question[];

  const [questions, setQuestions] = useState<Question[]>(initialQuestions || []);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [quizName, setQuizName] = useState(quizData?.name || '');
  const [loading, setLoading] = useState(false);

  // Generate mock questions based on quiz data
  useEffect(() => {
    
    if (!quizData) return;
    if (questions && questions.length > 0) return;

    const fetchQuestions = async () => {
      setLoading(true);
      if (!quizData) return;
      setLoading(true); // Start loadingsetLoading(true);
      try {
        const response = await fetch('https://ai.excelsoftcorp.com/ExcelAIQuizGen/generate-questions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            grade: quizData.grade,
            subject: quizData.subject,
            chapter: quizData.chapter,
            questionCount: quizData.questionCount,
            selectedELOs: quizData.selectedELOs || []
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data && data.questions) {
          setQuestions(data.questions);
        }
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      }
      finally {
        setLoading(false); // End loading
      }
    };

    fetchQuestions();
  }, [quizData, questions]);

  const handleSaveQuizquestion = async () => {
    if (!quizData || !questions || questions.length === 0) {
      console.error("Quiz data or questions missing");
      return;
    }

    const payload = {
      custcode: "CUST001",
      orgcode: "ORG001",
      usercode: "USER123",
      classid: quizData.grade,
      subjectid: quizData.subject,
      chapterid: quizData.chapter,
      questioncount: quizData.questionCount,
      eloids: quizData.selectedELOs.map(elo => elo.id).join(","),
      quizname: quizData.name,
      questioninfo: questions
    };

    try {
      const response = await fetch("https://ai.excelsoftcorp.com/ExcelAIQuizGen/save-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      console.log("Quiz saved successfully:", result);
      alert("Quiz saved successfully!");
    } catch (error) {
      console.error("Error saving quiz:", error);
      alert("Failed to save quiz.");
    }
  };


  const handleEditQuestion = (question: Question) => {
    setEditingQuestion({ ...question });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingQuestion) {
      setQuestions(prev => prev.map(q =>
        q.id === editingQuestion.id ? editingQuestion : q
      ));
      setIsEditDialogOpen(false);
      setEditingQuestion(null);
      toast({
        title: "Question updated",
        description: "The question has been successfully updated.",
      });
    }
  };

  const handleDeleteQuestion = (questionId: string) => {
    setQuestions(prev => prev.filter(q => q.id !== questionId));
    toast({
      title: "Question deleted",
      description: "The question has been removed from the quiz.",
    });
  };

  const handleSaveQuiz = () => {
    // Implementation for saving quiz
    console.log('Saving quiz:', { name: quizName, questions });
    toast({
      title: "Quiz saved",
      description: `"${quizName}" has been saved successfully.`,
    });
    setSaveDialogOpen(false);
    navigate('/quiz-generator');
  };

    const handleDisplay = () => {
    // Always pass questions and quizData on navigation!
    navigate('/quiz-generator/display', {
      state: {
        questions,
        quizData: { ...quizData, name: quizName }
      }
    });
  };

  const handleExport = async () => {
  if (!questions || questions.length === 0) {
    alert("No questions to export.");
    return;
  }

  const questionParagraphs = questions.map((q, index) => {
    const paragraphs = [
      new Paragraph({
        text: `Q${index + 1}. ${q.text}`,
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 200 },
      }),
    ];

    if (q.type === "multiple-choice" && q.options) {
      q.options.forEach((opt, i) => {
        paragraphs.push(
          new Paragraph({
            children: [new TextRun({ text: `${String.fromCharCode(65 + i)}. ${opt}` })],
            bullet: { level: 0 },
          })
        );
      });
    }

    if (q.type === "true-false") {
      paragraphs.push(
        new Paragraph("A. True"),
        new Paragraph("B. False")
      );
    }

    if (q.type === "fill-in-the-blanks") {
      paragraphs.push(new Paragraph("Answer: ____________"));
    }

    paragraphs.push(
      new Paragraph({
        text: `Correct Answer: ${q.correctAnswer}`,
        spacing: { before: 200 },
      }),
      new Paragraph({
        text: `Explanation: ${q.explanation}`,
        spacing: { after: 300 },
      })
    );

    return paragraphs;
  });

  const allParagraphs = questionParagraphs.flat();

  const now = new Date();
  const timestamp = now.toISOString().slice(0, 19).replace(/[:T]/g, "-");
  const fileName = `questions_${timestamp}.docx`;

  const docContent = new Document({
    sections: [
      {
        children: allParagraphs,
      },
    ],
  });

  const blob = await Packer.toBlob(docContent);
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
};


  if (!quizData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No quiz data found</h2>
          <p className="text-gray-500 mb-4">Please create a quiz first.</p>
          <Button onClick={() => navigate('/quiz-generator/create')}>
            Create Quiz
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      {loading && (
        <PageLoader text="Loading ....." />
      )}
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-sm border-b border-border/50 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/quiz-generator/create')}
                className="hover:bg-primary/10 transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Create
              </Button>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent animate-fade-in">
                    Quiz Preview & Editing
                  </h1>
                  <p className="text-muted-foreground">Review and edit your generated quiz</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Quiz Details */}
        <Card className="mb-8 bg-gradient-to-r from-background to-primary/5 border-primary/20 shadow-lg animate-fade-in">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <span className="text-2xl font-bold break-words overflow-wrap-anywhere min-w-0 flex-1">{quizData.name}</span>
              </div>
              <div className="flex gap-2">
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  {quizData.grade}
                </Badge>
                <Badge variant="secondary" className="bg-secondary/10 text-secondary-foreground border-secondary/20">
                  {quizData.subject}
                </Badge>
              </div>
            </CardTitle>
            <div className="flex items-center gap-2 text-muted-foreground">
              <BookOpen className="w-4 h-4" />
              <p>Chapter: {quizData.chapter}</p>
            </div>
          </CardHeader>
          <CardContent>
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                Selected Learning Outcomes:
              </h4>
              <div className="flex flex-wrap gap-2">
                {quizData.selectedELOs.map(elo => (
                  <Badge key={elo.id} variant="outline" className="bg-secondary/5 hover:bg-secondary/10 transition-colors">
                    {elo.title}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions List */}
        <Card className="mb-8 bg-gradient-to-r from-background to-secondary/5 border-border/50 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-lg bg-primary/10">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              Questions ({questions.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {questions.map((question, index) => (
              <div key={question.id} className="group border border-border/50 rounded-xl p-6 bg-gradient-to-r from-background to-primary/5 hover:shadow-md transition-all duration-300 hover:border-primary/30">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <GripVertical className="w-4 h-4 text-muted-foreground cursor-move group-hover:text-primary transition-colors" />
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-bold text-sm text-primary">Q{index + 1}</span>
                      </div>
                      <div className="flex gap-2">
                        <Badge
                          variant="outline"
                          className={`text-xs ${question.difficulty === 'easy' ? 'bg-green-50 text-green-700 border-green-200' :
                              question.difficulty === 'medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                'bg-red-50 text-red-700 border-red-200'
                            }`}
                        >
                          {question.difficulty}
                        </Badge>
                        <Badge variant="secondary" className="text-xs bg-secondary/10 text-secondary-foreground">
                          {question.type.replace('-', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditQuestion(question)}
                      className="hover:bg-primary/10 hover:border-primary/30"
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteQuestion(question.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-4 border border-primary/10">
                    <h4 className="font-semibold text-foreground text-lg leading-relaxed">{question.text}</h4>
                  </div>

                  {question.options && (
                    <div className="bg-background/50 rounded-lg p-4 border border-border/30">
                      <h5 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        Options:
                      </h5>
                      <ul className="space-y-2">
                        {question.options.map((option, optIndex) => (
                          <li key={optIndex} className={`text-sm p-2 rounded-md transition-colors ${option === question.correctAnswer
                              ? 'bg-green-50 text-green-700 font-medium border border-green-200'
                              : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
                            }`}>
                            <span className="font-semibold mr-2">{String.fromCharCode(65 + optIndex)}.</span>
                            {option}
                            {option === question.correctAnswer && <CheckCircle2 className="w-4 h-4 inline ml-2 text-green-600" />}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="bg-green-50/50 rounded-lg p-4 border border-green-200/50">
                    <h5 className="text-sm font-semibold text-green-800 mb-2 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Correct Answer:
                    </h5>
                    <p className="text-sm text-green-700 font-medium bg-green-100/50 p-2 rounded">{question.correctAnswer}</p>
                  </div>

                  <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-200/50">
                    <h5 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Explanation:
                    </h5>
                    <p className="text-sm text-blue-700 leading-relaxed">{question.explanation}</p>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                      ELO: {question.elo}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center py-6">
          <Button
            variant="outline"
            onClick={handleDisplay}
            className="min-w-32 hover:bg-primary/10 hover:border-primary/30 transition-all duration-200 hover:scale-105"
          >
            <Eye className="w-4 h-4 mr-2" />
            Display
          </Button>
          <Button
            variant="outline"
            onClick={handleExport}
            className="min-w-32 hover:bg-secondary/10 hover:border-secondary/30 transition-all duration-200 hover:scale-105"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>

          <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleSaveQuizquestion} className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 min-w-32 transition-all duration-200 hover:scale-105 shadow-lg">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save Quiz</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Quiz Name</label>
                  <Input
                    value={quizName}
                    onChange={(e) => setQuizName(e.target.value)}
                    placeholder="Enter quiz name"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveQuiz}>Save Quiz</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Edit Question Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] bg-gradient-to-br from-background to-primary/5 flex flex-col">
          <DialogHeader className="pb-4 flex-shrink-0">
            <DialogTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-lg bg-primary/10">
                <Edit2 className="w-5 h-5 text-primary" />
              </div>
              Edit Question
            </DialogTitle>
          </DialogHeader>
          {editingQuestion && (
            <div className="space-y-4 overflow-y-auto flex-1 pr-2">
              <div>
                <label className="text-sm font-medium">Question Text</label>
                <Textarea
                  value={editingQuestion.text}
                  onChange={(e) => setEditingQuestion(prev => prev ? { ...prev, text: e.target.value } : null)}
                  rows={3}
                />
              </div>

              {editingQuestion.options && (
                <div>
                  <label className="text-sm font-medium">Options</label>
                  <div className="space-y-2">
                    {editingQuestion.options.map((option, index) => (
                      <Input
                        key={index}
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...editingQuestion.options!];
                          newOptions[index] = e.target.value;
                          setEditingQuestion(prev => prev ? { ...prev, options: newOptions } : null);
                        }}
                        placeholder={`Option ${String.fromCharCode(65 + index)}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium">Correct Answer</label>
                <Input
                  value={editingQuestion.correctAnswer}
                  onChange={(e) => setEditingQuestion(prev => prev ? { ...prev, correctAnswer: e.target.value } : null)}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Explanation</label>
                <Textarea
                  value={editingQuestion.explanation}
                  onChange={(e) => setEditingQuestion(prev => prev ? { ...prev, explanation: e.target.value } : null)}
                  rows={2}
                />
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2 pt-4 flex-shrink-0 border-t border-border/20">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuizPreview;
