import { PolymerElement, html } from "@polymer/polymer/polymer-element.js";
import { ActionDispatcher } from "../../action-dispatcher.js";
import "./action-dispatcher-test.js";

class NestedActionDispatcherTest extends ActionDispatcher(PolymerElement) {
  static get is() {
    return "nested-action-dispatcher-test";
  }

  static get template() {
    return html`<action-dispatcher-test id="inner"></action-dispatcher-test>`;
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

customElements.define(
  NestedActionDispatcherTest.is,
  NestedActionDispatcherTest
);
