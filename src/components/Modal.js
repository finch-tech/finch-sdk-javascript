import Component from "./Component";

export default class Modal extends Component {
  set(mountPoint) {
    this.mountPoint = mountPoint;
    mountPoint.appendChild(this.el);
    this.render();
  }

  open() {
    setImmediate(() => {
      this.el.querySelector("#modal-container").classList.add("active");
    });
    this.el
      .querySelector(".btn-close")
      .addEventListener("click", this.close.bind(this), { once: true });
  }

  close() {
    this.el.querySelector("#modal-container").classList.remove("active");
    this.overlay.close();

    setTimeout(() => {
      this.mountPoint.removeChild(this.el);
    }, 300);

    this.navigator.clear();
  }

  render() {
    const template = `
            <div id="modal-container">
                <div class="sk-fading-circle">
                    <div class="sk-circle1 sk-circle"></div>
                    <div class="sk-circle2 sk-circle"></div>
                    <div class="sk-circle3 sk-circle"></div>
                    <div class="sk-circle4 sk-circle"></div>
                    <div class="sk-circle5 sk-circle"></div>
                    <div class="sk-circle6 sk-circle"></div>
                    <div class="sk-circle7 sk-circle"></div>
                    <div class="sk-circle8 sk-circle"></div>
                    <div class="sk-circle9 sk-circle"></div>
                    <div class="sk-circle10 sk-circle"></div>
                    <div class="sk-circle11 sk-circle"></div>
                    <div class="sk-circle12 sk-circle"></div>
                </div>
                
                <div class="modal">
                    <div class="content-root"></div>
                    <button class="btn-close" />
                </div>
            </div>`;

    this.el.innerHTML = template.trim();
  }
}
