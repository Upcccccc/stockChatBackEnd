import pool from '../config/db';
import { QueryResult } from 'pg';

let embeddingModel: any;
let pipeline: any;

// initialize the pipeline
const initPipeline = async () => {
    const transformers = await import('@xenova/transformers');
    pipeline = transformers.pipeline;
};

// initialize the embedding model
export const initEmbeddingModel = async () => {
    if (!pipeline) {
        await initPipeline();
    }

    if (!embeddingModel) {
        // using pipeline to load the distilbert model
        embeddingModel = await pipeline('feature-extraction', 'Xenova/distilbert-base-uncased', {
            pooling: 'cls',          // 使用 CLS token
            normalize: true,
            revision: 'default',
            progress_callback: (progress: number) => {
                console.log(`Model loading progress: ${Math.round(progress * 100)}%`);
            },
        });
        console.log('Embedding model loaded successfully.');
    }
};

// transfer text to vector
export const transformTextToVector = async (text: string): Promise<number[]> => {
    if (!embeddingModel) {
        await initEmbeddingModel();
    }

    // get the embedding of the text
    console.log('Transforming text to vector...');
    const output = await embeddingModel(text, {
        pooling: 'cls',
        normalize: true
    });
    console.log(output)
    console.log('Text transformed to vector successfully.');

    const vector = Array.from(output.data).map(value => Number(value));

    return vector;
};

// search for similar news by vector
export const findSimilarNews = async (queryVector: number[]): Promise<any[]> => {
    const client = await pool.connect();
    console.log(queryVector.length);
    console.log('Query vector:', queryVector);

    try {
        // transfer the vector to string like '[0.1, 0.2, 0.3]'
        const vectorString = '[' + queryVector.join(',') + ']';

        const result: QueryResult = await client.query(
            `
            SELECT 
                id,
                headline as title,
                short_description as summary,
                date
            FROM news
            ORDER BY embedding <=> $1::vector
            LIMIT 5
            `,
            [vectorString]
        );
        return result.rows;
    } catch (error) {
        console.error('Error during vector search:', error);
        throw error;
    } finally {
        client.release();
    }
};
