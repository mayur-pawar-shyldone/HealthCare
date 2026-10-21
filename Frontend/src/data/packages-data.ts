/** Package records now come from GET /tests. Keep the type for older catalog helpers. */
export type HealthPackageDef = {
  name: string
  shortDescription: string
  description: string
  preparation: string
  includedTests: string[]
  mrp: number
  specialPrice: number
  isPopular?: boolean
  reportHours?: number
  sampleType?: string
}

export const HEALTH_PACKAGES: HealthPackageDef[] = []
