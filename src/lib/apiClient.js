export default class ApiClient {
  constructor(options = {}) {
    this.apiUrl = options.config.apiUrl;
    this.apiKey = options.config.apiKey;
    this.price = options.config.price;
    this.fiat = options.config.fiat;
    this.identifier = options.config.identifier;
  }

  createPayment(crypto) {
    return fetch(`${this.apiUrl}/payments`, {
      mode: "cors",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        accept: "application/json",
        "content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        fiat: this.fiat,
        crypto: crypto,
        price: this.price,
        identifier: this.identifier
      })
    }).then(response => {
      if (!response.ok) throw Error(response);

      return response.json();
    });
  }

  getPaymentStatus(id, sessionToken) {
    return fetch(`${this.apiUrl}/payments/${id}/status`, {
      mode: "cors",
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        accept: "application/json"
      }
    }).then(response => {
      if (!response.ok) throw Error(response);

      return response.json();
    });
  }

  createVoucher(paymentId, sessionToken) {
    return fetch(`${this.apiUrl}/vouchers`, {
      mode: "cors",
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        accept: "application/json",
        "content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        payment_id: paymentId
      })
    }).then(response => {
      if (!response.ok) throw Error(response);

      return response.json();
    });
  }
}
