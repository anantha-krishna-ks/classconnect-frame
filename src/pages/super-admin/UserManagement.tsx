import { useState } from "react";
import { Upload, Search, Download, Users, GraduationCap, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isStudentImportOpen, setIsStudentImportOpen] = useState(false);
  const [isTeacherImportOpen, setIsTeacherImportOpen] = useState(false);
  
  // Global filters
  const [filterCustomer, setFilterCustomer] = useState<string>("all");
  const [filterOrganization, setFilterOrganization] = useState<string>("all");
  const [filterCity, setFilterCity] = useState<string>("all");
  
  // Student filters
  const [studentFilterSchool, setStudentFilterSchool] = useState<string>("all");
  const [studentFilterGrade, setStudentFilterGrade] = useState<string>("all");
  const [studentFilterSection, setStudentFilterSection] = useState<string>("all");
  
  // Teacher filters
  const [teacherFilterSchool, setTeacherFilterSchool] = useState<string>("all");
  const [teacherFilterDesignation, setTeacherFilterDesignation] = useState<string>("all");
  const [teacherFilterGrade, setTeacherFilterGrade] = useState<string>("all");
  
  // Others filters
  const [othersFilterSchool, setOthersFilterSchool] = useState<string>("all");
  const [othersFilterDesignation, setOthersFilterDesignation] = useState<string>("all");

  // Mock student data
  const students = [
    {
      id: 1,
      name: "Emma Johnson",
      grade: "10",
      section: "A",
      sex: "Female",
      dob: "2008-05-15",
      parentPhone: "+1 234 567 8920",
      school: "Lincoln High School",
      customer: "ABC Education",
      organization: "Lincoln High School",
      city: "New York",
      status: "Active",
    },
    {
      id: 2,
      name: "Michael Chen",
      grade: "10",
      section: "A",
      sex: "Male",
      dob: "2008-08-22",
      parentPhone: "+1 234 567 8921",
      school: "Lincoln High School",
      customer: "ABC Education",
      organization: "Lincoln High School",
      city: "New York",
      status: "Active",
    },
  ];

  // Mock teacher data
  const teachers = [
    {
      id: 1,
      name: "Dr. Robert Smith",
      email: "robert.smith@lincoln.edu",
      designation: "Principal",
      grades: "9, 10, 11, 12",
      sections: "All",
      phone: "+1 234 567 8930",
      school: "Lincoln High School",
      customer: "ABC Education",
      organization: "Lincoln High School",
      city: "New York",
      status: "Active",
    },
    {
      id: 2,
      name: "Ms. Jennifer Lee",
      email: "jennifer.lee@lincoln.edu",
      designation: "HOD Science",
      grades: "9, 10",
      sections: "A, B",
      phone: "+1 234 567 8931",
      school: "Lincoln High School",
      customer: "ABC Education",
      organization: "Lincoln High School",
      city: "New York",
      status: "Active",
    },
  ];

  // Mock others data (headmaster, principal, micro-admin, etc.)
  const others = [
    {
      id: 1,
      name: "Mr. David Anderson",
      email: "david.anderson@lincoln.edu",
      designation: "Headmaster",
      phone: "+1 234 567 8940",
      school: "Lincoln High School",
      customer: "ABC Education",
      organization: "Lincoln High School",
      city: "New York",
      status: "Active",
    },
    {
      id: 2,
      name: "Ms. Sarah Williams",
      email: "sarah.williams@lincoln.edu",
      designation: "Micro-Admin",
      phone: "+1 234 567 8941",
      school: "Lincoln High School",
      customer: "ABC Education",
      organization: "Lincoln High School",
      city: "New York",
      status: "Active",
    },
  ];

  // Filter students
  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.parentPhone.includes(searchQuery);
    const matchesCustomer = filterCustomer === "all" || student.customer === filterCustomer;
    const matchesOrganization = filterOrganization === "all" || student.organization === filterOrganization;
    const matchesCity = filterCity === "all" || student.city === filterCity;
    const matchesSchool = studentFilterSchool === "all" || student.school === studentFilterSchool;
    const matchesGrade = studentFilterGrade === "all" || student.grade === studentFilterGrade;
    const matchesSection = studentFilterSection === "all" || student.section === studentFilterSection;
    
    return matchesSearch && matchesCustomer && matchesOrganization && matchesCity && matchesSchool && matchesGrade && matchesSection;
  });

  // Filter teachers
  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         teacher.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCustomer = filterCustomer === "all" || teacher.customer === filterCustomer;
    const matchesOrganization = filterOrganization === "all" || teacher.organization === filterOrganization;
    const matchesCity = filterCity === "all" || teacher.city === filterCity;
    const matchesSchool = teacherFilterSchool === "all" || teacher.school === teacherFilterSchool;
    const matchesDesignation = teacherFilterDesignation === "all" || teacher.designation === teacherFilterDesignation;
    const matchesGrade = teacherFilterGrade === "all" || teacher.grades.includes(teacherFilterGrade);
    
    return matchesSearch && matchesCustomer && matchesOrganization && matchesCity && matchesSchool && matchesDesignation && matchesGrade;
  });

  // Filter others
  const filteredOthers = others.filter((other) => {
    const matchesSearch = other.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         other.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCustomer = filterCustomer === "all" || other.customer === filterCustomer;
    const matchesOrganization = filterOrganization === "all" || other.organization === filterOrganization;
    const matchesCity = filterCity === "all" || other.city === filterCity;
    const matchesSchool = othersFilterSchool === "all" || other.school === othersFilterSchool;
    const matchesDesignation = othersFilterDesignation === "all" || other.designation === othersFilterDesignation;
    
    return matchesSearch && matchesCustomer && matchesOrganization && matchesCity && matchesSchool && matchesDesignation;
  });

  // Get unique values for filters
  const uniqueCustomers = Array.from(new Set([...students.map(s => s.customer), ...teachers.map(t => t.customer), ...others.map(o => o.customer)]));
  const uniqueOrganizations = Array.from(new Set([...students.map(s => s.organization), ...teachers.map(t => t.organization), ...others.map(o => o.organization)]));
  const uniqueCities = Array.from(new Set([...students.map(s => s.city), ...teachers.map(t => t.city), ...others.map(o => o.city)]));
  const uniqueSchools = Array.from(new Set([...students.map(s => s.school), ...teachers.map(t => t.school), ...others.map(o => o.school)]));
  const uniqueGrades = Array.from(new Set(students.map(s => s.grade))).sort();
  const uniqueSections = Array.from(new Set(students.map(s => s.section))).sort();
  const uniqueTeacherDesignations = Array.from(new Set(teachers.map(t => t.designation)));
  const uniqueOthersDesignations = Array.from(new Set(others.map(o => o.designation)));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">User Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage students and teachers across all schools
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle>Student & Teacher Records</CardTitle>
              <CardDescription className="mt-2">Import and manage user records across schools</CardDescription>
            </div>
          </div>

          {/* Global Filters Above Tabs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <Select value={filterCustomer} onValueChange={setFilterCustomer}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="All Customers" />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="all">All Customers</SelectItem>
                {uniqueCustomers.map((customer) => (
                  <SelectItem key={customer} value={customer}>
                    {customer}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterOrganization} onValueChange={setFilterOrganization}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="All Organizations" />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="all">All Organizations</SelectItem>
                {uniqueOrganizations.map((org) => (
                  <SelectItem key={org} value={org}>
                    {org}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterCity} onValueChange={setFilterCity}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="All Cities" />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="all">All Cities</SelectItem>
                {uniqueCities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <Tabs defaultValue="students" className="w-full">
          <CardHeader className="pt-0 pb-0">
            <TabsList className="w-full justify-start -mb-px">
              <TabsTrigger value="students" className="gap-2">
                <GraduationCap className="w-4 h-4" />
                Students
              </TabsTrigger>
              <TabsTrigger value="teachers" className="gap-2">
                <Users className="w-4 h-4" />
                Teachers
              </TabsTrigger>
              <TabsTrigger value="others" className="gap-2">
                <Users className="w-4 h-4" />
                Others
              </TabsTrigger>
            </TabsList>
          </CardHeader>

        {/* Students Tab */}
        <TabsContent value="students" className="m-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2">
                  <Dialog open={isStudentImportOpen} onOpenChange={setIsStudentImportOpen}>
                    <DialogTrigger asChild>
                      <Button className="gap-2">
                        <Upload className="w-4 h-4" />
                        Bulk Import Students
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Import Students from CSV/Excel</DialogTitle>
                        <DialogDescription>
                          Upload a CSV or Excel file with student data
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="school-select">Select School *</Label>
                          <Select>
                            <SelectTrigger id="school-select">
                              <SelectValue placeholder="Choose school" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">Lincoln High School</SelectItem>
                              <SelectItem value="2">Roosevelt Middle School</SelectItem>
                              <SelectItem value="3">Jefferson Elementary</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label>Upload File</Label>
                          <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                            <p className="text-sm font-medium mb-1">
                              Click to upload or drag and drop
                            </p>
                            <p className="text-xs text-muted-foreground">
                              CSV or Excel file (max 10MB)
                            </p>
                            <input type="file" accept=".csv,.xlsx,.xls" className="hidden" />
                          </div>
                        </div>
                        <div className="bg-muted p-4 rounded-lg">
                          <p className="text-sm font-medium mb-2">Required Fields:</p>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• First Name, Last Name</li>
                            <li>• Sex (Male/Female/Other)</li>
                            <li>• Grade, Section</li>
                            <li>• Parent's Phone Number</li>
                            <li>• Date of Birth (optional)</li>
                            <li>• Address (optional)</li>
                          </ul>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsStudentImportOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={() => setIsStudentImportOpen(false)}>
                          Import Students
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" className="gap-2">
                    <Download className="w-4 h-4" />
                    Download Template
                  </Button>
                </div>
              </div>
            
            <div className="space-y-4 mb-4">
              {/* Filter Dropdowns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Select value={studentFilterSchool} onValueChange={setStudentFilterSchool}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="All Schools" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    <SelectItem value="all">All Schools</SelectItem>
                    {uniqueSchools.map((school) => (
                      <SelectItem key={school} value={school}>
                        {school}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={studentFilterGrade} onValueChange={setStudentFilterGrade}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="All Grades" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    <SelectItem value="all">All Grades</SelectItem>
                    {uniqueGrades.map((grade) => (
                      <SelectItem key={grade} value={grade}>
                        Grade {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={studentFilterSection} onValueChange={setStudentFilterSection}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="All Sections" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    <SelectItem value="all">All Sections</SelectItem>
                    {uniqueSections.map((section) => (
                      <SelectItem key={section} value={section}>
                        Section {section}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Section</TableHead>
                      <TableHead>Sex</TableHead>
                      <TableHead>Parent Phone</TableHead>
                      <TableHead>School</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                          No students found matching your filters
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.grade}</TableCell>
                        <TableCell>{student.section}</TableCell>
                        <TableCell>{student.sex}</TableCell>
                        <TableCell>{student.parentPhone}</TableCell>
                        <TableCell>{student.school}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{student.status}</Badge>
                        </TableCell>
                      </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
          </CardContent>
        </TabsContent>

        {/* Teachers Tab */}
        <TabsContent value="teachers" className="m-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2">
                  <Dialog open={isTeacherImportOpen} onOpenChange={setIsTeacherImportOpen}>
                    <DialogTrigger asChild>
                      <Button className="gap-2">
                        <Upload className="w-4 h-4" />
                        Bulk Import Teachers
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Import Teachers from CSV/Excel</DialogTitle>
                        <DialogDescription>
                          Upload a CSV or Excel file with teacher data
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="teacher-school-select">Select School *</Label>
                          <Select>
                            <SelectTrigger id="teacher-school-select">
                              <SelectValue placeholder="Choose school" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">Lincoln High School</SelectItem>
                              <SelectItem value="2">Roosevelt Middle School</SelectItem>
                              <SelectItem value="3">Jefferson Elementary</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label>Upload File</Label>
                          <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                            <p className="text-sm font-medium mb-1">
                              Click to upload or drag and drop
                            </p>
                            <p className="text-xs text-muted-foreground">
                              CSV or Excel file (max 10MB)
                            </p>
                            <input type="file" accept=".csv,.xlsx,.xls" className="hidden" />
                          </div>
                        </div>
                        <div className="bg-muted p-4 rounded-lg">
                          <p className="text-sm font-medium mb-2">Required Fields:</p>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• First Name, Last Name</li>
                            <li>• Sex (Male/Female/Other)</li>
                            <li>• Email ID (unique)</li>
                            <li>• Designation (Teacher/HOD/Principal/etc.)</li>
                            <li>• Grade(s) & Section(s)</li>
                            <li>• Phone Number (optional)</li>
                            <li>• Date of Birth, Address (optional)</li>
                          </ul>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsTeacherImportOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={() => setIsTeacherImportOpen(false)}>
                          Import Teachers
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" className="gap-2">
                    <Download className="w-4 h-4" />
                    Download Template
                  </Button>
                </div>
              </div>
            
            <div className="space-y-4 mb-4">
              {/* Filter Dropdowns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Select value={teacherFilterSchool} onValueChange={setTeacherFilterSchool}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="All Schools" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    <SelectItem value="all">All Schools</SelectItem>
                    {uniqueSchools.map((school) => (
                      <SelectItem key={school} value={school}>
                        {school}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={teacherFilterDesignation} onValueChange={setTeacherFilterDesignation}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="All Designations" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    <SelectItem value="all">All Designations</SelectItem>
                    {uniqueTeacherDesignations.map((designation) => (
                      <SelectItem key={designation} value={designation}>
                        {designation}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={teacherFilterGrade} onValueChange={setTeacherFilterGrade}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="All Grades" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    <SelectItem value="all">All Grades</SelectItem>
                    {uniqueGrades.map((grade) => (
                      <SelectItem key={grade} value={grade}>
                        Grade {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search teachers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Designation</TableHead>
                      <TableHead>Grades</TableHead>
                      <TableHead>Sections</TableHead>
                      <TableHead>School</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTeachers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                          No teachers found matching your filters
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTeachers.map((teacher) => (
                      <TableRow key={teacher.id}>
                        <TableCell className="font-medium">{teacher.name}</TableCell>
                        <TableCell>{teacher.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{teacher.designation}</Badge>
                        </TableCell>
                        <TableCell>{teacher.grades}</TableCell>
                        <TableCell>{teacher.sections}</TableCell>
                        <TableCell>{teacher.school}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{teacher.status}</Badge>
                        </TableCell>
                      </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
          </CardContent>
        </TabsContent>

        {/* Others Tab */}
        <TabsContent value="others" className="m-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2">
                  <Button variant="outline" className="gap-2">
                    <Download className="w-4 h-4" />
                    Download Template
                  </Button>
                </div>
              </div>
            
            <div className="space-y-4 mb-4">
              {/* Filter Dropdowns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Select value={othersFilterSchool} onValueChange={setOthersFilterSchool}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="All Schools" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    <SelectItem value="all">All Schools</SelectItem>
                    {uniqueSchools.map((school) => (
                      <SelectItem key={school} value={school}>
                        {school}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={othersFilterDesignation} onValueChange={setOthersFilterDesignation}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="All Designations" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    <SelectItem value="all">All Designations</SelectItem>
                    {uniqueOthersDesignations.map((designation) => (
                      <SelectItem key={designation} value={designation}>
                        {designation}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search others..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Designation</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>School</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOthers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                          No users found matching your filters
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOthers.map((other) => (
                      <TableRow key={other.id}>
                        <TableCell className="font-medium">{other.name}</TableCell>
                        <TableCell>{other.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{other.designation}</Badge>
                        </TableCell>
                        <TableCell>{other.phone}</TableCell>
                        <TableCell>{other.school}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{other.status}</Badge>
                        </TableCell>
                      </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
          </CardContent>
        </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
