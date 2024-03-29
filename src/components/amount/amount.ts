import SlAmount from './amount.component.js';

export * from './amount.component.js';
export default SlAmount;

SlAmount.define('sl-amount');

declare global {
  interface HTMLElementTagNameMap {
    'sl-amount': SlAmount;
  }
}
