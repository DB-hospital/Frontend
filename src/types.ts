export interface SymptomSummary {
  id: number
  symptom: string
  body_part: string
  description: string
}

export interface MedicineSummary {
  id: number
  name: string
  manufacturer: string
  efficacy: string
}

export interface TreatmentSummary {
  id: number
  treatment: string
  description: string
}

export interface DepartmentSummary {
  id: number
  name: string
}

export interface SymptomDetail extends SymptomSummary {
  medicines: MedicineSummary[]
  treatments: TreatmentSummary[]
  departments: DepartmentSummary[]
}

export interface IngredientSummary {
  id: number
  name: string
}

export interface PrecautionSummary {
  id: number
  description: string
  targetGroup: string
}

export interface HospitalSummary {
  id: number
  name: string
  address: string
  phoneNumber: string
}

export interface ReviewSummary {
  id: number
  rating: number
  content: string
}

export interface MedicineDetail extends MedicineSummary {
  ingredients: IngredientSummary[]
  precautions: PrecautionSummary[]
  symptoms: SymptomSummary[]
}

export interface TreatmentDetail {
  id: number
  treatment: string
  description: string
  symptoms: SymptomSummary[]
}

export interface DepartmentDetail {
  id: number
  name: string
  hospitals: HospitalSummary[]
  symptoms: SymptomSummary[]
}

export interface HospitalDetail extends HospitalSummary {
  departments: DepartmentSummary[]
  reviews: ReviewSummary[]
}
