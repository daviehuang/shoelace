import SlFormInput from './form-input.component.js';

export * from './form-input.component.js';
export default SlFormInput;

SlFormInput.define('sl-form-input');

declare global {
  interface HTMLElementTagNameMap {
    'sl-form-input': SlFormInput;
  }
}
