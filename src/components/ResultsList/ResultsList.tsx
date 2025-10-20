import type { KeyboardEvent } from 'react'
import styles from './ResultsList.module.css'
import type { SymptomSummary } from '../../types'

interface ResultsListProps {
  results: SymptomSummary[]
  loading: boolean
  selectedId: number | null
  onSelect: (symptom: SymptomSummary) => void
}

export const ResultsList = ({
  results,
  loading,
  selectedId,
  onSelect,
}: ResultsListProps) => {
  const handleKeyDown = (
    event: KeyboardEvent<HTMLLIElement>,
    symptom: SymptomSummary,
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelect(symptom)
    }
  }

  return (
    <div>
      <div className={styles.header}>
        <h2 className={styles.title}>검색 결과</h2>
        {loading && <span className={styles.loading}>검색 중...</span>}
      </div>
      {results.length === 0 && !loading ? (
        <p className={styles.empty}>검색 결과가 여기에 표시됩니다.</p>
      ) : (
        <ul className={styles.list}>
          {results.map((symptom) => (
            <li
              key={symptom.id}
              role="button"
              tabIndex={0}
              className={`${styles.item} ${
                symptom.id === selectedId ? styles.active : ''
              }`}
              onClick={() => onSelect(symptom)}
              onKeyDown={(event) => handleKeyDown(event, symptom)}
            >
              <strong className={styles.itemTitle}>{symptom.symptom}</strong>
              <p className={styles.itemDescription}>{symptom.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
