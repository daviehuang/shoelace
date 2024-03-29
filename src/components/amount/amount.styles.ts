import { css } from 'lit';

export default css`
  :host {
    display: block;
  }

  .amt-container {
    display: flex; /* 使用Flexbox布局 */
    border: solid 1px lightgrey;
    border-radius: 4px;
    font-size: 1.5rem;
    box-sizing: border-box;
    padding: 0 5px;
    .amt-ccy {
      flex: 0;
      box-sizing: border-box;
    }

    .amt-amt {
      flex: 1; /* 左边子div充满剩余空间 */
      box-sizing: border-box;
      padding-top: -3px;
    }
  }
`;
