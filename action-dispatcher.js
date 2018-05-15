import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';

import { StateAware } from './state-aware.js';
import { StateMutator } from './state-mutator.js';

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
 Use UniFlow.ActionDispatcher for non-visual elements that process actions emitted by visual
 elements. Action dispatchers usually placed at the application level. Each action dispatcher
 element gets a chance to process the action in the order the elements are present in the
 DOM tree. It is important that action dispatcher elements get two-way data binding to
 application state as follows:

    <action-dispatcher state="{{state}}"></action-dispatcher>

 Action dispatcher elements can include nested action dispatchers, so you can have a
 hierarchical organization of action dispatchers.

 ### Example:
    import {PolymerElement, html} from '@polymer/polymer/polymer-element.js'
    import {ActionDispatcher} from '@google/uniflow-polymer/action-dispatcher.js';

    class ParentDispatcher extends ActionDispatcher(PolymerElement) {
          static get is() { return 'parent-dispatcher'; }

          static get template() {
            return html`
              <child-dispatcher-a state="{{state}}"></child-dispatcher-a>
              <child-dispatcher-b state="{{state}}"></child-dispatcher-b>
            `;
          }

          MY_ACTION(detail) {
            // do MY_ACTION processing here
            // return false if you want to prevent other action dispatchers from
            // further processing of this action
          };
        }

    customElements.define(ParentDispatcher.is, ParentDispatcher);

 @polymer
 @mixinFunction
 @appliesMixin StateMutator
 */
export const ActionDispatcher = dedupingMixin((base) =>
    class extends StateMutator(base) {
      static get properties() {
        return {
          actionDispatcher: {
            type: Boolean,
            value: true,
            reflectToAttribute: true
          }
        }
      }

      /**
       * Dispatches action by invoking the method with the name that matches
       * action type (`detail.type`) passing detail object as a parameter;
       * also selects all children action dispatchers in the element's DOM tree and
       * invokes dispatchAction method on them. False returned by an action dispatcher method
       * results in dispatchAction method returning false (which in turn stops further processing
       * of the action by other action dispatchers).
       *
       * @param {{type: string}} detail
       * @return {boolean}
       */
      dispatchAction(detail) {
        if (this[detail.type] && typeof this[detail.type] === 'function') {
          if (this[detail.type](detail) === false) {
            return false;
          }
        }
        //dispatch action on nested dispatchers
        var nodes = this.root ? this.root.querySelectorAll('[action-dispatcher]') : [];
        return Array.prototype.every.call(nodes,
            (element) => element.dispatchAction(detail) !== false);
      }

    });
