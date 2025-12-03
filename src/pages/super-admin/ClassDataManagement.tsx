import { useState } from "react";
import { Upload, Search, Edit, Trash2, BookOpen, Calculator, Atom, BookA, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
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
  const { toast } = useToast();
  
  // Global filter states
  const [filterCustomer, setFilterCustomer] = useState<string>("all");
  const [filterOrganization, setFilterOrganization] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("class");
  const [filterClass, setFilterClass] = useState<string>("");
  
  // Track enabled items
  const [enabledClasses, setEnabledClasses] = useState<Set<number>>(new Set([1, 2]));
  const [enabledSubjects, setEnabledSubjects] = useState<Set<number>>(new Set([3]));

  // Mock filter data
  const customers = [
    "ABC Education", 
    "XYZ Schools Network", 
    "Global Learning Group",
    "Bright Future Academy",
    "Excellence Learning Center",
    "Pioneer Schools",
    "Sunrise International",
    "Golden Valley Schools",
    "Metro Education Hub",
    "Harmony Learning Institute",
    "Apex School Group",
    "Green Valley Academy",
    "Summit Education Network"
  ];
  const organizations = ["Lincoln High School", "Roosevelt Middle School", "Jefferson Elementary"];

  // Mock class data
  const classData = [
    { id: 1, name: "Grade 10", section: "A", icon: BookOpen, color: "bg-blue-500" },
    { id: 2, name: "Grade 10", section: "B", icon: BookOpen, color: "bg-green-500" },
  ];

  const subjectData = [
    { id: 3, name: "Mathematics", section: "Grade 10", icon: Calculator, color: "bg-purple-500" },
    { id: 4, name: "Science", section: "Grade 10", icon: Atom, color: "bg-cyan-500" },
    { id: 5, name: "English", section: "Grade 10", icon: BookA, color: "bg-orange-500" },
    { id: 6, name: "History", section: "Grade 10", icon: Clock, color: "bg-amber-500" },
  ];

  const handleToggleClass = (id: number) => {
    setEnabledClasses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleToggleSubject = (id: number) => {
    setEnabledSubjects(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSaveChanges = () => {
    toast({
      title: "Changes saved",
      description: "Class and subject data has been updated successfully.",
    });
  };

  const handleCancelChanges = () => {
    setEnabledClasses(new Set([1, 2]));
    setEnabledSubjects(new Set([3]));
    toast({
      title: "Changes cancelled",
      description: "All changes have been reverted.",
    });
  };

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-64">
              <Select value={filterType} onValueChange={(value) => {
                setFilterType(value);
                if (value !== "subject") {
                  setFilterClass("");
                }
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="class">Class</SelectItem>
                  <SelectItem value="subject">Subject</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {filterType === "subject" && (
              <div className="w-64">
                <Select value={filterClass} onValueChange={setFilterClass}>
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

          {filterType === "class" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {classData.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Card key={item.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`${item.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                              <IconComponent className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{item.name}</h3>
                            </div>
                          </div>
                          <Switch
                            checked={enabledClasses.has(item.id)}
                            onCheckedChange={() => handleToggleClass(item.id)}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={handleCancelChanges}>Cancel</Button>
                <Button onClick={handleSaveChanges}>Save Changes</Button>
              </div>
            </>
          )}

          {filterType === "subject" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subjectData
                  .filter(item => !filterClass || item.section === filterClass)
                  .map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <Card key={item.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className={`${item.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                                <IconComponent className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg">{item.name}</h3>
                                <p className="text-sm text-muted-foreground">{item.section}</p>
                              </div>
                            </div>
                            <Switch
                              checked={enabledSubjects.has(item.id)}
                              onCheckedChange={() => handleToggleSubject(item.id)}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={handleCancelChanges}>Cancel</Button>
                <Button onClick={handleSaveChanges}>Save Changes</Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
