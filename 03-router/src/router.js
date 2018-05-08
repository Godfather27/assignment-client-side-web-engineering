/**
 * Implement a dependency free global router for web browsers
 *
 * - It should allow static paths
 * - It should invoke function for "/" if defined on start
 * - It should have WILDCARD support * for catch all route
 * - It should never fail (provide error fallback)
 * - It should allow static redirects
 *
 * API:
 *
 * Static:
 * - page('/', index)
 *
 * Dynamic:
 * - page('/user/:user', show)
 * - page('/user/:user/edit', edit)
 * - page('/user/:user/album', album)
 * - page('/user/:user/album/sort', sort)
 *
 * Redirects:
 * - page('/home', index)
 * - page('/', '/home')
 *
 * Catch all:
 * - page('*', notfound)
 *
 * Start:
 * - page()
 */

const WILDCARD = "*";

function createRouter() {
  const routes = [];

  const replaceCallbackIfRedirect = callback => {
    return typeof callback === "string"
      ? () => changeRoute({ target: { location: { pathname: callback } } })
      : callback;
  };

  const createRoute = (path, callback) => {
    if (routes.some(e => e.route === path)) {
      console.warn("route already exists");
    } else if (path === WILDCARD) {
      routes.wildcard = callback;
    } else {
      routes.push({
        path,
        regex: new RegExp(`^${path.replace(/:[\w-_]*/g, "([\\w-_]*)")}$`),
        params: path.match(/:([\w-_]*)/g),
        callback: replaceCallbackIfRedirect(callback)
      });
    }
  };

  const changeRouteOnClick = event => {
    if (
      event.target.origin === window.document.location.origin &&
      event.target.rel !== "external" &&
      event.target.download !== "download" &&
      event.target.target !== "_blank"
    ) {
      changeRoute({
        target: { location: { pathname: event.target.pathname } }
      });
    }
  };

  const setContext = (route, target) => {
    const [_, ...values] = target.match(route.regex);
    const ctx = { params: {} };
    if (!!route.params) {
      route.params.forEach((param, idx) => {
        ctx.params[param.substr(1)] = values[idx];
      });
    }
    return ctx;
  };

  const commitWildcard = pathname => {
    routes.wildcard({});
    window.history.pushState({}, pathname, pathname);
    router.current = WILDCARD;
  };

  const commitRoute = (route, pathname) => {
    const ctx = setContext(route, pathname);
    window.history.pushState({}, pathname, pathname);
    route.callback(ctx);
    router.current = route.path;
  };

  const changeRoute = ({ target: { location: { pathname } } }) => {
    if (!routes.length) router.error = Error("no routes defined");
    const route = routes.filter(route => route.regex.test(pathname)).shift();
    if (route) {
      commitRoute(route, pathname);
    } else if (routes.wildcard) {
      commitWildcard(pathname);
    }
  };

  const setWindow = param => {
    if (typeof param !== "undefined") {
      global.window = param.window;
    }
    if (typeof window !== "undefined") {
      window.addEventListener("popstate", changeRoute);
      window.addEventListener("click", changeRouteOnClick);
    }
  };

  const router = (param, callback) => {
    typeof param === "object" ? setWindow(param) : createRoute(param, callback);
  };
  router.current = "/";
  router.error;
  setWindow();

  return router;
}

export { createRouter };
