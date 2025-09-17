import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Star, Clock, Target, Bookmark } from "lucide-react";

export default function AIRecommendations() {
  const { data: recommendations, isLoading } = useQuery({
    queryKey: ["/api/recommendations"],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <CardTitle>AI Recommendations</CardTitle>
            <Sparkles className="text-accent h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="p-4 rounded-lg bg-gray-100">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-3"></div>
                  <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getRecommendationGradient = (index: number) => {
    const gradients = [
      "bg-gradient-to-r from-blue-50 to-purple-50 border-blue-100",
      "bg-gradient-to-r from-green-50 to-teal-50 border-green-100",
      "bg-gradient-to-r from-orange-50 to-red-50 border-orange-100"
    ];
    return gradients[index % gradients.length];
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'book':
        return '📚';
      case 'video':
        return '🎥';
      case 'course':
        return '🎓';
      case 'article':
        return '📄';
      default:
        return '📖';
    }
  };

  const getBadgeColor = (index: number) => {
    const colors = ["primary", "secondary", "accent"];
    return colors[index % colors.length];
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CardTitle>AI Recommendations</CardTitle>
            <Sparkles className="text-accent h-5 w-5" />
          </div>
          <span className="text-sm text-gray-500">Based on your goals</span>
        </div>
      </CardHeader>
      <CardContent>
        {!recommendations || recommendations.length === 0 ? (
          <div className="text-center py-8 text-gray-500" data-testid="empty-recommendations">
            <Sparkles className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No recommendations available</p>
            <p className="text-sm">Check back later for personalized suggestions!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.slice(0, 3).map((recommendation: any, index: number) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${getRecommendationGradient(index)}`}
                data-testid={`recommendation-${index}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Badge className={`bg-${getBadgeColor(index)} text-white`}>
                      Recommended
                    </Badge>
                    <span className="text-xs text-gray-600">
                      {getTypeIcon(recommendation.type)} {recommendation.type}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" data-testid={`bookmark-${index}`}>
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
                
                <h4 className="font-medium text-gray-900 mb-2" data-testid={`rec-title-${index}`}>
                  {recommendation.title}
                </h4>
                <p className="text-sm text-gray-600 mb-3" data-testid={`rec-description-${index}`}>
                  {recommendation.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    {recommendation.rating && (
                      <span className="flex items-center">
                        <Star className="h-3 w-3 mr-1" />
                        {recommendation.rating}/5
                      </span>
                    )}
                    {recommendation.estimatedTime && (
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {recommendation.estimatedTime}
                      </span>
                    )}
                    {recommendation.difficulty && (
                      <span className="flex items-center">
                        <Target className="h-3 w-3 mr-1" />
                        {recommendation.difficulty}
                      </span>
                    )}
                  </div>
                  <Button size="sm" className="text-xs" data-testid={`add-to-library-${index}`}>
                    Add to Library
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
