import Component from "./Component";
import bitcoinImg from "../images/bitcoin@2x.png";
import ethereumImg from "../images/ethereum@2x.png";

export default class Select extends Component {
  onMounted() {
    this.activateCurrencySelectButton();
    this.el
      .querySelector(".btn-close")
      .addEventListener("click", this.overlay.close.bind(this.overlay));
  }

  activateCurrencySelectButton() {
    this.buttons = this.el.querySelectorAll(".btn-currency");
    this.buttons.forEach(button => {
      button.addEventListener(
        "click",
        this.navigateToPayment.bind(this, button.dataset.type)
      );
    });
  }

  async navigateToPayment(currency, e) {
    e.stopPropagation();

    this.navigator.target.removeChild(this.el);

    this.modal.set(
      this.overlay.el.querySelector(".finch-checkout-overlay-content")
    );

    this.navigator.target = this.modal.el.querySelector(".content-root");

    let data = await this.apiClient.createPayment(currency);

    this.navigator.navigate.call(this.navigator, "payment", {
      dataset: Object.assign(this.dataset, {
        currency,
        payment: data.payment,
        store: data.store,
        sessionToken: data.token
      })
    });

    this.modal.open();
  }

  renderButton(currency) {
    switch (currency) {
      case "btc":
        return `<button class="btn-currency" data-type="btc">
                  <img src="${bitcoinImg}" width="98" height="109" />
                  <span class="label">Bitcoin</span>
                </button>`;

        break;

      case "eth":
        return `<button class="btn-currency" data-type="eth">
                  <img src="${ethereumImg}" width="98" height="109" />
                  <span class="label">Ethereum</span>
                </button>`;

        break;
    }
  }

  render() {
    const { currencies } = this.config;

    const template = `
      <div class="currency-selector">
        <button class="btn-close"></button>
        <p class="message">
          Select the cryptocurrency you want to use.
        </p>
        <div class="body">
          ${currencies.map(c => this.renderButton(c)).join("")}
        </div>
      </div>`;

    this.el.innerHTML = template.trim();
  }
}
