import { useState } from "react";
import { Search, Check, X, BookOpen, BarChart3, Presentation, GraduationCap, Video, FolderOpen, FileText, Brain, Sparkles, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
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

  // Mock products/tools data
  const products = [
    {
      id: "lesson-plan",
      name: "Lesson Plan Assistant",
      description: "AI-powered lesson planning tool",
      category: "Planning",
      icon: BookOpen,
      iconBg: "bg-blue-500",
    },
    {
      id: "assessment",
      name: "Assessment Creator",
      description: "Create and manage assessments",
      category: "Assessment",
      icon: BarChart3,
      iconBg: "bg-green-500",
    },
    {
      id: "slide-generator",
      name: "Slide Generator",
      description: "AI presentation creator",
      category: "Content",
      icon: Presentation,
      iconBg: "bg-rose-500",
    },
    {
      id: "exam-prep",
      name: "Exam Prep Assistant",
      description: "Student exam preparation tools",
      category: "Student Tools",
      icon: GraduationCap,
      iconBg: "bg-indigo-500",
    },
    {
      id: "video-editor",
      name: "Video Clip Editor",
      description: "Educational video editing",
      category: "Content",
      icon: Video,
      iconBg: "bg-cyan-500",
    },
    {
      id: "resource-vault",
      name: "Resource Vault",
      description: "Centralized resource library",
      category: "Resources",
      icon: FolderOpen,
      iconBg: "bg-amber-500",
    },
    {
      id: "quiz-creator",
      name: "Quiz Creator",
      description: "Interactive quiz generation",
      category: "Assessment",
      icon: FileText,
      iconBg: "bg-purple-500",
    },
    {
      id: "ai-tutor",
      name: "AI Tutor Assistant",
      description: "Personalized student tutoring",
      category: "Student Tools",
      icon: Brain,
      iconBg: "bg-pink-500",
    },
    {
      id: "content-enhancer",
      name: "Content Enhancer",
      description: "AI-powered content improvement",
      category: "Content",
      icon: Sparkles,
      iconBg: "bg-yellow-500",
    },
    {
      id: "discussion-board",
      name: "Discussion Board",
      description: "Collaborative learning platform",
      category: "Communication",
      icon: MessageSquare,
      iconBg: "bg-teal-500",
    },
  ];

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
    const activatedToolsList = products.filter((p) => selectedTools[p.id]);
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

  const activatedToolsList = products.filter((p) => selectedTools[p.id]);

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
            Toggle tools on/off to activate or deactivate licenses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((product) => {
              const Icon = product.icon;
              return (
                <Card key={product.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded ${product.iconBg} flex items-center justify-center`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
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
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{product.category}</Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
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
