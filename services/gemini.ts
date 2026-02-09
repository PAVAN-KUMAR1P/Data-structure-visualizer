
import { GoogleGenAI, Type } from "@google/genai";
import { ListNode, ListKind, ChatMessage } from "../types";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

// Explanation of specific linked list operations using pointer logic
export const getOperationExplanation = async (operation: string, value: string | number | null, nodes: ListNode[], kind: ListKind) => {
  const nodeSummary = nodes.map(n => n.value).join(' -> ');
  const prompt = `
    I am performing a "${operation}" operation ${value !== null ? `with value "${value}"` : ''} on a ${kind} (Linked List).
    The current list structure contains: [${nodeSummary || 'Empty'}].
    
    Explain step-by-step how this operation works specifically for a ${kind} structure. 
    Focus on pointer manipulation (next, prev, head, tail).
    Keep it concise, professional, and educational. Use clear bullet points.
    Return only the explanation.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "No explanation available.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The AI tutor is currently unavailable to explain this move.";
  }
};

// Real-time chat with an AI tutor about linked list concepts
export const chatWithTutor = async (messages: ChatMessage[], nodes: ListNode[]) => {
  const nodeSummary = nodes.length > 0 ? nodes.map(n => n.value).join(' -> ') : 'Empty';

  // Format history for Gemini API: map 'assistant' role to 'model'
  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contents,
      config: {
        systemInstruction: `You are Nodey, a friendly and expert computer science tutor specializing in Linked Lists.
        The user is interacting with a linked list visualizer.
        The current list state is: [${nodeSummary}].
        Explain linked list concepts, pointer manipulation, and complexity analysis.
        Keep answers educational, concise, and professional.`,
      },
    });
    return response.text || "I'm sorry, I'm having trouble processing that right now.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "The AI tutor is currently experiencing technical difficulties.";
  }
};

// Generate a conceptual multiple-choice quiz based on the current list state
export const generateQuiz = async (nodes: ListNode[]) => {
  const nodeSummary = nodes.length > 0 ? nodes.map(n => n.value).join(' -> ') : 'Empty';

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a conceptual multiple choice question about linked lists for a student. 
      The question should be based on or relevant to the current list state: [${nodeSummary}].`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: {
              type: Type.STRING,
              description: "The conceptual question about linked lists.",
            },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Four multiple choice options.",
            },
            correctAnswer: {
              type: Type.INTEGER,
              description: "The zero-based index of the correct answer.",
            },
          },
          required: ["question", "options", "correctAnswer"],
        },
      },
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Quiz Error:", error);
    return null;
  }
};

// Parse natural language voice commands into structured actions
export const parseCommandWithGemini = async (command: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: command,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            structure: { type: Type.STRING, enum: ["linkedlist", "tree"] },
            operation: { type: Type.STRING },
            value: { type: Type.STRING, nullable: true },
            position: { type: Type.STRING, nullable: true },
            listType: { type: Type.STRING, nullable: true },
            dataType: { type: Type.STRING, nullable: true },
            treeType: { type: Type.STRING, nullable: true }
          },
          required: ["structure", "operation", "value", "position", "listType", "dataType"]
        },
        systemInstruction: `You are a command parser for an interactive data-structure visualizer.

Your job:
Convert the user's command into a STRICT JSON object.
Do NOT explain anything.
Do NOT add extra text.

Supported structures:
- linked list
- tree

Supported operations:
- insert
- insert_head
- insert_tail
- insert_at
- delete
- delete_head
- delete_tail
- delete_value
- search
- clear
- reverse
- sort
- find_middle
- undo
- change_list_type
- change_data_type
- change_tree_type
- preorder
- inorder
- postorder
- level_order
- find_min
- find_max
- get_height
- extract_root

Rules:
- Numbers may be spoken or typed (five -> 5).
- If position is not mentioned, set it to null.
- If value is missing, set it to null.
- If structure is not mentioned, assume "linkedlist".
- treeType should be inferred if the user mentions "bst", "avl", "heap".
`
      },
    });

    const text = response.text;
    if (!text) return null;

    const parsed = JSON.parse(text);

    // Normalize value to number if it looks like one
    if (parsed.value !== null && !isNaN(Number(parsed.value))) {
      parsed.value = Number(parsed.value);
    }

    // Normalize position to number if it looks like one
    if (parsed.position !== null && !isNaN(Number(parsed.position))) {
      parsed.position = Number(parsed.position);
    }

    // Default structure to list if 'linkedlist' is returned
    if (parsed.structure === 'linkedlist') {
      parsed.structure = 'list';
    }

    return parsed;
  } catch (error) {
    console.error("Gemini Parse Error:", error);
    return null;
  }
};
