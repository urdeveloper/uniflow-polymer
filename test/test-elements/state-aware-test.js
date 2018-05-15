import { PolymerElement, html } from "@polymer/polymer/polymer-element.js";
import { StateAware } from "../../state-aware.js";

class StateAwareTest extends StateAware(PolymerElement) {
  static get is() {
    return "state-aware-test";
  }
}

customElements.define(StateAwareTest.is, StateAwareTest);
