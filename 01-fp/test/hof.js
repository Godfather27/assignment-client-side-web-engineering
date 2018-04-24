import { pow } from "../src/hof";
import { sortBy } from "../src/hof";
import data from "../src/hof/data.json";

describe("01-fp", () => {
  describe("Higher-Order Functions", () => {
    describe("pow(x, y)", () => {
      it("should calc: pow(2, 1)", () => {
        pow(2, 1).should.eql(2);
      });

      it("should calc: pow(2, 2)", () => {
        pow(2, 2).should.eql(4);
      });

      it("should calc: pow(2, 3)", () => {
        pow(2, 3).should.eql(8);
      });

      it("should calc: pow(2, 4)", () => {
        pow(2, 4).should.eql(16);
      });

      it("should calc: pow(2, 128)", () => {
        pow(2, 128).should.eql(3.402823669209385e38);
      });

      it("should throw error: pow(2, 0)", () => {
        should.throws(() => pow(2, 0));
      });

      it("should throw error: pow(2, -1)", () => {
        should.throws(() => pow(2, -1));
      });
    });

    describe("sort(field, primer)", () => {
      it("should sort by age: sort('age')", () => {
        const [first, ...rest] = data.sort(sortBy("age"));
        const [last] = rest.reverse();

        first.id.should.eql("5ad4def45752bcacfadea50e");
        last.id.should.eql("5ad4def48441b782a35a9a84");
      });

      it("should sort by company: sort('company')", () => {
        const [first, ...rest] = data.sort(sortBy("company"));
        const [last] = rest.reverse();

        first.id.should.eql("5ad4def45752bcacfadea50e");
        last.id.should.eql("5ad4def4773f6a9d48aaff35");
      });

      it("should sort by name: sort('name', primer)", () => {
        const [first, ...rest] = data.sort(sortBy("name", (v => `${v.first} ${v.last}`)));
        const [last] = rest.reverse();

        first.id.should.eql("5ad4def48441b782a35a9a84");
        last.id.should.eql("5ad4def4fae9404155a6f892");
      });
    });
  });
});
