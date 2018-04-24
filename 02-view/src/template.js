/**
 * Implement a view engine:
 *
 * - Parse HTML string
 * - Create according elements: node, text, variable
 * - Implement update function
 *
 * API:
 *
 * const template = build('<h1>{{title}}</h1>');
 * const {el, update} = template({title: 'Hello, World!'});
 * el.outerHTML // <h1>Hello, World!</h1>
 * update({title: 'Hallo Welt!'});
 * el.outerHTML // <h1>Hallo, Welt!</h1>
 */

const MATCH_ELEMENT = /<([a-z][a-z0-9]*\b[^>]*)>(.*?)<\/\1>/g;
const MATCH_VARIABLE = /^\{\{(.+)\}\}$/;

function buildTemplate (string, { title }) {
  MATCH_ELEMENT.lastIndex = 0;
  const search = MATCH_ELEMENT.exec(string);
  if(!search) return;
  const [ match, tag, children, ...rest ] = search;
  const el = document.createElement(tag)
  let bound = false;

  if(MATCH_VARIABLE.test(children)){
    el.innerHTML = title;
    bound = true;
  }

  MATCH_ELEMENT.lastIndex = 0; // reset regex
  let child
  if(MATCH_ELEMENT.test(children)){
    child = buildTemplate(children, { title })
    el.appendChild(child.el)
  }

  return {
    el,
    bound,
    child,
    update: function ({ title }) {
      if(bound){
        el.innerHTML = title;
      }
      if (child) {
        child.update({ title })
      }
    },
  }
};

function build(string) {
  return buildTemplate.bind(this, string)
}

export { build }
