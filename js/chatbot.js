/**
 * Thilac Ramesh Portfolio - Floating AI Assistant Widget
 * 
 * Powered by Google Gemini & Client-Side Portfolio RAG System.
 */

(function () {
  "use strict";

  // Conversation memory for multi-turn dialogue
  const conversationHistory = [];
  let isGenerating = false;
  let isMinimized = false;

  // DOM Elements cache
  let launcherBtn = null;
  let chatModal = null;
  let calloutTooltip = null;
  let messagesContainer = null;
  let chatInput = null;
  let chatForm = null;
  let sendBtn = null;
  let minimizeBtn = null;
  let closeBtn = null;
  let clearBtn = null;

  /**
   * Helper: Escape HTML to avoid injection
   */
  function escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /**
   * Safe Markdown Formatter for Assistant Responses
   */
  function formatMarkdown(text) {
    if (!text) return "";
    let safe = escapeHtml(text);

    // Bold: **text**
    safe = safe.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // Italics: *text* or _text_
    safe = safe.replace(/\*([^\*]+)\*/g, "<em>$1</em>");

    // Inline Code: `code`
    safe = safe.replace(/`([^`]+)`/g, "<code>$1</code>");

    // Links: [label](url)
    safe = safe.replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    // Bullet points: lines starting with * or -
    const lines = safe.split("\n");
    let inList = false;
    const formattedLines = [];

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      if (line.startsWith("- ") || line.startsWith("* ")) {
        if (!inList) {
          inList = true;
          formattedLines.push("<ul>");
        }
        formattedLines.push(`<li>${line.substring(2)}</li>`);
      } else {
        if (inList) {
          inList = false;
          formattedLines.push("</ul>");
        }
        if (line.length > 0) {
          formattedLines.push(`<p>${line}</p>`);
        }
      }
    }
    if (inList) {
      formattedLines.push("</ul>");
    }

    return formattedLines.join("");
  }

  /**
   * Scroll chat body to bottom
   */
  function scrollToBottom() {
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }

  /**
   * Append a chat message to UI
   */
  function appendMessage(role, text, sources = []) {
    if (!messagesContainer) return;

    const msgEl = document.createElement("div");
    msgEl.className = `chat-msg ${role}`;

    const avatarHtml = role === "assistant" 
      ? `<div class="chat-msg-avatar" title="Chatbot"><i class="fas fa-robot"></i></div>`
      : `<div class="chat-msg-avatar" title="You"><i class="fas fa-user"></i></div>`;

    let contentHtml = "";
    if (role === "assistant") {
      contentHtml = formatMarkdown(text);
      if (sources && sources.length > 0) {
        const sourceTitles = sources.map(s => s.title.replace("Project: ", "").replace("Competition: ", "")).join(", ");
        contentHtml += `<div class="rag-grounding-tag" title="Verified against portfolio knowledge base">
          <i class="fas fa-shield-alt"></i> Grounded: ${escapeHtml(sourceTitles)}
        </div>`;
      }
    } else {
      contentHtml = `<p>${escapeHtml(text)}</p>`;
    }

    msgEl.innerHTML = `
      ${avatarHtml}
      <div class="chat-msg-bubble">
        ${contentHtml}
      </div>
    `;

    messagesContainer.appendChild(msgEl);
    scrollToBottom();
  }

  /**
   * Show typing bubble
   */
  function showTypingIndicator() {
    const typingEl = document.createElement("div");
    typingEl.className = "chat-msg assistant typing-msg";
    typingEl.id = "chat-typing-indicator";
    typingEl.innerHTML = `
      <div class="chat-msg-avatar"><i class="fas fa-robot"></i></div>
      <div class="typing-bubble">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    `;
    messagesContainer.appendChild(typingEl);
    scrollToBottom();
  }

  /**
   * Remove typing bubble
   */
  function removeTypingIndicator() {
    const el = document.getElementById("chat-typing-indicator");
    if (el) el.remove();
  }

  /**
   * Query Gemini API with RAG context
   */
  async function queryGemini(userQuery) {
    if (!window.portfolioRAG || !window.GEMINI_CONFIG) {
      throw new Error("Portfolio RAG or Gemini configuration not initialized.");
    }

    // Step 1: Client-Side Semantic Retrieval
    const retrievedChunks = window.portfolioRAG.retrieveContext(userQuery, 3);
    const systemPrompt = window.portfolioRAG.buildSystemInstruction(retrievedChunks);

    // Step 2: Build Multi-turn Contents
    // We add the user query to conversation history
    conversationHistory.push({
      role: "user",
      parts: [{ text: userQuery }]
    });

    const payload = {
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      contents: conversationHistory,
      generationConfig: {
        temperature: 0.1, // low temperature for direct, factual answers without hallucination or extra filler
        maxOutputTokens: 500
      }
    };

    const fallbackModels = [
      window.GEMINI_CONFIG.model || "gemini-flash-latest",
      "gemini-3.1-flash-lite",
      "gemini-3.5-flash"
    ];

    let lastError = null;
    let replyText = null;

    for (const modelName of fallbackModels) {
      try {
        const endpointUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${window.GEMINI_CONFIG.apiKey}`;
        const response = await fetch(endpointUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const errText = await response.text();
          console.warn(`Gemini Model ${modelName} returned status ${response.status}: ${errText}`);
          lastError = new Error(`Gemini status ${response.status}`);
          continue; // Try next model in fallback list
        }

        const data = await response.json();
        replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (replyText) {
          break; // Success!
        }
      } catch (err) {
        console.warn(`Error connecting to model ${modelName}:`, err);
        lastError = err;
      }
    }

    if (!replyText) {
      throw lastError || new Error("Failed to receive response from Gemini models.");
    }

    // Save model response to history
    conversationHistory.push({
      role: "model",
      parts: [{ text: replyText }]
    });

    return {
      text: replyText,
      sources: retrievedChunks
    };
  }

  /**
   * Handle user prompt submission
   */
  async function handleUserSubmit(queryText) {
    const text = (queryText || (chatInput ? chatInput.value : "")).trim();
    if (!text || isGenerating) return;

    if (chatInput) {
      chatInput.value = "";
      chatInput.style.height = "auto";
    }

    // Append user message
    appendMessage("user", text);

    // Disable input and show typing
    isGenerating = true;
    if (sendBtn) sendBtn.disabled = true;
    showTypingIndicator();

    try {
      const result = await queryGemini(text);
      removeTypingIndicator();
      appendMessage("assistant", result.text, result.sources);
    } catch (err) {
      removeTypingIndicator();
      console.error("Chatbot generation error:", err);
      appendMessage("assistant", "I apologize, but I encountered a momentary connection issue. Please feel free to try again or ask another question about Thilac's robotics research and engineering projects!");
    } finally {
      isGenerating = false;
      if (sendBtn) sendBtn.disabled = false;
      if (chatInput) chatInput.focus();
    }
  }

  /**
   * Open / Toggle Chatbot
   */
  function toggleChat(forceOpen) {
    if (!chatModal) return;
    const shouldOpen = forceOpen !== undefined ? forceOpen : !chatModal.classList.contains("active");

    if (shouldOpen) {
      chatModal.classList.add("active");
      chatModal.classList.remove("minimized");
      isMinimized = false;
      if (calloutTooltip) calloutTooltip.classList.add("hidden");
      if (chatInput) setTimeout(() => chatInput.focus(), 150);
      scrollToBottom();
    } else {
      chatModal.classList.remove("active");
    }
  }

  /**
   * Minimize Chatbot
   */
  function toggleMinimize() {
    if (!chatModal) return;
    isMinimized = !isMinimized;
    if (isMinimized) {
      chatModal.classList.add("minimized");
    } else {
      chatModal.classList.remove("minimized");
      scrollToBottom();
    }
  }

  /**
   * Clear Chat History
   */
  function clearChat() {
    conversationHistory.length = 0;
    if (messagesContainer) {
      messagesContainer.innerHTML = "";
      // Welcome message
      appendMessage("assistant", "Hello! I am the **Chatbot**. Feel free to ask any specific question about Thilac's robotics research, mechanical engineering projects, awards, or skills, and I'll give you a direct answer.");
    }
  }

  /**
   * Setup UI and Event Listeners
   */
  function initChatbot() {
    launcherBtn = document.getElementById("chatbot-launcher-btn");
    chatModal = document.getElementById("chatbot-modal");
    calloutTooltip = document.getElementById("chatbot-callout-tooltip");
    messagesContainer = document.getElementById("chatbot-messages-feed");
    chatInput = document.getElementById("chatbot-input-field");
    chatForm = document.getElementById("chatbot-input-form");
    sendBtn = document.getElementById("chatbot-send-button");
    minimizeBtn = document.getElementById("chatbot-btn-minimize");
    closeBtn = document.getElementById("chatbot-btn-close");
    clearBtn = document.getElementById("chatbot-btn-clear");

    if (!launcherBtn || !chatModal) {
      console.warn("Chatbot elements not found in DOM.");
      return;
    }

    // Toggle on launcher click
    launcherBtn.addEventListener("click", () => toggleChat());

    // Close button
    if (closeBtn) closeBtn.addEventListener("click", () => toggleChat(false));

    // Minimize button
    if (minimizeBtn) minimizeBtn.addEventListener("click", () => toggleMinimize());

    // Clear chat button
    if (clearBtn) clearBtn.addEventListener("click", () => clearChat());

    // Form submit
    if (chatForm) {
      chatForm.addEventListener("submit", (e) => {
        e.preventDefault();
        handleUserSubmit();
      });
    }

    // Input auto-grow & keyboard handling
    if (chatInput) {
      chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          handleUserSubmit();
        }
      });

      chatInput.addEventListener("input", function () {
        this.style.height = "auto";
        this.style.height = Math.min(this.scrollHeight, 90) + "px";
        if (sendBtn) {
          sendBtn.disabled = this.value.trim().length === 0 || isGenerating;
        }
      });
    }

    // Suggestion chips
    const suggestionChips = document.querySelectorAll(".suggestion-chip");
    suggestionChips.forEach(chip => {
      chip.addEventListener("click", () => {
        const query = chip.getAttribute("data-query") || chip.textContent.trim();
        toggleChat(true);
        handleUserSubmit(query);
      });
    });

    // Global keyboard shortcut: Ctrl + / or Cmd + / to toggle chatbot
    window.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "/") {
        e.preventDefault();
        toggleChat();
      } else if (e.key === "Escape" && chatModal.classList.contains("active")) {
        toggleChat(false);
      }
    });

    // Initial Welcome Message
    clearChat();

    // Auto-hide callout after 8 seconds if not interacted with
    setTimeout(() => {
      if (calloutTooltip) calloutTooltip.classList.add("hidden");
    }, 8000);
  }

  // Initialize once DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initChatbot);
  } else {
    initChatbot();
  }

  // Expose to window for testing
  window.portfolioChatbot = {
    toggle: toggleChat,
    ask: handleUserSubmit,
    clear: clearChat
  };
})();
