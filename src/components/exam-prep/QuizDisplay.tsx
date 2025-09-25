import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Upload, FileText, CheckCircle, Clock, BookOpen } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { examPrepData } from '@/data/examPrepData';

interface QuizDisplayProps {
  quiz: any;
  uploadedAnswers: boolean;
  showEvaluation: boolean;
  onUpload: () => void;
  onEvaluate: () => void;
  onBack: () => void;
}

const QuizDisplay: React.FC<QuizDisplayProps> = ({
  quiz,
  uploadedAnswers,
  showEvaluation,
  onUpload,
  onEvaluate,
  onBack
}) => {
  const evaluation = examPrepData.evaluationData.sampleEvaluation;

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
                  <FileText className="w-5 h-5" />
                  Practice Quiz
                </CardTitle>
                <CardDescription>Generated on {quiz.createdAt}</CardDescription>
              </div>
            </div>
            <Badge variant="outline">{quiz.totalMarks} Marks</Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Quiz Details */}
      <Card className="bg-gradient-to-br from-muted/30 to-muted/10 border-border/50">
        <CardHeader>
          <CardTitle>Quiz Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="font-medium">Subject:</span> {quiz.subject}
            </div>
            <div>
              <span className="font-medium">Total Marks:</span> {quiz.totalMarks}
            </div>
            <div>
              <span className="font-medium">Chapters:</span> {quiz.chapters}
            </div>
            {quiz.timeLimit && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="font-medium">Time Limit:</span> {quiz.timeLimit} minutes
              </div>
            )}
          </div>
          
          <div>
            <span className="font-medium">Concepts:</span>
            <p className="text-sm text-muted-foreground mt-1">{quiz.concepts}</p>
          </div>
        </CardContent>
      </Card>

      {/* Questions */}
      <Card>
        <CardHeader>
          <CardTitle>Quiz Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {quiz.questions.map((question: any, index: number) => (
            <div key={question.id} className="border rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">Q{index + 1}. {question.question}</h4>
                <Badge variant="secondary">{question.marks} marks</Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                Concept: {question.concept} | Type: {question.type}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Alert>
        <BookOpen className="h-4 w-4" />
        <AlertDescription>
          <strong>Instructions:</strong> Answer all questions on your answer sheet and upload it below for evaluation.
          Make sure your answers are clear and well-structured.
        </AlertDescription>
      </Alert>

      {/* Upload & Evaluation Section */}
      <Card>
        <CardHeader>
          <CardTitle>Submit Your Answers</CardTitle>
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
                      <strong>Evaluation Complete!</strong> Your quiz has been evaluated with detailed feedback.
                    </AlertDescription>
                  </Alert>

                  {/* Results Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  </div>

                  {/* Question-wise Analysis */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Question-wise Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {evaluation.questionWiseAnalysis.map((analysis, index) => (
                        <div key={index} className="border rounded-lg p-3 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Question {analysis.questionNo}</span>
                            <Badge variant={analysis.attempted ? "default" : "destructive"}>
                              {analysis.marksObtained}/{analysis.totalMarks}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{analysis.feedback}</p>
                        </div>
                      ))}
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
                          {evaluation.improvementAreas.map((area, index) => (
                            <li key={index} className="text-sm flex items-start gap-2">
                              <span className="text-red-500 mt-1">•</span>
                              {area}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-green-600">Strengths</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {evaluation.strengths.map((strength, index) => (
                            <li key={index} className="text-sm flex items-start gap-2">
                              <span className="text-green-500 mt-1">•</span>
                              {strength}
                            </li>
                          ))}
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

export default QuizDisplay;