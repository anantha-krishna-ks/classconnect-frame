import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
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

const QuizDisplay = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { questions, quizData, origin } = location.state as {
    questions: Question[];
    quizData: QuizData;
    origin?: 'preview' | 'listing';
  };


  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});

  if (!questions || !quizData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No quiz data found</h2>
          <p className="text-gray-500 mb-4">Please generate a quiz first.</p>
          <Button onClick={() => navigate('/quiz-generator')}>
            Back to Quiz Generator
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerChange = (value: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const getQuestionNumber = (index: number) => {
    return index + 1;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (origin === 'listing') {
                    navigate('/quiz-generator'); // 👈 go to listing
                  } else {
                    navigate('/quiz-generator/preview', { state: { quizData, questions } }); // 👈 go to preview
                  }
                }}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to {origin === 'listing' ? 'Quiz Listing' : 'Teacher View'}
              </Button>

              <div>
                <h1 className="text-2xl font-bold text-gray-900">{quizData.name}</h1>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{quizData.subject}</span>
                  <span>•</span>
                  <span>{quizData.grade}</span>
                  <span>•</span>
                  <span>{quizData.chapter}</span>
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Progress</span>
            <span>{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                Question {getQuestionNumber(currentQuestionIndex)}
              </CardTitle>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-xs">
                  {currentQuestion.difficulty}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {currentQuestion.type?.replace('-', ' ') || ''}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-gray-900 text-base leading-relaxed">
                {currentQuestion.text}
              </p>
            </div>

            {/* Answer Options */}
            <div className="space-y-4">
              {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
                <RadioGroup
                  value={selectedAnswers[currentQuestion.id] || ''}
                  onValueChange={handleAnswerChange}
                  className="space-y-3"
                >
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                        <span className="font-medium text-sm text-gray-600 mr-2">
                          {String.fromCharCode(65 + index)}.
                        </span>
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {currentQuestion.type === 'true-false' && currentQuestion.options && (
                <RadioGroup
                  value={selectedAnswers[currentQuestion.id] || ''}
                  onValueChange={handleAnswerChange}
                  className="space-y-3"
                >
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value={option} id={`tf-option-${index}`} />
                      <Label htmlFor={`tf-option-${index}`} className="flex-1 cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {currentQuestion.type === 'short-answer' && (
                <div className="space-y-2">
                  <Label>Your Answer:</Label>
                  <textarea
                    className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows={4}
                    placeholder="Type your answer here..."
                    value={selectedAnswers[currentQuestion.id] || ''}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {/* Question Navigator */}
          <div className="flex items-center gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${index === currentQuestionIndex
                    ? 'bg-purple-600 text-white'
                    : selectedAnswers[questions[index].id]
                      ? 'bg-green-100 text-green-600 border border-green-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            onClick={handleNext}
            disabled={currentQuestionIndex === questions.length - 1}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Quiz Completion */}
        {/* {currentQuestionIndex === questions.length - 1 && (
          <Card className="mt-6 border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-green-900 mb-2">
                  You've reached the end of the quiz!
                </h3>
                <p className="text-green-700 mb-4">
                  Review your answers or submit when you're ready.
                </p>
                <div className="flex justify-center gap-4">
                  <Button variant="outline" onClick={() => setCurrentQuestionIndex(0)}>
                    Review from Start
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700">
                    Submit Quiz
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )} */}
      </div>
    </div>
  );
};

export default QuizDisplay;