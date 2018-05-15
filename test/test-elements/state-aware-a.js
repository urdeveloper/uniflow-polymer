import { PolymerElement, html } from "@polymer/polymer/polymer-element.js";
import { StateAware } from "../../state-aware.js";

class StateAwareA extends StateAware(PolymerElement) {
  static get is() {
    return "state-aware-a";
  }

  static get template() {
    return html`<div id="inner">[[innerValue]]</div>`;
  }
}

customElements.define(StateAwareA.is, StateAwareA);
