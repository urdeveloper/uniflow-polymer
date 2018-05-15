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
 Whenever element needs to emit an action, this mixin should be applied.
 Action object must always include type property.

 @polymer
 @mixinFunction
*/
export const ActionEmitter = dedupingMixin((base) =>
  class extends base {

    /**
     * Fired when action is emitted to be processed by action dispatcher.
     *
     * @event dispatch-action
     */

    /**
     * Emits the action described by detail parameter. Detail object must always
     * include type property. To emit the action we use custom event
     * mechanism. Application element listens to the `dispatch-action` event and
     * invokes `dispatchAction` methods for all action dispatchers associated with
     * the application. Make sure your element is attached to DOM tree, otherwise
     * event will never reach your application element. It is a good practice to
     * ensure that `state` property is initialized (for state-aware elements) before
     * emitting any actions (as `state` property is initialized on attach).
     *
     * @param {*} detail
     */
    emitAction(detail) {
      if (detail.path && this.statePath) {
        if (!detail.path.startsWith('state.')) {
          detail.path = this.statePath + '.' + detail.path;
        }
      }
      
      this.dispatchEvent(new CustomEvent('dispatch-action', {
        detail,
        bubbles: true,
        composed: true
      }));
    }

  });
