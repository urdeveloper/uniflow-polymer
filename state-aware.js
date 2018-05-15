import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';
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
 Key mixin that must be assigned to all elements that need to access
 application state and/or have access to the application element. The element is
 notified of any changes to application's state, as well as all its properties
 when they're modified by state mutator elements. `state-path` property must
 be used to identify path to element's state in application state tree. 

 ### Example:
    import { PolymerElement} from '@polymer/polymer/polymer-element.js'
    import { StateAware } from '@google/uniflow-polymer/state-aware.js';

    class MyElement extends StateAware(PolymerElement) {
      static get is() { return 'my-element'; }

      static get template() {
        return html`
          <div>Value A: [[state.valueA]]</div>
          <div>Value B: [[valueB]]</div>
        `;
      }

      static get properties() {
        return {
          valueB: String
        }
      }
    }

    customElement.define(MyElement.is, MyElement);

 When above element is declared as follows:

    <my-element state-path="state.myElement"></my-element>

 it will be notified about changes (and render those) to `state.valueA` or
 `state.myElement.valueB` in action dispatchers or other state mutating
 elements.

 @polymer
 @mixinFunction
*/
export const StateAware = dedupingMixin((base) =>
  class extends base {
    static get properties() {
      return {

        /**
         * Application state, shared among application and all state-aware elements.
         * This property is initialized when element is attached.
         */
        state: {
          type: Object
        },

        /**
         * Path to element state in the application state tree.
         */
        statePath: {
          type: String
        },

        stateAware: {
          type: Boolean,
          value: true,
          reflectToAttribute: true
        },

        /**
         * Application-level object that allows all state-aware objects access
         * to application element. This property is shared among all state-aware
         * elements and has element field initialized with reference to application
         * element. Any state-aware element can access application element using
         * `getApplication()` method. Also, all state-aware elements
         * add themselves to `application.stateAwareElements` array on attach (and
         * remove on detach); this list is used to send notification about
         * element state changes.
         */
        application: {
          type: Object,
          value: {
            element: null,
            stateAwareElements: []
          }
        }

      }
    }

    /**
     * Adds this element to the list of state-aware elements in the application.
     * Sets the value of state property to the state of the application element.
     */
    connectedCallback() {
      super.connectedCallback();

      this.push('application.stateAwareElements', this);
      // Copying application's element state to this element. ApplicationState behavior is
      // responsible of notifying state aware elements about application's state changes.
      if (!this.get('state') && this.get('application.element.state')) {
        this.set('state', this.get('application.element.state'));
      }
      // If this element's state exists, the properties ot the element are
      // initialized from state.
      if (this.statePath && this.get(this.statePath)) {
        Object.keys(this.get(this.statePath)).forEach((key) => {
          this.set(key, this.get([this.statePath, key]));
        });
      }
    }

    /**
     * Removes this element from the list of state-aware elements in the
     * application.
     */
    disconnectedCallback() {
      const index = this.application.stateAwareElements.indexOf(this);
      if (index !== -1) {
        this.application.stateAwareElements.splice(index, 1);
      }

      super.disconnectedCallback();
    }

    /**
     * Returns application element.
     * @return {Element}
     */
    getApplication() {
      return this.get('application.element');
    }

  });
