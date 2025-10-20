import { useRef, useState } from 'react'
import styles from './App.module.css'
import { SearchSection } from './components/SearchSection/SearchSection'
import { ResultsList } from './components/ResultsList/ResultsList'
import { SymptomDetail } from './components/SymptomDetail/SymptomDetail'
import { DetailModal } from './components/DetailModal/DetailModal'
import {
  fetchDepartmentDetail,
  fetchHospitalDetail,
  fetchMedicineDetail,
  fetchSymptomDetail,
  fetchTreatmentDetail,
  searchSymptoms,
} from './api'
import type {
  SymptomDetail as SymptomDetailType,
  SymptomSummary,
} from './types'
import type { ModalType, TabKey, ModalState } from './types/ui'
import { useFeedback } from './hooks/useFeedback'

const emptyDetailMessage =
  '증상을 검색한 후 결과 중 하나를 선택하면 상세 정보를 확인할 수 있습니다.'

const App = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<SymptomSummary[]>([])
  const [selectedSymptomId, setSelectedSymptomId] = useState<number | null>(null)
  const [symptomDetail, setSymptomDetail] = useState<SymptomDetailType | null>(
    null,
  )
  const [activeTab, setActiveTab] = useState<TabKey>('medicines')
  const [searchLoading, setSearchLoading] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)

  const {
    message: feedbackMessage,
    variant: feedbackVariant,
    updateFeedback,
    resetFeedback,
  } = useFeedback()

  const [detailError, setDetailError] = useState('')
  const [modalState, setModalState] = useState<ModalState>(null)
  const [modalLoading, setModalLoading] = useState(false)
  const [modalError, setModalError] = useState('')
  const modalRequestId = useRef(0)

  const handleSearchRequest = async () => {
    const trimmed = searchTerm.trim()
    if (!trimmed) {
      updateFeedback('검색어를 입력해주세요.', 'error')
      return
    }

    setSearchLoading(true)
    resetFeedback()
    setDetailError('')

    try {
      const results = await searchSymptoms(trimmed)
      setSearchResults(results)

      if (results.length === 0) {
        updateFeedback('검색 결과가 없습니다.', 'neutral')
        setSelectedSymptomId(null)
        setSymptomDetail(null)
        return
      }

      updateFeedback(`${results.length}건의 결과를 찾았습니다.`, 'success')
      if (!results.some((result) => result.id === selectedSymptomId)) {
        setSelectedSymptomId(null)
        setSymptomDetail(null)
      }
    } catch (error) {
      console.error(error)
      updateFeedback('검색 중 오류가 발생했습니다. 다시 시도해주세요.', 'error')
      setSearchResults([])
      setSelectedSymptomId(null)
      setSymptomDetail(null)
    } finally {
      setSearchLoading(false)
    }
  }

  const handleSelectSymptom = async (symptom: SymptomSummary) => {
    if (symptom.id === selectedSymptomId) {
      return
    }

    setSelectedSymptomId(symptom.id)
    setActiveTab('medicines')
    setDetailError('')
    setDetailLoading(true)

    try {
      const detail = await fetchSymptomDetail(symptom.id)
      setSymptomDetail(detail)
    } catch (error) {
      console.error(error)
      setDetailError('상세 정보를 불러오는 중 문제가 발생했습니다.')
      setSymptomDetail(null)
    } finally {
      setDetailLoading(false)
    }
  }

  const closeModal = () => {
    modalRequestId.current += 1
    setModalState(null)
    setModalLoading(false)
    setModalError('')
  }

  const openModal = async (type: ModalType, id: number, title: string) => {
    const requestId = modalRequestId.current + 1
    modalRequestId.current = requestId

    setModalState({ type, title, data: null })
    setModalLoading(true)
    setModalError('')

    try {
      if (type === 'medicine') {
        const detail = await fetchMedicineDetail(id)
        if (modalRequestId.current === requestId) {
          setModalState({ type, title, data: detail })
        }
      } else if (type === 'treatment') {
        const detail = await fetchTreatmentDetail(id)
        if (modalRequestId.current === requestId) {
          setModalState({ type, title, data: detail })
        }
      } else {
        const detail = await fetchDepartmentDetail(id)
        if (modalRequestId.current === requestId) {
          setModalState({ type, title, data: detail })
        }
      }
    } catch (error) {
      console.error(error)
      if (modalRequestId.current === requestId) {
        setModalError('상세 정보를 불러오는 중 문제가 발생했습니다.')
      }
    } finally {
      if (modalRequestId.current === requestId) {
        setModalLoading(false)
      }
    }
  }

  return (
    <div className={styles.app}>
      <SearchSection
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        onSubmit={handleSearchRequest}
        loading={searchLoading}
        feedbackMessage={feedbackMessage}
        feedbackVariant={feedbackVariant}
      />

      <main className={styles.content}>
        <section className={styles.section}>
          <ResultsList
            results={searchResults}
            loading={searchLoading}
            selectedId={selectedSymptomId}
            onSelect={handleSelectSymptom}
          />
        </section>

        <section className={styles.section}>
          <SymptomDetail
            detail={symptomDetail}
            loading={detailLoading}
            error={detailError}
            emptyMessage={emptyDetailMessage}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onOpenModal={openModal}
          />
        </section>
      </main>

      <DetailModal
        state={modalState}
        loading={modalLoading}
        error={modalError}
        onClose={closeModal}
        onFetchHospitalDetail={fetchHospitalDetail}
      />
    </div>
  )
}

export default App
