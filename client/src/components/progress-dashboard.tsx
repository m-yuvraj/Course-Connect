import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CalendarDays, PieChart, Trophy } from "lucide-react";

export default function ProgressDashboard() {
  // Mock data - in real app this would come from API
  const weeklyProgress = {
    topicsCompleted: 3,
    topicsTarget: 5,
    studyHours: 12,
    studyTarget: 15,
    savedResources: 8
  };

  const subjects = [
    { name: "Data Structures", percentage: 45, color: "bg-primary" },
    { name: "Machine Learning", percentage: 30, color: "bg-secondary" },
    { name: "Databases", percentage: 25, color: "bg-accent" }
  ];

  const achievements = [
    {
      title: "7-Day Streak!",
      description: "Keep the momentum going",
      icon: "🔥",
      bgColor: "from-yellow-50 to-orange-50",
      borderColor: "border-yellow-200"
    },
    {
      title: "Bookworm",
      description: "Completed 5 books this month",
      icon: "📚",
      bgColor: "from-blue-50 to-indigo-50",
      borderColor: "border-blue-200"
    },
    {
      title: "Quick Learner",
      description: "Completed 3 topics in one day",
      icon: "🎓",
      bgColor: "from-green-50 to-teal-50",
      borderColor: "border-green-200"
    }
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      {/* Weekly Progress */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>This Week</CardTitle>
            <div className="w-10 h-10 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
              <CalendarDays className="text-primary h-5 w-5" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Topics Completed</span>
                <span className="font-medium" data-testid="weekly-topics">
                  {weeklyProgress.topicsCompleted}/{weeklyProgress.topicsTarget}
                </span>
              </div>
              <Progress value={(weeklyProgress.topicsCompleted / weeklyProgress.topicsTarget) * 100} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Study Hours</span>
                <span className="font-medium" data-testid="weekly-hours">
                  {weeklyProgress.studyHours}/{weeklyProgress.studyTarget}
                </span>
              </div>
              <Progress value={(weeklyProgress.studyHours / weeklyProgress.studyTarget) * 100} className="[&>div]:bg-secondary" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Resources Saved</span>
                <span className="font-medium" data-testid="saved-resources">
                  {weeklyProgress.savedResources}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subject Breakdown */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Subject Focus</CardTitle>
            <div className="w-10 h-10 bg-secondary bg-opacity-10 rounded-lg flex items-center justify-center">
              <PieChart className="text-secondary h-5 w-5" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {subjects.map((subject, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 ${subject.color} rounded-full`}></div>
                  <span className="text-sm font-medium text-gray-700" data-testid={`subject-${index}`}>
                    {subject.name}
                  </span>
                </div>
                <span className="text-sm text-gray-500" data-testid={`subject-percentage-${index}`}>
                  {subject.percentage}%
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Achievements</CardTitle>
            <div className="w-10 h-10 bg-accent bg-opacity-10 rounded-lg flex items-center justify-center">
              <Trophy className="text-accent h-5 w-5" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`flex items-center space-x-3 p-3 bg-gradient-to-r ${achievement.bgColor} rounded-lg border ${achievement.borderColor}`}
                data-testid={`achievement-${index}`}
              >
                <div className="text-2xl">{achievement.icon}</div>
                <div>
                  <p className="text-sm font-medium text-gray-900" data-testid={`achievement-title-${index}`}>
                    {achievement.title}
                  </p>
                  <p className="text-xs text-gray-600" data-testid={`achievement-description-${index}`}>
                    {achievement.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
