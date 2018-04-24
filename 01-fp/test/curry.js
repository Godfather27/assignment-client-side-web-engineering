import { curry } from "../src/curry";

describe("01-fp", () => {
  describe("Currying", () => {
    it("should invoke currified version of nullary(): nullary()", () => {
      const nullary = curry(() => 777);
      nullary().should.eql(777);
    });

    it("should invoke currified version of unary(a): unary(21)", () => {
      const unary = curry(a => a);
      unary(21).should.eql(21);
    });

    it("should invoke currified version of binary(a, b): binary(1, 1)", () => {
      const binary = curry((a, b) => a + b);
      binary(1, 1).should.eql(2);
    });

    it("should invoke currified version of pow(x, y): pow(2)(4)", () => {
      const pow = curry(Math.pow);
      pow(2)(4).should.eql(16);
    });

    it("should invoke currified version of pow(x, y) two times w/o side-effects: pow(2)(4)", () => {
      const pow = curry(Math.pow);
      pow(2)(4).should.eql(16);
      pow(2)(4).should.eql(16);
    });

    it("should invoke currified version of add(x, y, z): add(1)(2)(3)", () => {
      function add(x, y, z) {
        return x + y + z;
      }
      const curryAdd = curry(add);
      curryAdd(1)(2)(3).should.eql(6);
    });

    it("should invoke currified version of add(x, y, z): add(1, 2)(3)", () => {
      function add(x, y, z) {
        return x + y + z;
      }
      const curryAdd = curry(add);
      curryAdd(1, 2)(3).should.eql(6);
    });

    it("should invoke currified version of add(x, y, z): add(1)(2, 3)", () => {
      function add(x, y, z) {
        return x + y + z;
      }
      const curryAdd = curry(add);
      curryAdd(1)(2, 3).should.eql(6);
    });

    it("should invoke currified version of mul(...factors): mul(2)(2, 2)(2)(2, 2)", () => {
      function mul(...args) {
        const [first, ...rest] = args;
        if (rest.length === 0) {
          return first;
        }
        return rest.reduce((sum, v) => sum * v, first);
      }
      const curryMul = curry(mul, 6);
      curryMul(2)(2, 2)(2)(2, 2).should.eql(64);
    });
  });
});
