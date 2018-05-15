import { StateAware } from './state-aware.js';
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

 Some non-visual elements, like action dispatchers, need to modify application
 state, in which case they should have this mixin applied. Implements state-
 aware and re-declares state property with notify attribute. State mutator elements
 are only supposed to exist at the application level.

 @polymer
 @mixinFunction
 @appliesMixin StateAware
*/
export const StateMutator = dedupingMixin((base) =>
  class extends StateAware(base) {

    static get properties() {
      return {
        /**
         * Application state.
         */
        state: {
          type: Object,
          notify: true
        }
      }
    };
  });
