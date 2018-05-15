import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ActionDispatcher } from '../../action-dispatcher.js';

class ActionDispatcherTest extends ActionDispatcher(PolymerElement) {
  static get is() {
    return 'action-dispatcher-test';
  }
}

customElements.define(ActionDispatcherTest.is, ActionDispatcherTest);