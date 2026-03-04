import { GoogleGenAI, Type } from "@google/genai";
import { Difficulty, Question, Quiz } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const questionSchema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.INTEGER, description: "Unique identifier for the question (1-based index)" },
    text: { type: Type.STRING, description: "The question text" },
    options: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Array of 4 multiple choice options"
    },
    correctAnswerIndex: { type: Type.INTEGER, description: "The index (0-3) of the correct option" },
    explanation: { type: Type.STRING, description: "A brief explanation of why the answer is correct" }
  },
  required: ["id", "text", "options", "correctAnswerIndex", "explanation"]
};

const quizSchema = {
  type: Type.ARRAY,
  items: questionSchema,
  description: "A list of quiz questions"
};

export const generateQuiz = async (topic: string, difficulty: Difficulty, numQuestions: number = 5): Promise<Quiz> => {
  try {
    const prompt = `
      Create a multiple-choice mock test about "${topic}".
      Difficulty Level: ${difficulty}.
      Number of Questions: ${numQuestions}.
      
      Ensure the questions are challenging and relevant to the difficulty level.
      Provide exactly 4 options for each question.
      The output must be a valid JSON array.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: quizSchema,
        systemInstruction: "You are an expert tutor and examiner capable of creating high-quality, accurate, and educational quiz questions for any subject."
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    const questions = JSON.parse(text) as Question[];

    return {
      topic,
      difficulty,
      questions,
      createdAt: Date.now()
    };

  } catch (error) {
    console.error("Quiz generation failed:", error);
    throw error;
  }
};
