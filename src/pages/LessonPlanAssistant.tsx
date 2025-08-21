import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Edit, Eye, Trash, ArrowLeft, BookOpen } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import Header from '@/components/Header';
import MainHeader from '@/components/MainHeader';
import { getGrades, getSubjects, Grade, Subject, getUnitPlanDetails, deleteUnitPlanById } from './api';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PageLoader } from "@/components/ui/loader";
import { useToast } from "@/hooks/use-toast";


const LessonPlanAssistant = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
    const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    grade: "all",
    subject: "all",
    lessonName: ""
  });
  const [grades, setGrades] = useState<Grade[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoadingGrades, setIsLoadingGrades] = useState(false);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lessonPlans,setlessonPlans]=useState([]);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<any>(null);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  
  useEffect(() => {
    const fetchGrades = async () => {
      setIsLoadingGrades(true);
      setError(null);
      try {
        const gradesData = await getGrades('eps');
        setGrades(gradesData);
        GetUnitPlans(0,0,'');
      } catch (error) {
        setError('Failed to fetch grades');
      } finally {
        setIsLoadingGrades(false);
      }
    };
    fetchGrades();
  }, []);

  const handleGradeChange = async (value: string) => {
    setLoading(true);
    setFilters({ ...filters, grade: value, subject: 'all' });
    if (value === 'all') {
      setSubjects([]);
      return;
    }
    setIsLoadingSubjects(true);
    setError(null);
    try {
      const subjectsData = await getSubjects('eps', parseInt(value, 10));
      setSubjects(subjectsData);
      GetUnitPlans(parseInt(value, 10),0,filters.lessonName);
    } catch (error) {
      setError('Failed to fetch subjects');
    } finally {
      setIsLoadingSubjects(false);
    }
  };
 
  const handleSubjectChange = async (value: string) => {
    setLoading(true);
    setFilters({...filters, subject: value})
    setIsLoadingSubjects(true);
    setError(null);
    try {
      GetUnitPlans(parseInt(filters.grade, 10),parseInt(value, 10),filters.lessonName);
    } catch (error) {
      setError('Failed to fetch subjects');
    } finally {
      setIsLoadingSubjects(false);
    }
  };

    const searchUnitPlan = async (value: string) => {
    setLoading(true);
    setFilters({...filters, lessonName: value}) 
    setIsLoadingSubjects(true);
    setError(null);
    try {     
      GetUnitPlans(parseInt(filters.grade, 10),parseInt(filters.subject, 10),value);
    } catch (error) {
      setError('Failed to fetch subjects');
    } finally {
      setIsLoadingSubjects(false);
    }
  };

  const GetUnitPlans=async (classid:any,subjectid:any,searchtext:string)=>{
      try {
          const payload = {
          OrgCode: 'OR01',
          AppCode: 'AP01',
          CustCode: 'CU01',
          UserCode: 'UO01',
          ClassID: classid,
          SubjectId: subjectid,
          ChapterId: 0,
          SearchText: searchtext,
          UserType: 0,
        }
      const data = await getUnitPlanDetails(payload);
      setlessonPlans(data['unit_plans'] || []);
      setLoading(false);
    } catch (err) {
      console.error("Error in GetUnitPlans:", err);
      toast({
        title: "Error",
        description: "Failed to fetch unit plans.",
        variant: "destructive",
      });
      setError("Failed to fetch unit plans.");
      setLoading(false);
    }
  }
  // Sample lesson plans data - extended to match the reference image
  // const lessonPlans = [
  //   {
  //     id: 1,
  //     title: "Understanding Photosynthesis: The Food Factory of Plants",
  //     grade: "VII",
  //     subject: "General Science",
  //     session: 1
  //   },
  //   {
  //     id: 2,
  //     title: "Understanding Photosynthesis: The Powerhouse of Plant Life",
  //     grade: "6",
  //     subject: "Science",
  //     session: 2
  //   },
  //   {
  //     id: 3,
  //     title: "Understanding Heat: Transfer, Effects, and Applications",
  //     grade: "9",
  //     subject: "General Science",
  //     session: 1
  //   },
  //   {
  //     id: 4,
  //     title: "Exploring the World of Plants: Structure, Functions, and Importance",
  //     grade: "8",
  //     subject: "General Science",
  //     session: 3
  //   },
  //   {
  //     id: 5,
  //     title: "Exploring the Wonders of Light",
  //     grade: "VII",
  //     subject: "Science",
  //     session: 1
  //   },
  //   {
  //     id: 6,
  //     title: "Journey Through the Digestive System",
  //     grade: "7",
  //     subject: "Science",
  //     session: 2
  //   }
  // ];

  const handleCreateNew = () => {
    navigate("/lesson-plan");
  };
  const handleLogout = () => {
    navigate('/login');
  };
  const PreviewunitPlan = async (Lessondata:any) => {
       
        try {
        console.log(Lessondata);
          navigate('/unit-plan-preview', {
            state: {
              lessonData: {
                grade:Lessondata.classname,
                subject:Lessondata.subjectname,
                lessonName: `${Lessondata.unitplantitle}`,
                gradeid:Lessondata.classid,
                subjectid:Lessondata.subjectid,
                PlanClassId: Lessondata.PlanClassId,
                chapterid:Lessondata.chapterid,
                unitplandata: Lessondata.unitplanjson
              }
            }
          });
        } catch (error) {
          console.error('Error navigating to lesson plan preview:', error);
        }
      };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {loading && <PageLoader text="Please wait..." />}
      
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
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
                  <BookOpen className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Lesson Plan Assistant</h1>
                  <p className="text-sm text-gray-500">Manage & Create Comprehensive Lesson Plans</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-4">Lesson Plan Repository</h1>
            <p className="text-lg text-muted-foreground">
              Manage and organize your lesson plans
            </p>
          </div>
          <Button 
            onClick={handleCreateNew}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create new lesson plan
          </Button>
        </div>

        <Card className="w-full border border-border/50 shadow-sm">
          <CardHeader className="pb-6">
            {error && <p className="text-red-500 text-center col-span-3">Error: {error}</p>}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Grade</label>
                <Select value={filters.grade} onValueChange={handleGradeChange}>
                  <SelectTrigger className="h-11 bg-background">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {isLoadingGrades ? (
                      <SelectItem value="loading" disabled>Loading...</SelectItem>
                    ) : (
                      grades.map((grade) => (
                        <SelectItem key={grade.ClassId} value={String(grade.ClassId)}>
                          {grade.ClassName}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Subject</label>
                <Select value={filters.subject} onValueChange={handleSubjectChange}>
                  <SelectTrigger className="h-11 bg-background">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {isLoadingSubjects ? (
                      <SelectItem value="loading" disabled>Loading...</SelectItem>
                    ) : (
                      subjects.map((subject) => (
                        <SelectItem key={subject.SubjectId} value={String(subject.SubjectId)}>
                          {subject.SubjectName}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Lesson Name</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter lesson name"
                    value={filters.lessonName}
                    onChange={(e) => searchUnitPlan(e.target.value)}
                    className="pl-10 h-11 bg-background"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            {lessonPlans.length > 0 ? (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="w-20 font-semibold text-foreground">SL No.</TableHead>
                      <TableHead className="font-semibold text-foreground">Lesson Plan Title</TableHead>
                      <TableHead className="w-24 font-semibold text-foreground">Grade</TableHead>
                      <TableHead className="w-40 font-semibold text-foreground">Subject</TableHead>
                      <TableHead className="w-32 font-semibold text-foreground">Session</TableHead>
                      <TableHead className="w-32 font-semibold text-foreground">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lessonPlans.map((lesson, index) => (
                      <TableRow key={lesson.unitplanid} className="border-b border-border/50 hover:bg-muted/20">
                        <TableCell className="font-medium text-muted-foreground">{index + 1}</TableCell>
                        <TableCell className="font-medium text-foreground">{lesson.unitplantitle}</TableCell>
                        <TableCell className="text-muted-foreground">{lesson.classname}</TableCell>
                        <TableCell className="text-muted-foreground">{lesson.subjectname}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            className="p-2 h-auto text-muted-foreground hover:text-primary hover:bg-muted/50 font-normal text-sm transition-colors"
                            onClick={() => navigate(`/session/${lesson.unitplanid}/${lesson.classid}/${lesson.subjectid}`, {
                              state: {
                                selectedGrade: lesson.classname,
                                selectedsubject: lesson.subjectname,
                                Selectedunittitle: lesson.unitplantitle,
                                selectedunitdata: lesson.unitplanjson,
                              }
                            })}
                          >
                            Session ({lesson.sessioncount})
                          </Button>
                        </TableCell>
                        <TableCell>
  <div className="flex gap-1">
    {/* Edit Button with Tooltip */}
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-purple-50" disabled>
          <Edit className="h-4 w-4 text-purple-600" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Edit</TooltipContent>
    </Tooltip>
    {/* Preview Button with Tooltip */}
    <Tooltip>
      <TooltipTrigger asChild>
        <Button onClick={() => PreviewunitPlan(lesson)} variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-green-50">
          <Eye className="h-4 w-4 text-green-600" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Preview</TooltipContent>
    </Tooltip>
    {/* Delete Button with Tooltip */}
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-red-50"
          onClick={() => {
            setPlanToDelete(lesson);
            setDeleteDialogOpen(true);
          }}
        >
          <Trash className="h-4 w-4 text-red-600" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Delete</TooltipContent>
    </Tooltip>
  </div>
</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center p-8">
                <p className="text-muted-foreground">No Lesson Plans Found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    {/* Delete Confirmation Dialog */}
    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete Unit plan?</AlertDialogTitle>
      <AlertDialogDescription>
        Are you sure you want to delete this unit plan? This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
      <AlertDialogAction
        onClick={async () => {
          if (!planToDelete) return;
          try {
            await deleteUnitPlanById(planToDelete.unitplanid);
            setlessonPlans((prev: any[]) => prev.filter(lp => lp.unitplanid !== planToDelete.unitplanid));
            setShowDeleteSuccess(true);
          } catch (err) {
            toast({
              title: "Error",
              description: "Failed to delete unit plan.",
              variant: "destructive",
            });
          } finally {
            setDeleteDialogOpen(false);
            setPlanToDelete(null);
          }
        }}
      >
        Delete
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

{/* Delete Success Dialog */}
<AlertDialog open={showDeleteSuccess} onOpenChange={setShowDeleteSuccess}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Deleted!</AlertDialogTitle>
      <AlertDialogDescription>
        Unit plan deleted successfully.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogAction onClick={() => setShowDeleteSuccess(false)}>
        OK
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

  </div>
  );
};

export default LessonPlanAssistant;
