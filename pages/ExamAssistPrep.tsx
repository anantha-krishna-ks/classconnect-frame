import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { getPaperDetails } from '@/pages/api';
import searchPlaceholder from '@/assets/search-placeholder.png';
import { ArrowLeft, Search, Filter, Download, Sparkles, RefreshCw, FileText, BookOpen, Users, ClipboardList, GraduationCap, ChevronDown, Bookmark, Plus, Trash2, Edit, Check, X, Calendar, Hash, ArrowRight, Eye, Loader2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { toast, useToast } from '@/hooks/use-toast';
import { exportQuestionsToPDF } from '@/lib/exportPdf';

// interface Question {
//   id: string;
//   question: string;
//   type: string;
//   year: string;
//   //chapter: string;
//   class_id: string;
//   class: string;
//   subject_id: string;
//   subject: string;
//   taxonomy: string;
//   chapter: string;
//   chapter_id?: string;
//   isGenerated?: boolean;
//   //marks?: number;
//   //source?: string;
// }

interface Question {
  classid: string;
  classname: string;
  subjectid: string;
  subjectname: string;
  questionid: string;
  questiontext: string;
  questionformat: string | null;
  imageurl: string | null;
  questiontypeid: string;
  questiontypename: string;
  chaptername: string;
  chapterid: string;
  taxonomyid: string;
  taxonomyname: string;
  yearid: string;
  yearname: string;
  ismanualcreation: boolean | null;
  generatedQuestions?: Array<GeneratedQuestion>;
  isGenerating?: boolean;
}



interface QuestionGeneration {
  isGenerating: boolean;
  generatedQuestions: Array<{
    id: string;
    question: string;
    type: string;
    chapter_id?: string;
  }>;
  convertedQuestions?: Array<{
    id: string;
    text: string;
    questionType: string;
    chapter_id?: string;
    isEditing?: boolean;
  }>;
}


interface GeneratedQuestion {
  id: string;
  text: string;
  isEditing?: boolean;
  questionType?: string;
}

interface QuestionPaper {
  id: string;
  name: string;
  questions: Question[];
  createdAt: Date;
  lastEditOn: Date;
}

const ExamAssistPrep = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [selectedClass, setSelectedClass] = useState('select-class');
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [selectedQuestionType, setSelectedQuestionType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('search');
  const [repository, setRepository] = useState<Question[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string[]>([]);
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState<string[]>([]);
  const [showConversionModal, setShowConversionModal] = useState(false);
  const [conversionTarget, setConversionTarget] = useState<{questionId: string, questionText: string} | null>(null);
  const [conversionType, setConversionType] = useState('MCQ');
  const [conversionQuantity, setConversionQuantity] = useState('1');
  const [addedToRepository, setAddedToRepository] = useState<Set<string>>(new Set());
  const [questionPapers, setQuestionPapers] = useState<QuestionPaper[]>([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [paperName, setPaperName] = useState('');
  const [showCreatePaperModal, setShowCreatePaperModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [conversionContext, setConversionContext] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [questionGenerations, setQuestionGenerations] = useState<Record<string, QuestionGeneration>>({});
  const [subjects, setSubjects] = useState<Array<{ subjectid: number; subjectname: string }>>([]);
  const [classes, setClasses] = useState<Array<{ classid: number; classname: string }>>([]);
  const [years, setYears] = useState<Array<{ yearid: number; yearname: string }>>([]);
  const [selectedYear, setSelectedYear] = useState('select-year');
  const [taxonomies, setTaxonomies] = useState<Array<{ taxonomyid: number; taxonomyname: string }>>([]);
  const [selectedTaxonomy, setSelectedTaxonomy] = useState('all');
  const [questionTypes, setQuestionTypes] = useState<Array<{ questiontypeid: number; questiontypename: string }>>([]);
  const [selectedSubject, setSelectedSubject] = useState('select-subject');
  const [chapters, setChapters] = useState<Array<{
    chapterid: number;
    chaptername: string;
    chaptercode: string | null;
    classid: number;
    subjectid: number;
  }>>([]);
  const [selectedChapter, setSelectedChapter] = useState('all-chapters');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 10; // Default page size
  


  // Paper stats type
type PaperStats = { numPapers: number; totalQuestions: number };

  const [paperStats, setPaperStats] = useState<PaperStats>({ numPapers: 0, totalQuestions: 0 });
  // Fetch paper/question details from backend and update UI
  useEffect(() => {
    async function fetchPaperData() {
      try {
        // Use default org/user for now
        const res = await getPaperDetails(orgcode, userId);
        // Defensive: handle both array and object for p_refcur
        let numPapers = 0, totalQuestions = 0;
        if (Array.isArray(res.p_refcur) && res.p_refcur.length > 0) {
          // If p_refcur is array of objects
          if (typeof res.p_refcur[0] === 'object') {
            numPapers = res.p_refcur[0][0] ?? 0;
            totalQuestions = res.p_refcur[0][1] ?? 0;
          } else if (Array.isArray(res.p_refcur[0])) {
            // fallback for array-of-arrays
            [numPapers, totalQuestions] = res.p_refcur[0];
          }
        }
        setPaperStats({ numPapers, totalQuestions });
        // Map backend papers to UI QuestionPaper[]
        const papers = (res.p_refcur1 || []).map((row: any) => ({
          id: String(row[0]),
          name: row[1],
          questions: Array(row[3]).fill({}), // Only count, no details
          createdAt: new Date(row[2]),
          lastEditOn: new Date(row[2]),
        }));
        setQuestionPapers(papers);
      } catch (err) {
        setPaperStats({ numPapers: 0, totalQuestions: 0 });
        setQuestionPapers([]);
      }
    }
    fetchPaperData();
  }, []);
  // to fetch classes
  
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        console.log('Fetching classes from API...');
        const response = await fetch('https://ai.excelsoftcorp.com/aiapps/EXAMPREP/get_classes', {
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`Failed to fetch classes: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Fetched classes:', data);
        setClasses(data);
      } catch (error) {
        console.error('Error in fetchClasses:', error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load classes",
          variant: "destructive",
        });
      }
    };  // <-- Added closing brace for the fetchClasses function
  
    fetchClasses();
  }, []);  // <-- Added closing parenthesis and bracket for the useEffect
  


  // to fetch subjects
  const fetchSubjects = async (classId: string) => {
    if (classId === 'select-class') {
      setSubjects([]);
      setSelectedSubject('select-subject');
      return;
    }
  
    try {
      const response = await fetch(`https://ai.excelsoftcorp.com/aiapps/EXAMPREP/get_subject?classid=${classId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch subjects');
      }
      const data = await response.json();
      setSubjects(data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      toast({
        title: "Error",
        description: "Failed to load subjects. Please try again.",
        variant: "destructive",
      });
    }
  };
  useEffect(() => {
    if (selectedClass && selectedClass !== 'select-class') {
      fetchSubjects(selectedClass);
    } else {
      setSubjects([]);
      setSelectedSubject('select-subject');
    }
  }, [selectedClass]);
  

  // to fetch years
  useEffect(() => {
    const fetchYears = async () => {
      try {
        const response = await fetch('https://ai.excelsoftcorp.com/aiapps/EXAMPREP/get_year');
        if (!response.ok) {
          throw new Error('Failed to fetch years');
        }
        const data = await response.json();
        setYears(data);
      } catch (error) {
        console.error('Error fetching years:', error);
        toast({
          title: "Error",
          description: "Failed to load years. Please try again.",
          variant: "destructive",
        });
      }
    };
  
    fetchYears();
  }, []);

  // to fetch chapters
  const fetchChapters = async (classId: string, subjectId: string) => {
    if (classId === 'select-class' || subjectId === 'select-subject') {
      setChapters([]);
      setSelectedChapter('all-chapters');
      return;
    }
  
    try {
      const response = await fetch(
        `https://ai.excelsoftcorp.com/aiapps/EXAMPREP/get_chapters?classid=${classId}&subjectid=${subjectId}`,
        {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
          }
        });
      if (!response.ok) {
        throw new Error('Failed to fetch chapters');
      }
      const data = await response.json();
      setChapters(data);
    } catch (error) {
      console.error('Error fetching chapters:', error);
      toast({
        title: "Error",
        description: "Failed to load chapters. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (selectedClass && selectedClass !== 'select-class' && 
        selectedSubject && selectedSubject !== 'select-subject') {
      fetchChapters(selectedClass, selectedSubject);
    } else {
      setChapters([]);
      setSelectedChapter('all-chapters');
    }
  }, [selectedClass, selectedSubject]);
  



  // to fetch taxonomies
  useEffect(() => {
    const fetchTaxonomies = async () => {
      try {
        const response = await fetch('https://ai.excelsoftcorp.com/aiapps/EXAMPREP/get_taxonomy');
        if (!response.ok) {
          throw new Error('Failed to fetch taxonomies');
        }
        const data = await response.json();
        setTaxonomies(data);
      } catch (error) {
        console.error('Error fetching taxonomies:', error);
        toast({
          title: "Error",
          description: "Failed to load taxonomies. Please try again.",
          variant: "destructive",
        });
      }
    };
  
    fetchTaxonomies();
  }, []);

  // to fetch question types
  useEffect(() => {
    const fetchQuestionTypes = async () => {
      try {
        const response = await fetch('https://ai.excelsoftcorp.com/aiapps/EXAMPREP/get_questiontype');
        if (!response.ok) {
          throw new Error('Failed to fetch question types');
        }
        const data = await response.json();
        setQuestionTypes(data);
      } catch (error) {
        console.error('Error fetching question types:', error);
        toast({
          title: "Error",
          description: "Failed to load question types. Please try again.",
          variant: "destructive",
        });
      }
    };
  
    fetchQuestionTypes();
  }, []);



  // Handle question conversion
  const handleConvertQuestion = async () => {
    if (!conversionTarget) return;
    
    try {
      setIsConverting(true);
      
      const response = await fetch('https://ai.excelsoftcorp.com/aiapps/EXAMPREP/convert-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        body: JSON.stringify({
          question: conversionTarget.questionText,
          target_type: conversionType,
          count: conversionQuantity
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Update the generated questions in state
      const updatedGenerations = {
        ...questionGenerations,
        [conversionTarget.questionId]: {
          ...questionGenerations[conversionTarget.questionId],
          convertedQuestions: data.generated_questions.map((q: any, index: number) => ({
            id: `conv-${Date.now()}-${conversionTarget.questionId}-${index}`,
            text: q.question,
            questionType: data.target_type || conversionType
          }))
        }
      };
      
      setQuestionGenerations(updatedGenerations);
      
      toast({
        title: "Conversion Complete",
        description: `Successfully generated ${data.generated_questions.length} ${data.target_type || conversionType} questions.`,
      });
      
      setShowConversionModal(false);
    } catch (error) {
      console.error('Error converting question:', error);
      toast({
        title: "Conversion Failed",
        description: "Could not convert the question. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConverting(false);
    }
  };



  // Handle similar question generation
  const handleGenerateSimilar = async (question: Question) => {
  try {
      // Update the question to show loading state
    setQuestions(prev =>
      prev.map(q =>
        q.questionid === question.questionid
            ? { ...q, isGenerating: true, generatedQuestions: [] }
          : q
      )
    );
  
    const response = await fetch('https://ai.excelsoftcorp.com/aiapps/EXAMPREP/generate-similar-questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      body: JSON.stringify({
        question: question.questiontext,
        question_type: question.questiontypename,
        count: 3,
        context: `Class: ${question.classname}, Subject: ${question.subjectname}, Chapter: ${question.chaptername}`
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate similar questions');
    }

    const data = await response.json();
    
      // Transform the generated questions to match the GeneratedQuestion interface
      const generatedQuestions: GeneratedQuestion[] = data.generated_questions.map((q: any, index: number) => ({
        id: `gen-${Date.now()}-${index}`,
        text: q.question,
        questionType: question.questiontypename,
        isEditing: false
      }));

      // Update the question with the new generated questions
    setQuestions(prev =>
      prev.map(q =>
        q.questionid === question.questionid
            ? { 
                ...q, 
                generatedQuestions: [
                  ...(q.generatedQuestions || []),
                  ...generatedQuestions
                ],
                isGenerating: false 
              }
          : q
      )
    );
  } catch (error) {
    console.error('Error generating similar questions:', error);
      // Reset the loading state on error
      setQuestions(prev =>
        prev.map(q =>
          q.questionid === question.questionid
            ? { ...q, isGenerating: false }
            : q
        )
      );
    toast({
      title: "Error",
      description: "Failed to generate similar questions. Please try again.",
      variant: "destructive",
    });
  } 
};
    
const [orgcode, setOrgCode] = useState('ORG001'); // Default org code
const [userId, setUserId] = useState(12345); // Default user ID
  // Fetch questions from API
  const fetchQuestions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Skip fetching if required filters are not selected
    if (!selectedClass || selectedClass === 'select-class' || 
        !selectedSubject || selectedSubject === 'select-subject') {
      setQuestions([]);
      return;
    }
      // Build query parameters
      const params = new URLSearchParams({
        orgcode: orgcode,
        userid: userId.toString(),
      });
      if (selectedClass && selectedClass !== 'select-class') {
        params.append('classid', selectedClass);
      }
  
      if (selectedSubject && selectedSubject !== 'select-subject') {
        params.append('subjectid', selectedSubject);
      }
  
      // Add optional filters
      if (selectedYear && selectedYear !== 'select-year') {
        params.append('yearid', selectedYear);
      }
      if (selectedChapter && selectedChapter !== 'all-chapters') {
        params.append('chapterid', selectedChapter);
      }
      if (selectedTaxonomy && selectedTaxonomy !== 'all') {
        params.append('taxonomy', selectedTaxonomy);
      }
      if (selectedQuestionType && selectedQuestionType !== 'all') {
        params.append('questiontype', selectedQuestionType);
      }
      if (searchQuery) {
        params.append('searchtext', searchQuery);
      }
      
      // Add pagination
      params.append('pagesize', pageSize.toString());
      params.append('pageno', page.toString());
  
      const response = await fetch(`https://ai.excelsoftcorp.com/aiapps/EXAMPREP/get_questions_details?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }
  
      const data = await response.json();
      data.questions.forEach((question: Question) => {
        question.isGenerating = false;
      });
      setQuestions(data.questions || []);
    } catch (err) {
      // Only show error if we actually attempted to fetch (i.e., had all required filters)
      if (selectedClass && selectedClass !== 'select-class' && 
          selectedSubject && selectedSubject !== 'select-subject') {
      setError(err.message || 'An error occurred while fetching questions');
      toast({
        title: "Error",
        description: "Failed to fetch questions. Please try again.",
        variant: "destructive",
      });
      } else {
        setQuestions([]); // Clear questions when filters are invalid
      }
    } finally {
      setIsLoading(false);
    }
  }, [selectedClass, selectedSubject, selectedYear, selectedChapter, selectedTaxonomy, selectedQuestionType, searchQuery, page]);
  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);


  //Update the filter change handlers to reset to page 1 when filters change

  const handleClassChange = (value: string) => {
    setSelectedClass(value);
    setSelectedSubject('select-subject'); // Reset subject when class changes
    setSelectedChapter('all-chapters'); // Reset chapter when class changes
    setPage(1); // Reset to first page
  };
  
  const handleSubjectChange = (value: string) => {
    setSelectedSubject(value);
    setSelectedChapter('all-chapters'); // Reset chapter when subject changes
    setPage(1); // Reset to first page
  };
  // Similar handlers for other filters
  const handleYearChange = (value: string) => {
    setSelectedYear(value);
    setSelectedChapter('all-chapters'); // Reset chapter when year changes
    setPage(1); // Reset to first page
  };

  const handleChapterChange = (value: string) => {
    setSelectedChapter(value);
    setPage(1);
  };
  
  const handleTaxonomyChange = (value: string) => {
    setSelectedTaxonomy(value);
    setPage(1);
  };
  
  const handleQuestionTypeChange = (value: string) => {
    setSelectedQuestionType(value);
    setPage(1);
  };





  const getQuestionTypeBadgeStyle = (questionType: string) => {
    if (!questionType) return 'border-gray-300 text-gray-800 bg-gray-100';
    
    const type = questionType.toLowerCase();
    
    if (type.includes('mcq') || type.includes('multiple choice')) {
      return 'border-blue-300 text-blue-800 bg-blue-100';
    }
    
    if (type.includes('short') || type.includes('vsa')) {
      return 'border-green-300 text-green-800 bg-green-100';
    }
    
    if (type.includes('long') || type.includes('laq') || type.includes('essay')) {
      return 'border-purple-300 text-purple-800 bg-purple-100';
    }
    
    if (type.includes('assertion') || type.includes('reason')) {
      return 'border-orange-300 text-orange-800 bg-orange-100';
    }
    
    if (type.includes('case') || type.includes('study')) {
      return 'border-red-300 text-red-800 bg-red-100';
    }
    
    // Default for any other question types
    return 'border-gray-300 text-gray-800 bg-gray-100';
  };


  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      const response = await fetch("http://0.0.0.0:8066/upload-pdf-rag/", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      toast({
        title: "Upload Successful",
        description: `Added ${data.message}`,
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to process the PDF file",
        variant: "destructive"
      });
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const getFilteredQuestions = () => {
    const hasClassFilter = selectedClass && selectedClass !== 'select-class';
    const hasSubjectFilter = selectedSubject && selectedSubject !== 'select-subject';
    const hasYearFilter = selectedYears.length > 0;
    const hasChapterFilter = selectedChapter.length > 0;
    
    return questions.filter(question => {
      const classMatch = selectedClass === 'select-class' || question.classid?.toString() === selectedClass;
      const subjectMatch = selectedSubject === 'select-subject' || question.subjectid?.toString() === selectedSubject || question.subjectname === subjects.find(s => s.subjectid.toString() === selectedSubject)?.subjectname;
   
      const yearMatch = selectedYear === 'select-year' || question.yearid?.toString() === selectedYear;

      const chapterMatch = selectedChapter === 'all-chapters' || question.chapterid?.toString() === selectedChapter;
      
      // const yearMatch = !hasYearFilter || selectedYear.some(year => question.yearid.includes(year));
      
      const taxonomyMatch = selectedTaxonomy === 'all' || question.taxonomyid?.toString() === selectedTaxonomy;
      
      const questionTypeMatch = selectedQuestionType === 'all' || question.questiontypeid?.toString() === selectedQuestionType;
      
      const searchMatch = !searchQuery || question.questiontext.toLowerCase().includes(searchQuery.toLowerCase());
      
      return classMatch || subjectMatch || yearMatch || chapterMatch || taxonomyMatch || questionTypeMatch || searchMatch;
 });
};


  const openConversionModal = (questionId: string, questionText: string) => {
    setConversionTarget({ questionId, questionText });
    setShowConversionModal(true);
  };

  const previewPaper = (paper: QuestionPaper) => {
    navigate(`/question-bundle/${paper.id}`, { state: { bundle: paper, fileName: paper.name } });
  };

  // Export paper: fetch details from backend, then export to PDF
  const exportPaper = async (paper: QuestionPaper) => {
    toast({
      title: "Export Started",
      description: `Exporting \"${paper.name}\" paper...`,
    });
    try {
      // Fetch paper questions from backend
      const res = await import('./api').then(api => api.getPaperQuestionDetails(Number(paper.id)));
      // Defensive: handle new API structure (data[0].questioninfo)
      let questions = [];
      if (res.data && Array.isArray(res.data) && res.data[0]?.questioninfo) {
        questions = res.data[0].questioninfo;
      } else if (Array.isArray(res.p_refcur)) {
        questions = res.p_refcur;
      } else if (res.p_refcur) {
        questions = [res.p_refcur];
      }
      // Clean up questiontext: replace \n and \\n with real newlines, parse options from questionformat
      questions = questions.map(q => {
        let options = [];
        if (q.questionformat && typeof q.questionformat === 'string') {
          // Parse options from comma-separated string like "a.all,b.all,c.all,d.all"
          // Remove leading a), b), etc. if present
          options = q.questionformat.split(',').map(opt => {
            let cleaned = opt.trim().replace(/^([a-dA-D][).]|[a-dA-D]\.)\s*/, '');
            return cleaned.replace(/\s+/g, ' ');
          });
        }
        return {
          ...q,
          questiontext: (q.questiontext || '').replace(/\\n|\n/g, '\n'),
          options,
        };
      });
      // Export to PDF (show taxonomy, questiontext, questiontype, options, answer)
      await import('@/lib/exportPdf').then(mod => mod.exportQuestionsToPDF(questions, paper.name));
      toast({
        title: "Export Complete",
        description: `PDF exported for \"${paper.name}\"!`,
      });
    } catch (err: any) {
      toast({
        title: "Export Failed",
        description: err?.message || 'Could not export paper. Please try again.',
        variant: "destructive",
      });
    }
  };


  // Delete paper using backend API and refresh stats
  const deletePaper = async (paperId: string) => {
    try {
      // Call the DELETE API
      await import('./api').then(api => api.deletePaper(Number(paperId)));
      setQuestionPapers(questionPapers.filter(paper => paper.id !== paperId));
      toast({
        title: "Paper Deleted",
        description: "Question paper has been deleted successfully.",
      });
      // Optionally refresh stats from backend
      try {
        const res = await import('./api').then(api => api.getPaperDetails(orgcode, userId));
        let numPapers = 0, totalQuestions = 0;
        if (Array.isArray(res.p_refcur) && res.p_refcur.length > 0) {
          if (typeof res.p_refcur[0] === 'object') {
            numPapers = res.p_refcur[0].papercount ?? 0;
            totalQuestions = res.p_refcur[0].questioncount ?? 0;
          } else if (Array.isArray(res.p_refcur[0])) {
            [numPapers, totalQuestions] = res.p_refcur[0];
          }
        }
        setPaperStats({ numPapers, totalQuestions });
      } catch {}
    } catch (err: any) {
      toast({
        title: "Delete Failed",
        description: err?.message || 'Could not delete paper. Please try again.',
        variant: "destructive",
      });
    }
  };

  const handleConversion = () => {
    if (!conversionTarget) return;
    
    const quantity = parseInt(conversionQuantity);
    const converted: GeneratedQuestion[] = Array.from({ length: quantity }, (_, index) => ({
      id: `conv-${Date.now()}-${index + 1}`,
      text: `Converted Question ${index + 1} to ${conversionType}: ${conversionTarget.questionText} (Converted to ${conversionType} format)`,
      questionType: conversionType
    }));
    
    setQuestionGenerations(prev => ({
      ...prev,
      [conversionTarget.questionId]: {
        ...prev[conversionTarget.questionId],
        converted: converted
      }
    }));
    
    setShowConversionModal(false);
    setConversionTarget(null);
  };


  const saveGeneratedQuestion = (questionId: string, type: 'similar' | 'converted', id: string, newText: string) => {
    setQuestionGenerations(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [type]: prev[questionId]?.[type]?.map(q => 
          q.id === id ? { ...q, text: newText, isEditing: false } : q
        ) || []
      }
    }));
  };

  const cancelEditGeneratedQuestion = (questionId: string, type: 'similar' | 'converted', id: string) => {
    if (type === 'similar') {
      setQuestions(prevQuestions => 
        prevQuestions.map(question => {
          if (question.questionid === questionId && question.generatedQuestions) {
            return {
              ...question,
              generatedQuestions: question.generatedQuestions.map(gq => 
                gq.id === id ? { ...gq, isEditing: false } : gq
              )
            };
          }
          return question;
        })
      );
    } else {
      setQuestionGenerations(prev => {
        const updated = {
          ...prev,
          [questionId]: {
            ...prev[questionId],
            convertedQuestions: prev[questionId]?.convertedQuestions?.map(q => 
              q.id === id ? { ...q, isEditing: false } : q
            ) || []
          }
        };
        return updated;
      });
    }
  };
  

  // Function to edit a generated question
  const editGeneratedQuestion = (parentId: string, type: 'similar' | 'converted', questionId: string) => {
    console.log('Editing question:', { parentId, type, questionId });
    if (type === 'similar') {
      setQuestions(prevQuestions => 
        prevQuestions.map(question => {
          if (question.questionid === parentId && question.generatedQuestions) {
            return {
              ...question,
              generatedQuestions: question.generatedQuestions.map(gq => 
                gq.id === questionId ? { ...gq, isEditing: true } : gq
              )
            };
          }
          return question;
        })
      );
    } else {
      setQuestionGenerations(prev => {
        const updated = {
      ...prev,
          [parentId]: {
            ...prev[parentId],
            convertedQuestions: prev[parentId]?.convertedQuestions?.map(q => 
              q.id === questionId ? { ...q, isEditing: true } : q
            ) || []
          }
        };
        console.log('Updated questionGenerations:', updated);
        return updated;
      });
    }
  };

  // Function to save an edited question
  const saveEditedQuestion = (questionId: string, type: 'similar' | 'converted', parentId: string, newText: string) => {
    if (!newText.trim()) return;
    console.log('Saving question:', { questionId, type, parentId, newText });
    if (type === 'similar') {
      setQuestions(prevQuestions => 
        prevQuestions.map(question => {
          if (question.questionid === parentId && question.generatedQuestions) {
            return {
              ...question,
              generatedQuestions: question.generatedQuestions.map(gq => 
                gq.id === questionId 
                  ? { 
                      ...gq, 
                      text: newText,
                      isEditing: false 
                    } 
                  : gq
              )
            };
          }
          return question;
        })
      );
    } else {
      setQuestionGenerations(prev => {
        const updated = {
          ...prev,
          [parentId]: {
            ...prev[parentId],
            convertedQuestions: prev[parentId]?.convertedQuestions?.map(q => 
              q.id === questionId ? { ...q, text: newText, isEditing: false } : q
            ) || []
          }
        };
        console.log('Saved questionGenerations:', updated);
        return updated;
      });
    }
  };

  // Function to delete a generated question
  const deleteGeneratedQuestion = (parentId: string, type: 'similar' | 'converted', questionId: string) => {
    console.log('Deleting question:', { parentId, type, questionId });
    if (type === 'similar') {
      setQuestions(prevQuestions => 
        prevQuestions.map(question => {
          if (question.questionid === parentId && question.generatedQuestions) {
            return {
              ...question,
              generatedQuestions: question.generatedQuestions.filter(gq => gq.id !== questionId)
            };
          }
          return question;
        })
      );
    } else {
      setQuestionGenerations(prev => {
        const updated = {
          ...prev,
          [parentId]: {
            ...prev[parentId],
            convertedQuestions: prev[parentId]?.convertedQuestions?.filter(q => q.id !== questionId) || []
          }
        };
        console.log('After deletion questionGenerations:', updated);
        return updated;
      });
    }
  };

// Update your onClick handlers like this:
// For edit button:

// For save button (you'll need to add this in your edit mode UI):

// For delete button:
  // const deleteGeneratedQuestion = (questionId: string, type: 'similar' | 'converted', id: string) => {
  //   setQuestionGenerations(prev => ({
  //     ...prev,
  //     [questionId]: {
  //       ...prev[questionId],
  //       [type]: prev[questionId]?.[type]?.filter(q => q.id !== id) || []
  //     }
  //   }));
  // };

  // const addGeneratedToRepository = (generatedQuestion: GeneratedQuestion) => {
  //   const newQuestion: Question = {
  //     id: `repo-${Date.now()}`,
  //     question: generatedQuestion.text,
  //     type: 'Generated',
  //     year: 'AI Generated',
  //     chapter: 'AI Content',
  //     class: selectedClass,
  //     class_id: selectedClass,
  //     subject: selectedSubject,
  //     subject_id: selectedSubject,
  //     taxonomy: 'Application'
  //   };
    
  //   if (!repository.find(q => q.questiontext === newQuestion.questiontext)) {
  //     setRepository([...repository, newQuestion]);
  //     setAddedToRepository(prev => new Set(prev).add(generatedQuestion.id));
  //   }
  // };
  const handleSavePaper = () => {
    if (!paperName.trim()) {
      toast({
        title: "Paper Name Required",
        description: "Please enter a name for your question paper.",
        variant: "destructive",
      });
      return;
    }

    const filteredQuestions = getFilteredQuestions();
    // Main questions
    const selectedMainQuestions = filteredQuestions.filter(q => selectedQuestions.includes(q.questionid));
    // Generated questions (similar)
    const selectedGenerated = filteredQuestions.flatMap(q =>
      (q.generatedQuestions || []).filter(gq => selectedQuestions.includes(gq.id))
    );
    // Converted questions
    const selectedConverted = Object.values(questionGenerations).flatMap(qg =>
      (qg.convertedQuestions || []).filter(cq => selectedQuestions.includes(cq.id))
    );

    // Merge all selected
    const allSelected = [
      ...selectedMainQuestions.map(q => ({ ...q, _type: 'main' })),
      ...selectedGenerated.map(q => ({ ...q, _type: 'generated' })),
      ...selectedConverted.map(q => ({ ...q, _type: 'converted' })),
    ];

    if (allSelected.length === 0) {
      toast({
        title: "No Questions Selected",
        description: "Please select questions to create a paper.",
        variant: "destructive",
      });
      return;
    }

    // Helper to parse MCQ options from questionformat or text
    function parseOptions(q: any): string[] {
      // Try to parse from questionformat if present and is JSON
      if (q.questionformat) {
        try {
          const fmt = typeof q.questionformat === 'string' ? JSON.parse(q.questionformat) : q.questionformat;
          if (Array.isArray(fmt.options)) {
            return fmt.options;
          }
        } catch {}
      }
      // Fallback: extract all lines after the main question as options (for MCQ)
      const text = q.questiontext || q.text || '';
      // Split by both \n and actual newlines
      const lines = text.split(/\\n|\n/).map(l => l.trim()).filter(Boolean);
      // Find the first line that looks like an option (a), (b), etc. or a. b. etc.
      const optionStartIdx = lines.findIndex(l => /^([(]?[a-dA-D][).]|[a-dA-D]\.)\s?/.test(l));
      if (optionStartIdx !== -1) {
        // All lines from optionStartIdx onwards are options
        return lines.slice(optionStartIdx);
      }
      // If not found, fallback to lines starting with a., b., etc.
      const opts = lines.filter(l => /^[a-dA-D]\.\s?/.test(l));
      return opts.length > 0 ? opts : [];
    }

    // Helper to get answer (for MCQ, try to find answer in format or fallback)
    function getAnswer(q: any): string {
      if (q.answer) return q.answer;
      if (q.questionformat) {
        try {
          const fmt = typeof q.questionformat === 'string' ? JSON.parse(q.questionformat) : q.questionformat;
          if (fmt.answer) return fmt.answer;
        } catch {}
      }
      // Fallback: not available
      return '';
    }

    // Map to backend format
    const questioninfo = allSelected.map((q, idx) => {
      let options: string[] = [];
      let answer = '';
      let questiontype = '';
      let taxonomy = '';
      let questiontext = '';
      let parentid = idx.toString();

      if (q._type === 'main') {
        // Type guard for main questions
        if ('questiontypename' in q && typeof q.questiontypename === 'string') {
          questiontype = (q.questiontypename || '').toLowerCase();
        } else {
          questiontype = '';
        }
        taxonomy = 'taxonomyname' in q && typeof q.taxonomyname === 'string' ? q.taxonomyname : '';
        questiontext = 'questiontext' in q && typeof q.questiontext === 'string' ? q.questiontext : '';
        if (questiontype === 'mcq' || questiontype.includes('mcq')) {
          options = parseOptions(q);
          answer = getAnswer(q);
        }
      } else if (q._type === 'generated') {
        // Type guard for generated questions
        const genQ = q as GeneratedQuestion & { _type: string };
        questiontype = 'generated';
        taxonomy = '';
        questiontext = (genQ.text || (genQ as any).questiontext || '');
        // Try to parse MCQ if possible
        if (/mcq/i.test(questiontext)) {
          options = parseOptions(genQ);
        }
      } else if (q._type === 'converted') {
        // Type guard for converted questions
        const convQ = q as { id: string; text: string; questionType?: string; _type: string };
        questiontype = (convQ.questionType || '').toLowerCase();
        taxonomy = '';
        questiontext = convQ.text;
        if (questiontype === 'mcq' || questiontype.includes('mcq')) {
          options = parseOptions(convQ);
        }
      }
      return {
        parentid,
        questiontext,
        options,
        taxonomy,
        questiontype,
        answer,
      };
    });

    // TODO: Replace with actual orgcode/userid from context/auth
    // Fallback if not defined
    const orgcodeToUse = typeof orgcode !== 'undefined' ? orgcode : 'EPS';
    const userIdToUse = typeof userId !== 'undefined' ? userId : 'demo';

    // Call backend API
    fetch('https://ai.excelsoftcorp.com/aiapps/EXAMPREP/papersave', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orgcode: orgcode,
        userid: userId,
        papername: paperName.trim(),
        questioninfo,
      }),
    })
      .then(async (res) => {
        let data;
        try {
          data = await res.json();
        } catch (e) {
          // fallback for non-JSON error
          const errText = await res.text();
          throw new Error(errText || 'Failed to save paper');
        }
        if (!res.ok) {
          // Backend may still send JSON with status
          if (data.status === 'S002') {
            throw new Error('File name already exists, please try another name.');
          }
          throw new Error(data.message || 'Failed to save paper');
        }
        // Success, but also check for status S002 in success path defensively
        if (data.status === 'S002') {
          throw new Error('File name already exists, please try another name.');
        }
        return data;
      })
      .then((data) => {
        toast({
          title: 'Paper Saved',
          description: data.message || 'Question paper saved successfully.',
        });
        setShowCreatePaperModal(false);
        setSelectedQuestions([]);
        setPaperName('');
      })
      .catch((err) => {
        const msg = err.message || '';
        if (msg.includes('File name already exists')) {
          toast({
            title: 'Duplicate Paper Name',
            description: 'File name already exists, please try another name.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Save Failed',
            description: msg || 'Failed to save question paper.',
            variant: 'destructive',
          });
        }
      });
  };


//   const GeneratedQuestionsDisplay = ({ questionId, type }: { questionId: string, type: 'similar' | 'converted' }) => {
//     const questions = questionGenerations[questionId]?.[type] || [];
//     if (questions.length === 0) return null;

//     return (
//       <div className="mt-6 relative">
//         <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-200 to-blue-200 rounded-full"></div>
//         <div className="pl-6">
//           <div className="flex items-center gap-3 mb-4">
//             <div className={`w-8 h-8 rounded-full flex items-center justify-center ${type === 'similar' ? 'bg-gradient-to-r from-purple-500 to-purple-600' : 'bg-gradient-to-r from-blue-500 to-blue-600'} shadow-lg`}>
//               {type === 'similar' ? (
//                 <Sparkles className="w-4 h-4 text-white" />
//               ) : (
//                 <RefreshCw className="w-4 h-4 text-white" />
//               )}
//             </div>
//             <h4 className="text-lg font-semibold text-gray-800">
//               {type === 'similar' ? 'Generated Similar Questions' : 'Converted Questions'}
//             </h4>
//             <Badge variant="secondary" className="ml-auto">
//               {questions.length} questions
//             </Badge>
//           </div>
          
//           <div className="grid gap-4">
//             {questions.map((question, index) => (
//               <Card key={question.id} className="border border-gray-200 hover:border-gray-300 transition-all duration-200 bg-white">
//                 <CardContent className="p-4">
//                   <div className="flex items-start gap-4">
//                     <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
//                       {index + 1}
//                     </div>
//                      <div className="flex-1 min-w-0">
//                        {question.isEditing ? (
//                          <div className="space-y-3">
//                            <Textarea
//                              defaultValue={question.text}
//                              className="w-full border-gray-200 focus:border-purple-300 focus:ring-purple-200 rounded-lg"
//                              rows={3}
//                              onKeyDown={(e) => {
//                                if (e.key === 'Enter' && e.ctrlKey) {
//                                  saveGeneratedQuestion(questionId, type, question.id, e.currentTarget.value);
//                                }
//                              }}
//                            />
//                            <div className="flex gap-2">
//                              <Button
//                                size="sm"
//                                onClick={(e) => {
//                                  const textarea = e.currentTarget.parentElement?.parentElement?.querySelector('textarea');
//                                  if (textarea) {
//                                    saveGeneratedQuestion(questionId, type, question.id, textarea.value);
//                                  }
//                                }}
//                                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
//                              >
//                                <Check className="w-4 h-4" />
//                                Save
//                              </Button>
//                              <Button
//                                size="sm"
//                                variant="outline"
//                                onClick={() => cancelEditGeneratedQuestion(questionId, type, question.id)}
//                                className="flex items-center gap-2"
//                              >
//                                <X className="w-4 h-4" />
//                                Cancel
//                              </Button>
//                            </div>
//                          </div>
//                        ) : (
//                          <div className="space-y-3">
//                            <div className="flex flex-wrap items-center gap-2 mb-2">
//                              <Badge variant="outline" className={getQuestionTypeBadgeStyle(question.type)}>
//                                {question.question }
//                              </Badge>
//                            </div>
//                            <p className="text-gray-700 leading-relaxed text-base">{question.text}</p>
//                          </div>
//                        )}
//                     </div>
//                      {!question.isEditing && (
//                        <div className="flex items-center gap-2">
//                          <Button
//                            size="sm"
//                            variant="outline"
//                            onClick={() => editGeneratedQuestion(questionId, type, question.id)}
//                            className="p-2 hover:bg-gray-100 transition-colors"
//                            title="Edit question"
//                          >
//                            <Edit className="w-4 h-4 text-gray-600" />
//                          </Button>
//                          <Button
//                            size="sm"
//                            variant="outline"
//                            onClick={() => deleteGeneratedQuestion(questionId, type, question.id)}
//                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 transition-colors"
//                            title="Delete question"
//                          >
//                            <Trash2 className="w-4 h-4" />
//                          </Button>
                         
//                          {repository.find(q => q.question === question.question) && (
//             <div title="Saved to My Question Paper(s)" className="flex items-center">
//               <Bookmark className="w-4 h-4 text-blue-600 fill-blue-600" />
//             </div>
//                          )}
                         
//                           <input 
//                             type="checkbox" 
//                             className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
//                             onChange={(e) => {
//                               if (e.target.checked) {
//                                 setSelectedQuestions([...selectedQuestions, question.id]);
//                               } else {
//                                 setSelectedQuestions(selectedQuestions.filter(id => id !== question.id));
//                               }
//                             }}
//                             checked={selectedQuestions.includes(question.id)}
//                           />
//                        </div>
//                      )}
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/tools')}
                className="text-gray-600 hover:text-gray-900 hover:bg-blue-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Tools
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl flex items-center justify-center shadow-lg">
                  <GraduationCap className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Exam Prep Assist</h1>
                  <p className="text-sm text-gray-500">Smart CBSE Question Retrieval & AI Generation</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4" >
              {/* <div className="flex items-center"style={{display: 'none'}}>
                <input
                  type="file"
                  id="pdf-upload"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  disabled={isUploading}
                  onClick={() => document.getElementById('pdf-upload')?.click()}
                >
                  {isUploading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <FileText className="w-4 h-4" />
                  )}
                  Upload Past Paper
                </Button>
              </div> */}
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">AI Ready</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tool Introduction */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">CBSE Exam Assist</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find old board questions, generate new ones with AI, and create perfect exam materials in minutes
          </p>
        </div>

        {/* Main Tabs */}
                  <Tabs
                    value={activeTab}
                    onValueChange={async (tab) => {
                      setActiveTab(tab);
                      if (tab === 'repository') {
                        try {
                          const res = await import('./api').then(api => api.getPaperDetails(orgcode, userId));
                          let numPapers = 0, totalQuestions = 0;
                          if (Array.isArray(res.p_refcur) && res.p_refcur.length > 0) {
                            if (typeof res.p_refcur[0] === 'object') {
                              numPapers = res.p_refcur[0][0] ?? 0;
                              totalQuestions = res.p_refcur[0][1] ?? 0;
                            } else if (Array.isArray(res.p_refcur[0])) {
                              [numPapers, totalQuestions] = res.p_refcur[0];
                            }
                          }
                          setPaperStats({ numPapers, totalQuestions });
                          const papers = (res.p_refcur1 || []).map((row) => ({
                            id: String(row[0]),
                            name: row[1],
                            questions: Array(row[3]).fill({}),
                            createdAt: new Date(row[2]),
                            lastEditOn: new Date(row[2]),
                          }));
                          setQuestionPapers(papers);
                        } catch (err) {
                          setPaperStats({ numPapers: 0, totalQuestions: 0 });
                          setQuestionPapers([]);
                        }
                      }
                    }}
                    className="space-y-6"
                  >
          <TabsList className="grid w-full grid-cols-2 max-w-4xl mx-auto bg-white border-2 border-indigo-100 shadow-lg rounded-xl p-2 h-16 gap-2">
            <TabsTrigger value="search" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-indigo-200 transition-all duration-300 rounded-lg font-medium py-3 px-4 text-base">
              <Search className="w-5 h-5" />
              Question Search
            </TabsTrigger>
            <TabsTrigger value="repository" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-emerald-200 transition-all duration-300 rounded-lg font-medium py-3 px-4 text-base">
              <Bookmark className="w-5 h-5" />
              My Question Paper(s)
            </TabsTrigger>
          </TabsList>

          {/* Search Tab */}
          <TabsContent value="search" className="space-y-6">
            {/* Search Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Search Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Class</label>
                    <Select value={selectedClass} onValueChange={handleClassChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="select-class">Select Class</SelectItem>
                        {classes.map(cls => (
                          <SelectItem key={cls.classid} value={cls.classid.toString()}>
                            Class {cls.classname}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Subject</label>
                    <Select 
                      value={selectedSubject} 
                      onValueChange={handleSubjectChange}
                      disabled={!selectedClass || selectedClass === 'select-class'}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="select-subject">All Subjects</SelectItem>
                        {subjects.map(subject => (
                          <SelectItem 
                            key={subject.subjectid} 
                            value={subject.subjectid.toString()}
                          >
                            {subject.subjectname}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Year</label>
                    <Select 
                      value={selectedYear} 
                      onValueChange={handleYearChange}
                      disabled={!selectedClass || selectedClass === 'select-class'}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="select-year">All Years</SelectItem>
                        {years.map(year => (
                          <SelectItem 
                            key={year.yearid} 
                            value={year.yearid.toString()}>
                            {year.yearname}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Chapter</label>
                    <Select
                      value={selectedChapter}
                      onValueChange={handleChapterChange}
                      disabled={!selectedSubject || selectedSubject === 'select-subject'}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Chapter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-chapters">All Chapters</SelectItem>
                        {chapters.map((chapter) => (
                          <SelectItem 
                            key={chapter.chapterid} 
                            value={chapter.chapterid.toString()}
                          >
                            {chapter.chaptername}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search questions by keywords..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Button onClick={() => {}} className="bg-indigo-600 hover:bg-indigo-700">
                    <Search className="w-4 h-4 mr-2" />
                    Search Questions
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Advanced Filters - Always Visible */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Advanced Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  {/* Taxonomy Filter Dropdown */}
                  <div className="relative">
                    <label className="text-sm font-medium text-gray-700 block mb-2">Taxonomy Level</label>
                    <Select 
                      value={selectedTaxonomy} 
                      onValueChange={handleTaxonomyChange}
                      disabled={!selectedClass || selectedClass === 'select-class'}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Taxonomy" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Taxonomies</SelectItem>
                        {taxonomies.map(taxonomy => (
                          <SelectItem 
                            key={taxonomy.taxonomyid} 
                            value={taxonomy.taxonomyid.toString()}
                          >
                            {taxonomy.taxonomyname}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Question Type Filter Dropdown */}
                  <div className="relative">
                    <label className="text-sm font-medium text-gray-700 block mb-2">Question Type</label>
                    <Select 
                      value={selectedQuestionType} 
                      onValueChange={handleQuestionTypeChange}
                      disabled={!selectedClass || selectedClass === 'select-class'}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Question Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Question Types</SelectItem>
                        {questionTypes.map(qt => (
                          <SelectItem 
                            key={qt.questiontypeid} 
                            value={qt.questiontypeid.toString()}
                          >
                            {qt.questiontypename}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Search Results */}
            <div className='border border-gray-200'>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Search Results</CardTitle>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      const filteredQuestions = getFilteredQuestions();
                      const filteredIds = filteredQuestions.map(q => q.questionid);
                      const allFiltered = filteredIds.every(id => selectedQuestions.includes(id));
                      
                      if (allFiltered) {
                        setSelectedQuestions(prev => prev.filter(id => !filteredIds.includes(id)));
                      } else {
                        const newSelections = filteredIds.filter(id => !selectedQuestions.includes(id));
                        setSelectedQuestions(prev => [...prev, ...newSelections]);
                      }
                    }}
                    className="flex items-center gap-2"
                  >
                    <input 
                      type="checkbox" 
                      checked={(() => {
                        const filteredQuestions = getFilteredQuestions();
                        const filteredIds = filteredQuestions.map(q => q.questionid);
                        return filteredIds.length > 0 && filteredIds.every(id => selectedQuestions.includes(id));
                      })()}
                      readOnly
                      className="mr-1"
                    />
                    Select All
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      // Gather selected questions (main, generated, converted)
                      const filteredQuestions = getFilteredQuestions();
                      const selectedMainQuestions = filteredQuestions.filter(q => selectedQuestions.includes(q.questionid));
                      const selectedGenerated = filteredQuestions.flatMap(q =>
                        (q.generatedQuestions || []).filter(gq => selectedQuestions.includes(gq.id))
                      );
                      const selectedConverted = Object.values(questionGenerations).flatMap(qg =>
                        (qg.convertedQuestions || []).filter(cq => selectedQuestions.includes(cq.id))
                      );
                      const allSelected = [
                        ...selectedMainQuestions.map(q => ({ ...q, _type: 'main' })),
                        ...selectedGenerated.map(q => ({ ...q, _type: 'generated' })),
                        ...selectedConverted.map(q => ({ ...q, _type: 'converted' })),
                      ];
                      if (allSelected.length === 0) {
                        toast({ title: 'No Questions Selected', description: 'Please select questions to export.', variant: 'destructive' });
                        return;
                      }
                      // Add taxonomy and type fields for PDF export
                      const allSelectedWithMeta = allSelected.map(q => {
                        let taxonomy = '';
                        let questiontype = '';
                        if (q._type === 'main') {
                          taxonomy = 'taxonomyname' in q ? (q as Question).taxonomyname || '' : '';
                          questiontype = 'questiontypename' in q && typeof q.questiontypename === 'string' ? q.questiontypename : '';
                        } else if (q._type === 'generated') {
                          taxonomy = 'taxonomyname' in q ? (q as any).taxonomyname || '' : '';
                          questiontype = 'questiontypename' in q && typeof q.questiontypename === 'string'
                            ? q.questiontypename
                            : ('questionType' in q && typeof (q as any).questionType === 'string' ? (q as any).questionType : '');
                        } else if (q._type === 'converted') {
                          taxonomy = '';
                          questiontype = 'questionType' in q ? (q as { questionType?: string }).questionType || '' : '';
                        }
                        return {
                          ...q,
                          taxonomy,
                          questiontype,
                        };
                      });
                      exportQuestionsToPDF(allSelectedWithMeta, paperName || 'Question Paper');
                    }}
                    className="flex items-center gap-2"
                    disabled={selectedQuestions.length === 0}
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </Button>
                  <Button 
                    variant="default" 
                    onClick={() => setShowCreatePaperModal(true)}
                    className="flex items-center gap-2"
                    disabled={selectedQuestions.length === 0}
                  >
                    <Plus className="w-4 h-4" />
                    Add to my QN Paper
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {(() => {
                  const filteredQuestions = getFilteredQuestions();
                  
                  return filteredQuestions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <img 
                        src={searchPlaceholder} 
                        alt="No questions found" 
                        className="w-64 h-48 object-cover rounded-lg shadow-lg mb-6 opacity-80"
                      />
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        {selectedClass || selectedSubject || selectedChapter || searchQuery 
                          ? "No questions match your criteria" 
                          : "Select search criteria to begin"}
                      </h3>
                      <p className="text-gray-500 max-w-md">
                        {selectedClass || selectedSubject || selectedChapter || searchQuery
                          ? "Try adjusting your filters or search terms"
                          : "Choose class, subject, and other filters to find questions"}
                      </p>
                    </div>
                  ) : (
                    filteredQuestions.map((question: Question) => (
                      <Card key={question.questiontext} className="group hover:border-gray-300 transition-all duration-300 border border-gray-200 bg-white">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                <FileText className="w-5 h-5 text-gray-500" />
                              </div>
                            </div>
                            
                            <div className="flex-1 min-w-0 space-y-3">
                              <div className="flex flex-wrap items-center gap-2">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className={getQuestionTypeBadgeStyle(question.questiontypename)}>
                                    {question.questiontypename}
                                  </Badge>
                                  {question.yearname && (
                                    <Badge variant="outline" className="border-gray-200 text-gray-700 bg-gray-50">
                                      {question.yearname} CBSE Board - All India Set
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  {question.taxonomyname && (
                                    <Badge variant="outline" className="border-gray-200 text-gray-700 bg-gray-50">
                                      {question.taxonomyname}
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-2"> 
                                  {question.chaptername && (
                                    <Badge variant="outline" className="border-gray-200 text-gray-700 bg-gray-50">
                                      {question.chaptername}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <p 
                                className="text-gray-800 font-semibold leading-relaxed mb-2"
                                dangerouslySetInnerHTML={{ 
                                  __html: question.questiontext.replace(/\\n/g, '<br/>') 
                                }} 
                              />
                              
                              {/* Generated Questions Section */}
                              {question.generatedQuestions?.length > 0 && (
                                <div className="mt-6 w-full max-w-full overflow-hidden">
                                  <div className="flex items-center justify-between mb-3 px-4">
                                    <div className="flex items-center gap-2">
                                      <div className="flex items-center justify-center bg-black rounded-full w-7 h-7">
                                        <Sparkles className="w-3.5 h-3.5 text-white flex-shrink-0" />
                                      </div>
                                      <h3 className="font-semibold text-gray-700">Generated Similar Questions</h3>
                                    </div>
                                    <span className="text-xs font-semibold bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full border border-gray-300">
                                      {question.generatedQuestions.length} questions
                                    </span>
                                  </div>
                                  
                                  <div className="space-y-4 w-full px-4">
                                    {question.generatedQuestions.map((genQuestion, index) => (
                                      <div key={genQuestion.id} className="bg-white p-6 rounded-lg border border-gray-200 w-full shadow-sm">
                                        <div className="flex items-start gap-2">
                                          <span className="font-medium text-gray-700">{index + 1}.</span>
                                          <div className="flex-1 space-y-1">
                                            <div className="flex items-center gap-2 mb-1">
                                              <Badge variant="outline" className={getQuestionTypeBadgeStyle(question.questiontypename)}>
                                                {question.questiontypename}
                                              </Badge>
                                            </div>
                                            {genQuestion.isEditing ? (
                                              <div className="space-y-2">
                                                <textarea
                                                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                  defaultValue={genQuestion.text}
                                                  rows={3}
                                                  onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && e.ctrlKey) {
                                                      saveEditedQuestion(genQuestion.id, 'similar', question.questionid, e.currentTarget.value);
                                                    }
                                                  }}
                                                  autoFocus
                                                />
                                                <div className="flex justify-end space-x-2">
                                                  <button
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      cancelEditGeneratedQuestion(question.questionid, 'similar', genQuestion.id);
                                                    }}
                                                    className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
                                                  >
                                                    Cancel
                                                  </button>
                                                  <button
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      const textarea = e.currentTarget.closest('.space-y-2')?.querySelector('textarea');
                                                      if (textarea) {
                                                        saveEditedQuestion(genQuestion.id, 'similar', question.questionid, textarea.value);
                                                      }
                                                    }}
                                                    className="px-3 py-1 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                                                  >
                                                    Save
                                                  </button>
                                                </div>
                                              </div>
                                            ) : (
                                              <p 
                                                className="text-gray-800 leading-relaxed mb-2" 
                                                style={{ whiteSpace: 'pre-wrap' }}>
                                                {genQuestion.text}
                                              </p>
                                            )}
                                            <p className="text-xs text-gray-500 mt-2 italic">
                                              {index === 0 }
                                              {index === 1 }
                                              {index === 2 }
                                            </p>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-2">
                                              <div className="bg-blue-50 p-1.5 rounded border border-blue-100 hover:bg-blue-100 transition-colors">
                                                <button 
                                                  type="button" 
                                                  className="text-blue-600 hover:text-blue-700 flex items-center justify-center"
                                                  title="Edit question"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    editGeneratedQuestion(question.questionid, 'similar', genQuestion.id);
                                                    console.log('Edit question:', genQuestion.id);
                                                  }}
                                                >
                                                  <Edit className="w-4 h-4" />
                                                </button>
                                              </div>
                                              <div className="bg-red-50 p-1.5 rounded border border-red-100 hover:bg-red-100 transition-colors">
                                                <button 
                                                  type="button" 
                                                  className="text-red-600 hover:text-red-700 flex items-center justify-center"
                                                  title="Delete question"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (window.confirm('Are you sure you want to delete this question?')) {
                                                      deleteGeneratedQuestion(question.questionid, 'similar', genQuestion.id);
                                                    console.log('Delete question:', genQuestion.id);
                                                    }
                                                  }}
                                                >
                                                  <Trash2 className="w-4 h-4" />
                                                </button>
                                              </div>
                                            </div>
                                            <input 
                                              type="checkbox" 
                                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                              checked={selectedQuestions.includes(genQuestion.id)}
                                              onChange={(e) => {
                                                if (e.target.checked) {
                                                  setSelectedQuestions([...selectedQuestions, genQuestion.id]);
                                                } else {
                                                  setSelectedQuestions(selectedQuestions.filter(id => id !== genQuestion.id));
                                                }
                                              }}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Converted Questions Section */}
                              {questionGenerations[question.questionid]?.convertedQuestions?.length > 0 && (
                                <div className="mt-6 w-full max-w-full overflow-hidden">
                                  <div className="flex items-center justify-between mb-3 px-4">
                                    <div className="flex items-center gap-2">
                                      <div className="flex items-center justify-center bg-blue-600 rounded-full w-7 h-7">
                                        <RefreshCw className="w-3.5 h-3.5 text-white flex-shrink-0" />
                                      </div>
                                      <h3 className="font-semibold text-gray-700">Converted Questions</h3>
                                    </div>
                                    <span className="text-xs font-semibold bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full border border-gray-300">
                                      {questionGenerations[question.questionid].convertedQuestions.length} questions
                                    </span>
                                  </div>
                                  
                                  <div className="space-y-4 w-full px-4">
                                    {questionGenerations[question.questionid].convertedQuestions.map((convQuestion, index) => (
                                      <div key={convQuestion.id} className="bg-white p-6 rounded-lg border border-gray-200 w-full shadow-sm">
                                        <div className="flex items-start gap-3">
                                          <span className="font-medium text-gray-500 mt-0.5">{index + 1}.</span>
                                          <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                              <Badge variant="outline" className={getQuestionTypeBadgeStyle(convQuestion.questionType) + " text-xs"}>
                                                {convQuestion.questionType}
                                              </Badge>
                                            </div>
                                            {convQuestion.isEditing ? (
                                              <div className="space-y-2 w-full">
                                                <textarea
                                                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                  defaultValue={convQuestion.text}
                                                  rows={3}
                                                  onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && e.ctrlKey) {
                                                      saveEditedQuestion(convQuestion.id, 'converted', question.questionid, e.currentTarget.value);
                                                    }
                                                  }}
                                                  autoFocus
                                                />
                                                <div className="flex justify-end space-x-2">
                                                  <button
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      cancelEditGeneratedQuestion(question.questionid, 'converted', convQuestion.id);
                                                    }}
                                                    className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
                                                  >
                                                    Cancel
                                                  </button>
                                                  <button
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      const textarea = e.currentTarget.closest('.space-y-2')?.querySelector('textarea');
                                                      if (textarea) {
                                                        saveEditedQuestion(convQuestion.id, 'converted', question.questionid, textarea.value);
                                                      }
                                                    }}
                                                    className="px-3 py-1 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                                                  >
                                                    Save
                                                  </button>
                                                </div>
                                              </div>
                                            ) : (
                                              <p 
                                                className="text-gray-800 leading-relaxed" 
                                                style={{ whiteSpace: 'pre-wrap' }}>
                                                {convQuestion.text}
                                              </p>
                                            )}
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-2">
                                              <div className="bg-blue-50 p-1.5 rounded border border-blue-100 hover:bg-blue-100 transition-colors">
                                                <button 
                                                  type="button" 
                                                  className="text-blue-600 hover:text-blue-700 flex items-center justify-center"
                                                  title="Edit question"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    editGeneratedQuestion(question.questionid, 'converted', convQuestion.id);
                                                    console.log('Edit question:', convQuestion.id);
                                                  }}
                                                >
                                                  <Edit className="w-4 h-4" />
                                                </button>
                                              </div>
                                              <div className="bg-red-50 p-1.5 rounded border border-red-100 hover:bg-red-100 transition-colors">
                                                <button 
                                                  type="button" 
                                                  className="text-red-600 hover:text-red-700 flex items-center justify-center"
                                                  title="Delete question"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (window.confirm('Are you sure you want to delete this question?')) {
                                                      deleteGeneratedQuestion(question.questionid, 'converted', convQuestion.id);
                                                    console.log('Delete question:', convQuestion.id);
                                                    }
                                                  }}
                                                >
                                                  <Trash2 className="w-4 h-4" />
                                                </button>
                                              </div>
                                            </div>
                                            <input 
                                              type="checkbox" 
                                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                              checked={selectedQuestions.includes(convQuestion.id)}
                                              onChange={(e) => {
                                                if (e.target.checked) {
                                                  setSelectedQuestions([...selectedQuestions, convQuestion.id]);
                                                } else {
                                                  setSelectedQuestions(selectedQuestions.filter(id => id !== convQuestion.id));
                                                }
                                              }}
                                            />
                                          </div>
                                          {/* <div className="flex items-start mt-1">
                                            <input 
                                              type="checkbox" 
                                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                                              checked={selectedQuestions.includes(convQuestion.id)}
                                              onChange={(e) => {
                                                if (e.target.checked) {
                                                  setSelectedQuestions([...selectedQuestions, convQuestion.id]);
                                                } else {
                                                  setSelectedQuestions(selectedQuestions.filter(id => id !== convQuestion.id));
                                                }
                                              }}
                                            />
                                          </div> */}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}


                              
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1 bg-white/80">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleGenerateSimilar(question)}
                                  className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-100 transition-colors"
                                  title="Generate Similar Questions"
                                  disabled={question.isGenerating}>
                                  {question.isGenerating ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Sparkles className="w-4 h-4" />
                                  )}
                                </Button>
                                
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => openConversionModal(question.questionid, question.questiontext)}
                                  className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-100 transition-colors"
                                  title="Convert Question Type"
                                >
                                  <RefreshCw className="w-4 h-4" />
                                </Button>
                              </div>
                              
                              <input 
                                type="checkbox" 
                                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedQuestions([...selectedQuestions, question.questionid]);
                                  } else {
                                    setSelectedQuestions(selectedQuestions.filter(id => id !== question.questionid));
                                  }
                                }}
                                checked={selectedQuestions.includes(question.questionid)}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  );
                })()}
              </CardContent>
            </Card>
            </div>
          </TabsContent>

          {/* Repository Tab */}
          <TabsContent value="repository" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => {
                      // Refetch paper details when the tab title is clicked
                      (async () => {
                        try {
                          const res = await import('./api').then(api => api.getPaperDetails(orgcode, userId));
                          let numPapers = 0, totalQuestions = 0;
                          if (Array.isArray(res.p_refcur) && res.p_refcur.length > 0) {
                            if (typeof res.p_refcur[0] === 'object') {
                              numPapers = res.p_refcur[0][0] ?? 0;
                              totalQuestions = res.p_refcur[0][1] ?? 0;
                            } else if (Array.isArray(res.p_refcur[0])) {
                              [numPapers, totalQuestions] = res.p_refcur[0];
                            }
                          }
                          setPaperStats({ numPapers, totalQuestions });
                          // Map backend papers to UI QuestionPaper[]
                          const papers = (res.p_refcur1 || []).map((row) => ({
                            id: String(row[0]),
                            name: row[1],
                            questions: Array(row[3]).fill({}),
                            createdAt: new Date(row[2]),
                            lastEditOn: new Date(row[2]),
                          }));
                          setQuestionPapers(papers);
                        } catch (err) {
                          setPaperStats({ numPapers: 0, totalQuestions: 0 });
                          setQuestionPapers([]);
                        }
                      })();
                    }}
                  >
                    <Bookmark className="w-5 h-5" />
                    My Question Paper(s)
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Save and organize your favorite questions for future use
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="px-3 py-1">
                    {questionPapers.length} Paper{questionPapers.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Card className="mb-6 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border-indigo-200 shadow-xl">
                  <CardContent className="p-4">
                    <div className="text-center space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          My Question Paper(s) Overview
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Your organized question collection at a glance
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
                        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/60 hover:shadow-xl transition-all duration-300">
                          <div className="flex items-center justify-center mb-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                              <BookOpen className="w-5 h-5 text-white" />
                            </div>
                          </div>
                          <div className="text-2xl font-bold text-indigo-600 mb-1">
                            {paperStats.totalQuestions}
                          </div>
                          <div className="text-sm font-semibold text-gray-700">
                            Total Questions
                          </div>
                        </div>
                        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/60 hover:shadow-xl transition-all duration-300">
                          <div className="flex items-center justify-center mb-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                              <FileText className="w-5 h-5 text-white" />
                            </div>
                          </div>
                          <div className="text-2xl font-bold text-emerald-600 mb-1">
                            {paperStats.numPapers}
                          </div>
                          <div className="text-sm font-semibold text-gray-700">
                            Question Paper{paperStats.numPapers !== 1 ? 's' : ''}
                          </div>
                        </div>
                        {questionPapers.length === 0 && (
                          <div className="mt-8 p-6 bg-white/70 rounded-xl border border-gray-200">
                          <div className="flex items-center justify-center mb-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                              <Bookmark className="w-6 h-6 text-gray-400" />
                            </div>
                          </div>
                          <p className="text-gray-600 text-lg mb-4">
                            No question papers yet
                          </p>
                          <p className="text-gray-500 text-sm">
                            Start building your collection by creating papers from the search results
                          </p>
                          <Button 
                            onClick={() => setActiveTab('search')}
                            className="mt-4 bg-indigo-600 hover:bg-indigo-700"
                          >
                            <Search className="w-4 h-4 mr-2" />
                            Browse Questions
                          </Button>
                        </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {questionPapers.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Question Papers</CardTitle>
                      <p className="text-sm text-gray-600">Your exported question collections</p>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4">
                        {questionPapers.map((paper) => (
                          <Card key={paper.id} className="border border-gray-200 hover:border-gray-300 transition-colors">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-gray-900 mb-2">{paper.name}</h3>
                                  <div className="space-y-1 text-sm text-gray-600">
                                    <p>Last Edit On: {paper.lastEditOn.toLocaleDateString()}</p>
                                    <p>Total Questions: {paper.questions.length}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => previewPaper(paper)}
                                    className="text-blue-600 hover:text-blue-700"
                                  >
                                    <FileText className="w-4 h-4 mr-1" />
                                    Preview
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => exportPaper(paper)}
                                    className="text-green-600 hover:text-green-700"
                                  >
                                    <Download className="w-4 h-4 mr-1" />
                                    Export
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={async () => {
                                      await deletePaper(paper.id);
                                      // Refresh papers after delete
                                      try {
                                        const res = await import('./api').then(api => api.getPaperDetails(orgcode, userId));
                                        let numPapers = 0, totalQuestions = 0;
                                        if (Array.isArray(res.p_refcur) && res.p_refcur.length > 0) {
                                          if (typeof res.p_refcur[0] === 'object') {
                                            numPapers = res.p_refcur[0][0] ?? 0;
                                            totalQuestions = res.p_refcur[0][1] ?? 0;
                                          } else if (Array.isArray(res.p_refcur[0])) {
                                            [numPapers, totalQuestions] = res.p_refcur[0];
                                          }
                                        }
                                        setPaperStats({ numPapers, totalQuestions });
                                        const papers = (res.p_refcur1 || []).map((row) => ({
                                          id: String(row[0]),
                                          name: row[1],
                                          questions: Array(row[3]).fill({}),
                                          createdAt: new Date(row[2]),
                                          lastEditOn: new Date(row[2]),
                                        }));
                                        setQuestionPapers(papers);
                                      } catch (err) {
                                        setPaperStats({ numPapers: 0, totalQuestions: 0 });
                                        setQuestionPapers([]);
                                      }
                                    }}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Conversion Modal */}
      <Dialog open={showConversionModal} onOpenChange={setShowConversionModal}>
        <DialogContent className="sm:max-w-l">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className={`w-5 h-5 text-blue-600 ${isConverting ? 'animate-spin' : ''}`} />
              Convert Question Type
            </DialogTitle>
            <DialogDescription>
            Choose the target question type and specify how many variations you'd like to generate.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4" >
            <div className="space-y-2" style={{ display: "none" }}>
              <Label>Original Question</Label>
              <div className="p-3 rounded-md bg-gray-50 border text-sm">
                {conversionTarget?.questionText}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="conversion-type">Convert to Question Type</Label>
              <Select value={conversionType} onValueChange={setConversionType}>
                <SelectTrigger id="conversion-type">
                  <SelectValue placeholder="Select question type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MCQ">Multiple Choice Question (MCQ)</SelectItem>
                  <SelectItem value="Short Answer">Short Answer</SelectItem>
                  <SelectItem value="Long Answer">Long Answer</SelectItem>
                  <SelectItem value="Assertion-Reason">Assertion-Reason</SelectItem>
                  <SelectItem value="Case Study">Case Study</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="conversion-quantity">Number of Questions</Label>
              <Select value={conversionQuantity} onValueChange={setConversionQuantity}>
                <SelectTrigger id="conversion-quantity">
                  <SelectValue placeholder="Select quantity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Question</SelectItem>
                  <SelectItem value="2">2 Questions</SelectItem>
                  <SelectItem value="3">3 Questions</SelectItem>
                  <SelectItem value="4">4 Questions</SelectItem>
                  <SelectItem value="5">5 Questions</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2" style={{ display: "none" }}>
              <Label htmlFor="conversion-context">Additional Context (Optional)</Label>
              <Textarea
                id="conversion-context"
                placeholder="Add any specific context or requirements for the converted questions..."
                value={conversionContext}
                onChange={(e) => setConversionContext(e.target.value)}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Provide any additional context to guide the question generation.
              </p>
            </div>
          </div>
          
          <DialogFooter className="sm:justify-between">
            <Button 
              variant="outline" 
              onClick={() => setShowConversionModal(false)}
              disabled={isConverting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConvertQuestion}
              disabled={isConverting}
            >
              {isConverting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Converting...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Convert Questions
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Paper Modal */}
      <Dialog open={showCreatePaperModal} onOpenChange={setShowCreatePaperModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              Create Question Paper
            </DialogTitle>
            <DialogDescription>
              Enter a name for this question paper to organize your selected questions.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="paper-name">Paper Name</Label>
              <Input
                id="paper-name"
                placeholder="e.g., Science Chapter 1 Practice Questions"
                value={paperName}
                onChange={(e) => setPaperName(e.target.value)}
              />
            </div>
            <div className="text-sm text-gray-600">
              This paper will contain {selectedQuestions.length} selected question{selectedQuestions.length !== 1 ? 's' : ''}.
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreatePaperModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePaper} className="bg-indigo-600 hover:bg-indigo-700">
              <BookOpen className="w-4 h-4 mr-2" />
              Save Paper
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExamAssistPrep;
function setQuestionPapers(papers: QuestionPaper[]) {
  // This is a placeholder for the actual state setter.
  // In the component, setQuestionPapers is a useState setter, so this is not needed.
  // If you need a standalone function, you can lift this to a prop or context.
  // For now, do nothing or log for debugging.
  // Example: setQuestionPapers(papers) is already defined by useState above.
}

