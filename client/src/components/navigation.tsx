import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Brain, Menu } from "lucide-react";

export default function Navigation() {
  const { user, logoutMutation } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-primary flex items-center" data-testid="logo">
                <Brain className="mr-2 h-8 w-8" />
                Smart Learning Companion
              </h1>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#dashboard" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium transition-colors" data-testid="nav-dashboard">
              Dashboard
            </a>
            <a href="#search" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium transition-colors" data-testid="nav-explore">
              Explore
            </a>
            <a href="#study-buddy" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium transition-colors" data-testid="nav-study-buddy">
              Study Buddy
            </a>
            <a href="#progress" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium transition-colors" data-testid="nav-progress">
              Progress
            </a>
            
            <div className="relative">
              <Button 
                className="bg-primary text-white hover:bg-blue-600" 
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
                data-testid="button-logout"
              >
                <i className="fas fa-user mr-2"></i>
                {user?.firstName || "User"}
              </Button>
            </div>
          </div>
          
          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="sm" data-testid="button-mobile-menu">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
