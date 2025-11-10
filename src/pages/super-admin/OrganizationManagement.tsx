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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function OrganizationManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isToggleConfirmOpen, setIsToggleConfirmOpen] = useState(false);
  const [pendingToggle, setPendingToggle] = useState<{ id: number; newState: boolean } | null>(null);
  const [selectedCustomerType, setSelectedCustomerType] = useState<string>("");
  const { toast } = useToast();

  // Mock data - converted to state
  const [organizations, setOrganizations] = useState([
    {
      id: 1,
      name: "Lincoln High School",
      customer: "Springfield School District",
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
      customer: "Springfield School District",
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
      customer: "Springfield School District",
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
  ]);

  const handleToggleClick = (orgId: number, currentState: boolean) => {
    setPendingToggle({ id: orgId, newState: !currentState });
    setIsToggleConfirmOpen(true);
  };

  const confirmToggle = () => {
    if (pendingToggle) {
      // Update the organizations state
      setOrganizations((prevOrganizations) =>
        prevOrganizations.map((organization) =>
          organization.id === pendingToggle.id
            ? { 
                ...organization, 
                published: pendingToggle.newState,
                status: pendingToggle.newState ? "Active" : "Setup"
              }
            : organization
        )
      );
      
      toast({
        title: pendingToggle.newState ? "Organization Published" : "Organization Unpublished",
        description: `Organization has been ${pendingToggle.newState ? "published" : "unpublished"} successfully.`,
      });
      setIsToggleConfirmOpen(false);
      setPendingToggle(null);
    }
  };

  const cancelToggle = () => {
    setIsToggleConfirmOpen(false);
    setPendingToggle(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Organization Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage organizations within customers
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
                Add a new organization to a customer
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="org-customer">Customer *</Label>
                <Select onValueChange={setSelectedCustomerType} value={selectedCustomerType}>
                  <SelectTrigger id="org-customer">
                    <SelectValue placeholder="Select customer type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="school">School</SelectItem>
                    <SelectItem value="college">College</SelectItem>
                    <SelectItem value="corporate">Corporate Organization</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="org-name">Organization Name *</Label>
                <Input id="org-name" placeholder="Enter organization name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {selectedCustomerType !== "corporate" && (
                  <div className="grid gap-2">
                    <Label htmlFor="org-type">Organization Type *</Label>
                    <Select>
                      <SelectTrigger id="org-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="elementary">Elementary</SelectItem>
                        <SelectItem value="middle">Middle School</SelectItem>
                        <SelectItem value="high">High School</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="grid gap-2">
                  <Label htmlFor="org-size">Organization Size *</Label>
                  <Input id="org-size" type="number" placeholder="Number of students" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="org-address">Address</Label>
                <Input id="org-address" placeholder="Enter address" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="org-city">City</Label>
                <Input id="org-city" placeholder="Enter city" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="org-district">District</Label>
                <Input id="org-district" placeholder="District name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="principal-name">
                    {selectedCustomerType === "corporate" ? "Contact Person Name *" : "Principal Name *"}
                  </Label>
                  <Input id="principal-name" placeholder="Full name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="principal-email">
                    {selectedCustomerType === "corporate" ? "Contact Person Email *" : "Principal Email *"}
                  </Label>
                  <Input id="principal-email" type="email" placeholder="email@example.com" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="principal-phone">Phone</Label>
                <Input id="principal-phone" type="tel" placeholder="+1 234 567 8900" />
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

      <Card className="transition-all bg-super-admin-card border-super-admin-border shadow-[0_1px_3px_hsl(var(--super-admin-shadow))]">
        <CardHeader>
          <CardTitle>All Organizations</CardTitle>
          <CardDescription>View and manage all organizations across customers</CardDescription>
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
                  <TableHead>Customer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Teachers</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {organizations.map((organization) => (
                  <TableRow key={organization.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                          <School className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{organization.name}</p>
                          <p className="text-xs text-muted-foreground">{organization.principal}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{organization.customer}</TableCell>
                    <TableCell>{organization.type}</TableCell>
                    <TableCell>{organization.students.toLocaleString()}</TableCell>
                    <TableCell>{organization.teachers}</TableCell>
                    <TableCell>
                      <Switch 
                        checked={organization.published} 
                        onCheckedChange={() => handleToggleClick(organization.id, organization.published)}
                      />
                    </TableCell>
                    <TableCell>
                      <Badge variant={organization.published ? "secondary" : "outline"}>
                        {organization.status}
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

      {/* Toggle Confirmation Dialog */}
      <AlertDialog open={isToggleConfirmOpen} onOpenChange={setIsToggleConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingToggle?.newState ? "Publish Organization?" : "Unpublish Organization?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingToggle?.newState
                ? "Publishing this organization will enable it for all users and make it active in the system."
                : "Unpublishing this organization will disable it and make it inactive. Users won't be able to access it."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelToggle}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmToggle}>
              {pendingToggle?.newState ? "Publish" : "Unpublish"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
