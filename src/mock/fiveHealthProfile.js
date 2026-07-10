export const fiveHealthStudent = {
  name: '张子涵', gender: '女', age: 12, ageMonths: 3, studentNo: '2026010236',
  fatherName: '张建国', fatherPhone: '138****5621', motherName: '李静', motherPhone: '136****2389',
  school: '密云区实验小学', grade: '六年级', className: '2班', examDate: '2026-06-30',
}

export const fiveHealthAbnormalities = [
  { id: 1, name: '左眼视力下降', resultLabel: '左眼视力', value: '0.6', reference: '>= 1.0', severity: 'moderate', organ: 'eye', category: '视力健康', advice: '减少连续近距离用眼，每用眼30分钟远眺休息。', parentAdvice: '孩子左眼视力低于正常范围，建议控制电子产品使用时间并及时复查。', referral: '眼科' },
  { id: 2, name: '脊柱侧弯倾向', resultLabel: '脊柱侧弯角度', value: '12°', reference: '< 10°', severity: 'high', organ: 'spine', category: '脊柱健康', advice: '建议进行脊柱专科评估，复查站立位全脊柱影像。', parentAdvice: '检查发现孩子脊柱有侧弯倾向，建议尽快到专科进一步检查。', referral: '骨科' },
  { id: 3, name: 'BMI偏高', resultLabel: 'BMI', value: '23.5', reference: '14.0-18.9', severity: 'low', organ: 'body', category: '体重健康', advice: '调整膳食结构，保证每日中高强度活动不少于60分钟。', parentAdvice: '孩子目前体重偏高，建议从饮食和日常运动两方面进行调整。', referral: '营养科' },
]

export const fiveHealthReports = [
  { id: 'R20260630', date: '2026-06-30', abnormalCount: 3, highRiskCount: 1, assessment: '需关注', doctor: '校医 王医生' },
  { id: 'R20250628', date: '2025-06-28', abnormalCount: 2, highRiskCount: 0, assessment: '轻度异常', doctor: '校医 王医生' },
  { id: 'R20240627', date: '2024-06-27', abnormalCount: 1, highRiskCount: 0, assessment: '基本正常', doctor: '校医 李医生' },
  { id: 'R20230625', date: '2023-06-25', abnormalCount: 1, highRiskCount: 0, assessment: '基本正常', doctor: '校医 李医生' },
]

export const fiveHealthTrends = [
  { id: 'bmi', title: 'BMI趋势', unit: '', current: '23.5', description: '较去年上升 1.3，已高于推荐范围。', values: [17.8, 18.6, 22.2, 23.5], labels: ['2023', '2024', '2025', '2026'], color: '#34C759' },
  { id: 'vision', title: '视力趋势', unit: '', current: '0.6', description: '左眼视力连续两年下降，建议复查。', values: [1.0, 0.9, 0.8, 0.6], labels: ['2023', '2024', '2025', '2026'], color: '#5AC8FA' },
  { id: 'spine', title: '脊柱趋势', unit: '°', current: '12°', description: '侧弯角度超过参考阈值，需要专科评估。', values: [3, 5, 8, 12], labels: ['2023', '2024', '2025', '2026'], color: '#FF9F0A' },
]

export const fiveHealthActions = [
  '编辑报告', '重新生成', '打印报告', '导出PDF', '发送家长', '生成复筛任务', '生成随访任务',
]


export const fiveHealthManagement = {
  healthTags: ['近视风险', '肥胖风险', '脊柱侧弯风险'],
  operationTags: ['重点关注儿童', '待复筛', '待随访', '家长未查看报告'],
  followUps: [
    { date: '2026-07-05', type: '医生电话随访', status: '完成', note: '建议控制电子产品使用时间' },
    { date: '2026-07-12', type: '校医运动指导', status: '待跟进', note: '记录每日中高强度活动时长' },
  ],
  revisits: [
    { date: '2026-07-10', type: '骨科复诊', status: '已完成', note: '诊断：轻度脊柱侧弯' },
    { date: '2026-07-18', type: '眼科复查', status: '待预约', note: '复查左眼裸眼视力' },
  ],
}
