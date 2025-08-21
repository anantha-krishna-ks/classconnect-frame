import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const activities = [
  {
    id: 1,
    student: "John Smith",
    avatar: "JS",
    action: "Submitted assignment",
    subject: "Mathematics",
    time: "2 minutes ago",
    type: "success"
  },
  {
    id: 2,
    student: "Emma Wilson",
    avatar: "EW",
    action: "Missed class",
    subject: "English Literature",
    time: "1 hour ago",
    type: "warning"
  },
  {
    id: 3,
    student: "Michael Johnson",
    avatar: "MJ",
    action: "Graded test",
    subject: "Science",
    time: "3 hours ago",
    type: "info"
  },
  {
    id: 4,
    student: "Sarah Davis",
    avatar: "SD",
    action: "Parent meeting scheduled",
    subject: "General",
    time: "1 day ago",
    type: "default"
  }
];

const getBadgeVariant = (type: string) => {
  switch (type) {
    case "success": return "default";
    case "warning": return "destructive";
    case "info": return "secondary";
    default: return "outline";
  }
};

export function RecentActivities() {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">
          Recent Activities
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <Avatar className="h-10 w-10">
              <AvatarImage src={`/avatars/${activity.id}.png`} />
              <AvatarFallback className="bg-gradient-primary text-white text-xs">
                {activity.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-medium text-foreground">
                  {activity.student}
                </p>
                <Badge variant={getBadgeVariant(activity.type)} className="text-xs">
                  {activity.subject}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{activity.action}</p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}