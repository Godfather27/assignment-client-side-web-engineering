import { JSDOM } from "jsdom";

const jsdom = new JSDOM('<!doctype html><html><body></body></html>');

global.document = jsdom.window.document;
global.window = jsdom.window;
global.navigator = {
  userAgent: 'node.js',
};
