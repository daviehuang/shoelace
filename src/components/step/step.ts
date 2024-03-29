import SlStep from './step.component.js';

export * from './step.component.js';
export default SlStep;

SlStep.define('sl-step');

declare global {
  interface HTMLElementTagNameMap {
    'sl-step': SlStep;
  }
}
