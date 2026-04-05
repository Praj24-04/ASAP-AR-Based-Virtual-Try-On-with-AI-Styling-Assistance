const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;

// CORS configuration
const corsOptions = {
    origin: '*', // Allow all origins
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Debug middleware to log all requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Serve static files from the server directory
app.use(express.static(__dirname));

// Add specific routes for chatbot files with error handling
app.get('/chatbot-styles.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'chatbot-styles.css'), (err) => {
        if (err) {
            console.error('Error sending chatbot-styles.css:', err);
            res.status(500).send('Error loading styles');
        }
    });
});

app.get('/chatbot-script.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'chatbot-script.js'), (err) => {
        if (err) {
            console.error('Error sending chatbot-script.js:', err);
            res.status(500).send('Error loading script');
        }
    });
});

// System prompt for the styling assistant
const SYSTEM_PROMPT = `
You are a FashionStylist, a friendly and creative AI styling assistant. Your role is to provide personalized fashion advice and styling tips based on user input.

Guidelines:
1. Always respond in a warm, enthusiastic tone with emojis when appropriate 👗✨
2. Format your responses with clear paragraphs and spacing for readability
3. Use bullet points (-) for lists of items
4. Keep paragraphs concise (2-3 sentences max)
5. Separate different ideas with line breaks
6.keep the chat max of 20 characters.

Example response format:
"For a summer wedding, I'd recommend:\n\n"
"- A flowy pastel midi dress\n"
"- Strappy sandals in a complementary neutral tone\n"
"- A woven clutch and delicate gold jewelry\n\n"
"This look is perfect for an outdoor ceremony while keeping you cool and stylish! 🌸"

Another example:
"Building a capsule wardrobe? Here's how to start:\n\n"
"- 3-4 neutral tops (white, black, beige)\n"
"- 2 pairs of well-fitted pants (one dark, one light)\n"
"- 1-2 versatile jackets/blazers\n"
"- 1 pair of comfortable yet stylish shoes\n\n"
"With these basics, you can mix and match for countless outfits!"
`;

// Ollama API endpoint
const OLLAMA_API_URL = 'http://localhost:11434/api/chat';

app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        // Check if Ollama is running
        try {
            await axios.get('http://localhost:11434/api/tags');
        } catch (error) {
            console.error('Ollama is not running:', error);
            return res.status(503).json({ error: 'AI service is not available. Please make sure Ollama is running.' });
        }
        
        const response = await axios.post(OLLAMA_API_URL, {
            model: 'llama3',
            messages: [
                {
                    role: 'system',
                    content: SYSTEM_PROMPT
                },
                {
                    role: 'user',
                    content: message
                }
            ],
            stream: false
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        // Format the response for better readability
        let formattedResponse = formatResponse(response.data.message.content);
        res.json({ response: formattedResponse });
    } catch (error) {
        console.error('Error calling Ollama API:', error);
        res.status(500).json({ error: 'Failed to get response from AI. Please try again later.' });
    }
});

// Helper function to format the AI response
function formatResponse(text) {
    // Ensure double line breaks between paragraphs
    let formatted = text.replace(/\n\s*\n/g, '\n\n');
    
    // Format bullet points consistently
    formatted = formatted.replace(/^\s*[\-•]\s+/gm, '- ');
    
    // Remove excessive line breaks
    formatted = formatted.replace(/\n{3,}/g, '\n\n');
    
    // Trim whitespace
    return formatted.trim();
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err.stack);
    res.status(500).json({ error: 'Something went wrong! Please try again later.' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Static files directory: ${__dirname}`);
}); 