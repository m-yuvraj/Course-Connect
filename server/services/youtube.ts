export async function searchYouTubeVideos(query: string, maxResults: number = 5): Promise<any[]> {
  try {
    const API_KEY = process.env.YOUTUBE_API_KEY || process.env.API_KEY || "";
    
    if (!API_KEY) {
      console.log("YouTube API key not found, returning empty results");
      return [];
    }

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=${maxResults}&key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();
    
    return data.items?.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      type: 'video',
      source: 'YouTube'
    })) || [];
  } catch (error) {
    console.error("YouTube search error:", error);
    return [];
  }
}
