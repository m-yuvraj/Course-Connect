import Navigation from "@/components/navigation";
import WelcomeHeader from "@/components/welcome-header";
import QuickActions from "@/components/quick-actions";
import ContinueLearning from "@/components/continue-learning";
import AIRecommendations from "@/components/ai-recommendations";
import StudyBuddyChat from "@/components/study-buddy-chat";
import ProgressDashboard from "@/components/progress-dashboard";
import RecentActivity from "@/components/recent-activity";
import SavedResources from "@/components/saved-resources";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Top Navigation */}
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Welcome Section */}
        <section className="animate-fade-in">
          <WelcomeHeader />
        </section>

        {/* Quick Actions */}
        <section className="animate-fade-in-up delay-100">
          <QuickActions />
        </section>

        {/* Learning + Recommendations */}
        <section className="grid lg:grid-cols-2 gap-8 animate-fade-in-up delay-200">
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-6">
            <ContinueLearning />
          </div>
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-6">
            <AIRecommendations />
          </div>
        </section>

        {/* Study Buddy */}
        <section className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-6 animate-fade-in-up delay-300">
          <StudyBuddyChat />
        </section>

        {/* Progress */}
        <section className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-6 animate-fade-in-up delay-400">
          <ProgressDashboard />
        </section>

        {/* Recent + Saved */}
        <section className="grid lg:grid-cols-2 gap-8 animate-fade-in-up delay-500">
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-6">
            <RecentActivity />
          </div>
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-6">
            <SavedResources />
          </div>
        </section>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t shadow-lg md:hidden">
        <div className="grid grid-cols-4 h-16">
          <button className="flex flex-col items-center justify-center space-y-1 text-primary hover:text-primary/80 transition">
            <i className="fas fa-home text-lg"></i>
            <span className="text-xs font-medium">Home</span>
          </button>
          <button className="flex flex-col items-center justify-center space-y-1 text-gray-500 hover:text-primary transition">
            <i className="fas fa-search text-lg"></i>
            <span className="text-xs">Explore</span>
          </button>
          <button className="flex flex-col items-center justify-center space-y-1 text-gray-500 hover:text-primary transition">
            <i className="fas fa-robot text-lg"></i>
            <span className="text-xs">AI Buddy</span>
          </button>
          <button className="flex flex-col items-center justify-center space-y-1 text-gray-500 hover:text-primary transition">
            <i className="fas fa-chart-line text-lg"></i>
            <span className="text-xs">Progress</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
