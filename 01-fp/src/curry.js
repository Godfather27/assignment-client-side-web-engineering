/*
 * Implement a currify function. The function should return a currified
 * variation of the given function.
 *
 * - Works with an arbitrary length of arguments
 * - Works with ...rest if curry is invoked with a second argument "length"
 * - `curry` is a pure function!
 * - Has auto currying after initial call
 */
export const curry = (fun, length = fun.length, ...a) => {
  if (length ^ a.length) return (...b) => curry(fun, length, ...a, ...b);
  if (!a.length) return fun;
  return fun(...a);
};
