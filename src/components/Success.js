import Component from "./Component";

export default class Success extends Component {
  onMounted() {
    this.modal.el.querySelector(".btn-close").classList.remove("disabled");

    if (this.dataset.voucher) return;

    const dataset = this.dataset;
    this.apiClient
      .createVoucher(dataset.payment.id, dataset.sessionToken)
      .then(data => {
        this.dataset.voucher = data.voucher;
        this.onSuccess(this.dataset.voucher);
      });
  }

  render() {
    const { currency } = this.dataset;

    const template = `
            <div class="modal-content simple ${currency}">
                <div class="icon-check"></div>
                <div class="title">Sucessfully Completed</div>
                <p class="message">
                    We have confirmed your payment
                </p>
            </div>
        `;

    this.el.innerHTML = template.trim();
  }
}
