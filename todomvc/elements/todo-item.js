import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { GestureEventListeners } from '@polymer/polymer/lib/mixins/gesture-event-listeners.js';
import { ModelView } from '../../model-view.js';
import './todo-styles.js';
import { actions } from '../scripts/actions.js'

class TodoItem extends ModelView(GestureEventListeners(PolymerElement)) {
  static get template() {
    return html`
    <style include="todo-styles">
       :host {
        display: block;
      }

      li {
        position: relative;
        font-size: 24px;
      }

      li[editing] {
        border-bottom: none;
        padding: 0;
      }

      li[editing] .edit {
        display: block;
        width: 506px;
        padding: 12px 16px;
        margin: 0 0 0 43px;
      }

      li[editing] .view {
        display: none;
      }

      li .toggle {
        text-align: center;
        width: 40px;
        /* auto, since non-WebKit browsers doesn't support input styling */
        height: auto;
        position: absolute;
        top: 9px;
        margin: auto 0;
        border: none;
        /* Mobile Safari */
        -webkit-appearance: none;
        appearance: none;
      }

      li .toggle:after {
        content: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="-10 -18 100 135"><circle cx="50" cy="50" r="50" fill="none" stroke="#ededed" stroke-width="3"/></svg>');
      }

      li .toggle:checked:after {
        content: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="-10 -18 100 135"><circle cx="50" cy="50" r="50" fill="none" stroke="#bddad5" stroke-width="3"/><path fill="#5dc2af" d="M72 25L42 71 27 56l-4 4 20 20 34-52z"/></svg>');
      }

      li label {
        word-break: break-all;
        padding: 15px 60px 15px 15px;
        margin-left: 45px;
        display: block;
        line-height: 1.2;
        transition: color 0.4s;
      }

      li[completed] label {
        color: #d9d9d9;
        text-decoration: line-through;
      }

      li .destroy {
        display: none;
        position: absolute;
        top: 0;
        right: 10px;
        bottom: 0;
        width: 40px;
        height: 40px;
        margin: auto 0;
        font-size: 30px;
        color: #cc9a9a;
        margin-bottom: 11px;
        transition: color 0.2s ease-out;
      }

      li .destroy:hover {
        color: #af5b5e;
      }

      li .destroy:after {
        content: '×';
      }

      li:hover .destroy {
        display: block;
      }

      li[editing]:last-child {
        margin-bottom: -1px;
      }

      li .toggle:after {
        content: url('../resources/unchecked.svg');
      }

      li .toggle:checked:after {
        content: url('../resources/checked.svg');
      }
    </style>

    <li completed\$="[[model.completed]]" editing\$="[[isEditing]]">
      <div class="view">
        <input class="toggle" type="checkbox" checked="[[model.completed]]" on-change="onCompletedChange">
        <label on-dblclick="onViewDblClick">[[model.text]]</label>
        <button class="destroy" on-tap="onDestroyTap"></button>
      </div>
      <input id="text-input" class="edit" hidden="[[!isEditing]]" on-blur="onInputBlur" on-keydown="onInputKeyDown">
    </li>
`;
  }

  static get is() {
    return 'todo-item';
  }


  static get properties() {
    return {
      filterBy: String,
      isEditing: {
        type: Boolean,
        value: false
      }
    }
  }

  onCompletedChange(e) {
    this.emitAction({
      type: actions.SELECTION_CHANGED,
      model: this.model,
      completed: e.target.checked
    });
  }

  _removeTodo() {
    this.emitAction({
      type: actions.REMOVE_TODO,
      model: this.model
    });
  }

  onDestroyTap(e) {
    this._removeTodo();
  }

  onViewDblClick(e) {
    this.$['text-input'].value = this.model.text;
    this.isEditing = true;
    this.$['text-input'].focus();
  }

  onInputBlur(e) {
    if (this.isEditing) {
      this._confirmEdit();
    }
  }

  _confirmEdit() {
    this.emitAction({
      type: actions.UPDATE_TODO,
      model: this.model,
      text: this.$['text-input'].value
    });
    this.isEditing = false;
    if (!this.model.text.trim()) {
      this._removeTodo();
    }
  }

  onInputKeyDown(e) {
    if (e.keyCode == 13) {
      this.$['text-input'].blur();
    } else if (e.keyCode == 27) {
      this.isEditing = false;
    }
  }
}

customElements.define(TodoItem.is, TodoItem);