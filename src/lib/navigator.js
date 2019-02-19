export default class Navigator {
  constructor(options = {}) {
    this.target = options.target;
    this.current = null;
  }

  reset() {
    this.routes[this.current].onUnmounted();
    delete this.current;
  }

  init(options = {}) {
    this.routes = options.routes;
  }

  clear() {
    if (this.current) {
      this.routes[this.current].onUnmounted();
    }
    delete this.target;
    delete this.current;
  }

  navigate(to, params) {
    if (params) {
      this.routes[to].navigatorParams = params;
    }

    if (this.target.hasChildNodes()) {
      this.target.replaceChild(
        this.routes[to].el,
        this.routes[this.current].el
      );
    } else {
      this.target.appendChild(this.routes[to].el);
    }

    if (this.current) {
      this.routes[this.current].onUnmounted();
    }

    this.routes[to].willMount();
    this.routes[to].render();
    this.routes[to].onMounted();
    this.current = to;
  }
}
