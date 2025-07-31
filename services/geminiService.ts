
import { GoogleGenAI, Type } from "@google/genai";
import { QUIZ_LENGTH, TEXT_MODEL, IMAGE_MODEL } from '../constants';
import type { QuizData } from '../types';

// The API key check is removed from the top level to prevent a startup crash.
// The SDK will throw an error on API calls if the key is missing,
// which is handled gracefully in the App component.

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const quizSchema = {
  type: Type.OBJECT,
  properties: {
    questions: {
      type: Type.ARRAY,
      description: `A list of ${QUIZ_LENGTH} questions.`,
      items: {
        type: Type.OBJECT,
        properties: {
          questionText: {
            type: Type.STRING,
            description: "The question text, phrased very simply for a young child.",
          },
          options: {
            type: Type.ARRAY,
            description: "An array of exactly 3 possible answers.",
            items: {
              type: Type.STRING,
            },
          },
          correctAnswer: {
            type: Type.STRING,
            description: "The correct answer, which must be one of the strings from the 'options' array.",
          },
          funFact: {
            type: Type.STRING,
            description: "A single, simple sentence explaining the story or the answer in a fun way.",
          },
        },
        required: ["questionText", "options", "correctAnswer", "funFact"],
      },
    },
  },
  required: ["questions"],
};

export const generateQuizQuestions = async (): Promise<QuizData> => {
  const prompt = `You are an expert in early childhood education and biblical studies. Generate a list of ${QUIZ_LENGTH} simple, multiple-choice Bible quiz questions suitable for children aged 3 to 7. The questions should cover well-known, simple Bible stories and figures (e.g., Noah's Ark, David and Goliath, Jonah and the Whale, Creation, Baby Jesus). Each question must have exactly 3 possible answers, one of which is correct. The language used must be extremely simple and easy for a preschooler to understand. For each question, also provide a "funFact" which is a single, simple sentence explaining the story or the answer. Return the response as a JSON object that matches the provided schema.`;

  try {
    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: quizSchema,
      },
    });
    
    const jsonText = response.text.trim();
    const quizData: QuizData = JSON.parse(jsonText);

    if (!quizData.questions || quizData.questions.length === 0) {
        throw new Error("AI did not generate any questions.");
    }

    return quizData;

  } catch (error) {
    console.error("Error generating quiz questions:", error);
    throw new Error("Could not generate the quiz questions. Please check the API key and configuration.");
  }
};

export const generateQuizImage = async (questionText: string): Promise<string> => {
    const prompt = `A delightful and simple cartoon illustration for a 3-year-old child related to the bible story: "${questionText}". The style should be very friendly, with soft rounded shapes, bright and cheerful primary colors, and a happy atmosphere. No text.`;
    
    try {
        const response = await ai.models.generateImages({
            model: IMAGE_MODEL,
            prompt: prompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: '1:1',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        } else {
            throw new Error("No image was generated.");
        }
    } catch(error) {
        console.error("Error generating image:", error);
        // Return a placeholder or a default image URL on error
        return "https://picsum.photos/512/512";
    }
};
