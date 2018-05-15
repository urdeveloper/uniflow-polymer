import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { ActionEmitter } from '../../action-emitter.js';
import {StateAware} from '../../state-aware.js';
import './todo-styles.js';
import { actions } from '../scripts/actions.js'

class TodoHeader extends ActionEmitter(PolymerElement) {
  static get template() {
    return html`
    <style include="todo-styles">

    </style>

    <header class="header">
      <h1>todos</h1>
      <input class="new-todo" placeholder="What needs to be done?" value="{{todoText::input}}" on-keydown="onInputKeyDown" autofocus="">
    </header>
`;
  }

  static get is() {
    return 'todo-header';
  }

  static properties() {
    return {
      todoText: String
    }
  }

  onInputKeyDown(e) {
    if (e.keyCode == 13 && this.todoText.trim().length) {
      this.emitAction({
        type: actions.ADD_TODO,
        text: this.todoText
      });
      this.todoText = '';
    }
  }
}

customElements.define(TodoHeader.is, TodoHeader);
