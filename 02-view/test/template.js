import { build } from "../src/template";

// provide DOM for tests
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

    it("should render sibling elements with multiple variables", () => {
      const title = "Hello, World!";
      const subtitle = "this is a template";
      const template =
        "<h1><strong>{{title}}</strong><small>{{subtitle}}</small></h1>";

      const tpl = build(template);
      const { el } = tpl({ title, subtitle });
      el.outerHTML.should.eql(
        `<h1><strong>${title}</strong><small>${subtitle}</small></h1>`
      );
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

    it.only("should render and update huge template with variables", () => {
      const title = "Hello, World!";
      const subtitle = "this is a template";
      const text =
        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc";
      const randomValue = Math.random() * 100;
      const template =
        "<div><h1><strong>{{title}}</strong><p><small>{{subtitle}}</small></p></h1><p><sub>{{randomValue}}</sub><span>{{text}}</span></p></div>";
      const title2 = "Hallo, Welt!";
      const subtitle2 = "das ist ein template";
      const text2 =
        "Auch gibt es niemanden, der den Schmerz an sich liebt, sucht oder wünscht, nur, weil er Schmerz ist, es sei denn, es kommt zu zufälligen Umständen, in denen Mühen und Schmerz ihm große Freude bereiten können. Um ein triviales Beispiel zu nehmen, wer von uns unterzieht sich je anstrengender körperlicher Betätigung, außer um Vorteile daraus zu ziehen? Aber wer hat irgend ein Recht, einen Menschen zu tadeln, der die Entscheidung trifft, eine Freude zu genießen, die keine unangenehmen Folgen hat, oder einen, der Schmerz vermeidet, welcher keine daraus resultierende Freude nach sich zieht? Auch gibt es niemanden, der den Schmerz an sich liebt, sucht oder wünscht, nur, weil er Schmerz ist, es sei denn, es kommt zu zufälligen Umständen, in denen Mühen und Schmerz ihm große Freude bereiten können. Um ein triviales Beispiel zu nehmen, wer von uns unterzieht sich je anstrengender körperlicher Betätigung, außer um Vorteile daraus zu ziehen? Aber wer hat irgend ein Recht, einen Menschen zu tadeln, der die Entscheidung trifft, eine Freude zu genießen, die keine unangenehmen Folgen hat, oder einen, der Schmerz vermeidet, welcher keine daraus resultierende Freude nach sich zieht?Auch gibt es niemanden, der den Schmerz an sich liebt, sucht oder wünscht, nur";
      const randomValue2 = Math.random() * 100;
      const tpl = build(template);
      const { el, update } = tpl({ title, subtitle, text, randomValue });
      el.outerHTML.should.eql(
        `<div><h1><strong>${title}</strong><p><small>${subtitle}</small></p></h1><p><sub>${randomValue}</sub><span>${text}</span></p></div>`
      );

      update({
        title: title2,
        subtitle: subtitle2,
        text: text2,
        randomValue: randomValue2
      });
      el.outerHTML.should.eql(
        `<div><h1><strong>${title2}</strong><p><small>${subtitle2}</small></p></h1><p><sub>${randomValue2}</sub><span>${text2}</span></p></div>`
      );
    });
  });

  describe("Exceptions", () => {
    it("should throw when template string isn't wrapped", () => {
      const template = "<h1><small></small></h1><h2>bar</h2>";

      (() => {
        build(template);
      }).should.throw(Error);
    });

    it("should throw when variable isn't wrapped in a dom element", () => {
      const template = "<h1><small></small>{{variable}}</h1>";

      (() => {
        build(template);
      }).should.throw(Error);
    });

    it("should throw when update is called with wrong params", () => {
      const template = "<h1><small>{{title}}</small></h1>";
      const wrongInput = { subtitle: "a subtitle" };

      const tpl = build(template);
      const { update } = tpl({ title: "" });

      (() => {
        update(wrongInput);
      }).should.throw(Error);
    });
  });

  describe("Performance: Update nested template", () => {
    it("should update n times: n = 1000000", () => {
      const template = "<h1><small>{{title}}</small></h1>";

      const tpl = build(template);
      const { el, update } = tpl({ title: "" });

      const n = 500000;
      for (let i = 0; i < n; i += 1) {
        update({ title: `title:nth(${i})` });
      }

      el.outerHTML.should.eql(`<h1><small>title:nth(${n - 1})</small></h1>`);
    });
  });
});
