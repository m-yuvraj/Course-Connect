import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Book, GraduationCap, FileText, Trash2, Library } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function SavedResources() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const queryClient = useQueryClient();

  const { data: userResources, isLoading } = useQuery({
    queryKey: ["/api/user-resources"],
  });

  const deleteResourceMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/user-resources/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user-resources"] });
    }
  });

  const savedResources = userResources?.filter((ur: any) => ur.bookmarked) || [];

  const filteredResources = selectedFilter === "all" 
    ? savedResources 
    : savedResources.filter((ur: any) => ur.resource.type === selectedFilter);

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className="text-white h-4 w-4" />;
      case 'book':
        return <Book className="text-white h-4 w-4" />;
      case 'course':
        return <GraduationCap className="text-white h-4 w-4" />;
      default:
        return <FileText className="text-white h-4 w-4" />;
    }
  };

  const getGradientClass = (type: string) => {
    switch (type) {
      case 'video':
        return "bg-gradient-to-br from-purple-500 to-pink-600";
      case 'book':
        return "bg-gradient-to-br from-green-500 to-blue-600";
      case 'course':
        return "bg-gradient-to-br from-yellow-500 to-red-600";
      default:
        return "bg-gradient-to-br from-gray-500 to-gray-600";
    }
  };

  const filters = [
    { id: "all", label: "All" },
    { id: "book", label: "Books" },
    { id: "video", label: "Videos" },
    { id: "course", label: "Courses" }
  ];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Library</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center space-x-3 p-3 rounded-lg">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Library className="h-5 w-5" />
            <span>My Library</span>
          </CardTitle>
          <span className="text-sm text-gray-500" data-testid="library-count">
            {savedResources.length} saved resources
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {filters.map((filter) => (
            <Badge
              key={filter.id}
              variant={selectedFilter === filter.id ? "default" : "secondary"}
              className="cursor-pointer hover:bg-gray-200 transition-colors"
              onClick={() => setSelectedFilter(filter.id)}
              data-testid={`filter-${filter.id}`}
            >
              {filter.label}
            </Badge>
          ))}
        </div>

        {filteredResources.length === 0 ? (
          <div className="text-center py-8 text-gray-500" data-testid="empty-library">
            <Library className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No saved resources</p>
            <p className="text-sm">Bookmark resources to build your personal library!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredResources.map((userResource: any) => (
              <div
                key={userResource.id}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
                data-testid={`saved-resource-${userResource.id}`}
              >
                <div className={`w-12 h-12 ${getGradientClass(userResource.resource.type)} rounded-lg flex-shrink-0 flex items-center justify-center`}>
                  {getResourceIcon(userResource.resource.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 text-sm truncate" data-testid={`saved-title-${userResource.id}`}>
                    {userResource.resource.title}
                  </h4>
                  <p className="text-xs text-gray-600" data-testid={`saved-source-${userResource.id}`}>
                    {userResource.resource.source} • {userResource.resource.type}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  onClick={() => deleteResourceMutation.mutate(userResource.id)}
                  disabled={deleteResourceMutation.isPending}
                  data-testid={`delete-resource-${userResource.id}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            <Button 
              variant="outline" 
              className="w-full mt-4"
              data-testid="view-all-resources"
            >
              View All Resources
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
