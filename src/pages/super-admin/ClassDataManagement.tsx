import { useState } from "react";
import { Upload, Search, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

export default function ClassDataManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [classDataType, setClassDataType] = useState<string>("");
  const [selectedClassForSubject, setSelectedClassForSubject] = useState<string>("");
  const [isClassUploadOpen, setIsClassUploadOpen] = useState(false);
  const { toast } = useToast();
  
  // Global filter states
  const [filterCustomer, setFilterCustomer] = useState<string>("all");
  const [filterOrganization, setFilterOrganization] = useState<string>("all");
  const [filterCity, setFilterCity] = useState<string>("all");

  // Mock filter data
  const customers = ["ABC Education", "XYZ Schools Network", "Global Learning Group"];
  const organizations = ["Lincoln High School", "Roosevelt Middle School", "Jefferson Elementary"];
  const cities = ["New York", "Los Angeles", "Chicago", "Boston"];

  // Mock class data
  const classData = [
    { id: 1, name: "Grade 10", section: "A" },
    { id: 2, name: "Grade 10", section: "B" },
    { id: 3, name: "Mathematics", section: "Grade 10" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold mb-1">Class Data Management</h1>
        <p className="text-sm text-muted-foreground">
          Upload and manage class and subject data
        </p>
      </div>

      {/* Global Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Apply filters to view specific data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label>Customer</Label>
              <Select value={filterCustomer} onValueChange={setFilterCustomer}>
                <SelectTrigger>
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Customers</SelectItem>
                  {customers.map((customer) => (
                    <SelectItem key={customer} value={customer}>
                      {customer}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Organization</Label>
              <Select value={filterOrganization} onValueChange={setFilterOrganization}>
                <SelectTrigger>
                  <SelectValue placeholder="Select organization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Organizations</SelectItem>
                  {organizations.map((org) => (
                    <SelectItem key={org} value={org}>
                      {org}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>City</Label>
              <Select value={filterCity} onValueChange={setFilterCity}>
                <SelectTrigger>
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Class Data Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Class Data Management</CardTitle>
              <CardDescription className="mt-2">
                Upload and manage class and subject data
              </CardDescription>
            </div>
            <Dialog open={isClassUploadOpen} onOpenChange={setIsClassUploadOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Class/Subject Data
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload Class/Subject Data</DialogTitle>
                  <DialogDescription>
                    Upload class or subject information
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label>Select Type *</Label>
                    <Select value={classDataType} onValueChange={setClassDataType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose data type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="class">Class</SelectItem>
                        <SelectItem value="subject">Subject</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {classDataType === "subject" && (
                    <div className="grid gap-2">
                      <Label>Class Name *</Label>
                      <Select value={selectedClassForSubject} onValueChange={setSelectedClassForSubject}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                        <SelectContent>
                          {classData.filter(item => item.name.startsWith("Grade")).map((item) => (
                            <SelectItem key={item.id} value={item.name}>
                              {item.name} - {item.section}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div className="grid gap-2">
                    <Label>Upload File</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 hover:border-primary/50 cursor-pointer transition-colors">
                      <div className="flex flex-col items-center justify-center text-center">
                        <Upload className="w-8 h-8 text-muted-foreground mb-2" />
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
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search class or subject data..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class Name</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.section}</TableCell>
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
    </div>
  );
}
