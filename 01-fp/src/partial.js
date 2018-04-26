/*
 * Implement a partial function. The function should return a variation of
 * the original function that can be invoked partially. Do also implement a
 * placeholder constant that can be used during invocation.
 *
 * - Works with an arbitrary length of arguments
 * - Works with an arbitrary number of placeholder elements!
 * - `partial` is a pure function!
 */
export const _ = undefined;

export function partial(fn, length = fn.length, ...args) {
  const finalArgs = new Array(length).fill(_);
  const recursive = (...args) => {
    args.forEach(arg => (finalArgs[finalArgs.indexOf(_)] = arg));
    return finalArgs.includes(_) ? recursive : fn(...finalArgs);
  };
  return finalArgs.includes(_) ? recursive : fn;
}
