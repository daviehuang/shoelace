import { css } from 'lit';

export default css`
  :host {
    display: inline-flex;
  }
  .cs-dateinput-container {
    width: 100%;
  }
  .cs-calendar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    color: black;
    padding: 0 0 0.5rem 0;
    border-bottom: 1px solid lightgrey;

    div.button {
      isplay: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      cursor: pointer;
      &.left {
        padding: 0 8px;
      }
    }
  }
  .cs-disabled {
    opacity: 0.6;
    pointer-events: none;
  }

  .cs-calendar-container {
  }
  .cs-calendar table {
    font-size: 1rem;
  }
  .cs-calendar table td {
    padding: 0.25rem;
  }
  .cs-calendar * {
    box-sizing: border-box;
  }
  table.cs-calendar-body td > span {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    transition: box-shadow 0.2s;
    border: 1px solid transparent;
    color: black;
  }
  table.cs-calendar-body td > span:hover {
    background-color: lightgrey!important;
  }
  table.cs-calendar-body td > span.cs-today {
    color: #0f172a;
    background-color: #e2e8f0;
    border-color: transparent;
  }
  .cs-calendar-body td > span.cs-disabled {
    cursor: default;
  }
  .cs-calendar-body td > span.cs-selected {
    color: #1D4ED8;
    background: #EFF6FF;
  }
  .cs-calendar-body td > span::focus {
    color: #1d4ed8;
    background: #eff6ff;
  }
  .cs-calendar-body td > span {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    margin: 0 auto;
    overflow: hidden;
    position: relative;
  }
  .cs-calendar .cs-calendar-buttonbar {
    padding: 1rem 0;
    border-top: 1px solid #e5e7eb;
  }
  .cs-monthpicker,
  .cs-yearpicker {
    box-sizing: border-box;
    display: table;
  }
  .cs-calendar-month,
  .cs-calendar-year {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    overflow: hidden;
    position: relative;
    box-sizing: border-box;
  }
  .cs-calendar-month {
    width: 30%;
  }
  .cs-calendar-year {
    width: 50%;
  }
  .cs-calendar-buttonbar {
    display: flex;
    justify-content: space-between;
    align-items: center;

    button {
      padding: 1rem;
      border: none;
      background: transparent;

      &:hover {
        color: blue;
        font-weight: bold;
      }
    }
  }
  .cs-dateinput-container {
    position: relative;
  }

  .cs-dateinput-main {
    position: absolute;
    z-index: 1000;
    background: white;
    padding: 0.75rem;
    color: black;
    border: 1px solid lightgrey;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  }
  :host([inline="true"]) .cs-dateinput-main {
    position: relative;
    z-index: 0;
    border: none;
  }
  .hideme {
    display: none;
  }

  .input {
    flex: 1 1 auto;
    display: inline-flex;
    align-items: stretch;
    justify-content: start;
    position: relative;
    width: 100%;
    font-family: var(--sl-input-font-family);
    font-weight: var(--sl-input-font-weight);
    letter-spacing: var(--sl-input-letter-spacing);
    vertical-align: middle;
    overflow: hidden;
    cursor: text;
    transition:
      var(--sl-transition-fast) color,
      var(--sl-transition-fast) border,
      var(--sl-transition-fast) box-shadow,
      var(--sl-transition-fast) background-color;

    &.hideme {
      display: none;
    }
  }

  /* Standard inputs */
  .input--standard {
    background-color: var(--sl-input-background-color);
    border: solid var(--sl-input-border-width) var(--sl-input-border-color);
  }

  .input__control {
    flex: 1 1 auto;
    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;
    min-width: 0;
    height: 100%;
    color: var(--sl-input-color);
    border: none;
    background: inherit;
    box-shadow: none;
    padding: 0;
    margin: 0;
    cursor: inherit;
    -webkit-appearance: none;
  }
  .input__control:focus {
    outline: none;
  }
  .input__control::placeholder {
    color: var(--sl-input-placeholder-color);
    user-select: none;
    -webkit-user-select: none;
  }
  .input--medium {
    border-radius: var(--sl-input-border-radius-medium);
    font-size: var(--sl-input-font-size-medium);
    height: var(--sl-input-height-medium);
  }

  .input--medium .input__control {
    height: calc(var(--sl-input-height-medium) - var(--sl-input-border-width) * 2);
    padding: 0 var(--sl-input-spacing-medium);
  }

  sl-icon-button::part(base) {
    color: black;
  }
`;
