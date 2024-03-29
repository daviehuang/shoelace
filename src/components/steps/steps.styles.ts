import { css } from 'lit';

export default css`
  :host {
    display: flex;
    width: 100%;
    height: max-content;
    overflow: auto;
  }
  /* vertical */
  :host([orientation='vertical']) {
    flex-direction: column;
  }
`;
