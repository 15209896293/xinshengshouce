// 物品清单数据 — 来自树状架构图_v3.docx G节

export interface PackingItem {
  id: string
  text: string
  warning?: boolean
  note?: string
}

export interface PackingCategory {
  categoryName: string
  icon: string // 图标文字
  items: PackingItem[]
}

export const packingCategories: PackingCategory[] = [
  {
    categoryName: '证件类',
    icon: '📋',
    items: [
      { id: 'p001', text: '录取通知书（含报到证，别撕！）', warning: true, note: '报到证开学要收' },
      { id: 'p002', text: '身份证 + 户口本复印件' },
      { id: 'p003', text: '一寸/两寸证件照（多带几张）' },
      { id: 'p004', text: '团组织关系（团员要确认转入）' },
      { id: 'p005', text: '银行卡（建行）或现金' },
    ],
  },
  {
    categoryName: '床上用品',
    icon: '🛏',
    items: [
      { id: 'p006', text: '床垫 190×90cm', warning: true, note: '别买标准200×100，放不下' },
      { id: 'p007', text: '床单/被套 190×90cm' },
      { id: 'p008', text: '枕头' },
      { id: 'p009', text: '蚊帐/凉席' },
      { id: 'p010', text: '学校不发被服，自己带或到校买' },
    ],
  },
  {
    categoryName: '军训专用',
    icon: '🎖',
    items: [
      { id: 'p011', text: 'SPF50+ 防晒霜', warning: true, note: '每2小时补涂，合肥9月紫外线很强' },
      { id: 'p012', text: '厚底运动袜（多双）' },
      { id: 'p013', text: '软运动鞋垫', note: '军训鞋底硬' },
      { id: 'p014', text: '大容量水壶', note: '补水补电解质' },
      { id: 'p015', text: '藿香正气水/清凉油', note: '防中暑' },
      { id: 'p016', text: '雨衣', note: '比伞方便，9月有雷阵雨' },
      { id: 'p017', text: '小毛巾 + 别针', note: '军装改尺寸' },
      { id: 'p018', text: '速干/纯棉内搭T恤', note: '军训服厚透气差，每天换洗' },
    ],
  },
  {
    categoryName: '生活用品',
    icon: '🧴',
    items: [
      { id: 'p019', text: '洗漱用品、毛巾、拖鞋' },
      { id: 'p020', text: '衣架、盆、桶' },
      { id: 'p021', text: '充电器 + 数据线' },
      { id: 'p022', text: '排插', note: '全寝限电500W，别同时开太多电器' },
      { id: 'p023', text: '锁（锁柜子用）' },
      { id: 'p024', text: '晒衣架/夹子' },
    ],
  },
]

// 四季穿衣
export const seasonalClothing = [
  { season: '9月', temp: '30-33°C', wear: '夏装 + 薄外套' },
  { season: '10-11月', temp: '降温', wear: '长袖、薄卫衣、秋外套' },
  { season: '12-2月', temp: '湿冷', wear: '厚羽绒服、保暖内衣（合肥没暖气）' },
]

// 不用带的
export const dontBring = [
  '锅碗瓢盆（违规电器）',
  '大功率电器（吹风机 > 500W、热得快等）',
  '电饭锅、电磁炉、电水壶',
  '电热毯、小太阳、暖手宝',
]

// 到校再买
export const buyAfterArrival = [
  '拖把、扫把、垃圾桶等大件',
  '洗衣液等重物',
  '盆、桶等占地方的',
]
