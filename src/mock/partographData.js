export const patientInfo = {
  name: '张某某',
  age: 28,
  inpatientNo: 'ZY20260615001',
  bedNo: '产房03床',
  gestationalAge: '39+2周',
  gravidaPara: 'G2P1',
  fetalWeight: '3500g',
  fetalPosition: 'LOA',
  admissionTime: '2026-06-15 13:00',
  secondStageTime: '2026-06-15 20:00',
  ruptureTime: '2026-06-15 15:30',
}

export const normalRecords = [
  { id: 1, time: '2026-06-15 13:00', dilation: 3, station: -2, fetalHeart: 142, interval: 5, duration: 30, intensity: '弱', amnioticFluid: '未破', bloodPressure: '118/76', pulse: 82, temperature: 36.6, note: '规律宫缩，开始产程观察' },
  { id: 2, time: '2026-06-15 15:00', dilation: 4, station: -1, fetalHeart: 148, interval: 4, duration: 35, intensity: '中', amnioticFluid: '清', bloodPressure: '120/78', pulse: 84, temperature: 36.7, note: '人工破膜后羊水清' },
  { id: 3, time: '2026-06-15 17:00', dilation: 6, station: 0, fetalHeart: 150, interval: 3, duration: 40, intensity: '中', amnioticFluid: '清', bloodPressure: '122/80', pulse: 88, temperature: 36.8, note: '宫口扩张记录' },
  { id: 4, time: '2026-06-15 19:00', dilation: 8, station: 1, fetalHeart: 156, interval: 2, duration: 50, intensity: '强', amnioticFluid: '清', bloodPressure: '124/82', pulse: 92, temperature: 36.9, note: '宫缩增强' },
  { id: 5, time: '2026-06-15 20:00', dilation: 10, station: 2, fetalHeart: 158, interval: 2, duration: 55, intensity: '强', amnioticFluid: '清', bloodPressure: '126/82', pulse: 96, temperature: 37.0, note: '宫口开全，进入第二产程' },
]

export const abnormalRecords = [
  { id: 11, time: '2026-06-15 13:00', dilation: 3, station: -2, fetalHeart: 146, interval: 5, duration: 30, intensity: '弱', amnioticFluid: '未破', bloodPressure: '120/78', pulse: 84, temperature: 36.6, note: '开始观察' },
  { id: 12, time: '2026-06-15 15:00', dilation: 3, station: -2, fetalHeart: 152, interval: 4, duration: 35, intensity: '中', amnioticFluid: '清', bloodPressure: '122/80', pulse: 88, temperature: 36.8, note: '宫口无明显进展' },
  { id: 13, time: '2026-06-15 17:00', dilation: 4, station: -1, fetalHeart: 165, interval: 4, duration: 38, intensity: '中', amnioticFluid: 'Ⅰ度', bloodPressure: '128/84', pulse: 94, temperature: 37.1, note: '继续观察' },
  { id: 14, time: '2026-06-15 19:00', dilation: 4, station: -1, fetalHeart: 172, interval: 4, duration: 40, intensity: '强', amnioticFluid: 'Ⅱ度', bloodPressure: '132/86', pulse: 102, temperature: 37.3, note: '演示记录' },
]

export function cloneRecords(records) {
  return records.map((record) => ({ ...record }))
}
