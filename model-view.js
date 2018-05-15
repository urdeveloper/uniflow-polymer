import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';
import { ActionEmitter } from './action-emitter.js';

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

 Element rendering data represented by a single object (model) in the
 application state should use ModelView mixin. Model View is a powerful
 concept that encapsulates model data (likely the data received from the
 server and to be persisted to the server if modified as a result of user
 actions), status (validity of the data, flag that data was modified,
 notifications for the user, etc.). Auxiliary data supplied by action
 dispatchers and needed for display purposes or element's logic
 should be defined as element’s properties. Same applies to data
 created/modified by the element but not intended to be persisted.
 If `StateAware` mixin is used along with `ModelView`, you can take advantage
 of statePath property that indicates path to the element's state in the
 application state tree. Whenever any data is mutated by action dispatchers
 at statePath or below, the element will receive notification of its
 properties' change (even if there is no explicit binding for those
 properties). See `UniFlow.StateAware` for more details and example.
 ModelView mixin defines some properties that are intended to be overridden
 in the elements:

 + `validation` property allows to specify validation rules
 that will be applied when validateModel() method is called. As a result of
 this method validation status will be updated to indicate result for each
 model field that has validation rule associated with it.
 + `saveAction` property indicates which action should be emitted when
 saveModel method is called to perform save of the model.
 + `getMessage` should be overridden with the function returning message
 string for given error code (to translate validation error code to message)


 ### Example:
    import {PolymerElement, html} from '@polymer/polymer/polymer-element.js'
    import {ModelView} from '@google/uniflow-polymer/model-view.js';

    class MyModel extends ModelView(PolymerElement) {
      static get is() { return "my-model"; }

      static get template() {
        return html`
          Model: [[model.id]]
          <paper-input value="{{model.name}}"
                      label="Name"
                      invalid="[[status.validation.name.invalid]]"
                      error-message="[[status.validation.name.errorMessage]]">
          </paper-input>
          <paper-button on-tap="onSaveTap">Save</paper-button>
        `;
      }
      
      get saveAction() { return 'MY_SAVE' }

      get validation() { return {
        name: (value) => {
          if (!value || !value.trim()) {
            return 'Name is not specified';
          }
        }
      }}

      connectedCallback() {
        this.super();
        this.fetchData();
      },

      fetchData() {
        this.emitAction({
          type: 'MY_FETCH',
          path: 'model'
        });
      },

      onSaveTap() {
        this.validateAndSave();
      }
    }

    customElements.define(MyModel.is, MyModel);

 In the example above model view has input field for `name` property and Save button. On
 element attach the action is emitted to fetch the model's data. Note that in `emitAction()` method
 the path is specified as `'model'`. ActionEmitter mixin is responsible of expanding the path
 with element's state path, ensuring that when action dispatcher gets to process the action, the
 path contains full path in the state tree. So assuming that `my-model` is declared as follows:

    <my-model state-path="state.myModel"></my-model>

 the path in `MY_FETCH` action gets expanded to `state.myModel.model`.

 `validation` property is an object that contains methods for fields validation. The keys in
 this object should match model field names, the values are validation methods. Method receives
 current value of the field and should return non-falsy value (string or error code) if the value
 of the field didn't pass validation. `status.validation` object will be populated with the results
 of validation with the keys matching field names and values being objects containing two fields:
 - `invalid`: true when the value is not valid
 - `errorMessage`: the message to show to user


 So in the example above if user clicks on Save button with name not entered, they will get
 'Name is not specified' error message on the input element. When the name is non-empty, validation
 will pass and `MY_SAVE` action will be emitted with model passed as a parameter and `'model'` as
 path.


 @polymer
 @mixinFunction
 @appliesMixin ActionEmitter
*/
export const ModelView = dedupingMixin((base) =>
  class extends ActionEmitter(base) {

    static get properties() {
      return {

        /**
         * Object containing model data, usually mirroring server-side object.
         */
        model: {
          type: Object
        },

        /**
         * Object to contain model status, including validity of the data,
         * flag that data was modified, notifications for the user, etc.
         */
        status: {
          type: Object
        }

      }
    }

    /**
     * Validation rules for model properties (optional), should be defined in the
     * element.
     * @type {Object|undefined}
     */
    get validation() {
      return undefined;
    }

    /**
     * Save action that will be emitted when saveModel() method is called without
     * parameters.
     * @type {string|undefined}
     */
    get saveAction() {
      return undefined;
    }

    /**
     * Function that translates error code (numeric or text) into human readable
     * error message (used to translate validation error code into error text).
     * @type {Function|undefined}
     */
    getMessage() {
      return undefined;
    }

    static get observers() {
      return [
        'modelViewModelChanged_(model.*)'
      ]
    }

    /**
     * Method emitting passed action or this.saveAction, sending model with
     * the action options.
     * @param {Object|string=} action
     */
    saveModel(action) {
      let actionToEmit = {
        model: this.model
      };
      if (typeof action === 'object') {
        Object.assign(actionToEmit, action);
      } else {
        actionToEmit.type = action;
      }
      if (!actionToEmit.type) {
        actionToEmit.type = this.saveAction;
      }
      if (!actionToEmit.path) {
        actionToEmit.path = 'model';
      }
      this.emitAction(actionToEmit);
    }

    /**
     * Method initializes status.validation object with invalid = false for all
     * keys defined in this.validation object. This is needed for proper UI
     * binding (if the value of invalid attribute is undefined, paper-input is
     * misbehaving).
     * @private
     */
    initValidationStatus_() {
      let validationStatus = {};
      if (this.validation) {
        for (let key of Object.keys(this.validation)) {
          validationStatus[key] = {
            invalid: false
          };
        }
      }
      this.set('status.validation', validationStatus);
    }

    /**
     * Performs validation of model object according to rules defined in
     * this.validation object. Sets status.validation.<property-name> fields with
     * two properties: invalid and errorMessage.
     *
     * @return {boolean} True if all fields validated successfully (or
     *     this.validation is not defined in the element).
     */
    validateModel() {
      if (!this.validation) {
        return true;
      }
      let isValid = true;
      for (let key of Object.keys(this.validation)) {
        let result = this.validation[key].call(this,
          this.get('model.' + key));
        let errorMessage = !result || typeof result === 'string' ?
          result : (this.getMessage ? this.getMessage(result) :
            'Message Code ' + result);
        this.set('status.validation.' + key, {
          invalid: !!result,
          errorMessage
        });
        if (result) {
          isValid = false;
        }
      }
      return isValid;
    }

    /**
     * Validates and saves model if there were no validation errors.
     * @param {string=} action Optional action type to emit for save action.
     */
    validateAndSave(action) {
      if (this.validateModel()) {
        this.saveModel(action);
      }
    }

    /**
     * Observer of any changes to the model. Resets status object and initializes
     * validation status.
     * @param {!Object} change
     * @private
     */
    modelViewModelChanged_(change) {
      // Resetting status when model changed
      if (change.path === 'model' && this.get('model')) {
        this.set('status', {
          isModified: false
        });
        this.initValidationStatus_();
      } else {
        if (this.get('model')) {
          this.set('status.isModified', true);
        } else {
          this.set('status', {});
        }
      }
    }

  });
