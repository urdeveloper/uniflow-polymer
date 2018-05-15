import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { GestureEventListeners } from '@polymer/polymer/lib/mixins/gesture-event-listeners.js';
import { ActionEmitter } from '../../action-emitter.js';
import { StateAware } from '../../state-aware.js';
import './todo-styles.js';
import { actions } from '../scripts/actions.js';

class TodoFooter extends GestureEventListeners(ActionEmitter(StateAware(PolymerElement))) {
  static get template() {
    return html`
    <style include="todo-styles">
      .filters li a[selected] {
        border-color: rgba(175, 47, 47, 0.2);
      }
    </style>

    <footer class="footer">
      <span class="todo-count">
        <strong>[[state.activeCount]]</strong>
        item<span hidden\$="[[isEqual(state.activeCount, 1)]]">s</span> left
      </span>
      <ul class="filters">
        <li>
          <a selected\$="[[!filterBy]]" href="#/">All</a>
        </li>
        <li>
          <a selected\$="[[isEqual(filterBy, 'active')]]" href="#/active">Active</a>
        </li>
        <li>
          <a selected\$="[[isEqual(filterBy, 'completed')]]" href="#/completed">Completed</a>
        </li>
      </ul>
      <!-- Hidden if no completed items are left -->
      <template is="dom-if" if="[[completedCount]]">
        <button class="clear-completed" on-tap="onClearCompletedButtonTap">Clear completed</button>
      </template>
    </footer>
`;
  }

  static get is() {
    return 'todo-footer';
  }

  static get properties() {
    return {
      filterBy: String,
      completedCount: {
        type: Number,
        computed: 'getCompletedCount(state.todoList.length, state.activeCount)'
      }
    }
  }

  isEqual(val1, val2) {
    return val1 == val2;
  }

  getCompletedCount(totalCount, activeCount) {
    return totalCount - activeCount;
  }

  onClearCompletedButtonTap() {
    this.emitAction({
      type: actions.CLEAR_COMPLETED
    })
  }
}

customElements.define(TodoFooter.is, TodoFooter);
