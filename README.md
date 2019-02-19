<div style="text-align:center; margin: 50px 0">
  <img src="docs/finch-logo.png" width="200" />
</div>

## Official Finch SDK for Front-end JavaScript

This is the front-end JavaScript SDK for the open source cryptocurrency payment processor [Finch](https://github.com/finch-tech/finch).

## Usage

Include the `finch-sdk.min.js` in the `/dist` directory to your project and initialize FinchCheckout instance.

```js
<script>
  window.onload = function() {
    let finchCheckout = new FinchCheckout({
      apiUrl: "https://api.finchtech.io",
      apiKey: "5tsdghD/RusjgbskoisRrgw==",
      currencies: ["btc", "eth"],
      fiat: "usd",
      price: "1.2",
      identifier: "hello@example.com",
      button: document.getElementById("pay-with-crypto"),
      onSuccess: function(voucher) {
        // Here you can get signed payment voucher in the form of JSON Web Token.
        // What you need to do on your service's backend is just to verify
        // this voucher using JWT decode library of your choice.
        console.log("Successfully completed the payment.", voucher);
      }
    });
    finchCheckout.init();
  };
</script>
```

Initialized FinchCheckout instance binds an `onClick` event to the specified button element. When users click the payment button, payment modal shows up so they can proceed to payment.

After users successfully complete the payment, `onSuccess` callback will be called, and you'll receive the payment voucher (JSON Web Token) as a parameter. Send the voucher to your service's backend so that you can decode and verify it.
Please refer to the [official documentation](https://docs.finchtech.io/docs/getting_started/payment_verification) for more detailed explanation on payment voucher.

## Resources

- [Documentation](https://docs.finchtech.io/docs/home/overview.html)
- [Finch Installation Guide](https://docs.finchtech.io/docs/installation/server)
- [Finch Getting Started Guide](https://docs.finchtech.io/docs/getting_started/overview) (Store Setup and Integration)
