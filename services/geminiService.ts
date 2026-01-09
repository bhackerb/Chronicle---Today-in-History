import { GoogleGenAI, Type } from "@google/genai";
import { HistoricalEvent, EventDetailData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getEventsForDate = async (month: string, day: number): Promise<HistoricalEvent[]> => {
  const model = "gemini-3-flash-preview";
  const prompt = `
    List 12 historically significant events that happened on ${month} ${day} throughout history.
    Ensure a diverse mix of categories (War, Politics, Science, Culture).
    Return a JSON array where each object has:
    - year (number)
    - title (string, max 10 words)
    - description (string, max 25 words)
    - category (string enum: War, Politics, Science, Culture, General)
    Sort chronologically by year.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              year: { type: Type.INTEGER },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              category: { type: Type.STRING },
            },
            required: ["year", "title", "description", "category"],
          },
        },
      },
    });

    const jsonText = response.text || "[]";
    return JSON.parse(jsonText) as HistoricalEvent[];
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};

export const getEventDetails = async (event: HistoricalEvent): Promise<EventDetailData> => {
  const model = "gemini-3-flash-preview";
  const prompt = `
    Provide a detailed historical summary for the event: "${event.title}" which occurred in ${event.year}.
    
    1. Write a comprehensive summary (approx 150 words).
    2. Provide 5 key interesting facts as bullet points.
    3. Identify the specific Wikipedia topic name (e.g., "Battle_of_Hastings") for generating a URL.
    4. Find 3 actual, specific, high-quality external URLs (articles, museum entries, or educational resources) related to this event using Google Search.
    
    Return the response as JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            bulletPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
            wikipediaTopic: { type: Type.STRING },
            relatedLinks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  url: { type: Type.STRING }
                }
              }
            }
          }
        }
      },
    });

    const jsonText = response.text || "{}";
    return JSON.parse(jsonText) as EventDetailData;
  } catch (error) {
    console.error("Error fetching event details:", error);
    // Fallback if structured generation fails
    return {
      summary: "Details could not be retrieved at this moment.",
      bulletPoints: [],
      wikipediaTopic: event.title,
      relatedLinks: []
    };
  }
};

export const generateEventImage = async (event: HistoricalEvent): Promise<string | null> => {
  const model = "gemini-2.5-flash-image";
  const prompt = `
    A highly detailed, cinematic, oil-painting style illustration of the historical event: ${event.title} (${event.year}).
    Context: ${event.description}.
    The image should be respectful, historically plausible, and visually striking.
    Aspect Ratio 16:9.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        // Nano banana models do not support responseMimeType or tools for images usually,
        // but let's just send the prompt.
      }
    });

    // Extract image
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData && part.inlineData.data) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
};
