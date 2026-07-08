// 学长个人信息 — 数据层
// 学长填好后改 available 为 true，新生即可看到

export interface SeniorInfo {
  name: string
  grade: string
  major: string
  school: string
  campus: string
  intro: string
  contacts: {
    wechat: { id: string; available: boolean }
    qq: { id: string; available: boolean }
    phone: { number: string; available: boolean }
  }
}

export const seniorInfo: SeniorInfo = {
  name: '学长',
  grade: '2025级',
  major: '大数据技术专业',
  school: '合肥幼儿师范高等专科学校',
  campus: '少荃湖校区',
  intro: '当年我新生报到时也迷茫过——不知道该带什么、下了车往哪走、电费怎么充。后来发现每个新生都在问同样的问题。所以用AI做了这个手册，让你少走弯路。',
  contacts: {
    wechat: { id: '待填写', available: false },
    qq: { id: '待填写', available: false },
    phone: { number: '待填写', available: false },
  },
}
