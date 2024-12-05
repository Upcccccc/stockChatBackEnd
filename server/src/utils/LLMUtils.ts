import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const generateResponse = async (userQuery: string, relevantSummaries: string[]): Promise<string> => {
    const relevantHistory = relevantSummaries.join('\n');

    const userPrompt = `
User: ${userQuery}

Below are relevant information that you must read and synthesize to give an answer to the user's question above.
${relevantHistory}

You (always in first person):
`;

    const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: userPrompt },
        ],
    });

    const aiResponse = completion.choices[0].message?.content || '';

    return aiResponse;
};