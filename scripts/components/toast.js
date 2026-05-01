const toastElement = document.createElement("div");
toastElement.classList.add("toast");
let message = "Default message";
let time = 2000;

const Toast = () => ({
  toast: toastElement,
  message(message) {
    this.toast.innerHTML = `
      <div class='toast-content'>
        <div>
          ${message}
        </div>
      </div
    `;

    this.renderToast();
  },
  confirm(message) {
    let confirm = false;

    this.toast.classList.add("confirm");
    this.toast.innerHTML = `
      <div class='toast-content'>
        <div>
          ${message}
          <input type="text" placeholder="Cual es tu nombre: " id="nameuser" autofocus/>
        </div>
        <div>
          <button id="confirm">Confirmar</button>
          <button id="cancel">Cancelar</button>
        </div>
      </div
    `;

    const pendingConfirm = new Promise((resolve, reject) => {
      this.toast.addEventListener("click", (e) => {
        if (e.target.id === "confirm") {
          this.toast.remove();
          this.toast.classList.remove('confirm')
          resolve({
            confirm: true,
            value: e.target.closest(".toast").querySelector("#nameuser").value,
          });
        }

        if (e.target.id === "cancel") {
          this.toast.remove();
          this.toast.classList.remove('confirm')
          resolve({
            confirm: false,
          });
        }
      });
    });
    this.renderToast("not");

    return pendingConfirm;
  },
  renderToast(autoRemove = "yes") {
    document.body.appendChild(this.toast);
    if (autoRemove === "not") return;

    this.removeToast();
  },

  removeToast() {
    setTimeout(() => {
      this.toast.remove();
    }, time);
  },
});
