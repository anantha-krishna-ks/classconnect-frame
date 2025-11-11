import { useState } from "react";
import { Upload, FileText, Search, Download, Trash2, Eye, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
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
import { Textarea } from "@/components/ui/textarea";

export default function ChapterManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isChapterListImportOpen, setIsChapterListImportOpen] = useState(false);
  const [isQuestionPaperUploadOpen, setIsQuestionPaperUploadOpen] = useState(false);
  const [isEditPdfOpen, setIsEditPdfOpen] = useState(false);
  const [editingPdf, setEditingPdf] = useState<any>(null);
  const [classDataType, setClassDataType] = useState<string>("");
  const [selectedClassForSubject, setSelectedClassForSubject] = useState<string>("");
  const [isClassUploadOpen, setIsClassUploadOpen] = useState(false);
  const { toast } = useToast();
  
  // Global filter states
  const [filterCustomer, setFilterCustomer] = useState<string>("all");
  const [filterOrganization, setFilterOrganization] = useState<string>("all");
  const [filterCity, setFilterCity] = useState<string>("all");
  
  // Tab-specific filters - Chapter List
  const [chapterListGrade, setChapterListGrade] = useState<string>("all");
  const [chapterListSubject, setChapterListSubject] = useState<string>("all");
  
  // Tab-specific filters - Chapter PDFs
  const [pdfGrade, setPdfGrade] = useState<string>("all");
  const [pdfSubject, setPdfSubject] = useState<string>("all");
  
  // Tab-specific filters - Question Papers
  const [questionGrade, setQuestionGrade] = useState<string>("all");
  const [questionSubject, setQuestionSubject] = useState<string>("all");

  // Mock filter data
  const customers = ["ABC Education", "XYZ Schools Network", "Global Learning Group"];
  const organizations = ["Lincoln High School", "Roosevelt Middle School", "Jefferson Elementary"];
  const cities = ["New York", "Los Angeles", "Chicago", "Boston"];
  const grades = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
  const subjects = ["Mathematics", "Science", "English", "Social Studies", "Physics", "Chemistry", "Biology", "History", "Geography", "Computer Science"];

  // Mock PDF data
  const pdfs = [
    {
      id: 1,
      filename: "Grade_10_Mathematics_Ch1.pdf",
      grade: "10",
      subject: "Mathematics",
      chapter: "Chapter 1: Real Numbers",
      uploadedBy: "Super Admin",
      uploadedDate: "2024-01-15",
      size: "2.4 MB",
      status: "Processed",
    },
    {
      id: 2,
      filename: "Grade_10_Science_Ch5.pdf",
      grade: "10",
      subject: "Science",
      chapter: "Chapter 5: Periodic Classification",
      uploadedBy: "Super Admin",
      uploadedDate: "2024-01-14",
      size: "3.1 MB",
      status: "Processing",
    },
  ];

  // Mock chapters
  const chapters = [
    {
      id: 1,
      name: "Real Numbers",
      grade: "10",
      subject: "Mathematics",
      school: "Lincoln High School",
    },
    {
      id: 2,
      name: "Periodic Classification",
      grade: "10",
      subject: "Science",
      school: "Lincoln High School",
    },
  ];

  // Mock question papers
  const questionPapers = [
    {
      id: 1,
      filename: "Grade_10_Math_Annual_2023.pdf",
      grade: "10",
      subject: "Mathematics",
      year: "2023",
      type: "Annual",
      school: "Lincoln High School",
      uploadedDate: "2024-01-10",
      size: "1.8 MB",
    },
  ];

  // Mock class data
  const classData = [
    { id: 1, name: "Grade 10 - Section A", type: "Class" },
    { id: 2, name: "Grade 10 - Section B", type: "Class" },
    { id: 3, name: "Mathematics - Grade 10", type: "Subject" },
  ];

  // Edit handlers
  const handleEditPdf = (pdf: any) => {
    setEditingPdf(pdf);
    setIsEditPdfOpen(true);
  };

  const handleSavePdf = () => {
    // TODO: Implement save logic
    toast({
      title: "PDF updated",
      description: "Chapter PDF information has been updated successfully.",
    });
    setIsEditPdfOpen(false);
    setEditingPdf(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Chapter Management</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage chapter content, PDFs, and question papers for AI training
        </p>
      </div>

      {/* Global Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter content by customer, organization, and city</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Select value={filterCustomer} onValueChange={setFilterCustomer}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="All Customers" />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="all">All Customers</SelectItem>
                {customers.map((customer) => (
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
                {organizations.map((org) => (
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
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="class-data" className="space-y-6">
        <TabsList>
          <TabsTrigger value="class-data">Class Data</TabsTrigger>
          <TabsTrigger value="chapters">Chapter List</TabsTrigger>
          <TabsTrigger value="pdfs">Chapter PDFs</TabsTrigger>
          <TabsTrigger value="questions">Question Papers</TabsTrigger>
        </TabsList>

        {/* Class Data Tab */}
        <TabsContent value="class-data" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Class Data Management</CardTitle>
                  <CardDescription className="mt-2">
                    Upload and manage class and subject data
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Select value={classDataType} onValueChange={(value) => {
                  setClassDataType(value);
                  setSelectedClassForSubject("");
                }}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    <SelectItem value="class">Class</SelectItem>
                    <SelectItem value="subject">Subject</SelectItem>
                  </SelectContent>
                </Select>

                {classDataType === "subject" && (
                  <Select value={selectedClassForSubject} onValueChange={setSelectedClassForSubject}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select Class" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover z-50">
                      {grades.map((grade) => (
                        <SelectItem key={grade} value={grade}>
                          Grade {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {((classDataType === "class") || (classDataType === "subject" && selectedClassForSubject)) && (
                <Dialog open={isClassUploadOpen} onOpenChange={setIsClassUploadOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Upload className="w-4 h-4" />
                      Upload {classDataType === "class" ? "Class" : "Subject"} Data
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Upload {classDataType === "class" ? "Class" : "Subject"} Data</DialogTitle>
                      <DialogDescription>
                        Upload CSV or Excel file with {classDataType} information
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="class-school">Select School *</Label>
                        <Select>
                          <SelectTrigger id="class-school">
                            <SelectValue placeholder="Choose school" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover z-50">
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
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsClassUploadOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => {
                        setIsClassUploadOpen(false);
                        toast({
                          title: "Data uploaded",
                          description: `${classDataType === "class" ? "Class" : "Subject"} data has been uploaded successfully.`,
                        });
                      }}>
                        Upload Data
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}

              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Class Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.type}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="w-4 h-4 text-destructive" />
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
        </TabsContent>

        {/* Chapter List Tab */}
        <TabsContent value="chapters" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Chapter List Import</CardTitle>
                  <CardDescription className="mt-2">
                    Import consolidated chapter lists from CSV/Excel
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Dialog open={isChapterListImportOpen} onOpenChange={setIsChapterListImportOpen}>
                    <DialogTrigger asChild>
                      <Button className="gap-2">
                        <Upload className="w-4 h-4" />
                        Import Chapter List
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Import Chapter List</DialogTitle>
                        <DialogDescription>
                          Upload a CSV or Excel file with consolidated chapter lists from all grades
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="chapter-school">Select School *</Label>
                          <Select>
                            <SelectTrigger id="chapter-school">
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
                              CSV or Excel file with chapter lists (max 10MB)
                            </p>
                            <input type="file" accept=".csv,.xlsx,.xls" className="hidden" />
                          </div>
                        </div>
                        <div className="bg-muted p-4 rounded-lg">
                          <p className="text-sm font-medium mb-2">Required File Format:</p>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• <strong>Grade</strong> - Numeric or text (e.g., "10" or "Grade 10")</li>
                            <li>• <strong>Section</strong> - Section identifier (e.g., "A", "B", "Science")</li>
                            <li>• <strong>Subject</strong> - Subject name (e.g., "Mathematics", "Physics")</li>
                            <li>• <strong>Chapter Title</strong> - Full chapter name</li>
                          </ul>
                          <p className="text-xs text-muted-foreground mt-3">
                            Example: Grade | Section | Subject | Chapter Title
                          </p>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsChapterListImportOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={() => setIsChapterListImportOpen(false)}>
                          Import Chapter List
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
            </CardHeader>
            <CardContent>
              {/* Grade and Subject Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <Select value={chapterListGrade} onValueChange={setChapterListGrade}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="All Grades" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    <SelectItem value="all">All Grades</SelectItem>
                    {grades.map((grade) => (
                      <SelectItem key={grade} value={grade}>
                        Grade {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={chapterListSubject} onValueChange={setChapterListSubject}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="All Subjects" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    <SelectItem value="all">All Subjects</SelectItem>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Chapter Name</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {chapters.map((chapter) => (
                      <TableRow key={chapter.id}>
                        <TableCell className="font-medium">{chapter.name}</TableCell>
                        <TableCell>{chapter.grade}</TableCell>
                        <TableCell>{chapter.subject}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="w-4 h-4 text-destructive" />
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
        </TabsContent>

        {/* Chapter PDFs Tab */}
        <TabsContent value="pdfs" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Chapter PDF Management</CardTitle>
                  <CardDescription className="mt-2">
                    Upload chapter PDFs for AI training and content generation
                  </CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Upload className="w-4 h-4" />
                      Upload PDFs
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Upload Chapter PDFs</DialogTitle>
                      <DialogDescription>
                        Upload one or more PDF files for AI training
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="pdf-school">Select School *</Label>
                        <Select>
                          <SelectTrigger id="pdf-school">
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
                        <Label htmlFor="pdf-resource-vault">Resource Vault *</Label>
                        <Input
                          id="pdf-resource-vault"
                          placeholder="Enter resource vault name"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="pdf-grade">Grade *</Label>
                          <Select>
                            <SelectTrigger id="pdf-grade">
                              <SelectValue placeholder="Select grade" />
                            </SelectTrigger>
                            <SelectContent>
                              {[...Array(12)].map((_, i) => (
                                <SelectItem key={i + 1} value={String(i + 1)}>
                                  Grade {i + 1}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="pdf-subject">Subject</Label>
                          <Select>
                            <SelectTrigger id="pdf-subject">
                              <SelectValue placeholder="Select subject" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="mathematics">Mathematics</SelectItem>
                              <SelectItem value="science">Science</SelectItem>
                              <SelectItem value="english">English</SelectItem>
                              <SelectItem value="social-studies">Social Studies</SelectItem>
                              <SelectItem value="physics">Physics</SelectItem>
                              <SelectItem value="chemistry">Chemistry</SelectItem>
                              <SelectItem value="biology">Biology</SelectItem>
                              <SelectItem value="history">History</SelectItem>
                              <SelectItem value="geography">Geography</SelectItem>
                              <SelectItem value="computer-science">Computer Science</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label>Upload Files</Label>
                        <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                          <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-sm font-medium mb-1">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PDF files (max 20MB each, multiple files supported)
                          </p>
                          <input type="file" accept=".pdf" multiple className="hidden" />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="pdf-notes">Notes (Optional)</Label>
                        <Textarea
                          id="pdf-notes"
                          placeholder="Add any notes or descriptions..."
                          rows={3}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline">
                        Cancel
                      </Button>
                      <Button>
                        Upload PDFs
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {/* Grade and Subject Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <Select value={pdfGrade} onValueChange={setPdfGrade}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="All Grades" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    <SelectItem value="all">All Grades</SelectItem>
                    {grades.map((grade) => (
                      <SelectItem key={grade} value={grade}>
                        Grade {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={pdfSubject} onValueChange={setPdfSubject}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="All Subjects" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    <SelectItem value="all">All Subjects</SelectItem>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search PDFs..."
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
                      <TableHead>Filename</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Chapter</TableHead>
                      <TableHead>Uploaded</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pdfs.map((pdf) => (
                      <TableRow key={pdf.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-destructive" />
                            <span className="font-medium">{pdf.filename}</span>
                          </div>
                        </TableCell>
                        <TableCell>{pdf.grade}</TableCell>
                        <TableCell>{pdf.subject}</TableCell>
                        <TableCell>{pdf.chapter}</TableCell>
                        <TableCell>{pdf.uploadedDate}</TableCell>
                        <TableCell>{pdf.size}</TableCell>
                        <TableCell>
                          <Badge
                            variant={pdf.status === "Processed" ? "secondary" : "outline"}
                          >
                            {pdf.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleEditPdf(pdf)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="w-4 h-4 text-destructive" />
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
        </TabsContent>

        {/* Question Papers Tab */}
        <TabsContent value="questions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Question Paper Management</CardTitle>
                  <CardDescription className="mt-2">
                    Upload previous years' question papers for future extraction
                  </CardDescription>
                </div>
                <Dialog open={isQuestionPaperUploadOpen} onOpenChange={setIsQuestionPaperUploadOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Upload className="w-4 h-4" />
                      Upload Question Papers
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Upload Question Papers</DialogTitle>
                      <DialogDescription>
                        Upload PDF or image files of question papers
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="qp-school">Select School *</Label>
                        <Select>
                          <SelectTrigger id="qp-school">
                            <SelectValue placeholder="Choose school" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Lincoln High School</SelectItem>
                            <SelectItem value="2">Roosevelt Middle School</SelectItem>
                            <SelectItem value="3">Jefferson Elementary</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="qp-grade">Grade *</Label>
                          <Select>
                            <SelectTrigger id="qp-grade">
                              <SelectValue placeholder="Grade" />
                            </SelectTrigger>
                            <SelectContent>
                              {[...Array(12)].map((_, i) => (
                                <SelectItem key={i + 1} value={String(i + 1)}>
                                  {i + 1}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="qp-year">Year *</Label>
                          <Select>
                            <SelectTrigger id="qp-year">
                              <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                            <SelectContent>
                              {[...Array(15)].map((_, i) => {
                                const year = new Date().getFullYear() - 10 + i;
                                return (
                                  <SelectItem key={year} value={String(year)}>
                                    {year}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="qp-subject">Subject</Label>
                          <Select>
                            <SelectTrigger id="qp-subject">
                              <SelectValue placeholder="Select subject" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="mathematics">Mathematics</SelectItem>
                              <SelectItem value="science">Science</SelectItem>
                              <SelectItem value="english">English</SelectItem>
                              <SelectItem value="social-studies">Social Studies</SelectItem>
                              <SelectItem value="physics">Physics</SelectItem>
                              <SelectItem value="chemistry">Chemistry</SelectItem>
                              <SelectItem value="biology">Biology</SelectItem>
                              <SelectItem value="history">History</SelectItem>
                              <SelectItem value="geography">Geography</SelectItem>
                              <SelectItem value="computer-science">Computer Science</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label>Upload Files</Label>
                        <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                          <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-sm font-medium mb-1">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PDF or image files (multiple files supported)
                          </p>
                          <input type="file" accept=".pdf,.jpg,.jpeg,.png" multiple className="hidden" />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsQuestionPaperUploadOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setIsQuestionPaperUploadOpen(false)}>
                        Upload Question Papers
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {/* Grade and Subject Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <Select value={questionGrade} onValueChange={setQuestionGrade}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="All Grades" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    <SelectItem value="all">All Grades</SelectItem>
                    {grades.map((grade) => (
                      <SelectItem key={grade} value={grade}>
                        Grade {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={questionSubject} onValueChange={setQuestionSubject}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="All Subjects" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    <SelectItem value="all">All Subjects</SelectItem>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search question papers..."
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
                      <TableHead>Filename</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>School</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {questionPapers.map((paper) => (
                      <TableRow key={paper.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-primary" />
                            <span className="font-medium">{paper.filename}</span>
                          </div>
                        </TableCell>
                        <TableCell>{paper.grade}</TableCell>
                        <TableCell>{paper.subject}</TableCell>
                        <TableCell>{paper.year}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{paper.type}</Badge>
                        </TableCell>
                        <TableCell>{paper.school}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="w-4 h-4 text-destructive" />
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
        </TabsContent>
      </Tabs>

      {/* Edit PDF Dialog */}
      <Dialog open={isEditPdfOpen} onOpenChange={setIsEditPdfOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Chapter PDF</DialogTitle>
            <DialogDescription>Update PDF metadata and information</DialogDescription>
          </DialogHeader>
          {editingPdf && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-filename">Filename *</Label>
                <Input
                  id="edit-filename"
                  defaultValue={editingPdf.filename}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-grade">Grade *</Label>
                  <Select defaultValue={editingPdf.grade}>
                    <SelectTrigger id="edit-grade">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover z-50">
                      {[...Array(12)].map((_, i) => (
                        <SelectItem key={i + 1} value={String(i + 1)}>
                          Grade {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-subject">Subject *</Label>
                  <Select defaultValue={editingPdf.subject.toLowerCase()}>
                    <SelectTrigger id="edit-subject">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover z-50">
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="social-studies">Social Studies</SelectItem>
                      <SelectItem value="physics">Physics</SelectItem>
                      <SelectItem value="chemistry">Chemistry</SelectItem>
                      <SelectItem value="biology">Biology</SelectItem>
                      <SelectItem value="history">History</SelectItem>
                      <SelectItem value="geography">Geography</SelectItem>
                      <SelectItem value="computer-science">Computer Science</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-chapter">Chapter Title *</Label>
                <Input
                  id="edit-chapter"
                  defaultValue={editingPdf.chapter}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-school">School *</Label>
                <Select>
                  <SelectTrigger id="edit-school">
                    <SelectValue placeholder="Choose school" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    <SelectItem value="1">Lincoln High School</SelectItem>
                    <SelectItem value="2">Roosevelt Middle School</SelectItem>
                    <SelectItem value="3">Jefferson Elementary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-notes">Notes (Optional)</Label>
                <Textarea
                  id="edit-notes"
                  placeholder="Add any notes or descriptions..."
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditPdfOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePdf}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
