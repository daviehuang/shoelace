/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { html } from 'lit';
import { property } from 'lit/decorators.js';
// import { LocalizeController } from '../../utilities/localize.js';
// import { watch } from '../../internal/watch.js';
import componentStyles from '../../styles/component.styles.js';
import ShoelaceElement from '../../internal/shoelace-element.js';
import styles from './steps.styles.js';
import type { CSSResultGroup } from 'lit';

/**
 * @summary Short summary of the component's intended use.
 * @documentation https://shoelace.style/components/steps
 * @status experimental
 * @since 2.0
 *
 * @dependency sl-example
 *
 * @slot - The default slot.
 *
 * @event sl-change - Emitted when an alteration to the control's value is committed by the user.
 *
 * @csspart base - The component's base wrapper.
 */
export default class SlSteps extends ShoelaceElement {
  static styles: CSSResultGroup = [componentStyles, styles];

  // private readonly localize = new LocalizeController(this);

  /** Child Elements display direction. */
  @property({ type: String, reflect: true }) orientation: 'horizontal' | 'vertical' = 'horizontal';

  render() {
    return html`
      <slot
        @slotchange="${() => {
          this.handleOrientation();
          this.handleItems();
          // setTimeout(() => {
          //   this.handleItems();
          // }, 100);
        }}"
      ></slot>
    `;
  }

  attributeChangedCallback(name: string, oldval: string, newval: string) {
    super.attributeChangedCallback(name, oldval, newval);
    // this.dispatchEvent(new Event(`${name}-changed`));
    this.emit('sl-change');
  }

  handleOrientation() {
    (this.childNodes as NodeListOf<any>).forEach((el: any) => {
      el.orientation = this.orientation;
    });
  }

  handleItems() {
    const items = Array.prototype.slice.call(this.children);
    const length = this.children.length;
    console.log('step items length:', length);
    items.forEach((el: any, index: number) => {
      if (!el.index) el.index = index + 1;
      el.first = el.index === 1;
      el.last = el.index === length;
    });
  }
}
