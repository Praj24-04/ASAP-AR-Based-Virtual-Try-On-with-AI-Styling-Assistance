// Create chatbot HTML elements
const chatbotHTML = `
    <div id="chatbot-toggle">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
    </div>
    
    <div id="chatbot-container">
        <div id="chatbot-header">
            <div id="chatbot-title">Style Assistant</div>
            <button id="chatbot-close">×</button>
        </div>
        <div id="chatbot-messages">
            <div class="message bot-message">
            Hi there! I'm your personal styling assistant. Tell me about an event you're attending or your fashion preferences, and I'll give you tailored styling tips!
            </div>
        </div>
        <div id="chatbot-input-container">
            <input type="text" id="chatbot-input" placeholder="Ask me for styling advice..." />
            <button id="chatbot-send">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
            </button>
        </div>
    </div>
`;

// Add chatbot HTML to the page
document.body.insertAdjacentHTML('beforeend', chatbotHTML);

// Toggle chatbot visibility
const chatbotToggle = document.getElementById('chatbot-toggle');
const chatbotContainer = document.getElementById('chatbot-container');

chatbotToggle.addEventListener('click', () => {
    chatbotContainer.classList.add('active');
});

document.getElementById('chatbot-close').addEventListener('click', () => {
    chatbotContainer.classList.remove('active');
});

// Chat functionality
const chatInput = document.getElementById('chatbot-input');
const chatMessages = document.getElementById('chatbot-messages');
const sendButton = document.getElementById('chatbot-send');

function addMessage(content, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
    
    // Format the content with paragraphs and line breaks
    const formattedContent = content
        .replace(/\n\n/g, '</p><p>')  // Double newlines become paragraph breaks
        .replace(/\n/g, '<br>')       // Single newlines become line breaks
        .replace(/- /g, '<br>- ');    // Bullet points
    
    messageDiv.innerHTML = `<p>${formattedContent}</p>`;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.classList.add('typing-indicator');
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = `
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
    `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    
    addMessage(message, true);
    chatInput.value = '';
    showTypingIndicator();
    
    try {
        const response = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message })
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        hideTypingIndicator();
        addMessage(data.response);
    } catch (error) {
        hideTypingIndicator();
        addMessage("Sorry, I'm having trouble connecting to the style advice service. Please try again later.");
        console.error('Error:', error);
    }
}

sendButton.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Open chatbot by default after a short delay
setTimeout(() => {
    chatbotContainer.classList.add('active');
}, 1000); 