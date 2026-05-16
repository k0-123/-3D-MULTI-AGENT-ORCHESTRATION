import { Pinecone } from "@pinecone-database/pinecone";
import { pipeline, FeatureExtractionPipeline } from "@xenova/transformers";

const pc = new Pinecone({ apiKey: import.meta.env.VITE_PINECONE_API_KEY });
const index = pc.index("agent-memory");

// Local embedder — no API key, no cost, runs in browser
let embedder: FeatureExtractionPipeline | null = null;

const getEmbedder = async () => {
  if (!embedder) {
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return embedder;
};

export const getEmbedding = async (text: string): Promise<number[]> => {
  const embed = await getEmbedder();
  const output = await embed(text, { pooling: "mean", normalize: true });
  return Array.from(output.data as Float32Array);
};

// Store memory — ALWAYS namespaced by agentId
export const storeMemory = async (
  agentId: string,
  text: string,
  metadata: Record<string, any> = {}
) => {
  const ns = index.namespace(agentId); // ISOLATED — never touch global namespace
  const values = await getEmbedding(text);

  await ns.upsert([{
    id: `${agentId}-${Date.now()}`,
    values,
    metadata: {
      text: text.slice(0, 500),
      agentId,
      timestamp: Date.now(),
      ...metadata,
    },
  }]);
};

// Recall memories — ONLY this agent's namespace
export const recallMemories = async (
  agentId: string,
  query: string,
  topK = 5
): Promise<string[]> => {
  const ns = index.namespace(agentId); // ISOLATED
  const values = await getEmbedding(query);

  const results = await ns.query({
    vector: values,
    topK,
    includeMetadata: true,
  });

  return results.matches
    .filter(m => (m.score ?? 0) > 0.65)
    .map(m => m.metadata?.text as string)
    .filter(Boolean);
};

// Clear all memories for an agent
export const clearAgentMemory = async (agentId: string) => {
  await index.namespace(agentId).deleteAll();
};
