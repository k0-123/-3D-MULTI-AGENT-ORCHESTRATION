import { useAgentStore } from "../store/useAgentStore";

export const isOpenDesignEnabled = () => {
  // We use the store's state directly
  return useAgentStore.getState().useOpenDesign;
};

export const toggleOpenDesign = () => {
  useAgentStore.getState().toggleOpenDesign();
};
