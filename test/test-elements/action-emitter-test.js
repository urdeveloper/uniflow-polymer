import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ActionEmitter } from '../../action-emitter.js';

class ActionEmitterTest extends ActionEmitter(PolymerElement) {
  static get is() {
    return 'action-emitter-test';
  }
}

customElements.define(ActionEmitterTest.is, ActionEmitterTest);