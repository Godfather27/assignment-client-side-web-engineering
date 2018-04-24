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

const ROOT_ELEMENT = /^<([\w][\w\d]*\b[^>]*)>.*?<\/\1>$/;
const VARIABLE_NOT_WRAPPED = /<(\/*)[^<]*?>\{\{([\w\d]+?)\}\}<\1\w*?>/;
const MATCH_ELEMENT = /<([\w][\w\d]*\b[^>]*)>(.*?)<\/\1>/;
const MATCH_ALL_ELEMENTS = /<([\w][\w\d]*\b[^>]*)>(.*?)<\/\1>/g;
const MATCH_VARIABLE = /^\{\{([\w\d]+?)\}\}$/;
const MATCH_ALL_VARS = /\{\{([\w\d]+?)\}\}/g;

function build(templateString) {
  if (!ROOT_ELEMENT.test(templateString)) {
    throw new Error("template must be wrapped in a dom element");
  }
  if (VARIABLE_NOT_WRAPPED.test(templateString)) {
    throw new Error("Variables must be wrapped in a dom element");
  }

  const variables = [];
  const registeredVariables = new Set();

  function registerElementToObserver(substring, element, VariableData) {
    let match;
    if ((match = substring.match(MATCH_VARIABLE)) !== null) {
      const key = match[1];
      variables[key].elements.push(element);
      element.textContent = VariableData[key];
    }
  }

  function setChildrenIfBranch(substring, element, VariableData) {
    if (MATCH_ELEMENT.test(substring)) {
      for (const childString of substring.match(MATCH_ALL_ELEMENTS)) {
        element.appendChild(createTemplate(childString, VariableData).el);
      }
    }
  }

  function createTemplate(string, VariableData) {
    const search = string.match(MATCH_ELEMENT);
    if (!search) return;
    const [_, tag, substring] = search;

    const element = document.createElement(tag);
    registerElementToObserver(substring, element, VariableData);
    setChildrenIfBranch(substring, element, VariableData);

    return {
      el: element,
      update(values) {
        Object.keys(values).forEach(key => {
          if (!registeredVariables.has(key))
            throw new Error(`template does not contain "${key}" variable`);
          variables[key].update(values[key]);
        });
      }
    };
  }

  function createObserver(string) {
    let match;
    while ((match = MATCH_ALL_VARS.exec(string)) !== null) {
      const key = match[1];
      if (!registeredVariables.has(key)) {
        variables[key] = {
          elements: [],
          update(value) {
            this.elements.forEach(element => {
              element.textContent = value;
            });
          }
        };
        registeredVariables.add(key);
      }
    }
  }

  createObserver(templateString);
  return createTemplate.bind(this, templateString);
}

export { build };
