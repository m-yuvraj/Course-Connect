import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Play, Book, FileText } from "lucide-react";

export default function ContinueLearning() {
  const { data: userResources, isLoading } = useQuery({
    queryKey: ["/api/user-resources"],
  });

  const inProgressResources = userResources?.filter(
    (ur: any) => ur.status === 'in_progress'
  ) || [];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Continue Learning</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-start space-x-4 p-4 rounded-lg border">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-2 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className="text-white h-5 w-5" />;
      case 'book':
        return <Book className="text-white h-5 w-5" />;
      default:
        return <FileText className="text-white h-5 w-5" />;
    }
  };

  const getGradientClass = (index: number) => {
    const gradients = [
      "bg-gradient-to-br from-blue-500 to-purple-600",
      "bg-gradient-to-br from-green-500 to-teal-600",
      "bg-gradient-to-br from-orange-500 to-red-600"
    ];
    return gradients[index % gradients.length];
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Continue Learning</CardTitle>
          <span className="text-sm text-gray-500" data-testid="progress-count">
            {inProgressResources.length} in progress
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {inProgressResources.length === 0 ? (
          <div className="text-center py-8 text-gray-500" data-testid="empty-state">
            <Book className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No resources in progress</p>
            <p className="text-sm">Start learning something new!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {inProgressResources.slice(0, 3).map((userResource: any, index: number) => (
              <div
                key={userResource.id}
                className="flex items-start space-x-4 p-4 rounded-lg border border-gray-100 hover:border-primary transition-colors cursor-pointer"
                data-testid={`resource-${userResource.id}`}
              >
                <div className={`w-16 h-16 ${getGradientClass(index)} rounded-lg flex-shrink-0 flex items-center justify-center`}>
                  {getResourceIcon(userResource.resource.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 mb-1" data-testid={`resource-title-${userResource.id}`}>
                    {userResource.resource.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2" data-testid={`resource-source-${userResource.id}`}>
                    {userResource.resource.type.charAt(0).toUpperCase() + userResource.resource.type.slice(1)} • {userResource.resource.source}
                  </p>
                  <div className="flex items-center space-x-2">
                    <Progress value={userResource.progress || 0} className="flex-1" />
                    <span className="text-xs text-gray-500" data-testid={`resource-progress-${userResource.id}`}>
                      {userResource.progress || 0}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
