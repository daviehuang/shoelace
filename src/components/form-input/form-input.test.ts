import '../../../dist/shoelace.js';
import { expect, fixture, html } from '@open-wc/testing';

describe('<sl-form-input>', () => {
  it('should render a component', async () => {
    const el = await fixture(html` <sl-form-input></sl-form-input> `);

    expect(el).to.exist;
  });
});
