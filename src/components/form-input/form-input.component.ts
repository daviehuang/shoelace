/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { html } from 'lit';
import { property } from 'lit/decorators.js';
// import { LocalizeController } from '../../utilities/localize.js';

import { watch } from '../../internal/watch.js';
import componentStyles from '../../styles/component.styles.js';
import ShoelaceElement, { type ShoelaceFormControl } from '../../internal/shoelace-element.js';
import SlInput from '../input/input.js';
import styles from './form-input.styles.js';
import type { CSSResultGroup } from 'lit';

/**
 * @summary Short summary of the component's intended use.
 * @documentation https://shoelace.style/components/form-input
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
export default class SlFormInput extends ShoelaceElement {
  static styles: CSSResultGroup = [componentStyles, styles];
  static dependencies = { 'sl-input': SlInput };

  // private readonly localize = new LocalizeController(this);

  /** An example attribute. */
  @property() attr = 'example';

  @property() name: string = '';

  _value: string = '';
  @property()
  set value(val: string) {
    this._value = val;
    this._internalAttach.setFormValue(val);
  }
  get value() {
    return this._value;
  }

  @watch('example')
  handleExampleChange() {
    // do something
  }

  _internalAttach: ElementInternals;

  static get formAssociated() {
    return true;
  }

  get form() {
    return this.closest('form');
  }

  constructor() {
    super();
    this._internalAttach = this.attachInternals();
  }

  reset() {
    this.value = '';
  }
  checkValidity() {
    // 实现自定义的验证逻辑
    return true; // 假设总是有效的
  }
  reportValidity() {
    // 验证组件的值
    return true; // 根据需要实现验证逻辑
  }

  render() {
    return html` <sl-input @input=${this.inputHandler} type="text" name=${this.name} value=${this.value}></sl-input>`;
  }

  inputHandler = (event: Event) => {
    const target = event.target as ShoelaceFormControl;
    this.value = target.value as string;
    // this._internalAttach.setFormValue(this.value);
  };
}
