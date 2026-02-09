
import { GoogleGenAI } from "@google/genai";
import { TreeNode, TreeType, TreeOperation, FlatTreeNode } from "../routes/tree/treeTypes";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

// Explanation of specific tree operations
export const getTreeOperationExplanation = async (
    operation: TreeOperation,
    value: number | null,
    nodes: FlatTreeNode[],
    treeType: TreeType
): Promise<string> => {
    const nodeValues = nodes.map(n => n.value).join(', ');
    const prompt = `
    I am performing a "${operation}" operation ${value !== null ? `with value "${value}"` : ''} on a ${treeType} tree.
    The current tree contains these values: [${nodeValues || 'Empty'}].
    
    Explain step-by-step how this operation works specifically for a ${treeType} structure.
    ${treeType === 'AVL' ? 'Include details about balance factors and rotations if applicable.' : ''}
    ${treeType === 'MAX_HEAP' || treeType === 'MIN_HEAP' ? 'Include details about heapify operations and heap properties.' : ''}
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
        console.error("Gemini Tree Error:", error);
        return "The AI tutor is currently unavailable to explain this operation.";
    }
};

// Get complexity information for tree operations
export const getTreeComplexityInfo = (operation: TreeOperation, treeType: TreeType): { time: string; space: string; description: string } => {
    const complexities: Record<TreeType, Record<string, { time: string; space: string; description: string }>> = {
        BST: {
            INSERT: { time: 'O(h)', space: 'O(h)', description: 'Where h is the height. Worst case O(n) for skewed trees.' },
            DELETE: { time: 'O(h)', space: 'O(h)', description: 'May need to find inorder successor which takes O(h) time.' },
            SEARCH: { time: 'O(h)', space: 'O(h)', description: 'Binary search property gives logarithmic performance for balanced trees.' },
            INORDER: { time: 'O(n)', space: 'O(h)', description: 'Visits all nodes exactly once.' },
            PREORDER: { time: 'O(n)', space: 'O(h)', description: 'Visits all nodes exactly once.' },
            POSTORDER: { time: 'O(n)', space: 'O(h)', description: 'Visits all nodes exactly once.' },
            LEVEL_ORDER: { time: 'O(n)', space: 'O(n)', description: 'Uses a queue that can hold up to n/2 nodes at the deepest level.' },
            FIND_MIN: { time: 'O(h)', space: 'O(1)', description: 'Keep going left until leaf node.' },
            FIND_MAX: { time: 'O(h)', space: 'O(1)', description: 'Keep going right until leaf node.' },
            GET_HEIGHT: { time: 'O(n)', space: 'O(h)', description: 'Must visit all nodes to compute height.' },
            CLEAR: { time: 'O(n)', space: 'O(1)', description: 'Simply remove reference to root.' },
        },
        AVL: {
            INSERT: { time: 'O(log n)', space: 'O(log n)', description: 'Self-balancing ensures logarithmic height.' },
            DELETE: { time: 'O(log n)', space: 'O(log n)', description: 'Includes rebalancing rotations.' },
            SEARCH: { time: 'O(log n)', space: 'O(log n)', description: 'Guaranteed logarithmic due to balanced structure.' },
            INORDER: { time: 'O(n)', space: 'O(log n)', description: 'Stack depth is always logarithmic.' },
            PREORDER: { time: 'O(n)', space: 'O(log n)', description: 'Stack depth is always logarithmic.' },
            POSTORDER: { time: 'O(n)', space: 'O(log n)', description: 'Stack depth is always logarithmic.' },
            LEVEL_ORDER: { time: 'O(n)', space: 'O(n)', description: 'Queue holds multiple levels.' },
            FIND_MIN: { time: 'O(log n)', space: 'O(1)', description: 'Balanced tree ensures logarithmic path.' },
            FIND_MAX: { time: 'O(log n)', space: 'O(1)', description: 'Balanced tree ensures logarithmic path.' },
            GET_HEIGHT: { time: 'O(1)', space: 'O(1)', description: 'Height is stored in each node.' },
            CLEAR: { time: 'O(n)', space: 'O(1)', description: 'Simply remove reference to root.' },
        },
        MAX_HEAP: {
            INSERT: { time: 'O(log n)', space: 'O(1)', description: 'Bubble up from last position.' },
            EXTRACT_ROOT: { time: 'O(log n)', space: 'O(1)', description: 'Heapify down from root.' },
            HEAPIFY: { time: 'O(n)', space: 'O(1)', description: 'Build heap from array.' },
            FIND_MAX: { time: 'O(1)', space: 'O(1)', description: 'Max is always at root.' },
            CLEAR: { time: 'O(1)', space: 'O(1)', description: 'Reset heap array.' },
        },
        MIN_HEAP: {
            INSERT: { time: 'O(log n)', space: 'O(1)', description: 'Bubble up from last position.' },
            EXTRACT_ROOT: { time: 'O(log n)', space: 'O(1)', description: 'Heapify down from root.' },
            HEAPIFY: { time: 'O(n)', space: 'O(1)', description: 'Build heap from array.' },
            FIND_MIN: { time: 'O(1)', space: 'O(1)', description: 'Min is always at root.' },
            CLEAR: { time: 'O(1)', space: 'O(1)', description: 'Reset heap array.' },
        }
    };

    return complexities[treeType]?.[operation] || { time: 'O(?)', space: 'O(?)', description: 'Complexity varies.' };
};
