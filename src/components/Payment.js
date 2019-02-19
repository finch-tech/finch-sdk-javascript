import Component from "./Component";
import QRCode from "../lib/qrcode";
import metamaskImg from "../images/metamask.png";

export default class Payment extends Component {
  async onMounted() {
    this.timeLeft = "15:00";

    try {
      this.copyButton = this.el.querySelector(".copy-address");
      this.copyButton.addEventListener("click", this.copyAddress.bind(this));

      if (this.dataset.currency == "eth") {
        this.activateMetamaskButton();
      }

      const Qrcode = new QRCode(this.el.querySelector(".qrcode"), {
        text: `${this.dataset.payment.address}`,
        width: 100,
        height: 100,
        colorDark: "#4a4a4a",
        colorLight: "#ffffff"
      });

      this.startCountdown();
      await this.pollPaymentStatus();
    } catch (error) {
      this.navigator.navigate.call(this.navigator, "error", {
        dataset: Object.assign(this.dataset, {
          message: "Error detected during payment session."
        })
      });
      return;
    }
  }

  onUnmounted() {
    clearTimeout(this.polling);
    clearTimeout(this.timer);

    if (this.copyButton)
      this.copyButton.removeEventListener("click", this.copyAddress.bind(this));

    if (this.metamaskButton)
      this.metamaskButton.removeEventListener(
        "click",
        this.payWithMetamask.bind(this),
        false
      );
  }

  activateMetamaskButton() {
    this.metamaskButton = this.el.querySelector(".pay-with-metamask");
    this.metamaskButton.src = metamaskImg;
    this.metamaskButton.addEventListener(
      "click",
      this.payWithMetamask.bind(this)
    );
  }

  copyAddress() {
    var el = document.createElement("textarea");
    el.value = this.dataset.payment.address;
    el.setAttribute("readonly", "");
    el.style = { position: "absolute", left: "-9999px" };
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  }

  startCountdown() {
    let presentTime = this.timeLeft;
    let timeArray = presentTime.split(/[:]+/);
    let m = timeArray[0];

    let s = timeArray[1] - 1;

    if (s < 10 && s >= 0) {
      s = "0" + s;
    }

    if (s < 0) {
      s = "59";
    }

    if (s == 59) {
      m = m - 1;
    }

    this.timeLeft = `${m}:${s}`;

    if (this.timeLeft == "0:00") {
      this.navigator.navigate.call(this.navigator, "error", {
        dataset: Object.assign(this.dataset, {
          message: "Payment session has expired."
        })
      });
      return;
    }

    this.el.querySelector(".timer").innerHTML = this.timeLeft;

    this.timer = setTimeout(this.startCountdown.bind(this), 1000);
  }

  payWithMetamask() {
    const { payment } = this.dataset;

    if (typeof web3 === "undefined") {
      this.el.querySelector(".metamask-error").innerHTML =
        '<div class="metamask-error-message">You need to install MetaMask to use this feature.  https://metamask.io</div>';
      return;
    }

    web3.eth.getAccounts((err, accounts) => {
      if (err || accounts.length == 0) {
        this.el.querySelector(".metamask-error").innerHTML =
          '<div class="metamask-error-message">Please unlock your account on metamask</div>';
        return;
      }

      web3.eth.sendTransaction(
        {
          to: payment.address,
          from: accounts[0],
          value: web3.toWei(payment.charge, "ether")
        },
        (err, transactionHash) => {
          if (err) return;

          this.navigator.navigate.call(this.navigator, "confirmation", {
            dataset: Object.assign(this.dataset, { transactionHash })
          });
        }
      );
    });
  }

  async pollPaymentStatus() {
    const resp = await this.apiClient.getPaymentStatus(
      this.dataset.payment.id,
      this.dataset.sessionToken
    );

    if (resp.status == "pending") {
      await new Promise(resolve => (this.polling = setTimeout(resolve, 4000)));
      return await this.pollPaymentStatus();
    }

    this.navigator.navigate.call(this.navigator, "confirmation", {
      dataset: this.dataset
    });
  }

  render() {
    let expiration = new Date();
    expiration.setMinutes(expiration.getMinutes() + 15);

    let expiresAt = `${expiration.getHours()}:${(
      "0" + expiration.getMinutes()
    ).substr(-2)}`;

    let metamask =
      typeof web3 !== "undefined" && this.dataset.currency === "eth";

    let { currency, payment, store } = this.dataset;

    let network;
    switch (payment.crypto) {
      case "btc":
        network = payment.btc_network;
        break;
      case "eth":
        network = payment.eth_network;
        break;
    }

    const template = `
            <div class="modal-content payment ${currency}">
                <div class="header">
                    <div class="title">${store.name}</div>
                    <p class="message">
                        Please send crypto to the address below.
                    </p>
                    <div class="amount">${
                      payment.charge
                    } ${currency.toUpperCase()}</div>
                    <div class="converted-amount">(${
                      payment.price
                    } ${payment.fiat.toUpperCase()})</div>
                    <div class="payment-qrcode-wrapper">
                        <div class="qrcode">

                        </div>
                    </div>
                </div>
                <div class="body">
                    <div class="address">${payment.address}</div>
                    <button class="copy-address">Copy the Address</button>
                    <div class="separator"><span class="or">or<span></div>
                    ${
                      currency === "eth"
                        ? `<img class="pay-with-metamask" src="" width="180" height="48" alt="Pay with metamask" /><div class="metamask-error"></div>`
                        : `<a href="bitcoin:${payment.address}?amount=${
                            payment.charge
                          }" class="open-in-wallet">Open in Wallet</a>`
                    }
                </div>
                <div class="network">Network: ${network.toUpperCase()}</div>
                <div class="footer">
                    <div class="timer footer-left">15:00</div>
                    <div class="footer-right">
                        <div class="rate">Currency Rate <span class="bold">1${currency.toUpperCase()} = ${(
      payment.price / payment.charge
    ).toFixed(2)} ${payment.fiat.toUpperCase()}</span></div>
                        <div class="footer-message">This payment modal is valid until: <span class="bold">${expiresAt}</span></div>
                    </div>
                </div>
            </div>`;

    this.el.innerHTML = template.trim();
  }
}
