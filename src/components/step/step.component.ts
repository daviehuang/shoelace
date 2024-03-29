/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { html } from 'lit';

import { property } from 'lit/decorators.js';
import componentStyles from '../../styles/component.styles.js';
import ShoelaceElement from '../../internal/shoelace-element.js';
import SlButton from '../button/button.js';
import SlIcon from '../icon/icon.js';
import SlIconButton from '../icon-button/icon-button.js';
import styles from './step.styles.js';
import type { CSSResultGroup } from 'lit';

/**
 * @summary Short summary of the component's intended use.
 * @documentation https://shoelace.style/components/step
 * @status experimental
 * @since 2.0
 *
 * @dependency sl-icon
 *
 * @slot - The default slot.
 * @slot example - An example slot.
 *
 * @csspart base - The component's base wrapper.
 *
 * @cssproperty --example - An example CSS custom property.
 */
export default class SlStep extends ShoelaceElement {
  static styles: CSSResultGroup = [componentStyles, styles];
  static dependencies = {
    'sl-icon-button': SlIconButton,
    'sl-button': SlButton,
    'sl-icon': SlIcon
  };

  _first: boolean = false;

  @property({ type: String, reflect: true }) label: string | undefined;
  @property({ type: String, reflect: true }) info: string | undefined;
  @property({ type: String, reflect: true }) icon: string | undefined;
  @property({ type: Number, reflect: true }) index: number | undefined;
  @property({ type: Boolean, reflect: true }) active: boolean | undefined;
  @property({ type: Boolean, reflect: true }) disabled: boolean | undefined;
  @property({ type: Boolean, reflect: true })
  set first(val: boolean) {
    console.log('set first value:', val);
    this._first = val;
  }
  get first() {
    return this._first;
  }

  @property({ type: Boolean, reflect: true }) last: boolean | undefined;
  @property({ type: String, reflect: true }) orientation: 'horizontal' | 'vertical' = 'horizontal';

  render() {
    return html`
      <!-- circle -->
      <div class="circle">
        ${this.icon
          ? html` <sl-icon name="${this.icon}"></sl-icon> `
          : html` <span class="number">${this.index}</span> `}
      </div>
      <!-- text -->
      <div class="text">
        ${this.label ? html` <span class="label">${this.label}</span> ` : ''}
        ${this.info ? html` <span class="info">${this.info}</span> ` : ''}
      </div>
      <!-- lines -->
      ${!this.first ? html` <div class="line before"></div> ` : ''}
      ${!this.last ? html` <div class="line after"></div> ` : ''}
    `;
  }

  attributeChangedCallback(name: string, oldval: string, newval: string) {
    super.attributeChangedCallback(name, oldval, newval);
    // this.dispatchEvent(new Event(`${name}-changed`));
    this.emit('sl-change');
  }

  connectedCallback() {
    super.connectedCallback();
    this.getIndex();

    this.addEventListener('click', this.activeMe);
  }

  disconnectedCallback(): void {
    this.removeEventListener('click', this.activeMe);
  }

  activeMe = () => {
    const siblings: any = this.parentElement?.childNodes;
    siblings.forEach((el: any) => {
      el.active = false;
    });
    (this as any).active = true;
  };

  getIndex() {
    const children = Array.prototype.slice.call(this.parentElement?.children);
    this.index = children.indexOf(this) + 1;
    console.log('my index: ', this.index);
  }
}
