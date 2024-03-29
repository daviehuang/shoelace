import '../../../dist/shoelace.js';
import { expect, fixture, html } from '@open-wc/testing';

describe('<sl-steps>', () => {
  it('should render a component', async () => {
    const el = await fixture(html` <sl-steps></sl-steps> `);

    expect(el).to.exist;
  });
});
