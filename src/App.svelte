<script lang="ts">
  let containerElement: HTMLDivElement;
  let loginElement: HTMLInputElement;
  let passwordElement: HTMLInputElement;
  let isHidden = false;

  const t = (translationKey: string): string => {
    return chrome.i18n.getMessage(translationKey) ?? translationKey;
  };

  const goToNextLoginStep = () => {
    const ingButtons = document.getElementsByTagName("ing-button");
    const nextStepButton = ingButtons[0] as HTMLButtonElement;

    nextStepButton?.click();
  };

  const fillInput = (input: HTMLInputElement, newValue: string) => {
    const dispatchEvent = (eventName: string) =>
      input.dispatchEvent(
        new Event(eventName, { bubbles: true, cancelable: true })
      );

    input.value = newValue;

    dispatchEvent("input");
    dispatchEvent("keyup");
    dispatchEvent("change");
  };

  const onLoginFill = () => {
    const loginInput = document.getElementById(
      "login-input"
    ) as HTMLInputElement;
    const login = loginElement.value;

    if (loginInput && login?.length > 0) {
      fillInput(loginInput, login);
      goToNextLoginStep();
    }
  };

  const onPasswordFill = () => {
    const maskedBoxIdPrefix = "mask-";
    const maskedInputBoxes = [...document.getElementsByTagName("input")].filter(
      (input) =>
        input.id.startsWith(maskedBoxIdPrefix) && input.type === "password"
    );

    const passwordCharaters = passwordElement.value
      .split("")
      .reduce((map, character, index) => {
        map.set(`${maskedBoxIdPrefix}${index + 1}`, character);
        return map;
      }, new Map<string, string>());

    maskedInputBoxes.forEach((maskedInputBox) => {
      const passwordCharacter = passwordCharaters.get(maskedInputBox.id);

      if (passwordCharacter) {
        fillInput(maskedInputBox, passwordCharacter);
      }
    });

    if (
      maskedInputBoxes.length > 0 &&
      maskedInputBoxes.every((maskedInputBox) => maskedInputBox.value !== "")
    ) {
      goToNextLoginStep();
      onPasswordFilled();
    }
  };

  const onPasswordFilled = () => {
    isHidden = true;

    const checkIfSuccessfullLoginInterval = 500;
    const checkIfSuccessfullLoginTimeout = 10 * checkIfSuccessfullLoginInterval;

    const interval = setInterval(() => {
      const contentElement = document.getElementById("content-region");

      if (contentElement.classList.contains("main-content-region")) {
        fillInput(loginElement, "");
        fillInput(passwordElement, "");
        clearInterval(interval);
      }
    }, checkIfSuccessfullLoginInterval);

    setTimeout(() => {
      clearInterval(interval);
    }, checkIfSuccessfullLoginTimeout);
  };
</script>

<div
  bind:this={containerElement}
  class="mpf-background"
  class:mpf-hidden={isHidden}
>
  <div class="mpf-wrapper">
    <div class="mpf-title">{t("app_title")}</div>
    <input
      bind:this={loginElement}
      id="mpf-login-input"
      class="form-control mpf-input"
      type="text"
    />
    <button class="mpf-button" on:click={onLoginFill}>{t("fill_login")}</button>
    <input
      bind:this={passwordElement}
      id="mpf-password-input"
      class="form-control mpf-input"
      type="password"
    />
    <button class="mpf-button" on:click={onPasswordFill}
      >{t("fill_password")}</button
    >
  </div>
  <button class="mpf-toggle" on:click={() => (isHidden = !isHidden)}>
    <i class="mpf-arrow mpf-upleft" />
  </button>
</div>

<style lang="scss">
  .mpf-background {
    --ing-color: #ff6200;
    --visible-circle-size: 40rem;
    --toggle-size: 3rem;
    --root-2: 1.4142;
    position: fixed;
    top: calc(-1 * var(--visible-circle-size));
    left: calc(-1 * var(--visible-circle-size));
    padding-top: var(--visible-circle-size);
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
      calc(var(--toggle-size) - var(--visible-circle-size) / var(--root-2))
    );
  }

  .mpf-hidden .mpf-upleft {
    transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
  }

  .mpf-wrapper {
    height: calc(var(--visible-circle-size) / var(--root-2));
    width: calc(var(--visible-circle-size) / var(--root-2));
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 1rem;
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

  .mpf-upleft {
    transform: rotate(180deg);
    -webkit-transform: rotate(180deg);
  }

  .mpf-toggle {
    width: var(--toggle-size);
    height: var(--toggle-size);
    background-color: transparent;
    border: none;
    padding: 0;
    outline: none;
    position: relative;
    top: calc(-1 * var(--toggle-size));
    left: calc(var(--visible-circle-size) / 1.4142 - var(--toggle-size));
  }
</style>
