import { useEffect, useRef, useState } from 'react'
import styles from './DetailModal.module.css'
import { MODAL_LABEL } from '../../types/ui'
import type { ModalState } from '../../types/ui'
import type {
  DepartmentDetail,
  HospitalDetail,
  MedicineDetail,
  TreatmentDetail,
} from '../../types'

interface DetailModalProps {
  state: ModalState
  loading: boolean
  error: string
  onClose: () => void
  onFetchHospitalDetail?: (hospitalId: number) => Promise<HospitalDetail>
}

const MODAL_TITLE_ID = 'detail-modal-title'

export const DetailModal = ({
  state,
  loading,
  error,
  onClose,
  onFetchHospitalDetail,
}: DetailModalProps) => {
  const [expandedHospitals, setExpandedHospitals] = useState<Record<number, boolean>>({})
  const [hospitalDetails, setHospitalDetails] = useState<Record<number, HospitalDetail>>({})
  const [hospitalLoading, setHospitalLoading] = useState<Record<number, boolean>>({})
  const [hospitalError, setHospitalError] = useState<Record<number, string>>({})
  const fetchRequestIdRef = useRef(0)

  useEffect(() => {
    if (!state) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [state, onClose])

  useEffect(() => {
    setExpandedHospitals({})
    setHospitalDetails({})
    setHospitalLoading({})
    setHospitalError({})
    fetchRequestIdRef.current += 1
  }, [state?.type, state?.title])

  if (!state) {
    return null
  }

  const renderContent = () => {
    if (loading) {
      return <p className={styles.status}>상세 정보를 불러오는 중입니다...</p>
    }

    if (error) {
      return <p className={`${styles.status} ${styles.error}`}>{error}</p>
    }

    if (!state.data) {
      return <p className={styles.status}>표시할 내용이 없습니다.</p>
    }

    if (state.type === 'medicine') {
      const detail = state.data as MedicineDetail
      return (
        <>
          <section className={styles.section}>
            <h3>기본 정보</h3>
            <dl className={styles.dl}>
              <div>
                <dt>제조사</dt>
                <dd>{detail.manufacturer}</dd>
              </div>
              <div>
                <dt>효능</dt>
                <dd>{detail.efficacy}</dd>
              </div>
            </dl>
          </section>
          <section className={styles.section}>
            <h3>성분</h3>
            {detail.ingredients.length ? (
              <ul className={styles.list}>
                {detail.ingredients.map((ingredient) => (
                  <li key={ingredient.id}>{ingredient.name}</li>
                ))}
              </ul>
            ) : (
              <p className={styles.subtle}>등록된 성분 정보가 없습니다.</p>
            )}
          </section>
          <section className={styles.section}>
            <h3>주의사항</h3>
            {detail.precautions.length ? (
              <ul className={styles.list}>
                {detail.precautions.map((precaution) => (
                  <li key={precaution.id}>
                    <p>{precaution.description}</p>
                    <span className={styles.tag}>{precaution.targetGroup}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.subtle}>주의사항 정보가 없습니다.</p>
            )}
          </section>
          <section className={styles.section}>
            <h3>관련 증상</h3>
            {detail.symptoms.length ? (
              <ul className={styles.list}>
                {detail.symptoms.map((symptom) => (
                  <li key={symptom.id}>{symptom.symptom}</li>
                ))}
              </ul>
            ) : (
              <p className={styles.subtle}>연관 증상 정보가 없습니다.</p>
            )}
          </section>
        </>
      )
    }

    if (state.type === 'treatment') {
      const detail = state.data as TreatmentDetail
      return (
        <>
          <section className={styles.section}>
            <h3>설명</h3>
            <p>{detail.description}</p>
          </section>
          <section className={styles.section}>
            <h3>관련 증상</h3>
            {detail.symptoms.length ? (
              <ul className={styles.list}>
                {detail.symptoms.map((symptom) => (
                  <li key={symptom.id}>{symptom.symptom}</li>
                ))}
              </ul>
            ) : (
              <p className={styles.subtle}>연관 증상 정보가 없습니다.</p>
            )}
          </section>
        </>
      )
    }

    const detail = state.data as DepartmentDetail

    const toggleHospital = async (hospitalId: number) => {
      setExpandedHospitals((prev) => ({
        ...prev,
        [hospitalId]: !prev[hospitalId],
      }))

      const nextExpanded = !expandedHospitals[hospitalId]
      if (!nextExpanded || hospitalDetails[hospitalId] || !onFetchHospitalDetail) {
        return
      }

      setHospitalLoading((prev) => ({ ...prev, [hospitalId]: true }))
      setHospitalError((prev) => ({ ...prev, [hospitalId]: '' }))
      const requestId = fetchRequestIdRef.current + 1
      fetchRequestIdRef.current = requestId

      try {
        const hospitalDetail = await onFetchHospitalDetail(hospitalId)
        if (fetchRequestIdRef.current === requestId) {
          setHospitalDetails((prev) => ({ ...prev, [hospitalId]: hospitalDetail }))
        }
      } catch (fetchError) {
        console.error(fetchError)
        if (fetchRequestIdRef.current === requestId) {
          setHospitalError((prev) => ({
            ...prev,
            [hospitalId]: '리뷰를 불러오는 중 문제가 발생했습니다.',
          }))
        }
      } finally {
        if (fetchRequestIdRef.current === requestId) {
          setHospitalLoading((prev) => ({ ...prev, [hospitalId]: false }))
        }
      }
    }

    const renderHospitalReviews = (hospitalId: number) => {
      if (hospitalLoading[hospitalId]) {
        return <p className={styles.status}>리뷰를 불러오는 중입니다...</p>
      }

      if (hospitalError[hospitalId]) {
        return <p className={`${styles.status} ${styles.error}`}>{hospitalError[hospitalId]}</p>
      }

      const hospitalDetail = hospitalDetails[hospitalId]
      if (!hospitalDetail) {
        return null
      }

      if (!hospitalDetail.reviews.length) {
        return <p className={styles.subtle}>등록된 리뷰가 없습니다.</p>
      }

      return (
        <ul className={styles.reviewList}>
          {hospitalDetail.reviews.map((review) => (
            <li key={review.id} className={styles.reviewCard}>
              <div className={styles.reviewRating}>평점: {review.rating}</div>
              <p className={styles.reviewContent}>{review.content}</p>
            </li>
          ))}
        </ul>
      )
    }

    return (
      <>
        <section className={styles.section}>
          <h3>연계 병원</h3>
          {detail.hospitals.length ? (
            <ul className={styles.list}>
              {detail.hospitals.map((hospital) => {
                const expanded = expandedHospitals[hospital.id]
                return (
                  <li key={hospital.id} className={styles.hospitalCard}>
                    <div className={styles.hospitalInfo}>
                      <strong>{hospital.name}</strong>
                      <p>{hospital.address}</p>
                      <p>{hospital.phoneNumber}</p>
                    </div>
                    <button
                      type="button"
                      className={styles.reviewToggle}
                      onClick={() => toggleHospital(hospital.id)}
                    >
                      {expanded ? '리뷰 숨기기' : '리뷰 보기'}
                    </button>
                    {expanded && (
                      <div className={styles.reviewSection}>
                        {renderHospitalReviews(hospital.id)}
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className={styles.subtle}>연계된 병원 정보가 없습니다.</p>
          )}
        </section>
        <section className={styles.section}>
          <h3>담당 증상</h3>
          {detail.symptoms.length ? (
            <ul className={styles.list}>
              {detail.symptoms.map((symptom) => (
                <li key={symptom.id}>{symptom.symptom}</li>
              ))}
            </ul>
          ) : (
            <p className={styles.subtle}>담당 증상 정보가 없습니다.</p>
          )}
        </section>
      </>
    )
  }

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby={MODAL_TITLE_ID}
      onClick={onClose}
    >
      <div
        className={styles.content}
        role="document"
        onClick={(event) => event.stopPropagation()}
      >
        <header className={styles.header}>
          <h2 id={MODAL_TITLE_ID}>
            {MODAL_LABEL[state.type]} · {state.title}
          </h2>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="모달 닫기"
          >
            ×
          </button>
        </header>
        <div className={styles.body}>{renderContent()}</div>
      </div>
    </div>
  )
}
