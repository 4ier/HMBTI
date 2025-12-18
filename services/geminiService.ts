
import { GoogleGenAI } from "@google/genai";
import { AI_PROMPT_PREFIX } from "../constants";

export const generateResultImage = async (typeSuffix: string): Promise<string | null> => {
  // Always use a named parameter for apiKey and initialize with process.env.API_KEY directly as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `${AI_PROMPT_PREFIX}, ${typeSuffix}`;

  try {
    // Generate images using gemini-2.5-flash-image for general tasks. 
    // Do not set responseMimeType or responseSchema for nano banana series models.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    // Iterate through all parts to find the image part, do not assume it is the first part.
    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64EncodeString: string = part.inlineData.data;
          return `data:image/png;base64,${base64EncodeString}`;
        }
      }
    }
  } catch (error) {
    console.error("Failed to generate image:", error);
  }
  return null;
};
