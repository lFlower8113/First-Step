import { create } from "zustand";

export type ExperienceStage = 
  | "intro"       // 凝视未知：空灵引言
  | "observe"     // 迷雾深处：自由观察，静默记录犹豫时长
  | "stepping"    // 迈出一步：运镜加速，穿门而过
  | "reveal"      // 迷雾散开：强光爆开，不确定性被打破
  | "reflection"; // 专属洞察：AI 行为观察者出具见证卡

export interface UserTelemetry {
  startTime: number;
  firstMoveTime: number | null;
  hesitationSeconds: number;
  hoverCount: number;
  stepSpeed: "cautious" | "steady" | "swift";
}

interface ExperienceState {
  stage: ExperienceStage;
  soundEnabled: boolean;
  telemetry: UserTelemetry;
  reflectionMessage: string;
  isAiGenerating: boolean;
  
  // Actions
  startExperience: () => void;
  recordPointerMove: () => void;
  recordDoorHover: () => void;
  triggerFirstStep: () => void;
  setStage: (stage: ExperienceStage) => void;
  setReflection: (text: string) => void;
  toggleSound: () => void;
  resetExperience: () => void;
}

export const useExperienceStore = create<ExperienceState>((set, get) => ({
  stage: "intro",
  soundEnabled: true,
  telemetry: {
    startTime: 0,
    firstMoveTime: null,
    hesitationSeconds: 0,
    hoverCount: 0,
    stepSpeed: "steady",
  },
  reflectionMessage: "",
  isAiGenerating: false,

  startExperience: () => {
    set({
      stage: "observe",
      telemetry: {
        startTime: Date.now(),
        firstMoveTime: null,
        hesitationSeconds: 0,
        hoverCount: 0,
        stepSpeed: "steady",
      },
      reflectionMessage: "",
    });
  },

  recordPointerMove: () => {
    const { telemetry } = get();
    if (telemetry.firstMoveTime === null && telemetry.startTime > 0) {
      set({
        telemetry: {
          ...telemetry,
          firstMoveTime: Date.now(),
        },
      });
    }
  },

  recordDoorHover: () => {
    const { telemetry } = get();
    set({
      telemetry: {
        ...telemetry,
        hoverCount: telemetry.hoverCount + 1,
      },
    });
  },

  triggerFirstStep: () => {
    const { telemetry, stage } = get();
    if (stage !== "observe") return;

    const now = Date.now();
    const elapsed = Math.max(1, (now - telemetry.startTime) / 1000);
    const hesitation = Number(elapsed.toFixed(1));

    let speed: "cautious" | "steady" | "swift" = "steady";
    if (hesitation > 6.5) speed = "cautious";
    else if (hesitation < 2.8) speed = "swift";

    set({
      stage: "stepping",
      telemetry: {
        ...telemetry,
        hesitationSeconds: hesitation,
        stepSpeed: speed,
      },
    });
  },

  setStage: (stage) => set({ stage }),
  setReflection: (text) => set({ reflectionMessage: text, isAiGenerating: false }),
  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),

  resetExperience: () => {
    set({
      stage: "intro",
      telemetry: {
        startTime: 0,
        firstMoveTime: null,
        hesitationSeconds: 0,
        hoverCount: 0,
        stepSpeed: "steady",
      },
      reflectionMessage: "",
      isAiGenerating: false,
    });
  },
}));
