/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { type CSSResultGroup, html } from 'lit';

import ShoelaceElement from '../../internal/shoelace-element.js';

import { classMap } from 'lit/directives/class-map.js';
import { DomHandler } from './domhandler.js';
import { property, query, state } from 'lit/decorators.js';
import componentStyles from '../../styles/component.styles.js';
// import SlButton from '../button/button.component.js';
// import SlIconButton from '../icon-button/icon-button.js';
// import SlInput from '../input/input.js';
import styles from './calendar.styles.js';
import { FormControlController } from '../../internal/form.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';

/**
 * @summary 日历控件，input控件在onFocus时弹出日历让用户选择日期
 * @documentation https://shoelace.style/components/calendar
 * @status stable
 * @since 2.0
 *
 * ===================== TODO: 以下部分需构建完成后重新定义 ======================
 * @dependency sl-icon
 *
 * @slot icon - The default icon to use when no image or initials are present. Works best with `<sl-icon>`.
 *

 */

export interface LocaleSettings {
  firstDayOfWeek?: number;
  dayNames: string[];
  dayNamesShort: string[];
  dayNamesMin: string[];
  monthNames: string[];
  monthNamesShort: string[];
  today: string;
  clear: string;
  dateFormat: string;
  weekHeader?: string;
}

export interface DateMeta {
  day: number;
  month: number;
  year: number;
  otherMonth?: boolean;
  selectable: boolean;
}

export default class SlCalendar extends ShoelaceElement {
  static styles: CSSResultGroup = [componentStyles, styles];
  static dependencies = {
    // 'sl-icon-button': SlIconButton,
    // 'sl-button': SlButton,
    // 'sl-input': SlInput
  };
  @query('.input__control') input: HTMLInputElement;

  @property({ reflect: true }) formId = '';

  @property() defaultDate: Date;

  @property() inputId: string;

  @property() name: string;

  @property() placeholder: string;

  @property() ariaLabelledBy: string;

  @property() disabled: any;

  @property() title: string;

  @property() dateFormat: string = (window as any).SYS_BU_DATE_FORMAT; //'mm/dd/yy';

  @property() multipleSeparator: string = ',';

  @property() rangeSeparator: string = '-';

  @property() inline: boolean = false;

  @property() showOtherMonths: boolean = true;

  @property() selectOtherMonths: boolean;

  @property() showIcon: boolean;

  @property() icon: string = 'pi pi-calendar';

  @property() appendTo: any;

  @property() readonlyInput: boolean;

  @property() shortYearCutoff: any = '+10';

  @property() monthNavigator: boolean;

  @property() yearNavigator: boolean;

  @property() hourFormat: string = '24';

  @property() timeOnly: boolean;

  @property() stepHour: number = 1;

  @property() stepMinute: number = 1;

  @property() stepSecond: number = 1;

  @property() showSeconds: boolean = false;

  @property() required: boolean;

  @property() showOnFocus: boolean = true;

  @property() showWeek: boolean = false;

  @property() dataType: string = 'date';

  @property() selectionMode: string = 'single';

  @property() maxDateCount: number;

  @property() showButtonBar: boolean;

  @property() todayButtonStyleClass: string = 'p-button-text';

  @property() clearButtonStyleClass: string = 'p-button-text';

  @property() autoZIndex: boolean = true;

  @property() baseZIndex: number = 0;

  @property() panelStyleClass: string;

  @property() panelStyle: any;

  @property() keepInvalid: boolean = false;

  @property() hideOnDateTimeSelect: boolean = true;

  @property() numberOfMonths: number = 1;

  @property() view: string = 'date';

  @property() touchUI: boolean;

  @property() timeSeparator: string = ':';

  @property() focusTrap: boolean = true;

  @property() showTransitionOptions: string = '.12s cubic-bezier(0, 0, 0.2, 1)';

  @property() hideTransitionOptions: string = '.1s linear';

  _locale: LocaleSettings = {
    firstDayOfWeek: 0,
    dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    dayNamesMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    monthNames: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ],
    monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    today: 'Today',
    clear: 'Clear',
    dateFormat: 'mm/dd/yy',
    weekHeader: 'Wk'
  };

  @property() tabindex: number;
  // contentViewChild: ElementRef;
  private readonly formControlController = new FormControlController(this, {
    assumeInteractionOn: ['sl-blur', 'sl-input']
  });

  @state()
  _value: any;

  @property()
  set value(v) {
    if (typeof v === 'string') {
      this._value = this.parseValueFromString(v);
    } else {
      this._value = v;
    }
    this.updateInputfield();
  }

  get value() {
    return this.inputFieldValue;
  }

  dates: any[];

  @state()
  months: any[];

  @state()
  monthPickerValues: string[];

  @state()
  yearPickerValues: number[];

  @state()
  weekDays: string[];

  @state()
  currentMonth: number; //当前选择的日期月份

  @state()
  currentYear: number; //当前选择的日期年份

  currentHour: number;

  currentMinute: number;

  currentSecond: number;

  pm: boolean;

  mask?: HTMLDivElement;

  maskClickListener: Function;

  overlay?: HTMLDivElement;

  overlayVisible: boolean;

  onModelChange: (value: any) => {};

  onModelTouched: (value: any) => {};

  calendarElement: any;

  timePickerTimer: any;

  documentClickListener: any;

  ticksTo1970: number;

  yearOptions: number[];

  @state()
  focused: boolean;

  isKeydown: boolean;

  filled: boolean;

  @state()
  inputFieldValue?: string = '';

  _minDate: Date;

  _maxDate: Date;

  _showTime: boolean;

  _yearRange: string;

  preventDocumentListener: boolean;

  _disabledDates: Date[];

  _disabledDays: number[];

  selectElement: any;

  todayElement: any;

  focusElement: any;

  scrollHandler: any;

  documentResizeListener: any;

  navigationState: any = null;

  isMonthNavigate: boolean;

  @property() get minDate(): Date {
    return this._minDate;
  }

  set minDate(date: Date) {
    this._minDate = date;

    if (this.currentMonth !== undefined && this.currentMonth !== null && this.currentYear) {
      this.createMonths(this.currentMonth, this.currentYear);
    }
  }

  @property() get maxDate(): Date {
    return this._maxDate;
  }

  set maxDate(date: Date) {
    this._maxDate = date;

    if (this.currentMonth !== undefined && this.currentMonth !== null && this.currentYear) {
      this.createMonths(this.currentMonth, this.currentYear);
    }
  }

  @property() get disabledDates(): Date[] {
    return this._disabledDates;
  }

  set disabledDates(disabledDates: Date[]) {
    this._disabledDates = disabledDates;
    if (this.currentMonth !== undefined && this.currentMonth !== null && this.currentYear) {
      this.createMonths(this.currentMonth, this.currentYear);
    }
  }

  @property() get disabledDays(): number[] {
    return this._disabledDays;
  }

  set disabledDays(disabledDays: number[]) {
    this._disabledDays = disabledDays;

    if (this.currentMonth !== undefined && this.currentMonth !== null && this.currentYear) {
      this.createMonths(this.currentMonth, this.currentYear);
    }
  }

  @property() get yearRange(): string {
    return this._yearRange;
  }

  set yearRange(yearRange: string) {
    this._yearRange = yearRange;

    if (yearRange) {
      const years = yearRange.split(':');
      const yearStart = parseInt(years[0]);
      const yearEnd = parseInt(years[1]);

      this.populateYearOptions(yearStart, yearEnd);
    }
  }

  @property() get showTime(): boolean {
    return this._showTime;
  }

  set showTime(showTime: boolean) {
    this._showTime = showTime;

    if (this.currentHour === undefined) {
      // this.initTime(this._value || new Date());
    }
    this.updateInputfield();
  }

  @property()
  set locale(newLocale: LocaleSettings) {
    this._locale = newLocale;

    if (this.view === 'date') {
      this.createWeekDays();
      this.createMonths(this.currentMonth, this.currentYear);
    } else if (this.view === 'month') {
      this.createMonthPickerValues();
    }
  }
  get locale() {
    return this._locale;
  }

  connectedCallback() {
    super.connectedCallback();

    this.documentClickListener = this.hideCalendarHandler.bind(this);

    const date = this.defaultDate || new Date();
    this.currentMonth = date.getMonth();
    this.currentYear = date.getFullYear();

    if (this.view === 'date') {
      this.createWeekDays();
      // this.initTime(date);
      this.createMonths(this.currentMonth, this.currentYear);
      this.ticksTo1970 =
        ((1970 - 1) * 365 + Math.floor(1970 / 4) - Math.floor(1970 / 100) + Math.floor(1970 / 400)) *
        24 *
        60 *
        60 *
        10000000;
      console.log('this.months: ', this.months);
    } else if (this.view === 'month') {
      this.createMonthPickerValues();
    }



    console.log('weekdays:', this.weekDays);
  }

  /**
   * 在Web Components规范中，formAssociated 是一个静态属性，它可以被添加到自定义元素中，以确保该元素被视为表单的一部分，并且其值可以在表单提交时被自动收集。
   * 当您在自定义元素类中添加 static get formAssociated() { return true; } 时，您告诉浏览器这个自定义元素应该表现得像一个表单控件。
   */
  static get formAssociated() {
    return true;
  }

  /** Checks for validity but does not show a validation message. Returns `true` when valid and `false` when invalid. */
  checkValidity() {
    return this.input.checkValidity();
  }

  /** Gets the associated form, if one exists. */
  getForm(): HTMLFormElement | null {
    return this.formControlController.getForm();
  }

  /** Checks for validity and shows the browser's validation message if the control is invalid. */
  reportValidity() {
    console.log('reportValidity() is called.');
    return this.input.reportValidity();
    // return null;
  }

  /** Sets a custom validation message. Pass an empty string to restore validity. */
  setCustomValidity(message: string) {
    this.input.setCustomValidity(message);
    this.formControlController.updateValidity();
  }

  /** Gets the validity state object */
  get validity() {
    return this.input.validity;
  }

  /** Gets the validation message */
  get validationMessage() {
    return this.input.validationMessage;
  }

  calendarClickHandler(event: any) {
    event.stopPropagation();
  }

  render() {
    return html`
      <div class="cs-dateinput-container" @click="${this.calendarClickHandler}">
        <div class=${classMap({
        'hideme': this.inline,
        'focus': this.focused,
        'input': true,
        'input--medium': true,
        'input--standard': true
      })}>
          <input
            part="input"
            id="input"
            class="input__control"
            title=${this.title /* An empty title prevents browser validation tooltips from appearing on hover */}
            ?disabled=${this.disabled}
            ?readonly="${true}"
            ?required=${this.required}
            placeholder=${ifDefined(this.placeholder)}
            .value=${live(this.inputFieldValue)}
            autocomplete="false"
            aria-describedby="help-text"
            @focus="${this.focusHandler}"
          />
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar2-day" viewBox="0 0 16 16">
            <path d="M4.684 12.523v-2.3h2.261v-.61H4.684V7.801h2.464v-.61H4v5.332zm3.296 0h.676V9.98c0-.554.227-1.007.953-1.007.125 0 .258.004.329.015v-.613a2 2 0 0 0-.254-.02c-.582 0-.891.32-1.012.567h-.02v-.504H7.98zm2.805-5.093c0 .238.192.425.43.425a.428.428 0 1 0 0-.855.426.426 0 0 0-.43.43m.094 5.093h.672V8.418h-.672z"/>
            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M2 2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z"/>
            <path d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5z"/>
          </svg>          
        </div>
        <div
          class=${classMap({
        'cs-dateinput-main': true,
        'hideme': this.hideCalendar
      })}
        >
          ${this.months.map((month: any) => this.genMonthHtml(month))}
        </div>
      </div>
    `;
  }

  focusHandler() {
    this._hideCalendar = false;
    // const inpElm: any = this.shadowRoot ?.querySelector('sl-input');
    const inpElm = this.input;
    const dateElm: any = this.shadowRoot ?.querySelector('.cs-dateinput-main');
    if (dateElm && inpElm) {
      DomHandler.relativePosition(dateElm, inpElm);
      dateElm.style.display = 'block';
    }
    this.onInputFocus();
    setTimeout(() => {
      this.bindDocumentClickListener();
    }, 100);
  }

  @state() _hideCalendar = true;
  get hideCalendar() {
    return !this.inline && this._hideCalendar;
  }

  genMonthHtml(month: any) {
    const buttonBar = html`<div class="cs-calendar-buttonbar">
      <button type="button" @click=${this.onTodayButtonClick}>${this._locale.today}</button>
      <button type="button" @click=${this.onClearButtonClick}>${this._locale.clear}</button>
    </div> `;

    const dateView = html` <table class="cs-calendar-body">
      <thead>
        ${this.weekDays.map(weekDay => html`<th><span>${weekDay}</span></th>`)}
      </thead>
      <tbody>
        ${month.dates.map((week: any[]) => {
        return html`
            <tr>
              ${week.map(
            d =>
              html`<td @click=${(event: Event) => this.onDateSelect(event, d)}>
                    <span class=${classMap({ 'cs-disabled': !d.selectable, 'cs-today': d.today, 'cs-selected': this.isSelected(d) })}>${d.day}</span>
                  </td>`
          )}
            </tr>
          `;
      })}
      </tbody>
    </table>`;

    const monthView = html`<div class="cs-monthpicker">
      ${this.monthPickerValues ?.map(
        (monthName: string, index: number) => html`
          <span
            @click=${(event: Event) => {
            this.onMonthSelect(event, index);
          }}
            class="cs-calendar-month ${index === this.currentMonth ? 'highlight' : ''}"
            >${monthName}</span
          >
        `
      )}
    </div> `;
    const yearView = html`<div class="cs-yearpicker">
      ${this.yearPickerValues ?.map(
        (yearVal: number) => html`
          <span
            @click=${(event: Event) => {
            this.onYearSelect(event, yearVal);
          }}
            class="cs-calendar-year ${yearVal === this.currentYear ? 'highlight' : ''}"
            >${yearVal}</span
          >
        `
      )}
    </div> `;

    const titleView = () => {
      if (this.view === 'date') {
        return html`
          <span class="button"
            @click=${(event: Event) => {
            this.switchToMonthView(event);
          }}
            variant="text"
            >${this.getMonthName(month.month)}</span
          >
          <span class="button"
            @click=${(event: Event) => {
            this.switchToYearView(event);
          }}
            variant="text"
            >${month.year}</span
          >
        `;
      } else if (this.view === 'month') {
        return html`<span class="button"
          @click=${(event: Event) => {
            this.switchToYearView(event);
          }}
          variant="text"
          >${this.currentYear}</span
        >`;
      } else {
        // this.view === 'year'
        return html`<span
          >${this.yearPickerValues[0] + ' - ' + this.yearPickerValues[this.yearPickerValues.length - 1]}</span
        > `;
      }
    };

    const v = this.view;
    const calendarView = html`<div class="cs-calendar">
      <div class="cs-calendar-header">
        <div class="button left" @click=${this.onPrevButtonClick}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"/>
          </svg>
        </div>
        ${titleView()}
        <div class="button right" @click=${this.onNextButtonClick}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>
          </svg>
        </div>
      </div>
      <div class="cs-calendar-container">${v === 'date' ? dateView : v === 'month' ? monthView : yearView}</div>
      ${this.showButtonBar && this.view === 'date' ? buttonBar : ''}
    </div>`;

    return calendarView;
  }

  getMonthName(monthIndex: number): string {
    return this._locale.monthNames[monthIndex];
  }

  populateYearOptions(start: number, end: number) {
    this.yearOptions = [];

    for (let i = start; i <= end; i++) {
      this.yearOptions.push(i);
    }
  }

  createWeekDays() {
    const weekDays = [];
    let dayIndex = this.locale.firstDayOfWeek || 0;
    for (let i = 0; i < 7; i++) {
      weekDays.push(this.locale.dayNamesMin[dayIndex]);
      dayIndex = dayIndex === 6 ? 0 : ++dayIndex;
    }
    this.weekDays = [...weekDays];
  }

  switchToDateView(event: Event): void {
    this.view = 'date';
    event.preventDefault();
  }

  switchToMonthView(event: Event): void {
    console.log('switch to month view');
    this.createMonthPickerValues();
    this.view = 'month';
    event.preventDefault();
  }

  switchToYearView(event: Event): void {
    this.createYearPickerValues();
    this.view = 'year';
    event.preventDefault();
  }

  /**
   * 月选择器，12个月份
   */
  createMonthPickerValues() {
    const monthPickerValues = [];
    for (let i = 0; i <= 11; i++) {
      monthPickerValues.push(this.locale.monthNamesShort[i]);
    }
    this.monthPickerValues = monthPickerValues;
  }

  /**
   * 年选择器，产生10个年份
   */
  createYearPickerValues() {
    const yearPickerValues = [];
    const base = this.currentYear - (this.currentYear % 10);
    for (let i = 0; i < 10; i++) {
      yearPickerValues.push(base + i);
    }
    this.yearPickerValues = yearPickerValues;
  }

  /**
   * 生成月份选择器内容，一次可以生成多个连续月份，如过月份跨年，则进入下一年月份
   * @param month
   * @param year
   */
  createMonths(month: number, year: number) {
    const months = [];
    for (let i = 0; i < this.numberOfMonths; i++) {
      let m = month + i;
      let y = year;
      if (m > 11) {
        m = (m % 11) - 1;
        y = year + 1;
      }

      months.push(this.createMonth(m, y));
    }
    this.months = [...months];
  }

  /**
   * 这个函数的目的是确定给定日期所在的年份的周数，
   * 按照 ISO 8601 标准，每年的第一周是包含该年第一个星期四的那周。
   * 这种计算方式确保了无论年份的开始是在星期几，每年的周数都是连续的，并且第一周总是包含1月4日。
   * @param date
   * @returns
   */
  getWeekNumber(date: Date) {
    const checkDate = new Date(date.getTime());
    checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));
    const time = checkDate.getTime();
    checkDate.setMonth(0);
    checkDate.setDate(1);
    return Math.floor(Math.round((time - checkDate.getTime()) / 86400000) / 7) + 1;
  }

  /**
   * 这个函数可能是日历组件的一部分，用于生成每个月的日历视图。
   * 它考虑了不同月份的天数，以及跨月份的日期填充，并且可以处理当前日期和可选的周数显示。
   * 通过这种方式，可以生成一个完整的月历，用于前端应用程序的日历展示
   * @param month
   * @param year
   * @returns
   */
  createMonth(month: number, year: number) {
    const dates = [];
    const firstDay = this.getFirstDayOfMonthIndex(month, year);
    const daysLength = this.getDaysCountInMonth(month, year);
    const prevMonthDaysLength = this.getDaysCountInPrevMonth(month, year);
    let dayNo = 1;
    const today = new Date();
    const weekNumbers = [];
    const monthRows = Math.ceil((daysLength + firstDay) / 7);

    for (let i = 0; i < monthRows; i++) {
      const week = [];

      if (i === 0) {
        for (let j = prevMonthDaysLength - firstDay + 1; j <= prevMonthDaysLength; j++) {
          const prev = this.getPreviousMonthAndYear(month, year);
          week.push({
            day: j,
            month: prev.month,
            year: prev.year,
            otherMonth: true,
            today: this.isToday(today, j, prev.month, prev.year),
            selectable: this.isSelectable(j, prev.month, prev.year, true)
          });
        }

        const remainingDaysLength = 7 - week.length;
        for (let j = 0; j < remainingDaysLength; j++) {
          week.push({
            day: dayNo,
            month: month,
            year: year,
            today: this.isToday(today, dayNo, month, year),
            selectable: this.isSelectable(dayNo, month, year, false)
          });
          dayNo++;
        }
      } else {
        for (let j = 0; j < 7; j++) {
          if (dayNo > daysLength) {
            const next = this.getNextMonthAndYear(month, year);
            week.push({
              day: dayNo - daysLength,
              month: next.month,
              year: next.year,
              otherMonth: true,
              today: this.isToday(today, dayNo - daysLength, next.month, next.year),
              selectable: this.isSelectable(dayNo - daysLength, next.month, next.year, true)
            });
          } else {
            week.push({
              day: dayNo,
              month: month,
              year: year,
              today: this.isToday(today, dayNo, month, year),
              selectable: this.isSelectable(dayNo, month, year, false)
            });
          }

          dayNo++;
        }
      }

      if (this.showWeek) {
        weekNumbers.push(this.getWeekNumber(new Date(week[0].year, week[0].month, week[0].day)));
      }

      dates.push(week);
    }

    return {
      month: month,
      year: year,
      dates: dates,
      weekNumbers: weekNumbers
    };
  }

  // initTime(date: Date) {
  //   this.pm = date.getHours() > 11;

  //   if (this.showTime) {
  //     this.currentMinute = date.getMinutes();
  //     this.currentSecond = date.getSeconds();
  //     this.setCurrentHourPM(date.getHours());
  //   } else if (this.timeOnly) {
  //     this.currentMinute = 0;
  //     this.currentHour = 0;
  //     this.currentSecond = 0;
  //   }
  // }

  decrementYear() {
    this.currentYear--;

    if (this.yearNavigator && this.currentYear < this.yearOptions[0]) {
      const difference = this.yearOptions[this.yearOptions.length - 1] - this.yearOptions[0];
      this.populateYearOptions(
        this.yearOptions[0] - difference,
        this.yearOptions[this.yearOptions.length - 1] - difference
      );
    }
  }

  incrementYear() {
    this.currentYear++;

    if (this.yearNavigator && this.currentYear > this.yearOptions[this.yearOptions.length - 1]) {
      const difference = this.yearOptions[this.yearOptions.length - 1] - this.yearOptions[0];
      this.populateYearOptions(
        this.yearOptions[0] + difference,
        this.yearOptions[this.yearOptions.length - 1] + difference
      );
    }
  }
  decrementDecade() {
    this.currentYear -= 10;
    this.createYearPickerValues();
  }

  incrementDecade() {
    this.currentYear += 10;
    this.createYearPickerValues();
  }

  onDateSelect(event: Event, dateMeta: DateMeta) {
    console.log('select date:', dateMeta);
    if (this.disabled || !dateMeta.selectable) {
      event.preventDefault();
      return;
    }

    if (this.isMultipleSelection() && this.isSelected(dateMeta)) {
      this._value = this._value.filter((date: Date) => {
        return !this.isDateEquals(date, dateMeta);
      });
      if (this._value.length === 0) {
        this._value = null;
      }
      this.updateModel(this._value);
    } else {
      if (this.shouldSelectDate()) {
        this.selectDate(dateMeta);
      }
    }

    if (!this.inline) {
      if (this.isSingleSelection() || this.isRangeSelection() && this.isRangeDateCompleted()) {
        this.hideCalendarHandler();
        // this._hideCalendar = true;
        // const dateElm: any = this.shadowRoot ?.querySelector('.cs-dateinput-main');
        // dateElm.style.display = 'none';
      }
    }

    // if (this.isSingleSelection() && this.hideOnDateTimeSelect) {
    //   setTimeout(() => {
    //     event.preventDefault();
    //     this.hideOverlay();

    //     if (this.mask) {
    //       // this.disableModality();
    //     }

    //     // this.cd.markForCheck();
    //   }, 150);
    // }

    this.updateInputfield();

    this.emit('change');
    this.emit('blur');

    // const myEvent = new CustomEvent('change', {
    //   detail: {
    //     message: 'This is my custom event detail.',
    //   },
    //   bubbles: true,
    // });
    // this.dispatchEvent(myEvent);

    event.preventDefault();
  }

  isRangeDateCompleted() {
    return this._value ?.length === 2 && !!this._value[0] && !!this._value[1];
  }

  shouldSelectDate() {
    if (this.isMultipleSelection())
      return this.maxDateCount !== null ? this.maxDateCount > (this._value ? this._value.length : 0) : true;
    else return true;
  }

  // onMonthSelect(event: Event, index: number) {
  //   if (!DomHandler.hasClass(event.target as HTMLElement, 'p-disabled')) {
  //     this.onDateSelect(event, { year: this.currentYear, month: index, day: 1, selectable: true });
  //   }
  // }
  onMonthSelect(_event: Event, index: number) {
    // if (this.view === 'month') {
    //   this.onDateSelect(event, { year: this.currentYear, month: index, day: 1, selectable: true });
    // } else {
    this.currentMonth = index;
    this.createMonths(this.currentMonth, this.currentYear);
    this.view = 'date';
    console.log('currentMonth:', this.currentMonth);
    // this.onMonthChange.emit({ month: this.currentMonth + 1, year: this.currentYear });
    // }
  }

  onYearSelect(event: Event, year: number) {
    // if (this.view === 'year') {
    //   this.onDateSelect(event, { year: year, month: 0, day: 1, selectable: true });
    // } else {
    console.log('You choose year:', year);
    this.currentYear = year;
    this.switchToMonthView(event);
    // this.onYearChange.emit({ month: this.currentMonth + 1, year: this.currentYear });
    // }
  }
  updateInputfield() {
    let formattedValue: any = '';

    if (this._value) {
      if (this.isSingleSelection()) {
        formattedValue = this.formatDateTime(this._value);
      } else if (this.isMultipleSelection()) {
        for (let i = 0; i < this._value.length; i++) {
          const dateAsString = this.formatDateTime(this._value[i]);
          formattedValue += dateAsString;
          if (i !== this._value.length - 1) {
            formattedValue += this.multipleSeparator + ' ';
          }
        }
      } else if (this.isRangeSelection()) {
        if (this._value ?.length) {
          const startDate = this._value[0];
          const endDate = this._value[1];

          formattedValue = this.formatDateTime(startDate);
          if (endDate) {
            formattedValue += ' ' + this.rangeSeparator + ' ' + this.formatDateTime(endDate);
          }
        }
      }
    }

    this.inputFieldValue = formattedValue;
    this.updateFilledState();
    // const inpElm: any = this.shadowRoot ?.querySelector('sl-input');
    // inpElm.value = formattedValue;

    // if (this.inputfieldViewChild?.nativeElement) {
    //   this.inputfieldViewChild.nativeElement.value = this.inputFieldValue;
    // }
  }

  formatDateTime(date: Date) {
    let formattedValue = null;
    if (date) {
      if (this.timeOnly) {
        formattedValue = this.formatTime(date);
      } else {
        formattedValue = this.formatDate(date, this.getDateFormat());
        if (this.showTime) {
          formattedValue += ' ' + this.formatTime(date);
        }
      }
    }

    return formattedValue;
  }

  setCurrentHourPM(hours: number) {
    if (this.hourFormat === '12') {
      this.pm = hours > 11;
      if (hours >= 12) {
        this.currentHour = hours === 12 ? 12 : hours - 12;
      } else {
        this.currentHour = hours === 0 ? 12 : hours;
      }
    } else {
      this.currentHour = hours;
    }
  }

  selectDate(dateMeta: DateMeta) {
    let date = new Date(dateMeta.year, dateMeta.month, dateMeta.day);

    if (this.showTime) {
      if (this.hourFormat === '12') {
        if (this.currentHour === 12) date.setHours(this.pm ? 12 : 0);
        else date.setHours(this.pm ? this.currentHour + 12 : this.currentHour);
      } else {
        date.setHours(this.currentHour);
      }

      date.setMinutes(this.currentMinute);
      date.setSeconds(this.currentSecond);
    }

    if (this.minDate && this.minDate > date) {
      date = this.minDate;
      this.setCurrentHourPM(date.getHours());
      this.currentMinute = date.getMinutes();
      this.currentSecond = date.getSeconds();
    }

    if (this.maxDate && this.maxDate < date) {
      date = this.maxDate;
      this.setCurrentHourPM(date.getHours());
      this.currentMinute = date.getMinutes();
      this.currentSecond = date.getSeconds();
    }

    if (this.isSingleSelection()) {
      this.updateModel(date);
    } else if (this.isMultipleSelection()) {
      this.updateModel(this._value ? [...this._value, date] : [date]);
    } else if (this.isRangeSelection()) {
      if (this._value ?.length) {
        let startDate = this._value[0];
        let endDate = this._value[1];

        if (!endDate && date.getTime() >= startDate.getTime()) {
          endDate = date;
        } else {
          startDate = date;
          endDate = null;
        }

        this.updateModel([startDate, endDate]);
      } else {
        this.updateModel([date, null]);
      }
    }

    // this.onSelect.emit(date);
  }

  updateModel(value: Date | any[] | null) {
    console.log(value); // TO BE REMOVED.
    this._value = value;
    // if (this.dataType === 'date') {
    //   this.onModelChange(this._value);
    // } else if (this.dataType === 'string') {
    //   if (this.isSingleSelection()) {
    //     this.onModelChange(this.formatDateTime(this._value));
    //   } else {
    //     let stringArrValue = null;
    //     if (this._value) {
    //       stringArrValue = this._value.map((date: Date) => this.formatDateTime(date));
    //     }
    //     this.onModelChange(stringArrValue);
    //   }
    // }
  }

  getFirstDayOfMonthIndex(month: number, year: number) {
    const day = new Date();
    day.setDate(1);
    day.setMonth(month);
    day.setFullYear(year);

    const dayIndex = day.getDay() + this.getSundayIndex();
    return dayIndex >= 7 ? dayIndex - 7 : dayIndex;
  }

  getDaysCountInMonth(month: number, year: number) {
    return 32 - this.daylightSavingAdjust(new Date(year, month, 32)).getDate();
  }

  getDaysCountInPrevMonth(month: number, year: number) {
    const prev = this.getPreviousMonthAndYear(month, year);
    return this.getDaysCountInMonth(prev.month, prev.year);
  }

  getPreviousMonthAndYear(month: number, year: number) {
    let m;
    let y;

    if (month === 0) {
      m = 11;
      y = year - 1;
    } else {
      m = month - 1;
      y = year;
    }

    return { month: m, year: y };
  }

  getNextMonthAndYear(month: number, year: number) {
    let m;
    let y;

    if (month === 11) {
      m = 0;
      y = year + 1;
    } else {
      m = month + 1;
      y = year;
    }

    return { month: m, year: y };
  }

  getSundayIndex() {
    return this.locale.firstDayOfWeek! > 0 ? 7 - this.locale.firstDayOfWeek! : 0;
  }

  isSelected(dateMeta: DateMeta): boolean {
    if (this._value) {
      if (this.isSingleSelection()) {
        return this.isDateEquals(this._value, dateMeta);
      } else if (this.isMultipleSelection()) {
        let selected = false;
        for (const date of this._value) {
          selected = this.isDateEquals(date, dateMeta);
          if (selected) {
            break;
          }
        }

        return selected;
      } else if (this.isRangeSelection()) {
        if (this._value[1])
          return (
            this.isDateEquals(this._value[0], dateMeta) ||
            this.isDateEquals(this._value[1], dateMeta) ||
            this.isDateBetween(this._value[0], this._value[1], dateMeta)
          );
        else {
          return this.isDateEquals(this._value[0], dateMeta);
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  isMonthSelected(month: number): boolean {
    const day = this._value ? (Array.isArray(this._value) ? this._value[0].getDate() : this._value.getDate()) : 1;
    return this.isSelected({ year: this.currentYear, month: month, day: day, selectable: true });
  }

  isDateEquals(value: Date, dateMeta: DateMeta) {
    if (value)
      return (
        value.getDate() === dateMeta.day && value.getMonth() === dateMeta.month && value.getFullYear() === dateMeta.year
      );
    else return false;
  }

  isDateBetween(start: Date, end: Date, dateMeta: DateMeta) {
    const between: boolean = false;
    if (start && end) {
      const date: Date = new Date(dateMeta.year, dateMeta.month, dateMeta.day);
      return start.getTime() <= date.getTime() && end.getTime() >= date.getTime();
    }

    return between;
  }

  isSingleSelection(): boolean {
    return this.selectionMode === 'single';
  }

  isRangeSelection(): boolean {
    return this.selectionMode === 'range';
  }

  isMultipleSelection(): boolean {
    return this.selectionMode === 'multiple';
  }

  isToday(today: Date, day: number, month: number, year: number): boolean {
    return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
  }

  isSelectable(day: number, month: number, year: number, otherMonth: boolean): boolean {
    let validMin = true;
    let validMax = true;
    let validDate = true;
    let validDay = true;

    if (otherMonth && !this.selectOtherMonths) {
      return false;
    }

    if (this.minDate) {
      if (this.minDate.getFullYear() > year) {
        validMin = false;
      } else if (this.minDate.getFullYear() === year) {
        if (this.minDate.getMonth() > month) {
          validMin = false;
        } else if (this.minDate.getMonth() === month) {
          if (this.minDate.getDate() > day) {
            validMin = false;
          }
        }
      }
    }

    if (this.maxDate) {
      if (this.maxDate.getFullYear() < year) {
        validMax = false;
      } else if (this.maxDate.getFullYear() === year) {
        if (this.maxDate.getMonth() < month) {
          validMax = false;
        } else if (this.maxDate.getMonth() === month) {
          if (this.maxDate.getDate() < day) {
            validMax = false;
          }
        }
      }
    }

    if (this.disabledDates) {
      validDate = !this.isDateDisabled(day, month, year);
    }

    if (this.disabledDays) {
      validDay = !this.isDayDisabled(day, month, year);
    }

    return validMin && validMax && validDate && validDay;
  }

  isDateDisabled(day: number, month: number, year: number): boolean {
    if (this.disabledDates) {
      for (const disabledDate of this.disabledDates) {
        if (
          disabledDate.getFullYear() === year &&
          disabledDate.getMonth() === month &&
          disabledDate.getDate() === day
        ) {
          return true;
        }
      }
    }

    return false;
  }

  isDayDisabled(day: number, month: number, year: number): boolean {
    if (this.disabledDays) {
      const weekday = new Date(year, month, day);
      const weekdayNumber = weekday.getDay();
      return this.disabledDays.indexOf(weekdayNumber) !== -1;
    }
    return false;
  }

  onInputFocus() {
    this.focused = true;
    if (this.showOnFocus) {
      this.showOverlay();
    }
    this.emit('focus');
  }

  // onInputClick() {
  //   if (this.overlay && this.autoZIndex) {
  //     this.overlay.style.zIndex = String(this.baseZIndex + ++DomHandler.zindex);
  //   }

  //   if (this.showOnFocus && !this.overlayVisible) {
  //     this.showOverlay();
  //   }
  // }

  onInputBlur() {
    this.focused = false;
    this.emit('blur');
    // if (!this.keepInvalid) {
    //   this.updateInputfield();
    // }
    // this.onModelTouched();
  }

  // onButtonClick(event: Event, inputfield: HTMLElement) {
  //   if (!this.overlayVisible) {
  //     inputfield.focus();
  //     this.showOverlay();
  //   } else {
  //     this.hideOverlay();
  //   }
  // }

  onPrevButtonClick(event: Event) {
    this.navigationState = { backward: true, button: true };
    this.navBackward(event);
  }

  onNextButtonClick(event: Event) {
    this.navigationState = { backward: false, button: true };
    this.navForward(event);
  }

  navBackward(event: any) {
    if (this.disabled) {
      event.preventDefault();
      return;
    }

    this.isMonthNavigate = true;

    if (this.view === 'month') {
      this.decrementYear();
      setTimeout(() => {
        // this.updateFocus();
      }, 1);
    } else if (this.view === 'year') {
      this.decrementDecade();
      setTimeout(() => {
        // this.updateFocus();
      }, 1);
    } else {
      if (this.currentMonth === 0) {
        this.currentMonth = 11;
        this.decrementYear();
      } else {
        this.currentMonth--;
      }

      // this.onMonthChange.emit({ month: this.currentMonth + 1, year: this.currentYear });
      this.createMonths(this.currentMonth, this.currentYear);
    }
  }

  navForward(event: any) {
    if (this.disabled) {
      event.preventDefault();
      return;
    }

    this.isMonthNavigate = true;

    if (this.view === 'month') {
      this.incrementYear();
      setTimeout(() => {
        // this.updateFocus();
      }, 1);
    } else if (this.view === 'year') {
      this.incrementDecade();
      setTimeout(() => {
        // this.updateFocus();
      }, 1);
    } else {
      if (this.currentMonth === 11) {
        this.currentMonth = 0;
        this.incrementYear();
      } else {
        this.currentMonth++;
      }

      // this.onMonthChange.emit({ month: this.currentMonth + 1, year: this.currentYear });
      this.createMonths(this.currentMonth, this.currentYear);
    }
  }

  // onContainerButtonKeydown(event: any) {
  //   switch (event.which) {
  //     //tab
  //     case 9:
  //       if (!this.inline) {
  //         this.trapFocus(event);
  //       }
  //       break;

  //     //escape
  //     case 27:
  //       this.overlayVisible = false;
  //       event.preventDefault();
  //       break;

  //     default:
  //       //Noop
  //       break;
  //   }
  // }

  // onInputKeydown(event: KeyboardEvent) {
  //   this.isKeydown = true;
  //   if (event.keyCode === 40 && this.contentViewChild) {
  //     this.trapFocus(event);
  //   } else if (event.keyCode === 27) {
  //     if (this.overlayVisible) {
  //       this.overlayVisible = false;
  //       event.preventDefault();
  //     }
  //   } else if (event.keyCode === 9 && this.contentViewChild) {
  //     DomHandler.getFocusableElements(this.contentViewChild.nativeElement).forEach(el => (el.tabIndex = '-1'));
  //     if (this.overlayVisible) {
  //       this.overlayVisible = false;
  //     }
  //   }
  // }

  // onDateCellKeydown(event: KeyboardEvent, date: Date, groupIndex: number) {
  //   const cellContent = event.currentTarget as HTMLElement;
  //   const cell = cellContent.parentElement;

  //   switch (event.which) {
  //     //down arrow
  //     case 40: {
  //       cellContent.tabIndex = -1;
  //       const cellIndex = DomHandler.index(cell);
  //       const nextRow = cell?.parentElement?.nextElementSibling as HTMLElement;
  //       if (nextRow) {
  //         const focusCell = nextRow.children[cellIndex].children[0];
  //         if (DomHandler.hasClass(focusCell, 'p-disabled')) {
  //           this.navigationState = { backward: false };
  //           this.navForward(event);
  //         } else {
  //           nextRow.children[cellIndex].children[0].tabIndex = 0;
  //           nextRow.children[cellIndex].children[0].focus();
  //         }
  //       } else {
  //         this.navigationState = { backward: false };
  //         this.navForward(event);
  //       }
  //       event.preventDefault();
  //       break;
  //     }

  //     //up arrow
  //     case 38: {
  //       cellContent.tabIndex = '-1';
  //       const cellIndex = DomHandler.index(cell);
  //       const prevRow = cell.parentElement.previousElementSibling;
  //       if (prevRow) {
  //         const focusCell = prevRow.children[cellIndex].children[0];
  //         if (DomHandler.hasClass(focusCell, 'p-disabled')) {
  //           this.navigationState = { backward: true };
  //           this.navBackward(event);
  //         } else {
  //           focusCell.tabIndex = '0';
  //           focusCell.focus();
  //         }
  //       } else {
  //         this.navigationState = { backward: true };
  //         this.navBackward(event);
  //       }
  //       event.preventDefault();
  //       break;
  //     }

  //     //left arrow
  //     case 37: {
  //       cellContent.tabIndex = '-1';
  //       const prevCell = cell.previousElementSibling;
  //       if (prevCell) {
  //         const focusCell = prevCell.children[0];
  //         if (
  //           DomHandler.hasClass(focusCell, 'p-disabled') ||
  //           DomHandler.hasClass(focusCell.parentElement, 'p-datepicker-weeknumber')
  //         ) {
  //           this.navigateToMonth(true, groupIndex);
  //         } else {
  //           focusCell.tabIndex = '0';
  //           focusCell.focus();
  //         }
  //       } else {
  //         this.navigateToMonth(true, groupIndex);
  //       }
  //       event.preventDefault();
  //       break;
  //     }

  //     //right arrow
  //     case 39: {
  //       cellContent.tabIndex = '-1';
  //       const nextCell = cell.nextElementSibling;
  //       if (nextCell) {
  //         const focusCell = nextCell.children[0];
  //         if (DomHandler.hasClass(focusCell, 'p-disabled')) {
  //           this.navigateToMonth(false, groupIndex);
  //         } else {
  //           focusCell.tabIndex = '0';
  //           focusCell.focus();
  //         }
  //       } else {
  //         this.navigateToMonth(false, groupIndex);
  //       }
  //       event.preventDefault();
  //       break;
  //     }

  //     //enter
  //     case 13: {
  //       this.onDateSelect(event, date);
  //       event.preventDefault();
  //       break;
  //     }

  //     //escape
  //     case 27: {
  //       this.overlayVisible = false;
  //       event.preventDefault();
  //       break;
  //     }

  //     //tab
  //     case 9: {
  //       if (!this.inline) {
  //         this.trapFocus(event);
  //       }
  //       break;
  //     }

  //     default:
  //       //no op
  //       break;
  //   }
  // }

  // onMonthCellKeydown(event: any, index: number) {
  //   const cell = event.currentTarget;
  //   switch (event.which) {
  //     //arrows
  //     case 38:
  //     case 40: {
  //       cell.tabIndex = '-1';
  //       const cells = cell.parentElement.children;
  //       const cellIndex = DomHandler.index(cell);
  //       const nextCell = cells[event.which === 40 ? cellIndex + 3 : cellIndex - 3];
  //       if (nextCell) {
  //         nextCell.tabIndex = '0';
  //         nextCell.focus();
  //       }
  //       event.preventDefault();
  //       break;
  //     }

  //     //left arrow
  //     case 37: {
  //       cell.tabIndex = '-1';
  //       const prevCell = cell.previousElementSibling;
  //       if (prevCell) {
  //         prevCell.tabIndex = '0';
  //         prevCell.focus();
  //       }
  //       event.preventDefault();
  //       break;
  //     }

  //     //right arrow
  //     case 39: {
  //       cell.tabIndex = '-1';
  //       const nextCell = cell.nextElementSibling;
  //       if (nextCell) {
  //         nextCell.tabIndex = '0';
  //         nextCell.focus();
  //       }
  //       event.preventDefault();
  //       break;
  //     }

  //     //enter
  //     case 13: {
  //       this.onMonthSelect(event, index);
  //       event.preventDefault();
  //       break;
  //     }

  //     //escape
  //     case 27: {
  //       this.overlayVisible = false;
  //       event.preventDefault();
  //       break;
  //     }

  //     //tab
  //     case 9: {
  //       if (!this.inline) {
  //         this.trapFocus(event);
  //       }
  //       break;
  //     }

  //     default:
  //       //no op
  //       break;
  //   }
  // }

  // navigateToMonth(prev, groupIndex) {
  //   if (prev) {
  //     if (this.numberOfMonths === 1 || groupIndex === 0) {
  //       this.navigationState = { backward: true };
  //       this.navBackward(event);
  //     } else {
  //       const prevMonthContainer = this.contentViewChild.nativeElement.children[groupIndex - 1];
  //       const cells = DomHandler.find(
  //         prevMonthContainer,
  //         '.p-datepicker-calendar td span:not(.p-disabled):not(.p-ink)'
  //       );
  //       const focusCell = cells[cells.length - 1];
  //       focusCell.tabIndex = '0';
  //       focusCell.focus();
  //     }
  //   } else {
  //     if (this.numberOfMonths === 1 || groupIndex === this.numberOfMonths - 1) {
  //       this.navigationState = { backward: false };
  //       this.navForward(event);
  //     } else {
  //       const nextMonthContainer = this.contentViewChild.nativeElement.children[groupIndex + 1];
  //       const focusCell = DomHandler.findSingle(
  //         nextMonthContainer,
  //         '.p-datepicker-calendar td span:not(.p-disabled):not(.p-ink)'
  //       );
  //       focusCell.tabIndex = '0';
  //       focusCell.focus();
  //     }
  //   }
  // }

  // updateFocus() {
  //   let cell;
  //   if (this.navigationState) {
  //     if (this.navigationState.button) {
  //       this.initFocusableCell();

  //       if (this.navigationState.backward)
  //         DomHandler.findSingle(this.contentViewChild.nativeElement, '.p-datepicker-prev').focus();
  //       else DomHandler.findSingle(this.contentViewChild.nativeElement, '.p-datepicker-next').focus();
  //     } else {
  //       if (this.navigationState.backward) {
  //         const cells = DomHandler.find(
  //           this.contentViewChild.nativeElement,
  //           '.p-datepicker-calendar td span:not(.p-disabled):not(.p-ink)'
  //         );
  //         cell = cells[cells.length - 1];
  //       } else {
  //         cell = DomHandler.findSingle(
  //           this.contentViewChild.nativeElement,
  //           '.p-datepicker-calendar td span:not(.p-disabled):not(.p-ink)'
  //         );
  //       }

  //       if (cell) {
  //         cell.tabIndex = '0';
  //         cell.focus();
  //       }
  //     }

  //     this.navigationState = null;
  //   } else {
  //     this.initFocusableCell();
  //   }
  // }

  // initFocusableCell() {
  //   let cell;
  //   if (this.view === 'month') {
  //     const cells = DomHandler.find(
  //       this.contentViewChild.nativeElement,
  //       '.p-monthpicker .p-monthpicker-month:not(.p-disabled)'
  //     );
  //     const selectedCell = DomHandler.findSingle(
  //       this.contentViewChild.nativeElement,
  //       '.p-monthpicker .p-monthpicker-month.p-highlight'
  //     );
  //     cells.forEach(cell => (cell.tabIndex = -1));
  //     cell = selectedCell || cells[0];

  //     if (cells.length === 0) {
  //       const disabledCells = DomHandler.find(
  //         this.contentViewChild.nativeElement,
  //         '.p-monthpicker .p-monthpicker-month.p-disabled[tabindex = "0"]'
  //       );
  //       disabledCells.forEach(cell => (cell.tabIndex = -1));
  //     }
  //   } else {
  //     cell = DomHandler.findSingle(this.contentViewChild.nativeElement, 'span.p-highlight');
  //     if (!cell) {
  //       const todayCell = DomHandler.findSingle(
  //         this.contentViewChild.nativeElement,
  //         'td.p-datepicker-today span:not(.p-disabled):not(.p-ink)'
  //       );
  //       if (todayCell) cell = todayCell;
  //       else
  //         cell = DomHandler.findSingle(
  //           this.contentViewChild.nativeElement,
  //           '.p-datepicker-calendar td span:not(.p-disabled):not(.p-ink)'
  //         );
  //     }
  //   }

  //   if (cell) {
  //     cell.tabIndex = '0';
  //   }
  // }

  // trapFocus(event: Event) {
  //   const focusableElements = DomHandler.getFocusableElements(this.contentViewChild.nativeElement);

  //   if (focusableElements && focusableElements.length > 0) {
  //     if (!focusableElements[0].ownerDocument.activeElement) {
  //       focusableElements[0].focus();
  //     } else {
  //       const focusedIndex = focusableElements.indexOf(focusableElements[0].ownerDocument.activeElement);

  //       if (event.shiftKey) {
  //         if (focusedIndex === -1 || focusedIndex === 0) {
  //           if (this.focusTrap) {
  //             focusableElements[focusableElements.length - 1].focus();
  //           } else {
  //             if (focusedIndex === -1) return this.hideOverlay();
  //             else if (focusedIndex === 0) return;
  //           }
  //         } else {
  //           focusableElements[focusedIndex - 1].focus();
  //         }
  //       } else {
  //         if (focusedIndex === -1 || focusedIndex === focusableElements.length - 1) {
  //           if (!this.focusTrap && focusedIndex !== -1) return this.hideOverlay();
  //           else focusableElements[0].focus();
  //         } else {
  //           focusableElements[focusedIndex + 1].focus();
  //         }
  //       }
  //     }
  //   }

  //   event.preventDefault();
  // }

  onMonthDropdownChange(m: string) {
    this.currentMonth = parseInt(m);
    // this.onMonthChange.emit({ month: this.currentMonth + 1, year: this.currentYear });
    this.createMonths(this.currentMonth, this.currentYear);
  }

  onYearDropdownChange(y: string) {
    this.currentYear = parseInt(y);
    // this.onYearChange.emit({ month: this.currentMonth + 1, year: this.currentYear });
    this.createMonths(this.currentMonth, this.currentYear);
  }

  convertTo24Hour = function (hours: number, pm: boolean) {
    if (this.hourFormat === '12') {
      if (hours === 12) {
        return pm ? 12 : 0;
      } else {
        return pm ? hours + 12 : hours;
      }
    }
    return hours;
  };

  validateTime(hour: number, minute: number, second: number, pm: boolean) {
    let value = this._value;
    const convertedHour = this.convertTo24Hour(hour, pm);
    if (this.isRangeSelection()) {
      value = this._value[1] || this._value[0];
    }
    if (this.isMultipleSelection()) {
      value = this._value[this._value.length - 1];
    }
    const valueDateString = value ? value.toDateString() : null;
    if (this.minDate && valueDateString && this.minDate.toDateString() === valueDateString) {
      if (this.minDate.getHours() > convertedHour) {
        return false;
      }
      if (this.minDate.getHours() === convertedHour) {
        if (this.minDate.getMinutes() > minute) {
          return false;
        }
        if (this.minDate.getMinutes() === minute) {
          if (this.minDate.getSeconds() > second) {
            return false;
          }
        }
      }
    }

    if (this.maxDate && valueDateString && this.maxDate.toDateString() === valueDateString) {
      if (this.maxDate.getHours() < convertedHour) {
        return false;
      }
      if (this.maxDate.getHours() === convertedHour) {
        if (this.maxDate.getMinutes() < minute) {
          return false;
        }
        if (this.maxDate.getMinutes() === minute) {
          if (this.maxDate.getSeconds() < second) {
            return false;
          }
        }
      }
    }
    return true;
  }

  onUserInput(event: any) {
    // IE 11 Workaround for input placeholder : https://github.com/primefaces/primeng/issues/2026
    if (!this.isKeydown) {
      return;
    }
    this.isKeydown = false;

    const val = event.target.value;
    try {
      const value = this.parseValueFromString(val);
      if (this.isValidSelection(value)) {
        this.updateModel(value);
        this.updateUI();
      }
    } catch (err) {
      //invalid date
      this.updateModel(null);
    }

    this.filled = val !== null && val.length;
    // this.onInput.emit(event);
  }

  isValidSelection(value: any): boolean {
    let isValid = true;
    if (this.isSingleSelection()) {
      if (!this.isSelectable(value.getDate(), value.getMonth(), value.getFullYear(), false)) {
        isValid = false;
      }
    } else if (value.every((v: Date) => this.isSelectable(v.getDate(), v.getMonth(), v.getFullYear(), false))) {
      if (this.isRangeSelection()) {
        isValid = value.length > 1 && value[1] > value[0] ? true : false;
      }
    }
    return isValid;
  }

  parseValueFromString(text: string): any {
    if (!text || text.trim().length === 0) {
      return null;
    }

    let value: any = null;

    if (this.isSingleSelection()) {
      value = this.parseDateTime(text);
    } else if (this.isMultipleSelection()) {
      const tokens = text.split(this.multipleSeparator);
      value = [];
      for (const token of tokens) {
        value.push(this.parseDateTime(token.trim()));
      }
    } else if (this.isRangeSelection()) {
      const tokens = text.split(' ' + this.rangeSeparator + ' ');
      value = [];
      for (let i = 0; i < tokens.length; i++) {
        value[i] = this.parseDateTime(tokens[i].trim());
      }
    }

    return value;
  }

  parseDateTime(text?: string): Date | null {
    let date: Date | null;
    if (!text) return null;

    const parts: string[] = text.split(' ');

    if (this.timeOnly) {
      date = new Date();
      this.populateTime(date, parts[0], parts[1]);
    } else {
      const dateFormat = this.getDateFormat();
      if (this.showTime) {
        const ampm: any = this.hourFormat === '12' ? parts.pop() : null;
        const timeString: any = parts.pop();

        date = this.parseDate(parts.join(' '), dateFormat);
        this.populateTime(date, timeString, ampm);
      } else {
        date = this.parseDate(text, dateFormat);
      }
    }

    return date;
  }

  populateTime(value: Date | null, timeString: string | null, ampm: string) {
    if ((this.hourFormat === '12' && !ampm) || !timeString || !value) {
      throw new Error('Invalid Time');
    }

    this.pm = ampm === 'PM' || ampm === 'pm';
    const time = this.parseTime(timeString);
    value.setHours(time.hour);
    value.setMinutes(time.minute);
    value.setSeconds(time.second ? time.second : 0);
  }

  updateUI() {
    let val = this._value || this.defaultDate || new Date();
    if (Array.isArray(val)) {
      val = val[0];
    }

    this.currentMonth = val.getMonth();
    this.currentYear = val.getFullYear();
    this.createMonths(this.currentMonth, this.currentYear);

    if (this.showTime || this.timeOnly) {
      this.setCurrentHourPM(val.getHours());
      this.currentMinute = val.getMinutes();
      this.currentSecond = val.getSeconds();
    }
  }

  showOverlay() {
    if (!this.overlayVisible) {
      this.updateUI();
      this.overlayVisible = true;
    }
  }

  hideOverlay() {
    // this.overlayVisible = false;
    // this.clearTimePickerTimer();
    // if (this.touchUI) {
    //   this.disableModality();
    // }
    // this.cd.markForCheck();
  }

  // toggle() {
  //   if (!this.inline) {
  //     if (!this.overlayVisible) {
  //       this.showOverlay();
  //       this.inputfieldViewChild.nativeElement.focus();
  //     } else {
  //       this.hideOverlay();
  //     }
  //   }
  // }

  // onOverlayAnimationStart(event: AnimationEvent) {
  //   switch (event.toState) {
  //     case 'visible':
  //     case 'visibleTouchUI':
  //       if (!this.inline) {
  //         this.overlay = event.element;
  //         this.appendOverlay();
  //         if (this.autoZIndex) {
  //           this.overlay.style.zIndex = String(this.baseZIndex + ++DomHandler.zindex);
  //         }
  //         this.alignOverlay();
  //         this.onShow.emit(event);
  //       }
  //       break;

  //     case 'void':
  //       this.onOverlayHide();
  //       this.onClose.emit(event);
  //       break;
  //   }
  // }

  // onOverlayAnimationDone(event: AnimationEvent) {
  //   switch (event.toState) {
  //     case 'visible':
  //     case 'visibleTouchUI':
  //       if (!this.inline) {
  //         this.bindDocumentClickListener();
  //         this.bindDocumentResizeListener();
  //         this.bindScrollListener();
  //       }
  //       break;
  //   }
  // }

  // appendOverlay() {
  //   if (this.appendTo) {
  //     if (this.appendTo === 'body') document.body.appendChild(this.overlay);
  //     else DomHandler.appendChild(this.overlay, this.appendTo);
  //   }
  // }

  // restoreOverlayAppend() {
  //   if (this.overlay && this.appendTo) {
  //     this.el.nativeElement.appendChild(this.overlay);
  //   }
  // }

  // alignOverlay() {
  //   if (this.touchUI) {
  //     this.enableModality(this.overlay);
  //   } else {
  //     if (this.appendTo) DomHandler.absolutePosition(this.overlay, this.inputfieldViewChild.nativeElement);
  //     else DomHandler.relativePosition(this.overlay, this.inputfieldViewChild.nativeElement);
  //   }
  // }

  // enableModality(element: HTMLElement) {
  //   if (!this.mask) {
  //     this.mask = document.createElement('div');
  //     this.mask.style.zIndex = String(parseInt(element.style.zIndex) - 1);
  //     const maskStyleClass = 'p-component-overlay p-datepicker-mask p-datepicker-mask-scrollblocker';
  //     DomHandler.addMultipleClasses(this.mask, maskStyleClass);

  //     this.maskClickListener = this.renderer.listen(this.mask, 'click', (event: any) => {
  //       this.disableModality();
  //     });
  //     document.body.appendChild(this.mask);
  //     DomHandler.addClass(document.body, 'p-overflow-hidden');
  //   }
  // }

  // disableModality() {
  //   if (this.mask) {
  //     document.body.removeChild(this.mask);
  //     const bodyChildren = document.body.children;
  //     let hasBlockerMasks: boolean = false;
  //     for (let i = 0; i < bodyChildren.length; i++) {
  //       const bodyChild = bodyChildren[i];
  //       if (DomHandler.hasClass(bodyChild, 'p-datepicker-mask-scrollblocker')) {
  //         hasBlockerMasks = true;
  //         break;
  //       }
  //     }

  //     if (!hasBlockerMasks) {
  //       DomHandler.removeClass(document.body, 'p-overflow-hidden');
  //     }

  //     this.unbindMaskClickListener();

  //     this.mask = null;
  //   }
  // }

  // unbindMaskClickListener() {
  //   if (this.maskClickListener) {
  //     this.maskClickListener();
  //     this.maskClickListener = null;
  //   }
  // }

  writeValue(value: any): void {
    this._value = value;
    if (this._value && typeof this._value === 'string') {
      this._value = this.parseValueFromString(this._value);
    }

    this.updateInputfield();
    this.updateUI();
    // this.cd.markForCheck();
  }

  // registerOnChange(fn: Function): void {
  //   this.onModelChange = fn;
  // }

  // registerOnTouched(fn: Function): void {
  //   this.onModelTouched = fn;
  // }

  setDisabledState(val: boolean): void {
    this.disabled = val;
    // this.cd.markForCheck();
  }

  getDateFormat(): string {
    return this.dateFormat || this.locale.dateFormat;
  }

  // Ported from jquery-ui datepicker formatDate
  formatDate(date: Date, format: string) {
    if (!date) {
      return '';
    }

    let iFormat: number;
    const lookAhead = (match: string) => {
      const matches = iFormat + 1 < format.length && format.charAt(iFormat + 1) === match;
      if (matches) {
        iFormat++;
      }
      return matches;
    };
    const formatNumber = (match: string, value: number, len: number) => {
      let num = '' + value;
      if (lookAhead(match)) {
        while (num.length < len) {
          num = '0' + num;
        }
      }
      return num;
    };
    const formatName = (match: string, value: number, shortNames: string[], longNames: string[]) => {
      return lookAhead(match) ? longNames[value] : shortNames[value];
    };
    let output = '';
    let literal = false;

    if (date) {
      for (iFormat = 0; iFormat < format.length; iFormat++) {
        if (literal) {
          if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
            literal = false;
          } else {
            output += format.charAt(iFormat);
          }
        } else {
          switch (format.charAt(iFormat)) {
            case 'd':
              output += formatNumber('d', date.getDate(), 2);
              break;
            case 'D':
              output += formatName('D', date.getDay(), this.locale.dayNamesShort, this.locale.dayNames);
              break;
            case 'o':
              output += formatNumber(
                'o',
                Math.round(
                  (new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() -
                    new Date(date.getFullYear(), 0, 0).getTime()) /
                  86400000
                ),
                3
              );
              break;
            case 'm':
              output += formatNumber('m', date.getMonth() + 1, 2);
              break;
            case 'M':
              output += formatName('M', date.getMonth(), this.locale.monthNamesShort, this.locale.monthNames);
              break;
            case 'y':
              output += lookAhead('y')
                ? date.getFullYear()
                : (date.getFullYear() % 100 < 10 ? '0' : '') + (date.getFullYear() % 100);
              break;
            case '@':
              output += date.getTime();
              break;
            case '!':
              output += date.getTime() * 10000 + this.ticksTo1970;
              break;
            case "'":
              if (lookAhead("'")) {
                output += "'";
              } else {
                literal = true;
              }
              break;
            default:
              output += format.charAt(iFormat);
          }
        }
      }
    }
    return output;
  }

  formatTime(date: Date) {
    if (!date) {
      return '';
    }

    let output = '';
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    if (this.hourFormat === '12' && hours > 11 && hours !== 12) {
      hours -= 12;
    }

    if (this.hourFormat === '12') {
      output += hours === 0 ? 12 : hours < 10 ? '0' + hours : hours;
    } else {
      output += hours < 10 ? '0' + hours : hours;
    }
    output += ':';
    output += minutes < 10 ? '0' + minutes : minutes;

    if (this.showSeconds) {
      output += ':';
      output += seconds < 10 ? '0' + seconds : seconds;
    }

    if (this.hourFormat === '12') {
      output += date.getHours() > 11 ? ' PM' : ' AM';
    }

    return output;
  }

  parseTime(value: string) {
    const tokens: string[] = value.split(':');
    const validTokenLength = this.showSeconds ? 3 : 2;

    if (tokens.length !== validTokenLength) {
      throw new Error('Invalid time');
    }

    let h = parseInt(tokens[0]);
    const m = parseInt(tokens[1]);
    const s: any = this.showSeconds ? parseInt(tokens[2]) : null;

    if (
      isNaN(h) ||
      isNaN(m) ||
      h > 23 ||
      m > 59 ||
      (this.hourFormat === '12' && h > 12) ||
      (this.showSeconds && (isNaN(s) || s > 59))
    ) {
      throw new Error('Invalid time');
    } else {
      if (this.hourFormat === '12') {
        if (h !== 12 && this.pm) {
          h += 12;
        } else if (!this.pm && h === 12) {
          h -= 12;
        }
      }

      return { hour: h, minute: m, second: s };
    }
  }

  // Ported from jquery-ui datepicker parseDate
  parseDate(value: any, format: string) {
    if (format === null || value === null) {
      throw new Error('Invalid arguments');
    }

    value = typeof value === 'object' ? value.toString() : value + '';
    if (value === '') {
      return null;
    }

    let iFormat: any;
    let dim;
    let extra;
    let iValue = 0;
    const shortYearCutoff =
      typeof this.shortYearCutoff !== 'string'
        ? this.shortYearCutoff
        : (new Date().getFullYear() % 100) + parseInt(this.shortYearCutoff, 10);
    let year = -1;
    let month = -1;
    let day = -1;
    let doy = -1;
    let literal = false;
    let date;
    const lookAhead = (match: string) => {
      const matches = iFormat + 1 < format.length && format.charAt(iFormat + 1) === match;
      if (matches) {
        iFormat++;
      }
      return matches;
    };
    const getNumber = (match: string) => {
      const isDoubled = lookAhead(match);
      const size = match === '@' ? 14 : match === '!' ? 20 : match === 'y' && isDoubled ? 4 : match === 'o' ? 3 : 2;
      const minSize = match === 'y' ? size : 1;
      const digits = new RegExp('^\\d{' + minSize + ',' + size + '}');
      const num = value.substring(iValue).match(digits);
      if (!num) {
        throw new Error('Missing number at position ' + iValue);
      }
      iValue += num[0].length;
      return parseInt(num[0], 10);
    };
    const getName = (match: string, shortNames: string[], longNames: string[]) => {
      let index = -1;
      const arr = lookAhead(match) ? longNames : shortNames;
      const names = [];

      for (let i = 0; i < arr.length; i++) {
        names.push([i, arr[i]]);
      }
      names.sort((a: any, b: any) => {
        return -(a[1].length - b[1].length);
      });

      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < names.length; i++) {
        const name: string = names[i][1] as string;
        if (value.substr(iValue, name.length).toLowerCase() === name.toLowerCase()) {
          index = names[i][0] as number;
          iValue += name.length;
          break;
        }
      }

      if (index !== -1) {
        return index + 1;
      } else {
        throw new Error('Unknown name at position ' + iValue);
      }
    };
    const checkLiteral = () => {
      if (value.charAt(iValue) !== format.charAt(iFormat)) {
        throw new Error('Unexpected literal at position ' + iValue);
      }
      iValue++;
    };

    if (this.view === 'month') {
      day = 1;
    }

    for (iFormat = 0; iFormat < format.length; iFormat++) {
      if (literal) {
        if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
          literal = false;
        } else {
          checkLiteral();
        }
      } else {
        switch (format.charAt(iFormat)) {
          case 'd':
            day = getNumber('d');
            break;
          case 'D':
            getName('D', this.locale.dayNamesShort, this.locale.dayNames);
            break;
          case 'o':
            doy = getNumber('o');
            break;
          case 'm':
            month = getNumber('m');
            break;
          case 'M':
            month = getName('M', this.locale.monthNamesShort, this.locale.monthNames);
            break;
          case 'y':
            year = getNumber('y');
            break;
          case '@':
            date = new Date(getNumber('@'));
            year = date.getFullYear();
            month = date.getMonth() + 1;
            day = date.getDate();
            break;
          case '!':
            date = new Date((getNumber('!') - this.ticksTo1970) / 10000);
            year = date.getFullYear();
            month = date.getMonth() + 1;
            day = date.getDate();
            break;
          case "'":
            if (lookAhead("'")) {
              checkLiteral();
            } else {
              literal = true;
            }
            break;
          default:
            checkLiteral();
        }
      }
    }

    if (iValue < value.length) {
      extra = value.substr(iValue);
      if (!/^\s+/.test(extra)) {
        throw new Error('Extra/unparsed characters found in date: ' + extra);
      }
    }

    if (year === -1) {
      year = new Date().getFullYear();
    } else if (year < 100) {
      year += new Date().getFullYear() - (new Date().getFullYear() % 100) + (year <= shortYearCutoff ? 0 : -100);
    }

    if (doy > -1) {
      month = 1;
      day = doy;
      do {
        dim = this.getDaysCountInMonth(year, month - 1);
        if (day <= dim) {
          break;
        }
        month++;
        day -= dim;
        // eslint-disable-next-line no-constant-condition
      } while (true);
    }

    date = this.daylightSavingAdjust(new Date(year, month - 1, day));
    if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
      throw new Error('Invalid date'); // E.g. 31/02/00
    }

    return date;
  }

  daylightSavingAdjust(date: Date): Date {
    // if (!date) {
    //   return null;
    // }

    date.setHours(date.getHours() > 12 ? date.getHours() + 2 : 0);

    return date;
  }

  updateFilledState() {
    this.filled = !!this.inputFieldValue && this.inputFieldValue !== '';
  }

  onTodayButtonClick(event: Event) {
    const date: Date = new Date();
    const dateMeta = {
      day: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear(),
      otherMonth: date.getMonth() !== this.currentMonth || date.getFullYear() !== this.currentYear,
      today: true,
      selectable: true
    };

    this.onDateSelect(event, dateMeta);
    // this.onTodayClick.emit(event);
  }

  onClearButtonClick() {
    this.updateModel(null);
    this.updateInputfield();
    // this.hideOverlay();
    // this.onClearClick.emit(event);
    this.hideCalendarHandler();
  }

  hideCalendarHandler() {
    this._hideCalendar = true;
    const dateElm: any = this.shadowRoot ?.querySelector('.cs-dateinput-main');
    if (dateElm) {
      dateElm.style.display = 'none';
    }
    this.onInputBlur();
    this.unbindDocumentClickListener();
  }

  bindDocumentClickListener() {
    document.addEventListener('click', this.documentClickListener);
    // if (!this.documentClickListener) {
    //   this.zone.runOutsideAngular(() => {
    //     const documentTarget: any = this.el ? this.el.nativeElement.ownerDocument : 'document';
    //     this.documentClickListener = this.renderer.listen(documentTarget, 'click', event => {
    //       if (this.isOutsideClicked(event) && this.overlayVisible) {
    //         this.zone.run(() => {
    //           this.hideOverlay();
    //           this.onClickOutside.emit(event);
    //           this.cd.markForCheck();
    //         });
    //       }
    //     });
    //   });
    // }
  }

  unbindDocumentClickListener() {
    document.removeEventListener('click', this.documentClickListener);
    // if (this.documentClickListener) {
    //   this.documentClickListener();
    //   this.documentClickListener = null;
    // }
  }

  //   bindDocumentResizeListener() {
  //     if (!this.documentResizeListener && !this.touchUI) {
  //       this.documentResizeListener = this.onWindowResize.bind(this);
  //       window.addEventListener('resize', this.documentResizeListener);
  //     }
  //   }

  //   unbindDocumentResizeListener() {
  //     if (this.documentResizeListener) {
  //       window.removeEventListener('resize', this.documentResizeListener);
  //       this.documentResizeListener = null;
  //     }
  //   }

  //   bindScrollListener() {
  //     if (!this.scrollHandler) {
  //       this.scrollHandler = new ConnectedOverlayScrollHandler(this.containerViewChild.nativeElement, () => {
  //         if (this.overlayVisible) {
  //           this.hideOverlay();
  //         }
  //       });
  //     }

  //     this.scrollHandler.bindScrollListener();
  //   }

  //   unbindScrollListener() {
  //     if (this.scrollHandler) {
  //       this.scrollHandler.unbindScrollListener();
  //     }
  //   }

  //   isOutsideClicked(event: Event) {
  //     return !(
  //       this.el.nativeElement.isSameNode(event.target) ||
  //       this.isNavIconClicked(event) ||
  //       this.el.nativeElement.contains(event.target) ||
  //       (this.overlay && this.overlay.contains(event.target as Node))
  //     );
  //   }

  //   isNavIconClicked(event: MouseEvent) {
  //     return (
  //       DomHandler.hasClass(event.target, 'p-datepicker-prev') ||
  //       DomHandler.hasClass(event.target, 'p-datepicker-prev-icon') ||
  //       DomHandler.hasClass(event.target, 'p-datepicker-next') ||
  //       DomHandler.hasClass(event.target, 'p-datepicker-next-icon')
  //     );
  //   }

  //   onWindowResize() {
  //     if (this.overlayVisible && !DomHandler.isAndroid()) {
  //       this.hideOverlay();
  //     }
  //   }

  //   onOverlayHide() {
  //     this.unbindDocumentClickListener();
  //     this.unbindMaskClickListener();
  //     this.unbindDocumentResizeListener();
  //     this.unbindScrollListener();
  //     this.overlay = null;
  //     this.disableModality();
  //   }

  //   ngOnDestroy() {
  //     if (this.scrollHandler) {
  //       this.scrollHandler.destroy();
  //       this.scrollHandler = null;
  //     }

  //     this.clearTimePickerTimer();
  //     this.restoreOverlayAppend();
  //     this.onOverlayHide();
  //   }
}
