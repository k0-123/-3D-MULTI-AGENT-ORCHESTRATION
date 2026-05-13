import { createFileRoute } from "@tanstack/react-router";
import { DashboardOverlay } from "@/components/ui/DashboardOverlay";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "MCP · 3D Multi-Agent Orchestration" },
      { name: "description", content: "Voxel multi-agent orchestration platform with day/night learning cycle and per-agent MCP configuration." },
    ],
  }),
});

function Index() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#0b0e16]">
      <DashboardOverlay />
    </main>
  );
}
