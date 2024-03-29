import SlSteps from './steps.component.js';

export * from './steps.component.js';
export default SlSteps;

SlSteps.define('sl-steps');

declare global {
  interface HTMLElementTagNameMap {
    'sl-steps': SlSteps;
  }
}
