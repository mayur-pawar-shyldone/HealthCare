import { testIncludes, testMemberPrice } from '@/lib/catalog';
export function packageIncludedTests(test) {
    return testIncludes(test);
}
export function enrichPackage(test) {
    return {
        ...test,
        includedTestNames: packageIncludedTests(test),
        brochureMrp: Number(test.price),
        brochureSpecialPrice: testMemberPrice(test),
    };
}
export function enrichPackages(tests) {
    return tests.filter((t) => t.isPackage).map(enrichPackage);
}
