import type {
  DepartmentDetail,
  HospitalDetail,
  MedicineDetail,
  SymptomDetail,
  SymptomSummary,
  TreatmentDetail,
} from './types'

const DEFAULT_API_BASE_URL = 'http://localhost:8080'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ??
  DEFAULT_API_BASE_URL).replace(/\/$/, '')

const defaultHeaders: HeadersInit = {
  Accept: 'application/json',
}

const buildUrl = (path: string, params?: Record<string, string>) => {
  const url = new URL(path, `${API_BASE_URL}/`)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value)
    })
  }

  return url
}

const handleResponse = async <T>(response: Response) => {
  if (!response.ok) {
    throw new Error(
      `요청이 실패했습니다. (status: ${response.status})`,
    )
  }

  return (await response.json()) as T
}

export const searchSymptoms = async (keyword: string) => {
  const url = buildUrl('/search/symptoms', {
    symptom: keyword,
  })

  const response = await fetch(url, {
    headers: defaultHeaders,
  })

  return handleResponse<SymptomSummary[]>(response)
}

export const fetchSymptomDetail = async (symptomId: number) => {
  const url = buildUrl(`/search/symptoms/${symptomId}`)

  const response = await fetch(url, {
    headers: defaultHeaders,
  })

  return handleResponse<SymptomDetail>(response)
}

export const fetchMedicineDetail = async (medicineId: number) => {
  const url = buildUrl(`/search/medicines/${medicineId}`)

  const response = await fetch(url, {
    headers: defaultHeaders,
  })

  return handleResponse<MedicineDetail>(response)
}

export const fetchTreatmentDetail = async (treatmentId: number) => {
  const url = buildUrl(`/search/treatments/${treatmentId}`)

  const response = await fetch(url, {
    headers: defaultHeaders,
  })

  return handleResponse<TreatmentDetail>(response)
}

export const fetchDepartmentDetail = async (departmentId: number) => {
  const url = buildUrl(`/search/departments/${departmentId}`)

  const response = await fetch(url, {
    headers: defaultHeaders,
  })

  return handleResponse<DepartmentDetail>(response)
}

export const fetchHospitalDetail = async (hospitalId: number) => {
  const url = buildUrl(`/search/hospitals/${hospitalId}`)

  const response = await fetch(url, {
    headers: defaultHeaders,
  })

  return handleResponse<HospitalDetail>(response)
}
