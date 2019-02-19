import Component from "./Component";

export default class Overlay extends Component {
  set(mountPoint) {
    this.mountPoint = mountPoint;
    mountPoint.appendChild(this.el);
    this.render();
  }

  open() {
    this.el.querySelector("#finch-checkout-overlay").classList.add("active");
  }

  close() {
    this.el.querySelector("#finch-checkout-overlay").classList.remove("active");

    setTimeout(() => {
      this.mountPoint.removeChild(this.el);
    }, 300);
  }

  render() {
    const template = `<div id="finch-checkout-overlay"><div class="finch-checkout-overlay-content"></div></div>`;

    this.el.innerHTML = template.trim();
  }
}
