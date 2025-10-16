import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Home, LogOut, Settings2, X, Search, Users as UsersIcon, BookOpen, TrendingUp, Award, Clock, BarChart3, Presentation, GraduationCap, Video, FolderOpen, LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

// Mock data - Replace with actual API calls
const SCHOOL_NAME = "Saras International School";

const TEACHERS = [
  { id: 1, name: "Dr. Rajesh Kumar", department: "Mathematics" },
  { id: 2, name: "Ms. Priya Sharma", department: "Science" },
  { id: 3, name: "Mr. Amit Patel", department: "English" },
  { id: 4, name: "Mrs. Sunita Reddy", department: "Social Studies" },
  { id: 5, name: "Mr. Vikram Singh", department: "Physics" },
  { id: 6, name: "Ms. Anita Desai", department: "Chemistry" },
  { id: 7, name: "Dr. Ramesh Nair", department: "Biology" },
  { id: 8, name: "Mrs. Kavita Joshi", department: "History" },
  { id: 9, name: "Mr. Suresh Menon", department: "Geography" },
  { id: 10, name: "Ms. Deepa Agarwal", department: "Computer Science" },
];

const AVAILABLE_TOOLS: Array<{ id: string; name: string; icon: LucideIcon; iconBg: string }> = [
  { id: 'lesson-plan', name: 'Lesson Plan Assistant', icon: BookOpen, iconBg: 'bg-blue-500' },
  { id: 'assessment', name: 'Assessment Creator', icon: BarChart3, iconBg: 'bg-green-500' },
  { id: 'slide-generator', name: 'Slide Generator', icon: Presentation, iconBg: 'bg-rose-500' },
  { id: 'exam-prep', name: 'Exam Prep Assistant', icon: GraduationCap, iconBg: 'bg-indigo-500' },
  { id: 'video-editor', name: 'Video Clip Editor', icon: Video, iconBg: 'bg-cyan-500' },
  { id: 'resource-vault', name: 'Resource Vault', icon: FolderOpen, iconBg: 'bg-amber-500' },
];

type TeacherToolSelection = {
  [teacherId: number]: string[];
};

type ToolTeacherSelection = {
  [toolId: string]: number[];
};

const SubscriptionAllocation = () => {
  const navigate = useNavigate();
  const [teacherTools, setTeacherTools] = useState<TeacherToolSelection>({});
  const [toolTeachers, setToolTeachers] = useState<ToolTeacherSelection>({});
  const [selectedTeacher, setSelectedTeacher] = useState<number | null>(null);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isToolDialogOpen, setIsToolDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  const handleOpenDialog = (teacherId: number) => {
    setSelectedTeacher(teacherId);
    setIsDialogOpen(true);
  };

  const handleToolToggle = (teacherId: number, toolId: string) => {
    setTeacherTools(prev => {
      const currentTools = prev[teacherId] || [];
      const updatedTools = currentTools.includes(toolId)
        ? currentTools.filter(id => id !== toolId)
        : [...currentTools, toolId];
      
      return {
        ...prev,
        [teacherId]: updatedTools
      };
    });

    // Sync with toolTeachers
    setToolTeachers(prev => {
      const currentTeachers = prev[toolId] || [];
      const updatedTeachers = currentTeachers.includes(teacherId)
        ? currentTeachers.filter(id => id !== teacherId)
        : [...currentTeachers, teacherId];
      
      return {
        ...prev,
        [toolId]: updatedTeachers
      };
    });
  };

  const handleTeacherToggleForTool = (toolId: string, teacherId: number) => {
    setToolTeachers(prev => {
      const currentTeachers = prev[toolId] || [];
      const updatedTeachers = currentTeachers.includes(teacherId)
        ? currentTeachers.filter(id => id !== teacherId)
        : [...currentTeachers, teacherId];
      
      return {
        ...prev,
        [toolId]: updatedTeachers
      };
    });

    // Sync with teacherTools
    setTeacherTools(prev => {
      const currentTools = prev[teacherId] || [];
      const updatedTools = currentTools.includes(toolId)
        ? currentTools.filter(id => id !== toolId)
        : [...currentTools, toolId];
      
      return {
        ...prev,
        [teacherId]: updatedTools
      };
    });
  };

  const handleOpenToolDialog = (toolId: string) => {
    setSelectedTool(toolId);
    setIsToolDialogOpen(true);
  };

  const handleRemoveTool = (teacherId: number, toolId: string) => {
    setTeacherTools(prev => {
      const currentTools = prev[teacherId] || [];
      return {
        ...prev,
        [teacherId]: currentTools.filter(id => id !== toolId)
      };
    });
  };

  const handleSaveAndSubscribe = () => {
    const teachersWithTools = Object.entries(teacherTools).filter(
      ([_, tools]) => tools.length > 0
    );

    if (teachersWithTools.length === 0) {
      toast.error('Please assign at least one tool to a teacher');
      return;
    }

    toast.success('Subscription activated successfully!', {
      description: `${teachersWithTools.length} teacher(s) configured with tools`,
    });
    
    setTimeout(() => {
      navigate('/admin-dashboard');
    }, 2000);
  };

  const handleLogout = () => {
    navigate('/admin-login');
  };

  // Filter teachers based on search and department
  const filteredTeachers = TEACHERS.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         teacher.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || teacher.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  // Get unique departments for filter
  const departments = Array.from(new Set(TEACHERS.map(t => t.department)));

  // Calculate stats
  const totalTeachers = TEACHERS.length;
  const teachersWithTools = Object.values(teacherTools).filter(tools => tools.length > 0).length;
  const totalToolsAssigned = Object.values(teacherTools).reduce((sum, tools) => sum + tools.length, 0);
  const averageToolsPerTeacher = teachersWithTools > 0 ? (totalToolsAssigned / teachersWithTools).toFixed(1) : '0';

  return (
    <div className="min-h-screen bg-white">
      {/* Main Header */}
      <header className="border-b border-gray-100 px-6 py-3" style={{ backgroundColor: '#3B54A5' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <img 
            src="/lovable-uploads/c278e3c9-20de-45b8-a466-41c546111a8a.png" 
            alt="ExcelSchoolAi" 
            className="h-10 w-auto"
          />
          <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 hover:text-white border border-white/20 hover:border-white/40"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to logout?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLogout} className="bg-red-600 hover:bg-red-700">
                    Yes, Logout
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
        </div>
      </header>

      {/* Breadcrumb Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <nav className="flex items-center space-x-2 text-sm text-gray-500">
              <Home 
                className="w-4 h-4 cursor-pointer hover:text-gray-700 transition-colors" 
                onClick={() => navigate('/admin-dashboard')}
              />
              <span className="mx-2">/</span>
              <span 
                className="text-gray-900 cursor-pointer hover:text-gray-700 transition-colors"
                onClick={() => navigate('/admin-dashboard')}
              >
                Admin Dashboard
              </span>
              <span className="mx-2">/</span>
              <span className="text-blue-600 font-medium">Subscription Portal</span>
            </nav>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin-dashboard')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
          <div className="mt-2">
            <h1 className="text-2xl font-bold text-gray-900">Subscription Portal</h1>
            <p className="text-gray-600 text-sm mt-1">
              School: <span className="font-semibold text-gray-900">{SCHOOL_NAME}</span>
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="tools" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 h-12 bg-muted">
            <TabsTrigger value="tools" className="text-base">Tools Allocation</TabsTrigger>
            <TabsTrigger value="teachers" className="text-base">Teacher's Data</TabsTrigger>
          </TabsList>

          {/* Tools Allocation Tab */}
          <TabsContent value="tools" className="space-y-6">
            {/* Filters */}
            <div className="bg-muted/30 rounded-lg p-4 border border-border">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search tools..."
                    className="pl-10 bg-background"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {AVAILABLE_TOOLS.filter(tool => 
                tool.name.toLowerCase().includes(searchQuery.toLowerCase())
              ).map((tool) => {
                const assignedTeachers = toolTeachers[tool.id] || [];
                
                return (
                  <div key={tool.id} className="bg-muted/20 rounded-xl p-6 border border-border hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`${tool.iconBg} rounded-xl p-3 flex-shrink-0`}>
                        <tool.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-foreground mb-1">{tool.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {assignedTeachers.length} teacher{assignedTeachers.length !== 1 ? 's' : ''} assigned
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleOpenToolDialog(tool.id)}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0"
                      >
                        <Settings2 className="w-4 h-4 mr-1" />
                        Assign
                      </Button>
                    </div>
                    <div className="pt-4 border-t border-border">
                      {assignedTeachers.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {assignedTeachers.map((teacherId) => {
                            const teacher = TEACHERS.find(t => t.id === teacherId);
                            return teacher ? (
                              <Badge key={teacherId} variant="secondary" className="pr-1">
                                {teacher.name}
                                <button
                                  onClick={() => handleTeacherToggleForTool(tool.id, teacherId)}
                                  className="ml-1 hover:bg-muted rounded-full p-0.5 transition-colors"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No teachers assigned yet</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          {/* Teacher's Data Tab */}
          <TabsContent value="teachers" className="space-y-6">
            {/* Stats Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-card rounded-xl p-6 border border-border">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Total Teachers</p>
                    <p className="text-3xl font-bold text-foreground">{totalTeachers}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <UsersIcon className="w-6 h-6 text-blue-500" />
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-xl p-6 border border-border">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Active Teachers</p>
                    <p className="text-3xl font-bold text-foreground">{teachersWithTools}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-green-500" />
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-xl p-6 border border-border">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Total Tools Assigned</p>
                    <p className="text-3xl font-bold text-foreground">{totalToolsAssigned}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-purple-500" />
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-xl p-6 border border-border">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Avg Tools/Teacher</p>
                    <p className="text-3xl font-bold text-foreground">{averageToolsPerTeacher}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-orange-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-muted/30 rounded-lg p-4 border border-border">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search teachers..."
                    className="pl-10 bg-background"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="w-[200px] bg-background">
                    <SelectValue placeholder="Filter by department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Teachers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTeachers.map((teacher) => {
                const assignedTools = teacherTools[teacher.id] || [];
                
                return (
                  <div key={teacher.id} className="bg-card rounded-xl p-6 border border-border hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-1">{teacher.name}</h3>
                        <p className="text-sm text-muted-foreground">{teacher.department}</p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleOpenDialog(teacher.id)}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        <Settings2 className="w-4 h-4 mr-1" />
                        Manage
                      </Button>
                    </div>
                    <div className="pt-4 border-t border-border">
                      {assignedTools.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {assignedTools.map(toolId => {
                            const tool = AVAILABLE_TOOLS.find(t => t.id === toolId);
                            return tool ? (
                              <Badge key={toolId} variant="secondary" className="pr-1">
                                {tool.name}
                                <button
                                  onClick={() => handleRemoveTool(teacher.id, toolId)}
                                  className="ml-1 hover:bg-muted rounded-full p-0.5 transition-colors"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No tools assigned yet</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-center mt-8">
          <Button
            size="lg"
            onClick={handleSaveAndSubscribe}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Save & Activate Subscription
          </Button>
        </div>
      </div>

      {/* Teacher Tool Assignment Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Assign Tools to {TEACHERS.find(t => t.id === selectedTeacher)?.name}
            </DialogTitle>
            <DialogDescription>
              Select the tools this teacher should have access to
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[400px] pr-4">
            <div className="space-y-3 py-4">
              {AVAILABLE_TOOLS.map((tool) => {
                const isAssigned = selectedTeacher 
                  ? teacherTools[selectedTeacher]?.includes(tool.id) 
                  : false;
                
                return (
                  <div key={tool.id} className="flex items-start space-x-3">
                    <Checkbox
                      id={`dialog-${tool.id}`}
                      checked={isAssigned}
                      onCheckedChange={() => 
                        selectedTeacher && handleToolToggle(selectedTeacher, tool.id)
                      }
                    />
                    <Label
                      htmlFor={`dialog-${tool.id}`}
                      className="text-sm font-normal cursor-pointer flex-1"
                    >
                      {tool.name}
                    </Label>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Tool Teacher Assignment Dialog */}
      <Dialog open={isToolDialogOpen} onOpenChange={setIsToolDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Assign Teachers to {AVAILABLE_TOOLS.find(t => t.id === selectedTool)?.name}
            </DialogTitle>
            <DialogDescription>
              Select the teachers who should have access to this tool
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[400px] pr-4">
            <div className="space-y-3 py-4">
              {TEACHERS.map((teacher) => {
                const isAssigned = selectedTool 
                  ? toolTeachers[selectedTool]?.includes(teacher.id) 
                  : false;
                
                return (
                  <div key={teacher.id} className="flex items-start space-x-3">
                    <Checkbox
                      id={`tool-dialog-${teacher.id}`}
                      checked={isAssigned}
                      onCheckedChange={() => 
                        selectedTool && handleTeacherToggleForTool(selectedTool, teacher.id)
                      }
                    />
                    <Label
                      htmlFor={`tool-dialog-${teacher.id}`}
                      className="text-sm font-normal cursor-pointer flex-1"
                    >
                      <div>
                        <div className="font-medium">{teacher.name}</div>
                        <div className="text-xs text-gray-500">{teacher.department}</div>
                      </div>
                    </Label>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsToolDialogOpen(false)}>
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionAllocation;
