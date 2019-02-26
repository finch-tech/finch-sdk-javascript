import Component from "./Component";
import errorImg from "../images/error@2x.png";

export default class PaymentError extends Component {
  onMounted() {
    let closeButton = this.modal.el.querySelector(".btn-close");

    if (closeButton.classList.contains("disabled")) {
      closeButton.classList.remove("disabled");
    }
  }

  render() {
    const message = this.navigatorParams.dataset.message;

    const template = `
            <div class="modal-content simple">
                <div class="icon-error">
                  <img src="${errorImg}" width="9" height="34" />
                </div>
                <div class="title">Error</div>
                <p class="message">
                    ${message}
                </p>
            </div>
        `;

    this.el.innerHTML = template.trim();
  }
}
