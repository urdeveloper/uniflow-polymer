import { PolymerElement} from '@polymer/polymer/polymer-element.js';
import { ActionDispatcher } from '../../action-dispatcher.js';
import { ActionEmitter } from '../../action-emitter.js';
import { actions } from '../scripts/actions.js';

class TodoActionDispatcher extends ActionEmitter(ActionDispatcher(PolymerElement)) {
  static get is() {
    return 'todo-action-dispatcher';
  }

  _updateAllCompleted() {
    if (this.get('state.todoList') && this.get('state.todoList').length) {
      this.set('state.allCompleted',
          this.get('state.todoList').every((item) => item.completed));
    } else {
      this.set('state.allCompleted', false);
    }
  }

  _updateActiveCount() {
    this.set('state.activeCount', this.get('state.todoList').reduce((count, todoItem) => count + (
        todoItem.completed ? 0 : 1), 0));
  }

  [actions.INIT_APPLICATION](details) {
    this._updateAllCompleted();
    this._updateActiveCount();
  }

  [actions.ADD_TODO](details) {
    this.push('state.todoList', {
      text: details.text,
      completed: false
    });
    this._updateAllCompleted();
    this._updateActiveCount();
  }

  [actions.UPDATE_TODO](details) {
    let index = this.get('state.todoList').indexOf(details.model);
    this.set(['state.todoList', index, 'text'], details.text);
  }

  [actions.REMOVE_TODO](details) {
    let index = this.state.todoList.indexOf(details.model);
    this.splice('state.todoList', index, 1);
    this._updateAllCompleted();
    this._updateActiveCount();
  }

  [actions.SELECTION_CHANGED](details) {
    if (details.applyToAll) {
      this.set('state.allCompleted', details.value);
      this.get('state.todoList').forEach((item, index) => {
        this.set(['state.todoList', index, 'completed'],
            details.value);
      });
    } else {
      if (details.model) {
        let index = this.get('state.todoList').indexOf(details.model);
        this.set(['state.todoList', index, 'completed'], details.completed);
      }
      this._updateAllCompleted();
    }
    this._updateActiveCount();
  }

  [actions.CLEAR_COMPLETED](details) {
    let completed = this.get('state.todoList').filter(
        elem => elem.completed);
    completed.forEach(elem => {
      let index = this.state.todoList.indexOf(elem);
      this.splice('state.todoList', index, 1);
    });
    this._updateAllCompleted();
  }
}

customElements.define(TodoActionDispatcher.is, TodoActionDispatcher);
