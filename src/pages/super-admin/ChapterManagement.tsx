import { useState } from "react";
import { Upload, FileText, Search, Download, Trash2, Eye } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";

export default function ChapterManagement() {
  const [searchQuery, setSearchQuery] = useState("");

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Chapter Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage chapter content, PDFs, and question papers for AI training
        </p>
      </div>

      <Tabs defaultValue="pdfs" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pdfs">Chapter PDFs</TabsTrigger>
          <TabsTrigger value="chapters">Chapter List</TabsTrigger>
          <TabsTrigger value="questions">Question Papers</TabsTrigger>
        </TabsList>

        {/* PDF Upload Tab */}
        <TabsContent value="pdfs" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Chapter PDF Management</CardTitle>
                  <CardDescription>
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
                          <Input id="pdf-subject" placeholder="e.g., Mathematics" />
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
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
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
                            <FileText className="w-4 h-4 text-red-600" />
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

        {/* Chapter List Tab */}
        <TabsContent value="chapters" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Chapter List Import</CardTitle>
                  <CardDescription>
                    Import consolidated chapter lists from CSV/Excel
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button className="gap-2">
                    <Upload className="w-4 h-4" />
                    Import Chapter List
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Download className="w-4 h-4" />
                    Download Template
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-6 rounded-lg text-center">
                <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="font-medium mb-2">No chapter lists imported yet</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Import a CSV or Excel file with chapter titles organized by grade
                </p>
                <Button className="gap-2">
                  <Upload className="w-4 h-4" />
                  Import Your First List
                </Button>
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
                  <CardDescription>
                    Upload previous years' question papers for future extraction
                  </CardDescription>
                </div>
                <Dialog>
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
                          <Input id="qp-year" type="number" placeholder="2023" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="qp-subject">Subject</Label>
                          <Input id="qp-subject" placeholder="Math" />
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
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
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
                            <FileText className="w-4 h-4 text-blue-600" />
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
    </div>
  );
}
