import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


export const handleAIQuestion = async (req, res) => {
  const { question, image } = req.body;

  try {
    const messages = [
      { role: 'system', content: 'You are a poultry health assistant. Give accurate answers.' },
      { role: 'user', content: question }
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages
    });

    const answer = completion.choices[0]?.message?.content || 'Sorry, I couldn’t find an answer.';
    return res.json({ answer });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'AI failed to respond' });
  }
};
