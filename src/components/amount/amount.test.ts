import '../../../dist/shoelace.js';
import { expect, fixture, html } from '@open-wc/testing';

describe('<sl-amount>', () => {
  it('should render a component', async () => {
    const el = await fixture(html` <sl-amount></sl-amount> `);

    expect(el).to.exist;
  });
});
