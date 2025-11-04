import { useState } from "react";
import { Plus, Search, Edit, Trash2, Building2 } from "lucide-react";
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

export default function OrganizationManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Mock data
  const organizations = [
    {
      id: 1,
      name: "Springfield School District",
      type: "School District",
      schools: 12,
      users: 8542,
      contact: "John Doe",
      email: "john@springfield.edu",
      phone: "+1 234 567 8900",
      status: "Active",
    },
    {
      id: 2,
      name: "Greenwood Academy Network",
      type: "Private School",
      schools: 5,
      users: 3200,
      contact: "Jane Smith",
      email: "jane@greenwood.edu",
      phone: "+1 234 567 8901",
      status: "Active",
    },
    {
      id: 3,
      name: "Riverside Education Group",
      type: "Corporate",
      schools: 8,
      users: 5100,
      contact: "Mike Johnson",
      email: "mike@riverside.edu",
      phone: "+1 234 567 8902",
      status: "Active",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Organization Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage customer organizations and their details
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Organization
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Organization</DialogTitle>
              <DialogDescription>
                Add a new customer organization to the system
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="org-name">Organization Name *</Label>
                <Input id="org-name" placeholder="Enter organization name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="org-type">Organization Type *</Label>
                <Select>
                  <SelectTrigger id="org-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="school">School</SelectItem>
                    <SelectItem value="district">School District</SelectItem>
                    <SelectItem value="private">Private School</SelectItem>
                    <SelectItem value="corporate">Corporate Organization</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="Enter address" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="contact-name">Contact Person *</Label>
                  <Input id="contact-name" placeholder="Full name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="contact-email">Email *</Label>
                  <Input id="contact-email" type="email" placeholder="email@example.com" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contact-phone">Phone</Label>
                <Input id="contact-phone" type="tel" placeholder="+1 234 567 8900" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsDialogOpen(false)}>Create Organization</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Organizations</CardTitle>
          <CardDescription>View and manage all customer organizations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search organizations..."
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
                  <TableHead>Organization</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Schools</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {organizations.map((org) => (
                  <TableRow key={org.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium">{org.name}</p>
                          <p className="text-sm text-muted-foreground">{org.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{org.type}</TableCell>
                    <TableCell>{org.schools}</TableCell>
                    <TableCell>{org.users.toLocaleString()}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{org.contact}</p>
                        <p className="text-xs text-muted-foreground">{org.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{org.status}</Badge>
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
    </div>
  );
}
