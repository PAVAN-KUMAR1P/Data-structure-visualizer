import { parseCommandWithGemini } from './gemini';

// Voice Control Service for Linked List Visualizer
// Export utilities for voice recognition, parsing, and text-to-speech

// ============ VOICE INTENT TYPES ============
export interface VoiceIntent {
  operation: string;
  value: number | null;
  position?: number | 'head' | 'tail';
  listType?: 'singly' | 'doubly' | 'circular_singly' | 'circular_doubly';
  dataType?: 'numbers' | 'strings' | 'characters';
  structure?: 'list' | 'tree' | 'linked_list' | 'graph';
  treeType?: 'bst' | 'avl' | 'max_heap' | 'min_heap';
  source?: number;
  target?: number;
  algorithm?: 'BFS' | 'DFS' | 'DIJKSTRA';
  confidence?: number; // 0-1, higher = more certain
}

// ============ COMPILED REGEX PATTERNS (performance) ============
const PATTERNS = {
  // Graph commands
  BFS: /bfs|breadth/i,
  DFS: /dfs|depth/i,
  DIJKSTRA: /dijkstra|shortest\s*path/i,
  START_ALGO: /start|begin|run/i,
  ADD_EDGE: /add.*edge|connect/i,
  REMOVE_EDGE: /remove.*edge|disconnect/i,
  ADD_NODE: /add.*node/i,
  REMOVE_NODE: /remove.*node|delete.*node/i,
  RESET_GRAPH: /reset.*graph|clear.*graph/i,
  NEXT_STEP: /next.*step|step.*forward/i,
  PREV_STEP: /previous.*step|step.*back/i,
  PLAY: /play|animate/i,
  PAUSE: /pause|stop/i,
  
  // List commands
  TRAVERSE: /traverse|walk.*through|iterate|go.*through.*list|visit.*all/i,
  REVERSE_LIST: /reverse.*list|reverse$/i,
  SORT: /sort/i,
  CLEAR_LIST: /clear|reset|empty/i,
  FIND_MIDDLE: /middle/i,
  UNDO: /undo/i,
  DELETE_HEAD: /delete.*head|remove.*head|delete.*first|remove.*first|pop.*head/i,
  DELETE_TAIL: /delete.*tail|remove.*tail|delete.*last|remove.*last|delete.*end|remove.*end|pop.*tail/i,
  DELETE_AT: /delete.*position|remove.*position|delete.*index|remove.*index/i,
  DELETE_VALUE: /delete|remove/i,
  INSERT_HEAD: /insert.*head|add.*head|insert.*beginning|add.*beginning|insert.*start|add.*start|insert.*front|add.*front|insert.*first|add.*first/i,
  INSERT_TAIL: /insert.*tail|add.*tail|insert.*end|add.*end|insert.*last|add.*last|insert.*back|add.*back/i,
  INSERT_AT: /insert.*position|add.*position|insert.*index|add.*index/i,
  INSERT: /insert|add|put/i,
  SEARCH: /search|find|look|locate/i,
  
  // List type changes
  CIRCULAR_DOUBLY: /circular.*doubly/i,
  CIRCULAR_SINGLY: /circular.*singly|circular/i,
  DOUBLY: /doubly/i,
  SINGLY: /singly/i,
  
  // Data types
  NUMBERS: /number/i,
  STRINGS: /string/i,
  CHARACTERS: /character/i,
  
  // Exclusions
  GRAPH_CONTEXT: /graph/i,
}


// ============ VOICE SUPPORT CHECK ============
export function isVoiceSupported(): boolean {
  return !!(
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition
  );
}

// ============ TEXT TO SPEECH (Sequential Queue with Sync) ============
const speechQueue: Array<{ text: string; resolve: () => void }> = [];
let isSpeaking = false;

function processQueue(): void {
  if (isSpeaking || speechQueue.length === 0) return;
  
  const item = speechQueue.shift();
  if (!item) return;
  
  isSpeaking = true;
  const utterance = new SpeechSynthesisUtterance(item.text);
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.volume = 1;
  
  utterance.onend = () => {
    isSpeaking = false;
    item.resolve(); // Resolve the promise when speech ends
    processQueue(); // Process next in queue
  };
  
  utterance.onerror = () => {
    isSpeaking = false;
    item.resolve(); // Resolve even on error to not block
    processQueue(); // Continue even on error
  };
  
  window.speechSynthesis.speak(utterance);
}

// Speak text and return a promise that resolves when speech completes
export function speak(text: string): Promise<void> {
  return new Promise((resolve) => {
    if ('speechSynthesis' in window) {
      speechQueue.push({ text, resolve });
      processQueue();
    } else {
      resolve(); // Resolve immediately if no speech synthesis
    }
  });
}

// Speak without waiting (fire and forget)
export function speakAsync(text: string): void {
  speak(text); // Don't await
}

// Cancel all speech and clear queue
export function cancelSpeech(): void {
  if ('speechSynthesis' in window) {
    // Resolve all pending promises
    speechQueue.forEach(item => item.resolve());
    speechQueue.length = 0;
    isSpeaking = false;
    window.speechSynthesis.cancel();
  }
}

// Check if currently speaking
export function isSpeakingNow(): boolean {
  return isSpeaking || speechQueue.length > 0;
}

// ============ NUMBER EXTRACTION ============
// Number words mapping for word-to-number conversion
const NUMBER_WORDS: { [key: string]: number } = {
  'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4,
  'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9,
  'ten': 10, 'eleven': 11, 'twelve': 12, 'thirteen': 13,
  'fourteen': 14, 'fifteen': 15, 'sixteen': 16, 'seventeen': 17,
  'eighteen': 18, 'nineteen': 19, 'twenty': 20, 'thirty': 30,
  'forty': 40, 'fifty': 50, 'sixty': 60, 'seventy': 70,
  'eighty': 80, 'ninety': 90, 'hundred': 100
};

// Extract all numbers from text (digits + word numbers)
function extractAllNumbers(text: string): number[] {
  const numbers: number[] = [];
  const lowerText = text.toLowerCase();

  // Find all digit sequences
  const digitMatches = lowerText.match(/\d+/g);
  if (digitMatches) {
    digitMatches.forEach(d => numbers.push(parseInt(d)));
  }

  // Also check for number words if no digits found
  if (numbers.length === 0) {
    const words = lowerText.split(/\s+/);
    for (const word of words) {
      if (NUMBER_WORDS[word] !== undefined) {
        numbers.push(NUMBER_WORDS[word]);
      }
    }
  }

  return numbers;
}

// Normalize text: remove punctuation, lowercase
function normalizeText(text: string): string {
  return text.toLowerCase().replace(/[^\w\s]/g, '').trim();
}

// ============ VOICE COMMAND PARSER ============
export async function parseVoiceCommand(text: string): Promise<VoiceIntent | null> {
  const normalized = normalizeText(text);
  console.log('🎤 Parsing voice command:', normalized);

  // Try Gemini Parser first (higher confidence)
  try {
    const geminiResult = await parseCommandWithGemini(text);
    if (geminiResult) {
      console.log('✨ Gemini parsed:', geminiResult);
      return { ...geminiResult, confidence: 0.9 } as VoiceIntent;
    }
  } catch (e) {
    console.error('Gemini parsing failed, falling back to regex', e);
  }

  // Regex Fallback (lower confidence but reliable)
  const numbers = extractAllNumbers(normalized);
  const firstNumber = numbers.length > 0 ? numbers[0] : null;
  const secondNumber = numbers.length > 1 ? numbers[1] : null;

  // ===== GRAPH COMMANDS =====

  // BFS/DFS
  if (PATTERNS.BFS.test(normalized) && PATTERNS.START_ALGO.test(normalized)) {
    return { operation: 'start_traversal', value: firstNumber, algorithm: 'BFS', structure: 'graph', confidence: 0.7 };
  }
  if (PATTERNS.DFS.test(normalized) && PATTERNS.START_ALGO.test(normalized)) {
    return { operation: 'start_traversal', value: firstNumber, algorithm: 'DFS', structure: 'graph', confidence: 0.7 };
  }

  // Dijkstra
  if (PATTERNS.DIJKSTRA.test(normalized) && PATTERNS.START_ALGO.test(normalized)) {
    return { operation: 'start_traversal', value: firstNumber, algorithm: 'DIJKSTRA', structure: 'graph', confidence: 0.7 };
  }

  // Add Edge
  if (PATTERNS.ADD_EDGE.test(normalized) && firstNumber !== null && secondNumber !== null) {
    return { operation: 'add_edge', value: null, source: firstNumber, target: secondNumber, structure: 'graph', confidence: 0.7 };
  }

  // Remove Edge
  if (PATTERNS.REMOVE_EDGE.test(normalized) && firstNumber !== null && secondNumber !== null) {
    return { operation: 'remove_edge', value: null, source: firstNumber, target: secondNumber, structure: 'graph', confidence: 0.7 };
  }

  // Add Node
  if (PATTERNS.ADD_NODE.test(normalized) && firstNumber !== null) {
    return { operation: 'add_node', value: firstNumber, structure: 'graph', confidence: 0.7 };
  }

  // Remove Node
  if (PATTERNS.REMOVE_NODE.test(normalized) && firstNumber !== null) {
    return { operation: 'remove_node', value: firstNumber, structure: 'graph', confidence: 0.7 };
  }

  // Reset/Clear Graph
  if (PATTERNS.RESET_GRAPH.test(normalized)) {
    return { operation: 'reset', value: null, structure: 'graph', confidence: 0.7 };
  }

  // Controls
  if (PATTERNS.NEXT_STEP.test(normalized)) {
    return { operation: 'next_step', value: null, structure: 'graph', confidence: 0.6 };
  }
  if (PATTERNS.PREV_STEP.test(normalized)) {
    return { operation: 'prev_step', value: null, structure: 'graph', confidence: 0.6 };
  }
  if (PATTERNS.PLAY.test(normalized)) {
    return { operation: 'play', value: null, structure: 'graph', confidence: 0.6 };
  }
  if (PATTERNS.PAUSE.test(normalized)) {
    return { operation: 'pause', value: null, structure: 'graph', confidence: 0.6 };
  }

  // ===== TRAVERSE =====
  if (PATTERNS.TRAVERSE.test(normalized) && !PATTERNS.GRAPH_CONTEXT.test(normalized)) {
    console.log('✅ Matched: traverse');
    return { operation: 'traverse', value: null, structure: 'list', confidence: 0.7 };
  }

  // ===== REVERSE (avoid "reverse traversal" ambiguity) =====
  if (PATTERNS.REVERSE_LIST.test(normalized) && !PATTERNS.GRAPH_CONTEXT.test(normalized)) {
    console.log('✅ Matched: reverse');
    return { operation: 'reverse', value: null, structure: 'list', confidence: 0.7 };
  }

  // ===== SORT =====
  if (PATTERNS.SORT.test(normalized) && !PATTERNS.GRAPH_CONTEXT.test(normalized)) {
    console.log('✅ Matched: sort');
    return { operation: 'sort', value: null, structure: 'list', confidence: 0.7 };
  }

  // ===== CLEAR (exclude graph context) =====
  if (PATTERNS.CLEAR_LIST.test(normalized) && !PATTERNS.GRAPH_CONTEXT.test(normalized)) {
    console.log('✅ Matched: clear');
    return { operation: 'clear', value: null, structure: 'list', confidence: 0.7 };
  }

  // ===== FIND MIDDLE =====
  if (PATTERNS.FIND_MIDDLE.test(normalized)) {
    console.log('✅ Matched: find_middle');
    return { operation: 'find_middle', value: null, structure: 'list', confidence: 0.7 };
  }

  // ===== UNDO =====
  if (PATTERNS.UNDO.test(normalized)) {
    console.log('✅ Matched: undo');
    return { operation: 'undo', value: null, structure: 'list', confidence: 0.8 };
  }

  // ===== DELETE HEAD =====
  if (PATTERNS.DELETE_HEAD.test(normalized)) {
    console.log('✅ Matched: delete_head');
    return { operation: 'delete_head', value: null, structure: 'list', confidence: 0.7 };
  }

  // ===== DELETE TAIL =====
  if (PATTERNS.DELETE_TAIL.test(normalized)) {
    console.log('✅ Matched: delete_tail');
    return { operation: 'delete_tail', value: null, structure: 'list', confidence: 0.7 };
  }

  // ===== DELETE AT POSITION =====
  if (PATTERNS.DELETE_AT.test(normalized) && firstNumber !== null) {
    console.log('✅ Matched: delete_at position', firstNumber);
    return { operation: 'delete_at', value: null, position: firstNumber, structure: 'list', confidence: 0.7 };
  }

  // ===== DELETE VALUE =====
  if (PATTERNS.DELETE_VALUE.test(normalized) && firstNumber !== null && !PATTERNS.GRAPH_CONTEXT.test(normalized)) {
    console.log('✅ Matched: delete_value', firstNumber);
    return { operation: 'delete_value', value: firstNumber, structure: 'list', confidence: 0.6 };
  }

  // ===== INSERT AT HEAD =====
  if (PATTERNS.INSERT_HEAD.test(normalized) && firstNumber !== null) {
    console.log('✅ Matched: insert_head', firstNumber);
    return { operation: 'insert_head', value: firstNumber, structure: 'list', confidence: 0.8 };
  }

  // ===== INSERT AT TAIL =====
  if (PATTERNS.INSERT_TAIL.test(normalized) && firstNumber !== null) {
    console.log('✅ Matched: insert_tail', firstNumber);
    return { operation: 'insert_tail', value: firstNumber, structure: 'list', confidence: 0.8 };
  }

  // ===== INSERT AT POSITION =====
  if (PATTERNS.INSERT_AT.test(normalized) && firstNumber !== null && secondNumber !== null) {
    console.log('✅ Matched: insert_at', firstNumber, 'at position', secondNumber);
    return { operation: 'insert_at', value: firstNumber, position: secondNumber, structure: 'list', confidence: 0.7 };
  }

  // ===== SIMPLE INSERT (defaults to tail) =====
  if (PATTERNS.INSERT.test(normalized) && firstNumber !== null && !PATTERNS.GRAPH_CONTEXT.test(normalized)) {
    console.log('✅ Matched: insert (tail)', firstNumber);
    return { operation: 'insert_tail', value: firstNumber, structure: 'list', confidence: 0.6 };
  }

  // ===== SEARCH =====
  if (PATTERNS.SEARCH.test(normalized) && firstNumber !== null) {
    console.log('✅ Matched: search', firstNumber);
    return { operation: 'search', value: firstNumber, structure: 'list', confidence: 0.7 };
  }

  // ===== LIST TYPE CHANGES =====
  if (PATTERNS.CIRCULAR_DOUBLY.test(normalized)) {
    console.log('✅ Matched: change to circular doubly');
    return { operation: 'change_list_type', value: null, listType: 'circular_doubly', structure: 'list', confidence: 0.8 };
  }

  if (PATTERNS.CIRCULAR_SINGLY.test(normalized)) {
    console.log('✅ Matched: change to circular singly');
    return { operation: 'change_list_type', value: null, listType: 'circular_singly', structure: 'list', confidence: 0.8 };
  }

  if (PATTERNS.DOUBLY.test(normalized)) {
    console.log('✅ Matched: change to doubly');
    return { operation: 'change_list_type', value: null, listType: 'doubly', structure: 'list', confidence: 0.7 };
  }

  if (PATTERNS.SINGLY.test(normalized)) {
    console.log('✅ Matched: change to singly');
    return { operation: 'change_list_type', value: null, listType: 'singly', structure: 'list', confidence: 0.7 };
  }

  // ===== DATA TYPE CHANGES =====
  if (PATTERNS.NUMBERS.test(normalized)) {
    console.log('✅ Matched: change to numbers');
    return { operation: 'change_data_type', value: null, dataType: 'numbers', structure: 'list', confidence: 0.6 };
  }

  if (PATTERNS.STRINGS.test(normalized)) {
    console.log('✅ Matched: change to strings');
    return { operation: 'change_data_type', value: null, dataType: 'strings', structure: 'list', confidence: 0.6 };
  }

  if (PATTERNS.CHARACTERS.test(normalized)) {
    console.log('✅ Matched: change to characters');
    return { operation: 'change_data_type', value: null, dataType: 'characters', structure: 'list', confidence: 0.6 };
  }

  console.log('❌ No command matched');
  return null;
}

// ============ VOICE RECOGNITION CLASS ============
export class VoiceRecognition {
  private recognition: any = null;
  private SpeechRecognitionClass: any;
  private isListening: boolean = false;
  private shouldContinue: boolean = false;
  private onResultCallback: ((text: string) => void) | null = null;
  private onErrorCallback: ((error: string) => void) | null = null;
  private onStatusCallback: ((status: string) => void) | null = null;
  private restartTimeout: any = null;
  private abortCount: number = 0;
  private maxAborts: number = 3;

  constructor() {
    this.SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!this.SpeechRecognitionClass) {
      console.error('❌ Speech recognition not supported in this browser');
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
    }
  }

  private createRecognition(): void {
    if (!this.SpeechRecognitionClass) return;

    // Destroy old instance if exists
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch (e) {}
      this.recognition = null;
    }

    this.recognition = new this.SpeechRecognitionClass();
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';
    this.recognition.maxAlternatives = 1;

    this.recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (interimTranscript && this.onStatusCallback) {
        this.onStatusCallback(`hearing: ${interimTranscript}`);
      }

      if (finalTranscript && this.onResultCallback) {
        console.log('🎤 Final transcript:', finalTranscript);
        this.abortCount = 0; // Reset abort count on successful result
        this.onResultCallback(finalTranscript.trim());
      }
    };

    this.recognition.onerror = (event: any) => {
      console.warn('🔴 Voice error:', event.error);
      this.isListening = false;

      if (event.error === 'not-allowed') {
        this.shouldContinue = false;
        alert('Microphone access denied. Please allow microphone permissions in your browser settings.');
        if (this.onStatusCallback) {
          this.onStatusCallback('❌ Mic permission denied');
        }
        return;
      }

      if (event.error === 'aborted') {
        this.abortCount++;
        console.log(`Abort count: ${this.abortCount}/${this.maxAborts}`);
        
        if (this.abortCount >= this.maxAborts) {
          console.log('Too many aborts, giving up. Try clicking mic again.');
          this.shouldContinue = false;
          if (this.onStatusCallback) {
            this.onStatusCallback('⚠️ Voice failed - click mic to retry');
          }
          return;
        }
      }

      if (event.error === 'no-speech' && this.shouldContinue) {
        this.scheduleRestart(500);
      }
    };

    this.recognition.onend = () => {
      console.log('Recognition ended, shouldContinue:', this.shouldContinue);
      this.isListening = false;

      if (this.shouldContinue) {
        // Create fresh instance and restart
        this.scheduleRestart(this.abortCount > 0 ? 1500 : 300);
      } else if (this.onStatusCallback) {
        this.onStatusCallback('Click mic to start');
      }
    };

    this.recognition.onstart = () => {
      console.log('✅ Recognition started');
      this.isListening = true;
      if (this.onStatusCallback) {
        this.onStatusCallback('🎤 Listening...');
      }
    };

    this.recognition.onaudiostart = () => {
      console.log('🎙️ Audio capture started');
      this.abortCount = 0; // Reset on successful audio capture
    };

    this.recognition.onspeechstart = () => {
      console.log('🗣️ Speech detected');
    };
  }

  private scheduleRestart(delay: number): void {
    if (this.restartTimeout) {
      clearTimeout(this.restartTimeout);
    }
    this.restartTimeout = setTimeout(() => {
      if (this.shouldContinue && !this.isListening) {
        console.log('🔄 Restarting recognition...');
        this.createRecognition();
        try {
          this.recognition?.start();
        } catch (e) {
          console.log('Restart failed:', e);
          this.scheduleRestart(2000);
        }
      }
    }, delay);
  }

  async start(): Promise<void> {
    if (!this.SpeechRecognitionClass) {
      console.error('❌ Speech recognition not available');
      alert('Speech recognition is not available. Please use Chrome or Edge browser.');
      return;
    }

    if (this.isListening || this.shouldContinue) {
      console.log('Already listening, ignoring start request');
      return;
    }

    // Request microphone permission first
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop the stream immediately - we just needed permission
      stream.getTracks().forEach(track => track.stop());
      console.log('✅ Microphone permission granted');
    } catch (err) {
      console.error('❌ Microphone permission denied:', err);
      alert('Microphone access is required for voice commands. Please allow microphone access.');
      if (this.onStatusCallback) {
        this.onStatusCallback('❌ Mic permission denied');
      }
      return;
    }

    this.shouldContinue = true;
    this.abortCount = 0;
    this.createRecognition();
    
    try {
      this.recognition.start();
      console.log('🎤 Starting voice recognition...');
    } catch (e) {
      console.log('Start error:', e);
      this.shouldContinue = false;
    }
  }

  stop(): void {
    console.log('🛑 Stopping voice recognition...');
    this.shouldContinue = false;
    this.abortCount = 0;
    
    if (this.restartTimeout) {
      clearTimeout(this.restartTimeout);
      this.restartTimeout = null;
    }
    
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch (e) {
        console.log('Stop error:', e);
      }
      this.recognition = null;
    }
    this.isListening = false;
  }

  toggle(): void {
    if (this.shouldContinue || this.isListening) {
      this.stop();
    } else {
      this.start();
    }
  }

  getIsListening(): boolean {
    return this.shouldContinue;
  }

  onResult(callback: (text: string) => void): void {
    this.onResultCallback = callback;
  }

  onError(callback: (error: string) => void): void {
    this.onErrorCallback = callback;
  }

  onStatus(callback: (status: string) => void): void {
    this.onStatusCallback = callback;
  }
}
