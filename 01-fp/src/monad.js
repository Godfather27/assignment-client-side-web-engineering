/*
 * Implement a monad with the following requirements and features
 *
 * - Create a monad
 * - 1. type constructor: Create a constructor for a monad
 * - 2. unit function: Wrap a value of given type into a monad
 * - 3. bind function: allow chaining of operations on a monadic value
 * - Implement a fake DOM library
 * - Implement style function
 * - Implement fadeOut function
 *
 * Example:
 *
 * const $ = d()
 *  .extend("style", function(style) {…})
 *  .extend("fadeOut", function(style) {…})
 *
 * $({})
 *   .style({ color: "red" })
 *   .fadeOut();
 */
export function d() {
  const prototype = {};

  const unit = value => {
    const monad = Object.create(prototype);
    monad.bind = (fn, args) => fn.call(value, ...args);
    return monad;
  };

  unit.extend = (name, fn) => {
    prototype[name] = function(...args) {
      return unit(this.bind(fn, args));
    };
    return unit;
  };

  return unit;
}
