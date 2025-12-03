// Import the Pinecone library
const { Pinecone } = require ("@pinecone-database/pinecone");

// Initialize a Pinecone client with your API key
const pc = new Pinecone({ apiKey: process.env.PINECON_API_KEY });

// Create a dense index with integrated embedding
const indexName = pc.Index("chatgpt-project");

async function createMemory({ vector, metadata, messageId }) {
  const response = await indexName.upsert([
    {
      id: messageId,
      values: vector,
      metadata,
    },
  ]);
  return response; 
}

async function querMemory({ queryVector, limit = 5, metadata }) {
  const data = await indexName.query({
    vector: queryVector,
    topK: limit,
    filter: metadata ? { metadata } : undefined,
    includeMetadata: true,
  });
  return data.matches;
}

module.exports = { createMemory, querMemory };
