import { JSDOM } from "jsdom";
import { build } from "../src/template";

// provide DOM for tests
const dom = new JSDOM(`<!DOCTYPE html>`);
global.document = dom.window.document;

describe("02-view", () => {
  describe("Build template", () => {
    it("should render one element with variable", () => {
      const title = "Hello, World!";
      const template = "<h1>{{title}}</h1>";

      const tpl = build(template);
      const { el } = tpl({ title });
      el.outerHTML.should.eql(`<h1>${title}</h1>`);
    });
  });

  describe("Build nested template", () => {
    it("should render nested element with variable", () => {
      const title = "Hello, World!";
      const template = "<h1><small>{{title}}</small></h1>";

      const tpl = build(template);
      const { el } = tpl({ title });
      el.outerHTML.should.eql(`<h1><small>${title}</small></h1>`);
    });
  });

  describe("Update nested template", () => {
    it("should render nested element with different values", () => {
      const title1 = "Hello, World!";
      const title2 = "Hello, World2!";

      const template = "<h1><small>{{title}}</small></h1>";

      const tpl = build(template);

      const { el, update } = tpl({ title: title1 });
      el.outerHTML.should.eql(`<h1><small>${title1}</small></h1>`);

      update({ title: title2 });
      el.outerHTML.should.eql(`<h1><small>${title2}</small></h1>`);
    });
  });

  describe("Performance: Update nested template", () => {
    it("should update n times: n = 1000000", () => {
      const template = "<h1><small>{{title}}</small></h1>";

      const tpl = build(template);
      const { el, update } = tpl({ title: "" });

      const n = 1000000;
      for (let i = 0; i < n; i += 1) {
        update({ title: `title:nth(${i})` });
      }

      el.outerHTML.should.eql(`<h1><small>title:nth(${n - 1})</small></h1>`);
    });
  });
});
