// fetch() polyfill for making API calls.
require('whatwg-fetch');
require('intersection-observer');

// this is for webpack build to know where to fetch chunks from
window.__webpack_public_path__ = `${document.location.origin}/`;

/**
 * Add polyfills as needed here to support IE11
 */

if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = function(callback, thisArg) {
    /*eslint no-param-reassign: "off"*/
    thisArg = thisArg || window;
    for (var i = 0; i < this.length; i++) {
      callback.call(thisArg, this[i], i, this);
    }
  };
}

// for IE
if (!Array.prototype.fill) {
  Object.defineProperty(Array.prototype, 'fill', {
    value: function(value) {
      // Steps 1-2.
      if (this == null) {
        throw new TypeError('this is null or not defined');
      }

      var O = Object(this);

      // Steps 3-5.
      var len = O.length >>> 0;

      // Steps 6-7.
      var start = arguments[1];
      var relativeStart = start >> 0;

      // Step 8.
      var k = relativeStart < 0 ? Math.max(len + relativeStart, 0) : Math.min(relativeStart, len);

      // Steps 9-10.
      var end = arguments[2];
      var relativeEnd = end === undefined ? len : end >> 0;

      // Step 11.
      var final = relativeEnd < 0 ? Math.max(len + relativeEnd, 0) : Math.min(relativeEnd, len);

      // Step 12.
      while (k < final) {
        O[k] = value;
        k++;
      }

      // Step 13.
      return O;
    }
  });
}

// for IE
if (!String.prototype.repeat) {
  String.prototype.repeat = function(count) {
    'use strict';
    if (this == null) {
      // check if `this` is null or undefined
      throw new TypeError("can't convert " + this + ' to object');
    }
    var str = '' + this;
    // To convert string to integer.
    count = +count;
    if (count < 0) {
      throw new RangeError('repeat count must be non-negative');
    }
    if (count == Infinity) {
      throw new RangeError('repeat count must be less than infinity');
    }
    count |= 0; // floors and rounds-down it.
    if (str.length == 0 || count == 0) {
      return '';
    }
    // Ensuring count is a 31-bit integer allows us to heavily optimize the main
    // part. But anyway, most current (August 2014) browsers can't handle strings 1
    // << 28 chars or longer, so:
    if (str.length * count >= 1 << 28) {
      throw new RangeError('repeat count must not overflow maximum string size');
    }
    while ((count >>= 1)) {
      // shift it by multiple of 2 because this is binary summation of series
      str += str; // binary summation
    }
    str += str.substring(0, str.length * count - str.length);
    return str;
  };
}

// for IE
if (!Element.prototype.matches) {
  Element.prototype.matches =
    Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
  Element.prototype.closest = function(s) {
    let el = this;

    do {
      if (el.matches(s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  };
}

Number.isInteger =
  Number.isInteger ||
  function(value) {
    return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
  };

// IE9+ CustomEvent polyfill
(function() {
  if (typeof window.CustomEvent === 'function') return false; //If not IE
  function CustomEvent(event, params) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    const evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  }
  CustomEvent.prototype = window.Event.prototype;
  window.CustomEvent = CustomEvent;
})();

// Add new functionality for Local ISO String to Date object
Date.prototype.toLocalISOString = function() {
  // ISO 8601
  let d = this,
    pad = function(n) {
      return n < 10 ? '0' + n : n;
    },
    tz = d.getTimezoneOffset(), //mins
    tzs = (tz > 0 ? '-' : '+') + pad(Math.abs(parseInt(tz / 60)));

  if (tz === 0) {
    tzs = 'Z';
  } else {
    // ISO Format requires a HH:mm offset
    tzs += ':' + pad(Math.abs(tz % 60));
  }

  return (
    d.getFullYear() +
    '-' +
    pad(d.getMonth() + 1) +
    '-' +
    pad(d.getDate()) +
    'T' +
    pad(d.getHours()) +
    ':' +
    pad(d.getMinutes()) +
    ':' +
    pad(d.getSeconds()) +
    tzs
  );
};

Date.prototype.toLocalFromUTC = function() {
  let d = this,
    pad = function(n) {
      return n < 10 ? '0' + n : n;
    },
    hours = d.getHours();

  return (
    pad(d.getMonth() + 1) +
    '-' +
    pad(d.getDate()) +
    '-' +
    d.getFullYear() +
    ' ' +
    (hours > 11 ? hours - 12 : hours) +
    ':' +
    pad(d.getMinutes()) +
    ' ' +
    (hours > 11 ? 'PM' : 'AM')
  );
};
