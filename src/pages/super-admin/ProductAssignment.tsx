import { useState } from "react";
import { Search, Package, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function ProductAssignment() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedTools, setSelectedTools] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  // Mock products/tools data
  const products = [
    {
      id: "lesson-planner",
      name: "Lesson Plan Assistant",
      description: "AI-powered lesson planning tool",
      category: "Planning",
      price: "$49/month",
    },
    {
      id: "assessment-creator",
      name: "Assessment Creator",
      description: "Create and manage assessments",
      category: "Assessment",
      price: "$39/month",
    },
    {
      id: "exam-prep",
      name: "Exam Prep Room",
      description: "Student exam preparation tools",
      category: "Student Tools",
      price: "$29/month",
    },
    {
      id: "slide-generator",
      name: "Slide Generator",
      description: "AI presentation creator",
      category: "Content",
      price: "$35/month",
    },
    {
      id: "resource-vault",
      name: "Resource Vault",
      description: "Centralized resource library",
      category: "Resources",
      price: "$25/month",
    },
    {
      id: "video-editor",
      name: "Video Clip Editor",
      description: "Educational video editing",
      category: "Content",
      price: "$45/month",
    },
  ];

  const handleToolToggle = (toolId: string, enabled: boolean) => {
    setSelectedTools((prev) => ({
      ...prev,
      [toolId]: enabled,
    }));
  };

  const handleActivate = () => {
    if (!selectedSchool) {
      toast({
        title: "No school selected",
        description: "Please select a school first",
        variant: "destructive",
      });
      return;
    }

    const activatedCount = Object.values(selectedTools).filter(Boolean).length;
    if (activatedCount === 0) {
      toast({
        title: "No tools selected",
        description: "Please select at least one tool to activate",
        variant: "destructive",
      });
      return;
    }

    setShowConfirmDialog(true);
  };

  const confirmActivation = () => {
    const activatedTools = products.filter((p) => selectedTools[p.id]);
    toast({
      title: "Tools activated successfully",
      description: `${activatedTools.length} tools have been activated for the selected school`,
    });
    setShowConfirmDialog(false);
    setSelectedTools({});
  };

  const activatedToolsList = products.filter((p) => selectedTools[p.id]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-primary">Product & Tool Assignment</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage product licenses and tool access for schools
        </p>
      </div>

      {/* School Selection */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>Select School</CardTitle>
          <CardDescription>Choose a school to manage its product licenses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Select value={selectedSchool} onValueChange={setSelectedSchool}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a school" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Lincoln High School</SelectItem>
                  <SelectItem value="2">Roosevelt Middle School</SelectItem>
                  <SelectItem value="3">Jefferson Elementary</SelectItem>
                  <SelectItem value="4">Washington Academy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleActivate}
              disabled={!selectedSchool}
              className="gap-2"
            >
              <Check className="w-4 h-4" />
              Activate Selected Tools
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>Available Products & Tools</CardTitle>
          <CardDescription>
            Toggle tools on/off to activate or deactivate licenses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((product) => (
              <Card key={product.id} className="border-none shadow-sm hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Package className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">{product.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {product.description}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={selectedTools[product.id] || false}
                      onCheckedChange={(checked) => handleToolToggle(product.id, checked)}
                      disabled={!selectedSchool}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{product.category}</Badge>
                    <span className="text-sm font-medium text-muted-foreground">
                      {product.price}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Tool Activation</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to activate the following tools for the selected school:
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p className="font-medium text-sm">
                School: {selectedSchool === "1" ? "Lincoln High School" : "Selected School"}
              </p>
              <div className="mt-3">
                <p className="font-medium text-sm mb-2">Activated Tools:</p>
                <ul className="space-y-1">
                  {activatedToolsList.map((tool) => (
                    <li key={tool.id} className="text-sm flex items-center gap-2">
                      <Check className="w-3 h-3" />
                      {tool.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmActivation}>
              <Check className="w-4 h-4 mr-2" />
              Confirm Activation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
