import { useState , useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Calendar, Edit, Copy, Trash2, ArrowLeft, Eye, Download, FileText, FileSpreadsheet, MoreHorizontal, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';

interface SavedQuiz {
  id: string;
  name: string;
  chapter: string;
  subject: string;
  grade: string;
  questionCount: number;
  createdAt: string;
  lastModified: string;
}

const QuizListing = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [selectedQuizForExport, setSelectedQuizForExport] = useState<SavedQuiz | null>(null);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [exportVersion, setExportVersion] = useState('both');
  const [includeAnswers, setIncludeAnswers] = useState(true);
  const [includeExplanations, setIncludeExplanations] = useState(true);
  const [savedQuizzes, setSavedQuizzes] = useState<SavedQuiz[]>([]);
  // Mock data for saved quizzes



  const filteredQuizzes = savedQuizzes.filter(quiz =>
    quiz.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quiz.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quiz.chapter.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (quizId: string) => {
    navigate(`/quiz-generator/preview/${quizId}`);
  };
  useEffect(() => {
  const fetchQuizzes = async () => {
    
    try {
      const response = await fetch('https://ai.excelsoftcorp.com/ExcelAIQuizGen/get-quiz-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          custcode: 'CUST001',
          orgcode: 'ORG001',
          usercode: 'USER123',
          searchtext: ''
        })
      });

      const result = await response.json();

      if (result.status === 'Success' && Array.isArray(result.data)) {
        const quizzes: SavedQuiz[] = result.data.map((item: any) => ({
          id: item.quizid.toString(),
          name: item.quizname,
          chapter: item.chaptername || 'Unknown Chapter',
          subject: item.subjectname || 'Unknown Subject',
          grade: item.classname || 'Unknown Class',
          questionCount: item.questioncount,
          createdAt: item.created_at,
          lastModified: item.created_at // use created_at if no modified field
        }));

        setSavedQuizzes(quizzes);
      } else {
        
      }
    } catch (err) {
      console.error('Error fetching quizzes:', err);
      
    } finally {
      
    }
  };

  fetchQuizzes();
}, []);


  const handlePreview = async (quiz: SavedQuiz) => {
  try {
    const quizId = Number(quiz.id);
    if (isNaN(quizId)) {
      toast({
        title: "Invalid Quiz ID",
        description: `Quiz ID "${quiz.id}" is not a valid number.`,
      });
      return;
    }

    const response = await fetch(`https://ai.excelsoftcorp.com/ExcelAIQuizGen/get-json-details/${quizId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const result = await response.json();

    if (result.status === 'Success' && result.data.length > 0) {
      // FIXED: extract quizinfo from the first item
      const quizInfo = result.data[0].quizinfo;

      const questions = quizInfo.map((q: any) => ({
        id: q.id,
        text: q.text,
        type: q.type,
        options: q.options,
        correctAnswer: q.correctAnswer, // fixed casing too
        explanation: q.explanation,
        difficulty: q.difficulty,
        elo: q.elo,
      }));

      const quizData = {
        name: quiz.name,
        grade: quiz.grade,
        subject: quiz.subject,
        chapter: quiz.chapter,
        questionCount: questions.length,
        selectedELOs: [],
      };

      navigate('/quiz-generator/display', {
  state: {
    questions,
    quizData,
    origin: 'listing', // 👈 flag to indicate the source
  },
});
    } else {
      toast({
        title: "Error",
        description: "No quiz data found.",
      });
    }
  } catch (error) {
    console.error('Error fetching quiz preview:', error);
    toast({
      title: "Error",
      description: "Failed to fetch quiz details.",
    });
  }
};





  const handleExport = (quiz: SavedQuiz) => {
    setSelectedQuizForExport(quiz);
    setExportDialogOpen(true);
  };

  const handleDuplicate = (quiz: SavedQuiz) => {
    console.log('Duplicating quiz:', quiz);
    toast({
      title: "Quiz duplicated",
      description: `"${quiz.name}" has been duplicated successfully.`,
    });
  };

  const handleDelete = (quizId: string) => {
    console.log('Deleting quiz:', quizId);
    toast({
      title: "Quiz deleted",
      description: "The quiz has been deleted successfully.",
    });
  };

  
  const generateMockQuestions = (quiz: SavedQuiz) => {
    const questions = [];
    for (let i = 0; i < quiz.questionCount; i++) {
      questions.push({
        id: `q-${i + 1}`,
        text: `Sample question ${i + 1} for ${quiz.name}. This is a ${quiz.subject} question related to ${quiz.chapter}.`,
        type: ['multiple-choice', 'true-false', 'short-answer'][i % 3] as any,
        options: i % 3 === 0 ? ['Option A', 'Option B', 'Option C', 'Option D'] : 
                 i % 3 === 1 ? ['True', 'False'] : undefined,
        correctAnswer: i % 3 === 0 ? 'Option A' : i % 3 === 1 ? 'True' : 'Sample answer',
        explanation: `This is the explanation for question ${i + 1}.`,
        difficulty: ['easy', 'medium', 'hard'][i % 3] as any,
        elo: 'Understanding Core Concepts'
      });
    }
    return questions;
  };

  const handleExportConfirm = () => {
    if (selectedQuizForExport) {
      toast({
        title: "Export started",
        description: `Exporting "${selectedQuizForExport.name}" as ${exportFormat.toUpperCase()}...`,
      });
      setExportDialogOpen(false);
      setSelectedQuizForExport(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/tools')}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Tools
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center shadow-lg">
                  <ClipboardList className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Quiz Generator</h1>
                  <p className="text-sm text-gray-500">Manage and create interactive quizzes</p>
                </div>
              </div>
            </div>
            <Button 
              onClick={() => navigate('/quiz-generator/create')}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Quiz
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filters */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search quizzes by name, subject, or chapter..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Quiz Grid */}
        {filteredQuizzes.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No quizzes found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first quiz'}
            </p>
            <Button 
              onClick={() => navigate('/quiz-generator/create')}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Quiz
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map((quiz) => (
              <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                        {quiz.name}
                      </CardTitle>
                      <div className="text-sm text-gray-500 space-y-1">
                        <p>{quiz.subject} • {quiz.grade}</p>
                        <p>{quiz.chapter}</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{quiz.questionCount} questions</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(quiz.lastModified).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePreview(quiz)}
                      className="flex-1"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Preview
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="w-3 h-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(quiz.id)}>
                          <Edit className="w-3 h-3 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExport(quiz)}>
                          <Download className="w-3 h-3 mr-2" />
                          Export
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(quiz)}>
                          <Copy className="w-3 h-3 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(quiz.id)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="w-3 h-3 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Export Dialog */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Export Quiz</DialogTitle>
          </DialogHeader>
          {selectedQuizForExport && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-2">Quiz: {selectedQuizForExport.name}</h4>
                <p className="text-sm text-gray-500">
                  {selectedQuizForExport.subject} • {selectedQuizForExport.grade} • {selectedQuizForExport.questionCount} questions
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-2">Export Format</label>
                  <Select value={exportFormat} onValueChange={setExportFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          PDF Document
                        </div>
                      </SelectItem>
                      <SelectItem value="docx">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Word Document
                        </div>
                      </SelectItem>
                      <SelectItem value="xlsx">
                        <div className="flex items-center gap-2">
                          <FileSpreadsheet className="w-4 h-4" />
                          Excel Spreadsheet
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">Version</label>
                  <Select value={exportVersion} onValueChange={setExportVersion}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student Version (Questions Only)</SelectItem>
                      <SelectItem value="teacher">Teacher Version (With Answers)</SelectItem>
                      <SelectItem value="both">Both Versions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(exportVersion === 'teacher' || exportVersion === 'both') && (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="include-answers"
                        checked={includeAnswers}
                        onCheckedChange={(checked) => setIncludeAnswers(checked === true)}
                      />
                      <label htmlFor="include-answers" className="text-sm">
                        Include correct answers
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="include-explanations"
                        checked={includeExplanations}
                        onCheckedChange={(checked) => setIncludeExplanations(checked === true)}
                      />
                      <label htmlFor="include-explanations" className="text-sm">
                        Include explanations
                      </label>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setExportDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleExportConfirm} className="bg-purple-600 hover:bg-purple-700">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuizListing;