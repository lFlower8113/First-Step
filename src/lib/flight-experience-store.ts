import { create } from "zustand";

export type FlightStage =
  | "intro"               // 首页：深黑背景，中央微光点与极简文案
  | "pre_safe"            // 安全前导：消除心理压力
  | "observe"             // 阶段1：环顾机场大厅，系统先展示
  | "guide_find_flight"   // 阶段2：示范光束，找到航班 FS001
  | "guide_path"          // 阶段3：地面光带，跟随光径至安检
  | "guide_security"      // 阶段4：安检托盘微互动（手机、背包、外套）
  | "boarding_gate"       // 阶段5：进入登机口，暖光泛起，回望光径
  | "reflection";         // 阶段6：AI 行为反馈见证卡

export interface FlightTelemetry {
  startTime: number;
  timeToFirstAction: number;
  hesitationSeconds: number;
  neededExtraGuidance: boolean;
  completedSteps: string[];
  trayItemsPut: string[];
}

export interface FlightReflectionData {
  title: string;
  observation: string;
  meaning: string;
  closingLine: string;
}

export type CharacterGender = "male" | "female";

interface FlightExperienceState {
  stage: FlightStage;
  character: CharacterGender | null;
  soundEnabled: boolean;
  telemetry: FlightTelemetry;
  flightState: {
    flightFound: boolean;
    pathFollowed: boolean;
    trayItems: string[];
    trayScanned: boolean;
    gatePassed: boolean;
  };
  reflection: FlightReflectionData | null;
  isAiGenerating: boolean;

  // Actions
  setCharacter: (gender: CharacterGender | null) => void;
  startExperience: () => void;
  confirmPreSafe: () => void;
  advanceToFindFlight: () => void;
  completeFindFlight: () => void;
  completeFollowPath: () => void;
  putItemInTray: (itemId: string) => void;
  completeSecurityScan: () => void;
  completeBoardingGate: () => void;
  setStage: (stage: FlightStage) => void;
  setReflection: (data: FlightReflectionData) => void;
  toggleSound: () => void;
  goToPrevStep: () => void;
  resetExperience: () => void;
}

export const useFlightExperienceStore = create<FlightExperienceState>((set, get) => ({
  stage: "intro",
  character: "male", // default or selectable

  soundEnabled: true,
  telemetry: {
    startTime: 0,
    timeToFirstAction: 0,
    hesitationSeconds: 0,
    neededExtraGuidance: false,
    completedSteps: [],
    trayItemsPut: [],
  },
  flightState: {
    flightFound: false,
    pathFollowed: false,
    trayItems: [],
    trayScanned: false,
    gatePassed: false,
  },
  reflection: null,
  isAiGenerating: false,

  setCharacter: (gender) => set({ character: gender }),

  startExperience: () => {
    set({
      stage: "pre_safe",
      telemetry: {
        startTime: Date.now(),
        timeToFirstAction: 0,
        hesitationSeconds: 0,
        neededExtraGuidance: false,
        completedSteps: [],
        trayItemsPut: [],
      },
      flightState: {
        flightFound: false,
        pathFollowed: false,
        trayItems: [],
        trayScanned: false,
        gatePassed: false,
      },
      reflection: null,
      isAiGenerating: false,
    });
  },

  confirmPreSafe: () => {
    set({
      stage: "observe",
    });
  },

  advanceToFindFlight: () => {
    const { telemetry } = get();
    set({
      stage: "guide_find_flight",
      telemetry: {
        ...telemetry,
        completedSteps: [...telemetry.completedSteps, "observe"],
      },
    });
  },

  completeFindFlight: () => {
    const { telemetry } = get();
    const elapsed = Math.max(1, (Date.now() - telemetry.startTime) / 1000);
    const hesitation = Number(elapsed.toFixed(1));

    set({
      flightState: {
        ...get().flightState,
        flightFound: true,
      },
      telemetry: {
        ...telemetry,
        timeToFirstAction: hesitation,
        hesitationSeconds: hesitation,
        neededExtraGuidance: hesitation > 8.0,
        completedSteps: [...telemetry.completedSteps, "find_flight"],
      },
    });
  },

  completeFollowPath: () => {
    const { telemetry } = get();
    set({
      stage: "guide_security",
      flightState: {
        ...get().flightState,
        pathFollowed: true,
      },
      telemetry: {
        ...telemetry,
        completedSteps: [...telemetry.completedSteps, "follow_path"],
      },
    });
  },

  putItemInTray: (itemId: string) => {
    const { flightState, telemetry } = get();
    if (flightState.trayItems.includes(itemId)) return;

    const nextItems = [...flightState.trayItems, itemId];
    set({
      flightState: {
        ...flightState,
        trayItems: nextItems,
      },
      telemetry: {
        ...telemetry,
        trayItemsPut: nextItems,
      },
    });
  },

  completeSecurityScan: () => {
    const { telemetry } = get();
    set({
      flightState: {
        ...get().flightState,
        trayScanned: true,
      },
      stage: "boarding_gate",
      telemetry: {
        ...telemetry,
        completedSteps: [...telemetry.completedSteps, "security_check"],
      },
    });
  },

  completeBoardingGate: () => {
    const { telemetry } = get();
    set({
      flightState: {
        ...get().flightState,
        gatePassed: true,
      },
      stage: "reflection",
      isAiGenerating: true,
      telemetry: {
        ...telemetry,
        completedSteps: [...telemetry.completedSteps, "boarding_gate"],
      },
    });
  },

  setStage: (stage) => set({ stage }),
  setReflection: (data) => set({ reflection: data, isAiGenerating: false }),
  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),

  goToPrevStep: () => {
    const { stage, flightState } = get();
    if (stage === "pre_safe") {
      set({ stage: "intro" });
    } else if (stage === "observe") {
      set({ stage: "pre_safe" });
    } else if (stage === "guide_find_flight") {
      set({
        stage: "observe",
        flightState: {
          ...flightState,
          flightFound: false,
        },
      });
    } else if (stage === "guide_path") {
      set({
        stage: "guide_find_flight",
        flightState: {
          ...flightState,
          flightFound: false,
        },
      });
    } else if (stage === "guide_security") {
      set({
        stage: "guide_path",
        flightState: {
          ...flightState,
          pathFollowed: false,
          trayScanned: false,
        },
      });
    } else if (stage === "boarding_gate") {
      set({
        stage: "guide_security",
        flightState: {
          ...flightState,
          trayScanned: false,
          gatePassed: false,
        },
      });
    } else if (stage === "reflection") {
      set({
        stage: "boarding_gate",
        isAiGenerating: false,
      });
    }
  },

  resetExperience: () => {
    set({
      stage: "intro",
      telemetry: {
        startTime: 0,
        timeToFirstAction: 0,
        hesitationSeconds: 0,
        neededExtraGuidance: false,
        completedSteps: [],
        trayItemsPut: [],
      },
      flightState: {
        flightFound: false,
        pathFollowed: false,
        trayItems: [],
        trayScanned: false,
        gatePassed: false,
      },
      reflection: null,
      isAiGenerating: false,
    });
  },
}));
