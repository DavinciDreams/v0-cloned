"use client";

import { Conversation } from "../components/ai-elements/conversation";
import type { StickToBottomContext } from "use-stick-to-bottom";
import { PromptInput } from "../components/ai-elements/prompt-input";
import { Canvas } from "../components/ai-elements/canvas";

export default function Page() {
  return (
    <Conversation className="flex flex-col">
      {(messages) => (
        <>
          <Canvas className="flex grow" nodes={parseMessagesToNodes(messages)} />
          <PromptInput onSubmit={() => {}} />
        </>
      )}
    </Conversation>
  );
}

// Example parser converting messages to canvas nodes
function parseMessagesToNodes(context: StickToBottomContext) {
  // If your context contains messages, extract them; otherwise, return an empty array or handle accordingly
  const messages = Array.isArray((context as any).messages) ? (context as any).messages : [];
  return messages.map((msg: any, i: number) => ({
    id: `${i}`,
    type: "default",
    position: { x: 10, y: i * 100 },
    data: { label: msg.content },
  }));
}
