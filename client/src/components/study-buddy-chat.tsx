import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bot, User, Send, ThumbsUp, BookOpen } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function StudyBuddyChat() {
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();

  const { data: chatMessages, isLoading } = useQuery({
    queryKey: ["/api/chat"],
  });

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const res = await apiRequest("POST", "/api/chat", { message });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat"] });
      setMessage("");
    }
  });

  const handleSendMessage = () => {
    if (message.trim()) {
      chatMutation.mutate(message);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const quickQuestions = [
    "Explain Dijkstra's Algorithm",
    "What is Big O notation?",
    "Database normalization basics"
  ];

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-secondary bg-opacity-10 rounded-full flex items-center justify-center">
              <Bot className="text-secondary h-5 w-5" />
            </div>
            <div>
              <CardTitle>AI Study Buddy</CardTitle>
              <p className="text-sm text-gray-600">Ask me anything about your subjects!</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span className="text-sm text-gray-500">Online</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Chat Messages */}
        <div className="space-y-4 max-h-96 overflow-y-auto mb-6" data-testid="chat-messages">
          {isLoading ? (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-secondary bg-opacity-10 rounded-full flex items-center justify-center animate-pulse">
                <Bot className="text-secondary h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="bg-gray-50 rounded-lg p-4 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Welcome message */}
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-secondary bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="text-secondary h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-800">
                      Hello! I'm your AI Study Buddy. I can help you with:
                      <br />• Explaining complex topics in simple terms
                      <br />• Providing quick summaries of concepts
                      <br />• Suggesting study strategies
                      <br />• Answering questions about your coursework
                      <br /><br />What would you like to learn about today?
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 mt-2 block">Just now</span>
                </div>
              </div>

              {/* Chat messages */}
              {chatMessages?.map((msg: any) => (
                <div key={msg.id}>
                  {/* User message */}
                  <div className="flex items-start space-x-3 justify-end mb-4">
                    <div className="flex-1 max-w-xs">
                      <div className="bg-primary text-white rounded-lg p-4">
                        <p data-testid={`user-message-${msg.id}`}>{msg.message}</p>
                      </div>
                      <span className="text-xs text-gray-500 mt-2 block text-right">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="w-8 h-8 bg-primary bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="text-primary h-4 w-4" />
                    </div>
                  </div>

                  {/* AI response */}
                  {msg.response && (
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-secondary bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="text-secondary h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-800 whitespace-pre-wrap" data-testid={`ai-response-${msg.id}`}>
                            {msg.response}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-xs text-gray-500">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </span>
                          <Button variant="ghost" size="sm" className="text-xs text-primary hover:underline" data-testid={`helpful-${msg.id}`}>
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            Helpful
                          </Button>
                          <Button variant="ghost" size="sm" className="text-xs text-primary hover:underline" data-testid={`save-${msg.id}`}>
                            <BookOpen className="h-3 w-3 mr-1" />
                            Save to Notes
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>

        {/* Chat Input */}
        <div className="space-y-3">
          <div className="flex space-x-3">
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="Ask me anything... e.g., 'Explain merge sort algorithm'"
                className="pr-12"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={chatMutation.isPending}
                data-testid="input-chat"
              />
              <Button
                size="sm"
                variant="ghost"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary"
                onClick={handleSendMessage}
                disabled={chatMutation.isPending || !message.trim()}
                data-testid="button-send-message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Quick Question Suggestions */}
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((question, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => setMessage(question)}
                data-testid={`quick-question-${index}`}
              >
                {question}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
