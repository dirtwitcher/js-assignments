'use strict';

/**************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 **************************************************************************************************/


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    var r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
    this.width = width;
    this.height = height;
}

Rectangle.prototype.getArea = function getArea() {
    return this.width * this.height;
};

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
 *    var r = fromJSON(Rectangle.prototype, '{"width":10, "height":20}');
 *
 */
function fromJSON(proto, json) {
    let item = JSON.parse(json);
    Object.setPrototypeOf(item, proto);
    return item;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy and implement the functionality
 * to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple, clear and readable as possible.
 *
 * @example
 *
 *  var builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()  => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()  => 'a[href$=".png"]:focus'
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
 *  ).stringify()        =>    'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {
    nowSelector: [],
    arrayOfSelectors: [],
    combinators: [],
    resultOfCombine: [],
    prevValue: '',

    element: function(value) {
        if (this.prevValue == 'element') {
          this.moreOneTimeError();
        } else if (this.prevValue == 'id' && value != 'img' && value != 'tr') {
          this.orderError();
        }
        this.prevValue = 'element';
        if (this.nowSelector.length > 0) {
          this.arrayOfSelectors.push(this.nowSelector.join(''));
          this.nowSelector = [];
          this.prevValue = '';
        }
        this.nowSelector.push(value);
        return this;
    },

    id: function(value) {
        if (this.prevValue == 'id') {
          this.moreOneTimeError();
        } else if (this.prevValue == 'class' || this.prevValue == 'attr' 
                || this.prevValue == 'pseudoClass' || this.prevValue == 'pseudoElement') {
          this.orderError();
        }
        this.prevValue = 'id';
        this.nowSelector.push(`#${value}`);
        return this;
    },

    class: function(value) {
        if (this.prevValue == 'attr' || this.prevValue == 'pseudoClass') {
          this.orderError();
        }
        this.prevValue = 'class';
        this.nowSelector.push(`.${value}`);
        return this;
    },

    attr: function(value) {
        if (this.prevValue == 'pseudoClass') {
          this.orderError();
        }
        this.prevValue = 'attr';
        this.nowSelector.push(`[${value}]`);
        return this;
    },

    pseudoClass: function(value) {
        if (this.prevValue == 'pseudoElement') {
          this.orderError();
        }
        this.prevValue = 'pseudoClass';
        this.nowSelector.push(`:${value}`);
        return this;
    },

    pseudoElement: function(value) {
        if (this.prevValue == 'pseudoElement') {
          this.moreOneTimeError();
        }
        this.prevValue = 'pseudoElement';
        this.nowSelector.push(`::${value}`);
        return this;
    },

    combine: function(firstSelector, combinator, secondSelector) {
        this.combinators.push(` ${combinator} `);
        return this;
    },

    stringify() {
        let result = [];
        for (let i = 0; i < this.arrayOfSelectors.length; i++) {
          result.push(this.arrayOfSelectors[i], this.combinators.pop());
        }
        result.push(this.nowSelector.join(''));
        this.nowSelector = [];
        this.arrayOfSelectors = [];
        this.prevValue = '';
        return result.join('');
      },

      moreOneTimeError() {
        throw new Error(
          'Element, id and pseudo-element should not occur more then one time inside the selector',
        );
      },

      orderError() {
        this.prevValue = '';
        throw new Error(
          'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
        );
      },
};


module.exports = {
    Rectangle: Rectangle,
    getJSON: getJSON,
    fromJSON: fromJSON,
    cssSelectorBuilder: cssSelectorBuilder
};
