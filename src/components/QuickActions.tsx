import { Plus, UserPlus, CalendarPlus, FileText, MessageSquare, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const actions = [
  {
    title: "Add Student",
    description: "Register a new student",
    icon: UserPlus,
    variant: "default" as const
  },
  {
    title: "Create Class", 
    description: "Set up a new class",
    icon: Plus,
    variant: "secondary" as const
  },
  {
    title: "Schedule Event",
    description: "Add to calendar",
    icon: CalendarPlus,
    variant: "outline" as const
  },
  {
    title: "Generate Report",
    description: "Create attendance report",
    icon: FileText,
    variant: "outline" as const
  },
  {
    title: "Send Announcement",
    description: "Notify all students",
    icon: MessageSquare,
    variant: "outline" as const
  },
  {
    title: "Export Data",
    description: "Download student data",
    icon: Download,
    variant: "outline" as const
  }
];

export function QuickActions() {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant}
              className="h-auto p-4 flex flex-col items-start text-left space-y-1 hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-center gap-2 w-full">
                <action.icon className="h-4 w-4" />
                <span className="font-medium text-sm">{action.title}</span>
              </div>
              <span className="text-xs opacity-70 font-normal">
                {action.description}
              </span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}