/**
 * Gemini API Configuration for Thilac Ramesh Portfolio AI Assistant
 */
const GEMINI_CONFIG = {
  // Provided Gemini API Key
  apiKey: "AQ.Ab8RN6LN0OPAPZhy9hCFsQQzLPMGl_ikD7L_QOzHktlbSM7j1g",
  
  // Official validated model endpoint
  model: "gemini-flash-latest",
  
  // API URL Generator
  getEndpointUrl() {
    return `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
  },

  // Fallback endpoint if needed
  getFallbackEndpointUrl() {
    return `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`;
  }
};

if (typeof window !== "undefined") {
  window.GEMINI_CONFIG = GEMINI_CONFIG;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = GEMINI_CONFIG;
}

