// Reflection loop: agent critiques its own answer before returning
export const runWithReflection = async (
  dispatch: (agentId: string, messages: any[], taskType?: string) => Promise<string>,
  agentId: string,
  messages: { role: string; content: string }[]
): Promise<string> => {

  // First pass
  const firstDraft = await dispatch(agentId, messages, "reasoning");

  // Reflection pass
  const reflectMessages = [
    ...messages,
    { role: "assistant", content: firstDraft },
    {
      role: "user",
      content:
        "Review your answer above critically. Is it complete, accurate, and helpful? " +
        "If yes, repeat it as FINAL ANSWER: <your answer>. " +
        "If not, improve it and write FINAL ANSWER: <improved answer>.",
    },
  ];

  const reflected = await dispatch(agentId, reflectMessages, "reasoning");

  // Extract final answer
  const match = reflected.match(/FINAL ANSWER:\s*([\s\S]+)/i);
  return match ? match[1].trim() : reflected;
};
