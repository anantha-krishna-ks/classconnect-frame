import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';


interface Grade {
  ClassId: number;
  ClassName: string;
}

interface Subject {
  SubjectId: number;
  SubjectName: string;
  PlanClassId: string;
}

interface Chapter {
  chapterId: string;
  chapterName: string;
}

interface ELO {
  id: string;
  title: string;
  description: string;
  selected: boolean;
}

const QuizCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [eloLoading, setEloLoading] = useState(false);

  // Form data
  const [quizName, setQuizName] = useState('');
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [questionCount, setQuestionCount] = useState<string>('');
  const [selectedELOs, setSelectedELOs] = useState<ELO[]>([]);

  // Dropdown data
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [elos, setElos] = useState<ELO[]>([]);

  // Load grades on component mount
  useEffect(() => {
    fetch("https://ai.excelsoftcorp.com/aiapps/EXAMPREP/get_classes")
      .then((res) => res.json())
      .then((data) => {
        // Normalize the keys
        const formatted = data.map((item) => ({
          ClassId: item.classid,
          ClassName: item.classname
        }));
        setGrades(formatted);
      })
      .catch((err) => {
        console.error("Error fetching grades:", err);
      });
  }, []);

  // Load subjects when grade changes
  useEffect(() => {
    if (selectedGrade) {
      fetch(
        `https://ai.excelsoftcorp.com/aiapps/EXAMPREP/get_subject?classid=${selectedGrade}`
      )
        .then((res) => res.json())
        .then((data) => {
          const formatted = data.map((item) => ({
            SubjectId: item.subjectid,
            SubjectName: item.subjectname
          }));
          setSubjects(formatted);
          setSelectedSubject(""); // reset subject when grade changes
        })
        .catch((err) => console.error("Error fetching subjects:", err));
    } else {
      setSubjects([]);
      setSelectedSubject("");
    }
  }, [selectedGrade]);

  // Load chapters when subject changes
  useEffect(() => {
    if (selectedGrade && selectedSubject) {
      fetch(
        `https://ai.excelsoftcorp.com/aiapps/EXAMPREP/get_chapters?classid=${selectedGrade}&subjectid=${selectedSubject}`
      )
        .then((res) => res.json())
        .then((data) => {
          const formatted = data.map((item) => ({
            chapterId: item.chapterid,
            chapterName: item.chaptername
          }));
          setChapters(formatted);
          setSelectedChapter("");
        })
        .catch((err) => console.error("Error fetching chapters:", err));
    } else {
      setChapters([]);
      setSelectedChapter("");
    }
  }, [selectedGrade, selectedSubject]);

  // Load ELOs when chapter changes
  useEffect(() => {
    const loadELOs = async () => {
      if (selectedChapter) {
        setEloLoading(true);
        const chapter = chapters.find(c => c.chapterId === selectedChapter);
        const subject = subjects.find(s => s.SubjectId.toString() === selectedSubject);
        const grade = grades.find(g => g.ClassId.toString() === selectedGrade);

        if (chapter && subject && grade) {
          try {
            // Fallback mock data since generateCourseOutcomes is not available
            const elosData = { course_outcomes: [] };

            const formattedELOs: ELO[] = elosData.course_outcomes?.map((outcome: any, index: number) => ({
              id: outcome.co_id || `elo-${index}`,
              title: outcome.co_title || `ELO ${index + 1}`,
              description: outcome.co_description || outcome.title || 'No description available',
              selected: false
            })) || [];

            setElos(formattedELOs);
          } catch (error) {
            console.error('Error loading ELOs:', error);
            // Fallback mock data
            setElos([
              { id: '1', title: 'Understanding Basic Concepts', description: 'Students will understand the fundamental concepts of the topic', selected: false },
              { id: '2', title: 'Problem Solving Skills', description: 'Students will develop problem-solving skills related to the chapter', selected: false },
              { id: '3', title: 'Application of Knowledge', description: 'Students will be able to apply knowledge in practical scenarios', selected: false }
            ]);
          }
        }
        setEloLoading(false);
      }
    };
    loadELOs();
  }, [selectedChapter, chapters, subjects, grades, selectedSubject, selectedGrade]);

  const handleELOSelection = (eloId: string) => {
    setElos(prev => prev.map(elo =>
      elo.id === eloId ? { ...elo, selected: !elo.selected } : elo
    ));
  };

  const getSelectedELOsCount = () => {
    return elos.filter(elo => elo.selected).length;
  };

  const questionCountOptions = [
    { value: '5', label: 'Create quiz with 5 questions' },
    { value: '10', label: 'Create quiz with 10 questions' },
    { value: '12', label: 'Create quiz with 12 questions' },
    { value: 'per-elo', label: 'Create quiz with 3 questions per selected ELO' }
  ];

  // const isFormValid = () => {
  //   return quizName.trim() && selectedGrade && selectedSubject && selectedChapter &&
  //     questionCount && getSelectedELOsCount() > 0;
  // };
  const isFormValid = () => {
    return quizName.trim() && selectedGrade && selectedSubject && selectedChapter &&
      questionCount ;
  };

  const handleGenerate = async () => {
    if (!isFormValid()) return;

    setLoading(true);

    // Simulate generation time
    await new Promise(resolve => setTimeout(resolve, 2000));
    debugger
    const quizData = {
  name: quizName,

  gradeId: selectedGrade,
  grade: grades.find(g => g.ClassId.toString() === selectedGrade)?.ClassName,

  subjectId: selectedSubject,
  subject: subjects.find(s => s.SubjectId.toString() === selectedSubject)?.SubjectName,

  chapterId: selectedChapter,
  chapter: chapters.find(c => c.chapterId === Number(selectedChapter))?.chapterName,

  questionCount: questionCount === 'per-elo'
    ? getSelectedELOsCount() > 0
      ? getSelectedELOsCount() * 3
      : 0
    : parseInt(questionCount),

  selectedELOs: getSelectedELOsCount() > 0
    ? elos.filter(elo => elo.selected)
    : []
};


    navigate('/quiz-generator/preview', { state: { quizData } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/quiz-generator')}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Quiz Listing
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create Quiz</h1>
              <p className="text-sm text-gray-500">Define quiz parameters and generate questions</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quiz Details */}
            <Card>
              <CardHeader>
                <CardTitle>Quiz Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="quiz-name">Quiz Name</Label>
                  <Input
                    id="quiz-name"
                    placeholder="Enter quiz name"
                    value={quizName}
                    onChange={(e) => setQuizName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label>Grade</label>
                    <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {grades.map((grade) => (
                          <SelectItem key={grade.ClassId} value={grade.ClassId.toString()}>
                            {grade.ClassName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Subject</Label>
                    <Select value={selectedSubject} onValueChange={setSelectedSubject} disabled={!selectedGrade}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map(subject => (
                          <SelectItem key={subject.SubjectId} value={subject.SubjectId.toString()}>
                            {subject.SubjectName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label>Chapter</label>
                    <Select
                      value={selectedChapter}
                      onValueChange={setSelectedChapter}
                      disabled={!selectedSubject}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select chapter" />
                      </SelectTrigger>
                      <SelectContent>
                        {chapters.map((chapter) => (
                          <SelectItem
                            key={chapter.chapterId}
                            value={chapter.chapterId.toString()}
                          >
                            {chapter.chapterName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Question Count</Label>
                  <Select value={questionCount} onValueChange={setQuestionCount}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select question count option" />
                    </SelectTrigger>
                    <SelectContent>
                      {questionCountOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedChapter && (
                  <div>
                    <Label>Expected Learning Outcomes</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder={
                          eloLoading
                            ? "Loading ELOs..."
                            : getSelectedELOsCount() > 0
                              ? `${getSelectedELOsCount()} ELO${getSelectedELOsCount() > 1 ? 's' : ''} selected`
                              : "Select ELOs"
                        } />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {eloLoading ? (
                          <div className="flex items-center justify-center py-4">
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Loading ELOs...
                          </div>
                        ) : (
                          <>
                            <div className="p-2 border-b">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const allSelected = elos.every(elo => elo.selected);
                                  setElos(prev => prev.map(elo => ({ ...elo, selected: !allSelected })));
                                }}
                                className="w-full justify-start text-xs"
                              >
                                {elos.every(elo => elo.selected) ? 'Deselect All' : 'Select All'}
                              </Button>
                            </div>
                            {elos.map(elo => (
                              <div key={elo.id} className="flex items-start space-x-2 p-2 hover:bg-gray-50">
                                <Checkbox
                                  id={`dropdown-${elo.id}`}
                                  checked={elo.selected}
                                  onCheckedChange={() => handleELOSelection(elo.id)}
                                />
                                <div className="flex-1 min-w-0">
                                  <label htmlFor={`dropdown-${elo.id}`} className="text-sm font-medium cursor-pointer block">
                                    {elo.title}
                                  </label>
                                  <p className="text-xs text-gray-500 truncate">{elo.description}</p>
                                </div>
                              </div>
                            ))}
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* ELO Selection */}
            {selectedChapter && (
              <Card>
                <CardHeader>
                  <CardTitle>Expected Learning Outcomes</CardTitle>
                  <p className="text-sm text-gray-500">
                    Select the learning outcomes you want to assess
                  </p>
                </CardHeader>
                <CardContent>
                  {eloLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin mr-2" />
                      Loading ELOs...
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {elos.map(elo => (
                        <div key={elo.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                          <Checkbox
                            id={elo.id}
                            checked={elo.selected}
                            onCheckedChange={() => handleELOSelection(elo.id)}
                          />
                          <div className="flex-1">
                            <label htmlFor={elo.id} className="font-medium text-sm cursor-pointer">
                              {elo.title}
                            </label>
                            <p className="text-xs text-gray-500 mt-1">{elo.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Quiz Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500">Quiz Name</div>
                  <div className="font-medium break-words overflow-wrap-anywhere">{quizName || 'Not specified'}</div>
                </div>

                {selectedGrade && (
                  <div>
                    <div className="text-sm text-gray-500">Grade</div>
                    <div className="font-medium">
                      {grades.find(g => g.ClassId.toString() === selectedGrade)?.ClassName}
                    </div>
                  </div>
                )}

                {selectedSubject && (
                  <div>
                    <div className="text-sm text-gray-500">Subject</div>
                    <div className="font-medium">
                      {subjects.find(s => s.SubjectId.toString() === selectedSubject)?.SubjectName}
                    </div>
                  </div>
                )}

                {selectedChapter && (
                  <div>
                    <div className="text-sm text-gray-500">Chapter</div>
                    <div className="font-medium">
                      {
                        chapters.find(c => c.chapterId === Number(selectedChapter))
                          ?.chapterName
                      }
                    </div>
                  </div>
                )}


                {questionCount && (
                  <div>
                    <div className="text-sm text-gray-500">Questions</div>
                    <div className="font-medium">
                      {questionCount === 'per-elo'
                        ? `${getSelectedELOsCount() * 3} (3 per ELO)`
                        : questionCount
                      }
                    </div>
                  </div>
                )}

                {getSelectedELOsCount() > 0 && (
                  <div>
                    <div className="text-sm text-gray-500 mb-2">Selected ELOs</div>
                    <div className="flex flex-wrap gap-1">
                      {elos.filter(elo => elo.selected).map(elo => (
                        <Badge key={elo.id} variant="secondary" className="text-xs">
                          {elo.title}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleGenerate}
                  disabled={!isFormValid() || loading}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate Quiz'
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizCreate;