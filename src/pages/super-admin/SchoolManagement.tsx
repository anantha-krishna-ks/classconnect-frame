import { useState } from "react";
import { Plus, Search, Edit, Trash2, School, Eye, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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

export default function SchoolManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Mock data
  const schools = [
    {
      id: 1,
      name: "Lincoln High School",
      organization: "Springfield School District",
      type: "High School",
      students: 1245,
      teachers: 78,
      principal: "Dr. Sarah Williams",
      email: "principal@lincoln.edu",
      phone: "+1 234 567 8910",
      district: "District A",
      size: "Large",
      published: true,
      status: "Active",
    },
    {
      id: 2,
      name: "Roosevelt Middle School",
      organization: "Springfield School District",
      type: "Middle School",
      students: 856,
      teachers: 52,
      principal: "Mr. David Brown",
      email: "principal@roosevelt.edu",
      phone: "+1 234 567 8911",
      district: "District A",
      size: "Medium",
      published: true,
      status: "Active",
    },
    {
      id: 3,
      name: "Jefferson Elementary",
      organization: "Springfield School District",
      type: "Elementary School",
      students: 542,
      teachers: 34,
      principal: "Ms. Emily Clark",
      email: "principal@jefferson.edu",
      phone: "+1 234 567 8912",
      district: "District B",
      size: "Small",
      published: false,
      status: "Setup",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">School Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage schools within organizations
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add School
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New School</DialogTitle>
              <DialogDescription>
                Add a new school to an organization
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="school-org">Organization *</Label>
                <Select>
                  <SelectTrigger id="school-org">
                    <SelectValue placeholder="Select organization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Springfield School District</SelectItem>
                    <SelectItem value="2">Greenwood Academy Network</SelectItem>
                    <SelectItem value="3">Riverside Education Group</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="school-name">School Name *</Label>
                <Input id="school-name" placeholder="Enter school name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="school-type">School Type *</Label>
                  <Select>
                    <SelectTrigger id="school-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="elementary">Elementary</SelectItem>
                      <SelectItem value="middle">Middle School</SelectItem>
                      <SelectItem value="high">High School</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="school-size">School Size *</Label>
                  <Input id="school-size" type="number" placeholder="Number of students" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="school-address">Address</Label>
                <Input id="school-address" placeholder="Enter address" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="school-district">District</Label>
                <Input id="school-district" placeholder="District name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="principal-name">Principal Name *</Label>
                  <Input id="principal-name" placeholder="Full name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="principal-email">Principal Email *</Label>
                  <Input id="principal-email" type="email" placeholder="email@example.com" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="principal-phone">Phone</Label>
                <Input id="principal-phone" type="tel" placeholder="+1 234 567 8900" />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="publish" />
                <Label htmlFor="publish">Publish school immediately</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsDialogOpen(false)}>Create School</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Schools</CardTitle>
          <CardDescription>View and manage all schools across organizations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search schools..."
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
                  <TableHead>School</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Teachers</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schools.map((school) => (
                  <TableRow key={school.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                          <School className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{school.name}</p>
                          <p className="text-xs text-muted-foreground">{school.principal}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{school.organization}</TableCell>
                    <TableCell>{school.type}</TableCell>
                    <TableCell>{school.students.toLocaleString()}</TableCell>
                    <TableCell>{school.teachers}</TableCell>
                    <TableCell>
                      <Switch checked={school.published} />
                    </TableCell>
                    <TableCell>
                      <Badge variant={school.published ? "secondary" : "outline"}>
                        {school.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" title="View Details">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Edit">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Delete">
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
