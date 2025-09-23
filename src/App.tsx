import { Toaster } from "@/components/ui/toaster";
import SessionPlanOutput from "./pages/SessionPlanOutput";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import RoleSelection from "./pages/RoleSelection";
import Login from "./pages/Login";
import ToolsDashboard from "./pages/ToolsDashboard";
import LessonPlanAssistant from "./pages/LessonPlanAssistant";
import LessonPlanOutput from "./pages/LessonPlanOutput";
import LessonPlanOptions from "./pages/LessonPlanOptions";
import LessonPlanTraditional from "./pages/LessonPlanTraditional";
import SessionList from "./pages/SessionList";
import CreateSession from "./pages/CreateSession";
import ExamAssistPrep from "./pages/ExamAssistPrep";
import QuestionBundlePreview from "./pages/QuestionBundlePreview";
import SlideGenerator from "./pages/SlideGenerator";
import SlideGeneratorLessonPlan from "./pages/SlideGeneratorLessonPlan";
import SlideGeneratorTemplates from "./pages/SlideGeneratorTemplates";
import AssessmentAssist from "./pages/AssessmentAssist";
import AssessmentCreate from "./pages/AssessmentCreate";
import AssessmentELOSelection from "./pages/AssessmentELOSelection";
import QuizListing from "./pages/QuizListing";
import QuizCreate from "./pages/QuizCreate";
import QuizPreview from "./pages/QuizPreview";
import QuizDisplay from "./pages/QuizDisplay";
import VideoClipEditor from "./pages/VideoClipEditor";
import SessionPlanPreview from "./pages/SessionPlanPreview";
import UnitPlanPreview from "./pages/UnitPlanPreview";
import ParentDashboard from "./pages/ParentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import StudentLogin from "./pages/StudentLogin";
import AdminLogin from "./pages/AdminLogin";
import ParentLogin from "./pages/ParentLogin";
import AdminComingSoon from "./pages/AdminComingSoon";
import StudentComingSoon from "./pages/StudentComingSoon";
import ParentComingSoon from "./pages/ParentComingSoon";
import ResourceVault from "./pages/ResourceVault";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RoleSelection />} />
          <Route path="/login" element={<Login />} />
          <Route path="/tools" element={<ToolsDashboard />} />
          <Route path="/lesson-plan-assistant" element={<LessonPlanAssistant />} />
          <Route path="/lesson-plan" element={<Index />} />
          <Route path="/lesson-plan-options" element={<LessonPlanOptions />} />
          <Route path="/lesson-plan-output" element={<LessonPlanOutput />} />
          <Route path="/lesson-plan-traditional" element={<LessonPlanTraditional />} />
          <Route path="/session/:id/:grade/:subject" element={<SessionList />} />
          <Route path="/session/:id" element={<SessionList />} />
          <Route path="/session/create/:lessonId" element={<CreateSession />} />
          <Route path="/session-plan-preview" element={<SessionPlanPreview />} />
          <Route path="/unit-plan-preview" element={<UnitPlanPreview />} />
          <Route path="/exam-assist-prep" element={<ExamAssistPrep />} />
          <Route path="/slide-generator" element={<SlideGenerator />} />
          <Route path="/slide-generator/lesson-plan" element={<SlideGeneratorLessonPlan />} />
          <Route path="/slide-generator/templates" element={<SlideGeneratorTemplates />} />
          <Route path="/video-clip-editor" element={<VideoClipEditor />} />
          <Route path="/assessment-assist" element={<AssessmentAssist />} />
          <Route path="/assessment-assist/create" element={<AssessmentCreate />} />
          <Route path="/assessment-assist/elo-selection" element={<AssessmentELOSelection />} />
          <Route path="/quiz-generator" element={<QuizListing />} />
          <Route path="/quiz-generator/create" element={<QuizCreate />} />
          <Route path="/quiz-generator/preview" element={<QuizPreview />} />
          <Route path="/quiz-generator/preview/:id" element={<QuizPreview />} />
          <Route path="/quiz-generator/display" element={<QuizDisplay />} />
          <Route path="/question-bundle/:bundleId" element={<QuestionBundlePreview />} />
          <Route path="/parent-dashboard" element={<ParentDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/student-login" element={<StudentLogin />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/parent-login" element={<ParentLogin />} />
          <Route path="/session-plan-output" element={<SessionPlanOutput />} />
          
          {/* Admin Tools - Coming Soon */}
          <Route path="/teacher-insight" element={<AdminComingSoon />} />
          <Route path="/student-profiling" element={<AdminComingSoon />} />
          <Route path="/parent-interview" element={<AdminComingSoon />} />
          <Route path="/alumni-feedback" element={<AdminComingSoon />} />
          <Route path="/teacher-hiring" element={<AdminComingSoon />} />
          <Route path="/admission-fit" element={<AdminComingSoon />} />
          <Route path="/student-risk" element={<AdminComingSoon />} />

          {/* Student Tools - Coming Soon */}
          <Route path="/focus-buddy" element={<StudentComingSoon />} />
          <Route path="/smart-revision" element={<StudentComingSoon />} />
          <Route path="/mix-master" element={<StudentComingSoon />} />
          <Route path="/quick-recall" element={<StudentComingSoon />} />
          <Route path="/confidence-tracker" element={<StudentComingSoon />} />
          <Route path="/exam-prep" element={<StudentComingSoon />} />
          <Route path="/mock-test" element={<StudentComingSoon />} />
          <Route path="/resource-vault" element={<ResourceVault />} />
          <Route path="/announcements" element={<StudentComingSoon />} />
          <Route path="/calendar" element={<StudentComingSoon />} />
          <Route path="/mood-mirror" element={<StudentComingSoon />} />
          <Route path="/study-buddy" element={<StudentComingSoon />} />
          <Route path="/goal-setter" element={<StudentComingSoon />} />

          {/* Parent Tools - Coming Soon */}
          <Route path="/progress-pulse" element={<ParentComingSoon />} />
          <Route path="/career-spark" element={<ParentComingSoon />} />
          <Route path="/focus-wellbeing" element={<ParentComingSoon />} />
          <Route path="/study-recommender" element={<ParentComingSoon />} />
          <Route path="/concept-checkin" element={<ParentComingSoon />} />
          <Route path="/attendance-monitor" element={<ParentComingSoon />} />
          <Route path="/resource-library" element={<ParentComingSoon />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
