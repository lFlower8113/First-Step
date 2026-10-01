export interface GuideAnchor {
  id: string;
  title: string; // 例如："点单收银台"
  position: [number, number, number]; // 3D 空间坐标
  cameraTarget: {
    position: [number, number, number]; // 推进特写时的机位
    lookAt: [number, number, number]; // 镜头焦距朝向
  };
  guideContent: {
    stepIndex: number;
    headline: string; // 例如："第一步：怎么像老客一样丝滑点单"
    actionItems: string[]; // 动线指南列表（人话，如：["如果排队，先想好喝冰的还是热的", "提前打开付款码，避免站在柜台前手忙脚乱"]）
    cheatSheet?: string; // 现成话术小抄："照着念：‘一杯冰拿铁，大杯，燕麦奶，少冰，打包谢谢’"
    emergencyHelp: string; // 兜底大实话："听不清叫号别干等着，直接拿着小票或者手机订单页去取餐台，递给做咖啡的人看一眼就行"
  };
}

export interface ScenarioConfig {
  id: string;
  name: string; // 例如："星巴克第一次点单"
  subtitle: string; // 例如："别慌，其实跟买奶茶差不多"
  modelUrl: string; // 细致建筑 GLB 模型路径（支持公共 CDN 或本地路径）
  initialCamera: {
    position: [number, number, number];
    target: [number, number, number];
  };
  anchors: GuideAnchor[];
  // 扩展展示属性
  category?: string;
  iconName?: string;
  tags?: string[];
  anxietyScore?: number; // 焦虑指数 (1-5)
  coverImage?: string;
  stats?: {
    avgTime: string;
    tipsCount: number;
    cheatSheetCount: number;
  };
}
