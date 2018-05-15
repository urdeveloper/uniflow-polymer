import { PolymerElement, html } from "@polymer/polymer/polymer-element.js";
import { StateAware } from "../../state-aware.js";
import "./state-aware-a.js";

class StateAwareB extends StateAware(PolymerElement) {
  static get is() {
    return "state-aware-b";
  }

  static get template() {
    return html`<div id="inner-state">[[state.value]]</div>
        <div id="inner">[[innerValue]]</div>
        <state-aware-a id="a" state-path="state.a"></state-aware-a>`;
  }
}

customElements.define(StateAwareB.is, StateAwareB);
