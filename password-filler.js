fetch(chrome.runtime.getURL("/password-filler.html"))
  .then((response) => response.text())
  .then((data) => {
    let div = document.createElement("div");
    document.body.appendChild(div);
    div.innerHTML = data.trim();

    document
      .getElementById("ps-button-login")
      .addEventListener("click", onLoginFill);
    document
      .getElementById("ps-button-password")
      .addEventListener("click", onPasswordFill);
    document
      .getElementById("ps-button-toggle")
      .addEventListener("click", onToggleClick);
  });
