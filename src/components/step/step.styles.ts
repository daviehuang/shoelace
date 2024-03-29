import { css } from 'lit';

export default css`
  :host {
    position: relative;
    flex: 1;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    transition: var(--transition-1);
    cursor: pointer;

    --neutral-1: 0, 0, 0;
    --neutral-2: 255, 255, 255;
    --accent-1: 60, 100, 240;
    --accent-1b: 70, 110, 250;
    --base-0: 255, 255, 255;
    --base-1: 235, 235, 235;
    --base-2: 245, 245, 245;
    --base-3: 255, 255, 255;
    --base-4: 255, 255, 255;
    --functional-blue: 20, 120, 220;
    --functional-red: 220, 40, 40;
    --functional-yellow: 220, 168, 40;
    --functional-green: 50, 168, 40;
    --text-1: rgba(0, 0, 0, 0.9);
    --text-2: rgba(0, 0, 0, 0.6);
    --text-3: rgba(0, 0, 0, 0.2);
    --shadow-1: 0 2px 8px rgba(0, 0, 0, 0.1), 0 1px 4px rgba(0, 0, 0, 0.05);
    --spacing-s: 10px;
  }
  .circle {
    height: 40px;
    width: 40px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-s);
    border-radius: 50%;
    background-color: rgba(var(--neutral-1), 0.1);
    transition: var(--transition-1);
  }
  .text {
    display: flex;
    flex-direction: column;
  }
  .label {
    font-weight: bold;
  }
  .info {
    color: var(--text-2);
  }
  .label,
  .info {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .label,
  .number,
  kor-icon {
    color: var(--text-2);
  }
  /* line */
  .line {
    background-color: rgba(var(--neutral-1), 0.1);
    position: absolute;
  }
  /* horizontal */
  :host([orientation='horizontal']) {
    justify-content: center;
    flex-direction: column;
    padding: 0 var(--spacing-l);
  }
  :host([orientation='horizontal']) .label,
  :host([orientation='horizontal']) .info {
    text-align: center;
  }
  :host([orientation='horizontal']) .circle + .text {
    margin-top: var(--spacing-xs);
  }
  :host([orientation='horizontal']) .line {
    height: 2px;
    width: calc(50% - 28px);
    top: 19px;
  }
  :host([orientation='horizontal']) .line.before {
    left: 0px;
  }
  :host([orientation='horizontal']) .line.after {
    right: 0px;
  }
  /* vertical */
  :host([orientation='vertical']) {
    justify-content: flex-start;
    flex-direction: row;
    width: 100%;
    height: max-content;
    padding: var(--spacing-l) 0;
  }
  :host([orientation='vertical']) .label,
  :host([orientation='vertical']) .info {
    text-align: left;
  }
  :host([orientation='vertical']) .circle + .text {
    margin-left: var(--spacing-s);
  }
  :host([orientation='vertical']) .line {
    width: 2px;
    height: calc(50% - 28px);
    left: 19px;
  }
  :host([orientation='vertical']) .line.before {
    top: 0px;
  }
  :host([orientation='vertical']) .line.after {
    bottom: 0px;
  }
  /* active */
  :host([active]) .circle {
    background-color: rgb(var(--accent-1));
  }
  :host([active]) .label {
    color: var(--text-1);
  }
  :host([active]) .number,
  :host([active]) kor-icon {
    color: rgba(255, 255, 255, 0.9);
  }
  /* disabled */
  :host([disabled]) {
    pointer-events: none;
  }
  :host([disabled]) .circle,
  :host([disabled]) .text {
    opacity: 0.2;
  }
  /* hover inputs */
  @media (hover: hover) {
    :host(:hover:not([active])) .label,
    :host(:hover:not([active])) .number,
    :host(:hover:not([active])) kor-icon {
      color: var(--text-1);
    }
    :host(:not([active]):not(:active):hover) .circle {
      background-color: rgba(var(--neutral-1), 0.15);
    }
    :host([active]:not(:active):hover) .circle {
      background-color: rgb(var(--accent-1b));
    }
  }
`;
