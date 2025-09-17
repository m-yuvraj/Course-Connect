import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Bot, Sparkles, TrendingUp, ArrowRight } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function QuickActions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const searchMutation = useMutation({
    mutationFn: async (query: string) => {
      const params = new URLSearchParams({ query });
      if (selectedFilter) params.append('type', selectedFilter);
      const res = await apiRequest("GET", `/api/search?${params.toString()}`);
      return res.json();
    },
    onSuccess: (data) => {
      // Handle search results - could show in a modal or navigate to results page
      console.log("Search results:", data);
    }
  });

  const handleSearch = () => {
    if (searchQuery.trim()) {
      searchMutation.mutate(searchQuery);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const filters = [
    { id: 'book', label: '📚 Books', icon: 'books' },
    { id: 'video', label: '🎥 Videos', icon: 'videos' },
    { id: 'course', label: '🎓 Courses', icon: 'courses' },
    { id: 'article', label: '📄 Articles', icon: 'articles' }
  ];

  return (
    <div className="mb-8 space-y-6">
      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Find Your Next Learning Resource</h3>
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder="Search for topics, books, videos, or courses..."
              className="pl-12 h-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              data-testid="input-search"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          </div>
          <Button 
            className="bg-primary text-white hover:bg-blue-600 h-12 px-6"
            onClick={handleSearch}
            disabled={searchMutation.isPending}
            data-testid="button-search"
          >
            {searchMutation.isPending ? "Searching..." : "Search"}
          </Button>
        </div>
        
        {/* Search Filters */}
        <div className="flex flex-wrap gap-2 mt-4">
          {filters.map((filter) => (
            <Badge
              key={filter.id}
              variant={selectedFilter === filter.id ? "default" : "secondary"}
              className="cursor-pointer hover:bg-gray-200 transition-colors"
              onClick={() => setSelectedFilter(selectedFilter === filter.id ? null : filter.id)}
              data-testid={`filter-${filter.icon}`}
            >
              {filter.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <button className="bg-white rounded-xl shadow-sm border p-6 text-left hover:shadow-md transition-shadow group" data-testid="card-ai-buddy">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-secondary bg-opacity-10 rounded-lg flex items-center justify-center">
              <Bot className="text-secondary h-6 w-6" />
            </div>
            <ArrowRight className="text-gray-400 group-hover:text-primary transition-colors h-5 w-5" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">AI Study Buddy</h3>
          <p className="text-gray-600 text-sm">Get instant explanations and ask questions about any topic</p>
        </button>

        <button className="bg-white rounded-xl shadow-sm border p-6 text-left hover:shadow-md transition-shadow group" data-testid="card-recommendations">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-accent bg-opacity-10 rounded-lg flex items-center justify-center">
              <Sparkles className="text-accent h-6 w-6" />
            </div>
            <ArrowRight className="text-gray-400 group-hover:text-primary transition-colors h-5 w-5" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Smart Recommendations</h3>
          <p className="text-gray-600 text-sm">Discover personalized content based on your learning goals</p>
        </button>

        <button className="bg-white rounded-xl shadow-sm border p-6 text-left hover:shadow-md transition-shadow group" data-testid="card-progress">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-primary h-6 w-6" />
            </div>
            <ArrowRight className="text-gray-400 group-hover:text-primary transition-colors h-5 w-5" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Progress Analytics</h3>
          <p className="text-gray-600 text-sm">Track your learning journey and achievements</p>
        </button>
      </div>
    </div>
  );
}
