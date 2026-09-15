/**
 * Gemini API & AI Assistant Configuration for Thilac Ramesh Portfolio
 * 
 * On Vercel:
 * Set GEMINI_API_KEY in Vercel Project Settings -> Environment Variables.
 * The serverless function /api/chat will automatically handle secure, live Gemini responses.
 */
const GEMINI_CONFIG = {
  // Serverless API route on Vercel
  apiEndpoint: "/api/chat",

  // Optional direct client-side API Key (e.g. AIzaSy...)
  // Leaving this blank routes requests to the secure Vercel /api/chat endpoint
  apiKey: "",

  // Default models
  model: "gemini-2.0-flash",
  fallbackModel: "gemini-1.5-flash",

  // Helper to get direct endpoint if client key is configured
  getEndpointUrl() {
    if (this.apiKey && this.apiKey.startsWith("AIzaSy")) {
      return `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
    }
    return this.apiEndpoint;
  }
};

if (typeof window !== "undefined") {
  window.GEMINI_CONFIG = GEMINI_CONFIG;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = GEMINI_CONFIG;
}
