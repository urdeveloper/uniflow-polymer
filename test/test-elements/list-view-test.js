import { PolymerElement, html } from "@polymer/polymer/polymer-element.js";
import { ListView } from "../../list-view.js";

class ListViewTest extends ListView(PolymerElement) {
  static get is() {
    return "list-view-test";
  }
}

customElements.define(ListViewTest.is, ListViewTest);
