import { GoogleGenerativeAI } from '@google/generative-ai';
import Chat from '../models/Chat.js';
import Message from '../models/Message.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
export const askGemini = async (req, res) => {
  try {
    const { question, image, chatId } = req.body;
    const userId = req.user._id;

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    // Find or create chat
    let chat;
    if (chatId) {
      chat = await Chat.findById(chatId);
      if (!chat || chat.user.toString() !== userId.toString()) {
        return res.status(404).json({ error: 'Chat not found' });
      }
    } else {
      // Create new chat with temporary title
      chat = await Chat.create({
        user: userId,
        title: 'New Chat' // Temporary placeholder
      });
    }

    // Save user message
    await Message.create({
      chat: chat._id,
      user: userId,
      role: 'user',
      content: question,
      image: image || null
    });

    // Generate AI response
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash-latest",
      generationConfig: {
        temperature: 0.8,
        topP: 0.9,
        maxOutputTokens: 1000
      } 
    });

    const prompt = `
    You are an expert poultry farming assistant providing detailed, practical advice. 
    Format responses using Markdown with appropriate sections based on the question type.

    ## For Disease-Related Questions:
    # [Disease Name]
    
    ### Symptoms
    - Primary symptom 1
    - Secondary symptom 2
    
    ### Causes (ordered by likelihood)
    1. Most common cause
    2. Secondary causes
    
    ### Treatment
    - Immediate actions
    - Medication options
    - Supportive care
    
    ### Prevention
    - Biosecurity measures
    - Vaccination schedule
    - Management practices

    ## For Feed/Nutrition Questions:
    # [Feed Topic]
    
    ### Nutritional Requirements
    - Protein: X%
    - Energy: Y kcal/kg
    - Key vitamins/minerals
    
    ### Recommended Formulations
    - Starter feed (0-X weeks)
    - Grower feed (X-Y weeks)
    - Layer feed (production)
    
    ### Ingredients
    - Primary ingredients
    - Alternative options
    - Cost-saving tips
    
    ### Feeding Practices
    - Feeding schedule
    - Amount per bird
    - Storage recommendations

    ## For Housing/Management Questions:
    # [Housing Topic]
    
    ### Space Requirements
    - Minimum space per bird
    - Ventilation needs
    
    ### Equipment
    - Essential equipment
    - Cost-effective alternatives
    
    ### Best Practices
    - Daily routines
    - Weekly tasks
    - Seasonal considerations

    ## General Guidelines:
    - Always prioritize actionable, practical advice
    - Use simple language but include technical terms with explanations
    - Provide measurements in both metric and imperial when relevant
    - Suggest cost-effective solutions where possible
    - Highlight any safety considerations
    - Include relevant calculations when helpful (e.g., feed conversion ratios)
    - Mention common mistakes to avoid

    ${image ? `An image has been provided: ${image}` : ''}
    
    Question: ${question}
    `.trim();
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Save AI response
    await Message.create({
      chat: chat._id,
      user: userId,
      role: 'ai',
      content: text
    });

    // Generate title from first response if this is a new chat
    if (!chatId) {
      const title = await generateChatTitle(question, text);
      chat.title = title;
      await chat.save();
    }

    res.json({ 
      answer: text,
      chatId: chat._id,
      chatTitle: chat.title
    });

  } catch (err) {
    console.error('Gemini error:', err.message);
    res.status(500).json({ error: 'Failed to get AI response.' });
  }
};

// Helper function to generate chat title
async function generateChatTitle(question, aiResponse) {
  try {
    // Extract first heading from AI response
    const firstHeadingMatch = aiResponse.match(/^#\s(.+)$/m);
    if (firstHeadingMatch && firstHeadingMatch[1]) {
      return firstHeadingMatch[1].substring(0, 50); // Truncate if needed
    }

    // Fallback 1: Use the first sentence of AI response
    const firstSentence = aiResponse.split('\n')[0];
    if (firstSentence && firstSentence.length > 10) {
      return firstSentence.substring(0, 50);
    }

    // Fallback 2: Use the question (truncated)
    return question.substring(0, 30) + (question.length > 30 ? '...' : '');

  } catch (error) {
    console.error('Error generating title:', error);
    return question.substring(0, 30) + (question.length > 30 ? '...' : '');
  }
}



export const getMessages = async (req, res) => {
  try {
    const { chatId } = req.query;
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Verify chat belongs to user
    const chat = await Chat.findOne({ _id: chatId, user: userId });
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    const messages = await Message.find({ chat: chatId })
      .sort({ createdAt: 1 }) // Oldest first for chat display
      .skip(skip)
      .limit(limit)
      .lean();

    const totalMessages = await Message.countDocuments({ chat: chatId });
    const hasMore = skip + limit < totalMessages;

    res.json({
      messages: messages || [],
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
      messages: [],
      error: 'Failed to fetch messages' 
    });
  }
};

export const getChats = async (req, res) => {
  try {
    const userId = req.user._id;
    const chats = await Chat.find({ user: userId })
      .sort({ lastMessage: -1 })
      .lean();

    res.json(chats);
  } catch (err) {
    console.error('Error fetching chats:', err.message);
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
};

export const createChat = async (req, res) => {
  try {
    const userId = req.user._id;
    const chat = await Chat.create({
      user: userId,
      title: 'New Chat'
    });
    res.status(201).json(chat);
  } catch (err) {
    console.error('Error creating chat:', err.message);
    res.status(500).json({ error: 'Failed to create chat' });
  }
};

export const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id;

    // Verify chat belongs to user
    const chat = await Chat.findOneAndDelete({ _id: chatId, user: userId });
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    // Delete all messages in the chat
    await Message.deleteMany({ chat: chatId });

    res.json({ message: 'Chat deleted successfully' });
  } catch (err) {
    console.error('Error deleting chat:', err.message);
    res.status(500).json({ error: 'Failed to delete chat' });
  }
};