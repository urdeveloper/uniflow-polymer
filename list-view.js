import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';
import { ActionEmitter} from './action-emitter.js';

/*
Copyright 2018 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

/**

 This mixin used by elements that need to render multiple models backed
 by 'list' array. You may want to use ModelView to render individual
 models in the list. The mixin supports element selection by setting predefined
 $selected property on list elements.

 ### Example:
    import {PolymerElement, html} from '@polymer/polymer/polymer-element.js'
    import {StateAware} from '@google/uniflow-polymer/state-aware.js';
    import {ListView} from '@google/uniflow-polymer/list-view.js';
    
    
    class ListElement extends StateAware(ListView(PolymerElement)) {
      static get is() { return "list-element"; }

      static get template() {
        return html`
          <ul>
            <template id="list-template" is="dom-repeat" items="[[list]]">
              <li id="[[item.id]]">
                <paper-checkbox checked="{{item.$selected}}">
                <model-view state-path="[[statePath]].list.#[[index]]"></model-view>
              </li>
            </template>
          </ul>
          Selected: [[selectedCount]] items
          <paper-button on-tap="onDeleteTap">Delete</paper-button>
        `;
      }

      onDeleteTap() {
        this.deleteSelected();
      }
    }

    customElements.define(ListElement.is, ListElement);

 In the example above list view element is also state-aware, meaning it has its own place
 in the application state tree. Assuming it has been declared as follows:

     <list-element state-path="state.listElement"></list-element>

 it will be rendering `state.listElement.list` and observing changes to it. Each `model-view`
 within dom-repeat template will have `state-path` property  set to
 `state.listElement.list.#<index>`  where `index` is the element's index in the array.


 @polymer
 @mixinFunction
 @appliesMixin ActionEmitter
*/
export const ListView = dedupingMixin((base) =>
  class extends ActionEmitter(base) {
    static get properties() {
      return {

        /**
         * Array which data is to be rendered by the element.
         */
        list: {
          type: Array,
          value: () => []
        },

        /**
         * If element supports item selection (using meta-property $selected) then
         * selectedCount property will keep track of number of selected items.
         */
        selectedCount: {
          type: Number,
          notify: true,
          value: 0,
        },

        /**
         * Action name that will be emitted when deleteSelected method is called
         * without parameter.
         */
        deleteAction: String

      }
    }

    static get observers() {
      return [
        'itemChanged_(list.*)',
      ]
    }

    /**
     * Whenever list is set or mutated (elements added/removed), as well as
     * meta-property $selected is modified, updates selectedCount.
     * @param {!Object} change
     * @private
     */
    itemChanged_(change) {
      if (this.get('list') &&
        (change.path == 'list' ||
          change.path == 'list.splices' ||
          change.path.endsWith('$selected'))) {
        this.updateSelectedCount_();
      }
    }

    /**
     * Updates selectedCount property of the element by iterating the list and
     * counting each item that has meta-property $selected set.
     * @private
     */
    updateSelectedCount_() {
      let selectedCount = 0;
      this.get('list').forEach((elem) => {
        selectedCount += elem.$selected ? 1 : 0;
      });
      this.selectedCount = selectedCount;
    }

    /**
     * Emits deleteAction for each selected element in the list (for which
     * meta-property $selected is set).
     * @param {string=} deleteAction Action type for the action that  will be emitted
     *     for each selected element. If not specified, `deleteAction` property of the element
     *     will be used.
     */
    deleteSelected(deleteAction) {
      deleteAction = deleteAction || this.deleteAction;
      if (deleteAction) {
        this.list.forEach(item => {
          if (item.$selected) {
            this.emitAction({
              type: deleteAction,
              item: item
            });
          }
        });
      } else {
        console.warn('delete action is not defined');
      }
    }

  });
