import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';
import { ActionDispatcher } from './action-dispatcher.js';
import { StateAware } from './state-aware.js';
import { StateMutator} from './state-mutator.js';

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

 Apply this mixin to your main application element. It provides global
 state and functionality to maintain individual elements states. This mixin
 is responsible for notifying all state-aware elements about their state
 changes (provided those elements have `statePath` property defined).
 Only one element in the application is supposed to have this mixin.

 ### Example:
    import {PolymerElement, html} from '@polymer/polymer/polymer-element.js'
    import {ApplicationState} from '@google/uniflow-polymer/application-state.js';
    
    class MyApp extends ApplicationState(PolymerElement) {
      static get is() { return 'my-app'; }

      static get template() {
        return `
          <!-- action dispatchers in the order of action processing -->
          <action-dispatcher-a state="{{state}}"></action-dispatcher-a>
          <action-dispatcher-b state="{{state}}"></action-dispatcher-b>

          <!-- state-aware elements -->
          <some-element state-path="state.someElement"></some-element>
        `;
      }

      connectedCallback() {
        super.ConnectedCallback();

        this.state = {
          someElement: {}
        }
      }
    }

    customElements.define(MyApp.is,MyApp);

 In the example above, `<some-element>` will receive notification of any changes to the state,
 as if it was declared as follows:

     <some-element state="[[state]]"></some-element>

 Also, if `<some-element>` has `propertyA`, on element attach this property will be assigned
 the value of `state.someElement.propertyA`, and receive all notification of the property change
 whenever the corresponding data in state tree changes. This essentially translates to following
 declaration:

     <some-element state="[[state]]"
                   propertyA="[[state.someElement.propertyA]]">
     </some-element>

 Note that data binding is one-way in both cases. Although state-aware elements can modify their
 own state, it is considered their private state and no other elements will be notified of those
 changes.

 @polymer
 @mixinFunction
 @appliesMixin ActionDispatcher
*/
export const ApplicationState = dedupingMixin((base) =>
  class extends ActionDispatcher(base) {

    static get observers() {
      return [
        'stateChanged_(state.*)'
      ]
    }

    /**
     * Application state listens to dispatch-action method and invokes
     * dispatchAction method on itself (which in turn invokes dispatchAction
     * on all action dispatchers declared within application element).
     *
     * @param {!Event} event
     * @private
     */
    onDispatchAction_(event) {
      this.dispatchAction(event.detail);
    }

    /**
     * Called when state.* changes. Notifies state-aware elements of their
     * state changes, if applicable.
     *
     * @param {!Object} change the Polymer change event for the path
     * @private
     */
    stateChanged_(change) {
      this.notifyStateAwareElements_(change);
    }

    /**
     * Iterates through the array of state-aware elements in the application
     * and notifies them about their state change, if applicable. Note that
     * state-aware elements must be attached to DOM tree in order to receive
     * notifications.
     *
     * @param change
     * @private
     */
    notifyStateAwareElements_(change) {
      this.get('application.stateAwareElements').forEach(element => {
        element.notifyPath(change.path, change.value, true);
        if (element.statePath && change.path.startsWith(element.statePath)) {
          let pathToNotify = change.path.slice(element.statePath.length + 1);
          if (pathToNotify) {
            if (element.get(pathToNotify) !== change.value &&
              !change.path.endsWith('.splices')) {
              element.set(pathToNotify, change.value);
            } else {
              element.notifyPath(pathToNotify, change.value, true);
            }
          } else {
            // If pathToNotify empty, that means the whole element state need
            // to be replaced. Iterating through the keys of new value (which
            // has to be an object) and setting element properties with the same
            // name.
            Object.keys(change.value).forEach((key) => {
              element.set(key, change.value[key]);
            });
          }
        }
      });
    }

    /**
     * Sets application.element value to this element (so all state-aware elements
     * have access to application element). Registers event listener to dispatch-action event.
     */
    ready() {
      super.ready();
      this.set('application.element', this);
      this.addEventListener('dispatch-action', (event) => this.onDispatchAction_(event));
    }

  });
