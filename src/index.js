import {
  Overlay,
  Modal,
  Selector,
  Payment,
  Confirmation,
  Success,
  PaymentError
} from "./components";
import Navigator from "./lib/navigator";
import ApiClient from "./lib/apiClient";

import "./main.css";

export default class FinchCheckout {
  constructor(options = {}) {
    this.config = Object.assign(
      {
        modalEl: null
      },
      options
    );

    this.navigator = new Navigator();

    this.overlay = new Overlay();

    this.modal = new Modal({
      overlay: this.overlay,
      navigator: this.navigator
    });

    this.apiClient = new ApiClient({
      config: this.config
    });

    this.navigator.init({
      routes: {
        selector: new Selector({
          navigator: this.navigator,
          apiClient: this.apiClient,
          config: this.config,
          modal: this.modal,
          overlay: this.overlay
        }),
        payment: new Payment({
          navigator: this.navigator,
          apiClient: this.apiClient,
          config: this.config,
          modal: this.modal
        }),
        confirmation: new Confirmation({
          navigator: this.navigator,
          apiClient: this.apiClient,
          config: this.config,
          modal: this.modal
        }),
        success: new Success({
          navigator: this.navigator,
          apiClient: this.apiClient,
          onSuccess: this.onSuccess.bind(this),
          modal: this.modal
        }),
        error: new PaymentError({
          navigator: this.navigator,
          modal: this.modal
        })
      }
    });
  }

  init() {
    this.mount();
  }

  resize() {}

  onSuccess(ticket) {
    this.config.onSuccess(ticket);
  }

  closeModal() {
    this.modal.close();
    this.navigator.reset();
  }

  activate() {
    this.overlay.set(document.body);

    this.navigator.target = this.overlay.el.querySelector(
      ".finch-checkout-overlay-content"
    );

    this.navigator.navigate("selector");

    setTimeout(() => {
      this.overlay.open();
    }, 0);
  }

  mount() {
    this.config.button.addEventListener("click", this.activate.bind(this));
  }
}
