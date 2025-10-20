import type {
  DepartmentDetail,
  MedicineDetail,
  TreatmentDetail,
} from '../types'

export type FeedbackVariant = 'neutral' | 'success' | 'error'

export type TabKey = 'medicines' | 'treatments' | 'departments'

export const TAB_LABEL: Record<TabKey, string> = {
  medicines: '의약품',
  treatments: '치료법',
  departments: '진료과',
}

export type ModalType = 'medicine' | 'treatment' | 'department'

export const MODAL_LABEL: Record<ModalType, string> = {
  medicine: '의약품',
  treatment: '치료법',
  department: '진료과',
}

export type ModalState =
  | { type: 'medicine'; title: string; data: MedicineDetail | null }
  | { type: 'treatment'; title: string; data: TreatmentDetail | null }
  | { type: 'department'; title: string; data: DepartmentDetail | null }
  | null
