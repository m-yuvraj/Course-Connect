import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.API_KEY || ""
});

export async function getChatResponse(message: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an AI Study Buddy helping students learn. Provide clear, concise, and helpful explanations. Use simple language and examples when possible. Format your responses with proper structure using line breaks and bullet points when appropriate."
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 500,
    });

    return response.choices[0].message.content || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to get AI response");
  }
}

export async function summarizeContent(content: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an expert at summarizing academic content. Create concise, informative summaries that capture the key points and main concepts. Keep summaries under 200 words."
        },
        {
          role: "user",
          content: `Please summarize the following content:\n\n${content}`
        }
      ],
      max_tokens: 300,
    });

    return response.choices[0].message.content || "Unable to generate summary";
  } catch (error) {
    console.error("Summarization error:", error);
    throw new Error("Failed to summarize content");
  }
}

export async function getAIRecommendations(topic: string, userId: string): Promise<any[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: `You are an AI that recommends learning resources. Generate 3 relevant educational recommendations for the given topic. Return JSON array with objects containing: title, description, type (book/video/course/article), source, rating (1-5), difficulty (beginner/intermediate/advanced), and estimatedTime.`
        },
        {
          role: "user",
          content: `Recommend learning resources for: ${topic}`
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result.recommendations || [];
  } catch (error) {
    console.error("Recommendations error:", error);
    return [];
  }
}
