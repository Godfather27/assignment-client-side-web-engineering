import { JSDOM } from "jsdom";

const html = `
<body>
  <a id="a1" href="/home">Home 1</a>
  <a id="a2" href="/home" download="download">Home 2</a>
  <a id="a3" href="/home" rel="external">Home 3</a>
  <a id="a4" href="/home" target="_blank">Home 4</a>
  <a id="a5" href="https://multimediatechnology.at">Home 5</a>

  <a id="b1" href="/">Home 1</a>
  <a id="b2" href="/home">Home 2</a>
</body>
`;

export function createWindow(options = {}) {
  const dom = new JSDOM(html, options);
  return { window: dom.window, dom };
}

export function changeLocation(dom, location) {
  const evt = dom.window.document.createEvent("PopStateEvent");
  evt.initEvent("popstate", true, true);
  dom.reconfigure({ url: location });
  dom.window.dispatchEvent(evt);
}

export function clickLink(dom, id) {
  const el = dom.window.document.querySelector(`#${id}`);
  el.click();
}
