import { PolymerElement } from "@polymer/polymer/polymer-element.js";
import { ApplicationState } from "../../application-state.js";

class ApplicationStateTest extends ApplicationState(PolymerElement) {
  static get is() {
    return "application-state-test";
  }

  connectedCallback() {
    super.connectedCallback();
    this.state = {
      a: {
        innerValue: "aaa"
      },
      b: {}
    };
  }
}

customElements.define(ApplicationStateTest.is, ApplicationStateTest);
