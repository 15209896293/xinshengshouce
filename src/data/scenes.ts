// 少荃湖新生手册 · 内容数据层
// 基于内容架构v8_场景化.md 转换
// 改字只改本文件,不动代码

export type Status = 'confirmed' | 'partial' | 'pending'

export interface QA {
  id: string
  question: string
  answer: string
  status: Status
  warning?: string  // 避坑提醒
  image?: string    // 图片编号,如 '04'
  source?: string   // 原板块来源
  keywords?: string // 搜索关键词
}

export interface QAGroup {
  groupName: string
  items: QA[]
}

export interface Scene {
  id: string
  sceneNo: string
  title: string
  period: string    // 时间段
  subtitle: string
  color: string     // 场景色
  groups: QAGroup[]
}

// ============ 全局信息(首页/每页顶部) ============
export const globalInfo = {
  campus: '少荃湖新校区',
  campusNote: '仅适用少荃湖新校区,学林路老校区不适用',
  officialAddress: '安徽省合肥市新站高新区文忠路2299号',
  expressAddress: '安徽省合肥市瑶海区 魏武路与文忠路交叉口向北300米',
  expressAddressNote: '+ 你的楼栋号/宿舍号',
  reportDate: '以录取通知书为准(参考2025年9月8-9日)',
  semesterStart: '2026年9月5日',
  apps: [
    { name: '今日校园', use: '请假/二课/电费充值/校园卡' },
    { name: '校园e码通', use: '校园卡充值' },
    { name: '支付宝', use: '食堂付款' },
  ],
  // 报到当天任务(机制2-B,9/4-9/6显示)
  todayTasks: [
    { time: '到达', task: '先去体育馆报到登记,别先去寝室', warn: true },
    { time: '材料', task: '录取通知书(别撕报到证)+身份证+户口本复印件', warn: true },
    { time: '流程', task: '出示迎新系统二维码→辅导员扫码→领校园卡+钥匙' },
    { time: '晚上', task: '到宿舍第一件事:今日校园APP充空调电费', warn: true },
  ],
}

// ============ 5个场景 ============
export const scenes: Scene[] = [
  // 场景1·出发前
  {
    id: 'before',
    sceneNo: '01',
    title: '出发前',
    period: '8月底 - 9月4日',
    subtitle: '在家收拾行李、查路线、提前寄快递',
    color: '#1F3A5F', // 藏青
    groups: [
      {
        groupName: '必带证件',
        items: [
          { id: 'b1', question: '要带什么证件', answer: '录取通知书(含报到证别撕!)、身份证+户口本复印件、一寸/两寸证件照、团组织关系、银行卡(建行)或现金', status: 'confirmed', warning: '报到证别自己撕!开学要收的!', source: '清单', keywords: '证件 录取通知书 身份证' },
        ],
      },
      {
        groupName: '床品尺寸(关键避坑)',
        items: [
          { id: 'b2', question: '床垫买多大', answer: '买190×90cm。标准床200×100放不下床垫,必须买190×90', status: 'confirmed', warning: '别买标准200×100,放不下!', image: '05', source: '清单/宿舍', keywords: '床 床垫 床单 被套 尺寸' },
          { id: 'b3', question: '学校发被服吗', answer: '不发,自己带或到校买', status: 'confirmed', source: '清单' },
        ],
      },
      {
        groupName: '怎么去学校',
        items: [
          { id: 'b4', question: '地铁怎么坐', answer: '3号线幼儿师范站最近。合肥南站:4号线→窦桥湾换乘3号线→幼儿师范站,约33分钟', status: 'confirmed', source: '交通', keywords: '地铁 合肥站 合肥南站 换乘' },
          { id: 'b5', question: '打车多少钱', answer: '约30-50元,但新校区打车很慢,建议优先地铁', status: 'confirmed', warning: '新校区打车很慢,优先地铁!', source: '交通', keywords: '打车 出租车' },
          { id: 'b6', question: '合肥站出发怎么到', answer: '方案1:301路公交直达磨店(06:00-20:00,2元)。方案2:地铁1号线→方庙换乘3号线→幼儿师范站', status: 'partial', source: '交通', keywords: '合肥站 火车站' },
        ],
      },
      {
        groupName: '快递提前寄',
        items: [
          { id: 'b7', question: '快递地址怎么填', answer: '安徽省合肥市瑶海区 魏武路与文忠路交叉口向北300米 + 楼栋号', status: 'confirmed', warning: '报到用官方地址(文忠路2299号),快递用瑶海区地址', source: '快递', keywords: '快递 地址 邮编 收货' },
          { id: 'b8', question: '大件能提前寄吗', answer: '床帘床垫等可寄到学校快递站,开学再拿。开学时快递多,建议错峰', status: 'confirmed', source: '快递', keywords: '大件 床垫 床帘' },
        ],
      },
      {
        groupName: '出发前防骗',
        items: [
          { id: 'b9', question: '防骗核心原则', answer: '凡是让你先交钱的，都是骗子。不管对方说什么，只要提到转账、交费、保证金，马上挂断。', status: 'confirmed', source: '防骗', keywords: '防骗 骗子 交钱', warning: '核心原则：凡是先交钱的，都是骗子' },
          { id: 'b10', question: '学生会官方声明', answer: '各位同学好，有冒名说自己是学生会的进入新生寝室推销办卡的或在校门口推销的，一律不可信，学生会同学只做志愿服务工作且经过认真培训的，请提醒新生注意，谨防受骗上当。', status: 'confirmed', source: '防骗', keywords: '推销 学生会 办卡', warning: '学生会不推销任何东西！冒充学生会的推销一律不信' },
          { id: 'b11', question: '学长提醒', answer: '任何要你先交钱的都要警惕。不确定的直接问带班学长。', status: 'confirmed', source: '防骗', keywords: '防骗 提醒' },
        ],
      },
    ],
  },

  // 场景2·报到3天
  {
    id: 'arrive',
    sceneNo: '02',
    title: '报到3天',
    period: '9月5日 - 9月7日',
    subtitle: '到校通关,Day1-3办手续领物资',
    color: '#B5532A', // 红橙
    groups: [
      {
        groupName: 'Day1 办手续',
        items: [
          { id: 'a1', question: '到了先去哪', answer: '体育馆报到登记(2025方案,2026以通知为准)', status: 'confirmed', warning: '别先去寝室!先去体育馆报到,流程走完再去', image: '01', source: '报到', keywords: '报到 体育馆 先去' },
          { id: 'a2', question: '报到流程', answer: '出示迎新系统二维码→辅导员扫码→核对信息→领校园卡+宿舍钥匙', status: 'confirmed', source: '报到', keywords: '流程 二维码 辅导员' },
          { id: 'a3', question: '要办银行卡吗', answer: '当天人太多,建议去外面建行网点', status: 'confirmed', warning: '别在校内办银行卡,排队浪费时间', source: '报到', keywords: '银行卡 建行' },
          { id: 'a4', question: '学费怎么交', answer: '辅导员会发通知,等通知即可', status: 'confirmed', source: '报到', keywords: '学费 缴费' },
        ],
      },
      {
        groupName: 'Day2 领物资',
        items: [
          { id: 'a5', question: '领什么', answer: '校园卡、寝室钥匙', status: 'confirmed', source: '报到' },
          { id: 'a6', question: '军训服怎么领', answer: '带班统一带队去领,需要试穿', status: 'confirmed', warning: '短袖两件可换洗,外套只有一件,注意清洗时间', image: '02', source: '报到', keywords: '军训服' },
        ],
      },
      {
        groupName: 'Day3 开始军训',
        items: [
          { id: 'a7', question: '军训什么时候开始', answer: '一般开学第2-3天,具体等通知', status: 'confirmed', source: '报到' },
          { id: 'a8', question: '身体不行能免训吗', answer: '需三甲医院证明,私聊辅导员', status: 'confirmed', warning: '不舒服一定要请假,别硬撑', source: '报到', keywords: '免训 请假' },
        ],
      },
      {
        groupName: '家长停车',
        items: [
          { id: 'a9', question: '家长车停哪', answer: '濉河路(文忠路至童亭路段)南北两侧 / 童亭路(梅冲湖路至濉河路段)东西两侧 / 学林路(文忠路至蔡伦路段)南北两侧 / 浓南路(文忠路至蔡伦路段)南北两侧', status: 'confirmed', image: '03', source: '报到', keywords: '停车 家长 车' },
        ],
      },
      {
        groupName: '进出校门',
        items: [
          { id: 'a10', question: '从哪个门进(报到当天)', answer: '南门(濉河路)、西门(童亭路)都开,建议走南门', status: 'confirmed', warning: '报到当天走南门,日常走北门南门,西门东门一般不开', source: '报到', keywords: '门 南门 西门 进校' },
          { id: 'a11', question: '进出怎么进', answer: '扫脸。前几天可能不扫,后面统一人像采集', status: 'confirmed', source: '报到', keywords: '扫脸 人像' },
        ],
      },
    ],
  },

  // 场景3·安顿下来
  {
    id: 'settle',
    sceneNo: '03',
    title: '安顿下来',
    period: '9月6日 - 9月8日',
    subtitle: '第一周安顿宿舍、搞定吃饭、办校园卡',
    color: '#8B6F47', // 暖棕
    groups: [
      {
        groupName: '宿舍配置',
        items: [
          { id: 's1', question: '几人间', answer: '4人间,上床下桌', status: 'confirmed', image: '04', source: '宿舍' },
          { id: 's2', question: '有空调吗', answer: '有,电费自费', status: 'confirmed', warning: '到校第一天就充电费!不然空调用不了', source: '宿舍', keywords: '空调 电费' },
          { id: 's3', question: '床多大', answer: '标准200×100,建议买190×90床垫', status: 'confirmed', image: '05', source: '宿舍', keywords: '床 床垫 尺寸' },
          { id: 's4', question: '卫生间什么样', answer: '只有马桶,洗澡去公共浴室(楼道尽头)', status: 'confirmed', image: '06', source: '宿舍' },
          { id: 's5', question: '寝室有问题找谁', answer: '每栋楼1楼大厅有宿管,直接找', status: 'confirmed', source: '宿舍', keywords: '宿管' },
        ],
      },
      {
        groupName: '水电(关键避坑)',
        items: [
          { id: 's6', question: '电费怎么充', answer: '今日校园APP→一卡通→电费', status: 'confirmed', warning: '第一天就充,不充用不了空调!', source: '宿舍', keywords: '电费 充值 空调' },
          { id: 's7', question: '限电多少', answer: '全寝总功率500W', status: 'confirmed', warning: '大功率电器不能用!吹风机别带>500W的', source: '宿舍', keywords: '限电 功率 吹风机' },
          { id: 's8', question: '违禁电器有哪些', answer: '热得快/电饭锅/电磁炉/电水壶/电吹风/电热毯/小太阳/暖手宝/直板夹/烘干机', status: 'confirmed', source: '宿舍', keywords: '违禁 电器' },
          { id: 's9', question: '热水几点供应', answer: '24小时,打水刷卡', status: 'confirmed', source: '宿舍', keywords: '热水' },
        ],
      },
      {
        groupName: '作息',
        items: [
          { id: 's10', question: '门禁几点', answer: '23:00', status: 'confirmed', warning: '建议10:50前回,扫脸排队要时间。不归寝属于违纪!', source: '宿舍', keywords: '门禁 熄灯 几点' },
          { id: 's11', question: '查寝吗', answer: '没人查寝,寝室不断电', status: 'confirmed', source: '宿舍' },
        ],
      },
      {
        groupName: '公共设施',
        items: [
          { id: 's12', question: '洗衣机在哪', answer: '浴室里,刷一卡通,3元/次', status: 'confirmed', warning: '不要洗内衣袜子!', image: '08', source: '宿舍', keywords: '洗衣机' },
          { id: 's13', question: '饮水机在哪', answer: '浴室里,刷校园卡,只有热水', status: 'confirmed', image: '09', source: '宿舍', keywords: '饮水机 热水' },
        ],
      },
      {
        groupName: '校园卡',
        items: [
          { id: 's14', question: '校园卡怎么充值', answer: '建行卡→生活缴费程序 / 校园e码通', status: 'confirmed', source: '手续', keywords: '校园卡 充值 建行' },
          { id: 's15', question: '没发卡前怎么吃饭', answer: '支付宝也能刷食堂', status: 'confirmed', source: '手续', keywords: '食堂 支付宝' },
        ],
      },
      {
        groupName: '吃喝',
        items: [
          { id: 's16', question: '食堂怎么付款', answer: '支付宝/校园卡(需提前充值),只开一楼', status: 'confirmed', source: '吃喝', keywords: '食堂 付款 支付宝' },
          { id: 's17', question: '校内超市在哪', answer: '两个:①南一东北角 ②食堂西南角', status: 'confirmed', source: '吃喝', keywords: '超市' },
          { id: 's18', question: '外卖放哪', answer: '北门有外卖柜,南门放门卫室', status: 'confirmed', source: '吃喝', keywords: '外卖' },
        ],
      },
      {
        groupName: '快递取件',
        items: [
          { id: 's19', question: '快递在哪取', answer: '菜鸟驿站：食堂西侧超市北侧，24小时扫码即可进入', status: 'confirmed', image: '20', source: '快递', keywords: '快递 菜鸟 驿站' },
          { id: 's20', question: '取件流程（3步）', answer: '① 扫墙上二维码 → ② 拿到取件码 → ③ 取件码和快递码一起出库', status: 'confirmed', image: '21', source: '快递', keywords: '取件 流程', warning: '开学时快递站东西特别多，建议错峰寄送' },
        ],
      },
    ],
  },

  // 场景4·军训两周
  {
    id: 'military',
    sceneNo: '04',
    title: '军训两周',
    period: '9月8日 - 国庆节前',
    subtitle: '防晒、鞋垫、请假流程全攻略',
    color: '#4A5D3A', // 军绿
    groups: [
      {
        groupName: '基本信息',
        items: [
          { id: 'm1', question: '军训多长', answer: '开学第三天到国庆节前', status: 'confirmed', source: '军训' },
          { id: 'm2', question: '军训服有什么', answer: '短袖两件+外套一件+腰带,全程穿军训服', status: 'confirmed', warning: '外套只有一件,注意清洗时间防第二天没干!', image: '11', source: '军训', keywords: '军训服' },
          { id: 'm3', question: '被子要叠吗', answer: '学校不要求叠被子', status: 'confirmed', source: '军训' },
        ],
      },
      {
        groupName: '必带物品',
        items: [
          { id: 'm4', question: '要防晒吗', answer: 'SPF50+,每2小时补涂', status: 'confirmed', warning: '一定要涂防晒!合肥9月紫外线很强', source: '军训', keywords: '防晒' },
          { id: 'm5', question: '还要带什么', answer: '厚底运动袜+软鞋垫+大容量水壶+藿香正气水+小毛巾+别针+雨衣+速干T恤', status: 'confirmed', source: '军训', keywords: '鞋垫 水壶 雨衣' },
        ],
      },
      {
        groupName: '请假免训',
        items: [
          { id: 'm6', question: '不舒服能请假吗', answer: '一定要请假,别硬撑', status: 'confirmed', warning: '不舒服一定要请假!', source: '军训', keywords: '请假' },
          { id: 'm7', question: '能免训吗', answer: '三甲医院证明,私聊辅导员', status: 'confirmed', source: '军训', keywords: '免训' },
        ],
      },
    ],
  },

  // 场景5·在校日常
  {
    id: 'daily',
    sceneNo: '05',
    title: '在校日常',
    period: '国庆后 - 三年',
    subtitle: '办事、上网、日常出行、防骗案例',
    color: '#6B4E7E', // 紫
    groups: [
      {
        groupName: '校园卡补办',
        items: [
          { id: 'd1', question: '校园卡丢了怎么办', answer: '信息楼514补办,带身份证或学生证,8元', status: 'confirmed', warning: '514具体位置待补充(用户附图)', image: '22', source: '手续', keywords: '补办 丢卡 514' },
          { id: 'd2', question: '补卡时间', answer: '周一三五新校区/周二四老校区,上午8:50-11:20/下午14:30-16:30', status: 'confirmed', source: '手续', keywords: '补卡 时间' },
          { id: 'd3', question: '密码忘了', answer: '今日校园APP→一卡通→卡片挂失/修改密码', status: 'confirmed', source: '手续', keywords: '密码 挂失' },
        ],
      },
      {
        groupName: '校园网',
        items: [
          { id: 'd4', question: '校园有WiFi吗', answer: '新校区没有免费校园网/WiFi', status: 'confirmed', source: '手续', keywords: 'wifi 校园网' },
          { id: 'd5', question: '怎么上网', answer: '找学长办校园卡或自己网上办,39元/月送100话费', status: 'confirmed', source: '手续', keywords: '上网 流量 套餐' },
        ],
      },
      {
        groupName: '校医院',
        items: [
          { id: 'd6', question: '校医院在哪', answer: '北2楼1楼,能看病买药', status: 'confirmed', source: '手续', keywords: '校医院 看病' },
          { id: 'd7', question: '请假怎么请', answer: '今日校园APP发起审批,超三天需系部审批,在外过夜填离校信息', status: 'confirmed', image: '23', source: '手续', keywords: '请假' },
        ],
      },
      {
        groupName: '第二课堂',
        items: [
          { id: 'd8', question: '二课是什么', answer: '今日校园APP里,参加学生活动用', status: 'confirmed', source: '手续', keywords: '二课' },
          { id: 'd9', question: '要修多少学分', answer: '三年6个学分,要修满对应板块', status: 'confirmed', warning: '失约纳入黑名单!一定要按时参加', image: '24', source: '手续', keywords: '二课 学分' },
        ],
      },
      {
        groupName: '建行卡',
        items: [
          { id: 'd10', question: '必须办建行卡吗', answer: '后续学校事项都用建行卡,建议去外面建行网点办', status: 'confirmed', source: '手续', keywords: '建行卡' },
        ],
      },
      {
        groupName: '防骗案例',
        items: [
          { id: 'd11', question: '常见骗局', answer: '骗局1：冒充学生会推销办卡 —— 学生会不推销任何东西。更多骗局案例待补充。', status: 'partial', source: '防骗', keywords: '骗局 推销', warning: '记住核心原则：凡是先交钱的，都是骗子' },
        ],
      },
    ],
  },
]

// ============ 搜索索引(自动从scenes生成) ============
export interface SearchItem {
  id: string
  question: string
  answer: string
  scene: string
  sceneId: string
  keywords?: string
}

export const searchIndex: SearchItem[] = scenes.flatMap(scene =>
  scene.groups.flatMap(group =>
    group.items.map(item => ({
      id: item.id,
      question: item.question,
      answer: item.answer,
      scene: scene.title,
      sceneId: scene.id,
      keywords: item.keywords,
    }))
  )
)
