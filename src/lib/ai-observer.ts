import { UserTelemetry } from "./experience-store";

export interface AIObserverInsight {
  headline: string;
  reflection: string;
  hesitationTag: string;
  actionQuote: string;
}

export async function generateObserverInsight(telemetry: UserTelemetry): Promise<AIObserverInsight> {
  const { hesitationSeconds, hoverCount, stepSpeed } = telemetry;

  // Try server-side Gemini API route first if available
  try {
    const res = await fetch("/api/generate-reflection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(telemetry),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.reflection) {
        return data;
      }
    }
  } catch {
    // Fallback to local deterministic poetry engine
  }

  // High-craft fallback generator matching the document philosophy:
  // "针对用户的犹豫时长、观察路径给出克制、客观、有温度的观察记录（控制在40-80字，不做心理诊断）"
  if (stepSpeed === "swift") {
    return {
      headline: "操作利落",
      hesitationTag: `耗时 ${hesitationSeconds} 秒`,
      reflection: `你快速做出了选择并穿过光门，对新场景展现了良好的适应力。`,
      actionQuote: "陌生的环境只要实际走过一次，流程就会清晰明了。",
    };
  } else if (stepSpeed === "cautious") {
    return {
      headline: "稳步前行",
      hesitationTag: `观察用时 ${hesitationSeconds} 秒`,
      reflection: `你在进入前仔细观察了选项，随后顺利完成了通关。先观察再行动是应对陌生场景的好习惯。`,
      actionQuote: "保持自己的节奏，按步骤办理即可从容应对。",
    };
  } else {
    return {
      headline: "顺利通关",
      hesitationTag: `用时 ${hesitationSeconds} 秒`,
      reflection: `你已完成本次三维演练，提前走过了未知环节。`,
      actionQuote: "祝你在真实场景中顺畅从容。",
    };
  }
}
