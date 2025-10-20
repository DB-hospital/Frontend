import type { ReactNode } from 'react'
import styles from './SymptomDetail.module.css'
import type {
  DepartmentSummary,
  MedicineSummary,
  SymptomDetail as SymptomDetailType,
  TreatmentSummary,
} from '../../types'
import type { ModalType, TabKey } from '../../types/ui'
import { TAB_LABEL } from '../../types/ui'

interface SymptomDetailProps {
  detail: SymptomDetailType | null
  loading: boolean
  error: string
  emptyMessage: string
  activeTab: TabKey
  onTabChange: (tab: TabKey) => void
  onOpenModal: (type: ModalType, id: number, title: string) => void
}

export const SymptomDetail = ({
  detail,
  loading,
  error,
  emptyMessage,
  activeTab,
  onTabChange,
  onOpenModal,
}: SymptomDetailProps) => {
  if (loading) {
    return <div className={styles.placeholder}>상세 정보를 불러오는 중입니다...</div>
  }

  if (!detail) {
    return <div className={styles.placeholder}>{error || emptyMessage}</div>
  }

  const renderDetailList = <T extends { id: number }>(
    items: T[],
    renderItem: (item: T) => ReactNode,
  ) => {
    if (!items.length) {
      return <p className={styles.emptyMessage}>관련 정보가 없습니다.</p>
    }

    return <ul className={styles.detailList}>{items.map(renderItem)}</ul>
  }

  const tabPanels: Record<TabKey, ReactNode> = {
    medicines: renderDetailList(
      detail.medicines,
      (medicine: MedicineSummary) => (
        <li
          key={medicine.id}
          className={`${styles.detailCard} ${styles.actionable}`}
          role="button"
          tabIndex={0}
          aria-label={`${medicine.name} 상세 보기`}
          onClick={() => onOpenModal('medicine', medicine.id, medicine.name)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              onOpenModal('medicine', medicine.id, medicine.name)
            }
          }}
        >
          <h3>{medicine.name}</h3>
          <p className={styles.detailMetaLine}>
            제조사: <span>{medicine.manufacturer}</span>
          </p>
          <p>{medicine.efficacy}</p>
        </li>
      ),
    ),
    treatments: renderDetailList(
      detail.treatments,
      (treatment: TreatmentSummary) => (
        <li
          key={treatment.id}
          className={`${styles.detailCard} ${styles.actionable}`}
          role="button"
          tabIndex={0}
          aria-label={`${treatment.treatment} 상세 보기`}
          onClick={() =>
            onOpenModal('treatment', treatment.id, treatment.treatment)
          }
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              onOpenModal('treatment', treatment.id, treatment.treatment)
            }
          }}
        >
          <h3>{treatment.treatment}</h3>
          <p>{treatment.description}</p>
        </li>
      ),
    ),
    departments: renderDetailList(
      detail.departments,
      (department: DepartmentSummary) => (
        <li
          key={department.id}
          className={`${styles.detailCard} ${styles.actionable}`}
          role="button"
          tabIndex={0}
          aria-label={`${department.name} 상세 보기`}
          onClick={() =>
            onOpenModal('department', department.id, department.name)
          }
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              onOpenModal('department', department.id, department.name)
            }
          }}
        >
          <h3>{department.name}</h3>
        </li>
      ),
    ),
  }

  return (
    <article className={styles.detail}>
      <header className={styles.header}>
        <h2 className={styles.title}>증상 상세</h2>
        <p className={styles.description}>{detail.description}</p>
        <dl className={styles.meta}>
          <div>
            <dt>증상명</dt>
            <dd>{detail.symptom}</dd>
          </div>
          <div>
            <dt>관련 부위</dt>
            <dd>{detail.body_part}</dd>
          </div>
        </dl>
      </header>

      <div className={styles.tabs}>
        <div className={styles.tabButtons} role="tablist">
          {(Object.keys(TAB_LABEL) as TabKey[]).map((tabKey) => (
            <button
              key={tabKey}
              className={`${styles.tabButton} ${
                tabKey === activeTab ? styles.active : ''
              }`}
              type="button"
              role="tab"
              aria-selected={tabKey === activeTab}
              aria-controls={`${tabKey}-panel`}
              onClick={() => onTabChange(tabKey)}
            >
              {TAB_LABEL[tabKey]}
            </button>
          ))}
        </div>

        <div className={styles.tabPanels}>
          {(Object.keys(TAB_LABEL) as TabKey[]).map((tabKey) => (
            <section
              key={tabKey}
              id={`${tabKey}-panel`}
              role="tabpanel"
              className={`${styles.tabPanel} ${
                tabKey === activeTab ? '' : styles.hidden
              }`}
            >
              {tabPanels[tabKey]}
            </section>
          ))}
        </div>
      </div>
    </article>
  )
}
