import { useState } from "react";
import { Search, Check, X, BookOpen, BarChart3, Presentation, GraduationCap, Video, FolderOpen, FileText, Brain, Sparkles, MessageSquare, Users, TrendingUp, Settings, FileSpreadsheet, Eye, Bell, Calendar, Award, Timer, CalendarClock, Shuffle, Zap, Megaphone, Heart, Target, ClipboardList, UserCheck, MessageCircle, GraduationCapIcon, UserPlus, AlertTriangle, CreditCard, LineChart, Compass, MessageCircleQuestion, Library } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function ProductAssignment() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedTools, setSelectedTools] = useState<Record<string, boolean>>({});
  const [activatedTools, setActivatedTools] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  // Mock products/tools data organized by role
  const productsByRole = {
    teacher: [
      {
        id: "lesson-plan",
        name: "Lesson Plan Assistant",
        description: "AI-powered lesson planning tool",
        icon: BookOpen,
        iconBg: "bg-blue-500",
      },
      {
        id: "assessment",
        name: "Assessment Creator",
        description: "Create and manage assessments",
        icon: BarChart3,
        iconBg: "bg-green-500",
      },
      {
        id: "slide-generator",
        name: "Slide Generator",
        description: "AI presentation creator",
        icon: Presentation,
        iconBg: "bg-rose-500",
      },
      {
        id: "video-editor",
        name: "Video Clip Editor",
        description: "Educational video editing",
        icon: Video,
        iconBg: "bg-cyan-500",
      },
      {
        id: "resource-vault",
        name: "Resource Vault",
        description: "Centralized resource library",
        icon: FolderOpen,
        iconBg: "bg-amber-500",
      },
      {
        id: "quiz-creator",
        name: "Quiz Creator",
        description: "Interactive quiz generation",
        icon: FileText,
        iconBg: "bg-purple-500",
      },
      {
        id: "content-enhancer",
        name: "Content Enhancer",
        description: "AI-powered content improvement",
        icon: Sparkles,
        iconBg: "bg-yellow-500",
      },
    ],
    student: [
      {
        id: "focus-buddy",
        name: "Focus Buddy",
        description: "Timed study sessions with breaks using Pomodoro technique",
        icon: Timer,
        iconBg: "bg-blue-500",
      },
      {
        id: "smart-revision-planner",
        name: "Smart Revision Planner",
        description: "Schedules revisions using spaced repetition for long-term retention",
        icon: CalendarClock,
        iconBg: "bg-green-500",
      },
      {
        id: "mix-master",
        name: "Mix & Master",
        description: "Mixes questions from different chapters to strengthen retention",
        icon: Shuffle,
        iconBg: "bg-purple-500",
      },
      {
        id: "quick-recall-ai",
        name: "Quick Recall AI",
        description: "Daily quizzes to practice active recall and strengthen memory",
        icon: Zap,
        iconBg: "bg-amber-500",
      },
      {
        id: "confidence-tracker",
        name: "Confidence Tracker",
        description: "Rate confidence after each topic to build self-awareness",
        icon: TrendingUp,
        iconBg: "bg-orange-500",
      },
      {
        id: "exam-prep-room",
        name: "Exam Prep Room",
        description: "Practice tests, past papers, and chapter-wise mock tests",
        icon: GraduationCap,
        iconBg: "bg-indigo-500",
      },
      {
        id: "mock-test-generator",
        name: "Mock Test Generator",
        description: "Generate full-length mock tests with scoring and feedback",
        icon: ClipboardList,
        iconBg: "bg-teal-500",
      },
      {
        id: "resource-vault-student",
        name: "Resource Vault",
        description: "Access school-approved study materials, notes, and video lessons",
        icon: FolderOpen,
        iconBg: "bg-purple-600",
      },
      {
        id: "school-announcements",
        name: "School Announcements Hub",
        description: "Stay informed about exams, events, holidays, and circulars",
        icon: Megaphone,
        iconBg: "bg-red-500",
      },
      {
        id: "calendar-deadlines",
        name: "Calendar & Deadlines Tracker",
        description: "Track assignments, tests, holidays, and revision milestones",
        icon: Calendar,
        iconBg: "bg-emerald-500",
      },
      {
        id: "mood-mirror",
        name: "Mood Mirror",
        description: "Daily check-ins to manage stress, anxiety, and focus",
        icon: Heart,
        iconBg: "bg-pink-500",
      },
      {
        id: "study-buddy-connect",
        name: "Study Buddy Connect",
        description: "Find classmates with similar topics or goals to study together",
        icon: Users,
        iconBg: "bg-cyan-500",
      },
      {
        id: "goal-setter",
        name: "Goal Setter",
        description: "Set personal academic goals and track progress",
        icon: Target,
        iconBg: "bg-violet-500",
      },
    ],
    admin: [
      {
        id: "teacher-insight-ai",
        name: "Teacher Insight AI",
        description: "Evaluates recorded classes to assess teaching clarity, pedagogy, and engagement",
        icon: Brain,
        iconBg: "bg-blue-500",
      },
      {
        id: "student-profiling-ai",
        name: "Student Profiling AI",
        description: "Builds a longitudinal view of each student's academic, behavioral, and engagement trends",
        icon: UserCheck,
        iconBg: "bg-green-500",
      },
      {
        id: "parent-interview-analyzer",
        name: "Parent Interview Analyzer",
        description: "Assesses recorded parent interviews to evaluate alignment with school culture",
        icon: MessageCircle,
        iconBg: "bg-purple-500",
      },
      {
        id: "alumni-feedback-miner",
        name: "Alumni Feedback Miner",
        description: "Extracts insights from alumni stories to inform school improvement, branding, and outcome tracking",
        icon: GraduationCap,
        iconBg: "bg-orange-500",
      },
      {
        id: "teacher-hiring-evaluator",
        name: "Teacher Hiring Evaluator",
        description: "Reviews demo class recordings with AI to support bias-free, evidence-based teacher recruitment",
        icon: FileText,
        iconBg: "bg-indigo-500",
      },
      {
        id: "admission-fit-evaluator",
        name: "Admission Fit Evaluator",
        description: "Analyzes student and parent interviews to assess cultural fit, preparedness, and potential for success",
        icon: UserPlus,
        iconBg: "bg-teal-500",
      },
      {
        id: "student-risk-radar",
        name: "Student Risk Radar",
        description: "Flags students at risk of disengagement or exit using academic, behavioral, and parental signals",
        icon: AlertTriangle,
        iconBg: "bg-red-500",
      },
      {
        id: "subscription-portal",
        name: "Subscription Portal",
        description: "Customize and assign learning tools to individual teachers, manage subscriptions, and activate SarasSchool AI",
        icon: CreditCard,
        iconBg: "bg-cyan-500",
      },
    ],
    parent: [
      {
        id: "progress-pulse",
        name: "Progress Pulse",
        description: "Weekly insights into your child's learning progress — strengths, struggles, and effort",
        icon: LineChart,
        iconBg: "bg-blue-500",
      },
      {
        id: "career-spark",
        name: "Career Spark",
        description: "Uncover your child's interests and talents through school activities and performance patterns",
        icon: Compass,
        iconBg: "bg-purple-500",
      },
      {
        id: "focus-wellbeing-meter",
        name: "Focus & Wellbeing Meter",
        description: "Track subtle signs of stress or distraction, with tips to support your child's focus",
        icon: Heart,
        iconBg: "bg-pink-500",
      },
      {
        id: "smart-study-recommender",
        name: "Smart Study Recommender",
        description: "Personalized videos, articles, and activities based on your child's current topics and needs",
        icon: BookOpen,
        iconBg: "bg-green-500",
      },
      {
        id: "concept-check-in",
        name: "Concept Check-In",
        description: "A simple way to reflect on and share how confident your child feels about each topic",
        icon: MessageCircleQuestion,
        iconBg: "bg-orange-500",
      },
      {
        id: "attendance-schedule-monitor",
        name: "Attendance & Schedule Monitor",
        description: "Stay updated on your child's attendance, timetable, and upcoming school events",
        icon: Calendar,
        iconBg: "bg-indigo-500",
      },
      {
        id: "learning-resource-library",
        name: "Learning Resource Library",
        description: "Access curated learning materials that support your child's classwork and revision",
        icon: Library,
        iconBg: "bg-cyan-500",
      },
    ],
  };

  const getActiveCount = (role: keyof typeof productsByRole) => {
    return productsByRole[role].filter((p) => selectedTools[p.id]).length;
  };

  const getTotalCount = (role: keyof typeof productsByRole) => {
    return productsByRole[role].length;
  };

  const handleToolToggle = (toolId: string, enabled: boolean) => {
    setSelectedTools((prev) => ({
      ...prev,
      [toolId]: enabled,
    }));
  };

  const handleActivate = () => {
    if (!selectedSchool) {
      toast({
        title: "No school selected",
        description: "Please select a school first",
        variant: "destructive",
      });
      return;
    }

    const activatedCount = Object.values(selectedTools).filter(Boolean).length;
    if (activatedCount === 0) {
      toast({
        title: "No tools selected",
        description: "Please select at least one tool to activate",
        variant: "destructive",
      });
      return;
    }

    setShowConfirmDialog(true);
  };

  const confirmActivation = () => {
    const allProducts = [...productsByRole.teacher, ...productsByRole.student];
    const activatedToolsList = allProducts.filter((p) => selectedTools[p.id]);
    toast({
      title: "Tools activated successfully",
      description: `${activatedToolsList.length} tools have been activated for the selected school`,
    });
    setShowConfirmDialog(false);
    setActivatedTools({ ...selectedTools });
  };

  const handleCancel = () => {
    setSelectedTools({ ...activatedTools });
    toast({
      title: "Changes cancelled",
      description: "Toggle switches have been reset to their last saved state",
    });
  };

  const allProducts = [...productsByRole.teacher, ...productsByRole.student, ...productsByRole.admin, ...productsByRole.parent];
  const activatedToolsList = allProducts.filter((p) => selectedTools[p.id]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Product & Tool Assignment</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage product licenses and tool access for schools
        </p>
      </div>

      {/* School Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select School</CardTitle>
          <CardDescription>Choose a school to manage its product licenses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Select value={selectedSchool} onValueChange={setSelectedSchool}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a school" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Lincoln High School</SelectItem>
                  <SelectItem value="2">Roosevelt Middle School</SelectItem>
                  <SelectItem value="3">Jefferson Elementary</SelectItem>
                  <SelectItem value="4">Washington Academy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleActivate}
              disabled={!selectedSchool}
              className="gap-2"
            >
              <Check className="w-4 h-4" />
              Activate Selected Tools
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Available Products & Tools</CardTitle>
          <CardDescription>
            Toggle tools on/off to activate or deactivate licenses by role
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="teacher" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="teacher" className="gap-2">
                Teacher Tools
                <Badge variant="secondary" className="ml-auto">
                  {getActiveCount("teacher")}/{getTotalCount("teacher")}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="student" className="gap-2">
                Student Tools
                <Badge variant="secondary" className="ml-auto">
                  {getActiveCount("student")}/{getTotalCount("student")}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="admin" className="gap-2">
                Admin Tools
                <Badge variant="secondary" className="ml-auto">
                  {getActiveCount("admin")}/{getTotalCount("admin")}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="parent" className="gap-2">
                Parent Tools
                <Badge variant="secondary" className="ml-auto">
                  {getActiveCount("parent")}/{getTotalCount("parent")}
                </Badge>
              </TabsTrigger>
            </TabsList>

            {(Object.keys(productsByRole) as Array<keyof typeof productsByRole>).map((role) => (
              <TabsContent key={role} value={role} className="space-y-4">
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder={`Search ${role} tools...`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {productsByRole[role]
                    .filter((product) =>
                      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      product.description.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((product) => {
                      const Icon = product.icon;
                      return (
                        <Card key={product.id}>
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3 flex-1">
                                <div className={`w-10 h-10 rounded ${product.iconBg} flex items-center justify-center shrink-0`}>
                                  <Icon className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-medium text-sm">{product.name}</h3>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {product.description}
                                  </p>
                                </div>
                              </div>
                              <Switch
                                checked={selectedTools[product.id] || false}
                                onCheckedChange={(checked) => handleToolToggle(product.id, checked)}
                                disabled={!selectedSchool}
                                className="ml-3"
                              />
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
          
          <div className="mt-6 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={!selectedSchool || JSON.stringify(selectedTools) === JSON.stringify(activatedTools)}
              className="gap-2"
            >
              <X className="w-4 h-4" />
              Cancel Changes
            </Button>
            <Button
              onClick={handleActivate}
              disabled={!selectedSchool}
              className="gap-2"
            >
              <Check className="w-4 h-4" />
              Activate Selected Tools
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Tool Activation</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to activate the following tools for the selected school:
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p className="font-medium text-sm">
                School: {selectedSchool === "1" ? "Lincoln High School" : "Selected School"}
              </p>
              <div className="mt-3">
                <p className="font-medium text-sm mb-2">Activated Tools:</p>
                <ul className="space-y-1">
                  {activatedToolsList.map((tool) => (
                    <li key={tool.id} className="text-sm flex items-center gap-2">
                      <Check className="w-3 h-3" />
                      {tool.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmActivation}>
              <Check className="w-4 h-4 mr-2" />
              Confirm Activation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
