import { create } from "zustand";

interface AppState {
  currentScenarioId: string;
  selectedAnchorId: string | null;
  isDrawerOpen: boolean;
  isCameraMoving: boolean;
  viewMode: "hall" | "3d";
  soundEnabled: boolean;
  activeStep: number;
  
  // Actions
  selectScenario: (id: string) => void;
  selectAnchor: (id: string | null) => void;
  setDrawerOpen: (open: boolean) => void;
  setCameraMoving: (moving: boolean) => void;
  setViewMode: (mode: "hall" | "3d") => void;
  toggleSound: () => void;
  setActiveStep: (step: number) => void;
  resetView: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentScenarioId: "starbucks-first-order",
  selectedAnchorId: null,
  isDrawerOpen: false,
  isCameraMoving: false,
  viewMode: "hall",
  soundEnabled: true,
  activeStep: 0,

  selectScenario: (id) =>
    set({
      currentScenarioId: id,
      selectedAnchorId: null,
      isDrawerOpen: false,
      activeStep: 0,
      viewMode: "3d",
    }),

  selectAnchor: (id) =>
    set({
      selectedAnchorId: id,
      isDrawerOpen: id !== null,
    }),

  setDrawerOpen: (open) =>
    set((state) => ({
      isDrawerOpen: open,
      selectedAnchorId: open ? state.selectedAnchorId : null,
    })),

  setCameraMoving: (moving) => set({ isCameraMoving: moving }),

  setViewMode: (mode) =>
    set({
      viewMode: mode,
      selectedAnchorId: null,
      isDrawerOpen: false,
    }),

  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),

  setActiveStep: (step) => set({ activeStep: step }),

  resetView: () =>
    set({
      selectedAnchorId: null,
      isDrawerOpen: false,
      isCameraMoving: false,
    }),
}));
