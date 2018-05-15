import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/app-route/app-route.js';
import '@polymer/app-route/app-location.js';
import '@polymer/iron-localstorage/iron-localstorage.js';
import { ActionEmitter } from '../../action-emitter.js';
import { ApplicationState } from '../../application-state.js';
import './todo-header.js';
import './todo-items.js';
import './todo-footer.js';
import './todo-action-dispatcher.js';
import './todo-styles.js';
import {actions} from '../scripts/actions.js';

class TodoApp extends ActionEmitter(ApplicationState(PolymerElement)) {
  static get template() {
    return html`
    <style include="todo-styles">

    </style>

    <todo-action-dispatcher state="{{state}}"></todo-action-dispatcher>
    <section class="todoapp">
      <app-location route="{{route}}" use-hash-as-path=""></app-location>
      <app-route route="{{route}}" pattern="/:filterBy" data="{{routeData}}"></app-route>
      <iron-localstorage name="todo-list" value="{{state.todoList}}" on-iron-localstorage-load-empty="onStorageLoadEmpty" on-iron-localstorage-load="onStorageLoad">
      </iron-localstorage>
      <todo-header></todo-header>
      <template is="dom-if" if="[[state.todoList.length]]">
        <!-- This section should be hidden by default and shown when there are todos -->
        <section class="main">
          <input class="toggle-all" type="checkbox" checked="[[state.allCompleted]]" on-change="onAllCompletedChange">
          <label for="toggle-all">Mark all as complete</label>
          <todo-items id="list" list="[[state.todoList]]" filter-by="[[routeData.filterBy]]">
          </todo-items>
        </section>
        <!-- This footer should hidden by default and shown when there are todos -->
        <todo-footer filter-by="[[routeData.filterBy]]">
        </todo-footer>
      </template>
    </section>
`;
  }

  static get is() {
    return 'todo-app';
  }

  static get properties() {
    return {
      route: Object,
      routeData: Object
    }
  }

  ready() {
    super.ready();
    this.set('state', {
      allCompleted: false,
      activeCount: 0
    });
  }

  onStorageLoadEmpty() {
    this.set('state.todoList', []);
  }

  onStorageLoad() {
    this.emitAction({
      type: actions.INIT_APPLICATION
    });
  }
}

customElements.define(TodoApp.is, TodoApp);
