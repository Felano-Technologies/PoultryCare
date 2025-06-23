import { GoogleGenerativeAI } from '@google/generative-ai';
import AIMessage from '../models/AI.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const askGemini = async (req, res) => {
  try {
    const { question, image } = req.body;
    const userId = req.user._id;

    await AIMessage.create({
      user: userId,
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
    You are a poultry expert providing advice to farmers. Format all responses strictly using Markdown with these sections:
    
    # [Main Issue/Topic]
    
    ## Diseases
    - Bullet point 1
    - Bullet point 2
    - Bullet point 3
    
    ## Possible Causes (ordered by likelihood)
    1. Most common cause (explain briefly)
    2. Second most likely cause
    3. Less common but possible causes
    
    ## Recommended Actions
    - First immediate action
    - Secondary steps
    - Long-term solutions
    
    ## Prevention
    - Key prevention method 1
    - Prevention method 2
    
    Additional Notes:
    - Use exactly this structure for every response
    - Keep technical terms simple and explain when needed
    - Prioritize actionable advice
    - Never include "Here are", "The symptoms are", etc. - go straight to the content
    
    ${image ? `An image has been provided: ${image}` : ''}
    
    Question: ${question}
    `.trim();


    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Save AI response
    await AIMessage.create({
      user: userId,
      role: 'ai',
      content: text,
    });

    res.json({ answer: text });
  } catch (err) {
    console.error('Gemini error:', err.message);
    res.status(500).json({ error: 'Failed to get AI response.' });
  }
};


export const getMessages = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const messages = await AIMessage.find({ user: userId })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalMessages = await AIMessage.countDocuments({ user: userId });
    const hasMore = skip + limit < totalMessages;

    res.json({
      messages: messages || [], // Ensure we always return an array
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalMessages / limit),
        totalMessages,
        hasMore
      }
    });
  } catch (err) {
    console.error('Error fetching messages:', err.message);
    res.status(500).json({ 
      messages: [], // Return empty array on error
      error: 'Failed to fetch messages' 
    });
  }
};