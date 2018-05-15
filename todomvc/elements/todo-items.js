import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { StateAware } from '../../state-aware.js';
import { ListView } from '../../list-view.js';
import './todo-item.js';
import './todo-styles.js';
import { actions } from '../scripts/actions.js'

class TodoItems extends ListView(StateAware(PolymerElement)) {
  static get template() {
    return html`
    <style include="todo-styles">
      :host {
        display: block;
      }

      todo-item {
        border-top: 1px solid #ededed;
      }

      todo-item:first-child {
        border-top: none;
      }
    </style>

    <section class="main">
      <input id="ta" class="toggle-all" type="checkbox" checked="[[state.allCompleted]]" on-change="onAllCompletedChange">
      <label for="ta">Mark all as complete</label>
      <ul class="todo-list">
        <template is="dom-repeat" id="list-template" items="[[list]]" as="todoItem" filter="[[filterList(filterBy)]]" observe="completed">
          <todo-item model="[[todoItem]]"></todo-item>
        </template>
      </ul>
    </section>
`;
  }

  static get is() {
    return 'todo-items';
  }

  filterList(filterBy) {
    return function (item) {
      switch (filterBy) {
        case 'active':
          return !item.completed;
        case 'completed':
          return item.completed;
        default:
          return true;
      }
    };
  }

  onAllCompletedChange(event) {
    this.emitAction({
      type: actions.SELECTION_CHANGED,
      applyToAll: true,
      value: event.target.checked
    })
  }
}

customElements.define(TodoItems.is, TodoItems);
