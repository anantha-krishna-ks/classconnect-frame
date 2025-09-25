import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Upload, FileText, CheckCircle, Clock, BookOpen } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { examPrepData } from '@/data/examPrepData';

interface MockExamDisplayProps {
  exam: any;
  uploadedAnswers: boolean;
  showEvaluation: boolean;
  onUpload: () => void;
  onEvaluate: () => void;
  onBack: () => void;
}

const MockExamDisplay: React.FC<MockExamDisplayProps> = ({
  exam,
  uploadedAnswers,
  showEvaluation,
  onUpload,
  onEvaluate,
  onBack
}) => {
  const evaluation = {
    ...examPrepData.evaluationData.sampleEvaluation,
    totalMarks: 100,
    obtainedMarks: 78,
    percentage: 78,
    grade: 'A-'
  };

  const sectionColors = {
    A: 'bg-blue-100 text-blue-800 border-blue-200',
    B: 'bg-green-100 text-green-800 border-green-200', 
    C: 'bg-orange-100 text-orange-800 border-orange-200',
    D: 'bg-purple-100 text-purple-800 border-purple-200'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Mock Examination
                </CardTitle>
                <CardDescription>Generated on {exam.createdAt}</CardDescription>
              </div>
            </div>
            <Badge variant="outline">{exam.totalMarks} Marks</Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Exam Details */}
      <Card>
        <CardHeader>
          <CardTitle>Examination Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="font-medium">Subject:</span> {exam.subject}
            </div>
            <div>
              <span className="font-medium">Duration:</span> {exam.timeLimit} minutes
            </div>
            <div>
              <span className="font-medium">Total Marks:</span> {exam.totalMarks}
            </div>
          </div>
          
          <div>
            <span className="font-medium">Chapters Covered:</span>
            <p className="text-sm text-muted-foreground mt-1">{exam.chapters}</p>
          </div>
        </CardContent>
      </Card>

      {/* Exam Sections */}
      {Object.entries(exam.sections).map(([sectionKey, questions]: [string, any]) => (
        <Card key={sectionKey}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge className={sectionColors[sectionKey as keyof typeof sectionColors]}>
                Section {sectionKey}
              </Badge>
              <span>
                {sectionKey === 'A' && 'Multiple Choice Questions'}
                {sectionKey === 'B' && 'Short Answer Questions'}  
                {sectionKey === 'C' && 'Long Answer Questions'}
                {sectionKey === 'D' && 'Application Based Questions'}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {questions.map((question: any, index: number) => (
              <div key={question.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">
                    Q{index + 1}. {question.question}
                  </h4>
                  <Badge variant="secondary">
                    {question.marks || (sectionKey === 'A' ? 1 : sectionKey === 'B' ? 5 : sectionKey === 'C' ? 8 : 10)} marks
                  </Badge>
                </div>
                
                {sectionKey === 'A' && question.options && (
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {question.options.map((option: string, optIndex: number) => (
                      <div key={optIndex} className="text-sm bg-muted/50 p-2 rounded">
                        ({String.fromCharCode(97 + optIndex)}) {option}
                      </div>
                    ))}
                  </div>
                )}
                
                {sectionKey !== 'A' && (
                  <div className="text-sm text-muted-foreground">
                    Type: {question.type}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {/* Instructions */}
      <Alert>
        <BookOpen className="h-4 w-4" />
        <AlertDescription>
          <strong>Instructions:</strong> This is a full-length mock examination. Answer all sections according to the given instructions. 
          Section A requires choosing the correct option, while other sections require detailed written answers. 
          Upload your complete answer sheet for evaluation.
        </AlertDescription>
      </Alert>

      {/* Upload & Evaluation Section */}
      <Card>
        <CardHeader>
          <CardTitle>Submit Your Answer Sheet</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!uploadedAnswers ? (
            <Button onClick={onUpload} className="w-full" size="lg">
              <Upload className="w-4 h-4 mr-2" />
              Upload Answer Sheet
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span>Answer sheet uploaded successfully!</span>
              </div>
              
              {!showEvaluation ? (
                <Button onClick={onEvaluate} className="w-full" size="lg">
                  <FileText className="w-4 h-4 mr-2" />
                  Evaluate Answers
                </Button>
              ) : (
                <div className="space-y-6">
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Evaluation Complete!</strong> Your mock exam has been evaluated with detailed analysis.
                    </AlertDescription>
                  </Alert>

                  {/* Results Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <div className="text-2xl font-bold text-primary">
                          {evaluation.obtainedMarks}/{evaluation.totalMarks}
                        </div>
                        <p className="text-sm text-muted-foreground">Total Score</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {evaluation.percentage}%
                        </div>
                        <p className="text-sm text-muted-foreground">Percentage</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {evaluation.grade}
                        </div>
                        <p className="text-sm text-muted-foreground">Grade</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <div className="text-lg font-bold text-orange-600">
                          {exam.timeLimit} min
                        </div>
                        <p className="text-sm text-muted-foreground">Duration</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Section-wise Performance */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Section-wise Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {Object.entries(exam.sections).map(([sectionKey, questions]: [string, any]) => (
                          <div key={sectionKey} className="text-center p-4 border rounded-lg">
                            <div className={`inline-flex px-2 py-1 rounded text-sm font-medium mb-2 ${sectionColors[sectionKey as keyof typeof sectionColors]}`}>
                              Section {sectionKey}
                            </div>
                            <div className="text-lg font-bold">
                              {Math.floor(Math.random() * 5) + 15}/20
                            </div>
                            <div className="text-sm text-muted-foreground">marks</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Improvement Areas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-red-600">Areas for Improvement</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          <li className="text-sm flex items-start gap-2">
                            <span className="text-red-500 mt-1">•</span>
                            Section D: Need more practice with application-based problems
                          </li>
                          <li className="text-sm flex items-start gap-2">
                            <span className="text-red-500 mt-1">•</span>
                            Time management: Spend less time on Section A
                          </li>
                          <li className="text-sm flex items-start gap-2">
                            <span className="text-red-500 mt-1">•</span>
                            Work on presenting step-by-step solutions clearly
                          </li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-green-600">Strengths</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          <li className="text-sm flex items-start gap-2">
                            <span className="text-green-500 mt-1">•</span>
                            Excellent performance in Section A (MCQs)
                          </li>
                          <li className="text-sm flex items-start gap-2">
                            <span className="text-green-500 mt-1">•</span>
                            Good conceptual understanding shown in Section B
                          </li>
                          <li className="text-sm flex items-start gap-2">
                            <span className="text-green-500 mt-1">•</span>
                            Well-structured answers in Section C
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MockExamDisplay;