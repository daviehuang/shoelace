/* eslint-disable prefer-spread */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-extraneous-class */
/**
 * @dynamic is for runtime initializing DomHandler.browser
 *
 * If delete below comment, we can see this error message:
 *  Metadata collected contains an error that will be reported at runtime:
 *  Only initialized variables and constants can be referenced
 *  because the value of this variable is needed by the template compiler.
 */
// @dynamic
export class DomHandler {
  public static zindex: number = 1000;

  private static calculatedScrollbarWidth: number;

  private static calculatedScrollbarHeight: number;

  private static browser: any;

  public static addClass(element: HTMLElement, className: string): void {
    if (element.classList) element.classList.add(className);
    else element.className += ' ' + className;
  }

  public static addMultipleClasses(element: HTMLElement, className: string): void {
    if (element.classList) {
      const styles: string[] = className.split(' ');
      for (let i = 0; i < styles.length; i++) {
        element.classList.add(styles[i]);
      }
    } else {
      const styles: string[] = className.split(' ');
      for (let i = 0; i < styles.length; i++) {
        element.className += ' ' + styles[i];
      }
    }
  }

  public static removeClass(element: HTMLElement, className: string): void {
    if (element.classList) element.classList.remove(className);
    else
      element.className = element.className.replace(
        new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'),
        ' '
      );
  }

  public static hasClass(element: HTMLElement, className: string): boolean {
    if (element.classList) return element.classList.contains(className);
    else return new RegExp('(^| )' + className + '( |$)', 'gi').test(element.className);
  }

  public static siblings(element: HTMLElement): any {
    return Array.prototype.filter.call(element.parentNode!.children, child => {
      return child !== element;
    });
  }

  public static find(element: HTMLElement, selector: string): any {
    // return Array.from(element.querySelectorAll(selector));
    return element.querySelectorAll(selector);
  }

  public static findSingle(element: HTMLElement, selector: string): any {
    // if (element) {
    return element?.querySelector(selector);
    // }
    // return null;
  }

  public static index(element: HTMLElement): number {
    const children: any = element.parentNode?.childNodes;
    let num = 0;
    for (let i = 0; i < children.length; i++) {
      if (children[i] === element) return num;
      if (children[i].nodeType === 1) num++;
    }
    return -1;
  }

  public static indexWithinGroup(element: HTMLElement, attributeName: string): number {
    const children: any = element.parentNode ? element.parentNode.childNodes : [];
    let num = 0;
    for (let i = 0; i < children.length; i++) {
      if (children[i] === element) return num;
      if (children[i].attributes?.[attributeName] && children[i].nodeType === 1) num++;
    }
    return -1;
  }

  public static relativePosition(element: HTMLElement, target: HTMLElement): void {
    const elementDimensions = element.offsetParent
      ? { width: element.offsetWidth, height: element.offsetHeight }
      : this.getHiddenElementDimensions(element);
    const targetHeight = target.offsetHeight;
    const targetOffset = target.getBoundingClientRect();
    const viewport = this.getViewport();
    let top: number;
    let left: number;

    if (targetOffset.top + targetHeight + elementDimensions.height > viewport.height) {
      top = -1 * elementDimensions.height;
      element.style.transformOrigin = 'bottom';
      if (targetOffset.top + top < 0) {
        top = -1 * targetOffset.top;
      }
    } else {
      top = targetHeight;
      element.style.transformOrigin = 'top';
    }

    if (elementDimensions.width > viewport.width) {
      // element wider then viewport and cannot fit on screen (align at left side of viewport)
      left = targetOffset.left * -1;
    } else if (targetOffset.left + elementDimensions.width > viewport.width) {
      // element wider then viewport but can be fit on screen (align at right side of viewport)
      left = (targetOffset.left + elementDimensions.width - viewport.width) * -1;
    } else {
      // element fits on screen (align with target)
      left = 0;
    }

    element.style.top = top + 'px';
    element.style.left = left + 'px';
  }

  public static absolutePosition(element: HTMLElement, target: any): void {
    const elementDimensions = element.offsetParent
      ? { width: element.offsetWidth, height: element.offsetHeight }
      : this.getHiddenElementDimensions(element);
    const elementOuterHeight = elementDimensions.height;
    const elementOuterWidth = elementDimensions.width;
    const targetOuterHeight = target.offsetHeight;
    const targetOuterWidth = target.offsetWidth;
    const targetOffset = target.getBoundingClientRect();
    const windowScrollTop: number = this.getWindowScrollTop();
    const windowScrollLeft: number = this.getWindowScrollLeft();
    const viewport = this.getViewport();
    let top: number;
    let left: number;

    if (targetOffset.top + targetOuterHeight + elementOuterHeight > viewport.height) {
      top = targetOffset.top + windowScrollTop - elementOuterHeight;
      element.style.transformOrigin = 'bottom';

      if (top < 0) {
        top = windowScrollTop;
      }
    } else {
      top = targetOuterHeight + targetOffset.top + windowScrollTop;
      element.style.transformOrigin = 'top';
    }

    if (targetOffset.left + elementOuterWidth > viewport.width)
      left = Math.max(0, targetOffset.left + windowScrollLeft + targetOuterWidth - elementOuterWidth);
    else left = targetOffset.left + windowScrollLeft;

    element.style.top = top + 'px';
    element.style.left = left + 'px';
  }

  static getParents(element: Node, parents: any = []): any {
    return element['parentNode'] === null
      ? parents
      : this.getParents(element.parentNode, parents.concat([element.parentNode]));
  }

  static getScrollableParents(element: HTMLElement) {
    const scrollableParents = [];

    if (element) {
      const parents = this.getParents(element);
      const overflowRegex = /(auto|scroll)/;
      const overflowCheck = (node: HTMLElement) => {
        const styleDeclaration = window['getComputedStyle'](node, null);
        return (
          overflowRegex.test(styleDeclaration.getPropertyValue('overflow')) ||
          overflowRegex.test(styleDeclaration.getPropertyValue('overflowX')) ||
          overflowRegex.test(styleDeclaration.getPropertyValue('overflowY'))
        );
      };

      for (const parent of parents) {
        const scrollSelectors = parent.nodeType === 1 && parent.dataset['scrollselectors'];
        if (scrollSelectors) {
          const selectors = scrollSelectors.split(',');
          for (const selector of selectors) {
            const el = this.findSingle(parent, selector);
            if (el && overflowCheck(el)) {
              scrollableParents.push(el);
            }
          }
        }

        if (parent.nodeType === 9 || overflowCheck(parent)) {
          scrollableParents.push(parent);
        }
      }
    }

    return scrollableParents;
  }

  public static getHiddenElementOuterHeight(element: HTMLElement): number {
    element.style.visibility = 'hidden';
    element.style.display = 'block';
    const elementHeight = element.offsetHeight;
    element.style.display = 'none';
    element.style.visibility = 'visible';

    return elementHeight;
  }

  public static getHiddenElementOuterWidth(element: HTMLElement): number {
    element.style.visibility = 'hidden';
    element.style.display = 'block';
    const elementWidth = element.offsetWidth;
    element.style.display = 'none';
    element.style.visibility = 'visible';

    return elementWidth;
  }

  public static getHiddenElementDimensions(element: HTMLElement): any {
    const dimensions: any = {};
    element.style.visibility = 'hidden';
    element.style.display = 'block';
    dimensions.width = element.offsetWidth;
    dimensions.height = element.offsetHeight;
    element.style.display = 'none';
    element.style.visibility = 'visible';

    return dimensions;
  }

  public static scrollInView(container: HTMLElement, item: HTMLElement) {
    const borderTopValue: string = getComputedStyle(container).getPropertyValue('borderTopWidth');
    const borderTop: number = borderTopValue ? parseFloat(borderTopValue) : 0;
    const paddingTopValue: string = getComputedStyle(container).getPropertyValue('paddingTop');
    const paddingTop: number = paddingTopValue ? parseFloat(paddingTopValue) : 0;
    const containerRect = container.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    const offset =
      itemRect.top + document.body.scrollTop - (containerRect.top + document.body.scrollTop) - borderTop - paddingTop;
    const scroll = container.scrollTop;
    const elementHeight = container.clientHeight;
    const itemHeight = this.getOuterHeight(item);

    if (offset < 0) {
      container.scrollTop = scroll + offset;
    } else if (offset + itemHeight > elementHeight) {
      container.scrollTop = scroll + offset - elementHeight + itemHeight;
    }
  }

  public static fadeIn(element: HTMLElement, duration: number): void {
    element.style.opacity = '0';

    let last = +new Date();
    let opacity = 0;
    const tick = function () {
      opacity = +element.style.opacity.replace(',', '.') + (new Date().getTime() - last) / duration;
      element.style.opacity = opacity + '';
      last = +new Date();

      if (+opacity < 1) {
        ('requestAnimationFrame' in window && requestAnimationFrame(tick)) || setTimeout(tick, 16);
      }
    };

    tick();
  }

  public static fadeOut(element: HTMLElement, ms: number) {
    let opacity = 1;
    const interval = 50;
    const duration = ms;
    const gap = interval / duration;

    const fading = setInterval(() => {
      opacity -= gap;

      if (opacity <= 0) {
        opacity = 0;
        clearInterval(fading);
      }

      element.style.opacity = `${opacity}`;
    }, interval);
  }

  public static getWindowScrollTop(): number {
    const doc = document.documentElement;
    return (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
  }

  public static getWindowScrollLeft(): number {
    const doc = document.documentElement;
    return (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
  }

  public static matches(element: any, selector: string): boolean {
    let matchesFunction: (element: any, selector: string) => boolean;

    // 尝试使用原生的matches方法
    if (element.matches) {
      matchesFunction = (el: any, s: string) => el.matches(s);
    } else if (element.webkitMatchesSelector) {
      // 对于Safari和旧版Chrome
      matchesFunction = (el: any, s: string) => el.webkitMatchesSelector(s);
    } else if (element.mozMatchesSelector) {
      // 对于Firefox
      matchesFunction = (el: any, s: string) => el.mozMatchesSelector(s);
    } else if (element.msMatchesSelector) {
      // 对于IE
      matchesFunction = (el: any, s: string) => el.msMatchesSelector(s);
    } else {
      // 如果没有原生方法，使用polyfill
      matchesFunction = (el: any, s: string): boolean => {
        const nodeList: NodeListOf<Element> = document.querySelectorAll(s);
        return Array.from(nodeList).indexOf(el) >= 0;
      };
    }

    return matchesFunction(element, selector);
  }

  public static getOuterWidth(el: HTMLElement, margin?: any): number {
    let width = el.offsetWidth;

    if (margin) {
      const style = getComputedStyle(el);
      width += parseFloat(style.marginLeft) + parseFloat(style.marginRight);
    }

    return width;
  }

  public static getHorizontalPadding(el: HTMLElement) {
    const style = getComputedStyle(el);
    return parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
  }

  public static getHorizontalMargin(el: HTMLElement) {
    const style = getComputedStyle(el);
    return parseFloat(style.marginLeft) + parseFloat(style.marginRight);
  }

  public static innerWidth(el: HTMLElement) {
    let width = el.offsetWidth;
    const style = getComputedStyle(el);

    width += parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    return width;
  }

  public static width(el: HTMLElement) {
    let width = el.offsetWidth;
    const style = getComputedStyle(el);

    width -= parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    return width;
  }

  public static getInnerHeight(el: HTMLElement) {
    let height = el.offsetHeight;
    const style = getComputedStyle(el);

    height += parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
    return height;
  }

  public static getOuterHeight(el: HTMLElement, margin?: any): number {
    let height = el.offsetHeight;

    if (margin) {
      const style = getComputedStyle(el);
      height += parseFloat(style.marginTop) + parseFloat(style.marginBottom);
    }

    return height;
  }

  public static getHeight(el: HTMLElement): number {
    let height = el.offsetHeight;
    const style = getComputedStyle(el);

    height -=
      parseFloat(style.paddingTop) +
      parseFloat(style.paddingBottom) +
      parseFloat(style.borderTopWidth) +
      parseFloat(style.borderBottomWidth);

    return height;
  }

  public static getWidth(el: HTMLElement): number {
    let width = el.offsetWidth;
    const style = getComputedStyle(el);

    width -=
      parseFloat(style.paddingLeft) +
      parseFloat(style.paddingRight) +
      parseFloat(style.borderLeftWidth) +
      parseFloat(style.borderRightWidth);

    return width;
  }

  public static getViewport(): { width: number; height: number } {
    const win = window;
    const d = document;
    const e = d.documentElement;
    const g = d.getElementsByTagName('body')[0];
    const w = win.innerWidth || e.clientWidth || g.clientWidth;
    const h = win.innerHeight || e.clientHeight || g.clientHeight;

    return { width: w, height: h };
  }

  public static getOffset(el: HTMLElement) {
    const rect: DOMRect = el.getBoundingClientRect();

    return {
      top: rect.top + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0),
      left: rect.left + (window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0)
    };
  }

  public static replaceElementWith(element: HTMLElement, replacementElement: HTMLElement): any {
    const parentNode = element.parentNode;
    if (!parentNode) throw new Error(`Can't replace element`);
    return parentNode.replaceChild(replacementElement, element);
  }

  public static getUserAgent(): string {
    return navigator.userAgent;
  }

  public static isIE() {
    const ua = window.navigator.userAgent;

    const msie = ua.indexOf('MSIE ');
    if (msie > 0) {
      // IE 10 or older => return version number
      return true;
    }

    const trident = ua.indexOf('Trident/');
    if (trident > 0) {
      // IE 11 => return version number
      // const rv = ua.indexOf('rv:');
      return true;
    }

    const edge = ua.indexOf('Edge/');
    if (edge > 0) {
      // Edge (IE 12+) => return version number
      return true;
    }

    // other browser
    return false;
  }

  public static isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window);
  }

  public static isAndroid() {
    return /(android)/i.test(navigator.userAgent);
  }

  public static appendChild(element: HTMLElement, target: HTMLElement) {
    if (this.isElement(target)) target.appendChild(element);
    else throw new Error('Cannot append  target  to  element');
  }

  public static removeChild(element: HTMLElement, target: any) {
    if (this.isElement(target)) target.removeChild(element);
    else if (target.el?.nativeElement) target.el.nativeElement.removeChild(element);
    else throw new Error('Cannot remove element from target');
  }

  public static removeElement(element: Element) {
    if (!('remove' in Element.prototype)) element.parentNode?.removeChild(element);
    else element.remove();
  }

  public static isElement(obj: any) {
    return typeof HTMLElement === 'object'
      ? obj instanceof HTMLElement
      : obj && typeof obj === 'object' && obj !== null && obj.nodeType === 1 && typeof obj.nodeName === 'string';
  }

  public static calculateScrollbarWidth(el?: HTMLElement): number {
    if (el) {
      const style = getComputedStyle(el);
      return el.offsetWidth - el.clientWidth - parseFloat(style.borderLeftWidth) - parseFloat(style.borderRightWidth);
    } else {
      if (this.calculatedScrollbarWidth !== null) return this.calculatedScrollbarWidth;

      const scrollDiv = document.createElement('div');
      scrollDiv.className = 'p-scrollbar-measure';
      document.body.appendChild(scrollDiv);

      const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
      document.body.removeChild(scrollDiv);

      this.calculatedScrollbarWidth = scrollbarWidth;

      return scrollbarWidth;
    }
  }

  public static calculateScrollbarHeight(): number {
    if (this.calculatedScrollbarHeight !== null) return this.calculatedScrollbarHeight;

    const scrollDiv = document.createElement('div');
    scrollDiv.className = 'p-scrollbar-measure';
    document.body.appendChild(scrollDiv);

    const scrollbarHeight = scrollDiv.offsetHeight - scrollDiv.clientHeight;
    document.body.removeChild(scrollDiv);

    this.calculatedScrollbarWidth = scrollbarHeight;

    return scrollbarHeight;
  }

  public static invokeElementMethod(element: any, methodName: string, args?: any[]): void {
    element[methodName].apply(element, args);
  }

  // public static clearSelection(): void {
  //   if (window.getSelection) {
  //     if (window.getSelection().empty) {
  //       window.getSelection().empty();
  //     } else if (
  //       window.getSelection().removeAllRanges &&
  //       window.getSelection().rangeCount > 0 &&
  //       window.getSelection().getRangeAt(0).getClientRects().length > 0
  //     ) {
  //       window.getSelection().removeAllRanges();
  //     }
  //   } else if (document['selection']?.empty) {
  //     try {
  //       document['selection'].empty();
  //     } catch (error) {
  //       //ignore IE bug
  //     }
  //   }
  // }
  public static clearSelection(): void {
    // 检查window对象是否有getSelection方法
    if (window.getSelection) {
      // 获取当前的选择对象
      const selection = window.getSelection();
      // 如果选择对象有empty方法，则调用它来清除选择
      if (selection && selection.empty) {
        selection.empty();
      } else if (
        selection &&
        selection.removeAllRanges &&
        selection.rangeCount > 0 &&
        selection.getRangeAt(0).getClientRects().length > 0
      ) {
        // 如果没有empty方法，但有removeAllRanges方法，且选择区域不为空，则移除所有文本范围
        selection.removeAllRanges();
      }
    }
    // 检查document对象是否有selection属性（针对旧版IE浏览器）
    // else if (document?.selection?.empty) {
    //   try {
    //     // 尝试调用document.selection的empty方法
    //     document.selection.empty();
    //   } catch (error) {
    //     // 如果捕获到错误（可能是IE的兼容性问题），则忽略
    //   }
    // }
  }

  public static getBrowser() {
    if (!this.browser) {
      const matched = this.resolveUserAgent();
      this.browser = {};

      if (matched.browser) {
        this.browser[matched.browser] = true;
        this.browser['version'] = matched.version;
      }

      if (this.browser['chrome']) {
        this.browser['webkit'] = true;
      } else if (this.browser['webkit']) {
        this.browser['safari'] = true;
      }
    }

    return this.browser;
  }

  public static resolveUserAgent() {
    const ua = navigator.userAgent.toLowerCase();
    const match =
      /(chrome)[ /]([\w.]+)/.exec(ua) ||
      /(webkit)[ /]([\w.]+)/.exec(ua) ||
      /(opera)(?:.*version|)[ /]([\w.]+)/.exec(ua) ||
      /(msie) ([\w.]+)/.exec(ua) ||
      (ua.indexOf('compatible') < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua)) ||
      [];

    return {
      browser: match[1] || '',
      version: match[2] || '0'
    };
  }

  public static isInteger(value: any): boolean {
    if (Number.isInteger) {
      return Number.isInteger(value);
    } else {
      return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
    }
  }

  public static isHidden(element: HTMLElement): boolean {
    return element.offsetParent === null;
  }

  public static getFocusableElements(element: HTMLElement) {
    const focusableElements = DomHandler.find(
      element,
      `button:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden]),
                [href][clientHeight][clientWidth]:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden]),
                input:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden]), select:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden]),
                textarea:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden]), [tabIndex]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden]),
                [contenteditable]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])`
    );

    const visibleFocusableElements = [];
    for (const focusableElement of focusableElements) {
      if (
        getComputedStyle(focusableElement).display !== 'none' &&
        getComputedStyle(focusableElement).visibility !== 'hidden'
      )
        visibleFocusableElements.push(focusableElement);
    }
    return visibleFocusableElements;
  }

  static generateZIndex() {
    this.zindex = this.zindex || 999;
    return ++this.zindex;
  }
}
