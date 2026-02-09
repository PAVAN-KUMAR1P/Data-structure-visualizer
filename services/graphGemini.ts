
import { GoogleGenAI } from "@google/genai";
import { GraphAlgorithm } from "../routes/graph/graphTypes";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export const getGraphAlgorithmExplanation = async (
    algorithm: GraphAlgorithm,
    nodeCount: number
): Promise<{ explanation: string; time: string; space: string }> => {
    try {
        if (!algorithm) return { explanation: '', time: '', space: '' };

        const prompt = `Explain the ${algorithm} algorithm for a graph with ${nodeCount} nodes.
        Keep it concise (max 4 bullet points).
        Also provide Time and Space complexity in Big O notation.
        
        Format the response in JSON:
        {
            "explanation": "bullet points string",
            "time": "O(...)",
            "space": "O(...)"
        }`;

        const response = await ai.languageModel.generateContent({
            model: 'gemini-2.0-flash-exp',
            contents: [{ role: 'user', parts: [{ text: prompt }] }]
        });

        const text = response.response.candidates?.[0].content.parts?.[0].text;
        if (!text) throw new Error("No response");

        const jsonBlock = text.match(/```json\n([\s\S]*?)\n```/);
        if (jsonBlock) {
            return JSON.parse(jsonBlock[1]);
        }

        return JSON.parse(text);

    } catch (error) {
        console.error("Gemini Error:", error);
        return {
            explanation: `${algorithm} traverses the graph efficiently.`,
            time: "O(V + E)",
            space: "O(V)"
        };
    }
};
