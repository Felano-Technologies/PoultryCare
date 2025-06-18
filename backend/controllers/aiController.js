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

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash-latest",
      generationConfig: {
        temperature: 0.8, // Slightly higher for more varied phrasing
        topP: 0.9, // Allows for more diverse word choices
        maxOutputTokens: 1000 // Ensures complete responses
      } 
    });

    const prompt = `
    You are a practical poultry health advisor speaking to farmers. Provide clear, actionable advice in a professional but accessible tone.

    Guidelines for your response:
    1. Start directly with the answer - no greetings or introductions
    2. Use bullet points or numbered lists for clear organization
    3. Prioritize common causes first
    4. Include practical immediate action steps
    5. Keep technical terms to a minimum, explain when necessary
    6. Emphasize quick interventions and when to seek professional help
    7. Maintain a helpful, solution-oriented tone

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