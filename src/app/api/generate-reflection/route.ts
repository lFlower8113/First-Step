import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      scenario = "first_flight",
      hesitationSeconds = 4.5,
      timeToFirstAction = 4.5,
      completedSteps = ["find_flight", "follow_path", "security_check", "boarding_gate"],
      neededExtraGuidance = false,
      hoverCount = 0,
      stepSpeed = "steady",
    } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Deterministic high-craft fallback conforming to FIRST-STEP-MVP-产品方案.md
      return NextResponse.json({
        fallback: true,
        title: "首次乘机流程演练完成",
        observation: `已按顺序完成航班大屏核对、地面导流指引、安检过机与登机口到达全部流程。`,
        meaning: "实际出行流程与此一致，按照指引办理即可从容完成。",
        closingLine: "准备就绪，祝你旅途顺利！",
        // Legacy compat fields
        headline: "流程已通关",
        reflection: `已按顺序完成航班大屏核对、地面导流指引、安检过机与登机口到达全部流程。实际出行流程与此一致，按照指引办理即可从容完成。`,
        actionQuote: "准备就绪，祝你旅途顺利！",
      });
    }

    // Call Gemini REST API directly
    const prompt = scenario === "first_flight"
      ? `用户刚刚在一个3D模拟体验中完成了“第一次坐飞机”流程演练（包括查看航班FS001、跟随地面导引、安检放置随身物品、进入登机口）。
用户客观数据：
- 操作耗时：${timeToFirstAction || hesitationSeconds} 秒
- 完成步骤：${completedSteps.join(', ')}

请根据这些数据，写一段极简、客观、自然的通关总结，绝对不要说AI废话或大而无当的心灵鸡汤，语言要干脆利落。
严格输出JSON格式：
{
  "title": "4-6字简短标题，如：首次乘机通关完成",
  "observation": "客观完成情况（20-30字）",
  "meaning": "实用出行提示（20-30字）",
  "closingLine": "祝你旅途顺利！"
}`
      : `用户刚刚在3D空间中完成了一次场景心理脱敏演练。
数据：
- 用时：${hesitationSeconds} 秒
- 视角移动次数：${hoverCount} 次
- 节奏：${stepSpeed}

请输出一段极简、客观的演练总结，不要AI空话套话。
严格JSON格式：{"title": "演练顺利完成", "observation": "客观描述", "meaning": "实用建议", "closingLine": "祝你实际出行顺畅。", "headline": "顺利完成", "reflection": "总结内容", "actionQuote": "祝你旅途顺利！"}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" },
        }),
      }
    );

    if (!response.ok) {
      return NextResponse.json({
        fallback: true,
        title: "首次乘机流程演练完成",
        observation: `已按顺序完成航班大屏核对、地面导流指引、安检过机与登机口到达全部流程。`,
        meaning: "实际出行流程与此一致，按照指引办理即可从容完成。",
        closingLine: "准备就绪，祝你旅途顺利！",
        headline: "流程已通关",
        reflection: `已按顺序完成航班大屏核对、地面导流指引、安检过机与登机口到达全部流程。`,
        actionQuote: "准备就绪，祝你旅途顺利！",
      });
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (rawText) {
      const parsed = JSON.parse(rawText);
      return NextResponse.json({
        title: parsed.title || "首次乘机流程演练完成",
        observation: parsed.observation || `已按顺序完成航班大屏核对、地面导流指引、安检过机与登机口到达全部流程。`,
        meaning: parsed.meaning || "实际出行流程与此一致，按照指引办理即可从容完成。",
        closingLine: parsed.closingLine || "准备就绪，祝你旅途顺利！",
        headline: parsed.title || parsed.headline || "流程已通关",
        reflection: parsed.observation ? `${parsed.observation} ${parsed.meaning}` : parsed.reflection,
        actionQuote: parsed.closingLine || parsed.actionQuote || "准备就绪，祝你旅途顺利！",
        hesitationTag: `操作耗时 ${timeToFirstAction || hesitationSeconds} 秒`,
      });
    }

    return NextResponse.json({
      fallback: true,
      title: "首次乘机流程演练完成",
      observation: `已按顺序完成航班大屏核对、地面导流指引、安检过机与登机口到达全部流程。`,
      meaning: "实际出行流程与此一致，按照指引办理即可从容完成。",
      closingLine: "准备就绪，祝你旅途顺利！",
    });
  } catch {
    return NextResponse.json({
      fallback: true,
      title: "你没有等待确定",
      observation: "你在第一步前停留了一会儿，但没有等到所有不确定都消失，还是继续向前了。",
      meaning: "你需要的可能不是更多答案，而是一个足够小的开始。",
      closingLine: "这就是你的第一步。",
    });
  }
}
