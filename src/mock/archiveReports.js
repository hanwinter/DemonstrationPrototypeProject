import { createLabRows } from './labData'

const reportTemplates = [
  {
    id: 1,
    reportDate: '2026-06-11',
    reportName: '北京市密云区医院检验报告单',
    hospital: '北京市密云区医院',
    reportType: '检验报告',
    importedAt: '2026-06-11 10:36',
    status: '有效',
    rowOffset: 0,
  },
  {
    id: 2,
    reportDate: '2026-05-28',
    reportName: '血常规检验报告',
    hospital: '北京市通州区妇幼保健院',
    reportType: '检验报告',
    importedAt: '2026-05-28 15:18',
    status: '有效',
    rowOffset: 1,
  },
  {
    id: 3,
    reportDate: '2026-05-12',
    reportName: '肝肾功能检验报告',
    hospital: '首都医科大学附属北京妇产医院',
    reportType: '检验报告',
    importedAt: '2026-05-12 11:05',
    status: '有效',
    rowOffset: 2,
  },
  {
    id: 4,
    reportDate: '2026-04-22',
    reportName: '孕期血液检验报告',
    hospital: '北京大学人民医院',
    reportType: '检验报告',
    importedAt: '2026-04-22 09:42',
    status: '有效',
    rowOffset: 3,
  },
  {
    id: 5,
    reportDate: '2026-04-03',
    reportName: '外院血常规报告',
    hospital: '北京市朝阳区妇幼保健院',
    reportType: '检验报告',
    importedAt: '2026-04-03 16:20',
    status: '已作废',
    rowOffset: 4,
  },
]

function createReportRows(offset) {
  return createLabRows().slice(0, 12).map((row, index) => ({
    ...row,
    id: `${offset + 1}-${index + 1}`,
    result: index < 4
      ? String(Number(row.result || 0) + offset * 0.2).replace(/\.0$/, '')
      : row.result,
    status: '已匹配',
    source: index % 4 === 0 ? '人工选择' : '规则匹配',
  }))
}

export function createArchiveReports() {
  return reportTemplates.map(({ rowOffset, ...report }) => ({
    ...report,
    imageUrl: `${import.meta.env.BASE_URL}mock-lab-report.svg`,
    items: createReportRows(rowOffset),
  }))
}
