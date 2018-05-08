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

let window;

function createRouter() {
  let current;
  let routes = [];

  const createRoute = (param, fun) => {
    if (routes.some(e => e.route === param)) {
      console.warn("route already exists");
    } else {
      if (param === "*") {
        routes.wildcard = fun;
        return;
      }
      if (typeof fun === "string") {
        const redirectTarget = fun;
        fun = () => {
          changeRoute({ target: { location: { pathname: redirectTarget } } });
        };
      }
      routes.push({
        path: param,
        regex: new RegExp(`^${param.replace(/:[\w-_]*/g, "([\\w-_]*)")}$`),
        params: param.match(/:([\w-_]*)/g),
        fun
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

  const changeRoute = event => {
    let target = event.target.location.pathname;
    if (routes.length === 0) {
      router.error = Error("no routes defined");
    } else if (!routes.some(route => route.regex.test(target))) {
      router.error = Error("Route not defined");
    }

    let changed = false;
    routes.forEach(route => {
      if (route.regex.test(target)) {
        const [_, ...values] = target.match(route.regex);
        const ctx = { params: {} };

        if (!!route.params) {
          route.params.forEach((param, idx) => {
            ctx.params[param.substr(1)] = values[idx];
          });
        }
        window.history.pushState({}, target, target);
        route.fun(ctx);
        router.current = route.path;
        changed = true;
      }
    });

    if (!changed && !!routes.wildcard) {
      routes.wildcard({});
      window.history.pushState({}, target, target);
      router.current = "/*";
    }
  };

  const router = (param, fun = () => {}) => {
    if (typeof param === "object") {
      window = param.window || document.defaultView;
      window.addEventListener("popstate", changeRoute);
      [...window.document.getElementsByTagName("a")].forEach(button => {
        button.addEventListener("click", changeRouteOnClick);
      });
    } else if (typeof param === "string") {
      createRoute(param, fun);
    }
  };

  router.current = "/";
  router.error;

  return router;
}

export { createRouter };


// if (!router.listener) {
//   window = param.window || document.defaultView;
//   router.listener = window.addEventListener("popstate", changeRoute);
// } else {
//   window.removeEventListener("popstate", router.listener);
//   window = param.window || document.defaultView;
//   router.listener = window.addEventListener("popstate", changeRoute);
// }
