import '../../../dist/shoelace.js';
import { expect, fixture, html } from '@open-wc/testing';

describe('<sl-step>', () => {
  it('should render a component', async () => {
    const el = await fixture(html` <sl-step></sl-step> `);

    expect(el).to.exist;
  });
});
