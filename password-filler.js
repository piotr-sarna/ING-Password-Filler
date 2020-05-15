function fillInput(input, newValue) {
    input.value = newValue;
    input.dispatchEvent(new Event('input', { bubbles: true, cancelable: true, }));
    input.dispatchEvent(new Event('keyup', { bubbles: true, cancelable: true, }));
    input.dispatchEvent(new Event('change', { bubbles: true, cancelable: true, }));
}

function onLoginFill() {
    const login = document.getElementById("ps-input-login").value;
    const inputBox = document.getElementById("login-input");

    if (inputBox) {
        fillInput(inputBox, login);
    }
}

function onPasswordFill() {
    const passwd = document.getElementById("ps-input-password").value;
    const passwdCharacters = passwd.split('');

    for (var i = 1; i < 32; ++i) {
        const inputBox = document.getElementById("mask-" + i);
        
        if (inputBox) {
            fillInput(inputBox, passwdCharacters[i-1] ?? '');
        }
    }
}

function onToggleClick() {
    const hiddenClassName = "ps-container-background-hidden";
    const container = document.getElementById("ps-container-background");

    if (container.classList.contains("ps-container-background-hidden")) {
        container.classList.remove(hiddenClassName);
    } else {
        container.classList.add(hiddenClassName);
    }
    
    console.log(container);
}

fetch(chrome.runtime.getURL('/password-filler.html'))
    .then(response => response.text())
    .then(data => {
        let div = document.createElement("div");
        document.body.appendChild(div);
        div.innerHTML = data.trim();
        
        document.getElementById("ps-button-login").addEventListener("click", onLoginFill);
        document.getElementById("ps-button-password").addEventListener("click", onPasswordFill);
        document.getElementById("ps-button-toggle").addEventListener("click", onToggleClick);
    });
