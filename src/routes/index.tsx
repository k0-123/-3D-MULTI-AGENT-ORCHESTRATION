import { createFileRoute } from "@tanstack/react-router";
import { Scene } from "@/components/Scene";
import { DashboardOverlay } from "@/components/DashboardOverlay";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "MCP · 3D Multi-Agent Orchestration" },
      { name: "description", content: "Voxel-style multi-agent orchestration platform with articulated Minecraft-like characters." },
    ],
  }),
});

function Index() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#0b0e16]">
      <Scene />
      <DashboardOverlay />
    </main>
  );
}
