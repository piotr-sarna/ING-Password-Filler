<script lang="ts">
  let containerElement: HTMLDivElement;
  let loginElement: HTMLInputElement;
  let passwordElement: HTMLInputElement;
  let isHidden = false;

  const t = (translationKey: string): string => {
    return chrome.i18n.getMessage(translationKey) ?? translationKey;
  };

  const goToNextLoginStep = (form: HTMLFormElement) => {
    const nextStepButton = getButtonByTagName("ing-button", form) as HTMLButtonElement;

    nextStepButton?.click();
  };

  const fillInput = (input: HTMLInputElement, newValue: string) => {
    const dispatchEvent = (eventName: string) =>
      input.dispatchEvent(new Event(eventName, { bubbles: true, cancelable: true }));

    input.value = newValue;

    dispatchEvent("input");
    dispatchEvent("keyup");
    dispatchEvent("change");
  };

  const onLoginFill = () => {
    const loginInput = getInputByNameAttribute("login") as HTMLInputElement;
    const login = loginElement.value;

    if (loginInput && login?.length > 0) {
      fillInput(loginInput, login);
      goToNextLoginStep(loginInput.form);
    }
  };

  const onPasswordFill = () => {
    const maskedBoxIdPrefix = "pin-";
    const passwordCharaters = passwordElement.value.split("");
    let form: HTMLFormElement | null = null;
    let i = 1;

    while (true) {
      const maskedBox = getInputByNameAttribute(`${maskedBoxIdPrefix}${i}`) as HTMLInputElement;

      if (!maskedBox || i > passwordCharaters.length) break;

      if (!maskedBox.disabled) {
        fillInput(maskedBox, passwordCharaters[i - 1]);
        form = maskedBox.form;
      }

      ++i;
    }

    if (form) {
      goToNextLoginStep(form);
      onPasswordFilled();
    }
  };

  const onPasswordFilled = () => {
    isHidden = true;

    const checkIfSuccessfullLoginInterval = 500;
    const checkIfSuccessfullLoginTimeout = 30 * checkIfSuccessfullLoginInterval;

    const interval = setInterval(() => {
      const contentElement = document.getElementById("content-region");

      if (contentElement?.classList.contains("main-content-region")) {
        fillInput(loginElement, "");
        fillInput(passwordElement, "");
        clearInterval(interval);
      }
    }, checkIfSuccessfullLoginInterval);

    setTimeout(() => {
      clearInterval(interval);
    }, checkIfSuccessfullLoginTimeout);
  };

  const getInputByNameAttribute = (name: string): Element | null => {
    const test = (e: Element) => {
      const tagName = e.localName;
      const nameAttribute = e.attributes.getNamedItem("name")?.value;

      return tagName === "input" && nameAttribute == name;
    };

    return findElementRecursive(test, document.body);
  };

  const getButtonByTagName = (name: string, parent: Element = document.body): Element | null => {
    const test = (e: Element) => {
      const tagName = e.localName;
      const roleAttribute = e.attributes.getNamedItem("role")?.value;

      return tagName === name && roleAttribute == "button";
    };

    return findElementRecursive(test, parent);
  };

  const findElementRecursive = (test: (e: Element) => boolean, element: Element): Element | null => {
    if (test(element)) return element;

    for (const child of element.children) {
      const foundChild = findElementRecursive(test, child);

      if (foundChild) return foundChild;
    }

    for (const child of element.shadowRoot?.children ?? []) {
      const foundChild = findElementRecursive(test, child);

      if (foundChild) return foundChild;
    }

    return null;
  };
</script>

<div bind:this={containerElement} class="mpf-background" class:mpf-hidden={isHidden}>
  <button class="mpf-toggle" on:click={() => (isHidden = !isHidden)}>
    <i class="mpf-arrow mpf-downleft" />
  </button>
  <div class="mpf-content">
    <div class="mpf-wrapper">
      <div class="mpf-title">{t("fill_header_title")}<br />{t("fill_header_description")}</div>
      <input bind:this={loginElement} id="mpf-login-input" class="form-control mpf-input" type="text" />
      <button class="mpf-button" on:click={onLoginFill}>{t("fill_login")}</button>
      <input bind:this={passwordElement} id="mpf-password-input" class="form-control mpf-input" type="password" />
      <button class="mpf-button" on:click={onPasswordFill}>{t("fill_password")}</button>
    </div></div
  >
</div>

<style lang="scss">
  .mpf-content {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    height: var(--visible-circle-size);
  }

  .mpf-background {
    --ing-color: #ff6200;
    --visible-circle-size: 40rem;
    --toggle-size: 3rem;
    --root-2: 1.4142;
    position: fixed;
    bottom: calc(-1 * var(--visible-circle-size));
    left: calc(-1 * var(--visible-circle-size));
    padding-left: var(--visible-circle-size);
    height: calc(2 * var(--visible-circle-size));
    width: calc(2 * var(--visible-circle-size));
    background-color: var(--ing-color);
    border-radius: 50%;
    z-index: 99999;
    transition: transform 0.3s ease-out;
  }

  .mpf-hidden {
    transform: translate(
      calc(var(--toggle-size) - var(--visible-circle-size) / var(--root-2)),
      calc(var(--visible-circle-size) / var(--root-2) - var(--toggle-size))
    );
  }

  .mpf-hidden .mpf-downleft {
    transform: rotate(270deg);
    -webkit-transform: rotate(270deg);
  }

  .mpf-wrapper {
    height: calc(var(--visible-circle-size) / var(--root-2));
    width: calc(var(--visible-circle-size) / var(--root-2));
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0 1rem 2.5rem;
  }

  .mpf-title {
    color: #fff;
    white-space: nowrap;
    align-self: flex-start;
  }

  .mpf-input {
    margin: 0.8rem 0 !important;
  }

  .mpf-button {
    width: 50%;
    height: 2.8rem;
    background-color: #fff;
    color: #333;
    border: 1px solid var(--ing-color);

    &:hover {
      background-color: var(--ing-color);
      color: #fff;
      border: 1px solid #fff;
    }
  }

  .mpf-arrow {
    border: solid #fff;
    border-width: 0 3px 3px 0;
    display: inline-block;
    padding: 3px;
  }

  .mpf-downleft {
    transform: rotate(90deg);
    -webkit-transform: rotate(90deg);
  }

  .mpf-toggle {
    width: var(--toggle-size);
    height: var(--toggle-size);
    background-color: transparent;
    border: none;
    padding: 0;
    outline: none;
    position: relative;
    top: calc(var(--visible-circle-size) - (var(--visible-circle-size) / var(--root-2)));
    left: calc(var(--visible-circle-size) / var(--root-2) - var(--toggle-size));
  }
</style>
