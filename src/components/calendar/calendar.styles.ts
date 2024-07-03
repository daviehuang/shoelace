import { css } from 'lit';

export default css`
  :host {
    display: inline-flex;
  }

  .cs-calendar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    border-bottom: 1px solid lightgrey;
  }
  .cs-disabled {
    opacity: 0.6;
  }

  .cs-calendar-container {
  }
  .cs-calendar table td {
    padding: 0.5rem;
  }
  table.cs-calendar-body td > span {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    transition: box-shadow 0.2s;
    border: 1px solid transparent;
    color: black;
  }
  table.cs-calendar-body td > span:hover {
    background-color: lightgrey!important;
  }
  table.cs-calendar-body td > span.cs-today {
    color: blue;
    background-color: #EFF6FF;
  }
  .cs-calendar-body td > span.cs-disabled {
    cursor: default;
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
  }
  .cs-calendar-month,
  .cs-calendar-year {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    overflow: hidden;
    position: relative;
  }
  .cs-calendar-month {
    width: 30%;
  }
  .cs-calendar-year {
    width: 49%;
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
  }
  :host([inline="true"]) .cs-dateinput-main {
    position: relative;
  }
  .hideme {
    display: none;
  }
`;
