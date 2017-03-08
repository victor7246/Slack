(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.TestBundle = global.TestBundle || {})));
}(this, (function (exports) { 'use strict';

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};









var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

















var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

var _class;
var _temp;

function test() {
  console.log('Hello bundle');
}

var TestClass = function TestClass() {
  classCallCheck(this, TestClass);

  console.log('constructor: ');
};

// supported by the 'stage-0' preset
var TestClass2 = (_temp = _class = function TestClass2() {
  classCallCheck(this, TestClass2);
  this.myProp2 = 'prop';
}, _class.myProp1 = 'static prop', _temp);

var test1 = new TestClass();
var test2 = new TestClass();

console.log(test1, test2);

exports.test = test;
exports.TestClass = TestClass;
exports.TestClass2 = TestClass2;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=es6.umd-es2015.js.map
