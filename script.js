// --- Settings and Theme State ---
const themeToggleBtn = document.getElementById('theme-toggle');
const htmlEl = document.documentElement;

// ==========================================
// Theme Management
// ==========================================
const getPreferredTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const setTheme = (theme) => {
    htmlEl.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
};
setTheme(getPreferredTheme());

themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlEl.getAttribute('data-theme');
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

// ==========================================
// Settings Modal Logic
// ==========================================
const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const closeModalBtn = document.getElementById('close-modal');
const saveKeyBtn = document.getElementById('save-key-btn');
const apiKeyInput = document.getElementById('api-key-input');
const settingsStatus = document.getElementById('settings-status');

const savedKey = localStorage.getItem('groq_api_key');
if (savedKey) apiKeyInput.value = savedKey;

const openModal = () => {
    settingsModal.classList.remove('hidden');
    settingsStatus.textContent = '';
};
const closeModal = () => settingsModal.classList.add('hidden');

settingsBtn.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);
settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) closeModal();
});

saveKeyBtn.addEventListener('click', () => {
    const key = apiKeyInput.value.trim();
    if (key) {
        localStorage.setItem('groq_api_key', key);
        settingsStatus.textContent = 'API Key saved successfully!';
        settingsStatus.style.color = '#10b981';
        setTimeout(closeModal, 1500);
    } else {
        localStorage.removeItem('groq_api_key');
        settingsStatus.textContent = 'API Key cleared.';
        settingsStatus.style.color = '#ef4444';
        setTimeout(closeModal, 1500);
    }
});

// ==========================================
// Chat Logic & Groq API Integration
// ==========================================
const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input');
const chatMessages = document.getElementById('chat-messages');

let conversationHistory = [
    { role: "system", content: "You are a helpful and friendly AI assistant named MAHORAGA AI." }
];

const scrollToBottom = () => {
    requestAnimationFrame(() => chatMessages.scrollTop = chatMessages.scrollHeight);
};

const createMessageElement = (content, sender) => {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', `${sender}-message`);
    
    const formattedContent = content.replace(/\n/g, '<br>');

    const botAvatar = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path><line x1="8" y1="16" x2="8" y2="16"></line><line x1="16" y1="16" x2="16" y2="16"></line></svg>`;
    const userAvatar = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;

    msgDiv.innerHTML = `
        <div class="message-avatar">${sender === 'bot' ? botAvatar : userAvatar}</div>
        <div class="message-content"></div>
    `;
    msgDiv.querySelector('.message-content').innerHTML = formattedContent; 
    return msgDiv;
};

const showTypingIndicator = () => {
    const indicatorDiv = document.createElement('div');
    indicatorDiv.classList.add('message', 'bot-message');
    indicatorDiv.id = 'typing-indicator';
    indicatorDiv.innerHTML = `
        <div class="message-avatar"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path><line x1="8" y1="16" x2="8" y2="16"></line><line x1="16" y1="16" x2="16" y2="16"></line></svg></div>
        <div class="message-content" style="padding: 12px 20px;">
            <div class="typing-indicator" style="padding: 0; min-height: unset;"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>
        </div>
    `;
    chatMessages.appendChild(indicatorDiv);
    scrollToBottom();
};

const removeTypingIndicator = () => {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
};

const callGroq = async (messages) => {
    const apiKey = localStorage.getItem('groq_api_key');
    if (!apiKey) throw new Error("No API Key found. Please click the settings icon to add it.");

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({ model: "llama-3.1-8b-instant", messages })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "Error communicating with Groq");
    return data.choices[0].message.content;
};

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userText = messageInput.value.trim();
    if (!userText) return;

    const cleanUserText = userText.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    chatMessages.appendChild(createMessageElement(cleanUserText, 'user'));
    messageInput.value = '';
    scrollToBottom();

    conversationHistory.push({ role: "user", content: cleanUserText });
    showTypingIndicator();

    try {
        const botResponse = await callGroq(conversationHistory);
        removeTypingIndicator();
        conversationHistory.push({ role: "assistant", content: botResponse });
        
        let cleanBotResponse = botResponse.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        chatMessages.appendChild(createMessageElement(cleanBotResponse, 'bot'));
    } catch (err) {
        removeTypingIndicator();
        conversationHistory.pop(); 
        const errorMsgEl = createMessageElement(`API Error: ${err.message}`, 'bot');
        errorMsgEl.querySelector('.message-content').style.color = '#ef4444';
        chatMessages.appendChild(errorMsgEl);
    }
    scrollToBottom();
});

window.addEventListener('DOMContentLoaded', () => {
    messageInput.focus();
    if (!localStorage.getItem('groq_api_key')) setTimeout(openModal, 800);
});
