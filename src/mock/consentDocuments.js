export const consentPatient = {
  name: '王晓梅',
  age: '28岁',
  gestationalAge: '32+4周',
  archiveNo: 'MY202606230001',
  phone: '13800000000',
  institution: '北京大学第一医院密云医院',
  idNo: '110************1234',
}

export const consentSceneOptions = ['产检告知', '高危告知', '住院告知', '治疗告知', '检查告知', '其他']

export const consentStatusOptions = [
  { label: '全部', value: '' },
  { label: '未归档', value: 'unarchived' },
  { label: '已归档', value: 'archived' },
  { label: '已作废', value: 'voided' },
]

export const consentStatusMeta = {
  unarchived: { label: '未归档', type: 'info' },
  archived: { label: '已归档', type: 'success' },
  voided: { label: '已作废', type: 'danger' },
}

export const defaultIllnessSummary =
  '患者目前孕周32+4周，既往产检提示存在妊娠期高血压风险，需进一步加强产检监测，关注血压、尿蛋白、胎动及胎儿发育情况。'

export const defaultRiskNotice =
  '已向孕妇及家属说明相关风险，包括血压升高、胎儿宫内窘迫、早产、病情进展需住院观察或进一步处理等可能情况。孕妇及家属已知晓相关风险及后续处理建议。'

export const defaultConfirmText =
  '本人已认真阅读以上内容，医生已就相关病情、风险及注意事项向本人进行说明，本人已知晓并确认。'

export function formatNow() {
  const date = new Date()
  const pad = (value) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function createConsentDraft(seed = {}) {
  const now = formatNow()
  return {
    id: seed.id || Date.now(),
    documentName: '知情同意告知书',
    scene: seed.scene || '高危告知',
    noticeTime: seed.noticeTime || now,
    createdAt: seed.createdAt || now,
    createdDoctor: seed.createdDoctor || '张医生',
    illnessSummary: seed.illnessSummary || defaultIllnessSummary,
    riskNotice: seed.riskNotice || defaultRiskNotice,
    signatureMode: seed.signatureMode || '本人或家属均可',
    confirmText: seed.confirmText || defaultConfirmText,
    signer: seed.signer || '',
    signerRole: seed.signerRole || '',
    relation: seed.relation || '',
    patientSignedAt: seed.patientSignedAt || '',
    patientSignature: seed.patientSignature || '',
    doctorSignedAt: seed.doctorSignedAt || '',
    doctorSignature: seed.doctorSignature || '',
    archivedAt: seed.archivedAt || '',
    printCount: seed.printCount || 0,
    voidReason: seed.voidReason || '',
    status: seed.status || 'unarchived',
  }
}

export function createMockConsentDocuments() {
  return [
    createConsentDraft({
      id: 1001,
      scene: '高危告知',
      createdAt: '2026-06-23 09:20',
      noticeTime: '2026-06-23 09:20',
      createdDoctor: '张医生',
      status: 'unarchived',
    }),
    createConsentDraft({
      id: 1002,
      scene: '产检告知',
      createdAt: '2026-06-23 10:10',
      noticeTime: '2026-06-23 10:10',
      createdDoctor: '李医生',
      status: 'unarchived',
    }),
    createConsentDraft({
      id: 1003,
      scene: '住院告知',
      createdAt: '2026-06-22 16:30',
      noticeTime: '2026-06-22 16:30',
      createdDoctor: '王医生',
      status: 'unarchived',
      signer: '王晓梅',
      signerRole: '孕妇本人',
      patientSignature: '王晓梅',
      patientSignedAt: '2026-06-22 16:45',
    }),
    createConsentDraft({
      id: 1004,
      scene: '检查告知',
      createdAt: '2026-06-20 14:12',
      noticeTime: '2026-06-20 14:12',
      createdDoctor: '张医生',
      status: 'archived',
      signer: '王晓梅',
      signerRole: '孕妇本人',
      patientSignature: '王晓梅',
      patientSignedAt: '2026-06-20 14:26',
      doctorSignature: '张医生',
      doctorSignedAt: '2026-06-20 14:30',
      archivedAt: '2026-06-20 14:35',
      printCount: 1,
    }),
  ]
}




