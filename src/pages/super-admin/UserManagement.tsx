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
      status: "Active",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage students and teachers across all schools
          </p>
        </div>
      </div>

      <Tabs defaultValue="students" className="space-y-6">
        <TabsList>
          <TabsTrigger value="students" className="gap-2">
            <GraduationCap className="w-4 h-4" />
            Students
          </TabsTrigger>
          <TabsTrigger value="teachers" className="gap-2">
            <Users className="w-4 h-4" />
            Teachers
          </TabsTrigger>
        </TabsList>

        {/* Students Tab */}
        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Student Management</CardTitle>
                  <CardDescription>Import and manage student records</CardDescription>
                </div>
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
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" className="gap-2">
                    <Download className="w-4 h-4" />
                    Download Template
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search students..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                </Button>
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
                    {students.map((student) => (
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
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Teachers Tab */}
        <TabsContent value="teachers" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Teacher Management</CardTitle>
                  <CardDescription>Import and manage teacher records</CardDescription>
                </div>
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
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" className="gap-2">
                    <Download className="w-4 h-4" />
                    Download Template
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search teachers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                </Button>
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
                    {teachers.map((teacher) => (
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
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
