import { _, partial } from "../src/partial";

describe("01-fp", () => {
  describe.only("Partial Function Application", () => {
    it("should invoke partial version of nullary(): nullary()", () => {
      const nullary = partial(() => 777);
      nullary().should.eql(777);
    });

    it("should invoke partial version of unary(a): unary(_)", () => {
      const unary = partial(a => a);
      const partialUnary = unary(_);
      partialUnary(21).should.eql(21);
    });

    it("should invoke partial version of binary(a, b): binary(_, _)", () => {
      const binary = partial((a, b) => a + b);
      const partialBinary = binary(_, _);
      partialBinary(2, 2).should.eql(4);
    });

    it("should invoke partial version of pow(x, y): pow(_, 4)", () => {
      const pow = partial(Math.pow);
      const partialPow = pow(_, 4);
      partialPow(2).should.eql(16);
    });

    it("should invoke partial version of pow(x, y): pow(_, 4)(2)", () => {
      const pow = partial(Math.pow);
      pow(_, 4)(2).should.eql(16);
    });

    it("should invoke partial version of pow(x, y) two times w/o side-effects: pow(_, 4)", () => {
      const pow = partial(Math.pow);
      const partialPow = pow(_, 4);
      partialPow(2).should.eql(16);
      partialPow(2).should.eql(16);
    });

    it("should invoke partial version of add(x, y, z): add(_, 2, 3)", () => {
      function add(x, y, z) {
        return x + y + z;
      }
      const partialAdd = partial(add);
      const partiallyAppliedAdd = partialAdd(_, 2, 3);
      partiallyAppliedAdd(1).should.eql(6);
    });

    it("should invoke partial version of add(x, y, z): add(1, _, 3)", () => {
      function add(x, y, z) {
        return x + y + z;
      }
      const partialAdd = partial(add);
      const partiallyAppliedAdd = partialAdd(1, _, 3);
      partiallyAppliedAdd(2).should.eql(6);
    });

    it("should invoke partial version of add(x, y, z): add(1, 2, _)", () => {
      function add(x, y, z) {
        return x + y + z;
      }
      const partialAdd = partial(add);
      const partiallyAppliedAdd = partialAdd(1, 2, _);
      partiallyAppliedAdd(3).should.eql(6);
    });

    it("should invoke partial version of add(x, y, z) in one step: add(_, 2, _)", () => {
      function add(x, y, z) {
        return x + y + z;
      }
      const partialAdd = partial(add);
      const partiallyAppliedAdd1 = partialAdd(_, 2, _);
      partiallyAppliedAdd1(1, 3).should.eql(6);
    });

    it("should invoke partial version of add(x, y, z) in two steps: add(_, 2, _)", () => {
      function add(x, y, z) {
        return x + y + z;
      }
      const partialAdd = partial(add);
      const partiallyAppliedAdd1 = partialAdd(_, 2, _);
      const partiallyAppliedAdd2 = partiallyAppliedAdd1(1, _);
      partiallyAppliedAdd2(3).should.eql(6);
    });

    it("should invoke partial version of mul(...factors): mul(2, _, _, 2, _, _)", () => {
      function mul(...args) {
        const [first, ...rest] = args;
        if (rest.length === 0) {
          return first;
        }
        return rest.reduce((sum, v) => sum * v, first);
      }
      const partialMul = partial(mul, 6);
      const partiallyAppliedMul = partialMul(2, _, _, 2, _, _);
      partiallyAppliedMul(2, 2, 2, 2).should.eql(64);
    });
  });
});
