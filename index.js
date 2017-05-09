'use strict';

var debug = require('debug')('prompt-question');
var koalas = require('koalas');
var Choices = require('prompt-choices');
var utils = require('./lib/utils');

/**
 * Create a new question with the given `name`, `message` and `options`.
 *
 * ```js
 * var question = new Question('first', 'What is your first name?');
 * console.log(question);
 * // Question {
 * //   type: 'input',
 * //   name: 'color',
 * //   message: 'What is your favorite color?'
 * // }
 * ```
 * @param {String|Object} `name` Question name or options.
 * @param {String|Object} `message` Question message or options.
 * @param {String|Object} `options` Question options.
 * @api public
 */

function Question(name, message, options) {
  debug('initializing from <%s>', __filename);
  if (arguments.length === 0) {
    throw new TypeError('expected a string or object');
  }

  if (Question.isQuestion(name)) {
    return name;
  }

  this.options = {};
  this.type = 'input';

  utils.define(this, 'Choices', Choices);
  utils.define(this, 'isQuestion', true);
  utils.assign(this, {
    name: name,
    message: message,
    options: options
  });
}

/**
 * Clone the question instance.
 *
 * ```js
 * var clonedQuestion = question.clone();
 * ```
 * @return {Object} Returns the cloned question
 * @api public
 */

Question.prototype.clone = function() {
  var cache = utils.clone(this.cache);
  return new this.constructor(cache);
};

/**
 * Add formatted choice objects to the `question.choices` array.
 * See [prompt-choices][] for more details.
 *
 * ```js
 * question.addChoices(['foo', 'bar', 'baz']);
 * ```
 * @param {String|Array} `choices` One or more choices to add.
 * @return {Object} Returns the question instance for chaining
 * @api public
 */

Question.prototype.addChoices = function() {
  this.choices.addChoices.apply(this.choices, arguments);
  return this;
};

/**
 * Add a choice to `question.choices` array.
 * See [prompt-choices][] for more details.
 *
 * ```js
 * question.addChoice('foo');
 * ```
 * @param {String|Object} `choice`
 * @return {Object} Returns the question instance for chaining
 * @api public
 */

Question.prototype.addChoice = function() {
  this.choices.addChoice.apply(this.choices, arguments);
  return this;
};

/**
 * Toggle the `checked` value of the the choice at the given `idx`.
 *
 * ```js
 * question.toggle(1);
 * // "radio" mode
 * question.toggle(1, true);
 * ```
 * @param {Number} `idx` The index of the choice to toggle.
 * @return {Object} Returns the question instance for chaining
 * @api public
 */

Question.prototype.toggle = function(idx, radio) {
  if (typeof this.choices.toggle === 'function') {
    this.choices.toggle(idx, radio);
  }
  return this;
};

/**
 * Returns the given `val` or `question.default` if `val` is undefined or null.
 *
 * ```js
 * var question = new Question({
 *   name: 'first',
 *   message: 'First name'?,
 *   default: 'Bob'
 * });
 *
 * console.log(question.getAnswer());
 * //=> 'Bob'
 * console.log(question.getAnswer('Joe'));
 * //=> 'Joe'
 * console.log(question.getAnswer(false));
 * //=> false
 * console.log(question.getAnswer(0));
 * //=> 0
 * ```
 *
 * @param {any} `val`
 * @return {any}
 * @api public
 */

Question.prototype.getAnswer = function(val) {
  return koalas(val, this.default);
};

/**
 * Get the given choice from `questions.choices`.
 *
 * ```js
 * var Question = require('prompt-question');
 * var question = new Question('color', 'What is your favorite color?', {
 *   choices: ['red', 'blue', 'yellow']
 * });
 * console.log(question.getChoice('red'));
 * //=> Choice { name: 'red', short: 'red', value: 'red', checked: false }
 * ```
 *
 * @param {any} `val`
 * @return {any}
 * @api public
 */

Question.prototype.getChoice = function() {
  return this.choices.getChoice.apply(this.choices, arguments);
};

/**
 * Create a separator using [choices-separator][].
 * @api public
 */

Question.prototype.separator = function() {
  return this.choices.separator.apply(this.choices, arguments);
};

/**
 * Getter that returns true if a `default` value has been defined.
 *
 * @name .hasDefault
 * @return {Boolean} True if a default value is defined.
 * @api public
 */

Object.defineProperty(Question.prototype, 'hasDefault', {
  get: function() {
    return this.default != null;
  }
});

/**
 * Getter that returns the list of choices for the
 * current question, if applicable.
 *
 * @name .choices
 * @return {Array}
 * @api public
 */

Object.defineProperty(Question.prototype, 'choices', {
  configurable: true,
  enumerable: true,
  set: function(choices) {
    this._choices = new Choices(choices);
  },
  get: function() {
    if (typeof this._choices === 'undefined') {
      this._choices = new Choices(this.options.choices);
    }
    return this._choices;
  }
});

/**
 * Returns true if `question` is a valid question object.
 *
 * @param {Object} `question`
 * @return {Boolean}
 * @api public
 */

Question.isQuestion = function(question) {
  return utils.isObject(question) && question.isQuestion;
};

/**
 * Create a new `Separator` object. See [choices-separator][]
 * for more details.
 *
 * ```js
 * new Question.Separator();
 * ```
 * @param {String} `separator` Optionally pass a string to use as the separator.
 * @return {Object} Returns a separator object.
 * @api public
 */

Question.Separator = Choices.Separator;

/**
 * Expose `Question`
 */

module.exports = Question;
