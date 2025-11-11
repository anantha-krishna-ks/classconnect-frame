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

export default function CustomerManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isToggleConfirmOpen, setIsToggleConfirmOpen] = useState(false);
  const [pendingToggle, setPendingToggle] = useState<{ id: number; newState: boolean } | null>(null);
  const { toast } = useToast();

  // Mock data - converted to state
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: "Springfield School District",
      type: "School District",
      organizations: 12,
      users: 8542,
      contact: "John Doe",
      email: "john@springfield.edu",
      phone: "+1 234 567 8900",
      published: true,
      status: "Active",
    },
    {
      id: 2,
      name: "Greenwood Academy Network",
      type: "Private School",
      organizations: 5,
      users: 3200,
      contact: "Jane Smith",
      email: "jane@greenwood.edu",
      phone: "+1 234 567 8901",
      published: true,
      status: "Active",
    },
    {
      id: 3,
      name: "Riverside Education Group",
      type: "Corporate",
      organizations: 8,
      users: 5100,
      contact: "Mike Johnson",
      email: "mike@riverside.edu",
      phone: "+1 234 567 8902",
      published: false,
      status: "Setup",
    },
  ]);

  const handleToggleClick = (customerId: number, currentState: boolean) => {
    setPendingToggle({ id: customerId, newState: !currentState });
    setIsToggleConfirmOpen(true);
  };

  const confirmToggle = () => {
    if (pendingToggle) {
      setCustomers((prevCustomers) =>
        prevCustomers.map((customer) =>
          customer.id === pendingToggle.id
            ? { 
                ...customer, 
                published: pendingToggle.newState,
                status: pendingToggle.newState ? "Active" : "Setup"
              }
            : customer
        )
      );
      
      toast({
        title: pendingToggle.newState ? "Customer Published" : "Customer Unpublished",
        description: `Customer has been ${pendingToggle.newState ? "published" : "unpublished"} successfully.`,
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
          <h1 className="text-2xl font-semibold">Customer Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage customer accounts and their details
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-super-admin-primary hover:bg-super-admin-primary/90 text-super-admin-primary-foreground">
              <Plus className="w-4 h-4" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Customer</DialogTitle>
              <DialogDescription>
                Add a new customer account to the system
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="customer-name">Customer Name *</Label>
                <Input id="customer-name" placeholder="Enter customer name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="customer-type">Customer Type *</Label>
                <Select>
                  <SelectTrigger id="customer-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="school">School</SelectItem>
                    <SelectItem value="corporate">Corporate Organization</SelectItem>
                    <SelectItem value="college">College</SelectItem>
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
              <Button onClick={() => setIsDialogOpen(false)}>Create Customer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="transition-all bg-super-admin-card border-super-admin-border shadow-[0_1px_3px_hsl(var(--super-admin-shadow))]">
        <CardHeader>
          <CardTitle>All Customers</CardTitle>
          <CardDescription>View and manage all customer accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
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
                  <TableHead>Customer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Organizations</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      Status
                      <Badge variant="secondary" className="text-xs">
                        {customers.filter(c => c.status === "Active").length}
                      </Badge>
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                          <Building2 className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{customer.name}</p>
                          <p className="text-xs text-muted-foreground">{customer.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{customer.type}</TableCell>
                    <TableCell>{customer.organizations}</TableCell>
                    <TableCell>{customer.users.toLocaleString()}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{customer.contact}</p>
                        <p className="text-xs text-muted-foreground">{customer.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={customer.published ? "secondary" : "outline"}>
                        {customer.status}
                      </Badge>
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

      {/* Toggle Confirmation Dialog */}
      <AlertDialog open={isToggleConfirmOpen} onOpenChange={setIsToggleConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingToggle?.newState ? "Publish Customer?" : "Unpublish Customer?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingToggle?.newState
                ? "Publishing this customer will enable it for all users and make it active in the system."
                : "Unpublishing this customer will disable it and make it inactive. Users won't be able to access it."}
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
