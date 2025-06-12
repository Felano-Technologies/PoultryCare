import { GoogleGenerativeAI } from '@google/generative-ai';
import AIMessage from '../models/AI.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const askGemini = async (req, res) => {
  try {
    const { question, image } = req.body;

    await AIMessage.create({
      role: 'user',
      content: question,
      image: image || null,
    });

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest",
    generationConfig: {
      temperature: 0.7 
    } });

    const prompt = `
    You are a professional poultry health and management expert.
    Respond clearly and concisely to technical questions related to chickens, including health, feeding, environment, diseases, and productivity.
    Use formal language and avoid conversational or informal tone. Do not use greetings or personal anecdotes.
    Always provide accurate, practical, and focused information.
    ${image ? `An image has been provided: ${image}` : ''}
    Question: ${question}
    `.trim();
    
    

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    await AIMessage.create({
      role: 'ai',
      content: text,
    });

    res.json({ answer: text });
  } catch (err) {
    console.error('Gemini error:', err.message);
    res.status(500).json({ error: 'Failed to get AI response.' });
  }
};
