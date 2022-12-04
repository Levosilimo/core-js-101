/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return {
    width,
    height,
    getArea() {
      return width * height;
    },
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const result = Object.create(proto);
  return Object.assign(result, JSON.parse(json));
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class CssSelectorBuilder {
  constructor(result = '', position = 0, combinators = '') {
    this.result = result;
    this.position = position;
    this.combinators = combinators;
    this.errorMultipleTimes = 'Element, id and pseudo-element should not occur more then one time inside the selector';
    this.errorOrder = 'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element';
  }

  checkErrors(value) {
    if (this.combinators.indexOf(value) >= 0) throw new Error(this.errorMultipleTimes);
  }

  cssSelectorNew(selector, position, structure) {
    return new CssSelectorBuilder(this.result + selector, position, this.combinators + structure);
  }

  stringify() {
    return this.result;
  }

  element(value) {
    const name = 'element';
    this.checkErrors(name);
    if (this.position < 2) {
      return this.cssSelectorNew(value, 1, name);
    } throw new Error(this.errorOrder);
  }

  id(value) {
    const name = 'id';
    this.checkErrors(name);
    if (this.position < 3) {
      return this.cssSelectorNew(`#${value}`, 2, name);
    } throw new Error(this.errorOrder);
  }

  class(value) {
    this.checkErrors('class');
    if (this.position < 4) {
      return this.cssSelectorNew(`.${value}`, 3);
    } throw new Error(this.errorOrder);
  }

  attr(value) {
    this.checkErrors('attribute');
    if (this.position < 5) {
      return this.cssSelectorNew(`[${value}]`, 4);
    } throw new Error(this.errorOrder);
  }

  pseudoClass(value) {
    this.checkErrors('pseudoClass');
    if (this.position < 6) {
      return this.cssSelectorNew(`:${value}`, 5);
    } throw new Error(this.errorOrder);
  }

  pseudoElement(value) {
    const name = 'pseudoElement';
    this.checkErrors(name);
    if (this.position < 7) {
      return this.cssSelectorNew(`::${value}`, 6, name);
    } throw new Error(this.errorOrder);
  }

  combine(selector1, combinator, selector2) {
    return this.cssSelectorNew(`${selector1.stringify()} ${combinator} ${selector2.stringify()}`, this.combinators);
  }
}

const cssSelectorBuilder = new CssSelectorBuilder();

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
