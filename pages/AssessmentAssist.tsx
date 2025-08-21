import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Edit, Eye, Trash2 } from 'lucide-react';
import Header from '@/components/Header';

const AssessmentAssist = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    grade: "all",
    subject: "all",
    assessmentName: ""
  });

  // Sample assessments data
  const assessments = [
    {
      id: 1,
      name: "Understanding Photosynthesis Assessment",
      grade: "VII",
      subject: "General Science",
      type: "PA1",
      marks: 20,
      duration: "45 minutes",
      status: "Completed"
    },
    {
      id: 2,
      name: "Heat Transfer Unit Assessment",
      grade: "9",
      subject: "Science",
      type: "Mid-term",
      marks: 50,
      duration: "90 minutes",
      status: "Draft"
    },
    {
      id: 3,
      name: "Plant Structure and Functions",
      grade: "8",
      subject: "General Science",
      type: "PA2",
      marks: 25,
      duration: "60 minutes",
      status: "Active"
    },
    {
      id: 4,
      name: "Light and Optics Assessment",
      grade: "VII",
      subject: "Science",
      type: "Final",
      marks: 100,
      duration: "180 minutes",
      status: "Completed"
    }
  ];

  const handleCreateNew = () => {
    navigate("/assessment-assist/create");
  };

  const handlePreviewAssessment = (assessment: any) => {
    console.log('Preview assessment:', assessment);
  };

  const handleEditAssessment = (assessment: any) => {
    console.log('Edit assessment:', assessment);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'text-green-600 bg-green-50';
      case 'Active':
        return 'text-blue-600 bg-blue-50';
      case 'Draft':
        return 'text-orange-600 bg-orange-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="w-full min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-4">Assessment Repository</h1>
            <p className="text-lg text-muted-foreground">
              Manage and organize your assessments
            </p>
          </div>
          <Button 
            onClick={handleCreateNew}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Assessment
          </Button>
        </div>

        <Card className="w-full border border-border/50 shadow-sm">
          <CardHeader className="pb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Grade</label>
                <Select value={filters.grade} onValueChange={(value) => setFilters({...filters, grade: value})}>
                  <SelectTrigger className="h-11 bg-background">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="1">Grade 1</SelectItem>
                    <SelectItem value="2">Grade 2</SelectItem>
                    <SelectItem value="3">Grade 3</SelectItem>
                    <SelectItem value="4">Grade 4</SelectItem>
                    <SelectItem value="5">Grade 5</SelectItem>
                    <SelectItem value="6">Grade 6</SelectItem>
                    <SelectItem value="7">Grade 7</SelectItem>
                    <SelectItem value="VII">Grade VII</SelectItem>
                    <SelectItem value="8">Grade 8</SelectItem>
                    <SelectItem value="9">Grade 9</SelectItem>
                    <SelectItem value="10">Grade 10</SelectItem>
                    <SelectItem value="11">Grade 11</SelectItem>
                    <SelectItem value="12">Grade 12</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Subject</label>
                <Select value={filters.subject} onValueChange={(value) => setFilters({...filters, subject: value})}>
                  <SelectTrigger className="h-11 bg-background">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="mathematics">Mathematics</SelectItem>
                    <SelectItem value="science">Science</SelectItem>
                    <SelectItem value="general-science">General Science</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="social-studies">Social Studies</SelectItem>
                    <SelectItem value="history">History</SelectItem>
                    <SelectItem value="geography">Geography</SelectItem>
                    <SelectItem value="physics">Physics</SelectItem>
                    <SelectItem value="chemistry">Chemistry</SelectItem>
                    <SelectItem value="biology">Biology</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Assessment Name</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter assessment name"
                    value={filters.assessmentName}
                    onChange={(e) => setFilters({...filters, assessmentName: e.target.value})}
                    className="pl-10 h-11 bg-background"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="w-20 font-semibold text-foreground">SL No.</TableHead>
                    <TableHead className="font-semibold text-foreground">Assessment Name</TableHead>
                    <TableHead className="w-24 font-semibold text-foreground">Grade</TableHead>
                    <TableHead className="w-40 font-semibold text-foreground">Subject</TableHead>
                    <TableHead className="w-24 font-semibold text-foreground">Type</TableHead>
                    <TableHead className="w-24 font-semibold text-foreground">Marks</TableHead>
                    <TableHead className="w-32 font-semibold text-foreground">Duration</TableHead>
                    <TableHead className="w-28 font-semibold text-foreground">Status</TableHead>
                    <TableHead className="w-32 font-semibold text-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assessments.map((assessment, index) => (
                    <TableRow key={assessment.id} className="border-b border-border/50 hover:bg-muted/20">
                      <TableCell className="font-medium text-muted-foreground">{index + 1}</TableCell>
                      <TableCell className="font-medium text-foreground">{assessment.name}</TableCell>
                      <TableCell className="text-muted-foreground">{assessment.grade}</TableCell>
                      <TableCell className="text-muted-foreground">{assessment.subject}</TableCell>
                      <TableCell className="text-muted-foreground">{assessment.type}</TableCell>
                      <TableCell className="text-muted-foreground">{assessment.marks}</TableCell>
                      <TableCell className="text-muted-foreground">{assessment.duration}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assessment.status)}`}>
                          {assessment.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 hover:bg-purple-50"
                            onClick={() => handleEditAssessment(assessment)}
                          >
                            <Edit className="h-4 w-4 text-purple-600" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 hover:bg-green-50"
                            onClick={() => handlePreviewAssessment(assessment)}
                          >
                            <Eye className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-red-50">
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AssessmentAssist;