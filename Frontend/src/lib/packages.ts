import type { LabTest } from '@/types'
import { testIncludes, testMemberPrice } from '@/lib/catalog'

export function packageIncludedTests(test: LabTest): string[] {
  return testIncludes(test)
}

export type EnrichedPackage = LabTest & {
  includedTestNames: string[]
  brochureMrp: number
  brochureSpecialPrice: number
}

export function enrichPackage(test: LabTest): EnrichedPackage {
  return {
    ...test,
    includedTestNames: packageIncludedTests(test),
    brochureMrp: Number(test.price),
    brochureSpecialPrice: testMemberPrice(test),
  }
}

export function enrichPackages(tests: LabTest[]): EnrichedPackage[] {
  return tests.filter((t) => t.isPackage).map(enrichPackage)
}
