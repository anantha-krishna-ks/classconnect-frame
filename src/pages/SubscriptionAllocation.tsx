import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Save, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

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

const AVAILABLE_TOOLS = [
  { id: 'lesson-plan', name: 'Lesson Plan Assistant', description: 'Create comprehensive lesson plans' },
  { id: 'assessment', name: 'Assessment Creator', description: 'Generate assessments and quizzes' },
  { id: 'slide-generator', name: 'Slide Generator', description: 'Create presentation slides' },
  { id: 'exam-prep', name: 'Exam Prep Assistant', description: 'Prepare exam materials' },
  { id: 'video-editor', name: 'Video Clip Editor', description: 'Edit and create educational videos' },
  { id: 'resource-vault', name: 'Resource Vault', description: 'Access teaching resources' },
];

type TeacherToolSelection = {
  [teacherId: number]: string[];
};

const SubscriptionAllocation = () => {
  const navigate = useNavigate();
  const [selectedTeachers, setSelectedTeachers] = useState<number[]>([]);
  const [teacherTools, setTeacherTools] = useState<TeacherToolSelection>({});
  const [selectAllMode, setSelectAllMode] = useState(false);

  const handleTeacherToggle = (teacherId: number) => {
    setSelectedTeachers(prev =>
      prev.includes(teacherId)
        ? prev.filter(id => id !== teacherId)
        : [...prev, teacherId]
    );
  };

  const handleSelectAll = () => {
    if (selectAllMode) {
      setSelectedTeachers([]);
      setSelectAllMode(false);
    } else {
      setSelectedTeachers(TEACHERS.map(t => t.id));
      setSelectAllMode(true);
    }
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
  };

  const handleBulkToolAssignment = (toolId: string) => {
    if (selectedTeachers.length === 0) {
      toast.error('Please select at least one teacher');
      return;
    }

    setTeacherTools(prev => {
      const updated = { ...prev };
      selectedTeachers.forEach(teacherId => {
        const currentTools = updated[teacherId] || [];
        if (!currentTools.includes(toolId)) {
          updated[teacherId] = [...currentTools, toolId];
        }
      });
      return updated;
    });

    toast.success(`Tool assigned to ${selectedTeachers.length} teacher(s)`);
  };

  const handleSaveAndSubscribe = () => {
    const teachersWithTools = Object.entries(teacherTools).filter(
      ([_, tools]) => tools.length > 0
    );

    if (teachersWithTools.length === 0) {
      toast.error('Please assign at least one tool to a teacher');
      return;
    }

    // Here you would make an API call to save the subscription
    toast.success('Subscription activated successfully!', {
      description: `${teachersWithTools.length} teacher(s) configured with tools`,
    });
    
    // Navigate back to dashboard after a short delay
    setTimeout(() => {
      navigate('/admin-dashboard');
    }, 2000);
  };

  const getTeacherToolCount = (teacherId: number) => {
    return teacherTools[teacherId]?.length || 0;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b px-6 py-3" style={{ backgroundColor: '#3B54A5' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <img 
            src="/lovable-uploads/c278e3c9-20de-45b8-a466-41c546111a8a.png" 
            alt="ExcelSchoolAi" 
            className="h-10 w-auto"
          />
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
            onClick={() => navigate('/admin-dashboard')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Subscription Allocation</h1>
          <p className="text-muted-foreground">
            School: <span className="font-semibold text-foreground">{SCHOOL_NAME}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Teachers List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Teachers</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                >
                  {selectAllMode ? 'Deselect All' : 'Select All'}
                </Button>
              </div>
              <CardDescription>
                Select teachers to assign tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-3">
                  {TEACHERS.map((teacher) => {
                    const toolCount = getTeacherToolCount(teacher.id);
                    const isSelected = selectedTeachers.includes(teacher.id);
                    
                    return (
                      <div
                        key={teacher.id}
                        className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors ${
                          isSelected ? 'border-primary bg-primary/5' : 'border-border'
                        }`}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleTeacherToggle(teacher.id)}
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{teacher.name}</p>
                          <p className="text-xs text-muted-foreground">{teacher.department}</p>
                          {toolCount > 0 && (
                            <p className="text-xs text-primary mt-1 flex items-center">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              {toolCount} tool{toolCount !== 1 ? 's' : ''} assigned
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Tools Assignment */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Available Learning Tools</CardTitle>
              <CardDescription>
                Assign tools individually or to selected teachers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {AVAILABLE_TOOLS.map((tool) => (
                  <div key={tool.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-base mb-1">{tool.name}</h3>
                        <p className="text-sm text-muted-foreground">{tool.description}</p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleBulkToolAssignment(tool.id)}
                        disabled={selectedTeachers.length === 0}
                      >
                        Assign to Selected
                      </Button>
                    </div>
                    
                    {/* Individual teacher checkboxes */}
                    <ScrollArea className="h-[120px] mt-3 border-t pt-3">
                      <div className="grid grid-cols-2 gap-2">
                        {TEACHERS.map((teacher) => (
                          <div key={`${teacher.id}-${tool.id}`} className="flex items-center space-x-2">
                            <Checkbox
                              checked={teacherTools[teacher.id]?.includes(tool.id) || false}
                              onCheckedChange={() => handleToolToggle(teacher.id, tool.id)}
                              id={`${teacher.id}-${tool.id}`}
                            />
                            <label
                              htmlFor={`${teacher.id}-${tool.id}`}
                              className="text-sm cursor-pointer truncate"
                            >
                              {teacher.name.split(' ').slice(-1)[0]}
                            </label>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-6 border-t">
                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleSaveAndSubscribe}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save & Activate Subscription
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionAllocation;
