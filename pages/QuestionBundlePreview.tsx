import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Edit, FileText, Calendar, Hash, Save, X, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// API call to get paper question details
export async function getPaperQuestionDetails(par_paperid: number) {
  const response = await fetch(`https://ai.excelsoftcorp.com/aiapps/EXAMPREP/uspgetpaperquestiondetails`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ par_paperid }),
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch paper question details: ${response.statusText}`);
  }
  return response.json();
}
// API call to update paper name
export async function updatePaper(paperId: number, papername: string, par_status: string) {
  const response = await fetch(`https://ai.excelsoftcorp.com/aiapps/EXAMPREP/paperedit/${paperId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ papername, par_status }),
  });
  if (!response.ok) {
    throw new Error(`Failed to update paper: ${response.statusText}`);
  }
  return response.json();
}

interface Question {
  id: string;
  text: string;
  type: 'Knowledge' | 'Understanding' | 'Application';
  marks: number;
  isBookmarked?: boolean;
  questionformat?: string;
}

interface QuestionBundle {
  id: string;
  name: string;
  lastEditOn: Date;
  questions: Question[];
}

const QuestionBundlePreview = () => {
  const navigate = useNavigate();
  const { bundleId } = useParams();
  const location = useLocation();
  
  // Helper to map backend taxonomy to UI label
  const taxonomyLabel = (name: string) => {
    if (!name) return '';
    if (name.toLowerCase() === 'apply') return 'Application';
    if (name.toLowerCase() === 'understand') return 'Understanding';
    if (name.toLowerCase() === 'knowledge') return 'Knowledge';
    return name;
  };

  // Always map backend response to UI structure if present
  const [bundle, setBundle] = useState<QuestionBundle | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        let paperId = null;
        if (location.state?.paperid) {
          paperId = location.state.paperid;
        } else if (location.state?.par_paperid) {
          paperId = location.state.par_paperid;
        } else if (location.state?.bundle?.id) {
          paperId = location.state.bundle.id;
        }
        if (!paperId) {
          setError('No paper id provided.');
          setLoading(false);
          return;
        }
        const data = await getPaperQuestionDetails(Number(paperId));
        // Support both old and new API response structures
        let questions = [];
        if (Array.isArray(data.p_refcur)) {
          // Old structure
          questions = data.p_refcur.map((q: any, idx: number) => ({
            id: String(q.questionid ?? idx),
            text: q.questiontext ?? '',
            type: taxonomyLabel(q.taxonomyname ?? ''),
            marks: 1,
            questionformat: q.questionformat ? q.questionformat.split(',').join('    ').replace(/,/g, '') : ''
          }));
        } else if (Array.isArray(data.data) && data.data[0]?.questioninfo) {
          // New structure (your provided sample)
          questions = data.data[0].questioninfo.map((q: any, idx: number) => ({
            id: String(q.parentid ?? idx),
            text: q.questiontext ?? '',
            type: taxonomyLabel(q.taxonomy ?? ''),
            marks: 1,
            questionformat: q.questionformat ? q.questionformat.split(',').join('    ').replace(/,/g, '') : ''
          }));
        }
        // Prefer fileName from navigation state, then backend, then fallback
        let paperName = location.state?.fileName || null;
        if (!paperName && Array.isArray(data.p_refcur1)) {
          const found = data.p_refcur1.find((p: any) => String(p.paperid) === String(paperId));
          if (found && found.papername) {
            paperName = found.papername;
          }
        }
        if (!paperName && data.papername) {
          paperName = data.papername;
        }
        if (!paperName) {
          paperName = 'Paper';
        }
        setBundle({
          id: String(paperId),
          name: paperName,
          lastEditOn: new Date(),
          questions,
        });
      } catch (err: any) {
        setError(err.message || 'Failed to fetch paper question details.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);
  const [isEditingBundle, setIsEditingBundle] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);
  const [bundleName, setBundleName] = useState(bundle?.name || '');
  
  // Handle back navigation with state preservation
  const handleBackNavigation = () => {
    // Use browser's back navigation to preserve all state including scroll position
    window.history.back();
  };
  
  // Save bundle name and update in DB
  const handleSaveBundleName = async () => {
    if (bundle && bundleName.trim()) {
      try {
        // Call backend API to update paper name
        const result = await updatePaper(Number(bundle.id), bundleName.trim(), 'active');
        const updatedBundle = {
          ...bundle,
          name: result.papername || bundleName.trim(),
          lastEditOn: new Date()
        };
        setBundle(updatedBundle);
        setIsEditingBundle(false);
        toast({
          title: "Bundle Updated",
          description: "Bundle name has been successfully updated in the database.",
        });
      } catch (error: any) {
        toast({
          title: "Update Failed",
          description: error.message || 'Failed to update bundle name in the database.',
          variant: 'destructive',
        });
      }
    }
  };
  
  const handleQuestionEdit = (questionId: string, updatedText: string, type: string, marks: number) => {
    if (bundle) {
      const updatedQuestions = bundle.questions.map(q => 
        q.id === questionId 
          ? { ...q, text: updatedText, type: type as 'Knowledge' | 'Understanding' | 'Application', marks }
          : q
      );
      const updatedBundle = {
        ...bundle,
        questions: updatedQuestions,
        lastEditOn: new Date()
      };
      setBundle(updatedBundle);
      setEditingQuestion(null);
      toast({
        title: "Question Updated",
        description: "Question has been successfully updated.",
      });
    }
  };
  
  const handleDeleteQuestion = (questionId: string) => {
    if (bundle) {
      const updatedQuestions = bundle.questions.filter(q => q.id !== questionId);
      const updatedBundle = {
        ...bundle,
        questions: updatedQuestions,
        lastEditOn: new Date()
      };
      setBundle(updatedBundle);
      toast({
        title: "Question Deleted",
        description: "Question has been successfully deleted.",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-lg text-gray-700">Loading paper questions...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }
  if (!bundle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-lg text-gray-700">No bundle data found.</div>
      </div>
    );
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Knowledge':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Understanding':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Application':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBackNavigation}
                className="hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <FileText className="w-6 h-6 text-blue-600" />
                    {isEditingBundle ? (
                      <Input 
                        value={bundleName}
                        onChange={(e) => setBundleName(e.target.value)}
                        className="text-2xl font-bold"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveBundleName();
                          if (e.key === 'Escape') setIsEditingBundle(false);
                        }}
                        autoFocus
                      />
                    ) : (
                      bundle?.name
                    )}
                  </h1>
                  {isEditingBundle ? (
                    <div className="flex gap-1">
                      <Button size="sm" onClick={handleSaveBundleName}>
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setIsEditingBundle(false)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setIsEditingBundle(true)}
                      className="ml-2"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Last edited: {bundle.lastEditOn.toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Hash className="w-4 h-4" />
                    {bundle.questions.length} questions
                  </span>
                </div>
              </div>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Edit className="w-4 h-4 mr-2" />
              Edit Questions
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Bundle Stats */}
        <Card className="mb-6 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {bundle.questions.filter(q => q.type === 'Knowledge').length}
                </div>
                <div className="text-sm font-medium text-blue-700">Knowledge Questions</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {bundle.questions.filter(q => q.type === 'Understanding').length}
                </div>
                <div className="text-sm font-medium text-green-700">Understanding Questions</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                <div className="text-3xl font-bold text-purple-600 mb-1">
                  {bundle.questions.filter(q => q.type === 'Application').length}
                </div>
                <div className="text-sm font-medium text-purple-700">Application Questions</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions List */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bundle.questions.map((question, index) => (
                <Card key={question.id} className="border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md">
                  <CardContent className="p-6">
                    {editingQuestion === question.id ? (
                      <EditQuestionForm 
                        question={question}
                        onSave={handleQuestionEdit}
                        onCancel={() => setEditingQuestion(null)}
                      />
                    ) : (
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-sm font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              Q{index + 1}
                            </span>
                            <Badge 
                              variant="outline" 
                              className={`${getTypeColor(question.type)} font-medium`}
                            >
                              {question.type}
                            </Badge>
                            
                          </div>
                          {/* Hide question if it only contains newlines or is empty after trimming */}
                          {question.text && question.text.replace(/\n/g, '').trim() !== '' ? (
                            <p className="text-gray-900 text-base leading-relaxed white-space: pre-line;" style={{ whiteSpace: 'pre-line' }}>
                              {question.text.replace(/\\n/g, '\n')}
                            </p>
                          ) : null}
                          {question.questionformat && (
                            <p className="text-gray-700 text-sm leading-relaxed mt-2 whitespace-pre-line">
                              {question.questionformat}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {bundle.questions.length === 0 && (
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Questions Yet</h3>
              <p className="text-gray-600">This bundle doesn't contain any questions.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

// Edit Question Form Component
const EditQuestionForm = ({ question, onSave, onCancel }: {
  question: Question;
  onSave: (id: string, text: string, type: string, marks: number) => void;
  onCancel: () => void;
}) => {
  const [questionText, setQuestionText] = useState(question.text);
  const [questionType, setQuestionType] = useState(question.type);
  const [questionMarks, setQuestionMarks] = useState((question.marks || 1).toString());

  const handleSave = () => {
    if (questionText.trim() && questionMarks) {
      onSave(question.id, questionText.trim(), questionType, parseInt(questionMarks));
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Select value={questionType} onValueChange={(value) => setQuestionType(value as 'Knowledge' | 'Understanding' | 'Application')}>
          <SelectTrigger>
            <SelectValue placeholder="Select question type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Knowledge">Knowledge</SelectItem>
            <SelectItem value="Understanding">Understanding</SelectItem>
            <SelectItem value="Application">Application</SelectItem>
          </SelectContent>
        </Select>
        
        <Input
          type="number"
          value={questionMarks}
          onChange={(e) => setQuestionMarks(e.target.value)}
          placeholder="Marks"
          min="1"
        />
      </div>
      
      <Textarea
        value={questionText}
        onChange={(e) => setQuestionText(e.target.value)}
        placeholder="Enter question text..."
        rows={4}
      />
      
      <div className="flex gap-2">
        <Button onClick={handleSave} disabled={!questionText.trim() || !questionMarks}>
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
        <Button variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default QuestionBundlePreview;

