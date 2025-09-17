import { useAuth } from "@/hooks/use-auth";

export default function WelcomeHeader() {
  const { user } = useAuth();

  return (
    <div className="mb-8">
      <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2" data-testid="welcome-message">
            Good morning, {user?.firstName || "Student"}! 🌟
          </h2>
          <p className="text-blue-100 text-lg mb-6">
            Ready to continue your learning journey? You've completed 3 topics this week!
          </p>
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center">
              <i className="fas fa-target mr-2"></i>
              <span data-testid="weekly-goal">5 topics this week</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-clock mr-2"></i>
              <span data-testid="study-time">2h 15m today</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-fire mr-2"></i>
              <span data-testid="streak">7 day streak</span>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 right-0 w-20 h-20 bg-white bg-opacity-5 rounded-full -mr-10 -mb-10"></div>
      </div>
    </div>
  );
}
