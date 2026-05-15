import { Vec3 } from "../types/agent";

export const WORKSTATIONS: Vec3[] = [
  [-10, 0, -8],
  [-12, 0, 4],
  [-6, 0, 10],
  [10, 0, -8],
  [12, 0, 4],
  [6, 0, 10],
  [0, 0, 12],
  [0, 0, -12],
];

export const DATA_HUB: Vec3 = [0, 0, 0];

export const HUB_RING: Vec3[] = [
  [-3, 0, -3],
  [3, 0, -3],
  [-4, 0, 0],
  [4, 0, 0],
  [-3, 0, 3],
  [3, 0, 3],
  [0, 0, 4.5],
  [0, 0, -4.5],
];

export const BASE_AGENTS = [
  { id: "ceo", name: "Karan", role: "CEO", color: "#f5c542" },
  { id: "senior", name: "Senior Builder", role: "Full Stack", color: "#42a5f5" },
  { id: "intern", name: "Intern Builder", role: "Full Stack", color: "#80deea" },
  { id: "offer", name: "Offer Architect", role: "Strategy", color: "#ab47bc" },
  { id: "growth", name: "Growth Hacker", role: "Growth", color: "#ef5350" },
  { id: "funnel", name: "Funnel Engineer", role: "Funnel", color: "#66bb6a" },
  { id: "designer", name: "Visual Designer", role: "Design", color: "#ec4899" },
  { id: "deck_master", name: "Deck Master", role: "Presentation", color: "#f97316" },
];

export const AGENT_IDS = BASE_AGENTS.map(a => a.id);
