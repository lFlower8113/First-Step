import { ScenarioConfig } from "./types";

export const SCENARIOS: ScenarioConfig[] = [
  {
    id: "starbucks-first-order",
    name: "星巴克标准门店点单",
    subtitle: "实景动线与杯型避坑小抄，两分钟像老客一样自然点餐",
    modelUrl: "local",
    initialCamera: {
      position: [0, 7.5, 13.5],
      target: [0, 1.0, 0],
    },
    category: "餐饮服务",
    iconName: "Coffee",
    tags: ["杯型避坑", "付款码准备", "调味台自取"],
    coverImage: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
    stats: {
      avgTime: "2 分钟读完",
      tipsCount: 3,
      cheatSheetCount: 3,
    },
    anchors: [
      {
        id: "sb-entry",
        title: "① 入门观察区",
        position: [-3.8, 1.2, 1.6],
        cameraTarget: {
          position: [-2.6, 2.6, 5.4],
          lookAt: [-3.6, 0.9, 1.2],
        },
        guideContent: {
          stepIndex: 1,
          headline: "第一步：进门看清动线，排队时备好付款码",
          actionItems: [
            "推门进店先看一眼动线：左侧带双屏收银机的是点单区，右侧摆着意式咖啡机和托盘的是出餐区。",
            "排队的时候直接把微信或支付宝付款码调出来，避免站在收银台前手忙脚乱翻手机应用。",
            "抬头看头顶黑板菜单眼花？心中直接定好两个标准：要咖啡还是不含咖啡？要冰的还是热的？",
          ],
          cheatSheet: "如果店员问‘今天喝点什么’，直接说：‘我先看一下菜单，您稍等两秒哈’。",
          emergencyHelp: "店员每天接待数百位顾客，多看两秒菜单极其平常，按照自己的节奏来即可。",
        },
      },
      {
        id: "sb-counter",
        title: "② 点单收银台",
        position: [-0.8, 1.25, 0.4],
        cameraTarget: {
          position: [0.2, 2.5, 5.0],
          lookAt: [-0.8, 1.0, 0.2],
        },
        guideContent: {
          stepIndex: 2,
          headline: "第二步：破解杯型玄学，两句话丝滑搞定",
          actionItems: [
            "【杯型避坑】：星巴克的‘中杯(Tall)’实际是门店最小杯！平时喝奶茶习惯大杯的，务必点‘大杯(Grande)’或‘超大杯(Venti)’。",
            "常见问询应对：‘要加浓缩吗？’（答：不用，按默认来）、‘换燕麦奶吗？’（答：不用，普通牛奶就行）、‘有会员卡吗？’（答：没有，直接买单）。",
            "打印出的小票收好：上面印有杯标名字或取餐尾号，凭票在出餐台核对领餐。",
          ],
          cheatSheet: "万能点单公式，照着念：‘你好，一杯冰拿铁，大杯，就按标准配方做，打包带走，扫你付款码。’",
          emergencyHelp: "若店员询问没听懂的专业术语（如 Decaf、Blonde），直接回答：‘按你们最招牌的常规做法做就行，谢谢’。",
        },
      },
      {
        id: "sb-pickup",
        title: "③ 出餐与调味台",
        position: [3.6, 1.25, 0.6],
        cameraTarget: {
          position: [2.2, 2.5, 5.4],
          lookAt: [3.4, 1.0, 0.4],
        },
        guideContent: {
          stepIndex: 3,
          headline: "第三步：出餐台核验领餐，调味台配件免费自取",
          actionItems: [
            "点完单顺着柜台往右移步，在围栏另一侧的‘取餐台’等候，不要堵在收银机前。",
            "咖啡做好后咖啡师会呼叫小票尾号或饮品名称。若环境嘈杂没听清，直接拿小票递给咖啡师看一眼核对。",
            "拿到杯子后移步旁边的‘调味吧台’：纸巾、吸管、防烫杯套、肉桂粉、可可粉、黄白糖包全为免费自取。",
          ],
          cheatSheet: "需要协助时的大方沟通：‘你好，麻烦能帮我套一个杯套、拿根细吸管吗？谢谢！’",
          emergencyHelp: "长时间未叫到号无需干等，直接走到出餐台将小票或手机订单出示给咖啡师，他们会立刻为你查询饮品制作进度。",
        },
      },
    ],
  },
  {
    id: "hospital-first-visit",
    name: "三甲医院就医动线",
    subtitle: "从自助机取号、候诊报到至缴费取药的保姆级动线",
    modelUrl: "local",
    initialCamera: {
      position: [0, 8.2, 14.8],
      target: [0, 1.0, 0],
    },
    category: "医疗健康",
    iconName: "Activity",
    tags: ["自助机取号", "诊室报到", "线上医保缴费"],
    coverImage: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
    stats: {
      avgTime: "3 分钟读完",
      tipsCount: 3,
      cheatSheetCount: 2,
    },
    anchors: [
      {
        id: "hosp-kiosk",
        title: "① 自助机取号区",
        position: [-5.0, 1.2, 1.2],
        cameraTarget: {
          position: [-3.6, 2.6, 5.4],
          lookAt: [-4.8, 1.0, 0.8],
        },
        guideContent: {
          stepIndex: 1,
          headline: "第一步：在门诊大厅自助机刷医保码取号",
          actionItems: [
            "进入门诊大厅后先找一排排立式自助机。准备好医保电子凭证二维码或实体身份证放在感应区。",
            "点击【预约取号】打印挂号凭条。凭条上载明关键信息：科室诊区（如门诊3楼A区）、诊室号、排队序号。",
            "自助机旁常配有红马甲导医志愿者，操作不顺可直接求助指引。",
          ],
          cheatSheet: "求助问路话术：‘老师您好，我约了呼吸内科，请问这个诊区在几楼怎么走？’",
          emergencyHelp: "若机器提示‘未查到预约信息’，直接转至人工挂号窗口递交身份证处理。",
        },
      },
      {
        id: "hosp-waiting",
        title: "② 科室分诊台与候诊",
        position: [0.0, 1.2, -0.6],
        cameraTarget: {
          position: [0.6, 2.5, 4.8],
          lookAt: [-0.1, 1.0, -0.6],
        },
        guideContent: {
          stepIndex: 2,
          headline: "第二步：到达对应诊区先报到，留意叫号屏进诊室",
          actionItems: [
            "到达对应楼层后，必须先在护士分诊台的小机器上扫描挂号单条形码【报到】；未报到者叫号系统不会呼叫。",
            "报到后在候诊椅就座，注视诊区叫号屏，显示‘请某某某到X诊室’时方可推门进入。",
            "就诊前在手机备忘录整理三点：主要症状、持续天数、已服药物，提高沟通效率。",
          ],
          cheatSheet: "向医生陈述病情第一句话：‘医生您好，我从前天开始左下腹隐痛，伴随低烧，吃过一次布洛芬没完全退，想看下要不要做检查。’",
          emergencyHelp: "若不慎过号，告知分诊台护士重新刷码，通常顺延 2-3 位即可排入。",
        },
      },
      {
        id: "hosp-pharmacy",
        title: "③ 缴费与药房取药",
        position: [5.0, 1.2, 1.0],
        cameraTarget: {
          position: [3.4, 2.5, 5.4],
          lookAt: [4.8, 1.0, 0.6],
        },
        guideContent: {
          stepIndex: 3,
          headline: "第三步：手机线上完成医保结算，对应药房窗口取药",
          actionItems: [
            "医生开具处方后无需去人工窗口排队，通过医院公众号或小程序即可直接进行医保扣款结算。",
            "结算完成后，看药房上方大屏幕，找到自己名字对应的【X号发药窗口】候取。",
            "药师递药时会逐一核对姓名并交代服用频次与饭前饭后注意事项。",
          ],
          cheatSheet: "取药确认用法：‘请问这个药是饭前还是饭后吃？一次吃几粒？’",
          emergencyHelp: "检查科室位置代号若找不到，直接询问导医台或值班护士即可得到明确指引。",
        },
      },
    ],
  },
  {
    id: "airport-first-flight",
    name: "机场航站楼乘机流程",
    subtitle: "值机托运、安检通道与登机口寻径全流程指引",
    modelUrl: "local",
    initialCamera: {
      position: [0, 9.2, 16.5],
      target: [0, 1.0, 0],
    },
    category: "交通枢纽",
    iconName: "Plane",
    tags: ["提前2小时", "充电宝随身", "登机口核对"],
    coverImage: "https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=800&q=80",
    stats: {
      avgTime: "3 分钟读完",
      tipsCount: 3,
      cheatSheetCount: 2,
    },
    anchors: [
      {
        id: "air-checkin",
        title: "① 值机与托运岛",
        position: [-5.0, 1.2, 1.0],
        cameraTarget: {
          position: [-3.8, 2.8, 5.6],
          lookAt: [-4.8, 1.0, 0.6],
        },
        guideContent: {
          stepIndex: 1,
          headline: "第一步：看航显大屏确认值机岛，办理托运打印登机牌",
          actionItems: [
            "起飞前 2 小时抵达航站楼。抬头看中央航显大屏找到所乘航班号，屏幕最右侧标有对应值机岛字母（如 F 岛）。",
            "无托运行李者可在自助值机机打印纸质登机牌或使用手机电子登机牌；有大件行李者排队前往柜台办理托运。",
            "【行李关键规范】：充电宝、锂电池、笔记本电脑必须随身携带，严禁托运；单瓶液体超过 100ml 必须办理托运。",
          ],
          cheatSheet: "柜台托运选座沟通：‘你好，托运一件行李，麻烦帮我安排一个靠走道/靠窗的座位，谢谢。’",
          emergencyHelp: "距起飞不足 45 分钟时，立即寻找值机岛前端的【急客/晚到旅客快速通道】优先办理。",
        },
      },
      {
        id: "air-security",
        title: "② 安全检查通道",
        position: [0.0, 1.2, -0.6],
        cameraTarget: {
          position: [0.0, 2.0, 1.8],
          lookAt: [-0.1, 0.7, -0.6],
        },
        guideContent: {
          stepIndex: 2,
          headline: "第二步：提前取出电子设备与外套，平稳通过安检",
          actionItems: [
            "排队准备：出示身份证与登机牌，脱下厚外套、帽子置于塑料收纳筐中。",
            "从随身背包中主动取出笔记本电脑、iPad、充电宝、雨伞，单独放置于收纳筐通过 X 光机。",
            "随身携带的杯装饮料在安检前饮尽或丢弃，安检隔离区内配有免费饮水机与一次性纸杯。",
          ],
          cheatSheet: "人身安检姿势：双臂自然平举成一字型，根据安检员指引配合转身即可。",
          emergencyHelp: "充电宝标识磨损若被拦截，可选择在机场安检台暂存（一般为30天）或在现场寄快递发出。",
        },
      },
      {
        id: "air-gate",
        title: "③ 候机大厅与登机口",
        position: [5.2, 1.2, 0.8],
        cameraTarget: {
          position: [3.6, 2.6, 5.4],
          lookAt: [4.8, 1.0, 0.4],
        },
        guideContent: {
          stepIndex: 3,
          headline: "第三步：顺导向指示前往登机口，留意广播登机通知",
          actionItems: [
            "通过安检后，先顺着顶部蓝色导向标志找到对应的登机口（如 28 号），核对登机口显示屏是否为本机航班。",
            "通常起飞前半小时开始登机，起飞前 15 分钟关闭舱门。请合理规划免税店购物与洗手间时间。",
            "登机口偶有临时变更情况，听到机场广播呼叫所乘航班时，及时查看航显屏确认位置。",
          ],
          cheatSheet: "闸机刷码登机：将手机电子登机牌二维码调至最亮，对准闸机扫描口，听到提示音后推闸通行。",
          emergencyHelp: "如遇登机口临时变更为较远卫星厅，可招手乘坐隔离区内的电瓶摆渡车前往。",
        },
      },
    ],
  },
];
