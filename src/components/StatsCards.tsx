import { Users, BookOpen, ClipboardList, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  {
    title: "Total Students",
    value: "1,234",
    change: "+12%",
    icon: Users,
    color: "text-primary",
    bgColor: "bg-primary/10"
  },
  {
    title: "Active Classes",
    value: "48",
    change: "+3%",
    icon: BookOpen,
    color: "text-secondary",
    bgColor: "bg-secondary/10"
  },
  {
    title: "Assignments Due",
    value: "156",
    change: "-8%",
    icon: ClipboardList,
    color: "text-accent",
    bgColor: "bg-accent/10"
  },
  {
    title: "Attendance Rate",
    value: "94.2%",
    change: "+2.1%",
    icon: TrendingUp,
    color: "text-secondary",
    bgColor: "bg-secondary/10"
  }
];

export function StatsCards() {
  return (
    <>
      {stats.map((stat, index) => (
        <Card key={index} className="shadow-card hover:shadow-elevated transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <p className={`text-xs ${stat.change.startsWith('+') ? 'text-secondary' : 'text-destructive'}`}>
              {stat.change} from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </>
  );
}