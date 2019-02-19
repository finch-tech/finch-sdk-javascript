export default class Component {
  constructor(options = {}) {
    this.config = options.config;
    this.dataset = options.dataset || {};
    this.navigator = options.navigator;
    this.apiClient = options.apiClient;
    this.modal = options.modal;
    this.onSuccess = options.onSuccess;
    this.el = document.createElement("div");
    this.overlay = options.overlay;
  }

  willMount() {
    if (this.navigatorParams && this.navigatorParams.dataset) {
      this.dataset = Object.assign(this.dataset, this.navigatorParams.dataset);
    }
  }

  willUnmount() {}

  onMounted() {}

  onUnmounted() {}
}
