'use strict';

require('mocha');
var util = require('util');
var assert = require('assert');
var Question = require('./');

describe('enquirer-question', function() {
  it('should export a function', function() {
    assert.equal(typeof Question, 'function');
  });

  it('should throw an error when invalid args are passed', function(cb) {
    try {
      new Question();
      cb(new Error('expected an error'));
    } catch (err) {
      assert(err);
      assert.equal(err.message, 'expected a string or object');
      cb();
    }
  });

  it('should create a new question from `name`', function() {
    var question = new Question('color');
    assert.deepEqual(question, { type: 'input', name: 'color', message: 'color', options: {} });
  });

  it('should create a new question from `name` and `message`', function() {
    var question = new Question('color', 'Favorite color?');
    assert.deepEqual(question, { type: 'input', name: 'color', message: 'Favorite color?', options: {} });
  });

  it('should create a new question from `name`, `message` and `options`', function() {
    var question = new Question('color', 'Favorite color?', {default: 'blue'});
    assert.deepEqual(question, {
      type: 'input',
      name: 'color',
      message: 'Favorite color?',
      default: 'blue',
      options: {}
    });
  });

  it('should add normalized choices to `items` when passed to the constructor', function() {
    var question = new Question('color', 'Favorite color?', {
      default: 'blue',
      choices: ['foo', 'bar', 'baz']
    });

    assert.deepEqual(question.choices.items, [{
      name: 'foo',
      short: 'foo',
      value: 'foo',
      checked: false
    }, {
      name: 'bar',
      short: 'bar',
      value: 'bar',
      checked: false
    }, {
      name: 'baz',
      short: 'baz',
      value: 'baz',
      checked: false
    }]);
  });

  it('should add normalized choices when set directly on `choices`', function() {
    var question = new Question('color', 'Favorite color?', {
      default: 'blue'
    });

    question.choices = ['foo', 'bar', 'baz'];

    assert.deepEqual(question.choices.items, [{
      name: 'foo',
      short: 'foo',
      value: 'foo',
      checked: false
    }, {
      name: 'bar',
      short: 'bar',
      value: 'bar',
      checked: false
    }, {
      name: 'baz',
      short: 'baz',
      value: 'baz',
      checked: false
    }]);
  });
});
