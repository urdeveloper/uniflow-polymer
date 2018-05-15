import { PolymerElement, html } from "@polymer/polymer/polymer-element.js";
import { ModelView } from "../../model-view.js";

class ModelViewTest extends ModelView(PolymerElement) {
  static get is() {
    return "model-view-test";
  }

  constructor() {
    super();
    this._validation = {
      'foo': (value) => !value ? 'bad foo' : '',
      'xxx': (value) => value == 'yyy' ? 123 : ''
    }
  }

  get validation() {
    return this._validation;
  }
  
  get saveAction() {
    return 'SAVE';
  }

  getMessage(code) {
    return code === 123 ? 'error 123' : '';
  }
}

customElements.define(ModelViewTest.is, ModelViewTest);