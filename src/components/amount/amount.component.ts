import { html } from 'lit';
import { property } from 'lit/decorators.js';
// import { LocalizeController } from '../../utilities/localize.js';
import { watch } from '../../internal/watch.js';
import componentStyles from '../../styles/component.styles.js';
import ShoelaceElement from '../../internal/shoelace-element.js';
import styles from './amount.styles.js';
import type { CSSResultGroup } from 'lit';

/**
 * @summary Short summary of the component's intended use.
 * @documentation https://shoelace.style/components/amount
 * @status experimental
 * @since 2.0
 *
 * @dependency sl-example
 *
 *
 * @slot - The default slot.
 * @slot example - An example slot.
 *
 * @csspart base - The component's base wrapper.
 *
 * @cssproperty --example - An example CSS custom property.
 */
export default class SlAmount extends ShoelaceElement {
  static styles: CSSResultGroup = [componentStyles, styles];

  // private readonly localize = new LocalizeController(this);

  /** An example attribute. */
  @property() attr = 'example';

  @watch('example')
  handleExampleChange() {
    // do something
  }

  render() {
    return html`<div class="amt-container">
      <span class="amt-amt"><slot name="amt"></slot></span><span class="amt-ccy"><slot name="ccy"></slot></span>
      <div></div>
    </div>`;
  }
}
