import { d } from "../src/monad";

describe("01-fp", () => {
  describe("Monads", () => {
    it("should construct, wrap and lift", () => {
      const $ = d()
        .extend("style", function(style) {
          Object.assign(this, { style });
          return this;
        })
        .extend("fadeOut", function() {
          Object.assign(this, { opacity: 0 });
          return this;
        })
        .extend("assert", function() {
          this.should.have.property("style").which.is.a.Object();
          this.style.should.have.property("color").which.is.a.String();
          this.style.color.should.eql("red");
          this.should.have.property("opacity").which.is.a.Number();
          this.opacity.should.eql(0);
          return this;
        });

      const result = $({})
        .style({ color: "red" })
        .fadeOut()
        .assert();
    });

    it("should have extensions which are callable multiple times", () => {
      const $ = d()
        .extend("style", function(style) {
          Object.assign(this, { style });
          return this;
        })
        .extend("assert", function() {
          this.should.have.property("style").which.is.a.Object();
          this.style.should.have.property("color").which.is.a.String();
          this.style.color.should.eql("green");
          return this;
        });

      const result = $({})
        .style({ color: "red" })
        .style({ color: "green" });
    });
  });
});
