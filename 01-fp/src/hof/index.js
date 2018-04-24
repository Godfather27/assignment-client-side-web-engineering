/*
 * Implement a pure function "pow". The function should behave the same as
 * Math.pow(n, n) -> Math.pow(2, 2) = 4 but should not use Math.pow(…). Find an
 * elegant and pure functional solution to the problem w/o any side-effects.
 *
 * - Works with positive integers ℤ+!
 * - Throws an error if exponent is invalid
 */
export function pow(base, exponent) {
  return Array(exponent).fill(base).reduce((product, factor) => product * factor)
}

/*
 * Implement a sortBy function that is capable of sorting any field within the
 * set "data.json".
 *
 * - Provides a primer for complex fields
 * - Throws an error if arguments are invalid
 */
export function sortBy(field, primer=(value => value)) {
  return (a, b) => primer(a[field]) > primer(b[field])
}
