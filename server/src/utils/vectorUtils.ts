import pool from '../config/db';
import { pipeline } from '@xenova/transformers';
import { QueryResult } from 'pg';

let embeddingModel: any;

// initialize the embedding model
export const initEmbeddingModel = async () => {
    if (!embeddingModel) {
        // using pipeline to load the distilbert model
        embeddingModel = await pipeline('feature-extraction', 'Xenova/distilbert-base-uncased', {
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
    const output = await embeddingModel(text, {
        pooling: 'mean', // take the mean of the embeddings
        normalize: true, // normalize the embeddings
    });

    const vector = Array.from(output.data).map(value => Number(value));

    return vector;
};

// search for similar news by vector
export const findSimilarNews = async (queryVector: number[]): Promise<any[]> => {
    const client = await pool.connect();
    try {
        // transfer the vector to string like '[0.1, 0.2, 0.3]'
        const vectorString = '[' + queryVector.join(',') + ']';

        // TODO： search for similar news by vector change the SQL query
        const result: QueryResult = await client.query(
            `
          // TODO: search for similar news by vector
          // SQL query example: 
          
          SELECT id, title, summary, date
          FROM news_data
          ORDER BY embedding <#> $1
          LIMIT 3
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