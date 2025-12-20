
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { UserRole, YusraConfig } from '../types';
import { YUSRA_DEFAULT_CONFIGS } from '../constants';

// Fixed: Initialize GoogleGenAI directly according to guidelines.
// Guideline: The API key must be obtained exclusively from the environment variable process.env.API_KEY.
// Guideline: Assume this variable is pre-configured, valid, and accessible.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateInsight = async (
  prompt: string, 
  userRole: UserRole = UserRole.VIEWER, 
  yusraConfigOverride?: YusraConfig // Accept dynamic config override
): Promise<GenerateContentResponse> => {
  try {
    // Determine the effective config: override if provided, else use role-based default, else viewer default
    const effectiveConfig = yusraConfigOverride || YUSRA_DEFAULT_CONFIGS[userRole] || YUSRA_DEFAULT_CONFIGS[UserRole.VIEWER];
    
    // Construct the system instruction using the systemPromptAddition from the effective config
    let systemInstruction = `You are Yusra, an advanced financial AI assistant for the Quantum Glass Business Cloud. ${effectiveConfig.systemPromptAddition} You provide concise, actionable, and data-driven financial insights. You are fluent in English (EN), Bengali (BN), and Arabic (AR). Detect the user's language and respond in the same language/script. If asked to perform an action, confirm the details. Tone: Professional, knowledgeable, yet futuristic.`;

    // Determine settings: Prioritize role-specific overrides, fallback to defaults
    // Defaults: temp 0.7, topP 0.95, topK 64
    const temperature = effectiveConfig.globalSettingsOverride?.temperature ?? 0.7;
    const topP = effectiveConfig.globalSettingsOverride?.topP ?? 0.95;
    const topK = effectiveConfig.globalSettingsOverride?.topK ?? 64;
    
    // Note: Verbosity is typically handled via system prompt or prompt engineering in the call, 
    // but we can append it to the system instruction for better effect.
    if (effectiveConfig.globalSettingsOverride?.responseVerbosity) {
        systemInstruction += ` Response verbosity: ${effectiveConfig.globalSettingsOverride.responseVerbosity}.`;
    }

    // Initialize config with values
    let config: any = {
      systemInstruction: systemInstruction,
      temperature: temperature, 
      topP: topP,
      topK: topK,
    };
    let tools: any[] = [];

    // --- Dynamic Power-Up Logic for Yusra ---

    // 1. Google Search Grounding for up-to-date info
    const searchKeywords = ['latest', 'current', 'news', 'market trends', 'recent', 'what is the status of', 'who won'];
    const requiresSearch = searchKeywords.some(keyword => prompt.toLowerCase().includes(keyword));

    if (requiresSearch) {
      tools.push({ googleSearch: {} });
      // Clear responseMimeType and responseSchema if set, as they are not allowed with googleSearch tool
      delete config.responseMimeType;
      delete config.responseSchema;
    }

    // 2. Enhanced Reasoning for Complex Tasks (Prediction, Strategy, Research, Brainstorming)
    const complexKeywords = ['forecast', 'predict', 'strategy', 'research', 'brainstorm', 'analyze market', 'optimize', 'deep dive', 'plan for'];
    const requiresComplexReasoning = complexKeywords.some(keyword => prompt.toLowerCase().includes(keyword));

    if (requiresComplexReasoning) {
      // Increase thinking budget for deeper reasoning (for Gemini 2.5 series models)
      config.thinkingConfig = { thinkingBudget: 8192 }; // Example: a higher budget, adjust as needed up to max
      // Adjust params slightly for creative tasks, but respect overrides if valid ranges provided
      if (!effectiveConfig.globalSettingsOverride?.temperature) {
         config.temperature = 0.9; 
         config.topP = 0.9; 
      }
    }

    // Combine tools into the config if any are present
    if (tools.length > 0) {
      config.tools = tools;
    }

    // Ensure contents are in the correct format as per guidelines
    const generateContentParameters: any = {
      model: 'gemini-2.5-flash',
      contents: [{ text: prompt }], // Use parts: [{text: prompt}] for text-only
      config: config
    };

    const response = await ai.models.generateContent(generateContentParameters);
    return response;
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Return a dummy GenerateContentResponse with an error message
    const errorResponse: GenerateContentResponse = {
      text: "I'm having trouble connecting to the neural network or processing your request. Please try again later.",
      candidates: [],
    };
    return errorResponse;
  }
};

export const analyzeTransaction = async (description: string, amount: number): Promise<{category: string, risk: string}> => {
    const prompt = `Analyze this transaction: Description: "${description}", Amount: ${amount}. Return JSON with 'category' and 'risk' (Low, Medium, High).`;
    
    try {
        // Fixed: Removed null check for ai instance
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        const text = response.text;
        if (text) {
            return JSON.parse(text);
        }
        return { category: 'Uncategorized', risk: 'Unknown' };
    } catch (e) {
        return { category: 'Error', risk: 'Unknown' };
    }
}

/**
 * Mocks the process of uploading and "training" Yusra with new data.
 * In a real-world scenario, this would involve sending data to a backend
 * for processing, embedding, and storing in a vector database for RAG.
 */
export const uploadTrainingData = async (file: File): Promise<{ success: boolean, message: string }> => {
  console.log(`Simulating upload of file: ${file.name}, type: ${file.type}, size: ${file.size} bytes`);
  
  // Simulate network delay and processing
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Simulate success
  return { success: true, message: `File '${file.name}' processed and added to Yusra's knowledge base.` };
};
