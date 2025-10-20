import type { FormEvent } from 'react'
import styles from './SearchSection.module.css'
import type { FeedbackVariant } from '../../types/ui'

interface SearchSectionProps {
  searchTerm: string
  onSearchTermChange: (value: string) => void
  onSubmit: () => void
  loading: boolean
  feedbackMessage: string
  feedbackVariant: FeedbackVariant
}

export const SearchSection = ({
  searchTerm,
  onSearchTermChange,
  onSubmit,
  loading,
  feedbackMessage,
  feedbackVariant,
}: SearchSectionProps) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit()
  }

  return (
    <header className={styles.container}>
      <h1 className={styles.title}>증상 기반 의료 정보 검색</h1>
      <form
        className={styles.form}
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <input
          type="search"
          name="symptom"
          placeholder="증상을 입력하세요"
          maxLength={20}
          required
          value={searchTerm}
          onChange={(event) => onSearchTermChange(event.target.value)}
          aria-label="증상 검색"
          className={styles.input}
        />
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? '검색 중...' : '검색'}
        </button>
      </form>
      <p
        role="status"
        className={`${styles.feedback} ${
          feedbackVariant !== 'neutral' ? styles[feedbackVariant] : ''
        }`}
      >
        {feedbackMessage}
      </p>
    </header>
  )
}
