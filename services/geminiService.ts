import { GoogleGenAI } from "@google/genai";
import { Article, SocialPlatform } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

function constructPrompt(article: Article, platform: SocialPlatform): string {
  let platformSpecifics = '';
  switch (platform) {
    case SocialPlatform.Twitter:
      platformSpecifics = 'The post must be under 280 characters. Use 2-3 relevant hashtags. The tone should be punchy and engaging.';
      break;
    case SocialPlatform.LinkedIn:
      platformSpecifics = 'The post should be professional and insightful. Use 3-5 relevant hashtags. Encourage discussion and professional engagement.';
      break;
    case SocialPlatform.Facebook:
      platformSpecifics = 'The post should be friendly and conversational. Use a mix of statements and questions to encourage comments and shares. Include 2-4 relevant hashtags.';
      break;
    case SocialPlatform.Threads:
      platformSpecifics = 'The post can be up to 500 characters. The tone should be conversational and authentic. Feel free to use relevant hashtags and ask questions to start a conversation.';
      break;
  }

  return `
    You are a social media marketing expert specializing in promoting AI-focused blog content.
    Your task is to generate a compelling social media post for ${platform}.

    **Article Details:**
    - **Title:** ${article.title}
    ${article.summary ? `- **Summary:** ${article.summary}` : ''}
    - **URL:** ${article.url}

    **Instructions:**
    1.  Create a post that accurately reflects the article's content and entices users to click the link.
    2.  Adhere to the following platform-specific guidelines: ${platformSpecifics}
    3.  DO NOT include the article URL in your response. The URL will be appended automatically.
    4.  Your response must be only the text content for the social media post. Do not add any preamble like "Here is the post:".
  `;
}

export async function generateSocialPost(article: Article, platform: SocialPlatform): Promise<string> {
  try {
    const prompt = constructPrompt(article, platform);
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });
    
    return response.text.trim();
  } catch (error) {
    console.error(`Error calling Gemini API: ${error}`);
    throw new Error('Failed to generate content from Gemini API.');
  }
}