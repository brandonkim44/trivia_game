/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 662:
/***/ (function(module, exports, __webpack_require__) {

/* module decorator */ module = __webpack_require__.nmd(module);
(function (global, factory) {
   true ? factory(exports) : 0;
})(this, function (exports) {
  'use strict';

  function slice(arrayLike, start) {
    start = start | 0;
    var newLen = Math.max(arrayLike.length - start, 0);
    var newArr = Array(newLen);

    for (var idx = 0; idx < newLen; idx++) {
      newArr[idx] = arrayLike[start + idx];
    }

    return newArr;
  }
  /**
   * Creates a continuation function with some arguments already applied.
   *
   * Useful as a shorthand when combined with other control flow functions. Any
   * arguments passed to the returned function are added to the arguments
   * originally passed to apply.
   *
   * @name apply
   * @static
   * @memberOf module:Utils
   * @method
   * @category Util
   * @param {Function} fn - The function you want to eventually apply all
   * arguments to. Invokes with (arguments...).
   * @param {...*} arguments... - Any number of arguments to automatically apply
   * when the continuation is called.
   * @returns {Function} the partially-applied function
   * @example
   *
   * // using apply
   * async.parallel([
   *     async.apply(fs.writeFile, 'testfile1', 'test1'),
   *     async.apply(fs.writeFile, 'testfile2', 'test2')
   * ]);
   *
   *
   * // the same process without using apply
   * async.parallel([
   *     function(callback) {
   *         fs.writeFile('testfile1', 'test1', callback);
   *     },
   *     function(callback) {
   *         fs.writeFile('testfile2', 'test2', callback);
   *     }
   * ]);
   *
   * // It's possible to pass any number of additional arguments when calling the
   * // continuation:
   *
   * node> var fn = async.apply(sys.puts, 'one');
   * node> fn('two', 'three');
   * one
   * two
   * three
   */


  var apply = function (fn
  /*, ...args*/
  ) {
    var args = slice(arguments, 1);
    return function ()
    /*callArgs*/
    {
      var callArgs = slice(arguments);
      return fn.apply(null, args.concat(callArgs));
    };
  };

  var initialParams = function (fn) {
    return function ()
    /*...args, callback*/
    {
      var args = slice(arguments);
      var callback = args.pop();
      fn.call(this, args, callback);
    };
  };
  /**
   * Checks if `value` is the
   * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
   * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an object, else `false`.
   * @example
   *
   * _.isObject({});
   * // => true
   *
   * _.isObject([1, 2, 3]);
   * // => true
   *
   * _.isObject(_.noop);
   * // => true
   *
   * _.isObject(null);
   * // => false
   */


  function isObject(value) {
    var type = typeof value;
    return value != null && (type == 'object' || type == 'function');
  }

  var hasSetImmediate = typeof setImmediate === 'function' && setImmediate;
  var hasNextTick = typeof process === 'object' && typeof process.nextTick === 'function';

  function fallback(fn) {
    setTimeout(fn, 0);
  }

  function wrap(defer) {
    return function (fn
    /*, ...args*/
    ) {
      var args = slice(arguments, 1);
      defer(function () {
        fn.apply(null, args);
      });
    };
  }

  var _defer;

  if (hasSetImmediate) {
    _defer = setImmediate;
  } else if (hasNextTick) {
    _defer = process.nextTick;
  } else {
    _defer = fallback;
  }

  var setImmediate$1 = wrap(_defer);
  /**
   * Take a sync function and make it async, passing its return value to a
   * callback. This is useful for plugging sync functions into a waterfall,
   * series, or other async functions. Any arguments passed to the generated
   * function will be passed to the wrapped function (except for the final
   * callback argument). Errors thrown will be passed to the callback.
   *
   * If the function passed to `asyncify` returns a Promise, that promises's
   * resolved/rejected state will be used to call the callback, rather than simply
   * the synchronous return value.
   *
   * This also means you can asyncify ES2017 `async` functions.
   *
   * @name asyncify
   * @static
   * @memberOf module:Utils
   * @method
   * @alias wrapSync
   * @category Util
   * @param {Function} func - The synchronous function, or Promise-returning
   * function to convert to an {@link AsyncFunction}.
   * @returns {AsyncFunction} An asynchronous wrapper of the `func`. To be
   * invoked with `(args..., callback)`.
   * @example
   *
   * // passing a regular synchronous function
   * async.waterfall([
   *     async.apply(fs.readFile, filename, "utf8"),
   *     async.asyncify(JSON.parse),
   *     function (data, next) {
   *         // data is the result of parsing the text.
   *         // If there was a parsing error, it would have been caught.
   *     }
   * ], callback);
   *
   * // passing a function returning a promise
   * async.waterfall([
   *     async.apply(fs.readFile, filename, "utf8"),
   *     async.asyncify(function (contents) {
   *         return db.model.create(contents);
   *     }),
   *     function (model, next) {
   *         // `model` is the instantiated model object.
   *         // If there was an error, this function would be skipped.
   *     }
   * ], callback);
   *
   * // es2017 example, though `asyncify` is not needed if your JS environment
   * // supports async functions out of the box
   * var q = async.queue(async.asyncify(async function(file) {
   *     var intermediateStep = await processFile(file);
   *     return await somePromise(intermediateStep)
   * }));
   *
   * q.push(files);
   */

  function asyncify(func) {
    return initialParams(function (args, callback) {
      var result;

      try {
        result = func.apply(this, args);
      } catch (e) {
        return callback(e);
      } // if result is Promise object


      if (isObject(result) && typeof result.then === 'function') {
        result.then(function (value) {
          invokeCallback(callback, null, value);
        }, function (err) {
          invokeCallback(callback, err.message ? err : new Error(err));
        });
      } else {
        callback(null, result);
      }
    });
  }

  function invokeCallback(callback, error, value) {
    try {
      callback(error, value);
    } catch (e) {
      setImmediate$1(rethrow, e);
    }
  }

  function rethrow(error) {
    throw error;
  }

  var supportsSymbol = typeof Symbol === 'function';

  function isAsync(fn) {
    return supportsSymbol && fn[Symbol.toStringTag] === 'AsyncFunction';
  }

  function wrapAsync(asyncFn) {
    return isAsync(asyncFn) ? asyncify(asyncFn) : asyncFn;
  }

  function applyEach$1(eachfn) {
    return function (fns
    /*, ...args*/
    ) {
      var args = slice(arguments, 1);
      var go = initialParams(function (args, callback) {
        var that = this;
        return eachfn(fns, function (fn, cb) {
          wrapAsync(fn).apply(that, args.concat(cb));
        }, callback);
      });

      if (args.length) {
        return go.apply(this, args);
      } else {
        return go;
      }
    };
  }
  /** Detect free variable `global` from Node.js. */


  var freeGlobal = typeof __webpack_require__.g == 'object' && __webpack_require__.g && __webpack_require__.g.Object === Object && __webpack_require__.g;
  /** Detect free variable `self`. */

  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;
  /** Used as a reference to the global object. */

  var root = freeGlobal || freeSelf || Function('return this')();
  /** Built-in value references. */

  var Symbol$1 = root.Symbol;
  /** Used for built-in method references. */

  var objectProto = Object.prototype;
  /** Used to check objects for own properties. */

  var hasOwnProperty = objectProto.hasOwnProperty;
  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */

  var nativeObjectToString = objectProto.toString;
  /** Built-in value references. */

  var symToStringTag$1 = Symbol$1 ? Symbol$1.toStringTag : undefined;
  /**
   * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the raw `toStringTag`.
   */

  function getRawTag(value) {
    var isOwn = hasOwnProperty.call(value, symToStringTag$1),
        tag = value[symToStringTag$1];

    try {
      value[symToStringTag$1] = undefined;
      var unmasked = true;
    } catch (e) {}

    var result = nativeObjectToString.call(value);

    if (unmasked) {
      if (isOwn) {
        value[symToStringTag$1] = tag;
      } else {
        delete value[symToStringTag$1];
      }
    }

    return result;
  }
  /** Used for built-in method references. */


  var objectProto$1 = Object.prototype;
  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */

  var nativeObjectToString$1 = objectProto$1.toString;
  /**
   * Converts `value` to a string using `Object.prototype.toString`.
   *
   * @private
   * @param {*} value The value to convert.
   * @returns {string} Returns the converted string.
   */

  function objectToString(value) {
    return nativeObjectToString$1.call(value);
  }
  /** `Object#toString` result references. */


  var nullTag = '[object Null]';
  var undefinedTag = '[object Undefined]';
  /** Built-in value references. */

  var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : undefined;
  /**
   * The base implementation of `getTag` without fallbacks for buggy environments.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the `toStringTag`.
   */

  function baseGetTag(value) {
    if (value == null) {
      return value === undefined ? undefinedTag : nullTag;
    }

    return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
  }
  /** `Object#toString` result references. */


  var asyncTag = '[object AsyncFunction]';
  var funcTag = '[object Function]';
  var genTag = '[object GeneratorFunction]';
  var proxyTag = '[object Proxy]';
  /**
   * Checks if `value` is classified as a `Function` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a function, else `false`.
   * @example
   *
   * _.isFunction(_);
   * // => true
   *
   * _.isFunction(/abc/);
   * // => false
   */

  function isFunction(value) {
    if (!isObject(value)) {
      return false;
    } // The use of `Object#toString` avoids issues with the `typeof` operator
    // in Safari 9 which returns 'object' for typed arrays and other constructors.


    var tag = baseGetTag(value);
    return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
  }
  /** Used as references for various `Number` constants. */


  var MAX_SAFE_INTEGER = 9007199254740991;
  /**
   * Checks if `value` is a valid array-like length.
   *
   * **Note:** This method is loosely based on
   * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
   * @example
   *
   * _.isLength(3);
   * // => true
   *
   * _.isLength(Number.MIN_VALUE);
   * // => false
   *
   * _.isLength(Infinity);
   * // => false
   *
   * _.isLength('3');
   * // => false
   */

  function isLength(value) {
    return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
  }
  /**
   * Checks if `value` is array-like. A value is considered array-like if it's
   * not a function and has a `value.length` that's an integer greater than or
   * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
   * @example
   *
   * _.isArrayLike([1, 2, 3]);
   * // => true
   *
   * _.isArrayLike(document.body.children);
   * // => true
   *
   * _.isArrayLike('abc');
   * // => true
   *
   * _.isArrayLike(_.noop);
   * // => false
   */


  function isArrayLike(value) {
    return value != null && isLength(value.length) && !isFunction(value);
  } // A temporary value used to identify if the loop should be broken.
  // See #1064, #1293


  var breakLoop = {};
  /**
   * This method returns `undefined`.
   *
   * @static
   * @memberOf _
   * @since 2.3.0
   * @category Util
   * @example
   *
   * _.times(2, _.noop);
   * // => [undefined, undefined]
   */

  function noop() {// No operation performed.
  }

  function once(fn) {
    return function () {
      if (fn === null) return;
      var callFn = fn;
      fn = null;
      callFn.apply(this, arguments);
    };
  }

  var iteratorSymbol = typeof Symbol === 'function' && Symbol.iterator;

  var getIterator = function (coll) {
    return iteratorSymbol && coll[iteratorSymbol] && coll[iteratorSymbol]();
  };
  /**
   * The base implementation of `_.times` without support for iteratee shorthands
   * or max array length checks.
   *
   * @private
   * @param {number} n The number of times to invoke `iteratee`.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the array of results.
   */


  function baseTimes(n, iteratee) {
    var index = -1,
        result = Array(n);

    while (++index < n) {
      result[index] = iteratee(index);
    }

    return result;
  }
  /**
   * Checks if `value` is object-like. A value is object-like if it's not `null`
   * and has a `typeof` result of "object".
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   * @example
   *
   * _.isObjectLike({});
   * // => true
   *
   * _.isObjectLike([1, 2, 3]);
   * // => true
   *
   * _.isObjectLike(_.noop);
   * // => false
   *
   * _.isObjectLike(null);
   * // => false
   */


  function isObjectLike(value) {
    return value != null && typeof value == 'object';
  }
  /** `Object#toString` result references. */


  var argsTag = '[object Arguments]';
  /**
   * The base implementation of `_.isArguments`.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an `arguments` object,
   */

  function baseIsArguments(value) {
    return isObjectLike(value) && baseGetTag(value) == argsTag;
  }
  /** Used for built-in method references. */


  var objectProto$3 = Object.prototype;
  /** Used to check objects for own properties. */

  var hasOwnProperty$2 = objectProto$3.hasOwnProperty;
  /** Built-in value references. */

  var propertyIsEnumerable = objectProto$3.propertyIsEnumerable;
  /**
   * Checks if `value` is likely an `arguments` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an `arguments` object,
   *  else `false`.
   * @example
   *
   * _.isArguments(function() { return arguments; }());
   * // => true
   *
   * _.isArguments([1, 2, 3]);
   * // => false
   */

  var isArguments = baseIsArguments(function () {
    return arguments;
  }()) ? baseIsArguments : function (value) {
    return isObjectLike(value) && hasOwnProperty$2.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
  };
  /**
   * Checks if `value` is classified as an `Array` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an array, else `false`.
   * @example
   *
   * _.isArray([1, 2, 3]);
   * // => true
   *
   * _.isArray(document.body.children);
   * // => false
   *
   * _.isArray('abc');
   * // => false
   *
   * _.isArray(_.noop);
   * // => false
   */

  var isArray = Array.isArray;
  /**
   * This method returns `false`.
   *
   * @static
   * @memberOf _
   * @since 4.13.0
   * @category Util
   * @returns {boolean} Returns `false`.
   * @example
   *
   * _.times(2, _.stubFalse);
   * // => [false, false]
   */

  function stubFalse() {
    return false;
  }
  /** Detect free variable `exports`. */


  var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;
  /** Detect free variable `module`. */

  var freeModule = freeExports && "object" == 'object' && module && !module.nodeType && module;
  /** Detect the popular CommonJS extension `module.exports`. */

  var moduleExports = freeModule && freeModule.exports === freeExports;
  /** Built-in value references. */

  var Buffer = moduleExports ? root.Buffer : undefined;
  /* Built-in method references for those with the same name as other `lodash` methods. */

  var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;
  /**
   * Checks if `value` is a buffer.
   *
   * @static
   * @memberOf _
   * @since 4.3.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
   * @example
   *
   * _.isBuffer(new Buffer(2));
   * // => true
   *
   * _.isBuffer(new Uint8Array(2));
   * // => false
   */

  var isBuffer = nativeIsBuffer || stubFalse;
  /** Used as references for various `Number` constants. */

  var MAX_SAFE_INTEGER$1 = 9007199254740991;
  /** Used to detect unsigned integer values. */

  var reIsUint = /^(?:0|[1-9]\d*)$/;
  /**
   * Checks if `value` is a valid array-like index.
   *
   * @private
   * @param {*} value The value to check.
   * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
   * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
   */

  function isIndex(value, length) {
    var type = typeof value;
    length = length == null ? MAX_SAFE_INTEGER$1 : length;
    return !!length && (type == 'number' || type != 'symbol' && reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
  }
  /** `Object#toString` result references. */


  var argsTag$1 = '[object Arguments]';
  var arrayTag = '[object Array]';
  var boolTag = '[object Boolean]';
  var dateTag = '[object Date]';
  var errorTag = '[object Error]';
  var funcTag$1 = '[object Function]';
  var mapTag = '[object Map]';
  var numberTag = '[object Number]';
  var objectTag = '[object Object]';
  var regexpTag = '[object RegExp]';
  var setTag = '[object Set]';
  var stringTag = '[object String]';
  var weakMapTag = '[object WeakMap]';
  var arrayBufferTag = '[object ArrayBuffer]';
  var dataViewTag = '[object DataView]';
  var float32Tag = '[object Float32Array]';
  var float64Tag = '[object Float64Array]';
  var int8Tag = '[object Int8Array]';
  var int16Tag = '[object Int16Array]';
  var int32Tag = '[object Int32Array]';
  var uint8Tag = '[object Uint8Array]';
  var uint8ClampedTag = '[object Uint8ClampedArray]';
  var uint16Tag = '[object Uint16Array]';
  var uint32Tag = '[object Uint32Array]';
  /** Used to identify `toStringTag` values of typed arrays. */

  var typedArrayTags = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
  typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag$1] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
  /**
   * The base implementation of `_.isTypedArray` without Node.js optimizations.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
   */

  function baseIsTypedArray(value) {
    return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
  }
  /**
   * The base implementation of `_.unary` without support for storing metadata.
   *
   * @private
   * @param {Function} func The function to cap arguments for.
   * @returns {Function} Returns the new capped function.
   */


  function baseUnary(func) {
    return function (value) {
      return func(value);
    };
  }
  /** Detect free variable `exports`. */


  var freeExports$1 = typeof exports == 'object' && exports && !exports.nodeType && exports;
  /** Detect free variable `module`. */

  var freeModule$1 = freeExports$1 && "object" == 'object' && module && !module.nodeType && module;
  /** Detect the popular CommonJS extension `module.exports`. */

  var moduleExports$1 = freeModule$1 && freeModule$1.exports === freeExports$1;
  /** Detect free variable `process` from Node.js. */

  var freeProcess = moduleExports$1 && freeGlobal.process;
  /** Used to access faster Node.js helpers. */

  var nodeUtil = function () {
    try {
      // Use `util.types` for Node.js 10+.
      var types = freeModule$1 && freeModule$1.require && freeModule$1.require('util').types;

      if (types) {
        return types;
      } // Legacy `process.binding('util')` for Node.js < 10.


      return freeProcess && freeProcess.binding && freeProcess.binding('util');
    } catch (e) {}
  }();
  /* Node.js helper references. */


  var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
  /**
   * Checks if `value` is classified as a typed array.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
   * @example
   *
   * _.isTypedArray(new Uint8Array);
   * // => true
   *
   * _.isTypedArray([]);
   * // => false
   */

  var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
  /** Used for built-in method references. */

  var objectProto$2 = Object.prototype;
  /** Used to check objects for own properties. */

  var hasOwnProperty$1 = objectProto$2.hasOwnProperty;
  /**
   * Creates an array of the enumerable property names of the array-like `value`.
   *
   * @private
   * @param {*} value The value to query.
   * @param {boolean} inherited Specify returning inherited property names.
   * @returns {Array} Returns the array of property names.
   */

  function arrayLikeKeys(value, inherited) {
    var isArr = isArray(value),
        isArg = !isArr && isArguments(value),
        isBuff = !isArr && !isArg && isBuffer(value),
        isType = !isArr && !isArg && !isBuff && isTypedArray(value),
        skipIndexes = isArr || isArg || isBuff || isType,
        result = skipIndexes ? baseTimes(value.length, String) : [],
        length = result.length;

    for (var key in value) {
      if ((inherited || hasOwnProperty$1.call(value, key)) && !(skipIndexes && ( // Safari 9 has enumerable `arguments.length` in strict mode.
      key == 'length' || // Node.js 0.10 has enumerable non-index properties on buffers.
      isBuff && (key == 'offset' || key == 'parent') || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset') || // Skip index properties.
      isIndex(key, length)))) {
        result.push(key);
      }
    }

    return result;
  }
  /** Used for built-in method references. */


  var objectProto$5 = Object.prototype;
  /**
   * Checks if `value` is likely a prototype object.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
   */

  function isPrototype(value) {
    var Ctor = value && value.constructor,
        proto = typeof Ctor == 'function' && Ctor.prototype || objectProto$5;
    return value === proto;
  }
  /**
   * Creates a unary function that invokes `func` with its argument transformed.
   *
   * @private
   * @param {Function} func The function to wrap.
   * @param {Function} transform The argument transform.
   * @returns {Function} Returns the new function.
   */


  function overArg(func, transform) {
    return function (arg) {
      return func(transform(arg));
    };
  }
  /* Built-in method references for those with the same name as other `lodash` methods. */


  var nativeKeys = overArg(Object.keys, Object);
  /** Used for built-in method references. */

  var objectProto$4 = Object.prototype;
  /** Used to check objects for own properties. */

  var hasOwnProperty$3 = objectProto$4.hasOwnProperty;
  /**
   * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   */

  function baseKeys(object) {
    if (!isPrototype(object)) {
      return nativeKeys(object);
    }

    var result = [];

    for (var key in Object(object)) {
      if (hasOwnProperty$3.call(object, key) && key != 'constructor') {
        result.push(key);
      }
    }

    return result;
  }
  /**
   * Creates an array of the own enumerable property names of `object`.
   *
   * **Note:** Non-object values are coerced to objects. See the
   * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
   * for more details.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Object
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.keys(new Foo);
   * // => ['a', 'b'] (iteration order is not guaranteed)
   *
   * _.keys('hi');
   * // => ['0', '1']
   */


  function keys(object) {
    return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
  }

  function createArrayIterator(coll) {
    var i = -1;
    var len = coll.length;
    return function next() {
      return ++i < len ? {
        value: coll[i],
        key: i
      } : null;
    };
  }

  function createES2015Iterator(iterator) {
    var i = -1;
    return function next() {
      var item = iterator.next();
      if (item.done) return null;
      i++;
      return {
        value: item.value,
        key: i
      };
    };
  }

  function createObjectIterator(obj) {
    var okeys = keys(obj);
    var i = -1;
    var len = okeys.length;
    return function next() {
      var key = okeys[++i];
      return i < len ? {
        value: obj[key],
        key: key
      } : null;
    };
  }

  function iterator(coll) {
    if (isArrayLike(coll)) {
      return createArrayIterator(coll);
    }

    var iterator = getIterator(coll);
    return iterator ? createES2015Iterator(iterator) : createObjectIterator(coll);
  }

  function onlyOnce(fn) {
    return function () {
      if (fn === null) throw new Error("Callback was already called.");
      var callFn = fn;
      fn = null;
      callFn.apply(this, arguments);
    };
  }

  function _eachOfLimit(limit) {
    return function (obj, iteratee, callback) {
      callback = once(callback || noop);

      if (limit <= 0 || !obj) {
        return callback(null);
      }

      var nextElem = iterator(obj);
      var done = false;
      var running = 0;
      var looping = false;

      function iterateeCallback(err, value) {
        running -= 1;

        if (err) {
          done = true;
          callback(err);
        } else if (value === breakLoop || done && running <= 0) {
          done = true;
          return callback(null);
        } else if (!looping) {
          replenish();
        }
      }

      function replenish() {
        looping = true;

        while (running < limit && !done) {
          var elem = nextElem();

          if (elem === null) {
            done = true;

            if (running <= 0) {
              callback(null);
            }

            return;
          }

          running += 1;
          iteratee(elem.value, elem.key, onlyOnce(iterateeCallback));
        }

        looping = false;
      }

      replenish();
    };
  }
  /**
   * The same as [`eachOf`]{@link module:Collections.eachOf} but runs a maximum of `limit` async operations at a
   * time.
   *
   * @name eachOfLimit
   * @static
   * @memberOf module:Collections
   * @method
   * @see [async.eachOf]{@link module:Collections.eachOf}
   * @alias forEachOfLimit
   * @category Collection
   * @param {Array|Iterable|Object} coll - A collection to iterate over.
   * @param {number} limit - The maximum number of async operations at a time.
   * @param {AsyncFunction} iteratee - An async function to apply to each
   * item in `coll`. The `key` is the item's key, or index in the case of an
   * array.
   * Invoked with (item, key, callback).
   * @param {Function} [callback] - A callback which is called when all
   * `iteratee` functions have finished, or an error occurs. Invoked with (err).
   */


  function eachOfLimit(coll, limit, iteratee, callback) {
    _eachOfLimit(limit)(coll, wrapAsync(iteratee), callback);
  }

  function doLimit(fn, limit) {
    return function (iterable, iteratee, callback) {
      return fn(iterable, limit, iteratee, callback);
    };
  } // eachOf implementation optimized for array-likes


  function eachOfArrayLike(coll, iteratee, callback) {
    callback = once(callback || noop);
    var index = 0,
        completed = 0,
        length = coll.length;

    if (length === 0) {
      callback(null);
    }

    function iteratorCallback(err, value) {
      if (err) {
        callback(err);
      } else if (++completed === length || value === breakLoop) {
        callback(null);
      }
    }

    for (; index < length; index++) {
      iteratee(coll[index], index, onlyOnce(iteratorCallback));
    }
  } // a generic version of eachOf which can handle array, object, and iterator cases.


  var eachOfGeneric = doLimit(eachOfLimit, Infinity);
  /**
   * Like [`each`]{@link module:Collections.each}, except that it passes the key (or index) as the second argument
   * to the iteratee.
   *
   * @name eachOf
   * @static
   * @memberOf module:Collections
   * @method
   * @alias forEachOf
   * @category Collection
   * @see [async.each]{@link module:Collections.each}
   * @param {Array|Iterable|Object} coll - A collection to iterate over.
   * @param {AsyncFunction} iteratee - A function to apply to each
   * item in `coll`.
   * The `key` is the item's key, or index in the case of an array.
   * Invoked with (item, key, callback).
   * @param {Function} [callback] - A callback which is called when all
   * `iteratee` functions have finished, or an error occurs. Invoked with (err).
   * @example
   *
   * var obj = {dev: "/dev.json", test: "/test.json", prod: "/prod.json"};
   * var configs = {};
   *
   * async.forEachOf(obj, function (value, key, callback) {
   *     fs.readFile(__dirname + value, "utf8", function (err, data) {
   *         if (err) return callback(err);
   *         try {
   *             configs[key] = JSON.parse(data);
   *         } catch (e) {
   *             return callback(e);
   *         }
   *         callback();
   *     });
   * }, function (err) {
   *     if (err) console.error(err.message);
   *     // configs is now a map of JSON data
   *     doSomethingWith(configs);
   * });
   */

  var eachOf = function (coll, iteratee, callback) {
    var eachOfImplementation = isArrayLike(coll) ? eachOfArrayLike : eachOfGeneric;
    eachOfImplementation(coll, wrapAsync(iteratee), callback);
  };

  function doParallel(fn) {
    return function (obj, iteratee, callback) {
      return fn(eachOf, obj, wrapAsync(iteratee), callback);
    };
  }

  function _asyncMap(eachfn, arr, iteratee, callback) {
    callback = callback || noop;
    arr = arr || [];
    var results = [];
    var counter = 0;

    var _iteratee = wrapAsync(iteratee);

    eachfn(arr, function (value, _, callback) {
      var index = counter++;

      _iteratee(value, function (err, v) {
        results[index] = v;
        callback(err);
      });
    }, function (err) {
      callback(err, results);
    });
  }
  /**
   * Produces a new collection of values by mapping each value in `coll` through
   * the `iteratee` function. The `iteratee` is called with an item from `coll`
   * and a callback for when it has finished processing. Each of these callback
   * takes 2 arguments: an `error`, and the transformed item from `coll`. If
   * `iteratee` passes an error to its callback, the main `callback` (for the
   * `map` function) is immediately called with the error.
   *
   * Note, that since this function applies the `iteratee` to each item in
   * parallel, there is no guarantee that the `iteratee` functions will complete
   * in order. However, the results array will be in the same order as the
   * original `coll`.
   *
   * If `map` is passed an Object, the results will be an Array.  The results
   * will roughly be in the order of the original Objects' keys (but this can
   * vary across JavaScript engines).
   *
   * @name map
   * @static
   * @memberOf module:Collections
   * @method
   * @category Collection
   * @param {Array|Iterable|Object} coll - A collection to iterate over.
   * @param {AsyncFunction} iteratee - An async function to apply to each item in
   * `coll`.
   * The iteratee should complete with the transformed item.
   * Invoked with (item, callback).
   * @param {Function} [callback] - A callback which is called when all `iteratee`
   * functions have finished, or an error occurs. Results is an Array of the
   * transformed items from the `coll`. Invoked with (err, results).
   * @example
   *
   * async.map(['file1','file2','file3'], fs.stat, function(err, results) {
   *     // results is now an array of stats for each file
   * });
   */


  var map = doParallel(_asyncMap);
  /**
   * Applies the provided arguments to each function in the array, calling
   * `callback` after all functions have completed. If you only provide the first
   * argument, `fns`, then it will return a function which lets you pass in the
   * arguments as if it were a single function call. If more arguments are
   * provided, `callback` is required while `args` is still optional.
   *
   * @name applyEach
   * @static
   * @memberOf module:ControlFlow
   * @method
   * @category Control Flow
   * @param {Array|Iterable|Object} fns - A collection of {@link AsyncFunction}s
   * to all call with the same arguments
   * @param {...*} [args] - any number of separate arguments to pass to the
   * function.
   * @param {Function} [callback] - the final argument should be the callback,
   * called when all functions have completed processing.
   * @returns {Function} - If only the first argument, `fns`, is provided, it will
   * return a function which lets you pass in the arguments as if it were a single
   * function call. The signature is `(..args, callback)`. If invoked with any
   * arguments, `callback` is required.
   * @example
   *
   * async.applyEach([enableSearch, updateSchema], 'bucket', callback);
   *
   * // partial application example:
   * async.each(
   *     buckets,
   *     async.applyEach([enableSearch, updateSchema]),
   *     callback
   * );
   */

  var applyEach = applyEach$1(map);

  function doParallelLimit(fn) {
    return function (obj, limit, iteratee, callback) {
      return fn(_eachOfLimit(limit), obj, wrapAsync(iteratee), callback);
    };
  }
  /**
   * The same as [`map`]{@link module:Collections.map} but runs a maximum of `limit` async operations at a time.
   *
   * @name mapLimit
   * @static
   * @memberOf module:Collections
   * @method
   * @see [async.map]{@link module:Collections.map}
   * @category Collection
   * @param {Array|Iterable|Object} coll - A collection to iterate over.
   * @param {number} limit - The maximum number of async operations at a time.
   * @param {AsyncFunction} iteratee - An async function to apply to each item in
   * `coll`.
   * The iteratee should complete with the transformed item.
   * Invoked with (item, callback).
   * @param {Function} [callback] - A callback which is called when all `iteratee`
   * functions have finished, or an error occurs. Results is an array of the
   * transformed items from the `coll`. Invoked with (err, results).
   */


  var mapLimit = doParallelLimit(_asyncMap);
  /**
   * The same as [`map`]{@link module:Collections.map} but runs only a single async operation at a time.
   *
   * @name mapSeries
   * @static
   * @memberOf module:Collections
   * @method
   * @see [async.map]{@link module:Collections.map}
   * @category Collection
   * @param {Array|Iterable|Object} coll - A collection to iterate over.
   * @param {AsyncFunction} iteratee - An async function to apply to each item in
   * `coll`.
   * The iteratee should complete with the transformed item.
   * Invoked with (item, callback).
   * @param {Function} [callback] - A callback which is called when all `iteratee`
   * functions have finished, or an error occurs. Results is an array of the
   * transformed items from the `coll`. Invoked with (err, results).
   */

  var mapSeries = doLimit(mapLimit, 1);
  /**
   * The same as [`applyEach`]{@link module:ControlFlow.applyEach} but runs only a single async operation at a time.
   *
   * @name applyEachSeries
   * @static
   * @memberOf module:ControlFlow
   * @method
   * @see [async.applyEach]{@link module:ControlFlow.applyEach}
   * @category Control Flow
   * @param {Array|Iterable|Object} fns - A collection of {@link AsyncFunction}s to all
   * call with the same arguments
   * @param {...*} [args] - any number of separate arguments to pass to the
   * function.
   * @param {Function} [callback] - the final argument should be the callback,
   * called when all functions have completed processing.
   * @returns {Function} - If only the first argument is provided, it will return
   * a function which lets you pass in the arguments as if it were a single
   * function call.
   */

  var applyEachSeries = applyEach$1(mapSeries);
  /**
   * A specialized version of `_.forEach` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns `array`.
   */

  function arrayEach(array, iteratee) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      if (iteratee(array[index], index, array) === false) {
        break;
      }
    }

    return array;
  }
  /**
   * Creates a base function for methods like `_.forIn` and `_.forOwn`.
   *
   * @private
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {Function} Returns the new base function.
   */


  function createBaseFor(fromRight) {
    return function (object, iteratee, keysFunc) {
      var index = -1,
          iterable = Object(object),
          props = keysFunc(object),
          length = props.length;

      while (length--) {
        var key = props[fromRight ? length : ++index];

        if (iteratee(iterable[key], key, iterable) === false) {
          break;
        }
      }

      return object;
    };
  }
  /**
   * The base implementation of `baseForOwn` which iterates over `object`
   * properties returned by `keysFunc` and invokes `iteratee` for each property.
   * Iteratee functions may exit iteration early by explicitly returning `false`.
   *
   * @private
   * @param {Object} object The object to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {Function} keysFunc The function to get the keys of `object`.
   * @returns {Object} Returns `object`.
   */


  var baseFor = createBaseFor();
  /**
   * The base implementation of `_.forOwn` without support for iteratee shorthands.
   *
   * @private
   * @param {Object} object The object to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Object} Returns `object`.
   */

  function baseForOwn(object, iteratee) {
    return object && baseFor(object, iteratee, keys);
  }
  /**
   * The base implementation of `_.findIndex` and `_.findLastIndex` without
   * support for iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {Function} predicate The function invoked per iteration.
   * @param {number} fromIndex The index to search from.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */


  function baseFindIndex(array, predicate, fromIndex, fromRight) {
    var length = array.length,
        index = fromIndex + (fromRight ? 1 : -1);

    while (fromRight ? index-- : ++index < length) {
      if (predicate(array[index], index, array)) {
        return index;
      }
    }

    return -1;
  }
  /**
   * The base implementation of `_.isNaN` without support for number objects.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
   */


  function baseIsNaN(value) {
    return value !== value;
  }
  /**
   * A specialized version of `_.indexOf` which performs strict equality
   * comparisons of values, i.e. `===`.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */


  function strictIndexOf(array, value, fromIndex) {
    var index = fromIndex - 1,
        length = array.length;

    while (++index < length) {
      if (array[index] === value) {
        return index;
      }
    }

    return -1;
  }
  /**
   * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */


  function baseIndexOf(array, value, fromIndex) {
    return value === value ? strictIndexOf(array, value, fromIndex) : baseFindIndex(array, baseIsNaN, fromIndex);
  }
  /**
   * Determines the best order for running the {@link AsyncFunction}s in `tasks`, based on
   * their requirements. Each function can optionally depend on other functions
   * being completed first, and each function is run as soon as its requirements
   * are satisfied.
   *
   * If any of the {@link AsyncFunction}s pass an error to their callback, the `auto` sequence
   * will stop. Further tasks will not execute (so any other functions depending
   * on it will not run), and the main `callback` is immediately called with the
   * error.
   *
   * {@link AsyncFunction}s also receive an object containing the results of functions which
   * have completed so far as the first argument, if they have dependencies. If a
   * task function has no dependencies, it will only be passed a callback.
   *
   * @name auto
   * @static
   * @memberOf module:ControlFlow
   * @method
   * @category Control Flow
   * @param {Object} tasks - An object. Each of its properties is either a
   * function or an array of requirements, with the {@link AsyncFunction} itself the last item
   * in the array. The object's key of a property serves as the name of the task
   * defined by that property, i.e. can be used when specifying requirements for
   * other tasks. The function receives one or two arguments:
   * * a `results` object, containing the results of the previously executed
   *   functions, only passed if the task has any dependencies,
   * * a `callback(err, result)` function, which must be called when finished,
   *   passing an `error` (which can be `null`) and the result of the function's
   *   execution.
   * @param {number} [concurrency=Infinity] - An optional `integer` for
   * determining the maximum number of tasks that can be run in parallel. By
   * default, as many as possible.
   * @param {Function} [callback] - An optional callback which is called when all
   * the tasks have been completed. It receives the `err` argument if any `tasks`
   * pass an error to their callback. Results are always returned; however, if an
   * error occurs, no further `tasks` will be performed, and the results object
   * will only contain partial results. Invoked with (err, results).
   * @returns undefined
   * @example
   *
   * async.auto({
   *     // this function will just be passed a callback
   *     readData: async.apply(fs.readFile, 'data.txt', 'utf-8'),
   *     showData: ['readData', function(results, cb) {
   *         // results.readData is the file's contents
   *         // ...
   *     }]
   * }, callback);
   *
   * async.auto({
   *     get_data: function(callback) {
   *         console.log('in get_data');
   *         // async code to get some data
   *         callback(null, 'data', 'converted to array');
   *     },
   *     make_folder: function(callback) {
   *         console.log('in make_folder');
   *         // async code to create a directory to store a file in
   *         // this is run at the same time as getting the data
   *         callback(null, 'folder');
   *     },
   *     write_file: ['get_data', 'make_folder', function(results, callback) {
   *         console.log('in write_file', JSON.stringify(results));
   *         // once there is some data and the directory exists,
   *         // write the data to a file in the directory
   *         callback(null, 'filename');
   *     }],
   *     email_link: ['write_file', function(results, callback) {
   *         console.log('in email_link', JSON.stringify(results));
   *         // once the file is written let's email a link to it...
   *         // results.write_file contains the filename returned by write_file.
   *         callback(null, {'file':results.write_file, 'email':'user@example.com'});
   *     }]
   * }, function(err, results) {
   *     console.log('err = ', err);
   *     console.log('results = ', results);
   * });
   */


  var auto = function (tasks, concurrency, callback) {
    if (typeof concurrency === 'function') {
      // concurrency is optional, shift the args.
      callback = concurrency;
      concurrency = null;
    }

    callback = once(callback || noop);
    var keys$$1 = keys(tasks);
    var numTasks = keys$$1.length;

    if (!numTasks) {
      return callback(null);
    }

    if (!concurrency) {
      concurrency = numTasks;
    }

    var results = {};
    var runningTasks = 0;
    var hasError = false;
    var listeners = Object.create(null);
    var readyTasks = []; // for cycle detection:

    var readyToCheck = []; // tasks that have been identified as reachable
    // without the possibility of returning to an ancestor task

    var uncheckedDependencies = {};
    baseForOwn(tasks, function (task, key) {
      if (!isArray(task)) {
        // no dependencies
        enqueueTask(key, [task]);
        readyToCheck.push(key);
        return;
      }

      var dependencies = task.slice(0, task.length - 1);
      var remainingDependencies = dependencies.length;

      if (remainingDependencies === 0) {
        enqueueTask(key, task);
        readyToCheck.push(key);
        return;
      }

      uncheckedDependencies[key] = remainingDependencies;
      arrayEach(dependencies, function (dependencyName) {
        if (!tasks[dependencyName]) {
          throw new Error('async.auto task `' + key + '` has a non-existent dependency `' + dependencyName + '` in ' + dependencies.join(', '));
        }

        addListener(dependencyName, function () {
          remainingDependencies--;

          if (remainingDependencies === 0) {
            enqueueTask(key, task);
          }
        });
      });
    });
    checkForDeadlocks();
    processQueue();

    function enqueueTask(key, task) {
      readyTasks.push(function () {
        runTask(key, task);
      });
    }

    function processQueue() {
      if (readyTasks.length === 0 && runningTasks === 0) {
        return callback(null, results);
      }

      while (readyTasks.length && runningTasks < concurrency) {
        var run = readyTasks.shift();
        run();
      }
    }

    function addListener(taskName, fn) {
      var taskListeners = listeners[taskName];

      if (!taskListeners) {
        taskListeners = listeners[taskName] = [];
      }

      taskListeners.push(fn);
    }

    function taskComplete(taskName) {
      var taskListeners = listeners[taskName] || [];
      arrayEach(taskListeners, function (fn) {
        fn();
      });
      processQueue();
    }

    function runTask(key, task) {
      if (hasError) return;
      var taskCallback = onlyOnce(function (err, result) {
        runningTasks--;

        if (arguments.length > 2) {
          result = slice(arguments, 1);
        }

        if (err) {
          var safeResults = {};
          baseForOwn(results, function (val, rkey) {
            safeResults[rkey] = val;
          });
          safeResults[key] = result;
          hasError = true;
          listeners = Object.create(null);
          callback(err, safeResults);
        } else {
          results[key] = result;
          taskComplete(key);
        }
      });
      runningTasks++;
      var taskFn = wrapAsync(task[task.length - 1]);

      if (task.length > 1) {
        taskFn(results, taskCallback);
      } else {
        taskFn(taskCallback);
      }
    }

    function checkForDeadlocks() {
      // Kahn's algorithm
      // https://en.wikipedia.org/wiki/Topological_sorting#Kahn.27s_algorithm
      // http://connalle.blogspot.com/2013/10/topological-sortingkahn-algorithm.html
      var currentTask;
      var counter = 0;

      while (readyToCheck.length) {
        currentTask = readyToCheck.pop();
        counter++;
        arrayEach(getDependents(currentTask), function (dependent) {
          if (--uncheckedDependencies[dependent] === 0) {
            readyToCheck.push(dependent);
          }
        });
      }

      if (counter !== numTasks) {
        throw new Error('async.auto cannot execute tasks due to a recursive dependency');
      }
    }

    function getDependents(taskName) {
      var result = [];
      baseForOwn(tasks, function (task, key) {
        if (isArray(task) && baseIndexOf(task, taskName, 0) >= 0) {
          result.push(key);
        }
      });
      return result;
    }
  };
  /**
   * A specialized version of `_.map` for arrays without support for iteratee
   * shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the new mapped array.
   */


  function arrayMap(array, iteratee) {
    var index = -1,
        length = array == null ? 0 : array.length,
        result = Array(length);

    while (++index < length) {
      result[index] = iteratee(array[index], index, array);
    }

    return result;
  }
  /** `Object#toString` result references. */


  var symbolTag = '[object Symbol]';
  /**
   * Checks if `value` is classified as a `Symbol` primitive or object.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
   * @example
   *
   * _.isSymbol(Symbol.iterator);
   * // => true
   *
   * _.isSymbol('abc');
   * // => false
   */

  function isSymbol(value) {
    return typeof value == 'symbol' || isObjectLike(value) && baseGetTag(value) == symbolTag;
  }
  /** Used as references for various `Number` constants. */


  var INFINITY = 1 / 0;
  /** Used to convert symbols to primitives and strings. */

  var symbolProto = Symbol$1 ? Symbol$1.prototype : undefined;
  var symbolToString = symbolProto ? symbolProto.toString : undefined;
  /**
   * The base implementation of `_.toString` which doesn't convert nullish
   * values to empty strings.
   *
   * @private
   * @param {*} value The value to process.
   * @returns {string} Returns the string.
   */

  function baseToString(value) {
    // Exit early for strings to avoid a performance hit in some environments.
    if (typeof value == 'string') {
      return value;
    }

    if (isArray(value)) {
      // Recursively convert values (susceptible to call stack limits).
      return arrayMap(value, baseToString) + '';
    }

    if (isSymbol(value)) {
      return symbolToString ? symbolToString.call(value) : '';
    }

    var result = value + '';
    return result == '0' && 1 / value == -INFINITY ? '-0' : result;
  }
  /**
   * The base implementation of `_.slice` without an iteratee call guard.
   *
   * @private
   * @param {Array} array The array to slice.
   * @param {number} [start=0] The start position.
   * @param {number} [end=array.length] The end position.
   * @returns {Array} Returns the slice of `array`.
   */


  function baseSlice(array, start, end) {
    var index = -1,
        length = array.length;

    if (start < 0) {
      start = -start > length ? 0 : length + start;
    }

    end = end > length ? length : end;

    if (end < 0) {
      end += length;
    }

    length = start > end ? 0 : end - start >>> 0;
    start >>>= 0;
    var result = Array(length);

    while (++index < length) {
      result[index] = array[index + start];
    }

    return result;
  }
  /**
   * Casts `array` to a slice if it's needed.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {number} start The start position.
   * @param {number} [end=array.length] The end position.
   * @returns {Array} Returns the cast slice.
   */


  function castSlice(array, start, end) {
    var length = array.length;
    end = end === undefined ? length : end;
    return !start && end >= length ? array : baseSlice(array, start, end);
  }
  /**
   * Used by `_.trim` and `_.trimEnd` to get the index of the last string symbol
   * that is not found in the character symbols.
   *
   * @private
   * @param {Array} strSymbols The string symbols to inspect.
   * @param {Array} chrSymbols The character symbols to find.
   * @returns {number} Returns the index of the last unmatched string symbol.
   */


  function charsEndIndex(strSymbols, chrSymbols) {
    var index = strSymbols.length;

    while (index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}

    return index;
  }
  /**
   * Used by `_.trim` and `_.trimStart` to get the index of the first string symbol
   * that is not found in the character symbols.
   *
   * @private
   * @param {Array} strSymbols The string symbols to inspect.
   * @param {Array} chrSymbols The character symbols to find.
   * @returns {number} Returns the index of the first unmatched string symbol.
   */


  function charsStartIndex(strSymbols, chrSymbols) {
    var index = -1,
        length = strSymbols.length;

    while (++index < length && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}

    return index;
  }
  /**
   * Converts an ASCII `string` to an array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the converted array.
   */


  function asciiToArray(string) {
    return string.split('');
  }
  /** Used to compose unicode character classes. */


  var rsAstralRange = '\\ud800-\\udfff';
  var rsComboMarksRange = '\\u0300-\\u036f';
  var reComboHalfMarksRange = '\\ufe20-\\ufe2f';
  var rsComboSymbolsRange = '\\u20d0-\\u20ff';
  var rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange;
  var rsVarRange = '\\ufe0e\\ufe0f';
  /** Used to compose unicode capture groups. */

  var rsZWJ = '\\u200d';
  /** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */

  var reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange + rsComboRange + rsVarRange + ']');
  /**
   * Checks if `string` contains Unicode symbols.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {boolean} Returns `true` if a symbol is found, else `false`.
   */

  function hasUnicode(string) {
    return reHasUnicode.test(string);
  }
  /** Used to compose unicode character classes. */


  var rsAstralRange$1 = '\\ud800-\\udfff';
  var rsComboMarksRange$1 = '\\u0300-\\u036f';
  var reComboHalfMarksRange$1 = '\\ufe20-\\ufe2f';
  var rsComboSymbolsRange$1 = '\\u20d0-\\u20ff';
  var rsComboRange$1 = rsComboMarksRange$1 + reComboHalfMarksRange$1 + rsComboSymbolsRange$1;
  var rsVarRange$1 = '\\ufe0e\\ufe0f';
  /** Used to compose unicode capture groups. */

  var rsAstral = '[' + rsAstralRange$1 + ']';
  var rsCombo = '[' + rsComboRange$1 + ']';
  var rsFitz = '\\ud83c[\\udffb-\\udfff]';
  var rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')';
  var rsNonAstral = '[^' + rsAstralRange$1 + ']';
  var rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}';
  var rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]';
  var rsZWJ$1 = '\\u200d';
  /** Used to compose unicode regexes. */

  var reOptMod = rsModifier + '?';
  var rsOptVar = '[' + rsVarRange$1 + ']?';
  var rsOptJoin = '(?:' + rsZWJ$1 + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*';
  var rsSeq = rsOptVar + reOptMod + rsOptJoin;
  var rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';
  /** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */

  var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');
  /**
   * Converts a Unicode `string` to an array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the converted array.
   */

  function unicodeToArray(string) {
    return string.match(reUnicode) || [];
  }
  /**
   * Converts `string` to an array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the converted array.
   */


  function stringToArray(string) {
    return hasUnicode(string) ? unicodeToArray(string) : asciiToArray(string);
  }
  /**
   * Converts `value` to a string. An empty string is returned for `null`
   * and `undefined` values. The sign of `-0` is preserved.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to convert.
   * @returns {string} Returns the converted string.
   * @example
   *
   * _.toString(null);
   * // => ''
   *
   * _.toString(-0);
   * // => '-0'
   *
   * _.toString([1, 2, 3]);
   * // => '1,2,3'
   */


  function toString(value) {
    return value == null ? '' : baseToString(value);
  }
  /** Used to match leading and trailing whitespace. */


  var reTrim = /^\s+|\s+$/g;
  /**
   * Removes leading and trailing whitespace or specified characters from `string`.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category String
   * @param {string} [string=''] The string to trim.
   * @param {string} [chars=whitespace] The characters to trim.
   * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
   * @returns {string} Returns the trimmed string.
   * @example
   *
   * _.trim('  abc  ');
   * // => 'abc'
   *
   * _.trim('-_-abc-_-', '_-');
   * // => 'abc'
   *
   * _.map(['  foo  ', '  bar  '], _.trim);
   * // => ['foo', 'bar']
   */

  function trim(string, chars, guard) {
    string = toString(string);

    if (string && (guard || chars === undefined)) {
      return string.replace(reTrim, '');
    }

    if (!string || !(chars = baseToString(chars))) {
      return string;
    }

    var strSymbols = stringToArray(string),
        chrSymbols = stringToArray(chars),
        start = charsStartIndex(strSymbols, chrSymbols),
        end = charsEndIndex(strSymbols, chrSymbols) + 1;
    return castSlice(strSymbols, start, end).join('');
  }

  var FN_ARGS = /^(?:async\s+)?(function)?\s*[^\(]*\(\s*([^\)]*)\)/m;
  var FN_ARG_SPLIT = /,/;
  var FN_ARG = /(=.+)?(\s*)$/;
  var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

  function parseParams(func) {
    func = func.toString().replace(STRIP_COMMENTS, '');
    func = func.match(FN_ARGS)[2].replace(' ', '');
    func = func ? func.split(FN_ARG_SPLIT) : [];
    func = func.map(function (arg) {
      return trim(arg.replace(FN_ARG, ''));
    });
    return func;
  }
  /**
   * A dependency-injected version of the [async.auto]{@link module:ControlFlow.auto} function. Dependent
   * tasks are specified as parameters to the function, after the usual callback
   * parameter, with the parameter names matching the names of the tasks it
   * depends on. This can provide even more readable task graphs which can be
   * easier to maintain.
   *
   * If a final callback is specified, the task results are similarly injected,
   * specified as named parameters after the initial error parameter.
   *
   * The autoInject function is purely syntactic sugar and its semantics are
   * otherwise equivalent to [async.auto]{@link module:ControlFlow.auto}.
   *
   * @name autoInject
   * @static
   * @memberOf module:ControlFlow
   * @method
   * @see [async.auto]{@link module:ControlFlow.auto}
   * @category Control Flow
   * @param {Object} tasks - An object, each of whose properties is an {@link AsyncFunction} of
   * the form 'func([dependencies...], callback). The object's key of a property
   * serves as the name of the task defined by that property, i.e. can be used
   * when specifying requirements for other tasks.
   * * The `callback` parameter is a `callback(err, result)` which must be called
   *   when finished, passing an `error` (which can be `null`) and the result of
   *   the function's execution. The remaining parameters name other tasks on
   *   which the task is dependent, and the results from those tasks are the
   *   arguments of those parameters.
   * @param {Function} [callback] - An optional callback which is called when all
   * the tasks have been completed. It receives the `err` argument if any `tasks`
   * pass an error to their callback, and a `results` object with any completed
   * task results, similar to `auto`.
   * @example
   *
   * //  The example from `auto` can be rewritten as follows:
   * async.autoInject({
   *     get_data: function(callback) {
   *         // async code to get some data
   *         callback(null, 'data', 'converted to array');
   *     },
   *     make_folder: function(callback) {
   *         // async code to create a directory to store a file in
   *         // this is run at the same time as getting the data
   *         callback(null, 'folder');
   *     },
   *     write_file: function(get_data, make_folder, callback) {
   *         // once there is some data and the directory exists,
   *         // write the data to a file in the directory
   *         callback(null, 'filename');
   *     },
   *     email_link: function(write_file, callback) {
   *         // once the file is written let's email a link to it...
   *         // write_file contains the filename returned by write_file.
   *         callback(null, {'file':write_file, 'email':'user@example.com'});
   *     }
   * }, function(err, results) {
   *     console.log('err = ', err);
   *     console.log('email_link = ', results.email_link);
   * });
   *
   * // If you are using a JS minifier that mangles parameter names, `autoInject`
   * // will not work with plain functions, since the parameter names will be
   * // collapsed to a single letter identifier.  To work around this, you can
   * // explicitly specify the names of the parameters your task function needs
   * // in an array, similar to Angular.js dependency injection.
   *
   * // This still has an advantage over plain `auto`, since the results a task
   * // depends on are still spread into arguments.
   * async.autoInject({
   *     //...
   *     write_file: ['get_data', 'make_folder', function(get_data, make_folder, callback) {
   *         callback(null, 'filename');
   *     }],
   *     email_link: ['write_file', function(write_file, callback) {
   *         callback(null, {'file':write_file, 'email':'user@example.com'});
   *     }]
   *     //...
   * }, function(err, results) {
   *     console.log('err = ', err);
   *     console.log('email_link = ', results.email_link);
   * });
   */


  function autoInject(tasks, callback) {
    var newTasks = {};
    baseForOwn(tasks, function (taskFn, key) {
      var params;
      var fnIsAsync = isAsync(taskFn);
      var hasNoDeps = !fnIsAsync && taskFn.length === 1 || fnIsAsync && taskFn.length === 0;

      if (isArray(taskFn)) {
        params = taskFn.slice(0, -1);
        taskFn = taskFn[taskFn.length - 1];
        newTasks[key] = params.concat(params.length > 0 ? newTask : taskFn);
      } else if (hasNoDeps) {
        // no dependencies, use the function as-is
        newTasks[key] = taskFn;
      } else {
        params = parseParams(taskFn);

        if (taskFn.length === 0 && !fnIsAsync && params.length === 0) {
          throw new Error("autoInject task functions require explicit parameters.");
        } // remove callback param


        if (!fnIsAsync) params.pop();
        newTasks[key] = params.concat(newTask);
      }

      function newTask(results, taskCb) {
        var newArgs = arrayMap(params, function (name) {
          return results[name];
        });
        newArgs.push(taskCb);
        wrapAsync(taskFn).apply(null, newArgs);
      }
    });
    auto(newTasks, callback);
  } // Simple doubly linked list (https://en.wikipedia.org/wiki/Doubly_linked_list) implementation
  // used for queues. This implementation assumes that the node provided by the user can be modified
  // to adjust the next and last properties. We implement only the minimal functionality
  // for queue support.


  function DLL() {
    this.head = this.tail = null;
    this.length = 0;
  }

  function setInitial(dll, node) {
    dll.length = 1;
    dll.head = dll.tail = node;
  }

  DLL.prototype.removeLink = function (node) {
    if (node.prev) node.prev.next = node.next;else this.head = node.next;
    if (node.next) node.next.prev = node.prev;else this.tail = node.prev;
    node.prev = node.next = null;
    this.length -= 1;
    return node;
  };

  DLL.prototype.empty = function () {
    while (this.head) this.shift();

    return this;
  };

  DLL.prototype.insertAfter = function (node, newNode) {
    newNode.prev = node;
    newNode.next = node.next;
    if (node.next) node.next.prev = newNode;else this.tail = newNode;
    node.next = newNode;
    this.length += 1;
  };

  DLL.prototype.insertBefore = function (node, newNode) {
    newNode.prev = node.prev;
    newNode.next = node;
    if (node.prev) node.prev.next = newNode;else this.head = newNode;
    node.prev = newNode;
    this.length += 1;
  };

  DLL.prototype.unshift = function (node) {
    if (this.head) this.insertBefore(this.head, node);else setInitial(this, node);
  };

  DLL.prototype.push = function (node) {
    if (this.tail) this.insertAfter(this.tail, node);else setInitial(this, node);
  };

  DLL.prototype.shift = function () {
    return this.head && this.removeLink(this.head);
  };

  DLL.prototype.pop = function () {
    return this.tail && this.removeLink(this.tail);
  };

  DLL.prototype.toArray = function () {
    var arr = Array(this.length);
    var curr = this.head;

    for (var idx = 0; idx < this.length; idx++) {
      arr[idx] = curr.data;
      curr = curr.next;
    }

    return arr;
  };

  DLL.prototype.remove = function (testFn) {
    var curr = this.head;

    while (!!curr) {
      var next = curr.next;

      if (testFn(curr)) {
        this.removeLink(curr);
      }

      curr = next;
    }

    return this;
  };

  function queue(worker, concurrency, payload) {
    if (concurrency == null) {
      concurrency = 1;
    } else if (concurrency === 0) {
      throw new Error('Concurrency must not be zero');
    }

    var _worker = wrapAsync(worker);

    var numRunning = 0;
    var workersList = [];
    var processingScheduled = false;

    function _insert(data, insertAtFront, callback) {
      if (callback != null && typeof callback !== 'function') {
        throw new Error('task callback must be a function');
      }

      q.started = true;

      if (!isArray(data)) {
        data = [data];
      }

      if (data.length === 0 && q.idle()) {
        // call drain immediately if there are no tasks
        return setImmediate$1(function () {
          q.drain();
        });
      }

      for (var i = 0, l = data.length; i < l; i++) {
        var item = {
          data: data[i],
          callback: callback || noop
        };

        if (insertAtFront) {
          q._tasks.unshift(item);
        } else {
          q._tasks.push(item);
        }
      }

      if (!processingScheduled) {
        processingScheduled = true;
        setImmediate$1(function () {
          processingScheduled = false;
          q.process();
        });
      }
    }

    function _next(tasks) {
      return function (err) {
        numRunning -= 1;

        for (var i = 0, l = tasks.length; i < l; i++) {
          var task = tasks[i];
          var index = baseIndexOf(workersList, task, 0);

          if (index === 0) {
            workersList.shift();
          } else if (index > 0) {
            workersList.splice(index, 1);
          }

          task.callback.apply(task, arguments);

          if (err != null) {
            q.error(err, task.data);
          }
        }

        if (numRunning <= q.concurrency - q.buffer) {
          q.unsaturated();
        }

        if (q.idle()) {
          q.drain();
        }

        q.process();
      };
    }

    var isProcessing = false;
    var q = {
      _tasks: new DLL(),
      concurrency: concurrency,
      payload: payload,
      saturated: noop,
      unsaturated: noop,
      buffer: concurrency / 4,
      empty: noop,
      drain: noop,
      error: noop,
      started: false,
      paused: false,
      push: function (data, callback) {
        _insert(data, false, callback);
      },
      kill: function () {
        q.drain = noop;

        q._tasks.empty();
      },
      unshift: function (data, callback) {
        _insert(data, true, callback);
      },
      remove: function (testFn) {
        q._tasks.remove(testFn);
      },
      process: function () {
        // Avoid trying to start too many processing operations. This can occur
        // when callbacks resolve synchronously (#1267).
        if (isProcessing) {
          return;
        }

        isProcessing = true;

        while (!q.paused && numRunning < q.concurrency && q._tasks.length) {
          var tasks = [],
              data = [];
          var l = q._tasks.length;
          if (q.payload) l = Math.min(l, q.payload);

          for (var i = 0; i < l; i++) {
            var node = q._tasks.shift();

            tasks.push(node);
            workersList.push(node);
            data.push(node.data);
          }

          numRunning += 1;

          if (q._tasks.length === 0) {
            q.empty();
          }

          if (numRunning === q.concurrency) {
            q.saturated();
          }

          var cb = onlyOnce(_next(tasks));

          _worker(data, cb);
        }

        isProcessing = false;
      },
      length: function () {
        return q._tasks.length;
      },
      running: function () {
        return numRunning;
      },
      workersList: function () {
        return workersList;
      },
      idle: function () {
        return q._tasks.length + numRunning === 0;
      },
      pause: function () {
        q.paused = true;
      },
      resume: function () {
        if (q.paused === false) {
          return;
        }

        q.paused = false;
        setImmediate$1(q.process);
      }
    };
    return q;
  }
  /**
   * A cargo of tasks for the worker function to complete. Cargo inherits all of
   * the same methods and event callbacks as [`queue`]{@link module:ControlFlow.queue}.
   * @typedef {Object} CargoObject
   * @memberOf module:ControlFlow
   * @property {Function} length - A function returning the number of items
   * waiting to be processed. Invoke like `cargo.length()`.
   * @property {number} payload - An `integer` for determining how many tasks
   * should be process per round. This property can be changed after a `cargo` is
   * created to alter the payload on-the-fly.
   * @property {Function} push - Adds `task` to the `queue`. The callback is
   * called once the `worker` has finished processing the task. Instead of a
   * single task, an array of `tasks` can be submitted. The respective callback is
   * used for every task in the list. Invoke like `cargo.push(task, [callback])`.
   * @property {Function} saturated - A callback that is called when the
   * `queue.length()` hits the concurrency and further tasks will be queued.
   * @property {Function} empty - A callback that is called when the last item
   * from the `queue` is given to a `worker`.
   * @property {Function} drain - A callback that is called when the last item
   * from the `queue` has returned from the `worker`.
   * @property {Function} idle - a function returning false if there are items
   * waiting or being processed, or true if not. Invoke like `cargo.idle()`.
   * @property {Function} pause - a function that pauses the processing of tasks
   * until `resume()` is called. Invoke like `cargo.pause()`.
   * @property {Function} resume - a function that resumes the processing of
   * queued tasks when the queue is paused. Invoke like `cargo.resume()`.
   * @property {Function} kill - a function that removes the `drain` callback and
   * empties remaining tasks from the queue forcing it to go idle. Invoke like `cargo.kill()`.
   */

  /**
   * Creates a `cargo` object with the specified payload. Tasks added to the
   * cargo will be processed altogether (up to the `payload` limit). If the
   * `worker` is in progress, the task is queued until it becomes available. Once
   * the `worker` has completed some tasks, each callback of those tasks is
   * called. Check out [these](https://camo.githubusercontent.com/6bbd36f4cf5b35a0f11a96dcd2e97711ffc2fb37/68747470733a2f2f662e636c6f75642e6769746875622e636f6d2f6173736574732f313637363837312f36383130382f62626330636662302d356632392d313165322d393734662d3333393763363464633835382e676966) [animations](https://camo.githubusercontent.com/f4810e00e1c5f5f8addbe3e9f49064fd5d102699/68747470733a2f2f662e636c6f75642e6769746875622e636f6d2f6173736574732f313637363837312f36383130312f38346339323036362d356632392d313165322d383134662d3964336430323431336266642e676966)
   * for how `cargo` and `queue` work.
   *
   * While [`queue`]{@link module:ControlFlow.queue} passes only one task to one of a group of workers
   * at a time, cargo passes an array of tasks to a single worker, repeating
   * when the worker is finished.
   *
   * @name cargo
   * @static
   * @memberOf module:ControlFlow
   * @method
   * @see [async.queue]{@link module:ControlFlow.queue}
   * @category Control Flow
   * @param {AsyncFunction} worker - An asynchronous function for processing an array
   * of queued tasks. Invoked with `(tasks, callback)`.
   * @param {number} [payload=Infinity] - An optional `integer` for determining
   * how many tasks should be processed per round; if omitted, the default is
   * unlimited.
   * @returns {module:ControlFlow.CargoObject} A cargo object to manage the tasks. Callbacks can
   * attached as certain properties to listen for specific events during the
   * lifecycle of the cargo and inner queue.
   * @example
   *
   * // create a cargo object with payload 2
   * var cargo = async.cargo(function(tasks, callback) {
   *     for (var i=0; i<tasks.length; i++) {
   *         console.log('hello ' + tasks[i].name);
   *     }
   *     callback();
   * }, 2);
   *
   * // add some items
   * cargo.push({name: 'foo'}, function(err) {
   *     console.log('finished processing foo');
   * });
   * cargo.push({name: 'bar'}, function(err) {
   *     console.log('finished processing bar');
   * });
   * cargo.push({name: 'baz'}, function(err) {
   *     console.log('finished processing baz');
   * });
   */


  function cargo(worker, payload) {
    return queue(worker, 1, payload);
  }
  /**
   * The same as [`eachOf`]{@link module:Collections.eachOf} but runs only a single async operation at a time.
   *
   * @name eachOfSeries
   * @static
   * @memberOf module:Collections
   * @method
   * @see [async.eachOf]{@link module:Collections.eachOf}
   * @alias forEachOfSeries
   * @category Collection
   * @param {Array|Iterable|Object} coll - A collection to iterate over.
   * @param {AsyncFunction} iteratee - An async function to apply to each item in
   * `coll`.
   * Invoked with (item, key, callback).
   * @param {Function} [callback] - A callback which is called when all `iteratee`
   * functions have finished, or an error occurs. Invoked with (err).
   */


  var eachOfSeries = doLimit(eachOfLimit, 1);
  /**
   * Reduces `coll` into a single value using an async `iteratee` to return each
   * successive step. `memo` is the initial state of the reduction. This function
   * only operates in series.
   *
   * For performance reasons, it may make sense to split a call to this function
   * into a parallel map, and then use the normal `Array.prototype.reduce` on the
   * results. This function is for situations where each step in the reduction
   * needs to be async; if you can get the data before reducing it, then it's
   * probably a good idea to do so.
   *
   * @name reduce
   * @static
   * @memberOf module:Collections
   * @method
   * @alias inject
   * @alias foldl
   * @category Collection
   * @param {Array|Iterable|Object} coll - A collection to iterate over.
   * @param {*} memo - The initial state of the reduction.
   * @param {AsyncFunction} iteratee - A function applied to each item in the
   * array to produce the next step in the reduction.
   * The `iteratee` should complete with the next state of the reduction.
   * If the iteratee complete with an error, the reduction is stopped and the
   * main `callback` is immediately called with the error.
   * Invoked with (memo, item, callback).
   * @param {Function} [callback] - A callback which is called after all the
   * `iteratee` functions have finished. Result is the reduced value. Invoked with
   * (err, result).
   * @example
   *
   * async.reduce([1,2,3], 0, function(memo, item, callback) {
   *     // pointless async:
   *     process.nextTick(function() {
   *         callback(null, memo + item)
   *     });
   * }, function(err, result) {
   *     // result is now equal to the last value of memo, which is 6
   * });
   */

  function reduce(coll, memo, iteratee, callback) {
    callback = once(callback || noop);

    var _iteratee = wrapAsync(iteratee);

    eachOfSeries(coll, function (x, i, callback) {
      _iteratee(memo, x, function (err, v) {
        memo = v;
        callback(err);
      });
    }, function (err) {
      callback(err, memo);
    });
  }
  /**
   * Version of the compose function that is more natural to read. Each function
   * consumes the return value of the previous function. It is the equivalent of
   * [compose]{@link module:ControlFlow.compose} with the arguments reversed.
   *
   * Each function is executed with the `this` binding of the composed function.
   *
   * @name seq
   * @static
   * @memberOf module:ControlFlow
   * @method
   * @see [async.compose]{@link module:ControlFlow.compose}
   * @category Control Flow
   * @param {...AsyncFunction} functions - the asynchronous functions to compose
   * @returns {Function} a function that composes the `functions` in order
   * @example
   *
   * // Requires lodash (or underscore), express3 and dresende's orm2.
   * // Part of an app, that fetches cats of the logged user.
   * // This example uses `seq` function to avoid overnesting and error
   * // handling clutter.
   * app.get('/cats', function(request, response) {
   *     var User = request.models.User;
   *     async.seq(
   *         _.bind(User.get, User),  // 'User.get' has signature (id, callback(err, data))
   *         function(user, fn) {
   *             user.getCats(fn);      // 'getCats' has signature (callback(err, data))
   *         }
   *     )(req.session.user_id, function (err, cats) {
   *         if (err) {
   *             console.error(err);
   *             response.json({ status: 'error', message: err.message });
   *         } else {
   *             response.json({ status: 'ok', message: 'Cats found', data: cats });
   *         }
   *     });
   * });
   */


  function seq()
  /*...functions*/
  {
    var _functions = arrayMap(arguments, wrapAsync);

    return function ()
    /*...args*/
    {
      var args = slice(arguments);
      var that = this;
      var cb = args[args.length - 1];

      if (typeof cb == 'function') {
        args.pop();
      } else {
        cb = noop;
      }

      reduce(_functions, args, function (newargs, fn, cb) {
        fn.apply(that, newargs.concat(function (err
        /*, ...nextargs*/
        ) {
          var nextargs = slice(arguments, 1);
          cb(err, nextargs);
        }));
      }, function (err, results) {
        cb.apply(that, [err].concat(results));
      });
    };
  }
  /**
   * Creates a function which is a composition of the passed asynchronous
   * functions. Each function consumes the return value of the function that
   * follows. Composing functions `f()`, `g()`, and `h()` would produce the result
   * of `f(g(h()))`, only this version uses callbacks to obtain the return values.
   *
   * Each function is executed with the `this` binding of the composed function.
   *
   * @name compose
   * @static
   * @memberOf module:ControlFlow
   * @method
   * @category Control Flow
   * @param {...AsyncFunction} functions - the asynchronous functions to compose
   * @returns {Function} an asynchronous function that is the composed
   * asynchronous `functions`
   * @example
   *
   * function add1(n, callback) {
   *     setTimeout(function () {
   *         callback(null, n + 1);
   *     }, 10);
   * }
   *
   * function mul3(n, callback) {
   *     setTimeout(function () {
   *         callback(null, n * 3);
   *     }, 10);
   * }
   *
   * var add1mul3 = async.compose(mul3, add1);
   * add1mul3(4, function (err, result) {
   *     // result now equals 15
   * });
   */


  var compose = function ()
  /*...args*/
  {
    return seq.apply(null, slice(arguments).reverse());
  };

  var _concat = Array.prototype.concat;
  /**
   * The same as [`concat`]{@link module:Collections.concat} but runs a maximum of `limit` async operations at a time.
   *
   * @name concatLimit
   * @static
   * @memberOf module:Collections
   * @method
   * @see [async.concat]{@link module:Collections.concat}
   * @category Collection
   * @param {Array|Iterable|Object} coll - A collection to iterate over.
   * @param {number} limit - The maximum number of async operations at a time.
   * @param {AsyncFunction} iteratee - A function to apply to each item in `coll`,
   * which should use an array as its result. Invoked with (item, callback).
   * @param {Function} [callback] - A callback which is called after all the
   * `iteratee` functions have finished, or an error occurs. Results is an array
   * containing the concatenated results of the `iteratee` function. Invoked with
   * (err, results).
   */

  var concatLimit = function (coll, limit, iteratee, callback) {
    callback = callback || noop;

    var _iteratee = wrapAsync(iteratee);

    mapLimit(coll, limit, function (val, callback) {
      _iteratee(val, function (err
      /*, ...args*/
      ) {
        if (err) return callback(err);
        return callback(null, slice(arguments, 1));
      });
    }, function (err, mapResults) {
      var result = [];

      for (var i = 0; i < mapResults.length; i++) {
        if (mapResults[i]) {
          result = _concat.apply(result, mapResults[i]);
        }
      }

      return callback(err, result);
    });
  };
  /**
   * Applies `iteratee` to each item in `coll`, concatenating the results. Returns
   * the concatenated list. The `iteratee`s are called in parallel, and the
   * results are concatenated as they return. There is no guarantee that the
   * results array will be returned in the original order of `coll` passed to the
   * `iteratee` function.
   *
   * @name concat
   * @static
   * @memberOf module:Collections
   * @method
   * @category Collection
   * @param {Array|Iterable|Object} coll - A collection to iterate over.
   * @param {AsyncFunction} iteratee - A function to apply to each item in `coll`,
   * which should use an array as its result. Invoked with (item, callback).
   * @param {Function} [callback(err)] - A callback which is called after all the
   * `iteratee` functions have finished, or an error occurs. Results is an array
   * containing the concatenated results of the `iteratee` function. Invoked with
   * (err, results).
   * @example
   *
   * async.concat(['dir1','dir2','dir3'], fs.readdir, function(err, files) {
   *     // files is now a list of filenames that exist in the 3 directories
   * });
   */


  var concat = doLimit(concatLimit, Infinity);
  /**
   * The same as [`concat`]{@link module:Collections.concat} but runs only a single async operation at a time.
   *
   * @name concatSeries
   * @static
   * @memberOf module:Collections
   * @method
   * @see [async.concat]{@link module:Collections.concat}
   * @category Collection
   * @param {Array|Iterable|Object} coll - A collection to iterate over.
   * @param {AsyncFunction} iteratee - A function to apply to each item in `coll`.
   * The iteratee should complete with an array an array of results.
   * Invoked with (item, callback).
   * @param {Function} [callback(err)] - A callback which is called after all the
   * `iteratee` functions have finished, or an error occurs. Results is an array
   * containing the concatenated results of the `iteratee` function. Invoked with
   * (err, results).
   */

  var concatSeries = doLimit(concatLimit, 1);
  /**
   * Returns a function that when called, calls-back with the values provided.
   * Useful as the first function in a [`waterfall`]{@link module:ControlFlow.waterfall}, or for plugging values in to
   * [`auto`]{@link module:ControlFlow.auto}.
   *
   * @name constant
   * @static
   * @memberOf module:Utils
   * @method
   * @category Util
   * @param {...*} arguments... - Any number of arguments to automatically invoke
   * callback with.
   * @returns {AsyncFunction} Returns a function that when invoked, automatically
   * invokes the callback with the previous given arguments.
   * @example
   *
   * async.waterfall([
   *     async.constant(42),
   *     function (value, next) {
   *         // value === 42
   *     },
   *     //...
   * ], callback);
   *
   * async.waterfall([
   *     async.constant(filename, "utf8"),
   *     fs.readFile,
   *     function (fileData, next) {
   *         //...
   *     }
   *     //...
   * ], callback);
   *
   * async.auto({
   *     hostname: async.constant("https://server.net/"),
   *     port: findFreePort,
   *     launchServer: ["hostname", "port", function (options, cb) {
   *         startServer(options, cb);
   *     }],
   *     //...
   * }, callback);
   */

  var constant = function ()
  /*...values*/
  {
    var values = slice(arguments);
    var args = [null].concat(values);
    return function ()
    /*...ignoredArgs, callback*/
    {
      var callback = arguments[arguments.length - 1];
      return callback.apply(this, args);
    };
  };
  /**
   * This method returns the first argument it receives.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Util
   * @param {*} value Any value.
   * @returns {*} Returns `value`.
   * @example
   *
   * var object = { 'a': 1 };
   *
   * console.log(_.identity(object) === object);
   * // => true
   */


  function identity(value) {
    return value;
  }

  function _createTester(check, getResult) {
    return function (eachfn, arr, iteratee, cb) {
      cb = cb || noop;
      var testPassed = false;
      var testResult;
      eachfn(arr, function (value, _, callback) {
        iteratee(value, function (err, result) {
          if (err) {
            callback(err);
          } else if (check(result) && !testResult) {
            testPassed = true;
            testResult = getResult(true, value);
            callback(null, breakLoop);
          } else {
            callback();
          }
        });
      }, function (err) {
        if (err) {
          cb(err);
        } else {
          cb(null, testPassed ? testResult : getResult(false));
        }
      });
    };
  }

  function _findGetResult(v, x) {
    return x;
  }
  /**
   * Returns the first value in `coll` that passes an async truth test. The
   * `iteratee` is applied in parallel, meaning the first iteratee to return
   * `true` will fire the detect `callback` with that result. That means the
   * result might not be the first item in the original `coll` (in terms of order)
   * that passes the test.
  
   * If order within the original `coll` is important, then look at
   * [`detectSeries`]{@link module:Collections.detectSeries}.
   *
   * @name detect
   * @static
   * @memberOf module:Collections
   * @method
   * @alias find
   * @category Collections
   * @param {Array|Iterable|Object} coll - A collection to iterate over.
   * @param {AsyncFunction} iteratee - A truth test to apply to each item in `coll`.
   * The iteratee must complete with a boolean value as its result.
   * Invoked with (item, callback).
   * @param {Function} [callback] - A callback which is called as soon as any
   * iteratee returns `true`, or after all the `iteratee` functions have finished.
   * Result will be the first item in the array that passes the truth test
   * (iteratee) or the value `undefined` if none passed. Invoked with
   * (err, result).
   * @example
   *
   * async.detect(['file1','file2','file3'], function(filePath, callback) {
   *     fs.access(filePath, function(err) {
   *         callback(null, !err)
   *     });
   * }, function(err, result) {
   *     // result now equals the first file in the list that exists
   * });
   */


  var detect = doParallel(_createTester(identity, _findGetResult));
  /**
   * The same as [`detect`]{@link module:Collections.detect} but runs a maximum of `limit` async operations at a
   * time.
   *
   * @name detectLimit
   * @static
   * @memberOf module:Collections
   * @method
   * @see [async.detect]{@link module:Collections.detect}
   * @alias findLimit
   * @category Collections
   * @param {Array|Iterable|Object} coll - A collection to iterate over.
   * @param {number} limit - The maximum number of async operations at a time.
   * @param {AsyncFunction} iteratee - A truth test to apply to each item in `coll`.
   * The iteratee must complete with a boolean value as its result.
   * Invoked with (item, callback).
   * @param {Function} [callback] - A callback which is called as soon as any
   * iteratee returns `true`, or after all the `iteratee` functions have finished.
   * Result will be the first item in the array that passes the truth test
   * (iteratee) or the value `undefined` if none passed. Invoked with
   * (err, result).
   */

  var detectLimit = doParallelLimit(_createTester(identity, _findGetResult));
  /**
   * The same as [`detect`]{@link module:Collections.detect} but runs only a single async operation at a time.
   *
   * @name detectSeries
   * @static
   * @memberOf module:Collections
   * @method
   * @see [async.detect]{@link module:Collections.detect}
   * @alias findSeries
   * @category Collections
   * @param {Array|Iterable|Object} coll - A collection to iterate over.
   * @param {AsyncFunction} iteratee - A truth test to apply to each item in `coll`.
   * The iteratee must complete with a boolean value as its result.
   * Invoked with (item, callback).
   * @param {Function} [callback] - A callback which is called as soon as any
   * iteratee returns `true`, or after all the `iteratee` functions have finished.
   * Result will be the first item in the array that passes the truth test
   * (iteratee) or the value `undefined` if none passed. Invoked with
   * (err, result).
   */

  var detectSeries = doLimit(detectLimit, 1);

  function consoleFunc(name) {
    return function (fn
    /*, ...args*/
    ) {
      var args = slice(arguments, 1);
      args.push(function (err
      /*, ...args*/
      ) {
        var args = slice(arguments, 1);

        if (typeof console === 'object') {
          if (err) {
            if (console.error) {
              console.error(err);
            }
          } else if (console[name]) {
            arrayEach(args, function (x) {
              console[name](x);
            });
          }
        }
      });
      wrapAsync(fn).apply(null, args);
    };
  }
  /**
   * Logs the result of an [`async` function]{@link AsyncFunction} to the
   * `console` using `console.dir` to display the properties of the resulting object.
   * Only works in Node.js or in browsers that support `console.dir` and
   * `console.error` (such as FF and Chrome).
   * If multiple arguments are returned from the async function,
   * `console.dir` is called on each argument in order.
   *
   * @name dir
   * @static
   * @memberOf module:Utils
   * @method
   * @category Util
   * @param {AsyncFunction} function - The function you want to eventually apply
   * all arguments to.
   * @param {...*} arguments... - Any number of arguments to apply to the function.
   * @example
   *
   * // in a module
   * var hello = function(name, callback) {
   *     setTimeout(function() {
   *         callback(null, {hello: name});
   *     }, 1000);
   * };
   *
   * // in the node repl
   * node> async.dir(hello, 'world');
   * {hello: 'world'}
   */


  var dir = consoleFunc('dir');
  /**
   * The post-check version of [`during`]{@link module:ControlFlow.during}. To reflect the difference in
   * the order of operations, the arguments `test` and `fn` are switched.
   *
   * Also a version of [`doWhilst`]{@link module:ControlFlow.doWhilst} with asynchronous `test` function.
   * @name doDuring
   * @static
   * @memberOf module:ControlFlow
   * @method
   * @see [async.during]{@link module:ControlFlow.during}
   * @category Control Flow
   * @param {AsyncFunction} fn - An async function which is called each time
   * `test` passes. Invoked with (callback).
   * @param {AsyncFunction} test - asynchronous truth test to perform before each
   * execution of `fn`. Invoked with (...args, callback), where `...args` are the
   * non-error args from the previous callback of `fn`.
   * @param {Function} [callback] - A callback which is called after the test
   * function has failed and repeated execution of `fn` has stopped. `callback`
   * will be passed an error if one occurred, otherwise `null`.
   */

  function doDuring(fn, test, callback) {
    callback = onlyOnce(callback || noop);

    var _fn = wrapAsync(fn);

    var _test = wrapAsync(test);

    function next(err
    /*, ...args*/
    ) {
      if (err) return callback(err);
      var args = slice(arguments, 1);
      args.push(check);

      _test.apply(this, args);
    }

    function check(err, truth) {
      if (err) return callback(err);
      if (!truth) return callback(null);

      _fn(next);
    }

    check(null, true);
  }
  /**
   * The post-check version of [`whilst`]{@link module:ControlFlow.whilst}. To reflect the difference in
   * the order of operations, the arguments `test` and `iteratee` are switched.
   *
   * `doWhilst` is to `whilst` as `do while` is to `while` in plain JavaScript.
   *
   * @name doWhilst
   * @static
   * @memberOf module:ControlFlow
   * @method
   * @see [async.whilst]{@link module:ControlFlow.whilst}
   * @category Control Flow
   * @param {AsyncFunction} iteratee - A function which is called each time `test`
   * passes. Invoked with (callback).
   * @param {Function} test - synchronous truth test to perform after each
   * execution of `iteratee`. Invoked with any non-error callback results of
   * `iteratee`.
   * @param {Function} [callback] - A callback which is called after the test
   * function has failed and repeated execution of `iteratee` has stopped.
   * `callback` will be passed an error and any arguments passed to the final
   * `iteratee`'s callback. Invoked with (err, [results]);
   */


  function doWhilst(iteratee, test, callback) {
    callback = onlyOnce(callback || noop);

    var _iteratee = wrapAsync(iteratee);

    var next = function (err
    /*, ...args*/
    ) {
      if (err) return callback(err);
      var args = slice(arguments, 1);
      if (test.apply(this, args)) return _iteratee(next);
      callback.apply(null, [null].concat(args));
    };

    _iteratee(next);
  }
  /**
   * Like ['doWhilst']{@link module:ControlFlow.doWhilst}, except the `test` is inverted. Note the
   * argument ordering differs from `until`.
   *
   * @name doUntil
   * @static
   * @memberOf module:ControlFlow
   * @method
   * @see [async.doWhilst]{@link module:ControlFlow.doWhilst}
   * @category Control Flow
   * @param {AsyncFunction} iteratee - An async function which is called each time
   * `test` fails. Invoked with (callback).
   * @param {Function} test - synchronous truth test to perform after each
   * execution of `iteratee`. Invoked with any non-error callback results of
   * `iteratee`.
   * @param {Function} [callback] - A callback which is called after the test
   * function has passed and repeated execution of `iteratee` has stopped. `callback`
   * will be passed an error and any arguments passed to the final `iteratee`'s
   * callback. Invoked with (err, [results]);
   */


  function doUntil(iteratee, test, callback) {
    doWhilst(iteratee, function () {
      return !test.apply(this, arguments);
    }, callback);
  }
  /**
   * Like [`whilst`]{@link module:ControlFlow.whilst}, except the `test` is an asynchronous function that
   * is passed a callback in the form of `function (err, truth)`. If error is
   * passed to `test` or `fn`, the main callback is immediately called with the
   * value of the error.
   *
   * @name during
   * @static
   * @memberOf module:ControlFlow
   * @method
   * @see [async.whilst]{@link module:ControlFlow.whilst}
   * @category Control Flow
   * @param {AsyncFunction} test - asynchronous truth test to perform before each
   * execution of `fn`. Invoked with (callback).
   * @param {AsyncFunction} fn - An async function which is called each time
   * `test` passes. Invoked with (callback).
   * @param {Function} [callback] - A callback which is called after the test
   * function has failed and repeated execution of `fn` has stopped. `callback`
   * will be passed an error, if one occurred, otherwise `null`.
   * @example
   *
   * var count = 0;
   *
   * async.during(
   *     function (callback) {
   *         return callback(null, count < 5);
   *     },
   *     function (callback) {
   *         count++;
   *         setTimeout(callback, 1000);
   *     },
   *     function (err) {
   *         // 5 seconds have passed
   *     }
   * );
   */


  function during(test, fn, callback) {
    callback = onlyOnce(callback || noop);

    var _fn = wrapAsync(fn);

    var _test = wrapAsync(test);

    function next(err) {
      if (err) return callback(err);

      _test(check);
    }

    function check(err, truth) {
      if (err) return callback(err);
      if (!truth) return callback(null);

      _fn(next);
    }

    _test(check);
  }

  function _withoutIndex(iteratee) {
    return function (value, index, callback) {
      return iteratee(value, callback);
    };
  }
  /**
   * Applies the function `iteratee` to each item in `coll`, in parallel.
   * The `iteratee` is called with an item from the list, and a callback for when
   * it has finished. If the `iteratee` passes an error to its `callback`, the
   * main `callback` (for the `each` function) is immediately called with the
   * error.
   *
   * Note, that since this function applies `iteratee` to each item in parallel,
   * there is no guarantee that the iteratee functions will complete in order.
   *
   * @name each
   * @static
   * @memberOf module:Collections
   * @method
   * @alias forEach
   * @category Collection
   * @param {Array|Iterable|Object} coll - A collection to iterate over.
   * @param {AsyncFunction} iteratee - An async function to apply to
   * each item in `coll`. Invoked with (item, callback).
   * The array index is not passed to the iteratee.
   * If you need the index, use `eachOf`.
   * @param {Function} [callback] - A callback which is called when all
   * `iteratee` functions have finished, or an error occurs. Invoked with (err).
   * @example
   *
   * // assuming openFiles is an array of file names and saveFile is a function
   * // to save the modified contents of that file:
   *
   * async.each(openFiles, saveFile, function(err){
   *   // if any of the saves produced an error, err would equal that error
   * });
   *
   * // assuming openFiles is an array of file names
   * async.each(openFiles, function(file, callback) {
   *
   *     // Perform operation on file here.
   *     console.log('Processing file ' + file);
   *
   *     if( file.length > 32 ) {
   *       console.log('This file name is too long');
   *       callback('File name too long');
   *     } else {
   *       // Do work to process file here
   *       console.log('File processed');
   *       callback();
   *     }
   * }, function(err) {
   *     // if any of the file processing produced an error, err would equal that error
   *     if( err ) {
   *       // One of the iterations produced an error.
   *       // All processing will now stop.
   *       console.log('A file failed to process');
   *     } else {
   *       console.log('All files have been processed successfully');
   *     }
   * });
   */


  function eachLimit(coll, iteratee, callback) {
    eachOf(coll, _withoutIndex(wrapAsync(iteratee)), callback);
  }
  /**
   * The same as [`each`]{@link module:Collections.each} but runs a maximum of `limit` async operations at a time.
   *
   * @name eachLimit
   * @static
   * @memberOf module:Collections
   * @method
   * @see [async.each]{@link module:Collections.each}
   * @alias forEachLimit
   * @category Collection
   * @param {Array|Iterable|Object} coll - A collection to iterate over.
   * @param {number} limit - The maximum number of async operations at a time.
   * @param {AsyncFunction} iteratee - An async function to apply to each item in
   * `coll`.
   * The array index is not passed to the iteratee.
   * If you need the index, use `eachOfLimit`.
   * Invoked with (item, callback).
   * @param {Function} [callback] - A callback which is called when all
   * `iteratee` functions have finished, or an error occurs. Invoked with (err).
   */


  function eachLimit$1(coll, limit, iteratee, callback) {
    _eachOfLimit(limit)(coll, _withoutIndex(wrapAsync(iteratee)), callback);
  }
  /**
   * The same as [`each`]{@link module:Collections.each} but runs only a single async operation at a time.
   *
   * @name eachSeries
   * @static
   * @memberOf module:Collections
   * @method
   * @see [async.each]{@link module:Collections.each}
   * @alias forEachSeries
   * @category Collection
   * @param {Array|Iterable|Object} coll - A collection to iterate over.
   * @param {AsyncFunction} iteratee - An async function to apply to each
   * item in `coll`.
   * The array index is not passed to the iteratee.
   * If you need the index, use `eachOfSeries`.
   * Invoked with (item, callback).
   * @param {Function} [callback] - A callback which is called when all
   * `iteratee` functions have finished, or an error occurs. Invoked with (err).
   */


  var eachSeries = doLimit(eachLimit$1, 1);
  /**
   * Wrap an async function and ensure it calls its callback on a later tick of
   * the event loop.  If the function already calls its callback on a next tick,
   * no extra deferral is added. This is useful for preventing stack overflows
   * (`RangeError: Maximum call stack size exceeded`) and generally keeping
   * [Zalgo](http://blog.izs.me/post/59142742143/designing-apis-for-asynchrony)
   * contained. ES2017 `async` functions are returned as-is -- they are immune
   * to Zalgo's corrupting influences, as they always resolve on a later tick.
   *
   * @name ensureAsync
   * @static
   * @memberOf module:Utils
   * @method
   * @category Util
   * @param {AsyncFunction} fn - an async function, one that expects a node-style
   * callback as its last argument.
   * @returns {AsyncFunction} Returns a wrapped function with the exact same call
   * signature as the function passed in.
   * @example
   *
   * function sometimesAsync(arg, callback) {
   *     if (cache[arg]) {
   *         return callback(null, cache[arg]); // this would be synchronous!!
   *     } else {
   *         doSomeIO(arg, callback); // this IO would be asynchronous
   *     }
   * }
   *
   * // this has a risk of stack overflows if many results are cached in a row
   * async.mapSeries(args, sometimesAsync, done);
   *
   * // this will defer sometimesAsync's callback if necessary,
   * // preventing stack overflows
   * async.mapSeries(args, async.ensureAsync(sometimesAsync), done);
   */

  function ensureAsync(fn) {
    if (isAsync(fn)) return fn;
    return initialParams(function (args, callback) {
      var sync = true;
      args.push(function () {
        var innerArgs = arguments;

        if (sync) {
          setImmediate$1(function () {
            callback.apply(null, innerArgs);
          });
        } else {
          callback.apply(null, innerArgs);
        }
      });
      fn.apply(this, args);
      sync = false;
    });
  }

  function notId(v) {
    return !v;
  }
  /**
   * Returns `true` if every element in `coll` satisfies an async test. If any
   * iteratee call returns `false`, the main `callback` is immediately called.
   *
   * @name every
   * @static
   * @memberOf module:Collections
   * @method
   * @alias all
   * @category Collection
   * @param {Array|Iterable|Object} coll - A collection to iterate over.
   * @param {AsyncFunction} iteratee - An async truth test to apply to each item
   * in the collection in parallel.
   * The iteratee must complete with a boolean result value.
   * Invoked with (item, callback).
   * @param {Function} [callback] - A callback which is called after all the
   * `iteratee` functions have finished. Result will be either `true` or `false`
   * depending on the values of the async tests. Invoked with (err, result).
   * @example
   *
   * async.every(['file1','file2','file3'], function(filePath, callback) {
   *     fs.access(filePath, function(err) {
   *         callback(null, !err)
   *     });
   * }, function(err, result) {
   *     // if result is true then every file exists
   * });
   */


  var every = doParallel(_createTester(notId, notId));
  /**
   * The same as [`every`]{@link module:Collections.every} but runs a maximum of `limit` async operations at a time.
   *
   * @name everyLimit
   * @static
   * @memberOf module:Collections
   * @method
   * @see [async.every]{@link module:Collections.every}
   * @alias allLimit
   * @category Collection
   * @param {Array|Iterable|Object} coll - A collection to iterate over.
   * @param {number} limit - The maximum number of async operations at a time.
   * @param {AsyncFunction} iteratee - An async truth test to apply to each item
   * in the collection in parallel.
   * The iteratee must complete with a boolean result value.
   * Invoked with (item, callback).
   * @param {Function} [callback] - A callback which is called after all the
   * `iteratee` functions have finished. Result will be either `true` or `false`
   * depending on the values of the async tests. Invoked with (err, result).
   */

  var everyLimit = doParallelLimit(_createTester(notId, notId));
  /**
   * The same as [`every`]{@link module:Collections.every} but runs only a single async operation at a time.
   *
   * @name everySeries
   * @static
   * @memberOf module:Collections
   * @method
   * @see [async.every]{@link module:Collections.every}
   * @alias allSeries
   * @category Collection
   * @param {Array|Iterable|Object} coll - A collection to iterate over.
   * @param {AsyncFunction} iteratee - An async truth test to apply to each item
   * in the collection in series.
   * The iteratee must complete with a boolean result value.
   * Invoked with (item, callback).
   * @param {Function} [callback] - A callback which is called after all the
   * `iteratee` functions have finished. Result will be either `true` or `false`
   * depending on the values of the async tests. Invoked with (err, result).
   */

  var everySeries = doLimit(everyLimit, 1);
  /**
   * The base implementation of `_.property` without support for deep paths.
   *
   * @private
   * @param {string} key The key of the property to get.
   * @returns {Function} Returns the new accessor function.
   */

  function baseProperty(key) {
    return function (object) {
      return object == null ? undefined : object[key];
    };
  }

  function filterArray(eachfn, arr, iteratee, callback) {
    var truthValues = new Array(arr.length);
    eachfn(arr, function (x, index, callback) {
      iteratee(x, function (err, v) {
        truthValues[index] = !!v;
        callback(err);
      });
    }, function (err) {
      if (err) return callback(err);
      var results = [];

      for (var i = 0; i < arr.length; i++) {
        if (truthValues[i]) results.push(arr[i]);
      }

      callback(null, results);
    });
  }

  function filterGeneric(eachfn, coll, iteratee, callback) {
    var results = [];
    eachfn(coll, function (x, index, callback) {
      iteratee(x, function (err, v) {
        if (err) {
          callback(err);
        } else {
          if (v) {
            results.push({
              index: index,
              value: x
            });
          }

          callback();
        }
      });
    }, function (err) {
      if (err) {
        callback(err);
      } else {
        callback(null, arrayMap(results.sort(function (a, b) {
          return a.index - b.index;
        }), baseProperty('value')));
      }
    });
  }

  function _filter(eachfn, coll, iteratee, callback) {
    var filter = isArrayLike(coll) ? filterArray : filterGeneric;
    filter(eachfn, coll, wrapAsync(iteratee), callback || noop);
  }
  /**
   * Returns a new array of all the values in `coll` which pass an async truth
   * test. This operation is performed in parallel, but the results array will be
   * in the same order as the original.
   *
   * @name filter
   * @static
   * @memberOf module:Collections
   * @method
   * @alias select
   * @category Collection
   * @param {Array|Iterable|Object} coll - A collection to iterate over.
   * @param {Function} iteratee - A truth test to apply to each item in `coll`.
   * The `iteratee` is passed a `callback(err, truthValue)`, which must be called
   * with a boolean argument once it has completed. Invoked with (item, callback).
   * @param {Function} [callback] - A callback which is called after all the
   * `iteratee` functions have finished. Invoked with (err, results).
   * @example
   *
   * async.filter(['file1','file2','file3'], function(filePath, callback) {
   *     fs.access(filePath, function(err) {
   *         callback(null, !err)
   *     });
   * }, function(err, results) {
   *     // results now equals an array of the existing files
   * });
   */


  var filter = doParallel(_filter);
  /**
   * The same as [`filter`]{@link module:Collections.filter} but runs a maximum of `limit` async operations at a
   * time.
   *
   * @name filterLimit
   * @static
   * @memberOf module:Collections
   * @method
   * @see [async.filter]{@link module:Collections.filter}
   * @alias selectLimit
   * @category Collection
   * @param {Array|Iterable|Object} coll - A collection to iterate over.
   * @param {number} limit - The maximum number of async operations at a time.
   * @param {Function} iteratee - A truth test to apply to each item in `coll`.
   * The `iteratee` is passed a `callback(err, truthValue)`, which must be called
   * with a boolean argument once it has completed. Invoked with (item, callback).
   * @param {Function} [callback] - A callback which is called after all the
   * `iteratee` functions have finished. Invoked with (err, results).
   */

  var filterLimit = doParallelLimit(_filter);
  /**
   * The same as [`filter`]{@link module:Collections.filter} but runs only a single async operation at a time.
   *
   * @name filterSeries
   * @static
   * @memberOf module:Collections
   * @method
   * @see [async.filter]{@link module:Collections.filter}
   * @alias selectSeries
   * @category Collection
   * @param {Array|Iterable|Object} coll - A collection to iterate over.
   * @param {Function} iteratee - A truth test to apply to each item in `coll`.
   * The `iteratee` is passed a `callback(err, truthValue)`, which must be called
   * with a boolean argument once it has completed. Invoked with (item, callback).
   * @param {Function} [callback] - A callback which is called after all the
   * `iteratee` functions have finished. Invoked with (err, results)
   */

  var filterSeries = doLimit(filterLimit, 1);
  /**
   * Calls the asynchronous function `fn` with a callback parameter that allows it
   * to call itself again, in series, indefinitely.
  
   * If an error is passed to the callback then `errback` is called with the
   * error, and execution stops, otherwise it will never be called.
   *
   * @name forever
   * @static
   * @memberOf module:ControlFlow
   * @method
   * @category Control Flow
   * @param {AsyncFunction} fn - an async function to call repeatedly.
   * Invoked with (next).
   * @param {Function} [errback] - when `fn` passes an error to it's callback,
   * this function will be called, and execution stops. Invoked with (err).
   * @example
   *
   * async.forever(
   *     function(next) {
   *         // next is suitable for passing to things that need a callback(err [, whatever]);
   *         // it will result in this function being called again.
   *     },
   *     function(err) {
   *         // if next is called with a value in its first parameter, it will appear
   *         // in here as 'err', and execution will stop.
   *     }
   * );
   */

  function forever(fn, errback) {
    var done = onlyOnce(errback || noop);
    var task = wrapAsync(ensureAsync(fn));

    function next(err) {
      if (err) return done(err);
      task(next);
    }

    next();
  }
  /**
   * The same as [`groupBy`]{@link module:Collections.groupBy} but runs a maximum of `limit` async operations at a time.
   *
   * @name groupByLimit
   * @static
   * @memberOf module:Collections
   * @method
   * @see [async.groupBy]{@link module:Collections.groupBy}
   * @category Collection
   * @param {Array|Iterable|Object} coll - A collection to iterate over.
   * @param {number} limit - The maximum number of async operations at a time.
   * @param {AsyncFunction} iteratee - An async function to apply to each item in
   * `coll`.
   * The iteratee should complete with a `key` to group the value under.
   * Invoked with (value, callback).
   * @param {Function} [callback] - A callback which is called when all `iteratee`
   * functions have finished, or an error occurs. Result is an `Object` whoses
   * properties are arrays of values which returned the corresponding key.
   */


  var groupByLimit = function (coll, limit, iteratee, callback) {
    callback = callback || noop;

    var _iteratee = wrapAsync(iteratee);

    mapLimit(coll, limit, function (val, callback) {
      _iteratee(val, function (err, key) {
        if (err) return callback(err);
        return callback(null, {
          key: key,
          val: val
        });
      });
    }, function (err, mapResults) {
      var result = {}; // from MDN, handle object having an `hasOwnProperty` prop

      var hasOwnProperty = Object.prototype.hasOwnProperty;

      for (var i = 0; i < mapResults.length; i++) {
        if (mapResults[i]) {
          var key = mapResults[i].key;
          var val = mapResults[i].val;

          if (hasOwnProperty.call(result, key)) {
            result[key].push(val);
          } else {
            result[key] = [val];
          }
        }
      }

      return callback(err, result);
    });
  };
  /**
   * Returns a new object, where each value corresponds to an array of items, from
   * `coll`, that returned the corresponding key. That is, the keys of the object
   * correspond to the values passed to the `iteratee` callback.
   *
   * Note: Since this function applies the `iteratee` to each item in parallel,
   * there is no guarantee that the `iteratee` functions will complete in order.
   * However, the values for each key in the `result` will be in the same order as
   * the original `coll`. For Objects, the values will roughly be in the order of
   * the original Objects' keys (but this can vary across JavaScript engines).
   *
   * @name groupBy
   * @static
   * @memberOf module:Collections
   * @method
   * @category Collection
   * @param {Array|Iterable|Object} coll - A collection to iterate over.
   * @param {AsyncFunction} iteratee - An async function to apply to each item in
   * `coll`.
   * The iteratee should complete with a `key` to group the value under.
   * Invoked with (value, callback).
   * @param {Function} [callback] - A callback which is called when all `iteratee`
   * functions have finished, or an error occurs. Result is an `Object` whoses
   * properties are arrays of values which returned the corresponding key.
   * @example
   *
   * async.groupBy(['userId1', 'userId2', 'userId3'], function(userId, callback) {
   *     db.findById(userId, function(err, user) {
   *         if (err) return callback(err);
   *         return callback(null, user.age);
   *     });
   * }, function(err, result) {
   *     // result is object containing the userIds grouped by age
   *     // e.g. { 30: ['userId1', 'userId3'], 42: ['userId2']};
   * });
   */


  var groupBy = doLimit(groupByLimit, Infinity);
  /**
   * The same as [`groupBy`]{@link module:Collections.groupBy} but runs only a single async operation at a time.
   *
   * @name groupBySeries
   * @static
   * @memberOf module:Collections
   * @method
   * @see [async.groupBy]{@link module:Collections.groupBy}
   * @category Collection
   * @param {Array|Iterable|Object} coll - A collection to iterate over.
   * @param {number} limit - The maximum number of async operations at a time.
   * @param {AsyncFunction} iteratee - An async function to apply to each item in
   * `coll`.
   * The iteratee should complete with a `key` to group the value under.
   * Invoked with (value, callback).
   * @param {Function} [callback] - A callback which is called when all `iteratee`
   * functions have finished, or an error occurs. Result is an `Object` whoses
   * properties are arrays of values which returned the corresponding key.
   */

  var groupBySeries = doLimit(groupByLimit, 1);
  /**
   * Logs the result of an `async` function to the `console`. Only works in
   * Node.js or in browsers that support `console.log` and `console.error` (such
   * as FF and Chrome). If multiple arguments are returned from the async
   * function, `console.log` is called on each argument in order.
   *
   * @name log
   * @static
   * @memberOf module:Utils
   * @method
   * @category Util
   * @param {AsyncFunction} function - The function you want to eventually apply
   * all arguments to.
   * @param {...*} arguments... - Any number of arguments to apply to the function.
   * @example
   *
   * // in a module
   * var hello = function(name, callback) {
   *     setTimeout(function() {
   *         callback(null, 'hello ' + name);
   *     }, 1000);
   * };
   *
   * // in the node repl
   * node> async.log(hello, 'world');
   * 'hello world'
   */

  var log = consoleFunc('log');
  /**
   * The same as [`mapValues`]{@link module:Collections.mapValues} but runs a maximum of `limit` async operations at a
   * time.
   *
   * @name mapValuesLimit
   * @static
   * @memberOf module:Collections
   * @method
   * @see [async.mapValues]{@link module:Collections.mapValues}
   * @category Collection
   * @param {Object} obj - A collection to iterate over.
   * @param {number} limit - The maximum number of async operations at a time.
   * @param {AsyncFunction} iteratee - A function to apply to each value and key
   * in `coll`.
   * The iteratee should complete with the transformed value as its result.
   * Invoked with (value, key, callback).
   * @param {Function} [callback] - A callback which is called when all `iteratee`
   * functions have finished, or an error occurs. `result` is a new object consisting
   * of each key from `obj`, with each transformed value on the right-hand side.
   * Invoked with (err, result).
   */

  function mapValuesLimit(obj, limit, iteratee, callback) {
    callback = once(callback || noop);
    var newObj = {};

    var _iteratee = wrapAsync(iteratee);

    eachOfLimit(obj, limit, function (val, key, next) {
      _iteratee(val, key, function (err, result) {
        if (err) return next(err);
        newObj[key] = result;
        next();
      });
    }, function (err) {
      callback(err, newObj);
    });
  }
  /**
   * A relative of [`map`]{@link module:Collections.map}, designed for use with objects.
   *
   * Produces a new Object by mapping each value of `obj` through the `iteratee`
   * function. The `iteratee` is called each `value` and `key` from `obj` and a
   * callback for when it has finished processing. Each of these callbacks takes
   * two arguments: an `error`, and the transformed item from `obj`. If `iteratee`
   * passes an error to its callback, the main `callback` (for the `mapValues`
   * function) is immediately called with the error.
   *
   * Note, the order of the keys in the result is not guaranteed.  The keys will
   * be roughly in the order they complete, (but this is very engine-specific)
   *
   * @name mapValues
   * @static
   * @memberOf module:Collections
   * @method
   * @category Collection
   * @param {Object} obj - A collection to iterate over.
   * @param {AsyncFunction} iteratee - A function to apply to each value and key
   * in `coll`.
   * The iteratee should complete with the transformed value as its result.
   * Invoked with (value, key, callback).
   * @param {Function} [callback] - A callback which is called when all `iteratee`
   * functions have finished, or an error occurs. `result` is a new object consisting
   * of each key from `obj`, with each transformed value on the right-hand side.
   * Invoked with (err, result).
   * @example
   *
   * async.mapValues({
   *     f1: 'file1',
   *     f2: 'file2',
   *     f3: 'file3'
   * }, function (file, key, callback) {
   *   fs.stat(file, callback);
   * }, function(err, result) {
   *     // result is now a map of stats for each file, e.g.
   *     // {
   *     //     f1: [stats for file1],
   *     //     f2: [stats for file2],
   *     //     f3: [stats for file3]
   *     // }
   * });
   */


  var mapValues = doLimit(mapValuesLimit, Infinity);
  /**
   * The same as [`mapValues`]{@link module:Collections.mapValues} but runs only a single async operation at a time.
   *
   * @name mapValuesSeries
   * @static
   * @memberOf module:Collections
   * @method
   * @see [async.mapValues]{@link module:Collections.mapValues}
   * @category Collection
   * @param {Object} obj - A collection to iterate over.
   * @param {AsyncFunction} iteratee - A function to apply to each value and key
   * in `coll`.
   * The iteratee should complete with the transformed value as its result.
   * Invoked with (value, key, callback).
   * @param {Function} [callback] - A callback which is called when all `iteratee`
   * functions have finished, or an error occurs. `result` is a new object consisting
   * of each key from `obj`, with each transformed value on the right-hand side.
   * Invoked with (err, result).
   */

  var mapValuesSeries = doLimit(mapValuesLimit, 1);

  function has(obj, key) {
    return key in obj;
  }
  /**
   * Caches the results of an async function. When creating a hash to store
   * function results against, the callback is omitted from the hash and an
   * optional hash function can be used.
   *
   * If no hash function is specified, the first argument is used as a hash key,
   * which may work reasonably if it is a string or a data type that converts to a
   * distinct string. Note that objects and arrays will not behave reasonably.
   * Neither will cases where the other arguments are significant. In such cases,
   * specify your own hash function.
   *
   * The cache of results is exposed as the `memo` property of the function
   * returned by `memoize`.
   *
   * @name memoize
   * @static
   * @memberOf module:Utils
   * @method
   * @category Util
   * @param {AsyncFunction} fn - The async function to proxy and cache results from.
   * @param {Function} hasher - An optional function for generating a custom hash
   * for storing results. It has all the arguments applied to it apart from the
   * callback, and must be synchronous.
   * @returns {AsyncFunction} a memoized version of `fn`
   * @example
   *
   * var slow_fn = function(name, callback) {
   *     // do something
   *     callback(null, result);
   * };
   * var fn = async.memoize(slow_fn);
   *
   * // fn can now be used as if it were slow_fn
   * fn('some name', function() {
   *     // callback
   * });
   */


  function memoize(fn, hasher) {
    var memo = Object.create(null);
    var queues = Object.create(null);
    hasher = hasher || identity;

    var _fn = wrapAsync(fn);

    var memoized = initialParams(function memoized(args, callback) {
      var key = hasher.apply(null, args);

      if (has(memo, key)) {
        setImmediate$1(function () {
          callback.apply(null, memo[key]);
        });
      } else if (has(queues, key)) {
        queues[key].push(callback);
      } else {
        queues[key] = [callback];

        _fn.apply(null, args.concat(function ()
        /*args*/
        {
          var args = slice(arguments);
          memo[key] = args;
          var q = queues[key];
          delete queues[key];

          for (var i = 0, l = q.length; i < l; i++) {
            q[i].apply(null, args);
          }
        }));
      }
    });
    memoized.memo = memo;
    memoized.unmemoized = fn;
    return memoized;
  }
  /**
   * Calls `callback` on a later loop around the event loop. In Node.js this just
   * calls `process.nextTick`.  In the browser it will use `setImmediate` if
   * available, otherwise `setTimeout(callback, 0)`, which means other higher
   * priority events may precede the execution of `callback`.
   *
   * This is used internally for browser-compatibility purposes.
   *
   * @name nextTick
   * @static
   * @memberOf module:Utils
   * @method
   * @see [async.setImmediate]{@link module:Utils.setImmediate}
   * @category Util
   * @param {Function} callback - The function to call on a later loop around
   * the event loop. Invoked with (args...).
   * @param {...*} args... - any number of additional arguments to pass to the
   * callback on the next tick.
   * @example
   *
   * var call_order = [];
   * async.nextTick(function() {
   *     call_order.push('two');
   *     // call_order now equals ['one','two']
   * });
   * call_order.push('one');
   *
   * async.setImmediate(function (a, b, c) {
   *     // a, b, and c equal 1, 2, and 3
   * }, 1, 2, 3);
   */


  var _defer$1;

  if (hasNextTick) {
    _defer$1 = process.nextTick;
  } else if (hasSetImmediate) {
    _defer$1 = setImmediate;
  } else {
    _defer$1 = fallback;
  }

  var nextTick = wrap(_defer$1);

  function _parallel(eachfn, tasks, callback) {
    callback = callback || noop;
    var results = isArrayLike(tasks) ? [] : {};
    eachfn(tasks, function (task, key, callback) {
      wrapAsync(task)(function (err, result) {
        if (arguments.length > 2) {
          result = slice(arguments, 1);
        }

        results[key] = result;
        callback(err);
      });
    }, function (err) {
      callback(err, results);
    });
  }
  /**
   * Run the `tasks` collection of functions in parallel, without waiting until
   * the previous function has completed. If any of the functions pass an error to
   * its callback, the main `callback` is immediately called with the value of the
   * error. Once the `tasks` have completed, the results are passed to the final
   * `callback` as an array.
   *
   * **Note:** `parallel` is about kicking-off I/O tasks in parallel, not about
   * parallel execution of code.  If your tasks do not use any timers or perform
   * any I/O, they will actually be executed in series.  Any synchronous setup
   * sections for each task will happen one after the other.  JavaScript remains
   * single-threaded.
   *
   * **Hint:** Use [`reflect`]{@link module:Utils.reflect} to continue the
   * execution of other tasks when a task fails.
   *
   * It is also possible to use an object instead of an array. Each property will
   * be run as a function and the results will be passed to the final `callback`
   * as an object instead of an array. This can be a more readable way of handling
   * results from {@link async.parallel}.
   *
   * @name parallel
   * @static
   * @memberOf module:ControlFlow
   * @method
   * @category Control Flow
   * @param {Array|Iterable|Object} tasks - A collection of
   * [async functions]{@link AsyncFunction} to run.
   * Each async function can complete with any number of optional `result` values.
   * @param {Function} [callback] - An optional callback to run once all the
   * functions have completed successfully. This function gets a results array
   * (or object) containing all the result arguments passed to the task callbacks.
   * Invoked with (err, results).
   *
   * @example
   * async.parallel([
   *     function(callback) {
   *         setTimeout(function() {
   *             callback(null, 'one');
   *         }, 200);
   *     },
   *     function(callback) {
   *         setTimeout(function() {
   *             callback(null, 'two');
   *         }, 100);
   *     }
   * ],
   * // optional callback
   * function(err, results) {
   *     // the results array will equal ['one','two'] even though
   *     // the second function had a shorter timeout.
   * });
   *
   * // an example using an object instead of an array
   * async.parallel({
   *     one: function(callback) {
   *         setTimeout(function() {
   *             callback(null, 1);
   *         }, 200);
   *     },
   *     two: function(callback) {
   *         setTimeout(function() {
   *             callback(null, 2);
   *         }, 100);
   *     }
   * }, function(err, results) {
   *     // results is now equals to: {one: 1, two: 2}
   * });
   */


  function parallelLimit(tasks, callback) {
    _parallel(eachOf, tasks, callback);
  }
  /**
   * The same as [`parallel`]{@link module:ControlFlow.parallel} but runs a maximum of `limit` async operations at a
   * time.
   *
   * @name parallelLimit
   * @static
   * @memberOf module:ControlFlow
   * @method
   * @see [async.parallel]{@link module:ControlFlow.parallel}
   * @category Control Flow
   * @param {Array|Iterable|Object} tasks - A collection of
   * [async functions]{@link AsyncFunction} to run.
   * Each async function can complete with any number of optional `result` values.
   * @param {number} limit - The maximum number of async operations at a time.
   * @param {Function} [callback] - An optional callback to run once all the
   * functions have completed successfully. This function gets a results array
   * (or object) containing all the result arguments passed to the task callbacks.
   * Invoked with (err, results).
   */


  function parallelLimit$1(tasks, limit, callback) {
    _parallel(_eachOfLimit(limit), tasks, callback);
  }
  /**
   * A queue of tasks for the worker function to complete.
   * @typedef {Object} QueueObject
   * @memberOf module:ControlFlow
   * @property {Function} length - a function returning the number of items
   * waiting to be processed. Invoke with `queue.length()`.
   * @property {boolean} started - a boolean indicating whether or not any
   * items have been pushed and processed by the queue.
   * @property {Function} running - a function returning the number of items
   * currently being processed. Invoke with `queue.running()`.
   * @property {Function} workersList - a function returning the array of items
   * currently being processed. Invoke with `queue.workersList()`.
   * @property {Function} idle - a function returning false if there are items
   * waiting or being processed, or true if not. Invoke with `queue.idle()`.
   * @property {number} concurrency - an integer for determining how many `worker`
   * functions should be run in parallel. This property can be changed after a
   * `queue` is created to alter the concurrency on-the-fly.
   * @property {Function} push - add a new task to the `queue`. Calls `callback`
   * once the `worker` has finished processing the task. Instead of a single task,
   * a `tasks` array can be submitted. The respective callback is used for every
   * task in the list. Invoke with `queue.push(task, [callback])`,
   * @property {Function} unshift - add a new task to the front of the `queue`.
   * Invoke with `queue.unshift(task, [callback])`.
   * @property {Function} remove - remove items from the queue that match a test
   * function.  The test function will be passed an object with a `data` property,
   * and a `priority` property, if this is a
   * [priorityQueue]{@link module:ControlFlow.priorityQueue} object.
   * Invoked with `queue.remove(testFn)`, where `testFn` is of the form
   * `function ({data, priority}) {}` and returns a Boolean.
   * @property {Function} saturated - a callback that is called when the number of
   * running workers hits the `concurrency` limit, and further tasks will be
   * queued.
   * @property {Function} unsaturated - a callback that is called when the number
   * of running workers is less than the `concurrency` & `buffer` limits, and
   * further tasks will not be queued.
   * @property {number} buffer - A minimum threshold buffer in order to say that
   * the `queue` is `unsaturated`.
   * @property {Function} empty - a callback that is called when the last item
   * from the `queue` is given to a `worker`.
   * @property {Function} drain - a callback that is called when the last item
   * from the `queue` has returned from the `worker`.
   * @property {Function} error - a callback that is called when a task errors.
   * Has the signature `function(error, task)`.
   * @property {boolean} paused - a boolean for determining whether the queue is
   * in a paused state.
   * @property {Function} pause - a function that pauses the processing of tasks
   * until `resume()` is called. Invoke with `queue.pause()`.
   * @property {Function} resume - a function that resumes the processing of
   * queued tasks when the queue is paused. Invoke with `queue.resume()`.
   * @property {Function} kill - a function that removes the `drain` callback and
   * empties remaining tasks from the queue forcing it to go idle. No more tasks
   * should be pushed to the queue after calling this function. Invoke with `queue.kill()`.
   */

  /**
   * Creates a `queue` object with the specified `concurrency`. Tasks added to the
   * `queue` are processed in parallel (up to the `concurrency` limit). If all
   * `worker`s are in progress, the task is queued until one becomes available.
   * Once a `worker` completes a `task`, that `task`'s callback is called.
   *
   * @name queue
   * @static
   * @memberOf module:ControlFlow
   * @method
   * @category Control Flow
   * @param {AsyncFunction} worker - An async function for processing a queued task.
   * If you want to handle errors from an individual task, pass a callback to
   * `q.push()`. Invoked with (task, callback).
   * @param {number} [concurrency=1] - An `integer` for determining how many
   * `worker` functions should be run in parallel.  If omitted, the concurrency
   * defaults to `1`.  If the concurrency is `0`, an error is thrown.
   * @returns {module:ControlFlow.QueueObject} A queue object to manage the tasks. Callbacks can
   * attached as certain properties to listen for specific events during the
   * lifecycle of the queue.
   * @example
   *
   * // create a queue object with concurrency 2
   * var q = async.queue(function(task, callback) {
   *     console.log('hello ' + task.name);
   *     callback();
   * }, 2);
   *
   * // assign a callback
   * q.drain = function() {
   *     console.log('all items have been processed');
   * };
   *
   * // add some items to the queue
   * q.push({name: 'foo'}, function(err) {
   *     console.log('finished processing foo');
   * });
   * q.push({name: 'bar'}, function (err) {
   *     console.log('finished processing bar');
   * });
   *
   * // add some items to the queue (batch-wise)
   * q.push([{name: 'baz'},{name: 'bay'},{name: 'bax'}], function(err) {
   *     console.log('finished processing item');
   * });
   *
   * // add some items to the front of the queue
   * q.unshift({name: 'bar'}, function (err) {
   *     console.log('finished processing bar');
   * });
   */


  var queue$1 = function (worker, concurrency) {
    var _worker = wrapAsync(worker);

    return queue(function (items, cb) {
      _worker(items[0], cb);
    }, concurrency, 1);
  };
  /**
   * The same as [async.queue]{@link module:ControlFlow.queue} only tasks are assigned a priority and
   * completed in ascending priority order.
   *
   * @name priorityQueue
   * @static
   * @memberOf module:ControlFlow
   * @method
   * @see [async.queue]{@link module:ControlFlow.queue}
   * @category Control Flow
   * @param {AsyncFunction} worker - An async function for processing a queued task.
   * If you want to handle errors from an individual task, pass a callback to
   * `q.push()`.
   * Invoked with (task, callback).
   * @param {number} concurrency - An `integer` for determining how many `worker`
   * functions should be run in parallel.  If omitted, the concurrency defaults to
   * `1`.  If the concurrency is `0`, an error is thrown.
   * @returns {module:ControlFlow.QueueObject} A priorityQueue object to manage the tasks. There are two
   * differences between `queue` and `priorityQueue` objects:
   * * `push(task, priority, [callback])` - `priority` should be a number. If an
   *   array of `tasks` is given, all tasks will be assigned the same priority.
   * * The `unshift` method was removed.
   */


  var priorityQueue = function (worker, concurrency) {
    // Start with a normal queue
    var q = queue$1(worker, concurrency); // Override push to accept second parameter representing priority

    q.push = function (data, priority, callback) {
      if (callback == null) callback = noop;

      if (typeof callback !== 'function') {
        throw new Error('task callback must be a function');
      }

      q.started = true;

      if (!isArray(data)) {
        data = [data];
      }

      if (data.length === 0) {
        // call drain immediately if there are no tasks
        return setImmediate$1(function () {
          q.drain();
        });
      }

      priority = priority || 0;
      var nextNode = q._tasks.head;

      while (nextNode && priority >= nextNode.priority) {
        nextNode = nextNode.next;
      }

      for (var i = 0, l = data.length; i < l; i++) {
        var item = {
          data: data[i],
          priority: priority,
          callback: callback
        };

        if (nextNode) {
          q._tasks.insertBefore(nextNode, item);
        } else {
          q._tasks.push(item);
        }
      }

      setImmediate$1(q.process);
    }; // Remove unshift function


    delete q.unshift;
    return q;
  };
  /**
   * Runs the `tasks` array of functions in parallel, without waiting until the
   * previous function has completed. Once any of the `tasks` complete or pass an
   * error to its callback, the main `callback` is immediately called. It's
   * equivalent to `Promise.race()`.
   *
   * @name race
   * @static
   * @memberOf module:ControlFlow
   * @method
   * @category Control Flow
   * @param {Array} tasks - An array containing [async functions]{@link AsyncFunction}
   * to run. Each function can complete with an optional `result` value.
   * @param {Function} callback - A callback to run once any of the functions have
   * completed. This function gets an error or result from the first function that
   * completed. Invoked with (err, result).
   * @returns undefined
   * @example
   *
   * async.race([
   *     function(callback) {
   *         setTimeout(function() {
   *             callback(null, 'one');
   *         }, 200);
   *     },
   *     function(callback) {
   *         setTimeout(function() {
   *             callback(null, 'two');
   *         }, 100);
   *     }
   * ],
   * // main callback
   * function(err, result) {
   *     // the result will be equal to 'two' as it finishes earlier
   * });
   */


  function race(tasks, callback) {
    callback = once(callback || noop);
    if (!isArray(tasks)) return callback(new TypeError('First argument to race must be an array of functions'));
    if (!tasks.length) return callback();

    for (var i = 0, l = tasks.length; i < l; i++) {
      wrapAsync(tasks[i])(callback);
    }
  }
  /**
   * Same as [`reduce`]{@link module:Collections.reduce}, only operates on `array` in reverse order.
   *
   * @name reduceRight
   * @static
   * @memberOf module:Collections
   * @method
   * @see [async.reduce]{@link module:Collections.reduce}
   * @alias foldr
   * @category Collection
   * @param {Array} array - A collection to iterate over.
   * @param {*} memo - The initial state of the reduction.
   * @param {AsyncFunction} iteratee - A function applied to each item in the
   * array to produce the next step in the reduction.
   * The `iteratee` should complete with the next state of the reduction.
   * If the iteratee complete with an error, the reduction is stopped and the
   * main `callback` is immediately called with the error.
   * Invoked with (memo, item, callback).
   * @param {Function} [callback] - A callback which is called after all the
   * `iteratee` functions have finished. Result is the reduced value. Invoked with
   * (err, result).
   */


  function reduceRight(array, memo, iteratee, callback) {
    var reversed = slice(array).reverse();
    reduce(reversed, memo, iteratee, callback);
  }
  /**
   * Wraps the async function in another function that always completes with a
   * result object, even when it errors.
   *
   * The result object has either the property `error` or `value`.
   *
   * @name reflect
   * @static
   * @memberOf module:Utils
   * @method
   * @category Util
   * @param {AsyncFunction} fn - The async function you want to wrap
   * @returns {Function} - A function that always passes null to it's callback as
   * the error. The second argument to the callback will be an `object` with
   * either an `error` or a `value` property.
   * @example
   *
   * async.parallel([
   *     async.reflect(function(callback) {
   *         // do some stuff ...
   *         callback(null, 'one');
   *     }),
   *     async.reflect(function(callback) {
   *         // do some more stuff but error ...
   *         callback('bad stuff happened');
   *     }),
   *     async.reflect(function(callback) {
   *         // do some more stuff ...
   *         callback(null, 'two');
   *     })
   * ],
   * // optional callback
   * function(err, results) {
   *     // values
   *     // results[0].value = 'one'
   *     // results[1].error = 'bad stuff happened'
   *     // results[2].value = 'two'
   * });
   */


  function reflect(fn) {
    var _fn = wrapAsync(fn);

    return initialParams(function reflectOn(args, reflectCallback) {
      args.push(function callback(error, cbArg) {
        if (error) {
          reflectCallback(null, {
            error: error
          });
        } else {
          var value;

          if (arguments.length <= 2) {
            value = cbArg;
          } else {
            value = slice(arguments, 1);
          }

          reflectCallback(null, {
            value: value
          });
        }
      });
      return _fn.apply(this, args);
    });
  }
  /**
   * A helper function that wraps an array or an object of functions with `reflect`.
   *
   * @name reflectAll
   * @static
   * @memberOf module:Utils
   * @method
   * @see [async.reflect]{@link module:Utils.reflect}
   * @category Util
   * @param {Array|Object|Iterable} tasks - The collection of
   * [async functions]{@link AsyncFunction} to wrap in `async.reflect`.
   * @returns {Array} Returns an array of async functions, each wrapped in
   * `async.reflect`
   * @example
   *
   * let tasks = [
   *     function(callback) {
   *         setTimeout(function() {
   *             callback(null, 'one');
   *         }, 200);
   *     },
   *     function(callback) {
   *         // do some more stuff but error ...
   *         callback(new Error('bad stuff happened'));
   *     },
   *     function(callback) {
   *         setTimeout(function() {
   *             callback(null, 'two');
   *         }, 100);
   *     }
   * ];
   *
   * async.parallel(async.reflectAll(tasks),
   * // optional callback
   * function(err, results) {
   *     // values
   *     // results[0].value = 'one'
   *     // results[1].error = Error('bad stuff happened')
   *     // results[2].value = 'two'
   * });
   *
   * // an example using an object instead of an array
   * let tasks = {
   *     one: function(callback) {
   *         setTimeout(function() {
   *             callback(null, 'one');
   *         }, 200);
   *     },
   *     two: function(callback) {
   *         callback('two');
   *     },
   *     three: function(callback) {
   *         setTimeout(function() {
   *             callback(null, 'three');
   *         }, 100);
   *     }
   * };
   *
   * async.parallel(async.reflectAll(tasks),
   * // optional callback
   * function(err, results) {
   *     // values
   *     // results.one.value = 'one'
   *     // results.two.error = 'two'
   *     // results.three.value = 'three'
   * });
   */


  function reflectAll(tasks) {
    var results;

    if (isArray(tasks)) {
      results = arrayMap(tasks, reflect);
    } else {
      results = {};
      baseForOwn(tasks, function (task, key) {
        results[key] = reflect.call(this, task);
      });
    }

    return results;
  }

  function reject$1(eachfn, arr, iteratee, callback) {
    _filter(eachfn, arr, function (value, cb) {
      iteratee(value, function (err, v) {
        cb(err, !v);
      });
    }, callback);
  }
  /**
   * The opposite of [`filter`]{@link module:Collections.filter}. Removes values that pass an `async` truth test.
   *
   * @name reject
   * @static
   * @memberOf module:Collections
   * @method
   * @see [async.filter]{@link module:Collections.filter}
   * @category Collection
   * @param {Array|Iterable|Object} coll - A collection to iterate over.
   * @param {Function} iteratee - An async truth test to apply to each item in
   * `coll`.
   * The should complete with a boolean value as its `result`.
   * Invoked with (item, callback).
   * @param {Function} [callback] - A callback which is called after all the
   * `iteratee` functions have finished. Invoked with (err, results).
   * @example
   *
   * async.reject(['file1','file2','file3'], function(filePath, callback) {
   *     fs.access(filePath, function(err) {
   *         callback(null, !err)
   *     });
   * }, function(err, results) {
   *     // results now equals an array of missing files
   *     createFiles(results);
   * });
   */


  var reject = doParallel(reject$1);
  /**
   * The same as [`reject`]{@link module:Collections.reject} but runs a maximum of `limit` async operations at a
   * time.
   *
   * @name rejectLimit
   * @static
   * @memberOf module:Collections
   * @method
   * @see [async.reject]{@link module:Collections.reject}
   * @category Collection
   * @param {Array|Iterable|Object} coll - A collection to iterate over.
   * @param {number} limit - The maximum number of async operations at a time.
   * @param {Function} iteratee - An async truth test to apply to each item in
   * `coll`.
   * The should complete with a boolean value as its `result`.
   * Invoked with (item, callback).
   * @param {Function} [callback] - A callback which is called after all the
   * `iteratee` functions have finished. Invoked with (err, results).
   */

  var rejectLimit = doParallelLimit(reject$1);
  /**
   * The same as [`reject`]{@link module:Collections.reject} but runs only a single async operation at a time.
   *
   * @name rejectSeries
   * @static
   * @memberOf module:Collections
   * @method
   * @see [async.reject]{@link module:Collections.reject}
   * @category Collection
   * @param {Array|Iterable|Object} coll - A collection to iterate over.
   * @param {Function} iteratee - An async truth test to apply to each item in
   * `coll`.
   * The should complete with a boolean value as its `result`.
   * Invoked with (item, callback).
   * @param {Function} [callback] - A callback which is called after all the
   * `iteratee` functions have finished. Invoked with (err, results).
   */

  var rejectSeries = doLimit(rejectLimit, 1);
  /**
   * Creates a function that returns `value`.
   *
   * @static
   * @memberOf _
   * @since 2.4.0
   * @category Util
   * @param {*} value The value to return from the new function.
   * @returns {Function} Returns the new constant function.
   * @example
   *
   * var objects = _.times(2, _.constant({ 'a': 1 }));
   *
   * console.log(objects);
   * // => [{ 'a': 1 }, { 'a': 1 }]
   *
   * console.log(objects[0] === objects[1]);
   * // => true
   */

  function constant$1(value) {
    return function () {
      return value;
    };
  }
  /**
   * Attempts to get a successful response from `task` no more than `times` times
   * before returning an error. If the task is successful, the `callback` will be
   * passed the result of the successful task. If all attempts fail, the callback
   * will be passed the error and result (if any) of the final attempt.
   *
   * @name retry
   * @static
   * @memberOf module:ControlFlow
   * @method
   * @category Control Flow
   * @see [async.retryable]{@link module:ControlFlow.retryable}
   * @param {Object|number} [opts = {times: 5, interval: 0}| 5] - Can be either an
   * object with `times` and `interval` or a number.
   * * `times` - The number of attempts to make before giving up.  The default
   *   is `5`.
   * * `interval` - The time to wait between retries, in milliseconds.  The
   *   default is `0`. The interval may also be specified as a function of the
   *   retry count (see example).
   * * `errorFilter` - An optional synchronous function that is invoked on
   *   erroneous result. If it returns `true` the retry attempts will continue;
   *   if the function returns `false` the retry flow is aborted with the current
   *   attempt's error and result being returned to the final callback.
   *   Invoked with (err).
   * * If `opts` is a number, the number specifies the number of times to retry,
   *   with the default interval of `0`.
   * @param {AsyncFunction} task - An async function to retry.
   * Invoked with (callback).
   * @param {Function} [callback] - An optional callback which is called when the
   * task has succeeded, or after the final failed attempt. It receives the `err`
   * and `result` arguments of the last attempt at completing the `task`. Invoked
   * with (err, results).
   *
   * @example
   *
   * // The `retry` function can be used as a stand-alone control flow by passing
   * // a callback, as shown below:
   *
   * // try calling apiMethod 3 times
   * async.retry(3, apiMethod, function(err, result) {
   *     // do something with the result
   * });
   *
   * // try calling apiMethod 3 times, waiting 200 ms between each retry
   * async.retry({times: 3, interval: 200}, apiMethod, function(err, result) {
   *     // do something with the result
   * });
   *
   * // try calling apiMethod 10 times with exponential backoff
   * // (i.e. intervals of 100, 200, 400, 800, 1600, ... milliseconds)
   * async.retry({
   *   times: 10,
   *   interval: function(retryCount) {
   *     return 50 * Math.pow(2, retryCount);
   *   }
   * }, apiMethod, function(err, result) {
   *     // do something with the result
   * });
   *
   * // try calling apiMethod the default 5 times no delay between each retry
   * async.retry(apiMethod, function(err, result) {
   *     // do something with the result
   * });
   *
   * // try calling apiMethod only when error condition satisfies, all other
   * // errors will abort the retry control flow and return to final callback
   * async.retry({
   *   errorFilter: function(err) {
   *     return err.message === 'Temporary error'; // only retry on a specific error
   *   }
   * }, apiMethod, function(err, result) {
   *     // do something with the result
   * });
   *
   * // to retry individual methods that are not as reliable within other
   * // control flow functions, use the `retryable` wrapper:
   * async.auto({
   *     users: api.getUsers.bind(api),
   *     payments: async.retryable(3, api.getPayments.bind(api))
   * }, function(err, results) {
   *     // do something with the results
   * });
   *
   */


  function retry(opts, task, callback) {
    var DEFAULT_TIMES = 5;
    var DEFAULT_INTERVAL = 0;
    var options = {
      times: DEFAULT_TIMES,
      intervalFunc: constant$1(DEFAULT_INTERVAL)
    };

    function parseTimes(acc, t) {
      if (typeof t === 'object') {
        acc.times = +t.times || DEFAULT_TIMES;
        acc.intervalFunc = typeof t.interval === 'function' ? t.interval : constant$1(+t.interval || DEFAULT_INTERVAL);
        acc.errorFilter = t.errorFilter;
      } else if (typeof t === 'number' || typeof t === 'string') {
        acc.times = +t || DEFAULT_TIMES;
      } else {
        throw new Error("Invalid arguments for async.retry");
      }
    }

    if (arguments.length < 3 && typeof opts === 'function') {
      callback = task || noop;
      task = opts;
    } else {
      parseTimes(options, opts);
      callback = callback || noop;
    }

    if (typeof task !== 'function') {
      throw new Error("Invalid arguments for async.retry");
    }

    var _task = wrapAsync(task);

    var attempt = 1;

    function retryAttempt() {
      _task(function (err) {
        if (err && attempt++ < options.times && (typeof options.errorFilter != 'function' || options.errorFilter(err))) {
          setTimeout(retryAttempt, options.intervalFunc(attempt));
        } else {
          callback.apply(null, arguments);
        }
      });
    }

    retryAttempt();
  }
  /**
   * A close relative of [`retry`]{@link module:ControlFlow.retry}.  This method
   * wraps a task and makes it retryable, rather than immediately calling it
   * with retries.
   *
   * @name retryable
   * @static
   * @memberOf module:ControlFlow
   * @method
   * @see [async.retry]{@link module:ControlFlow.retry}
   * @category Control Flow
   * @param {Object|number} [opts = {times: 5, interval: 0}| 5] - optional
   * options, exactly the same as from `retry`
   * @param {AsyncFunction} task - the asynchronous function to wrap.
   * This function will be passed any arguments passed to the returned wrapper.
   * Invoked with (...args, callback).
   * @returns {AsyncFunction} The wrapped function, which when invoked, will
   * retry on an error, based on the parameters specified in `opts`.
   * This function will accept the same parameters as `task`.
   * @example
   *
   * async.auto({
   *     dep1: async.retryable(3, getFromFlakyService),
   *     process: ["dep1", async.retryable(3, function (results, cb) {
   *         maybeProcessData(results.dep1, cb);
   *     })]
   * }, callback);
   */


  var retryable = function (opts, task) {
    if (!task) {
      task = opts;
      opts = null;
    }

    var _task = wrapAsync(task);

    return initialParams(function (args, callback) {
      function taskFn(cb) {
        _task.apply(null, args.concat(cb));
      }

      if (opts) retry(opts, taskFn, callback);else retry(taskFn, callback);
    });
  };
  /**
   * Run the functions in the `tasks` collection in series, each one running once
   * the previous function has completed. If any functions in the series pass an
   * error to its callback, no more functions are run, and `callback` is
   * immediately called with the value of the error. Otherwise, `callback`
   * receives an array of results when `tasks` have completed.
   *
   * It is also possible to use an object instead of an array. Each property will
   * be run as a function, and the results will be passed to the final `callback`
   * as an object instead of an array. This can be a more readable way of handling
   *  results from {@link async.series}.
   *
   * **Note** that while many implementations preserve the order of object
   * properties, the [ECMAScript Language Specification](http://www.ecma-international.org/ecma-262/5.1/#sec-8.6)
   * explicitly states that
   *
   * > The mechanics and order of enumerating the properties is not specified.
   *
   * So if you rely on the order in which your series of functions are executed,
   * and want this to work on all platforms, consider using an array.
   *
   * @name series
   * @static
   * @memberOf module:ControlFlow
   * @method
   * @category Control Flow
   * @param {Array|Iterable|Object} tasks - A collection containing
   * [async functions]{@link AsyncFunction} to run in series.
   * Each function can complete with any number of optional `result` values.
   * @param {Function} [callback] - An optional callback to run once all the
   * functions have completed. This function gets a results array (or object)
   * containing all the result arguments passed to the `task` callbacks. Invoked
   * with (err, result).
   * @example
   * async.series([
   *     function(callback) {
   *         // do some stuff ...
   *         callback(null, 'one');
   *     },
   *     function(callback) {
   *         // do some more stuff ...
   *         callback(null, 'two');
   *     }
   * ],
   * // optional callback
   * function(err, results) {
   *     // results is now equal to ['one', 'two']
   * });
   *
   * async.series({
   *     one: function(callback) {
   *         setTimeout(function() {
   *             callback(null, 1);
   *         }, 200);
   *     },
   *     two: function(callback){
   *         setTimeout(function() {
   *             callback(null, 2);
   *         }, 100);
   *     }
   * }, function(err, results) {
   *     // results is now equal to: {one: 1, two: 2}
   * });
   */


  function series(tasks, callback) {
    _parallel(eachOfSeries, tasks, callback);
  }
  /**
   * Returns `true` if at least one element in the `coll` satisfies an async test.
   * If any iteratee call returns `true`, the main `callback` is immediately
   * called.
   *
   * @name some
   * @static
   * @memberOf module:Collections
   * @method
   * @alias any
   * @category Collection
   * @param {Array|Iterable|Object} coll - A collection to iterate over.
   * @param {AsyncFunction} iteratee - An async truth test to apply to each item
   * in the collections in parallel.
   * The iteratee should complete with a boolean `result` value.
   * Invoked with (item, callback).
   * @param {Function} [callback] - A callback which is called as soon as any
   * iteratee returns `true`, or after all the iteratee functions have finished.
   * Result will be either `true` or `false` depending on the values of the async
   * tests. Invoked with (err, result).
   * @example
   *
   * async.some(['file1','file2','file3'], function(filePath, callback) {
   *     fs.access(filePath, function(err) {
   *         callback(null, !err)
   *     });
   * }, function(err, result) {
   *     // if result is true then at least one of the files exists
   * });
   */


  var some = doParallel(_createTester(Boolean, identity));
  /**
   * The same as [`some`]{@link module:Collections.some} but runs a maximum of `limit` async operations at a time.
   *
   * @name someLimit
   * @static
   * @memberOf module:Collections
   * @method
   * @see [async.some]{@link module:Collections.some}
   * @alias anyLimit
   * @category Collection
   * @param {Array|Iterable|Object} coll - A collection to iterate over.
   * @param {number} limit - The maximum number of async operations at a time.
   * @param {AsyncFunction} iteratee - An async truth test to apply to each item
   * in the collections in parallel.
   * The iteratee should complete with a boolean `result` value.
   * Invoked with (item, callback).
   * @param {Function} [callback] - A callback which is called as soon as any
   * iteratee returns `true`, or after all the iteratee functions have finished.
   * Result will be either `true` or `false` depending on the values of the async
   * tests. Invoked with (err, result).
   */

  var someLimit = doParallelLimit(_createTester(Boolean, identity));
  /**
   * The same as [`some`]{@link module:Collections.some} but runs only a single async operation at a time.
   *
   * @name someSeries
   * @static
   * @memberOf module:Collections
   * @method
   * @see [async.some]{@link module:Collections.some}
   * @alias anySeries
   * @category Collection
   * @param {Array|Iterable|Object} coll - A collection to iterate over.
   * @param {AsyncFunction} iteratee - An async truth test to apply to each item
   * in the collections in series.
   * The iteratee should complete with a boolean `result` value.
   * Invoked with (item, callback).
   * @param {Function} [callback] - A callback which is called as soon as any
   * iteratee returns `true`, or after all the iteratee functions have finished.
   * Result will be either `true` or `false` depending on the values of the async
   * tests. Invoked with (err, result).
   */

  var someSeries = doLimit(someLimit, 1);
  /**
   * Sorts a list by the results of running each `coll` value through an async
   * `iteratee`.
   *
   * @name sortBy
   * @static
   * @memberOf module:Collections
   * @method
   * @category Collection
   * @param {Array|Iterable|Object} coll - A collection to iterate over.
   * @param {AsyncFunction} iteratee - An async function to apply to each item in
   * `coll`.
   * The iteratee should complete with a value to use as the sort criteria as
   * its `result`.
   * Invoked with (item, callback).
   * @param {Function} callback - A callback which is called after all the
   * `iteratee` functions have finished, or an error occurs. Results is the items
   * from the original `coll` sorted by the values returned by the `iteratee`
   * calls. Invoked with (err, results).
   * @example
   *
   * async.sortBy(['file1','file2','file3'], function(file, callback) {
   *     fs.stat(file, function(err, stats) {
   *         callback(err, stats.mtime);
   *     });
   * }, function(err, results) {
   *     // results is now the original array of files sorted by
   *     // modified date
   * });
   *
   * // By modifying the callback parameter the
   * // sorting order can be influenced:
   *
   * // ascending order
   * async.sortBy([1,9,3,5], function(x, callback) {
   *     callback(null, x);
   * }, function(err,result) {
   *     // result callback
   * });
   *
   * // descending order
   * async.sortBy([1,9,3,5], function(x, callback) {
   *     callback(null, x*-1);    //<- x*-1 instead of x, turns the order around
   * }, function(err,result) {
   *     // result callback
   * });
   */

  function sortBy(coll, iteratee, callback) {
    var _iteratee = wrapAsync(iteratee);

    map(coll, function (x, callback) {
      _iteratee(x, function (err, criteria) {
        if (err) return callback(err);
        callback(null, {
          value: x,
          criteria: criteria
        });
      });
    }, function (err, results) {
      if (err) return callback(err);
      callback(null, arrayMap(results.sort(comparator), baseProperty('value')));
    });

    function comparator(left, right) {
      var a = left.criteria,
          b = right.criteria;
      return a < b ? -1 : a > b ? 1 : 0;
    }
  }
  /**
   * Sets a time limit on an asynchronous function. If the function does not call
   * its callback within the specified milliseconds, it will be called with a
   * timeout error. The code property for the error object will be `'ETIMEDOUT'`.
   *
   * @name timeout
   * @static
   * @memberOf module:Utils
   * @method
   * @category Util
   * @param {AsyncFunction} asyncFn - The async function to limit in time.
   * @param {number} milliseconds - The specified time limit.
   * @param {*} [info] - Any variable you want attached (`string`, `object`, etc)
   * to timeout Error for more information..
   * @returns {AsyncFunction} Returns a wrapped function that can be used with any
   * of the control flow functions.
   * Invoke this function with the same parameters as you would `asyncFunc`.
   * @example
   *
   * function myFunction(foo, callback) {
   *     doAsyncTask(foo, function(err, data) {
   *         // handle errors
   *         if (err) return callback(err);
   *
   *         // do some stuff ...
   *
   *         // return processed data
   *         return callback(null, data);
   *     });
   * }
   *
   * var wrapped = async.timeout(myFunction, 1000);
   *
   * // call `wrapped` as you would `myFunction`
   * wrapped({ bar: 'bar' }, function(err, data) {
   *     // if `myFunction` takes < 1000 ms to execute, `err`
   *     // and `data` will have their expected values
   *
   *     // else `err` will be an Error with the code 'ETIMEDOUT'
   * });
   */


  function timeout(asyncFn, milliseconds, info) {
    var fn = wrapAsync(asyncFn);
    return initialParams(function (args, callback) {
      var timedOut = false;
      var timer;

      function timeoutCallback() {
        var name = asyncFn.name || 'anonymous';
        var error = new Error('Callback function "' + name + '" timed out.');
        error.code = 'ETIMEDOUT';

        if (info) {
          error.info = info;
        }

        timedOut = true;
        callback(error);
      }

      args.push(function () {
        if (!timedOut) {
          callback.apply(null, arguments);
          clearTimeout(timer);
        }
      }); // setup timer and call original function

      timer = setTimeout(timeoutCallback, milliseconds);
      fn.apply(null, args);
    });
  }
  /* Built-in method references for those with the same name as other `lodash` methods. */


  var nativeCeil = Math.ceil;
  var nativeMax = Math.max;
  /**
   * The base implementation of `_.range` and `_.rangeRight` which doesn't
   * coerce arguments.
   *
   * @private
   * @param {number} start The start of the range.
   * @param {number} end The end of the range.
   * @param {number} step The value to increment or decrement by.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {Array} Returns the range of numbers.
   */

  function baseRange(start, end, step, fromRight) {
    var index = -1,
        length = nativeMax(nativeCeil((end - start) / (step || 1)), 0),
        result = Array(length);

    while (length--) {
      result[fromRight ? length : ++index] = start;
      start += step;
    }

    return result;
  }
  /**
   * The same as [times]{@link module:ControlFlow.times} but runs a maximum of `limit` async operations at a
   * time.
   *
   * @name timesLimit
   * @static
   * @memberOf module:ControlFlow
   * @method
   * @see [async.times]{@link module:ControlFlow.times}
   * @category Control Flow
   * @param {number} count - The number of times to run the function.
   * @param {number} limit - The maximum number of async operations at a time.
   * @param {AsyncFunction} iteratee - The async function to call `n` times.
   * Invoked with the iteration index and a callback: (n, next).
   * @param {Function} callback - see [async.map]{@link module:Collections.map}.
   */


  function timeLimit(count, limit, iteratee, callback) {
    var _iteratee = wrapAsync(iteratee);

    mapLimit(baseRange(0, count, 1), limit, _iteratee, callback);
  }
  /**
   * Calls the `iteratee` function `n` times, and accumulates results in the same
   * manner you would use with [map]{@link module:Collections.map}.
   *
   * @name times
   * @static
   * @memberOf module:ControlFlow
   * @method
   * @see [async.map]{@link module:Collections.map}
   * @category Control Flow
   * @param {number} n - The number of times to run the function.
   * @param {AsyncFunction} iteratee - The async function to call `n` times.
   * Invoked with the iteration index and a callback: (n, next).
   * @param {Function} callback - see {@link module:Collections.map}.
   * @example
   *
   * // Pretend this is some complicated async factory
   * var createUser = function(id, callback) {
   *     callback(null, {
   *         id: 'user' + id
   *     });
   * };
   *
   * // generate 5 users
   * async.times(5, function(n, next) {
   *     createUser(n, function(err, user) {
   *         next(err, user);
   *     });
   * }, function(err, users) {
   *     // we should now have 5 users
   * });
   */


  var times = doLimit(timeLimit, Infinity);
  /**
   * The same as [times]{@link module:ControlFlow.times} but runs only a single async operation at a time.
   *
   * @name timesSeries
   * @static
   * @memberOf module:ControlFlow
   * @method
   * @see [async.times]{@link module:ControlFlow.times}
   * @category Control Flow
   * @param {number} n - The number of times to run the function.
   * @param {AsyncFunction} iteratee - The async function to call `n` times.
   * Invoked with the iteration index and a callback: (n, next).
   * @param {Function} callback - see {@link module:Collections.map}.
   */

  var timesSeries = doLimit(timeLimit, 1);
  /**
   * A relative of `reduce`.  Takes an Object or Array, and iterates over each
   * element in series, each step potentially mutating an `accumulator` value.
   * The type of the accumulator defaults to the type of collection passed in.
   *
   * @name transform
   * @static
   * @memberOf module:Collections
   * @method
   * @category Collection
   * @param {Array|Iterable|Object} coll - A collection to iterate over.
   * @param {*} [accumulator] - The initial state of the transform.  If omitted,
   * it will default to an empty Object or Array, depending on the type of `coll`
   * @param {AsyncFunction} iteratee - A function applied to each item in the
   * collection that potentially modifies the accumulator.
   * Invoked with (accumulator, item, key, callback).
   * @param {Function} [callback] - A callback which is called after all the
   * `iteratee` functions have finished. Result is the transformed accumulator.
   * Invoked with (err, result).
   * @example
   *
   * async.transform([1,2,3], function(acc, item, index, callback) {
   *     // pointless async:
   *     process.nextTick(function() {
   *         acc.push(item * 2)
   *         callback(null)
   *     });
   * }, function(err, result) {
   *     // result is now equal to [2, 4, 6]
   * });
   *
   * @example
   *
   * async.transform({a: 1, b: 2, c: 3}, function (obj, val, key, callback) {
   *     setImmediate(function () {
   *         obj[key] = val * 2;
   *         callback();
   *     })
   * }, function (err, result) {
   *     // result is equal to {a: 2, b: 4, c: 6}
   * })
   */

  function transform(coll, accumulator, iteratee, callback) {
    if (arguments.length <= 3) {
      callback = iteratee;
      iteratee = accumulator;
      accumulator = isArray(coll) ? [] : {};
    }

    callback = once(callback || noop);

    var _iteratee = wrapAsync(iteratee);

    eachOf(coll, function (v, k, cb) {
      _iteratee(accumulator, v, k, cb);
    }, function (err) {
      callback(err, accumulator);
    });
  }
  /**
   * It runs each task in series but stops whenever any of the functions were
   * successful. If one of the tasks were successful, the `callback` will be
   * passed the result of the successful task. If all tasks fail, the callback
   * will be passed the error and result (if any) of the final attempt.
   *
   * @name tryEach
   * @static
   * @memberOf module:ControlFlow
   * @method
   * @category Control Flow
   * @param {Array|Iterable|Object} tasks - A collection containing functions to
   * run, each function is passed a `callback(err, result)` it must call on
   * completion with an error `err` (which can be `null`) and an optional `result`
   * value.
   * @param {Function} [callback] - An optional callback which is called when one
   * of the tasks has succeeded, or all have failed. It receives the `err` and
   * `result` arguments of the last attempt at completing the `task`. Invoked with
   * (err, results).
   * @example
   * async.tryEach([
   *     function getDataFromFirstWebsite(callback) {
   *         // Try getting the data from the first website
   *         callback(err, data);
   *     },
   *     function getDataFromSecondWebsite(callback) {
   *         // First website failed,
   *         // Try getting the data from the backup website
   *         callback(err, data);
   *     }
   * ],
   * // optional callback
   * function(err, results) {
   *     Now do something with the data.
   * });
   *
   */


  function tryEach(tasks, callback) {
    var error = null;
    var result;
    callback = callback || noop;
    eachSeries(tasks, function (task, callback) {
      wrapAsync(task)(function (err, res
      /*, ...args*/
      ) {
        if (arguments.length > 2) {
          result = slice(arguments, 1);
        } else {
          result = res;
        }

        error = err;
        callback(!err);
      });
    }, function () {
      callback(error, result);
    });
  }
  /**
   * Undoes a [memoize]{@link module:Utils.memoize}d function, reverting it to the original,
   * unmemoized form. Handy for testing.
   *
   * @name unmemoize
   * @static
   * @memberOf module:Utils
   * @method
   * @see [async.memoize]{@link module:Utils.memoize}
   * @category Util
   * @param {AsyncFunction} fn - the memoized function
   * @returns {AsyncFunction} a function that calls the original unmemoized function
   */


  function unmemoize(fn) {
    return function () {
      return (fn.unmemoized || fn).apply(null, arguments);
    };
  }
  /**
   * Repeatedly call `iteratee`, while `test` returns `true`. Calls `callback` when
   * stopped, or an error occurs.
   *
   * @name whilst
   * @static
   * @memberOf module:ControlFlow
   * @method
   * @category Control Flow
   * @param {Function} test - synchronous truth test to perform before each
   * execution of `iteratee`. Invoked with ().
   * @param {AsyncFunction} iteratee - An async function which is called each time
   * `test` passes. Invoked with (callback).
   * @param {Function} [callback] - A callback which is called after the test
   * function has failed and repeated execution of `iteratee` has stopped. `callback`
   * will be passed an error and any arguments passed to the final `iteratee`'s
   * callback. Invoked with (err, [results]);
   * @returns undefined
   * @example
   *
   * var count = 0;
   * async.whilst(
   *     function() { return count < 5; },
   *     function(callback) {
   *         count++;
   *         setTimeout(function() {
   *             callback(null, count);
   *         }, 1000);
   *     },
   *     function (err, n) {
   *         // 5 seconds have passed, n = 5
   *     }
   * );
   */


  function whilst(test, iteratee, callback) {
    callback = onlyOnce(callback || noop);

    var _iteratee = wrapAsync(iteratee);

    if (!test()) return callback(null);

    var next = function (err
    /*, ...args*/
    ) {
      if (err) return callback(err);
      if (test()) return _iteratee(next);
      var args = slice(arguments, 1);
      callback.apply(null, [null].concat(args));
    };

    _iteratee(next);
  }
  /**
   * Repeatedly call `iteratee` until `test` returns `true`. Calls `callback` when
   * stopped, or an error occurs. `callback` will be passed an error and any
   * arguments passed to the final `iteratee`'s callback.
   *
   * The inverse of [whilst]{@link module:ControlFlow.whilst}.
   *
   * @name until
   * @static
   * @memberOf module:ControlFlow
   * @method
   * @see [async.whilst]{@link module:ControlFlow.whilst}
   * @category Control Flow
   * @param {Function} test - synchronous truth test to perform before each
   * execution of `iteratee`. Invoked with ().
   * @param {AsyncFunction} iteratee - An async function which is called each time
   * `test` fails. Invoked with (callback).
   * @param {Function} [callback] - A callback which is called after the test
   * function has passed and repeated execution of `iteratee` has stopped. `callback`
   * will be passed an error and any arguments passed to the final `iteratee`'s
   * callback. Invoked with (err, [results]);
   */


  function until(test, iteratee, callback) {
    whilst(function () {
      return !test.apply(this, arguments);
    }, iteratee, callback);
  }
  /**
   * Runs the `tasks` array of functions in series, each passing their results to
   * the next in the array. However, if any of the `tasks` pass an error to their
   * own callback, the next function is not executed, and the main `callback` is
   * immediately called with the error.
   *
   * @name waterfall
   * @static
   * @memberOf module:ControlFlow
   * @method
   * @category Control Flow
   * @param {Array} tasks - An array of [async functions]{@link AsyncFunction}
   * to run.
   * Each function should complete with any number of `result` values.
   * The `result` values will be passed as arguments, in order, to the next task.
   * @param {Function} [callback] - An optional callback to run once all the
   * functions have completed. This will be passed the results of the last task's
   * callback. Invoked with (err, [results]).
   * @returns undefined
   * @example
   *
   * async.waterfall([
   *     function(callback) {
   *         callback(null, 'one', 'two');
   *     },
   *     function(arg1, arg2, callback) {
   *         // arg1 now equals 'one' and arg2 now equals 'two'
   *         callback(null, 'three');
   *     },
   *     function(arg1, callback) {
   *         // arg1 now equals 'three'
   *         callback(null, 'done');
   *     }
   * ], function (err, result) {
   *     // result now equals 'done'
   * });
   *
   * // Or, with named functions:
   * async.waterfall([
   *     myFirstFunction,
   *     mySecondFunction,
   *     myLastFunction,
   * ], function (err, result) {
   *     // result now equals 'done'
   * });
   * function myFirstFunction(callback) {
   *     callback(null, 'one', 'two');
   * }
   * function mySecondFunction(arg1, arg2, callback) {
   *     // arg1 now equals 'one' and arg2 now equals 'two'
   *     callback(null, 'three');
   * }
   * function myLastFunction(arg1, callback) {
   *     // arg1 now equals 'three'
   *     callback(null, 'done');
   * }
   */


  var waterfall = function (tasks, callback) {
    callback = once(callback || noop);
    if (!isArray(tasks)) return callback(new Error('First argument to waterfall must be an array of functions'));
    if (!tasks.length) return callback();
    var taskIndex = 0;

    function nextTask(args) {
      var task = wrapAsync(tasks[taskIndex++]);
      args.push(onlyOnce(next));
      task.apply(null, args);
    }

    function next(err
    /*, ...args*/
    ) {
      if (err || taskIndex === tasks.length) {
        return callback.apply(null, arguments);
      }

      nextTask(slice(arguments, 1));
    }

    nextTask([]);
  };
  /**
   * An "async function" in the context of Async is an asynchronous function with
   * a variable number of parameters, with the final parameter being a callback.
   * (`function (arg1, arg2, ..., callback) {}`)
   * The final callback is of the form `callback(err, results...)`, which must be
   * called once the function is completed.  The callback should be called with a
   * Error as its first argument to signal that an error occurred.
   * Otherwise, if no error occurred, it should be called with `null` as the first
   * argument, and any additional `result` arguments that may apply, to signal
   * successful completion.
   * The callback must be called exactly once, ideally on a later tick of the
   * JavaScript event loop.
   *
   * This type of function is also referred to as a "Node-style async function",
   * or a "continuation passing-style function" (CPS). Most of the methods of this
   * library are themselves CPS/Node-style async functions, or functions that
   * return CPS/Node-style async functions.
   *
   * Wherever we accept a Node-style async function, we also directly accept an
   * [ES2017 `async` function]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function}.
   * In this case, the `async` function will not be passed a final callback
   * argument, and any thrown error will be used as the `err` argument of the
   * implicit callback, and the return value will be used as the `result` value.
   * (i.e. a `rejected` of the returned Promise becomes the `err` callback
   * argument, and a `resolved` value becomes the `result`.)
   *
   * Note, due to JavaScript limitations, we can only detect native `async`
   * functions and not transpilied implementations.
   * Your environment must have `async`/`await` support for this to work.
   * (e.g. Node > v7.6, or a recent version of a modern browser).
   * If you are using `async` functions through a transpiler (e.g. Babel), you
   * must still wrap the function with [asyncify]{@link module:Utils.asyncify},
   * because the `async function` will be compiled to an ordinary function that
   * returns a promise.
   *
   * @typedef {Function} AsyncFunction
   * @static
   */

  /**
   * Async is a utility module which provides straight-forward, powerful functions
   * for working with asynchronous JavaScript. Although originally designed for
   * use with [Node.js](http://nodejs.org) and installable via
   * `npm install --save async`, it can also be used directly in the browser.
   * @module async
   * @see AsyncFunction
   */

  /**
   * A collection of `async` functions for manipulating collections, such as
   * arrays and objects.
   * @module Collections
   */

  /**
   * A collection of `async` functions for controlling the flow through a script.
   * @module ControlFlow
   */

  /**
   * A collection of `async` utility functions.
   * @module Utils
   */


  var index = {
    apply: apply,
    applyEach: applyEach,
    applyEachSeries: applyEachSeries,
    asyncify: asyncify,
    auto: auto,
    autoInject: autoInject,
    cargo: cargo,
    compose: compose,
    concat: concat,
    concatLimit: concatLimit,
    concatSeries: concatSeries,
    constant: constant,
    detect: detect,
    detectLimit: detectLimit,
    detectSeries: detectSeries,
    dir: dir,
    doDuring: doDuring,
    doUntil: doUntil,
    doWhilst: doWhilst,
    during: during,
    each: eachLimit,
    eachLimit: eachLimit$1,
    eachOf: eachOf,
    eachOfLimit: eachOfLimit,
    eachOfSeries: eachOfSeries,
    eachSeries: eachSeries,
    ensureAsync: ensureAsync,
    every: every,
    everyLimit: everyLimit,
    everySeries: everySeries,
    filter: filter,
    filterLimit: filterLimit,
    filterSeries: filterSeries,
    forever: forever,
    groupBy: groupBy,
    groupByLimit: groupByLimit,
    groupBySeries: groupBySeries,
    log: log,
    map: map,
    mapLimit: mapLimit,
    mapSeries: mapSeries,
    mapValues: mapValues,
    mapValuesLimit: mapValuesLimit,
    mapValuesSeries: mapValuesSeries,
    memoize: memoize,
    nextTick: nextTick,
    parallel: parallelLimit,
    parallelLimit: parallelLimit$1,
    priorityQueue: priorityQueue,
    queue: queue$1,
    race: race,
    reduce: reduce,
    reduceRight: reduceRight,
    reflect: reflect,
    reflectAll: reflectAll,
    reject: reject,
    rejectLimit: rejectLimit,
    rejectSeries: rejectSeries,
    retry: retry,
    retryable: retryable,
    seq: seq,
    series: series,
    setImmediate: setImmediate$1,
    some: some,
    someLimit: someLimit,
    someSeries: someSeries,
    sortBy: sortBy,
    timeout: timeout,
    times: times,
    timesLimit: timeLimit,
    timesSeries: timesSeries,
    transform: transform,
    tryEach: tryEach,
    unmemoize: unmemoize,
    until: until,
    waterfall: waterfall,
    whilst: whilst,
    // aliases
    all: every,
    allLimit: everyLimit,
    allSeries: everySeries,
    any: some,
    anyLimit: someLimit,
    anySeries: someSeries,
    find: detect,
    findLimit: detectLimit,
    findSeries: detectSeries,
    forEach: eachLimit,
    forEachSeries: eachSeries,
    forEachLimit: eachLimit$1,
    forEachOf: eachOf,
    forEachOfSeries: eachOfSeries,
    forEachOfLimit: eachOfLimit,
    inject: reduce,
    foldl: reduce,
    foldr: reduceRight,
    select: filter,
    selectLimit: filterLimit,
    selectSeries: filterSeries,
    wrapSync: asyncify
  };
  exports['default'] = index;
  exports.apply = apply;
  exports.applyEach = applyEach;
  exports.applyEachSeries = applyEachSeries;
  exports.asyncify = asyncify;
  exports.auto = auto;
  exports.autoInject = autoInject;
  exports.cargo = cargo;
  exports.compose = compose;
  exports.concat = concat;
  exports.concatLimit = concatLimit;
  exports.concatSeries = concatSeries;
  exports.constant = constant;
  exports.detect = detect;
  exports.detectLimit = detectLimit;
  exports.detectSeries = detectSeries;
  exports.dir = dir;
  exports.doDuring = doDuring;
  exports.doUntil = doUntil;
  exports.doWhilst = doWhilst;
  exports.during = during;
  exports.each = eachLimit;
  exports.eachLimit = eachLimit$1;
  exports.eachOf = eachOf;
  exports.eachOfLimit = eachOfLimit;
  exports.eachOfSeries = eachOfSeries;
  exports.eachSeries = eachSeries;
  exports.ensureAsync = ensureAsync;
  exports.every = every;
  exports.everyLimit = everyLimit;
  exports.everySeries = everySeries;
  exports.filter = filter;
  exports.filterLimit = filterLimit;
  exports.filterSeries = filterSeries;
  exports.forever = forever;
  exports.groupBy = groupBy;
  exports.groupByLimit = groupByLimit;
  exports.groupBySeries = groupBySeries;
  exports.log = log;
  exports.map = map;
  exports.mapLimit = mapLimit;
  exports.mapSeries = mapSeries;
  exports.mapValues = mapValues;
  exports.mapValuesLimit = mapValuesLimit;
  exports.mapValuesSeries = mapValuesSeries;
  exports.memoize = memoize;
  exports.nextTick = nextTick;
  exports.parallel = parallelLimit;
  exports.parallelLimit = parallelLimit$1;
  exports.priorityQueue = priorityQueue;
  exports.queue = queue$1;
  exports.race = race;
  exports.reduce = reduce;
  exports.reduceRight = reduceRight;
  exports.reflect = reflect;
  exports.reflectAll = reflectAll;
  exports.reject = reject;
  exports.rejectLimit = rejectLimit;
  exports.rejectSeries = rejectSeries;
  exports.retry = retry;
  exports.retryable = retryable;
  exports.seq = seq;
  exports.series = series;
  exports.setImmediate = setImmediate$1;
  exports.some = some;
  exports.someLimit = someLimit;
  exports.someSeries = someSeries;
  exports.sortBy = sortBy;
  exports.timeout = timeout;
  exports.times = times;
  exports.timesLimit = timeLimit;
  exports.timesSeries = timesSeries;
  exports.transform = transform;
  exports.tryEach = tryEach;
  exports.unmemoize = unmemoize;
  exports.until = until;
  exports.waterfall = waterfall;
  exports.whilst = whilst;
  exports.all = every;
  exports.allLimit = everyLimit;
  exports.allSeries = everySeries;
  exports.any = some;
  exports.anyLimit = someLimit;
  exports.anySeries = someSeries;
  exports.find = detect;
  exports.findLimit = detectLimit;
  exports.findSeries = detectSeries;
  exports.forEach = eachLimit;
  exports.forEachSeries = eachSeries;
  exports.forEachLimit = eachLimit$1;
  exports.forEachOf = eachOf;
  exports.forEachOfSeries = eachOfSeries;
  exports.forEachOfLimit = eachOfLimit;
  exports.inject = reduce;
  exports.foldl = reduce;
  exports.foldr = reduceRight;
  exports.select = filter;
  exports.selectLimit = filterLimit;
  exports.selectSeries = filterSeries;
  exports.wrapSync = asyncify;
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
});

/***/ }),

/***/ 480:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var reactIs = __webpack_require__(532);
/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */


var REACT_STATICS = {
  childContextTypes: true,
  contextType: true,
  contextTypes: true,
  defaultProps: true,
  displayName: true,
  getDefaultProps: true,
  getDerivedStateFromError: true,
  getDerivedStateFromProps: true,
  mixins: true,
  propTypes: true,
  type: true
};
var KNOWN_STATICS = {
  name: true,
  length: true,
  prototype: true,
  caller: true,
  callee: true,
  arguments: true,
  arity: true
};
var FORWARD_REF_STATICS = {
  '$$typeof': true,
  render: true,
  defaultProps: true,
  displayName: true,
  propTypes: true
};
var MEMO_STATICS = {
  '$$typeof': true,
  compare: true,
  defaultProps: true,
  displayName: true,
  propTypes: true,
  type: true
};
var TYPE_STATICS = {};
TYPE_STATICS[reactIs.ForwardRef] = FORWARD_REF_STATICS;
TYPE_STATICS[reactIs.Memo] = MEMO_STATICS;

function getStatics(component) {
  // React v16.11 and below
  if (reactIs.isMemo(component)) {
    return MEMO_STATICS;
  } // React v16.12 and above


  return TYPE_STATICS[component['$$typeof']] || REACT_STATICS;
}

var defineProperty = Object.defineProperty;
var getOwnPropertyNames = Object.getOwnPropertyNames;
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var getPrototypeOf = Object.getPrototypeOf;
var objectPrototype = Object.prototype;

function hoistNonReactStatics(targetComponent, sourceComponent, blacklist) {
  if (typeof sourceComponent !== 'string') {
    // don't hoist over string (html) components
    if (objectPrototype) {
      var inheritedComponent = getPrototypeOf(sourceComponent);

      if (inheritedComponent && inheritedComponent !== objectPrototype) {
        hoistNonReactStatics(targetComponent, inheritedComponent, blacklist);
      }
    }

    var keys = getOwnPropertyNames(sourceComponent);

    if (getOwnPropertySymbols) {
      keys = keys.concat(getOwnPropertySymbols(sourceComponent));
    }

    var targetStatics = getStatics(targetComponent);
    var sourceStatics = getStatics(sourceComponent);

    for (var i = 0; i < keys.length; ++i) {
      var key = keys[i];

      if (!KNOWN_STATICS[key] && !(blacklist && blacklist[key]) && !(sourceStatics && sourceStatics[key]) && !(targetStatics && targetStatics[key])) {
        var descriptor = getOwnPropertyDescriptor(sourceComponent, key);

        try {
          // Avoid failures from read-only properties
          defineProperty(targetComponent, key, descriptor);
        } catch (e) {}
      }
    }
  }

  return targetComponent;
}

module.exports = hoistNonReactStatics;

/***/ }),

/***/ 103:
/***/ (function(module) {

"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

/* eslint-disable no-unused-vars */

var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
  if (val === null || val === undefined) {
    throw new TypeError('Object.assign cannot be called with null or undefined');
  }

  return Object(val);
}

function shouldUseNative() {
  try {
    if (!Object.assign) {
      return false;
    } // Detect buggy property enumeration order in older V8 versions.
    // https://bugs.chromium.org/p/v8/issues/detail?id=4118


    var test1 = new String('abc'); // eslint-disable-line no-new-wrappers

    test1[5] = 'de';

    if (Object.getOwnPropertyNames(test1)[0] === '5') {
      return false;
    } // https://bugs.chromium.org/p/v8/issues/detail?id=3056


    var test2 = {};

    for (var i = 0; i < 10; i++) {
      test2['_' + String.fromCharCode(i)] = i;
    }

    var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
      return test2[n];
    });

    if (order2.join('') !== '0123456789') {
      return false;
    } // https://bugs.chromium.org/p/v8/issues/detail?id=3056


    var test3 = {};
    'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
      test3[letter] = letter;
    });

    if (Object.keys(Object.assign({}, test3)).join('') !== 'abcdefghijklmnopqrst') {
      return false;
    }

    return true;
  } catch (err) {
    // We don't expect any of the above to throw, but better to be safe.
    return false;
  }
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
  var from;
  var to = toObject(target);
  var symbols;

  for (var s = 1; s < arguments.length; s++) {
    from = Object(arguments[s]);

    for (var key in from) {
      if (hasOwnProperty.call(from, key)) {
        to[key] = from[key];
      }
    }

    if (getOwnPropertySymbols) {
      symbols = getOwnPropertySymbols(from);

      for (var i = 0; i < symbols.length; i++) {
        if (propIsEnumerable.call(from, symbols[i])) {
          to[symbols[i]] = from[symbols[i]];
        }
      }
    }
  }

  return to;
};

/***/ }),

/***/ 428:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


var ReactPropTypesSecret = __webpack_require__(134);

function emptyFunction() {}

function emptyFunctionWithReset() {}

emptyFunctionWithReset.resetWarningCache = emptyFunction;

module.exports = function () {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret) {
      // It is still safe when called from React.
      return;
    }

    var err = new Error('Calling PropTypes validators directly is not supported by the `prop-types` package. ' + 'Use PropTypes.checkPropTypes() to call them. ' + 'Read more at http://fb.me/use-check-prop-types');
    err.name = 'Invariant Violation';
    throw err;
  }

  ;
  shim.isRequired = shim;

  function getShim() {
    return shim;
  }

  ; // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.

  var ReactPropTypes = {
    array: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,
    any: shim,
    arrayOf: getShim,
    element: shim,
    elementType: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim,
    checkPropTypes: emptyFunctionWithReset,
    resetWarningCache: emptyFunction
  };
  ReactPropTypes.PropTypes = ReactPropTypes;
  return ReactPropTypes;
};

/***/ }),

/***/ 526:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
if (false) { var throwOnDirectAccess, ReactIs; } else {
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = __webpack_require__(428)();
}

/***/ }),

/***/ 134:
/***/ (function(module) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';
module.exports = ReactPropTypesSecret;

/***/ }),

/***/ 802:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
var __webpack_unused_export__;
/** @license React v17.0.1
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/*
 Modernizr 3.0.0pre (Custom Build) | MIT
*/


var aa = __webpack_require__(709),
    m = __webpack_require__(103),
    r = __webpack_require__(853);

function y(a) {
  for (var b = "https://reactjs.org/docs/error-decoder.html?invariant=" + a, c = 1; c < arguments.length; c++) b += "&args[]=" + encodeURIComponent(arguments[c]);

  return "Minified React error #" + a + "; visit " + b + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
}

if (!aa) throw Error(y(227));
var ba = new Set(),
    ca = {};

function da(a, b) {
  ea(a, b);
  ea(a + "Capture", b);
}

function ea(a, b) {
  ca[a] = b;

  for (a = 0; a < b.length; a++) ba.add(b[a]);
}

var fa = !("undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement),
    ha = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,
    ia = Object.prototype.hasOwnProperty,
    ja = {},
    ka = {};

function la(a) {
  if (ia.call(ka, a)) return !0;
  if (ia.call(ja, a)) return !1;
  if (ha.test(a)) return ka[a] = !0;
  ja[a] = !0;
  return !1;
}

function ma(a, b, c, d) {
  if (null !== c && 0 === c.type) return !1;

  switch (typeof b) {
    case "function":
    case "symbol":
      return !0;

    case "boolean":
      if (d) return !1;
      if (null !== c) return !c.acceptsBooleans;
      a = a.toLowerCase().slice(0, 5);
      return "data-" !== a && "aria-" !== a;

    default:
      return !1;
  }
}

function na(a, b, c, d) {
  if (null === b || "undefined" === typeof b || ma(a, b, c, d)) return !0;
  if (d) return !1;
  if (null !== c) switch (c.type) {
    case 3:
      return !b;

    case 4:
      return !1 === b;

    case 5:
      return isNaN(b);

    case 6:
      return isNaN(b) || 1 > b;
  }
  return !1;
}

function B(a, b, c, d, e, f, g) {
  this.acceptsBooleans = 2 === b || 3 === b || 4 === b;
  this.attributeName = d;
  this.attributeNamespace = e;
  this.mustUseProperty = c;
  this.propertyName = a;
  this.type = b;
  this.sanitizeURL = f;
  this.removeEmptyString = g;
}

var D = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function (a) {
  D[a] = new B(a, 0, !1, a, null, !1, !1);
});
[["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function (a) {
  var b = a[0];
  D[b] = new B(b, 1, !1, a[1], null, !1, !1);
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function (a) {
  D[a] = new B(a, 2, !1, a.toLowerCase(), null, !1, !1);
});
["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function (a) {
  D[a] = new B(a, 2, !1, a, null, !1, !1);
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function (a) {
  D[a] = new B(a, 3, !1, a.toLowerCase(), null, !1, !1);
});
["checked", "multiple", "muted", "selected"].forEach(function (a) {
  D[a] = new B(a, 3, !0, a, null, !1, !1);
});
["capture", "download"].forEach(function (a) {
  D[a] = new B(a, 4, !1, a, null, !1, !1);
});
["cols", "rows", "size", "span"].forEach(function (a) {
  D[a] = new B(a, 6, !1, a, null, !1, !1);
});
["rowSpan", "start"].forEach(function (a) {
  D[a] = new B(a, 5, !1, a.toLowerCase(), null, !1, !1);
});
var oa = /[\-:]([a-z])/g;

function pa(a) {
  return a[1].toUpperCase();
}

"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function (a) {
  var b = a.replace(oa, pa);
  D[b] = new B(b, 1, !1, a, null, !1, !1);
});
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function (a) {
  var b = a.replace(oa, pa);
  D[b] = new B(b, 1, !1, a, "http://www.w3.org/1999/xlink", !1, !1);
});
["xml:base", "xml:lang", "xml:space"].forEach(function (a) {
  var b = a.replace(oa, pa);
  D[b] = new B(b, 1, !1, a, "http://www.w3.org/XML/1998/namespace", !1, !1);
});
["tabIndex", "crossOrigin"].forEach(function (a) {
  D[a] = new B(a, 1, !1, a.toLowerCase(), null, !1, !1);
});
D.xlinkHref = new B("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1);
["src", "href", "action", "formAction"].forEach(function (a) {
  D[a] = new B(a, 1, !1, a.toLowerCase(), null, !0, !0);
});

function qa(a, b, c, d) {
  var e = D.hasOwnProperty(b) ? D[b] : null;
  var f = null !== e ? 0 === e.type : d ? !1 : !(2 < b.length) || "o" !== b[0] && "O" !== b[0] || "n" !== b[1] && "N" !== b[1] ? !1 : !0;
  f || (na(b, c, e, d) && (c = null), d || null === e ? la(b) && (null === c ? a.removeAttribute(b) : a.setAttribute(b, "" + c)) : e.mustUseProperty ? a[e.propertyName] = null === c ? 3 === e.type ? !1 : "" : c : (b = e.attributeName, d = e.attributeNamespace, null === c ? a.removeAttribute(b) : (e = e.type, c = 3 === e || 4 === e && !0 === c ? "" : "" + c, d ? a.setAttributeNS(d, b, c) : a.setAttribute(b, c))));
}

var ra = aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
    sa = 60103,
    ta = 60106,
    ua = 60107,
    wa = 60108,
    xa = 60114,
    ya = 60109,
    za = 60110,
    Aa = 60112,
    Ba = 60113,
    Ca = 60120,
    Da = 60115,
    Ea = 60116,
    Fa = 60121,
    Ga = 60128,
    Ha = 60129,
    Ia = 60130,
    Ja = 60131;

if ("function" === typeof Symbol && Symbol.for) {
  var E = Symbol.for;
  sa = E("react.element");
  ta = E("react.portal");
  ua = E("react.fragment");
  wa = E("react.strict_mode");
  xa = E("react.profiler");
  ya = E("react.provider");
  za = E("react.context");
  Aa = E("react.forward_ref");
  Ba = E("react.suspense");
  Ca = E("react.suspense_list");
  Da = E("react.memo");
  Ea = E("react.lazy");
  Fa = E("react.block");
  E("react.scope");
  Ga = E("react.opaque.id");
  Ha = E("react.debug_trace_mode");
  Ia = E("react.offscreen");
  Ja = E("react.legacy_hidden");
}

var Ka = "function" === typeof Symbol && Symbol.iterator;

function La(a) {
  if (null === a || "object" !== typeof a) return null;
  a = Ka && a[Ka] || a["@@iterator"];
  return "function" === typeof a ? a : null;
}

var Ma;

function Na(a) {
  if (void 0 === Ma) try {
    throw Error();
  } catch (c) {
    var b = c.stack.trim().match(/\n( *(at )?)/);
    Ma = b && b[1] || "";
  }
  return "\n" + Ma + a;
}

var Oa = !1;

function Pa(a, b) {
  if (!a || Oa) return "";
  Oa = !0;
  var c = Error.prepareStackTrace;
  Error.prepareStackTrace = void 0;

  try {
    if (b) {
      if (b = function () {
        throw Error();
      }, Object.defineProperty(b.prototype, "props", {
        set: function () {
          throw Error();
        }
      }), "object" === typeof Reflect && Reflect.construct) {
        try {
          Reflect.construct(b, []);
        } catch (k) {
          var d = k;
        }

        Reflect.construct(a, [], b);
      } else {
        try {
          b.call();
        } catch (k) {
          d = k;
        }

        a.call(b.prototype);
      }
    } else {
      try {
        throw Error();
      } catch (k) {
        d = k;
      }

      a();
    }
  } catch (k) {
    if (k && d && "string" === typeof k.stack) {
      for (var e = k.stack.split("\n"), f = d.stack.split("\n"), g = e.length - 1, h = f.length - 1; 1 <= g && 0 <= h && e[g] !== f[h];) h--;

      for (; 1 <= g && 0 <= h; g--, h--) if (e[g] !== f[h]) {
        if (1 !== g || 1 !== h) {
          do if (g--, h--, 0 > h || e[g] !== f[h]) return "\n" + e[g].replace(" at new ", " at "); while (1 <= g && 0 <= h);
        }

        break;
      }
    }
  } finally {
    Oa = !1, Error.prepareStackTrace = c;
  }

  return (a = a ? a.displayName || a.name : "") ? Na(a) : "";
}

function Qa(a) {
  switch (a.tag) {
    case 5:
      return Na(a.type);

    case 16:
      return Na("Lazy");

    case 13:
      return Na("Suspense");

    case 19:
      return Na("SuspenseList");

    case 0:
    case 2:
    case 15:
      return a = Pa(a.type, !1), a;

    case 11:
      return a = Pa(a.type.render, !1), a;

    case 22:
      return a = Pa(a.type._render, !1), a;

    case 1:
      return a = Pa(a.type, !0), a;

    default:
      return "";
  }
}

function Ra(a) {
  if (null == a) return null;
  if ("function" === typeof a) return a.displayName || a.name || null;
  if ("string" === typeof a) return a;

  switch (a) {
    case ua:
      return "Fragment";

    case ta:
      return "Portal";

    case xa:
      return "Profiler";

    case wa:
      return "StrictMode";

    case Ba:
      return "Suspense";

    case Ca:
      return "SuspenseList";
  }

  if ("object" === typeof a) switch (a.$$typeof) {
    case za:
      return (a.displayName || "Context") + ".Consumer";

    case ya:
      return (a._context.displayName || "Context") + ".Provider";

    case Aa:
      var b = a.render;
      b = b.displayName || b.name || "";
      return a.displayName || ("" !== b ? "ForwardRef(" + b + ")" : "ForwardRef");

    case Da:
      return Ra(a.type);

    case Fa:
      return Ra(a._render);

    case Ea:
      b = a._payload;
      a = a._init;

      try {
        return Ra(a(b));
      } catch (c) {}

  }
  return null;
}

function Sa(a) {
  switch (typeof a) {
    case "boolean":
    case "number":
    case "object":
    case "string":
    case "undefined":
      return a;

    default:
      return "";
  }
}

function Ta(a) {
  var b = a.type;
  return (a = a.nodeName) && "input" === a.toLowerCase() && ("checkbox" === b || "radio" === b);
}

function Ua(a) {
  var b = Ta(a) ? "checked" : "value",
      c = Object.getOwnPropertyDescriptor(a.constructor.prototype, b),
      d = "" + a[b];

  if (!a.hasOwnProperty(b) && "undefined" !== typeof c && "function" === typeof c.get && "function" === typeof c.set) {
    var e = c.get,
        f = c.set;
    Object.defineProperty(a, b, {
      configurable: !0,
      get: function () {
        return e.call(this);
      },
      set: function (a) {
        d = "" + a;
        f.call(this, a);
      }
    });
    Object.defineProperty(a, b, {
      enumerable: c.enumerable
    });
    return {
      getValue: function () {
        return d;
      },
      setValue: function (a) {
        d = "" + a;
      },
      stopTracking: function () {
        a._valueTracker = null;
        delete a[b];
      }
    };
  }
}

function Va(a) {
  a._valueTracker || (a._valueTracker = Ua(a));
}

function Wa(a) {
  if (!a) return !1;
  var b = a._valueTracker;
  if (!b) return !0;
  var c = b.getValue();
  var d = "";
  a && (d = Ta(a) ? a.checked ? "true" : "false" : a.value);
  a = d;
  return a !== c ? (b.setValue(a), !0) : !1;
}

function Xa(a) {
  a = a || ("undefined" !== typeof document ? document : void 0);
  if ("undefined" === typeof a) return null;

  try {
    return a.activeElement || a.body;
  } catch (b) {
    return a.body;
  }
}

function Ya(a, b) {
  var c = b.checked;
  return m({}, b, {
    defaultChecked: void 0,
    defaultValue: void 0,
    value: void 0,
    checked: null != c ? c : a._wrapperState.initialChecked
  });
}

function Za(a, b) {
  var c = null == b.defaultValue ? "" : b.defaultValue,
      d = null != b.checked ? b.checked : b.defaultChecked;
  c = Sa(null != b.value ? b.value : c);
  a._wrapperState = {
    initialChecked: d,
    initialValue: c,
    controlled: "checkbox" === b.type || "radio" === b.type ? null != b.checked : null != b.value
  };
}

function $a(a, b) {
  b = b.checked;
  null != b && qa(a, "checked", b, !1);
}

function ab(a, b) {
  $a(a, b);
  var c = Sa(b.value),
      d = b.type;
  if (null != c) {
    if ("number" === d) {
      if (0 === c && "" === a.value || a.value != c) a.value = "" + c;
    } else a.value !== "" + c && (a.value = "" + c);
  } else if ("submit" === d || "reset" === d) {
    a.removeAttribute("value");
    return;
  }
  b.hasOwnProperty("value") ? bb(a, b.type, c) : b.hasOwnProperty("defaultValue") && bb(a, b.type, Sa(b.defaultValue));
  null == b.checked && null != b.defaultChecked && (a.defaultChecked = !!b.defaultChecked);
}

function cb(a, b, c) {
  if (b.hasOwnProperty("value") || b.hasOwnProperty("defaultValue")) {
    var d = b.type;
    if (!("submit" !== d && "reset" !== d || void 0 !== b.value && null !== b.value)) return;
    b = "" + a._wrapperState.initialValue;
    c || b === a.value || (a.value = b);
    a.defaultValue = b;
  }

  c = a.name;
  "" !== c && (a.name = "");
  a.defaultChecked = !!a._wrapperState.initialChecked;
  "" !== c && (a.name = c);
}

function bb(a, b, c) {
  if ("number" !== b || Xa(a.ownerDocument) !== a) null == c ? a.defaultValue = "" + a._wrapperState.initialValue : a.defaultValue !== "" + c && (a.defaultValue = "" + c);
}

function db(a) {
  var b = "";
  aa.Children.forEach(a, function (a) {
    null != a && (b += a);
  });
  return b;
}

function eb(a, b) {
  a = m({
    children: void 0
  }, b);
  if (b = db(b.children)) a.children = b;
  return a;
}

function fb(a, b, c, d) {
  a = a.options;

  if (b) {
    b = {};

    for (var e = 0; e < c.length; e++) b["$" + c[e]] = !0;

    for (c = 0; c < a.length; c++) e = b.hasOwnProperty("$" + a[c].value), a[c].selected !== e && (a[c].selected = e), e && d && (a[c].defaultSelected = !0);
  } else {
    c = "" + Sa(c);
    b = null;

    for (e = 0; e < a.length; e++) {
      if (a[e].value === c) {
        a[e].selected = !0;
        d && (a[e].defaultSelected = !0);
        return;
      }

      null !== b || a[e].disabled || (b = a[e]);
    }

    null !== b && (b.selected = !0);
  }
}

function gb(a, b) {
  if (null != b.dangerouslySetInnerHTML) throw Error(y(91));
  return m({}, b, {
    value: void 0,
    defaultValue: void 0,
    children: "" + a._wrapperState.initialValue
  });
}

function hb(a, b) {
  var c = b.value;

  if (null == c) {
    c = b.children;
    b = b.defaultValue;

    if (null != c) {
      if (null != b) throw Error(y(92));

      if (Array.isArray(c)) {
        if (!(1 >= c.length)) throw Error(y(93));
        c = c[0];
      }

      b = c;
    }

    null == b && (b = "");
    c = b;
  }

  a._wrapperState = {
    initialValue: Sa(c)
  };
}

function ib(a, b) {
  var c = Sa(b.value),
      d = Sa(b.defaultValue);
  null != c && (c = "" + c, c !== a.value && (a.value = c), null == b.defaultValue && a.defaultValue !== c && (a.defaultValue = c));
  null != d && (a.defaultValue = "" + d);
}

function jb(a) {
  var b = a.textContent;
  b === a._wrapperState.initialValue && "" !== b && null !== b && (a.value = b);
}

var kb = {
  html: "http://www.w3.org/1999/xhtml",
  mathml: "http://www.w3.org/1998/Math/MathML",
  svg: "http://www.w3.org/2000/svg"
};

function lb(a) {
  switch (a) {
    case "svg":
      return "http://www.w3.org/2000/svg";

    case "math":
      return "http://www.w3.org/1998/Math/MathML";

    default:
      return "http://www.w3.org/1999/xhtml";
  }
}

function mb(a, b) {
  return null == a || "http://www.w3.org/1999/xhtml" === a ? lb(b) : "http://www.w3.org/2000/svg" === a && "foreignObject" === b ? "http://www.w3.org/1999/xhtml" : a;
}

var nb,
    ob = function (a) {
  return "undefined" !== typeof MSApp && MSApp.execUnsafeLocalFunction ? function (b, c, d, e) {
    MSApp.execUnsafeLocalFunction(function () {
      return a(b, c, d, e);
    });
  } : a;
}(function (a, b) {
  if (a.namespaceURI !== kb.svg || "innerHTML" in a) a.innerHTML = b;else {
    nb = nb || document.createElement("div");
    nb.innerHTML = "<svg>" + b.valueOf().toString() + "</svg>";

    for (b = nb.firstChild; a.firstChild;) a.removeChild(a.firstChild);

    for (; b.firstChild;) a.appendChild(b.firstChild);
  }
});

function pb(a, b) {
  if (b) {
    var c = a.firstChild;

    if (c && c === a.lastChild && 3 === c.nodeType) {
      c.nodeValue = b;
      return;
    }
  }

  a.textContent = b;
}

var qb = {
  animationIterationCount: !0,
  borderImageOutset: !0,
  borderImageSlice: !0,
  borderImageWidth: !0,
  boxFlex: !0,
  boxFlexGroup: !0,
  boxOrdinalGroup: !0,
  columnCount: !0,
  columns: !0,
  flex: !0,
  flexGrow: !0,
  flexPositive: !0,
  flexShrink: !0,
  flexNegative: !0,
  flexOrder: !0,
  gridArea: !0,
  gridRow: !0,
  gridRowEnd: !0,
  gridRowSpan: !0,
  gridRowStart: !0,
  gridColumn: !0,
  gridColumnEnd: !0,
  gridColumnSpan: !0,
  gridColumnStart: !0,
  fontWeight: !0,
  lineClamp: !0,
  lineHeight: !0,
  opacity: !0,
  order: !0,
  orphans: !0,
  tabSize: !0,
  widows: !0,
  zIndex: !0,
  zoom: !0,
  fillOpacity: !0,
  floodOpacity: !0,
  stopOpacity: !0,
  strokeDasharray: !0,
  strokeDashoffset: !0,
  strokeMiterlimit: !0,
  strokeOpacity: !0,
  strokeWidth: !0
},
    rb = ["Webkit", "ms", "Moz", "O"];
Object.keys(qb).forEach(function (a) {
  rb.forEach(function (b) {
    b = b + a.charAt(0).toUpperCase() + a.substring(1);
    qb[b] = qb[a];
  });
});

function sb(a, b, c) {
  return null == b || "boolean" === typeof b || "" === b ? "" : c || "number" !== typeof b || 0 === b || qb.hasOwnProperty(a) && qb[a] ? ("" + b).trim() : b + "px";
}

function tb(a, b) {
  a = a.style;

  for (var c in b) if (b.hasOwnProperty(c)) {
    var d = 0 === c.indexOf("--"),
        e = sb(c, b[c], d);
    "float" === c && (c = "cssFloat");
    d ? a.setProperty(c, e) : a[c] = e;
  }
}

var ub = m({
  menuitem: !0
}, {
  area: !0,
  base: !0,
  br: !0,
  col: !0,
  embed: !0,
  hr: !0,
  img: !0,
  input: !0,
  keygen: !0,
  link: !0,
  meta: !0,
  param: !0,
  source: !0,
  track: !0,
  wbr: !0
});

function vb(a, b) {
  if (b) {
    if (ub[a] && (null != b.children || null != b.dangerouslySetInnerHTML)) throw Error(y(137, a));

    if (null != b.dangerouslySetInnerHTML) {
      if (null != b.children) throw Error(y(60));
      if (!("object" === typeof b.dangerouslySetInnerHTML && "__html" in b.dangerouslySetInnerHTML)) throw Error(y(61));
    }

    if (null != b.style && "object" !== typeof b.style) throw Error(y(62));
  }
}

function wb(a, b) {
  if (-1 === a.indexOf("-")) return "string" === typeof b.is;

  switch (a) {
    case "annotation-xml":
    case "color-profile":
    case "font-face":
    case "font-face-src":
    case "font-face-uri":
    case "font-face-format":
    case "font-face-name":
    case "missing-glyph":
      return !1;

    default:
      return !0;
  }
}

function xb(a) {
  a = a.target || a.srcElement || window;
  a.correspondingUseElement && (a = a.correspondingUseElement);
  return 3 === a.nodeType ? a.parentNode : a;
}

var yb = null,
    zb = null,
    Ab = null;

function Bb(a) {
  if (a = Cb(a)) {
    if ("function" !== typeof yb) throw Error(y(280));
    var b = a.stateNode;
    b && (b = Db(b), yb(a.stateNode, a.type, b));
  }
}

function Eb(a) {
  zb ? Ab ? Ab.push(a) : Ab = [a] : zb = a;
}

function Fb() {
  if (zb) {
    var a = zb,
        b = Ab;
    Ab = zb = null;
    Bb(a);
    if (b) for (a = 0; a < b.length; a++) Bb(b[a]);
  }
}

function Gb(a, b) {
  return a(b);
}

function Hb(a, b, c, d, e) {
  return a(b, c, d, e);
}

function Ib() {}

var Jb = Gb,
    Kb = !1,
    Lb = !1;

function Mb() {
  if (null !== zb || null !== Ab) Ib(), Fb();
}

function Nb(a, b, c) {
  if (Lb) return a(b, c);
  Lb = !0;

  try {
    return Jb(a, b, c);
  } finally {
    Lb = !1, Mb();
  }
}

function Ob(a, b) {
  var c = a.stateNode;
  if (null === c) return null;
  var d = Db(c);
  if (null === d) return null;
  c = d[b];

  a: switch (b) {
    case "onClick":
    case "onClickCapture":
    case "onDoubleClick":
    case "onDoubleClickCapture":
    case "onMouseDown":
    case "onMouseDownCapture":
    case "onMouseMove":
    case "onMouseMoveCapture":
    case "onMouseUp":
    case "onMouseUpCapture":
    case "onMouseEnter":
      (d = !d.disabled) || (a = a.type, d = !("button" === a || "input" === a || "select" === a || "textarea" === a));
      a = !d;
      break a;

    default:
      a = !1;
  }

  if (a) return null;
  if (c && "function" !== typeof c) throw Error(y(231, b, typeof c));
  return c;
}

var Pb = !1;
if (fa) try {
  var Qb = {};
  Object.defineProperty(Qb, "passive", {
    get: function () {
      Pb = !0;
    }
  });
  window.addEventListener("test", Qb, Qb);
  window.removeEventListener("test", Qb, Qb);
} catch (a) {
  Pb = !1;
}

function Rb(a, b, c, d, e, f, g, h, k) {
  var l = Array.prototype.slice.call(arguments, 3);

  try {
    b.apply(c, l);
  } catch (n) {
    this.onError(n);
  }
}

var Sb = !1,
    Tb = null,
    Ub = !1,
    Vb = null,
    Wb = {
  onError: function (a) {
    Sb = !0;
    Tb = a;
  }
};

function Xb(a, b, c, d, e, f, g, h, k) {
  Sb = !1;
  Tb = null;
  Rb.apply(Wb, arguments);
}

function Yb(a, b, c, d, e, f, g, h, k) {
  Xb.apply(this, arguments);

  if (Sb) {
    if (Sb) {
      var l = Tb;
      Sb = !1;
      Tb = null;
    } else throw Error(y(198));

    Ub || (Ub = !0, Vb = l);
  }
}

function Zb(a) {
  var b = a,
      c = a;
  if (a.alternate) for (; b.return;) b = b.return;else {
    a = b;

    do b = a, 0 !== (b.flags & 1026) && (c = b.return), a = b.return; while (a);
  }
  return 3 === b.tag ? c : null;
}

function $b(a) {
  if (13 === a.tag) {
    var b = a.memoizedState;
    null === b && (a = a.alternate, null !== a && (b = a.memoizedState));
    if (null !== b) return b.dehydrated;
  }

  return null;
}

function ac(a) {
  if (Zb(a) !== a) throw Error(y(188));
}

function bc(a) {
  var b = a.alternate;

  if (!b) {
    b = Zb(a);
    if (null === b) throw Error(y(188));
    return b !== a ? null : a;
  }

  for (var c = a, d = b;;) {
    var e = c.return;
    if (null === e) break;
    var f = e.alternate;

    if (null === f) {
      d = e.return;

      if (null !== d) {
        c = d;
        continue;
      }

      break;
    }

    if (e.child === f.child) {
      for (f = e.child; f;) {
        if (f === c) return ac(e), a;
        if (f === d) return ac(e), b;
        f = f.sibling;
      }

      throw Error(y(188));
    }

    if (c.return !== d.return) c = e, d = f;else {
      for (var g = !1, h = e.child; h;) {
        if (h === c) {
          g = !0;
          c = e;
          d = f;
          break;
        }

        if (h === d) {
          g = !0;
          d = e;
          c = f;
          break;
        }

        h = h.sibling;
      }

      if (!g) {
        for (h = f.child; h;) {
          if (h === c) {
            g = !0;
            c = f;
            d = e;
            break;
          }

          if (h === d) {
            g = !0;
            d = f;
            c = e;
            break;
          }

          h = h.sibling;
        }

        if (!g) throw Error(y(189));
      }
    }
    if (c.alternate !== d) throw Error(y(190));
  }

  if (3 !== c.tag) throw Error(y(188));
  return c.stateNode.current === c ? a : b;
}

function cc(a) {
  a = bc(a);
  if (!a) return null;

  for (var b = a;;) {
    if (5 === b.tag || 6 === b.tag) return b;
    if (b.child) b.child.return = b, b = b.child;else {
      if (b === a) break;

      for (; !b.sibling;) {
        if (!b.return || b.return === a) return null;
        b = b.return;
      }

      b.sibling.return = b.return;
      b = b.sibling;
    }
  }

  return null;
}

function dc(a, b) {
  for (var c = a.alternate; null !== b;) {
    if (b === a || b === c) return !0;
    b = b.return;
  }

  return !1;
}

var ec,
    fc,
    gc,
    hc,
    ic = !1,
    jc = [],
    kc = null,
    lc = null,
    mc = null,
    nc = new Map(),
    oc = new Map(),
    pc = [],
    qc = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");

function rc(a, b, c, d, e) {
  return {
    blockedOn: a,
    domEventName: b,
    eventSystemFlags: c | 16,
    nativeEvent: e,
    targetContainers: [d]
  };
}

function sc(a, b) {
  switch (a) {
    case "focusin":
    case "focusout":
      kc = null;
      break;

    case "dragenter":
    case "dragleave":
      lc = null;
      break;

    case "mouseover":
    case "mouseout":
      mc = null;
      break;

    case "pointerover":
    case "pointerout":
      nc.delete(b.pointerId);
      break;

    case "gotpointercapture":
    case "lostpointercapture":
      oc.delete(b.pointerId);
  }
}

function tc(a, b, c, d, e, f) {
  if (null === a || a.nativeEvent !== f) return a = rc(b, c, d, e, f), null !== b && (b = Cb(b), null !== b && fc(b)), a;
  a.eventSystemFlags |= d;
  b = a.targetContainers;
  null !== e && -1 === b.indexOf(e) && b.push(e);
  return a;
}

function uc(a, b, c, d, e) {
  switch (b) {
    case "focusin":
      return kc = tc(kc, a, b, c, d, e), !0;

    case "dragenter":
      return lc = tc(lc, a, b, c, d, e), !0;

    case "mouseover":
      return mc = tc(mc, a, b, c, d, e), !0;

    case "pointerover":
      var f = e.pointerId;
      nc.set(f, tc(nc.get(f) || null, a, b, c, d, e));
      return !0;

    case "gotpointercapture":
      return f = e.pointerId, oc.set(f, tc(oc.get(f) || null, a, b, c, d, e)), !0;
  }

  return !1;
}

function vc(a) {
  var b = wc(a.target);

  if (null !== b) {
    var c = Zb(b);
    if (null !== c) if (b = c.tag, 13 === b) {
      if (b = $b(c), null !== b) {
        a.blockedOn = b;
        hc(a.lanePriority, function () {
          r.unstable_runWithPriority(a.priority, function () {
            gc(c);
          });
        });
        return;
      }
    } else if (3 === b && c.stateNode.hydrate) {
      a.blockedOn = 3 === c.tag ? c.stateNode.containerInfo : null;
      return;
    }
  }

  a.blockedOn = null;
}

function xc(a) {
  if (null !== a.blockedOn) return !1;

  for (var b = a.targetContainers; 0 < b.length;) {
    var c = yc(a.domEventName, a.eventSystemFlags, b[0], a.nativeEvent);
    if (null !== c) return b = Cb(c), null !== b && fc(b), a.blockedOn = c, !1;
    b.shift();
  }

  return !0;
}

function zc(a, b, c) {
  xc(a) && c.delete(b);
}

function Ac() {
  for (ic = !1; 0 < jc.length;) {
    var a = jc[0];

    if (null !== a.blockedOn) {
      a = Cb(a.blockedOn);
      null !== a && ec(a);
      break;
    }

    for (var b = a.targetContainers; 0 < b.length;) {
      var c = yc(a.domEventName, a.eventSystemFlags, b[0], a.nativeEvent);

      if (null !== c) {
        a.blockedOn = c;
        break;
      }

      b.shift();
    }

    null === a.blockedOn && jc.shift();
  }

  null !== kc && xc(kc) && (kc = null);
  null !== lc && xc(lc) && (lc = null);
  null !== mc && xc(mc) && (mc = null);
  nc.forEach(zc);
  oc.forEach(zc);
}

function Bc(a, b) {
  a.blockedOn === b && (a.blockedOn = null, ic || (ic = !0, r.unstable_scheduleCallback(r.unstable_NormalPriority, Ac)));
}

function Cc(a) {
  function b(b) {
    return Bc(b, a);
  }

  if (0 < jc.length) {
    Bc(jc[0], a);

    for (var c = 1; c < jc.length; c++) {
      var d = jc[c];
      d.blockedOn === a && (d.blockedOn = null);
    }
  }

  null !== kc && Bc(kc, a);
  null !== lc && Bc(lc, a);
  null !== mc && Bc(mc, a);
  nc.forEach(b);
  oc.forEach(b);

  for (c = 0; c < pc.length; c++) d = pc[c], d.blockedOn === a && (d.blockedOn = null);

  for (; 0 < pc.length && (c = pc[0], null === c.blockedOn);) vc(c), null === c.blockedOn && pc.shift();
}

function Dc(a, b) {
  var c = {};
  c[a.toLowerCase()] = b.toLowerCase();
  c["Webkit" + a] = "webkit" + b;
  c["Moz" + a] = "moz" + b;
  return c;
}

var Ec = {
  animationend: Dc("Animation", "AnimationEnd"),
  animationiteration: Dc("Animation", "AnimationIteration"),
  animationstart: Dc("Animation", "AnimationStart"),
  transitionend: Dc("Transition", "TransitionEnd")
},
    Fc = {},
    Gc = {};
fa && (Gc = document.createElement("div").style, "AnimationEvent" in window || (delete Ec.animationend.animation, delete Ec.animationiteration.animation, delete Ec.animationstart.animation), "TransitionEvent" in window || delete Ec.transitionend.transition);

function Hc(a) {
  if (Fc[a]) return Fc[a];
  if (!Ec[a]) return a;
  var b = Ec[a],
      c;

  for (c in b) if (b.hasOwnProperty(c) && c in Gc) return Fc[a] = b[c];

  return a;
}

var Ic = Hc("animationend"),
    Jc = Hc("animationiteration"),
    Kc = Hc("animationstart"),
    Lc = Hc("transitionend"),
    Mc = new Map(),
    Nc = new Map(),
    Oc = ["abort", "abort", Ic, "animationEnd", Jc, "animationIteration", Kc, "animationStart", "canplay", "canPlay", "canplaythrough", "canPlayThrough", "durationchange", "durationChange", "emptied", "emptied", "encrypted", "encrypted", "ended", "ended", "error", "error", "gotpointercapture", "gotPointerCapture", "load", "load", "loadeddata", "loadedData", "loadedmetadata", "loadedMetadata", "loadstart", "loadStart", "lostpointercapture", "lostPointerCapture", "playing", "playing", "progress", "progress", "seeking", "seeking", "stalled", "stalled", "suspend", "suspend", "timeupdate", "timeUpdate", Lc, "transitionEnd", "waiting", "waiting"];

function Pc(a, b) {
  for (var c = 0; c < a.length; c += 2) {
    var d = a[c],
        e = a[c + 1];
    e = "on" + (e[0].toUpperCase() + e.slice(1));
    Nc.set(d, b);
    Mc.set(d, e);
    da(e, [d]);
  }
}

var Qc = r.unstable_now;
Qc();
var F = 8;

function Rc(a) {
  if (0 !== (1 & a)) return F = 15, 1;
  if (0 !== (2 & a)) return F = 14, 2;
  if (0 !== (4 & a)) return F = 13, 4;
  var b = 24 & a;
  if (0 !== b) return F = 12, b;
  if (0 !== (a & 32)) return F = 11, 32;
  b = 192 & a;
  if (0 !== b) return F = 10, b;
  if (0 !== (a & 256)) return F = 9, 256;
  b = 3584 & a;
  if (0 !== b) return F = 8, b;
  if (0 !== (a & 4096)) return F = 7, 4096;
  b = 4186112 & a;
  if (0 !== b) return F = 6, b;
  b = 62914560 & a;
  if (0 !== b) return F = 5, b;
  if (a & 67108864) return F = 4, 67108864;
  if (0 !== (a & 134217728)) return F = 3, 134217728;
  b = 805306368 & a;
  if (0 !== b) return F = 2, b;
  if (0 !== (1073741824 & a)) return F = 1, 1073741824;
  F = 8;
  return a;
}

function Sc(a) {
  switch (a) {
    case 99:
      return 15;

    case 98:
      return 10;

    case 97:
    case 96:
      return 8;

    case 95:
      return 2;

    default:
      return 0;
  }
}

function Tc(a) {
  switch (a) {
    case 15:
    case 14:
      return 99;

    case 13:
    case 12:
    case 11:
    case 10:
      return 98;

    case 9:
    case 8:
    case 7:
    case 6:
    case 4:
    case 5:
      return 97;

    case 3:
    case 2:
    case 1:
      return 95;

    case 0:
      return 90;

    default:
      throw Error(y(358, a));
  }
}

function Uc(a, b) {
  var c = a.pendingLanes;
  if (0 === c) return F = 0;
  var d = 0,
      e = 0,
      f = a.expiredLanes,
      g = a.suspendedLanes,
      h = a.pingedLanes;
  if (0 !== f) d = f, e = F = 15;else if (f = c & 134217727, 0 !== f) {
    var k = f & ~g;
    0 !== k ? (d = Rc(k), e = F) : (h &= f, 0 !== h && (d = Rc(h), e = F));
  } else f = c & ~g, 0 !== f ? (d = Rc(f), e = F) : 0 !== h && (d = Rc(h), e = F);
  if (0 === d) return 0;
  d = 31 - Vc(d);
  d = c & ((0 > d ? 0 : 1 << d) << 1) - 1;

  if (0 !== b && b !== d && 0 === (b & g)) {
    Rc(b);
    if (e <= F) return b;
    F = e;
  }

  b = a.entangledLanes;
  if (0 !== b) for (a = a.entanglements, b &= d; 0 < b;) c = 31 - Vc(b), e = 1 << c, d |= a[c], b &= ~e;
  return d;
}

function Wc(a) {
  a = a.pendingLanes & -1073741825;
  return 0 !== a ? a : a & 1073741824 ? 1073741824 : 0;
}

function Xc(a, b) {
  switch (a) {
    case 15:
      return 1;

    case 14:
      return 2;

    case 12:
      return a = Yc(24 & ~b), 0 === a ? Xc(10, b) : a;

    case 10:
      return a = Yc(192 & ~b), 0 === a ? Xc(8, b) : a;

    case 8:
      return a = Yc(3584 & ~b), 0 === a && (a = Yc(4186112 & ~b), 0 === a && (a = 512)), a;

    case 2:
      return b = Yc(805306368 & ~b), 0 === b && (b = 268435456), b;
  }

  throw Error(y(358, a));
}

function Yc(a) {
  return a & -a;
}

function Zc(a) {
  for (var b = [], c = 0; 31 > c; c++) b.push(a);

  return b;
}

function $c(a, b, c) {
  a.pendingLanes |= b;
  var d = b - 1;
  a.suspendedLanes &= d;
  a.pingedLanes &= d;
  a = a.eventTimes;
  b = 31 - Vc(b);
  a[b] = c;
}

var Vc = Math.clz32 ? Math.clz32 : ad,
    bd = Math.log,
    cd = Math.LN2;

function ad(a) {
  return 0 === a ? 32 : 31 - (bd(a) / cd | 0) | 0;
}

var dd = r.unstable_UserBlockingPriority,
    ed = r.unstable_runWithPriority,
    fd = !0;

function gd(a, b, c, d) {
  Kb || Ib();
  var e = hd,
      f = Kb;
  Kb = !0;

  try {
    Hb(e, a, b, c, d);
  } finally {
    (Kb = f) || Mb();
  }
}

function id(a, b, c, d) {
  ed(dd, hd.bind(null, a, b, c, d));
}

function hd(a, b, c, d) {
  if (fd) {
    var e;
    if ((e = 0 === (b & 4)) && 0 < jc.length && -1 < qc.indexOf(a)) a = rc(null, a, b, c, d), jc.push(a);else {
      var f = yc(a, b, c, d);
      if (null === f) e && sc(a, d);else {
        if (e) {
          if (-1 < qc.indexOf(a)) {
            a = rc(f, a, b, c, d);
            jc.push(a);
            return;
          }

          if (uc(f, a, b, c, d)) return;
          sc(a, d);
        }

        jd(a, b, d, null, c);
      }
    }
  }
}

function yc(a, b, c, d) {
  var e = xb(d);
  e = wc(e);

  if (null !== e) {
    var f = Zb(e);
    if (null === f) e = null;else {
      var g = f.tag;

      if (13 === g) {
        e = $b(f);
        if (null !== e) return e;
        e = null;
      } else if (3 === g) {
        if (f.stateNode.hydrate) return 3 === f.tag ? f.stateNode.containerInfo : null;
        e = null;
      } else f !== e && (e = null);
    }
  }

  jd(a, b, d, e, c);
  return null;
}

var kd = null,
    ld = null,
    md = null;

function nd() {
  if (md) return md;
  var a,
      b = ld,
      c = b.length,
      d,
      e = "value" in kd ? kd.value : kd.textContent,
      f = e.length;

  for (a = 0; a < c && b[a] === e[a]; a++);

  var g = c - a;

  for (d = 1; d <= g && b[c - d] === e[f - d]; d++);

  return md = e.slice(a, 1 < d ? 1 - d : void 0);
}

function od(a) {
  var b = a.keyCode;
  "charCode" in a ? (a = a.charCode, 0 === a && 13 === b && (a = 13)) : a = b;
  10 === a && (a = 13);
  return 32 <= a || 13 === a ? a : 0;
}

function pd() {
  return !0;
}

function qd() {
  return !1;
}

function rd(a) {
  function b(b, d, e, f, g) {
    this._reactName = b;
    this._targetInst = e;
    this.type = d;
    this.nativeEvent = f;
    this.target = g;
    this.currentTarget = null;

    for (var c in a) a.hasOwnProperty(c) && (b = a[c], this[c] = b ? b(f) : f[c]);

    this.isDefaultPrevented = (null != f.defaultPrevented ? f.defaultPrevented : !1 === f.returnValue) ? pd : qd;
    this.isPropagationStopped = qd;
    return this;
  }

  m(b.prototype, {
    preventDefault: function () {
      this.defaultPrevented = !0;
      var a = this.nativeEvent;
      a && (a.preventDefault ? a.preventDefault() : "unknown" !== typeof a.returnValue && (a.returnValue = !1), this.isDefaultPrevented = pd);
    },
    stopPropagation: function () {
      var a = this.nativeEvent;
      a && (a.stopPropagation ? a.stopPropagation() : "unknown" !== typeof a.cancelBubble && (a.cancelBubble = !0), this.isPropagationStopped = pd);
    },
    persist: function () {},
    isPersistent: pd
  });
  return b;
}

var sd = {
  eventPhase: 0,
  bubbles: 0,
  cancelable: 0,
  timeStamp: function (a) {
    return a.timeStamp || Date.now();
  },
  defaultPrevented: 0,
  isTrusted: 0
},
    td = rd(sd),
    ud = m({}, sd, {
  view: 0,
  detail: 0
}),
    vd = rd(ud),
    wd,
    xd,
    yd,
    Ad = m({}, ud, {
  screenX: 0,
  screenY: 0,
  clientX: 0,
  clientY: 0,
  pageX: 0,
  pageY: 0,
  ctrlKey: 0,
  shiftKey: 0,
  altKey: 0,
  metaKey: 0,
  getModifierState: zd,
  button: 0,
  buttons: 0,
  relatedTarget: function (a) {
    return void 0 === a.relatedTarget ? a.fromElement === a.srcElement ? a.toElement : a.fromElement : a.relatedTarget;
  },
  movementX: function (a) {
    if ("movementX" in a) return a.movementX;
    a !== yd && (yd && "mousemove" === a.type ? (wd = a.screenX - yd.screenX, xd = a.screenY - yd.screenY) : xd = wd = 0, yd = a);
    return wd;
  },
  movementY: function (a) {
    return "movementY" in a ? a.movementY : xd;
  }
}),
    Bd = rd(Ad),
    Cd = m({}, Ad, {
  dataTransfer: 0
}),
    Dd = rd(Cd),
    Ed = m({}, ud, {
  relatedTarget: 0
}),
    Fd = rd(Ed),
    Gd = m({}, sd, {
  animationName: 0,
  elapsedTime: 0,
  pseudoElement: 0
}),
    Hd = rd(Gd),
    Id = m({}, sd, {
  clipboardData: function (a) {
    return "clipboardData" in a ? a.clipboardData : window.clipboardData;
  }
}),
    Jd = rd(Id),
    Kd = m({}, sd, {
  data: 0
}),
    Ld = rd(Kd),
    Md = {
  Esc: "Escape",
  Spacebar: " ",
  Left: "ArrowLeft",
  Up: "ArrowUp",
  Right: "ArrowRight",
  Down: "ArrowDown",
  Del: "Delete",
  Win: "OS",
  Menu: "ContextMenu",
  Apps: "ContextMenu",
  Scroll: "ScrollLock",
  MozPrintableKey: "Unidentified"
},
    Nd = {
  8: "Backspace",
  9: "Tab",
  12: "Clear",
  13: "Enter",
  16: "Shift",
  17: "Control",
  18: "Alt",
  19: "Pause",
  20: "CapsLock",
  27: "Escape",
  32: " ",
  33: "PageUp",
  34: "PageDown",
  35: "End",
  36: "Home",
  37: "ArrowLeft",
  38: "ArrowUp",
  39: "ArrowRight",
  40: "ArrowDown",
  45: "Insert",
  46: "Delete",
  112: "F1",
  113: "F2",
  114: "F3",
  115: "F4",
  116: "F5",
  117: "F6",
  118: "F7",
  119: "F8",
  120: "F9",
  121: "F10",
  122: "F11",
  123: "F12",
  144: "NumLock",
  145: "ScrollLock",
  224: "Meta"
},
    Od = {
  Alt: "altKey",
  Control: "ctrlKey",
  Meta: "metaKey",
  Shift: "shiftKey"
};

function Pd(a) {
  var b = this.nativeEvent;
  return b.getModifierState ? b.getModifierState(a) : (a = Od[a]) ? !!b[a] : !1;
}

function zd() {
  return Pd;
}

var Qd = m({}, ud, {
  key: function (a) {
    if (a.key) {
      var b = Md[a.key] || a.key;
      if ("Unidentified" !== b) return b;
    }

    return "keypress" === a.type ? (a = od(a), 13 === a ? "Enter" : String.fromCharCode(a)) : "keydown" === a.type || "keyup" === a.type ? Nd[a.keyCode] || "Unidentified" : "";
  },
  code: 0,
  location: 0,
  ctrlKey: 0,
  shiftKey: 0,
  altKey: 0,
  metaKey: 0,
  repeat: 0,
  locale: 0,
  getModifierState: zd,
  charCode: function (a) {
    return "keypress" === a.type ? od(a) : 0;
  },
  keyCode: function (a) {
    return "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
  },
  which: function (a) {
    return "keypress" === a.type ? od(a) : "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
  }
}),
    Rd = rd(Qd),
    Sd = m({}, Ad, {
  pointerId: 0,
  width: 0,
  height: 0,
  pressure: 0,
  tangentialPressure: 0,
  tiltX: 0,
  tiltY: 0,
  twist: 0,
  pointerType: 0,
  isPrimary: 0
}),
    Td = rd(Sd),
    Ud = m({}, ud, {
  touches: 0,
  targetTouches: 0,
  changedTouches: 0,
  altKey: 0,
  metaKey: 0,
  ctrlKey: 0,
  shiftKey: 0,
  getModifierState: zd
}),
    Vd = rd(Ud),
    Wd = m({}, sd, {
  propertyName: 0,
  elapsedTime: 0,
  pseudoElement: 0
}),
    Xd = rd(Wd),
    Yd = m({}, Ad, {
  deltaX: function (a) {
    return "deltaX" in a ? a.deltaX : "wheelDeltaX" in a ? -a.wheelDeltaX : 0;
  },
  deltaY: function (a) {
    return "deltaY" in a ? a.deltaY : "wheelDeltaY" in a ? -a.wheelDeltaY : "wheelDelta" in a ? -a.wheelDelta : 0;
  },
  deltaZ: 0,
  deltaMode: 0
}),
    Zd = rd(Yd),
    $d = [9, 13, 27, 32],
    ae = fa && "CompositionEvent" in window,
    be = null;
fa && "documentMode" in document && (be = document.documentMode);
var ce = fa && "TextEvent" in window && !be,
    de = fa && (!ae || be && 8 < be && 11 >= be),
    ee = String.fromCharCode(32),
    fe = !1;

function ge(a, b) {
  switch (a) {
    case "keyup":
      return -1 !== $d.indexOf(b.keyCode);

    case "keydown":
      return 229 !== b.keyCode;

    case "keypress":
    case "mousedown":
    case "focusout":
      return !0;

    default:
      return !1;
  }
}

function he(a) {
  a = a.detail;
  return "object" === typeof a && "data" in a ? a.data : null;
}

var ie = !1;

function je(a, b) {
  switch (a) {
    case "compositionend":
      return he(b);

    case "keypress":
      if (32 !== b.which) return null;
      fe = !0;
      return ee;

    case "textInput":
      return a = b.data, a === ee && fe ? null : a;

    default:
      return null;
  }
}

function ke(a, b) {
  if (ie) return "compositionend" === a || !ae && ge(a, b) ? (a = nd(), md = ld = kd = null, ie = !1, a) : null;

  switch (a) {
    case "paste":
      return null;

    case "keypress":
      if (!(b.ctrlKey || b.altKey || b.metaKey) || b.ctrlKey && b.altKey) {
        if (b.char && 1 < b.char.length) return b.char;
        if (b.which) return String.fromCharCode(b.which);
      }

      return null;

    case "compositionend":
      return de && "ko" !== b.locale ? null : b.data;

    default:
      return null;
  }
}

var le = {
  color: !0,
  date: !0,
  datetime: !0,
  "datetime-local": !0,
  email: !0,
  month: !0,
  number: !0,
  password: !0,
  range: !0,
  search: !0,
  tel: !0,
  text: !0,
  time: !0,
  url: !0,
  week: !0
};

function me(a) {
  var b = a && a.nodeName && a.nodeName.toLowerCase();
  return "input" === b ? !!le[a.type] : "textarea" === b ? !0 : !1;
}

function ne(a, b, c, d) {
  Eb(d);
  b = oe(b, "onChange");
  0 < b.length && (c = new td("onChange", "change", null, c, d), a.push({
    event: c,
    listeners: b
  }));
}

var pe = null,
    qe = null;

function re(a) {
  se(a, 0);
}

function te(a) {
  var b = ue(a);
  if (Wa(b)) return a;
}

function ve(a, b) {
  if ("change" === a) return b;
}

var we = !1;

if (fa) {
  var xe;

  if (fa) {
    var ye = ("oninput" in document);

    if (!ye) {
      var ze = document.createElement("div");
      ze.setAttribute("oninput", "return;");
      ye = "function" === typeof ze.oninput;
    }

    xe = ye;
  } else xe = !1;

  we = xe && (!document.documentMode || 9 < document.documentMode);
}

function Ae() {
  pe && (pe.detachEvent("onpropertychange", Be), qe = pe = null);
}

function Be(a) {
  if ("value" === a.propertyName && te(qe)) {
    var b = [];
    ne(b, qe, a, xb(a));
    a = re;
    if (Kb) a(b);else {
      Kb = !0;

      try {
        Gb(a, b);
      } finally {
        Kb = !1, Mb();
      }
    }
  }
}

function Ce(a, b, c) {
  "focusin" === a ? (Ae(), pe = b, qe = c, pe.attachEvent("onpropertychange", Be)) : "focusout" === a && Ae();
}

function De(a) {
  if ("selectionchange" === a || "keyup" === a || "keydown" === a) return te(qe);
}

function Ee(a, b) {
  if ("click" === a) return te(b);
}

function Fe(a, b) {
  if ("input" === a || "change" === a) return te(b);
}

function Ge(a, b) {
  return a === b && (0 !== a || 1 / a === 1 / b) || a !== a && b !== b;
}

var He = "function" === typeof Object.is ? Object.is : Ge,
    Ie = Object.prototype.hasOwnProperty;

function Je(a, b) {
  if (He(a, b)) return !0;
  if ("object" !== typeof a || null === a || "object" !== typeof b || null === b) return !1;
  var c = Object.keys(a),
      d = Object.keys(b);
  if (c.length !== d.length) return !1;

  for (d = 0; d < c.length; d++) if (!Ie.call(b, c[d]) || !He(a[c[d]], b[c[d]])) return !1;

  return !0;
}

function Ke(a) {
  for (; a && a.firstChild;) a = a.firstChild;

  return a;
}

function Le(a, b) {
  var c = Ke(a);
  a = 0;

  for (var d; c;) {
    if (3 === c.nodeType) {
      d = a + c.textContent.length;
      if (a <= b && d >= b) return {
        node: c,
        offset: b - a
      };
      a = d;
    }

    a: {
      for (; c;) {
        if (c.nextSibling) {
          c = c.nextSibling;
          break a;
        }

        c = c.parentNode;
      }

      c = void 0;
    }

    c = Ke(c);
  }
}

function Me(a, b) {
  return a && b ? a === b ? !0 : a && 3 === a.nodeType ? !1 : b && 3 === b.nodeType ? Me(a, b.parentNode) : "contains" in a ? a.contains(b) : a.compareDocumentPosition ? !!(a.compareDocumentPosition(b) & 16) : !1 : !1;
}

function Ne() {
  for (var a = window, b = Xa(); b instanceof a.HTMLIFrameElement;) {
    try {
      var c = "string" === typeof b.contentWindow.location.href;
    } catch (d) {
      c = !1;
    }

    if (c) a = b.contentWindow;else break;
    b = Xa(a.document);
  }

  return b;
}

function Oe(a) {
  var b = a && a.nodeName && a.nodeName.toLowerCase();
  return b && ("input" === b && ("text" === a.type || "search" === a.type || "tel" === a.type || "url" === a.type || "password" === a.type) || "textarea" === b || "true" === a.contentEditable);
}

var Pe = fa && "documentMode" in document && 11 >= document.documentMode,
    Qe = null,
    Re = null,
    Se = null,
    Te = !1;

function Ue(a, b, c) {
  var d = c.window === c ? c.document : 9 === c.nodeType ? c : c.ownerDocument;
  Te || null == Qe || Qe !== Xa(d) || (d = Qe, "selectionStart" in d && Oe(d) ? d = {
    start: d.selectionStart,
    end: d.selectionEnd
  } : (d = (d.ownerDocument && d.ownerDocument.defaultView || window).getSelection(), d = {
    anchorNode: d.anchorNode,
    anchorOffset: d.anchorOffset,
    focusNode: d.focusNode,
    focusOffset: d.focusOffset
  }), Se && Je(Se, d) || (Se = d, d = oe(Re, "onSelect"), 0 < d.length && (b = new td("onSelect", "select", null, b, c), a.push({
    event: b,
    listeners: d
  }), b.target = Qe)));
}

Pc("cancel cancel click click close close contextmenu contextMenu copy copy cut cut auxclick auxClick dblclick doubleClick dragend dragEnd dragstart dragStart drop drop focusin focus focusout blur input input invalid invalid keydown keyDown keypress keyPress keyup keyUp mousedown mouseDown mouseup mouseUp paste paste pause pause play play pointercancel pointerCancel pointerdown pointerDown pointerup pointerUp ratechange rateChange reset reset seeked seeked submit submit touchcancel touchCancel touchend touchEnd touchstart touchStart volumechange volumeChange".split(" "), 0);
Pc("drag drag dragenter dragEnter dragexit dragExit dragleave dragLeave dragover dragOver mousemove mouseMove mouseout mouseOut mouseover mouseOver pointermove pointerMove pointerout pointerOut pointerover pointerOver scroll scroll toggle toggle touchmove touchMove wheel wheel".split(" "), 1);
Pc(Oc, 2);

for (var Ve = "change selectionchange textInput compositionstart compositionend compositionupdate".split(" "), We = 0; We < Ve.length; We++) Nc.set(Ve[We], 0);

ea("onMouseEnter", ["mouseout", "mouseover"]);
ea("onMouseLeave", ["mouseout", "mouseover"]);
ea("onPointerEnter", ["pointerout", "pointerover"]);
ea("onPointerLeave", ["pointerout", "pointerover"]);
da("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
da("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
da("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
da("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
da("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
da("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
var Xe = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),
    Ye = new Set("cancel close invalid load scroll toggle".split(" ").concat(Xe));

function Ze(a, b, c) {
  var d = a.type || "unknown-event";
  a.currentTarget = c;
  Yb(d, b, void 0, a);
  a.currentTarget = null;
}

function se(a, b) {
  b = 0 !== (b & 4);

  for (var c = 0; c < a.length; c++) {
    var d = a[c],
        e = d.event;
    d = d.listeners;

    a: {
      var f = void 0;
      if (b) for (var g = d.length - 1; 0 <= g; g--) {
        var h = d[g],
            k = h.instance,
            l = h.currentTarget;
        h = h.listener;
        if (k !== f && e.isPropagationStopped()) break a;
        Ze(e, h, l);
        f = k;
      } else for (g = 0; g < d.length; g++) {
        h = d[g];
        k = h.instance;
        l = h.currentTarget;
        h = h.listener;
        if (k !== f && e.isPropagationStopped()) break a;
        Ze(e, h, l);
        f = k;
      }
    }
  }

  if (Ub) throw a = Vb, Ub = !1, Vb = null, a;
}

function G(a, b) {
  var c = $e(b),
      d = a + "__bubble";
  c.has(d) || (af(b, a, 2, !1), c.add(d));
}

var bf = "_reactListening" + Math.random().toString(36).slice(2);

function cf(a) {
  a[bf] || (a[bf] = !0, ba.forEach(function (b) {
    Ye.has(b) || df(b, !1, a, null);
    df(b, !0, a, null);
  }));
}

function df(a, b, c, d) {
  var e = 4 < arguments.length && void 0 !== arguments[4] ? arguments[4] : 0,
      f = c;
  "selectionchange" === a && 9 !== c.nodeType && (f = c.ownerDocument);

  if (null !== d && !b && Ye.has(a)) {
    if ("scroll" !== a) return;
    e |= 2;
    f = d;
  }

  var g = $e(f),
      h = a + "__" + (b ? "capture" : "bubble");
  g.has(h) || (b && (e |= 4), af(f, a, e, b), g.add(h));
}

function af(a, b, c, d) {
  var e = Nc.get(b);

  switch (void 0 === e ? 2 : e) {
    case 0:
      e = gd;
      break;

    case 1:
      e = id;
      break;

    default:
      e = hd;
  }

  c = e.bind(null, b, c, a);
  e = void 0;
  !Pb || "touchstart" !== b && "touchmove" !== b && "wheel" !== b || (e = !0);
  d ? void 0 !== e ? a.addEventListener(b, c, {
    capture: !0,
    passive: e
  }) : a.addEventListener(b, c, !0) : void 0 !== e ? a.addEventListener(b, c, {
    passive: e
  }) : a.addEventListener(b, c, !1);
}

function jd(a, b, c, d, e) {
  var f = d;
  if (0 === (b & 1) && 0 === (b & 2) && null !== d) a: for (;;) {
    if (null === d) return;
    var g = d.tag;

    if (3 === g || 4 === g) {
      var h = d.stateNode.containerInfo;
      if (h === e || 8 === h.nodeType && h.parentNode === e) break;
      if (4 === g) for (g = d.return; null !== g;) {
        var k = g.tag;
        if (3 === k || 4 === k) if (k = g.stateNode.containerInfo, k === e || 8 === k.nodeType && k.parentNode === e) return;
        g = g.return;
      }

      for (; null !== h;) {
        g = wc(h);
        if (null === g) return;
        k = g.tag;

        if (5 === k || 6 === k) {
          d = f = g;
          continue a;
        }

        h = h.parentNode;
      }
    }

    d = d.return;
  }
  Nb(function () {
    var d = f,
        e = xb(c),
        g = [];

    a: {
      var h = Mc.get(a);

      if (void 0 !== h) {
        var k = td,
            x = a;

        switch (a) {
          case "keypress":
            if (0 === od(c)) break a;

          case "keydown":
          case "keyup":
            k = Rd;
            break;

          case "focusin":
            x = "focus";
            k = Fd;
            break;

          case "focusout":
            x = "blur";
            k = Fd;
            break;

          case "beforeblur":
          case "afterblur":
            k = Fd;
            break;

          case "click":
            if (2 === c.button) break a;

          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            k = Bd;
            break;

          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            k = Dd;
            break;

          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            k = Vd;
            break;

          case Ic:
          case Jc:
          case Kc:
            k = Hd;
            break;

          case Lc:
            k = Xd;
            break;

          case "scroll":
            k = vd;
            break;

          case "wheel":
            k = Zd;
            break;

          case "copy":
          case "cut":
          case "paste":
            k = Jd;
            break;

          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            k = Td;
        }

        var w = 0 !== (b & 4),
            z = !w && "scroll" === a,
            u = w ? null !== h ? h + "Capture" : null : h;
        w = [];

        for (var t = d, q; null !== t;) {
          q = t;
          var v = q.stateNode;
          5 === q.tag && null !== v && (q = v, null !== u && (v = Ob(t, u), null != v && w.push(ef(t, v, q))));
          if (z) break;
          t = t.return;
        }

        0 < w.length && (h = new k(h, x, null, c, e), g.push({
          event: h,
          listeners: w
        }));
      }
    }

    if (0 === (b & 7)) {
      a: {
        h = "mouseover" === a || "pointerover" === a;
        k = "mouseout" === a || "pointerout" === a;
        if (h && 0 === (b & 16) && (x = c.relatedTarget || c.fromElement) && (wc(x) || x[ff])) break a;

        if (k || h) {
          h = e.window === e ? e : (h = e.ownerDocument) ? h.defaultView || h.parentWindow : window;

          if (k) {
            if (x = c.relatedTarget || c.toElement, k = d, x = x ? wc(x) : null, null !== x && (z = Zb(x), x !== z || 5 !== x.tag && 6 !== x.tag)) x = null;
          } else k = null, x = d;

          if (k !== x) {
            w = Bd;
            v = "onMouseLeave";
            u = "onMouseEnter";
            t = "mouse";
            if ("pointerout" === a || "pointerover" === a) w = Td, v = "onPointerLeave", u = "onPointerEnter", t = "pointer";
            z = null == k ? h : ue(k);
            q = null == x ? h : ue(x);
            h = new w(v, t + "leave", k, c, e);
            h.target = z;
            h.relatedTarget = q;
            v = null;
            wc(e) === d && (w = new w(u, t + "enter", x, c, e), w.target = q, w.relatedTarget = z, v = w);
            z = v;
            if (k && x) b: {
              w = k;
              u = x;
              t = 0;

              for (q = w; q; q = gf(q)) t++;

              q = 0;

              for (v = u; v; v = gf(v)) q++;

              for (; 0 < t - q;) w = gf(w), t--;

              for (; 0 < q - t;) u = gf(u), q--;

              for (; t--;) {
                if (w === u || null !== u && w === u.alternate) break b;
                w = gf(w);
                u = gf(u);
              }

              w = null;
            } else w = null;
            null !== k && hf(g, h, k, w, !1);
            null !== x && null !== z && hf(g, z, x, w, !0);
          }
        }
      }

      a: {
        h = d ? ue(d) : window;
        k = h.nodeName && h.nodeName.toLowerCase();
        if ("select" === k || "input" === k && "file" === h.type) var J = ve;else if (me(h)) {
          if (we) J = Fe;else {
            J = De;
            var K = Ce;
          }
        } else (k = h.nodeName) && "input" === k.toLowerCase() && ("checkbox" === h.type || "radio" === h.type) && (J = Ee);

        if (J && (J = J(a, d))) {
          ne(g, J, c, e);
          break a;
        }

        K && K(a, h, d);
        "focusout" === a && (K = h._wrapperState) && K.controlled && "number" === h.type && bb(h, "number", h.value);
      }

      K = d ? ue(d) : window;

      switch (a) {
        case "focusin":
          if (me(K) || "true" === K.contentEditable) Qe = K, Re = d, Se = null;
          break;

        case "focusout":
          Se = Re = Qe = null;
          break;

        case "mousedown":
          Te = !0;
          break;

        case "contextmenu":
        case "mouseup":
        case "dragend":
          Te = !1;
          Ue(g, c, e);
          break;

        case "selectionchange":
          if (Pe) break;

        case "keydown":
        case "keyup":
          Ue(g, c, e);
      }

      var Q;
      if (ae) b: {
        switch (a) {
          case "compositionstart":
            var L = "onCompositionStart";
            break b;

          case "compositionend":
            L = "onCompositionEnd";
            break b;

          case "compositionupdate":
            L = "onCompositionUpdate";
            break b;
        }

        L = void 0;
      } else ie ? ge(a, c) && (L = "onCompositionEnd") : "keydown" === a && 229 === c.keyCode && (L = "onCompositionStart");
      L && (de && "ko" !== c.locale && (ie || "onCompositionStart" !== L ? "onCompositionEnd" === L && ie && (Q = nd()) : (kd = e, ld = "value" in kd ? kd.value : kd.textContent, ie = !0)), K = oe(d, L), 0 < K.length && (L = new Ld(L, a, null, c, e), g.push({
        event: L,
        listeners: K
      }), Q ? L.data = Q : (Q = he(c), null !== Q && (L.data = Q))));
      if (Q = ce ? je(a, c) : ke(a, c)) d = oe(d, "onBeforeInput"), 0 < d.length && (e = new Ld("onBeforeInput", "beforeinput", null, c, e), g.push({
        event: e,
        listeners: d
      }), e.data = Q);
    }

    se(g, b);
  });
}

function ef(a, b, c) {
  return {
    instance: a,
    listener: b,
    currentTarget: c
  };
}

function oe(a, b) {
  for (var c = b + "Capture", d = []; null !== a;) {
    var e = a,
        f = e.stateNode;
    5 === e.tag && null !== f && (e = f, f = Ob(a, c), null != f && d.unshift(ef(a, f, e)), f = Ob(a, b), null != f && d.push(ef(a, f, e)));
    a = a.return;
  }

  return d;
}

function gf(a) {
  if (null === a) return null;

  do a = a.return; while (a && 5 !== a.tag);

  return a ? a : null;
}

function hf(a, b, c, d, e) {
  for (var f = b._reactName, g = []; null !== c && c !== d;) {
    var h = c,
        k = h.alternate,
        l = h.stateNode;
    if (null !== k && k === d) break;
    5 === h.tag && null !== l && (h = l, e ? (k = Ob(c, f), null != k && g.unshift(ef(c, k, h))) : e || (k = Ob(c, f), null != k && g.push(ef(c, k, h))));
    c = c.return;
  }

  0 !== g.length && a.push({
    event: b,
    listeners: g
  });
}

function jf() {}

var kf = null,
    lf = null;

function mf(a, b) {
  switch (a) {
    case "button":
    case "input":
    case "select":
    case "textarea":
      return !!b.autoFocus;
  }

  return !1;
}

function nf(a, b) {
  return "textarea" === a || "option" === a || "noscript" === a || "string" === typeof b.children || "number" === typeof b.children || "object" === typeof b.dangerouslySetInnerHTML && null !== b.dangerouslySetInnerHTML && null != b.dangerouslySetInnerHTML.__html;
}

var of = "function" === typeof setTimeout ? setTimeout : void 0,
    pf = "function" === typeof clearTimeout ? clearTimeout : void 0;

function qf(a) {
  1 === a.nodeType ? a.textContent = "" : 9 === a.nodeType && (a = a.body, null != a && (a.textContent = ""));
}

function rf(a) {
  for (; null != a; a = a.nextSibling) {
    var b = a.nodeType;
    if (1 === b || 3 === b) break;
  }

  return a;
}

function sf(a) {
  a = a.previousSibling;

  for (var b = 0; a;) {
    if (8 === a.nodeType) {
      var c = a.data;

      if ("$" === c || "$!" === c || "$?" === c) {
        if (0 === b) return a;
        b--;
      } else "/$" === c && b++;
    }

    a = a.previousSibling;
  }

  return null;
}

var tf = 0;

function uf(a) {
  return {
    $$typeof: Ga,
    toString: a,
    valueOf: a
  };
}

var vf = Math.random().toString(36).slice(2),
    wf = "__reactFiber$" + vf,
    xf = "__reactProps$" + vf,
    ff = "__reactContainer$" + vf,
    yf = "__reactEvents$" + vf;

function wc(a) {
  var b = a[wf];
  if (b) return b;

  for (var c = a.parentNode; c;) {
    if (b = c[ff] || c[wf]) {
      c = b.alternate;
      if (null !== b.child || null !== c && null !== c.child) for (a = sf(a); null !== a;) {
        if (c = a[wf]) return c;
        a = sf(a);
      }
      return b;
    }

    a = c;
    c = a.parentNode;
  }

  return null;
}

function Cb(a) {
  a = a[wf] || a[ff];
  return !a || 5 !== a.tag && 6 !== a.tag && 13 !== a.tag && 3 !== a.tag ? null : a;
}

function ue(a) {
  if (5 === a.tag || 6 === a.tag) return a.stateNode;
  throw Error(y(33));
}

function Db(a) {
  return a[xf] || null;
}

function $e(a) {
  var b = a[yf];
  void 0 === b && (b = a[yf] = new Set());
  return b;
}

var zf = [],
    Af = -1;

function Bf(a) {
  return {
    current: a
  };
}

function H(a) {
  0 > Af || (a.current = zf[Af], zf[Af] = null, Af--);
}

function I(a, b) {
  Af++;
  zf[Af] = a.current;
  a.current = b;
}

var Cf = {},
    M = Bf(Cf),
    N = Bf(!1),
    Df = Cf;

function Ef(a, b) {
  var c = a.type.contextTypes;
  if (!c) return Cf;
  var d = a.stateNode;
  if (d && d.__reactInternalMemoizedUnmaskedChildContext === b) return d.__reactInternalMemoizedMaskedChildContext;
  var e = {},
      f;

  for (f in c) e[f] = b[f];

  d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = b, a.__reactInternalMemoizedMaskedChildContext = e);
  return e;
}

function Ff(a) {
  a = a.childContextTypes;
  return null !== a && void 0 !== a;
}

function Gf() {
  H(N);
  H(M);
}

function Hf(a, b, c) {
  if (M.current !== Cf) throw Error(y(168));
  I(M, b);
  I(N, c);
}

function If(a, b, c) {
  var d = a.stateNode;
  a = b.childContextTypes;
  if ("function" !== typeof d.getChildContext) return c;
  d = d.getChildContext();

  for (var e in d) if (!(e in a)) throw Error(y(108, Ra(b) || "Unknown", e));

  return m({}, c, d);
}

function Jf(a) {
  a = (a = a.stateNode) && a.__reactInternalMemoizedMergedChildContext || Cf;
  Df = M.current;
  I(M, a);
  I(N, N.current);
  return !0;
}

function Kf(a, b, c) {
  var d = a.stateNode;
  if (!d) throw Error(y(169));
  c ? (a = If(a, b, Df), d.__reactInternalMemoizedMergedChildContext = a, H(N), H(M), I(M, a)) : H(N);
  I(N, c);
}

var Lf = null,
    Mf = null,
    Nf = r.unstable_runWithPriority,
    Of = r.unstable_scheduleCallback,
    Pf = r.unstable_cancelCallback,
    Qf = r.unstable_shouldYield,
    Rf = r.unstable_requestPaint,
    Sf = r.unstable_now,
    Tf = r.unstable_getCurrentPriorityLevel,
    Uf = r.unstable_ImmediatePriority,
    Vf = r.unstable_UserBlockingPriority,
    Wf = r.unstable_NormalPriority,
    Xf = r.unstable_LowPriority,
    Yf = r.unstable_IdlePriority,
    Zf = {},
    $f = void 0 !== Rf ? Rf : function () {},
    ag = null,
    bg = null,
    cg = !1,
    dg = Sf(),
    O = 1E4 > dg ? Sf : function () {
  return Sf() - dg;
};

function eg() {
  switch (Tf()) {
    case Uf:
      return 99;

    case Vf:
      return 98;

    case Wf:
      return 97;

    case Xf:
      return 96;

    case Yf:
      return 95;

    default:
      throw Error(y(332));
  }
}

function fg(a) {
  switch (a) {
    case 99:
      return Uf;

    case 98:
      return Vf;

    case 97:
      return Wf;

    case 96:
      return Xf;

    case 95:
      return Yf;

    default:
      throw Error(y(332));
  }
}

function gg(a, b) {
  a = fg(a);
  return Nf(a, b);
}

function hg(a, b, c) {
  a = fg(a);
  return Of(a, b, c);
}

function ig() {
  if (null !== bg) {
    var a = bg;
    bg = null;
    Pf(a);
  }

  jg();
}

function jg() {
  if (!cg && null !== ag) {
    cg = !0;
    var a = 0;

    try {
      var b = ag;
      gg(99, function () {
        for (; a < b.length; a++) {
          var c = b[a];

          do c = c(!0); while (null !== c);
        }
      });
      ag = null;
    } catch (c) {
      throw null !== ag && (ag = ag.slice(a + 1)), Of(Uf, ig), c;
    } finally {
      cg = !1;
    }
  }
}

var kg = ra.ReactCurrentBatchConfig;

function lg(a, b) {
  if (a && a.defaultProps) {
    b = m({}, b);
    a = a.defaultProps;

    for (var c in a) void 0 === b[c] && (b[c] = a[c]);

    return b;
  }

  return b;
}

var mg = Bf(null),
    ng = null,
    og = null,
    pg = null;

function qg() {
  pg = og = ng = null;
}

function rg(a) {
  var b = mg.current;
  H(mg);
  a.type._context._currentValue = b;
}

function sg(a, b) {
  for (; null !== a;) {
    var c = a.alternate;
    if ((a.childLanes & b) === b) {
      if (null === c || (c.childLanes & b) === b) break;else c.childLanes |= b;
    } else a.childLanes |= b, null !== c && (c.childLanes |= b);
    a = a.return;
  }
}

function tg(a, b) {
  ng = a;
  pg = og = null;
  a = a.dependencies;
  null !== a && null !== a.firstContext && (0 !== (a.lanes & b) && (ug = !0), a.firstContext = null);
}

function vg(a, b) {
  if (pg !== a && !1 !== b && 0 !== b) {
    if ("number" !== typeof b || 1073741823 === b) pg = a, b = 1073741823;
    b = {
      context: a,
      observedBits: b,
      next: null
    };

    if (null === og) {
      if (null === ng) throw Error(y(308));
      og = b;
      ng.dependencies = {
        lanes: 0,
        firstContext: b,
        responders: null
      };
    } else og = og.next = b;
  }

  return a._currentValue;
}

var wg = !1;

function xg(a) {
  a.updateQueue = {
    baseState: a.memoizedState,
    firstBaseUpdate: null,
    lastBaseUpdate: null,
    shared: {
      pending: null
    },
    effects: null
  };
}

function yg(a, b) {
  a = a.updateQueue;
  b.updateQueue === a && (b.updateQueue = {
    baseState: a.baseState,
    firstBaseUpdate: a.firstBaseUpdate,
    lastBaseUpdate: a.lastBaseUpdate,
    shared: a.shared,
    effects: a.effects
  });
}

function zg(a, b) {
  return {
    eventTime: a,
    lane: b,
    tag: 0,
    payload: null,
    callback: null,
    next: null
  };
}

function Ag(a, b) {
  a = a.updateQueue;

  if (null !== a) {
    a = a.shared;
    var c = a.pending;
    null === c ? b.next = b : (b.next = c.next, c.next = b);
    a.pending = b;
  }
}

function Bg(a, b) {
  var c = a.updateQueue,
      d = a.alternate;

  if (null !== d && (d = d.updateQueue, c === d)) {
    var e = null,
        f = null;
    c = c.firstBaseUpdate;

    if (null !== c) {
      do {
        var g = {
          eventTime: c.eventTime,
          lane: c.lane,
          tag: c.tag,
          payload: c.payload,
          callback: c.callback,
          next: null
        };
        null === f ? e = f = g : f = f.next = g;
        c = c.next;
      } while (null !== c);

      null === f ? e = f = b : f = f.next = b;
    } else e = f = b;

    c = {
      baseState: d.baseState,
      firstBaseUpdate: e,
      lastBaseUpdate: f,
      shared: d.shared,
      effects: d.effects
    };
    a.updateQueue = c;
    return;
  }

  a = c.lastBaseUpdate;
  null === a ? c.firstBaseUpdate = b : a.next = b;
  c.lastBaseUpdate = b;
}

function Cg(a, b, c, d) {
  var e = a.updateQueue;
  wg = !1;
  var f = e.firstBaseUpdate,
      g = e.lastBaseUpdate,
      h = e.shared.pending;

  if (null !== h) {
    e.shared.pending = null;
    var k = h,
        l = k.next;
    k.next = null;
    null === g ? f = l : g.next = l;
    g = k;
    var n = a.alternate;

    if (null !== n) {
      n = n.updateQueue;
      var A = n.lastBaseUpdate;
      A !== g && (null === A ? n.firstBaseUpdate = l : A.next = l, n.lastBaseUpdate = k);
    }
  }

  if (null !== f) {
    A = e.baseState;
    g = 0;
    n = l = k = null;

    do {
      h = f.lane;
      var p = f.eventTime;

      if ((d & h) === h) {
        null !== n && (n = n.next = {
          eventTime: p,
          lane: 0,
          tag: f.tag,
          payload: f.payload,
          callback: f.callback,
          next: null
        });

        a: {
          var C = a,
              x = f;
          h = b;
          p = c;

          switch (x.tag) {
            case 1:
              C = x.payload;

              if ("function" === typeof C) {
                A = C.call(p, A, h);
                break a;
              }

              A = C;
              break a;

            case 3:
              C.flags = C.flags & -4097 | 64;

            case 0:
              C = x.payload;
              h = "function" === typeof C ? C.call(p, A, h) : C;
              if (null === h || void 0 === h) break a;
              A = m({}, A, h);
              break a;

            case 2:
              wg = !0;
          }
        }

        null !== f.callback && (a.flags |= 32, h = e.effects, null === h ? e.effects = [f] : h.push(f));
      } else p = {
        eventTime: p,
        lane: h,
        tag: f.tag,
        payload: f.payload,
        callback: f.callback,
        next: null
      }, null === n ? (l = n = p, k = A) : n = n.next = p, g |= h;

      f = f.next;
      if (null === f) if (h = e.shared.pending, null === h) break;else f = h.next, h.next = null, e.lastBaseUpdate = h, e.shared.pending = null;
    } while (1);

    null === n && (k = A);
    e.baseState = k;
    e.firstBaseUpdate = l;
    e.lastBaseUpdate = n;
    Dg |= g;
    a.lanes = g;
    a.memoizedState = A;
  }
}

function Eg(a, b, c) {
  a = b.effects;
  b.effects = null;
  if (null !== a) for (b = 0; b < a.length; b++) {
    var d = a[b],
        e = d.callback;

    if (null !== e) {
      d.callback = null;
      d = c;
      if ("function" !== typeof e) throw Error(y(191, e));
      e.call(d);
    }
  }
}

var Fg = new aa.Component().refs;

function Gg(a, b, c, d) {
  b = a.memoizedState;
  c = c(d, b);
  c = null === c || void 0 === c ? b : m({}, b, c);
  a.memoizedState = c;
  0 === a.lanes && (a.updateQueue.baseState = c);
}

var Kg = {
  isMounted: function (a) {
    return (a = a._reactInternals) ? Zb(a) === a : !1;
  },
  enqueueSetState: function (a, b, c) {
    a = a._reactInternals;
    var d = Hg(),
        e = Ig(a),
        f = zg(d, e);
    f.payload = b;
    void 0 !== c && null !== c && (f.callback = c);
    Ag(a, f);
    Jg(a, e, d);
  },
  enqueueReplaceState: function (a, b, c) {
    a = a._reactInternals;
    var d = Hg(),
        e = Ig(a),
        f = zg(d, e);
    f.tag = 1;
    f.payload = b;
    void 0 !== c && null !== c && (f.callback = c);
    Ag(a, f);
    Jg(a, e, d);
  },
  enqueueForceUpdate: function (a, b) {
    a = a._reactInternals;
    var c = Hg(),
        d = Ig(a),
        e = zg(c, d);
    e.tag = 2;
    void 0 !== b && null !== b && (e.callback = b);
    Ag(a, e);
    Jg(a, d, c);
  }
};

function Lg(a, b, c, d, e, f, g) {
  a = a.stateNode;
  return "function" === typeof a.shouldComponentUpdate ? a.shouldComponentUpdate(d, f, g) : b.prototype && b.prototype.isPureReactComponent ? !Je(c, d) || !Je(e, f) : !0;
}

function Mg(a, b, c) {
  var d = !1,
      e = Cf;
  var f = b.contextType;
  "object" === typeof f && null !== f ? f = vg(f) : (e = Ff(b) ? Df : M.current, d = b.contextTypes, f = (d = null !== d && void 0 !== d) ? Ef(a, e) : Cf);
  b = new b(c, f);
  a.memoizedState = null !== b.state && void 0 !== b.state ? b.state : null;
  b.updater = Kg;
  a.stateNode = b;
  b._reactInternals = a;
  d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = e, a.__reactInternalMemoizedMaskedChildContext = f);
  return b;
}

function Ng(a, b, c, d) {
  a = b.state;
  "function" === typeof b.componentWillReceiveProps && b.componentWillReceiveProps(c, d);
  "function" === typeof b.UNSAFE_componentWillReceiveProps && b.UNSAFE_componentWillReceiveProps(c, d);
  b.state !== a && Kg.enqueueReplaceState(b, b.state, null);
}

function Og(a, b, c, d) {
  var e = a.stateNode;
  e.props = c;
  e.state = a.memoizedState;
  e.refs = Fg;
  xg(a);
  var f = b.contextType;
  "object" === typeof f && null !== f ? e.context = vg(f) : (f = Ff(b) ? Df : M.current, e.context = Ef(a, f));
  Cg(a, c, e, d);
  e.state = a.memoizedState;
  f = b.getDerivedStateFromProps;
  "function" === typeof f && (Gg(a, b, f, c), e.state = a.memoizedState);
  "function" === typeof b.getDerivedStateFromProps || "function" === typeof e.getSnapshotBeforeUpdate || "function" !== typeof e.UNSAFE_componentWillMount && "function" !== typeof e.componentWillMount || (b = e.state, "function" === typeof e.componentWillMount && e.componentWillMount(), "function" === typeof e.UNSAFE_componentWillMount && e.UNSAFE_componentWillMount(), b !== e.state && Kg.enqueueReplaceState(e, e.state, null), Cg(a, c, e, d), e.state = a.memoizedState);
  "function" === typeof e.componentDidMount && (a.flags |= 4);
}

var Pg = Array.isArray;

function Qg(a, b, c) {
  a = c.ref;

  if (null !== a && "function" !== typeof a && "object" !== typeof a) {
    if (c._owner) {
      c = c._owner;

      if (c) {
        if (1 !== c.tag) throw Error(y(309));
        var d = c.stateNode;
      }

      if (!d) throw Error(y(147, a));
      var e = "" + a;
      if (null !== b && null !== b.ref && "function" === typeof b.ref && b.ref._stringRef === e) return b.ref;

      b = function (a) {
        var b = d.refs;
        b === Fg && (b = d.refs = {});
        null === a ? delete b[e] : b[e] = a;
      };

      b._stringRef = e;
      return b;
    }

    if ("string" !== typeof a) throw Error(y(284));
    if (!c._owner) throw Error(y(290, a));
  }

  return a;
}

function Rg(a, b) {
  if ("textarea" !== a.type) throw Error(y(31, "[object Object]" === Object.prototype.toString.call(b) ? "object with keys {" + Object.keys(b).join(", ") + "}" : b));
}

function Sg(a) {
  function b(b, c) {
    if (a) {
      var d = b.lastEffect;
      null !== d ? (d.nextEffect = c, b.lastEffect = c) : b.firstEffect = b.lastEffect = c;
      c.nextEffect = null;
      c.flags = 8;
    }
  }

  function c(c, d) {
    if (!a) return null;

    for (; null !== d;) b(c, d), d = d.sibling;

    return null;
  }

  function d(a, b) {
    for (a = new Map(); null !== b;) null !== b.key ? a.set(b.key, b) : a.set(b.index, b), b = b.sibling;

    return a;
  }

  function e(a, b) {
    a = Tg(a, b);
    a.index = 0;
    a.sibling = null;
    return a;
  }

  function f(b, c, d) {
    b.index = d;
    if (!a) return c;
    d = b.alternate;
    if (null !== d) return d = d.index, d < c ? (b.flags = 2, c) : d;
    b.flags = 2;
    return c;
  }

  function g(b) {
    a && null === b.alternate && (b.flags = 2);
    return b;
  }

  function h(a, b, c, d) {
    if (null === b || 6 !== b.tag) return b = Ug(c, a.mode, d), b.return = a, b;
    b = e(b, c);
    b.return = a;
    return b;
  }

  function k(a, b, c, d) {
    if (null !== b && b.elementType === c.type) return d = e(b, c.props), d.ref = Qg(a, b, c), d.return = a, d;
    d = Vg(c.type, c.key, c.props, null, a.mode, d);
    d.ref = Qg(a, b, c);
    d.return = a;
    return d;
  }

  function l(a, b, c, d) {
    if (null === b || 4 !== b.tag || b.stateNode.containerInfo !== c.containerInfo || b.stateNode.implementation !== c.implementation) return b = Wg(c, a.mode, d), b.return = a, b;
    b = e(b, c.children || []);
    b.return = a;
    return b;
  }

  function n(a, b, c, d, f) {
    if (null === b || 7 !== b.tag) return b = Xg(c, a.mode, d, f), b.return = a, b;
    b = e(b, c);
    b.return = a;
    return b;
  }

  function A(a, b, c) {
    if ("string" === typeof b || "number" === typeof b) return b = Ug("" + b, a.mode, c), b.return = a, b;

    if ("object" === typeof b && null !== b) {
      switch (b.$$typeof) {
        case sa:
          return c = Vg(b.type, b.key, b.props, null, a.mode, c), c.ref = Qg(a, null, b), c.return = a, c;

        case ta:
          return b = Wg(b, a.mode, c), b.return = a, b;
      }

      if (Pg(b) || La(b)) return b = Xg(b, a.mode, c, null), b.return = a, b;
      Rg(a, b);
    }

    return null;
  }

  function p(a, b, c, d) {
    var e = null !== b ? b.key : null;
    if ("string" === typeof c || "number" === typeof c) return null !== e ? null : h(a, b, "" + c, d);

    if ("object" === typeof c && null !== c) {
      switch (c.$$typeof) {
        case sa:
          return c.key === e ? c.type === ua ? n(a, b, c.props.children, d, e) : k(a, b, c, d) : null;

        case ta:
          return c.key === e ? l(a, b, c, d) : null;
      }

      if (Pg(c) || La(c)) return null !== e ? null : n(a, b, c, d, null);
      Rg(a, c);
    }

    return null;
  }

  function C(a, b, c, d, e) {
    if ("string" === typeof d || "number" === typeof d) return a = a.get(c) || null, h(b, a, "" + d, e);

    if ("object" === typeof d && null !== d) {
      switch (d.$$typeof) {
        case sa:
          return a = a.get(null === d.key ? c : d.key) || null, d.type === ua ? n(b, a, d.props.children, e, d.key) : k(b, a, d, e);

        case ta:
          return a = a.get(null === d.key ? c : d.key) || null, l(b, a, d, e);
      }

      if (Pg(d) || La(d)) return a = a.get(c) || null, n(b, a, d, e, null);
      Rg(b, d);
    }

    return null;
  }

  function x(e, g, h, k) {
    for (var l = null, t = null, u = g, z = g = 0, q = null; null !== u && z < h.length; z++) {
      u.index > z ? (q = u, u = null) : q = u.sibling;
      var n = p(e, u, h[z], k);

      if (null === n) {
        null === u && (u = q);
        break;
      }

      a && u && null === n.alternate && b(e, u);
      g = f(n, g, z);
      null === t ? l = n : t.sibling = n;
      t = n;
      u = q;
    }

    if (z === h.length) return c(e, u), l;

    if (null === u) {
      for (; z < h.length; z++) u = A(e, h[z], k), null !== u && (g = f(u, g, z), null === t ? l = u : t.sibling = u, t = u);

      return l;
    }

    for (u = d(e, u); z < h.length; z++) q = C(u, e, z, h[z], k), null !== q && (a && null !== q.alternate && u.delete(null === q.key ? z : q.key), g = f(q, g, z), null === t ? l = q : t.sibling = q, t = q);

    a && u.forEach(function (a) {
      return b(e, a);
    });
    return l;
  }

  function w(e, g, h, k) {
    var l = La(h);
    if ("function" !== typeof l) throw Error(y(150));
    h = l.call(h);
    if (null == h) throw Error(y(151));

    for (var t = l = null, u = g, z = g = 0, q = null, n = h.next(); null !== u && !n.done; z++, n = h.next()) {
      u.index > z ? (q = u, u = null) : q = u.sibling;
      var w = p(e, u, n.value, k);

      if (null === w) {
        null === u && (u = q);
        break;
      }

      a && u && null === w.alternate && b(e, u);
      g = f(w, g, z);
      null === t ? l = w : t.sibling = w;
      t = w;
      u = q;
    }

    if (n.done) return c(e, u), l;

    if (null === u) {
      for (; !n.done; z++, n = h.next()) n = A(e, n.value, k), null !== n && (g = f(n, g, z), null === t ? l = n : t.sibling = n, t = n);

      return l;
    }

    for (u = d(e, u); !n.done; z++, n = h.next()) n = C(u, e, z, n.value, k), null !== n && (a && null !== n.alternate && u.delete(null === n.key ? z : n.key), g = f(n, g, z), null === t ? l = n : t.sibling = n, t = n);

    a && u.forEach(function (a) {
      return b(e, a);
    });
    return l;
  }

  return function (a, d, f, h) {
    var k = "object" === typeof f && null !== f && f.type === ua && null === f.key;
    k && (f = f.props.children);
    var l = "object" === typeof f && null !== f;
    if (l) switch (f.$$typeof) {
      case sa:
        a: {
          l = f.key;

          for (k = d; null !== k;) {
            if (k.key === l) {
              switch (k.tag) {
                case 7:
                  if (f.type === ua) {
                    c(a, k.sibling);
                    d = e(k, f.props.children);
                    d.return = a;
                    a = d;
                    break a;
                  }

                  break;

                default:
                  if (k.elementType === f.type) {
                    c(a, k.sibling);
                    d = e(k, f.props);
                    d.ref = Qg(a, k, f);
                    d.return = a;
                    a = d;
                    break a;
                  }

              }

              c(a, k);
              break;
            } else b(a, k);

            k = k.sibling;
          }

          f.type === ua ? (d = Xg(f.props.children, a.mode, h, f.key), d.return = a, a = d) : (h = Vg(f.type, f.key, f.props, null, a.mode, h), h.ref = Qg(a, d, f), h.return = a, a = h);
        }

        return g(a);

      case ta:
        a: {
          for (k = f.key; null !== d;) {
            if (d.key === k) {
              if (4 === d.tag && d.stateNode.containerInfo === f.containerInfo && d.stateNode.implementation === f.implementation) {
                c(a, d.sibling);
                d = e(d, f.children || []);
                d.return = a;
                a = d;
                break a;
              } else {
                c(a, d);
                break;
              }
            } else b(a, d);
            d = d.sibling;
          }

          d = Wg(f, a.mode, h);
          d.return = a;
          a = d;
        }

        return g(a);
    }
    if ("string" === typeof f || "number" === typeof f) return f = "" + f, null !== d && 6 === d.tag ? (c(a, d.sibling), d = e(d, f), d.return = a, a = d) : (c(a, d), d = Ug(f, a.mode, h), d.return = a, a = d), g(a);
    if (Pg(f)) return x(a, d, f, h);
    if (La(f)) return w(a, d, f, h);
    l && Rg(a, f);
    if ("undefined" === typeof f && !k) switch (a.tag) {
      case 1:
      case 22:
      case 0:
      case 11:
      case 15:
        throw Error(y(152, Ra(a.type) || "Component"));
    }
    return c(a, d);
  };
}

var Yg = Sg(!0),
    Zg = Sg(!1),
    $g = {},
    ah = Bf($g),
    bh = Bf($g),
    ch = Bf($g);

function dh(a) {
  if (a === $g) throw Error(y(174));
  return a;
}

function eh(a, b) {
  I(ch, b);
  I(bh, a);
  I(ah, $g);
  a = b.nodeType;

  switch (a) {
    case 9:
    case 11:
      b = (b = b.documentElement) ? b.namespaceURI : mb(null, "");
      break;

    default:
      a = 8 === a ? b.parentNode : b, b = a.namespaceURI || null, a = a.tagName, b = mb(b, a);
  }

  H(ah);
  I(ah, b);
}

function fh() {
  H(ah);
  H(bh);
  H(ch);
}

function gh(a) {
  dh(ch.current);
  var b = dh(ah.current);
  var c = mb(b, a.type);
  b !== c && (I(bh, a), I(ah, c));
}

function hh(a) {
  bh.current === a && (H(ah), H(bh));
}

var P = Bf(0);

function ih(a) {
  for (var b = a; null !== b;) {
    if (13 === b.tag) {
      var c = b.memoizedState;
      if (null !== c && (c = c.dehydrated, null === c || "$?" === c.data || "$!" === c.data)) return b;
    } else if (19 === b.tag && void 0 !== b.memoizedProps.revealOrder) {
      if (0 !== (b.flags & 64)) return b;
    } else if (null !== b.child) {
      b.child.return = b;
      b = b.child;
      continue;
    }

    if (b === a) break;

    for (; null === b.sibling;) {
      if (null === b.return || b.return === a) return null;
      b = b.return;
    }

    b.sibling.return = b.return;
    b = b.sibling;
  }

  return null;
}

var jh = null,
    kh = null,
    lh = !1;

function mh(a, b) {
  var c = nh(5, null, null, 0);
  c.elementType = "DELETED";
  c.type = "DELETED";
  c.stateNode = b;
  c.return = a;
  c.flags = 8;
  null !== a.lastEffect ? (a.lastEffect.nextEffect = c, a.lastEffect = c) : a.firstEffect = a.lastEffect = c;
}

function oh(a, b) {
  switch (a.tag) {
    case 5:
      var c = a.type;
      b = 1 !== b.nodeType || c.toLowerCase() !== b.nodeName.toLowerCase() ? null : b;
      return null !== b ? (a.stateNode = b, !0) : !1;

    case 6:
      return b = "" === a.pendingProps || 3 !== b.nodeType ? null : b, null !== b ? (a.stateNode = b, !0) : !1;

    case 13:
      return !1;

    default:
      return !1;
  }
}

function ph(a) {
  if (lh) {
    var b = kh;

    if (b) {
      var c = b;

      if (!oh(a, b)) {
        b = rf(c.nextSibling);

        if (!b || !oh(a, b)) {
          a.flags = a.flags & -1025 | 2;
          lh = !1;
          jh = a;
          return;
        }

        mh(jh, c);
      }

      jh = a;
      kh = rf(b.firstChild);
    } else a.flags = a.flags & -1025 | 2, lh = !1, jh = a;
  }
}

function qh(a) {
  for (a = a.return; null !== a && 5 !== a.tag && 3 !== a.tag && 13 !== a.tag;) a = a.return;

  jh = a;
}

function rh(a) {
  if (a !== jh) return !1;
  if (!lh) return qh(a), lh = !0, !1;
  var b = a.type;
  if (5 !== a.tag || "head" !== b && "body" !== b && !nf(b, a.memoizedProps)) for (b = kh; b;) mh(a, b), b = rf(b.nextSibling);
  qh(a);

  if (13 === a.tag) {
    a = a.memoizedState;
    a = null !== a ? a.dehydrated : null;
    if (!a) throw Error(y(317));

    a: {
      a = a.nextSibling;

      for (b = 0; a;) {
        if (8 === a.nodeType) {
          var c = a.data;

          if ("/$" === c) {
            if (0 === b) {
              kh = rf(a.nextSibling);
              break a;
            }

            b--;
          } else "$" !== c && "$!" !== c && "$?" !== c || b++;
        }

        a = a.nextSibling;
      }

      kh = null;
    }
  } else kh = jh ? rf(a.stateNode.nextSibling) : null;

  return !0;
}

function sh() {
  kh = jh = null;
  lh = !1;
}

var th = [];

function uh() {
  for (var a = 0; a < th.length; a++) th[a]._workInProgressVersionPrimary = null;

  th.length = 0;
}

var vh = ra.ReactCurrentDispatcher,
    wh = ra.ReactCurrentBatchConfig,
    xh = 0,
    R = null,
    S = null,
    T = null,
    yh = !1,
    zh = !1;

function Ah() {
  throw Error(y(321));
}

function Bh(a, b) {
  if (null === b) return !1;

  for (var c = 0; c < b.length && c < a.length; c++) if (!He(a[c], b[c])) return !1;

  return !0;
}

function Ch(a, b, c, d, e, f) {
  xh = f;
  R = b;
  b.memoizedState = null;
  b.updateQueue = null;
  b.lanes = 0;
  vh.current = null === a || null === a.memoizedState ? Dh : Eh;
  a = c(d, e);

  if (zh) {
    f = 0;

    do {
      zh = !1;
      if (!(25 > f)) throw Error(y(301));
      f += 1;
      T = S = null;
      b.updateQueue = null;
      vh.current = Fh;
      a = c(d, e);
    } while (zh);
  }

  vh.current = Gh;
  b = null !== S && null !== S.next;
  xh = 0;
  T = S = R = null;
  yh = !1;
  if (b) throw Error(y(300));
  return a;
}

function Hh() {
  var a = {
    memoizedState: null,
    baseState: null,
    baseQueue: null,
    queue: null,
    next: null
  };
  null === T ? R.memoizedState = T = a : T = T.next = a;
  return T;
}

function Ih() {
  if (null === S) {
    var a = R.alternate;
    a = null !== a ? a.memoizedState : null;
  } else a = S.next;

  var b = null === T ? R.memoizedState : T.next;
  if (null !== b) T = b, S = a;else {
    if (null === a) throw Error(y(310));
    S = a;
    a = {
      memoizedState: S.memoizedState,
      baseState: S.baseState,
      baseQueue: S.baseQueue,
      queue: S.queue,
      next: null
    };
    null === T ? R.memoizedState = T = a : T = T.next = a;
  }
  return T;
}

function Jh(a, b) {
  return "function" === typeof b ? b(a) : b;
}

function Kh(a) {
  var b = Ih(),
      c = b.queue;
  if (null === c) throw Error(y(311));
  c.lastRenderedReducer = a;
  var d = S,
      e = d.baseQueue,
      f = c.pending;

  if (null !== f) {
    if (null !== e) {
      var g = e.next;
      e.next = f.next;
      f.next = g;
    }

    d.baseQueue = e = f;
    c.pending = null;
  }

  if (null !== e) {
    e = e.next;
    d = d.baseState;
    var h = g = f = null,
        k = e;

    do {
      var l = k.lane;
      if ((xh & l) === l) null !== h && (h = h.next = {
        lane: 0,
        action: k.action,
        eagerReducer: k.eagerReducer,
        eagerState: k.eagerState,
        next: null
      }), d = k.eagerReducer === a ? k.eagerState : a(d, k.action);else {
        var n = {
          lane: l,
          action: k.action,
          eagerReducer: k.eagerReducer,
          eagerState: k.eagerState,
          next: null
        };
        null === h ? (g = h = n, f = d) : h = h.next = n;
        R.lanes |= l;
        Dg |= l;
      }
      k = k.next;
    } while (null !== k && k !== e);

    null === h ? f = d : h.next = g;
    He(d, b.memoizedState) || (ug = !0);
    b.memoizedState = d;
    b.baseState = f;
    b.baseQueue = h;
    c.lastRenderedState = d;
  }

  return [b.memoizedState, c.dispatch];
}

function Lh(a) {
  var b = Ih(),
      c = b.queue;
  if (null === c) throw Error(y(311));
  c.lastRenderedReducer = a;
  var d = c.dispatch,
      e = c.pending,
      f = b.memoizedState;

  if (null !== e) {
    c.pending = null;
    var g = e = e.next;

    do f = a(f, g.action), g = g.next; while (g !== e);

    He(f, b.memoizedState) || (ug = !0);
    b.memoizedState = f;
    null === b.baseQueue && (b.baseState = f);
    c.lastRenderedState = f;
  }

  return [f, d];
}

function Mh(a, b, c) {
  var d = b._getVersion;
  d = d(b._source);
  var e = b._workInProgressVersionPrimary;
  if (null !== e) a = e === d;else if (a = a.mutableReadLanes, a = (xh & a) === a) b._workInProgressVersionPrimary = d, th.push(b);
  if (a) return c(b._source);
  th.push(b);
  throw Error(y(350));
}

function Nh(a, b, c, d) {
  var e = U;
  if (null === e) throw Error(y(349));
  var f = b._getVersion,
      g = f(b._source),
      h = vh.current,
      k = h.useState(function () {
    return Mh(e, b, c);
  }),
      l = k[1],
      n = k[0];
  k = T;
  var A = a.memoizedState,
      p = A.refs,
      C = p.getSnapshot,
      x = A.source;
  A = A.subscribe;
  var w = R;
  a.memoizedState = {
    refs: p,
    source: b,
    subscribe: d
  };
  h.useEffect(function () {
    p.getSnapshot = c;
    p.setSnapshot = l;
    var a = f(b._source);

    if (!He(g, a)) {
      a = c(b._source);
      He(n, a) || (l(a), a = Ig(w), e.mutableReadLanes |= a & e.pendingLanes);
      a = e.mutableReadLanes;
      e.entangledLanes |= a;

      for (var d = e.entanglements, h = a; 0 < h;) {
        var k = 31 - Vc(h),
            v = 1 << k;
        d[k] |= a;
        h &= ~v;
      }
    }
  }, [c, b, d]);
  h.useEffect(function () {
    return d(b._source, function () {
      var a = p.getSnapshot,
          c = p.setSnapshot;

      try {
        c(a(b._source));
        var d = Ig(w);
        e.mutableReadLanes |= d & e.pendingLanes;
      } catch (q) {
        c(function () {
          throw q;
        });
      }
    });
  }, [b, d]);
  He(C, c) && He(x, b) && He(A, d) || (a = {
    pending: null,
    dispatch: null,
    lastRenderedReducer: Jh,
    lastRenderedState: n
  }, a.dispatch = l = Oh.bind(null, R, a), k.queue = a, k.baseQueue = null, n = Mh(e, b, c), k.memoizedState = k.baseState = n);
  return n;
}

function Ph(a, b, c) {
  var d = Ih();
  return Nh(d, a, b, c);
}

function Qh(a) {
  var b = Hh();
  "function" === typeof a && (a = a());
  b.memoizedState = b.baseState = a;
  a = b.queue = {
    pending: null,
    dispatch: null,
    lastRenderedReducer: Jh,
    lastRenderedState: a
  };
  a = a.dispatch = Oh.bind(null, R, a);
  return [b.memoizedState, a];
}

function Rh(a, b, c, d) {
  a = {
    tag: a,
    create: b,
    destroy: c,
    deps: d,
    next: null
  };
  b = R.updateQueue;
  null === b ? (b = {
    lastEffect: null
  }, R.updateQueue = b, b.lastEffect = a.next = a) : (c = b.lastEffect, null === c ? b.lastEffect = a.next = a : (d = c.next, c.next = a, a.next = d, b.lastEffect = a));
  return a;
}

function Sh(a) {
  var b = Hh();
  a = {
    current: a
  };
  return b.memoizedState = a;
}

function Th() {
  return Ih().memoizedState;
}

function Uh(a, b, c, d) {
  var e = Hh();
  R.flags |= a;
  e.memoizedState = Rh(1 | b, c, void 0, void 0 === d ? null : d);
}

function Vh(a, b, c, d) {
  var e = Ih();
  d = void 0 === d ? null : d;
  var f = void 0;

  if (null !== S) {
    var g = S.memoizedState;
    f = g.destroy;

    if (null !== d && Bh(d, g.deps)) {
      Rh(b, c, f, d);
      return;
    }
  }

  R.flags |= a;
  e.memoizedState = Rh(1 | b, c, f, d);
}

function Wh(a, b) {
  return Uh(516, 4, a, b);
}

function Xh(a, b) {
  return Vh(516, 4, a, b);
}

function Yh(a, b) {
  return Vh(4, 2, a, b);
}

function Zh(a, b) {
  if ("function" === typeof b) return a = a(), b(a), function () {
    b(null);
  };
  if (null !== b && void 0 !== b) return a = a(), b.current = a, function () {
    b.current = null;
  };
}

function $h(a, b, c) {
  c = null !== c && void 0 !== c ? c.concat([a]) : null;
  return Vh(4, 2, Zh.bind(null, b, a), c);
}

function ai() {}

function bi(a, b) {
  var c = Ih();
  b = void 0 === b ? null : b;
  var d = c.memoizedState;
  if (null !== d && null !== b && Bh(b, d[1])) return d[0];
  c.memoizedState = [a, b];
  return a;
}

function ci(a, b) {
  var c = Ih();
  b = void 0 === b ? null : b;
  var d = c.memoizedState;
  if (null !== d && null !== b && Bh(b, d[1])) return d[0];
  a = a();
  c.memoizedState = [a, b];
  return a;
}

function di(a, b) {
  var c = eg();
  gg(98 > c ? 98 : c, function () {
    a(!0);
  });
  gg(97 < c ? 97 : c, function () {
    var c = wh.transition;
    wh.transition = 1;

    try {
      a(!1), b();
    } finally {
      wh.transition = c;
    }
  });
}

function Oh(a, b, c) {
  var d = Hg(),
      e = Ig(a),
      f = {
    lane: e,
    action: c,
    eagerReducer: null,
    eagerState: null,
    next: null
  },
      g = b.pending;
  null === g ? f.next = f : (f.next = g.next, g.next = f);
  b.pending = f;
  g = a.alternate;
  if (a === R || null !== g && g === R) zh = yh = !0;else {
    if (0 === a.lanes && (null === g || 0 === g.lanes) && (g = b.lastRenderedReducer, null !== g)) try {
      var h = b.lastRenderedState,
          k = g(h, c);
      f.eagerReducer = g;
      f.eagerState = k;
      if (He(k, h)) return;
    } catch (l) {} finally {}
    Jg(a, e, d);
  }
}

var Gh = {
  readContext: vg,
  useCallback: Ah,
  useContext: Ah,
  useEffect: Ah,
  useImperativeHandle: Ah,
  useLayoutEffect: Ah,
  useMemo: Ah,
  useReducer: Ah,
  useRef: Ah,
  useState: Ah,
  useDebugValue: Ah,
  useDeferredValue: Ah,
  useTransition: Ah,
  useMutableSource: Ah,
  useOpaqueIdentifier: Ah,
  unstable_isNewReconciler: !1
},
    Dh = {
  readContext: vg,
  useCallback: function (a, b) {
    Hh().memoizedState = [a, void 0 === b ? null : b];
    return a;
  },
  useContext: vg,
  useEffect: Wh,
  useImperativeHandle: function (a, b, c) {
    c = null !== c && void 0 !== c ? c.concat([a]) : null;
    return Uh(4, 2, Zh.bind(null, b, a), c);
  },
  useLayoutEffect: function (a, b) {
    return Uh(4, 2, a, b);
  },
  useMemo: function (a, b) {
    var c = Hh();
    b = void 0 === b ? null : b;
    a = a();
    c.memoizedState = [a, b];
    return a;
  },
  useReducer: function (a, b, c) {
    var d = Hh();
    b = void 0 !== c ? c(b) : b;
    d.memoizedState = d.baseState = b;
    a = d.queue = {
      pending: null,
      dispatch: null,
      lastRenderedReducer: a,
      lastRenderedState: b
    };
    a = a.dispatch = Oh.bind(null, R, a);
    return [d.memoizedState, a];
  },
  useRef: Sh,
  useState: Qh,
  useDebugValue: ai,
  useDeferredValue: function (a) {
    var b = Qh(a),
        c = b[0],
        d = b[1];
    Wh(function () {
      var b = wh.transition;
      wh.transition = 1;

      try {
        d(a);
      } finally {
        wh.transition = b;
      }
    }, [a]);
    return c;
  },
  useTransition: function () {
    var a = Qh(!1),
        b = a[0];
    a = di.bind(null, a[1]);
    Sh(a);
    return [a, b];
  },
  useMutableSource: function (a, b, c) {
    var d = Hh();
    d.memoizedState = {
      refs: {
        getSnapshot: b,
        setSnapshot: null
      },
      source: a,
      subscribe: c
    };
    return Nh(d, a, b, c);
  },
  useOpaqueIdentifier: function () {
    if (lh) {
      var a = !1,
          b = uf(function () {
        a || (a = !0, c("r:" + (tf++).toString(36)));
        throw Error(y(355));
      }),
          c = Qh(b)[1];
      0 === (R.mode & 2) && (R.flags |= 516, Rh(5, function () {
        c("r:" + (tf++).toString(36));
      }, void 0, null));
      return b;
    }

    b = "r:" + (tf++).toString(36);
    Qh(b);
    return b;
  },
  unstable_isNewReconciler: !1
},
    Eh = {
  readContext: vg,
  useCallback: bi,
  useContext: vg,
  useEffect: Xh,
  useImperativeHandle: $h,
  useLayoutEffect: Yh,
  useMemo: ci,
  useReducer: Kh,
  useRef: Th,
  useState: function () {
    return Kh(Jh);
  },
  useDebugValue: ai,
  useDeferredValue: function (a) {
    var b = Kh(Jh),
        c = b[0],
        d = b[1];
    Xh(function () {
      var b = wh.transition;
      wh.transition = 1;

      try {
        d(a);
      } finally {
        wh.transition = b;
      }
    }, [a]);
    return c;
  },
  useTransition: function () {
    var a = Kh(Jh)[0];
    return [Th().current, a];
  },
  useMutableSource: Ph,
  useOpaqueIdentifier: function () {
    return Kh(Jh)[0];
  },
  unstable_isNewReconciler: !1
},
    Fh = {
  readContext: vg,
  useCallback: bi,
  useContext: vg,
  useEffect: Xh,
  useImperativeHandle: $h,
  useLayoutEffect: Yh,
  useMemo: ci,
  useReducer: Lh,
  useRef: Th,
  useState: function () {
    return Lh(Jh);
  },
  useDebugValue: ai,
  useDeferredValue: function (a) {
    var b = Lh(Jh),
        c = b[0],
        d = b[1];
    Xh(function () {
      var b = wh.transition;
      wh.transition = 1;

      try {
        d(a);
      } finally {
        wh.transition = b;
      }
    }, [a]);
    return c;
  },
  useTransition: function () {
    var a = Lh(Jh)[0];
    return [Th().current, a];
  },
  useMutableSource: Ph,
  useOpaqueIdentifier: function () {
    return Lh(Jh)[0];
  },
  unstable_isNewReconciler: !1
},
    ei = ra.ReactCurrentOwner,
    ug = !1;

function fi(a, b, c, d) {
  b.child = null === a ? Zg(b, null, c, d) : Yg(b, a.child, c, d);
}

function gi(a, b, c, d, e) {
  c = c.render;
  var f = b.ref;
  tg(b, e);
  d = Ch(a, b, c, d, f, e);
  if (null !== a && !ug) return b.updateQueue = a.updateQueue, b.flags &= -517, a.lanes &= ~e, hi(a, b, e);
  b.flags |= 1;
  fi(a, b, d, e);
  return b.child;
}

function ii(a, b, c, d, e, f) {
  if (null === a) {
    var g = c.type;
    if ("function" === typeof g && !ji(g) && void 0 === g.defaultProps && null === c.compare && void 0 === c.defaultProps) return b.tag = 15, b.type = g, ki(a, b, g, d, e, f);
    a = Vg(c.type, null, d, b, b.mode, f);
    a.ref = b.ref;
    a.return = b;
    return b.child = a;
  }

  g = a.child;
  if (0 === (e & f) && (e = g.memoizedProps, c = c.compare, c = null !== c ? c : Je, c(e, d) && a.ref === b.ref)) return hi(a, b, f);
  b.flags |= 1;
  a = Tg(g, d);
  a.ref = b.ref;
  a.return = b;
  return b.child = a;
}

function ki(a, b, c, d, e, f) {
  if (null !== a && Je(a.memoizedProps, d) && a.ref === b.ref) if (ug = !1, 0 !== (f & e)) 0 !== (a.flags & 16384) && (ug = !0);else return b.lanes = a.lanes, hi(a, b, f);
  return li(a, b, c, d, f);
}

function mi(a, b, c) {
  var d = b.pendingProps,
      e = d.children,
      f = null !== a ? a.memoizedState : null;
  if ("hidden" === d.mode || "unstable-defer-without-hiding" === d.mode) {
    if (0 === (b.mode & 4)) b.memoizedState = {
      baseLanes: 0
    }, ni(b, c);else if (0 !== (c & 1073741824)) b.memoizedState = {
      baseLanes: 0
    }, ni(b, null !== f ? f.baseLanes : c);else return a = null !== f ? f.baseLanes | c : c, b.lanes = b.childLanes = 1073741824, b.memoizedState = {
      baseLanes: a
    }, ni(b, a), null;
  } else null !== f ? (d = f.baseLanes | c, b.memoizedState = null) : d = c, ni(b, d);
  fi(a, b, e, c);
  return b.child;
}

function oi(a, b) {
  var c = b.ref;
  if (null === a && null !== c || null !== a && a.ref !== c) b.flags |= 128;
}

function li(a, b, c, d, e) {
  var f = Ff(c) ? Df : M.current;
  f = Ef(b, f);
  tg(b, e);
  c = Ch(a, b, c, d, f, e);
  if (null !== a && !ug) return b.updateQueue = a.updateQueue, b.flags &= -517, a.lanes &= ~e, hi(a, b, e);
  b.flags |= 1;
  fi(a, b, c, e);
  return b.child;
}

function pi(a, b, c, d, e) {
  if (Ff(c)) {
    var f = !0;
    Jf(b);
  } else f = !1;

  tg(b, e);
  if (null === b.stateNode) null !== a && (a.alternate = null, b.alternate = null, b.flags |= 2), Mg(b, c, d), Og(b, c, d, e), d = !0;else if (null === a) {
    var g = b.stateNode,
        h = b.memoizedProps;
    g.props = h;
    var k = g.context,
        l = c.contextType;
    "object" === typeof l && null !== l ? l = vg(l) : (l = Ff(c) ? Df : M.current, l = Ef(b, l));
    var n = c.getDerivedStateFromProps,
        A = "function" === typeof n || "function" === typeof g.getSnapshotBeforeUpdate;
    A || "function" !== typeof g.UNSAFE_componentWillReceiveProps && "function" !== typeof g.componentWillReceiveProps || (h !== d || k !== l) && Ng(b, g, d, l);
    wg = !1;
    var p = b.memoizedState;
    g.state = p;
    Cg(b, d, g, e);
    k = b.memoizedState;
    h !== d || p !== k || N.current || wg ? ("function" === typeof n && (Gg(b, c, n, d), k = b.memoizedState), (h = wg || Lg(b, c, h, d, p, k, l)) ? (A || "function" !== typeof g.UNSAFE_componentWillMount && "function" !== typeof g.componentWillMount || ("function" === typeof g.componentWillMount && g.componentWillMount(), "function" === typeof g.UNSAFE_componentWillMount && g.UNSAFE_componentWillMount()), "function" === typeof g.componentDidMount && (b.flags |= 4)) : ("function" === typeof g.componentDidMount && (b.flags |= 4), b.memoizedProps = d, b.memoizedState = k), g.props = d, g.state = k, g.context = l, d = h) : ("function" === typeof g.componentDidMount && (b.flags |= 4), d = !1);
  } else {
    g = b.stateNode;
    yg(a, b);
    h = b.memoizedProps;
    l = b.type === b.elementType ? h : lg(b.type, h);
    g.props = l;
    A = b.pendingProps;
    p = g.context;
    k = c.contextType;
    "object" === typeof k && null !== k ? k = vg(k) : (k = Ff(c) ? Df : M.current, k = Ef(b, k));
    var C = c.getDerivedStateFromProps;
    (n = "function" === typeof C || "function" === typeof g.getSnapshotBeforeUpdate) || "function" !== typeof g.UNSAFE_componentWillReceiveProps && "function" !== typeof g.componentWillReceiveProps || (h !== A || p !== k) && Ng(b, g, d, k);
    wg = !1;
    p = b.memoizedState;
    g.state = p;
    Cg(b, d, g, e);
    var x = b.memoizedState;
    h !== A || p !== x || N.current || wg ? ("function" === typeof C && (Gg(b, c, C, d), x = b.memoizedState), (l = wg || Lg(b, c, l, d, p, x, k)) ? (n || "function" !== typeof g.UNSAFE_componentWillUpdate && "function" !== typeof g.componentWillUpdate || ("function" === typeof g.componentWillUpdate && g.componentWillUpdate(d, x, k), "function" === typeof g.UNSAFE_componentWillUpdate && g.UNSAFE_componentWillUpdate(d, x, k)), "function" === typeof g.componentDidUpdate && (b.flags |= 4), "function" === typeof g.getSnapshotBeforeUpdate && (b.flags |= 256)) : ("function" !== typeof g.componentDidUpdate || h === a.memoizedProps && p === a.memoizedState || (b.flags |= 4), "function" !== typeof g.getSnapshotBeforeUpdate || h === a.memoizedProps && p === a.memoizedState || (b.flags |= 256), b.memoizedProps = d, b.memoizedState = x), g.props = d, g.state = x, g.context = k, d = l) : ("function" !== typeof g.componentDidUpdate || h === a.memoizedProps && p === a.memoizedState || (b.flags |= 4), "function" !== typeof g.getSnapshotBeforeUpdate || h === a.memoizedProps && p === a.memoizedState || (b.flags |= 256), d = !1);
  }
  return qi(a, b, c, d, f, e);
}

function qi(a, b, c, d, e, f) {
  oi(a, b);
  var g = 0 !== (b.flags & 64);
  if (!d && !g) return e && Kf(b, c, !1), hi(a, b, f);
  d = b.stateNode;
  ei.current = b;
  var h = g && "function" !== typeof c.getDerivedStateFromError ? null : d.render();
  b.flags |= 1;
  null !== a && g ? (b.child = Yg(b, a.child, null, f), b.child = Yg(b, null, h, f)) : fi(a, b, h, f);
  b.memoizedState = d.state;
  e && Kf(b, c, !0);
  return b.child;
}

function ri(a) {
  var b = a.stateNode;
  b.pendingContext ? Hf(a, b.pendingContext, b.pendingContext !== b.context) : b.context && Hf(a, b.context, !1);
  eh(a, b.containerInfo);
}

var si = {
  dehydrated: null,
  retryLane: 0
};

function ti(a, b, c) {
  var d = b.pendingProps,
      e = P.current,
      f = !1,
      g;
  (g = 0 !== (b.flags & 64)) || (g = null !== a && null === a.memoizedState ? !1 : 0 !== (e & 2));
  g ? (f = !0, b.flags &= -65) : null !== a && null === a.memoizedState || void 0 === d.fallback || !0 === d.unstable_avoidThisFallback || (e |= 1);
  I(P, e & 1);

  if (null === a) {
    void 0 !== d.fallback && ph(b);
    a = d.children;
    e = d.fallback;
    if (f) return a = ui(b, a, e, c), b.child.memoizedState = {
      baseLanes: c
    }, b.memoizedState = si, a;
    if ("number" === typeof d.unstable_expectedLoadTime) return a = ui(b, a, e, c), b.child.memoizedState = {
      baseLanes: c
    }, b.memoizedState = si, b.lanes = 33554432, a;
    c = vi({
      mode: "visible",
      children: a
    }, b.mode, c, null);
    c.return = b;
    return b.child = c;
  }

  if (null !== a.memoizedState) {
    if (f) return d = wi(a, b, d.children, d.fallback, c), f = b.child, e = a.child.memoizedState, f.memoizedState = null === e ? {
      baseLanes: c
    } : {
      baseLanes: e.baseLanes | c
    }, f.childLanes = a.childLanes & ~c, b.memoizedState = si, d;
    c = xi(a, b, d.children, c);
    b.memoizedState = null;
    return c;
  }

  if (f) return d = wi(a, b, d.children, d.fallback, c), f = b.child, e = a.child.memoizedState, f.memoizedState = null === e ? {
    baseLanes: c
  } : {
    baseLanes: e.baseLanes | c
  }, f.childLanes = a.childLanes & ~c, b.memoizedState = si, d;
  c = xi(a, b, d.children, c);
  b.memoizedState = null;
  return c;
}

function ui(a, b, c, d) {
  var e = a.mode,
      f = a.child;
  b = {
    mode: "hidden",
    children: b
  };
  0 === (e & 2) && null !== f ? (f.childLanes = 0, f.pendingProps = b) : f = vi(b, e, 0, null);
  c = Xg(c, e, d, null);
  f.return = a;
  c.return = a;
  f.sibling = c;
  a.child = f;
  return c;
}

function xi(a, b, c, d) {
  var e = a.child;
  a = e.sibling;
  c = Tg(e, {
    mode: "visible",
    children: c
  });
  0 === (b.mode & 2) && (c.lanes = d);
  c.return = b;
  c.sibling = null;
  null !== a && (a.nextEffect = null, a.flags = 8, b.firstEffect = b.lastEffect = a);
  return b.child = c;
}

function wi(a, b, c, d, e) {
  var f = b.mode,
      g = a.child;
  a = g.sibling;
  var h = {
    mode: "hidden",
    children: c
  };
  0 === (f & 2) && b.child !== g ? (c = b.child, c.childLanes = 0, c.pendingProps = h, g = c.lastEffect, null !== g ? (b.firstEffect = c.firstEffect, b.lastEffect = g, g.nextEffect = null) : b.firstEffect = b.lastEffect = null) : c = Tg(g, h);
  null !== a ? d = Tg(a, d) : (d = Xg(d, f, e, null), d.flags |= 2);
  d.return = b;
  c.return = b;
  c.sibling = d;
  b.child = c;
  return d;
}

function yi(a, b) {
  a.lanes |= b;
  var c = a.alternate;
  null !== c && (c.lanes |= b);
  sg(a.return, b);
}

function zi(a, b, c, d, e, f) {
  var g = a.memoizedState;
  null === g ? a.memoizedState = {
    isBackwards: b,
    rendering: null,
    renderingStartTime: 0,
    last: d,
    tail: c,
    tailMode: e,
    lastEffect: f
  } : (g.isBackwards = b, g.rendering = null, g.renderingStartTime = 0, g.last = d, g.tail = c, g.tailMode = e, g.lastEffect = f);
}

function Ai(a, b, c) {
  var d = b.pendingProps,
      e = d.revealOrder,
      f = d.tail;
  fi(a, b, d.children, c);
  d = P.current;
  if (0 !== (d & 2)) d = d & 1 | 2, b.flags |= 64;else {
    if (null !== a && 0 !== (a.flags & 64)) a: for (a = b.child; null !== a;) {
      if (13 === a.tag) null !== a.memoizedState && yi(a, c);else if (19 === a.tag) yi(a, c);else if (null !== a.child) {
        a.child.return = a;
        a = a.child;
        continue;
      }
      if (a === b) break a;

      for (; null === a.sibling;) {
        if (null === a.return || a.return === b) break a;
        a = a.return;
      }

      a.sibling.return = a.return;
      a = a.sibling;
    }
    d &= 1;
  }
  I(P, d);
  if (0 === (b.mode & 2)) b.memoizedState = null;else switch (e) {
    case "forwards":
      c = b.child;

      for (e = null; null !== c;) a = c.alternate, null !== a && null === ih(a) && (e = c), c = c.sibling;

      c = e;
      null === c ? (e = b.child, b.child = null) : (e = c.sibling, c.sibling = null);
      zi(b, !1, e, c, f, b.lastEffect);
      break;

    case "backwards":
      c = null;
      e = b.child;

      for (b.child = null; null !== e;) {
        a = e.alternate;

        if (null !== a && null === ih(a)) {
          b.child = e;
          break;
        }

        a = e.sibling;
        e.sibling = c;
        c = e;
        e = a;
      }

      zi(b, !0, c, null, f, b.lastEffect);
      break;

    case "together":
      zi(b, !1, null, null, void 0, b.lastEffect);
      break;

    default:
      b.memoizedState = null;
  }
  return b.child;
}

function hi(a, b, c) {
  null !== a && (b.dependencies = a.dependencies);
  Dg |= b.lanes;

  if (0 !== (c & b.childLanes)) {
    if (null !== a && b.child !== a.child) throw Error(y(153));

    if (null !== b.child) {
      a = b.child;
      c = Tg(a, a.pendingProps);
      b.child = c;

      for (c.return = b; null !== a.sibling;) a = a.sibling, c = c.sibling = Tg(a, a.pendingProps), c.return = b;

      c.sibling = null;
    }

    return b.child;
  }

  return null;
}

var Bi, Ci, Di, Ei;

Bi = function (a, b) {
  for (var c = b.child; null !== c;) {
    if (5 === c.tag || 6 === c.tag) a.appendChild(c.stateNode);else if (4 !== c.tag && null !== c.child) {
      c.child.return = c;
      c = c.child;
      continue;
    }
    if (c === b) break;

    for (; null === c.sibling;) {
      if (null === c.return || c.return === b) return;
      c = c.return;
    }

    c.sibling.return = c.return;
    c = c.sibling;
  }
};

Ci = function () {};

Di = function (a, b, c, d) {
  var e = a.memoizedProps;

  if (e !== d) {
    a = b.stateNode;
    dh(ah.current);
    var f = null;

    switch (c) {
      case "input":
        e = Ya(a, e);
        d = Ya(a, d);
        f = [];
        break;

      case "option":
        e = eb(a, e);
        d = eb(a, d);
        f = [];
        break;

      case "select":
        e = m({}, e, {
          value: void 0
        });
        d = m({}, d, {
          value: void 0
        });
        f = [];
        break;

      case "textarea":
        e = gb(a, e);
        d = gb(a, d);
        f = [];
        break;

      default:
        "function" !== typeof e.onClick && "function" === typeof d.onClick && (a.onclick = jf);
    }

    vb(c, d);
    var g;
    c = null;

    for (l in e) if (!d.hasOwnProperty(l) && e.hasOwnProperty(l) && null != e[l]) if ("style" === l) {
      var h = e[l];

      for (g in h) h.hasOwnProperty(g) && (c || (c = {}), c[g] = "");
    } else "dangerouslySetInnerHTML" !== l && "children" !== l && "suppressContentEditableWarning" !== l && "suppressHydrationWarning" !== l && "autoFocus" !== l && (ca.hasOwnProperty(l) ? f || (f = []) : (f = f || []).push(l, null));

    for (l in d) {
      var k = d[l];
      h = null != e ? e[l] : void 0;
      if (d.hasOwnProperty(l) && k !== h && (null != k || null != h)) if ("style" === l) {
        if (h) {
          for (g in h) !h.hasOwnProperty(g) || k && k.hasOwnProperty(g) || (c || (c = {}), c[g] = "");

          for (g in k) k.hasOwnProperty(g) && h[g] !== k[g] && (c || (c = {}), c[g] = k[g]);
        } else c || (f || (f = []), f.push(l, c)), c = k;
      } else "dangerouslySetInnerHTML" === l ? (k = k ? k.__html : void 0, h = h ? h.__html : void 0, null != k && h !== k && (f = f || []).push(l, k)) : "children" === l ? "string" !== typeof k && "number" !== typeof k || (f = f || []).push(l, "" + k) : "suppressContentEditableWarning" !== l && "suppressHydrationWarning" !== l && (ca.hasOwnProperty(l) ? (null != k && "onScroll" === l && G("scroll", a), f || h === k || (f = [])) : "object" === typeof k && null !== k && k.$$typeof === Ga ? k.toString() : (f = f || []).push(l, k));
    }

    c && (f = f || []).push("style", c);
    var l = f;
    if (b.updateQueue = l) b.flags |= 4;
  }
};

Ei = function (a, b, c, d) {
  c !== d && (b.flags |= 4);
};

function Fi(a, b) {
  if (!lh) switch (a.tailMode) {
    case "hidden":
      b = a.tail;

      for (var c = null; null !== b;) null !== b.alternate && (c = b), b = b.sibling;

      null === c ? a.tail = null : c.sibling = null;
      break;

    case "collapsed":
      c = a.tail;

      for (var d = null; null !== c;) null !== c.alternate && (d = c), c = c.sibling;

      null === d ? b || null === a.tail ? a.tail = null : a.tail.sibling = null : d.sibling = null;
  }
}

function Gi(a, b, c) {
  var d = b.pendingProps;

  switch (b.tag) {
    case 2:
    case 16:
    case 15:
    case 0:
    case 11:
    case 7:
    case 8:
    case 12:
    case 9:
    case 14:
      return null;

    case 1:
      return Ff(b.type) && Gf(), null;

    case 3:
      fh();
      H(N);
      H(M);
      uh();
      d = b.stateNode;
      d.pendingContext && (d.context = d.pendingContext, d.pendingContext = null);
      if (null === a || null === a.child) rh(b) ? b.flags |= 4 : d.hydrate || (b.flags |= 256);
      Ci(b);
      return null;

    case 5:
      hh(b);
      var e = dh(ch.current);
      c = b.type;
      if (null !== a && null != b.stateNode) Di(a, b, c, d, e), a.ref !== b.ref && (b.flags |= 128);else {
        if (!d) {
          if (null === b.stateNode) throw Error(y(166));
          return null;
        }

        a = dh(ah.current);

        if (rh(b)) {
          d = b.stateNode;
          c = b.type;
          var f = b.memoizedProps;
          d[wf] = b;
          d[xf] = f;

          switch (c) {
            case "dialog":
              G("cancel", d);
              G("close", d);
              break;

            case "iframe":
            case "object":
            case "embed":
              G("load", d);
              break;

            case "video":
            case "audio":
              for (a = 0; a < Xe.length; a++) G(Xe[a], d);

              break;

            case "source":
              G("error", d);
              break;

            case "img":
            case "image":
            case "link":
              G("error", d);
              G("load", d);
              break;

            case "details":
              G("toggle", d);
              break;

            case "input":
              Za(d, f);
              G("invalid", d);
              break;

            case "select":
              d._wrapperState = {
                wasMultiple: !!f.multiple
              };
              G("invalid", d);
              break;

            case "textarea":
              hb(d, f), G("invalid", d);
          }

          vb(c, f);
          a = null;

          for (var g in f) f.hasOwnProperty(g) && (e = f[g], "children" === g ? "string" === typeof e ? d.textContent !== e && (a = ["children", e]) : "number" === typeof e && d.textContent !== "" + e && (a = ["children", "" + e]) : ca.hasOwnProperty(g) && null != e && "onScroll" === g && G("scroll", d));

          switch (c) {
            case "input":
              Va(d);
              cb(d, f, !0);
              break;

            case "textarea":
              Va(d);
              jb(d);
              break;

            case "select":
            case "option":
              break;

            default:
              "function" === typeof f.onClick && (d.onclick = jf);
          }

          d = a;
          b.updateQueue = d;
          null !== d && (b.flags |= 4);
        } else {
          g = 9 === e.nodeType ? e : e.ownerDocument;
          a === kb.html && (a = lb(c));
          a === kb.html ? "script" === c ? (a = g.createElement("div"), a.innerHTML = "<script>\x3c/script>", a = a.removeChild(a.firstChild)) : "string" === typeof d.is ? a = g.createElement(c, {
            is: d.is
          }) : (a = g.createElement(c), "select" === c && (g = a, d.multiple ? g.multiple = !0 : d.size && (g.size = d.size))) : a = g.createElementNS(a, c);
          a[wf] = b;
          a[xf] = d;
          Bi(a, b, !1, !1);
          b.stateNode = a;
          g = wb(c, d);

          switch (c) {
            case "dialog":
              G("cancel", a);
              G("close", a);
              e = d;
              break;

            case "iframe":
            case "object":
            case "embed":
              G("load", a);
              e = d;
              break;

            case "video":
            case "audio":
              for (e = 0; e < Xe.length; e++) G(Xe[e], a);

              e = d;
              break;

            case "source":
              G("error", a);
              e = d;
              break;

            case "img":
            case "image":
            case "link":
              G("error", a);
              G("load", a);
              e = d;
              break;

            case "details":
              G("toggle", a);
              e = d;
              break;

            case "input":
              Za(a, d);
              e = Ya(a, d);
              G("invalid", a);
              break;

            case "option":
              e = eb(a, d);
              break;

            case "select":
              a._wrapperState = {
                wasMultiple: !!d.multiple
              };
              e = m({}, d, {
                value: void 0
              });
              G("invalid", a);
              break;

            case "textarea":
              hb(a, d);
              e = gb(a, d);
              G("invalid", a);
              break;

            default:
              e = d;
          }

          vb(c, e);
          var h = e;

          for (f in h) if (h.hasOwnProperty(f)) {
            var k = h[f];
            "style" === f ? tb(a, k) : "dangerouslySetInnerHTML" === f ? (k = k ? k.__html : void 0, null != k && ob(a, k)) : "children" === f ? "string" === typeof k ? ("textarea" !== c || "" !== k) && pb(a, k) : "number" === typeof k && pb(a, "" + k) : "suppressContentEditableWarning" !== f && "suppressHydrationWarning" !== f && "autoFocus" !== f && (ca.hasOwnProperty(f) ? null != k && "onScroll" === f && G("scroll", a) : null != k && qa(a, f, k, g));
          }

          switch (c) {
            case "input":
              Va(a);
              cb(a, d, !1);
              break;

            case "textarea":
              Va(a);
              jb(a);
              break;

            case "option":
              null != d.value && a.setAttribute("value", "" + Sa(d.value));
              break;

            case "select":
              a.multiple = !!d.multiple;
              f = d.value;
              null != f ? fb(a, !!d.multiple, f, !1) : null != d.defaultValue && fb(a, !!d.multiple, d.defaultValue, !0);
              break;

            default:
              "function" === typeof e.onClick && (a.onclick = jf);
          }

          mf(c, d) && (b.flags |= 4);
        }

        null !== b.ref && (b.flags |= 128);
      }
      return null;

    case 6:
      if (a && null != b.stateNode) Ei(a, b, a.memoizedProps, d);else {
        if ("string" !== typeof d && null === b.stateNode) throw Error(y(166));
        c = dh(ch.current);
        dh(ah.current);
        rh(b) ? (d = b.stateNode, c = b.memoizedProps, d[wf] = b, d.nodeValue !== c && (b.flags |= 4)) : (d = (9 === c.nodeType ? c : c.ownerDocument).createTextNode(d), d[wf] = b, b.stateNode = d);
      }
      return null;

    case 13:
      H(P);
      d = b.memoizedState;
      if (0 !== (b.flags & 64)) return b.lanes = c, b;
      d = null !== d;
      c = !1;
      null === a ? void 0 !== b.memoizedProps.fallback && rh(b) : c = null !== a.memoizedState;
      if (d && !c && 0 !== (b.mode & 2)) if (null === a && !0 !== b.memoizedProps.unstable_avoidThisFallback || 0 !== (P.current & 1)) 0 === V && (V = 3);else {
        if (0 === V || 3 === V) V = 4;
        null === U || 0 === (Dg & 134217727) && 0 === (Hi & 134217727) || Ii(U, W);
      }
      if (d || c) b.flags |= 4;
      return null;

    case 4:
      return fh(), Ci(b), null === a && cf(b.stateNode.containerInfo), null;

    case 10:
      return rg(b), null;

    case 17:
      return Ff(b.type) && Gf(), null;

    case 19:
      H(P);
      d = b.memoizedState;
      if (null === d) return null;
      f = 0 !== (b.flags & 64);
      g = d.rendering;
      if (null === g) {
        if (f) Fi(d, !1);else {
          if (0 !== V || null !== a && 0 !== (a.flags & 64)) for (a = b.child; null !== a;) {
            g = ih(a);

            if (null !== g) {
              b.flags |= 64;
              Fi(d, !1);
              f = g.updateQueue;
              null !== f && (b.updateQueue = f, b.flags |= 4);
              null === d.lastEffect && (b.firstEffect = null);
              b.lastEffect = d.lastEffect;
              d = c;

              for (c = b.child; null !== c;) f = c, a = d, f.flags &= 2, f.nextEffect = null, f.firstEffect = null, f.lastEffect = null, g = f.alternate, null === g ? (f.childLanes = 0, f.lanes = a, f.child = null, f.memoizedProps = null, f.memoizedState = null, f.updateQueue = null, f.dependencies = null, f.stateNode = null) : (f.childLanes = g.childLanes, f.lanes = g.lanes, f.child = g.child, f.memoizedProps = g.memoizedProps, f.memoizedState = g.memoizedState, f.updateQueue = g.updateQueue, f.type = g.type, a = g.dependencies, f.dependencies = null === a ? null : {
                lanes: a.lanes,
                firstContext: a.firstContext
              }), c = c.sibling;

              I(P, P.current & 1 | 2);
              return b.child;
            }

            a = a.sibling;
          }
          null !== d.tail && O() > Ji && (b.flags |= 64, f = !0, Fi(d, !1), b.lanes = 33554432);
        }
      } else {
        if (!f) if (a = ih(g), null !== a) {
          if (b.flags |= 64, f = !0, c = a.updateQueue, null !== c && (b.updateQueue = c, b.flags |= 4), Fi(d, !0), null === d.tail && "hidden" === d.tailMode && !g.alternate && !lh) return b = b.lastEffect = d.lastEffect, null !== b && (b.nextEffect = null), null;
        } else 2 * O() - d.renderingStartTime > Ji && 1073741824 !== c && (b.flags |= 64, f = !0, Fi(d, !1), b.lanes = 33554432);
        d.isBackwards ? (g.sibling = b.child, b.child = g) : (c = d.last, null !== c ? c.sibling = g : b.child = g, d.last = g);
      }
      return null !== d.tail ? (c = d.tail, d.rendering = c, d.tail = c.sibling, d.lastEffect = b.lastEffect, d.renderingStartTime = O(), c.sibling = null, b = P.current, I(P, f ? b & 1 | 2 : b & 1), c) : null;

    case 23:
    case 24:
      return Ki(), null !== a && null !== a.memoizedState !== (null !== b.memoizedState) && "unstable-defer-without-hiding" !== d.mode && (b.flags |= 4), null;
  }

  throw Error(y(156, b.tag));
}

function Li(a) {
  switch (a.tag) {
    case 1:
      Ff(a.type) && Gf();
      var b = a.flags;
      return b & 4096 ? (a.flags = b & -4097 | 64, a) : null;

    case 3:
      fh();
      H(N);
      H(M);
      uh();
      b = a.flags;
      if (0 !== (b & 64)) throw Error(y(285));
      a.flags = b & -4097 | 64;
      return a;

    case 5:
      return hh(a), null;

    case 13:
      return H(P), b = a.flags, b & 4096 ? (a.flags = b & -4097 | 64, a) : null;

    case 19:
      return H(P), null;

    case 4:
      return fh(), null;

    case 10:
      return rg(a), null;

    case 23:
    case 24:
      return Ki(), null;

    default:
      return null;
  }
}

function Mi(a, b) {
  try {
    var c = "",
        d = b;

    do c += Qa(d), d = d.return; while (d);

    var e = c;
  } catch (f) {
    e = "\nError generating stack: " + f.message + "\n" + f.stack;
  }

  return {
    value: a,
    source: b,
    stack: e
  };
}

function Ni(a, b) {
  try {
    console.error(b.value);
  } catch (c) {
    setTimeout(function () {
      throw c;
    });
  }
}

var Oi = "function" === typeof WeakMap ? WeakMap : Map;

function Pi(a, b, c) {
  c = zg(-1, c);
  c.tag = 3;
  c.payload = {
    element: null
  };
  var d = b.value;

  c.callback = function () {
    Qi || (Qi = !0, Ri = d);
    Ni(a, b);
  };

  return c;
}

function Si(a, b, c) {
  c = zg(-1, c);
  c.tag = 3;
  var d = a.type.getDerivedStateFromError;

  if ("function" === typeof d) {
    var e = b.value;

    c.payload = function () {
      Ni(a, b);
      return d(e);
    };
  }

  var f = a.stateNode;
  null !== f && "function" === typeof f.componentDidCatch && (c.callback = function () {
    "function" !== typeof d && (null === Ti ? Ti = new Set([this]) : Ti.add(this), Ni(a, b));
    var c = b.stack;
    this.componentDidCatch(b.value, {
      componentStack: null !== c ? c : ""
    });
  });
  return c;
}

var Ui = "function" === typeof WeakSet ? WeakSet : Set;

function Vi(a) {
  var b = a.ref;
  if (null !== b) if ("function" === typeof b) try {
    b(null);
  } catch (c) {
    Wi(a, c);
  } else b.current = null;
}

function Xi(a, b) {
  switch (b.tag) {
    case 0:
    case 11:
    case 15:
    case 22:
      return;

    case 1:
      if (b.flags & 256 && null !== a) {
        var c = a.memoizedProps,
            d = a.memoizedState;
        a = b.stateNode;
        b = a.getSnapshotBeforeUpdate(b.elementType === b.type ? c : lg(b.type, c), d);
        a.__reactInternalSnapshotBeforeUpdate = b;
      }

      return;

    case 3:
      b.flags & 256 && qf(b.stateNode.containerInfo);
      return;

    case 5:
    case 6:
    case 4:
    case 17:
      return;
  }

  throw Error(y(163));
}

function Yi(a, b, c) {
  switch (c.tag) {
    case 0:
    case 11:
    case 15:
    case 22:
      b = c.updateQueue;
      b = null !== b ? b.lastEffect : null;

      if (null !== b) {
        a = b = b.next;

        do {
          if (3 === (a.tag & 3)) {
            var d = a.create;
            a.destroy = d();
          }

          a = a.next;
        } while (a !== b);
      }

      b = c.updateQueue;
      b = null !== b ? b.lastEffect : null;

      if (null !== b) {
        a = b = b.next;

        do {
          var e = a;
          d = e.next;
          e = e.tag;
          0 !== (e & 4) && 0 !== (e & 1) && (Zi(c, a), $i(c, a));
          a = d;
        } while (a !== b);
      }

      return;

    case 1:
      a = c.stateNode;
      c.flags & 4 && (null === b ? a.componentDidMount() : (d = c.elementType === c.type ? b.memoizedProps : lg(c.type, b.memoizedProps), a.componentDidUpdate(d, b.memoizedState, a.__reactInternalSnapshotBeforeUpdate)));
      b = c.updateQueue;
      null !== b && Eg(c, b, a);
      return;

    case 3:
      b = c.updateQueue;

      if (null !== b) {
        a = null;
        if (null !== c.child) switch (c.child.tag) {
          case 5:
            a = c.child.stateNode;
            break;

          case 1:
            a = c.child.stateNode;
        }
        Eg(c, b, a);
      }

      return;

    case 5:
      a = c.stateNode;
      null === b && c.flags & 4 && mf(c.type, c.memoizedProps) && a.focus();
      return;

    case 6:
      return;

    case 4:
      return;

    case 12:
      return;

    case 13:
      null === c.memoizedState && (c = c.alternate, null !== c && (c = c.memoizedState, null !== c && (c = c.dehydrated, null !== c && Cc(c))));
      return;

    case 19:
    case 17:
    case 20:
    case 21:
    case 23:
    case 24:
      return;
  }

  throw Error(y(163));
}

function aj(a, b) {
  for (var c = a;;) {
    if (5 === c.tag) {
      var d = c.stateNode;
      if (b) d = d.style, "function" === typeof d.setProperty ? d.setProperty("display", "none", "important") : d.display = "none";else {
        d = c.stateNode;
        var e = c.memoizedProps.style;
        e = void 0 !== e && null !== e && e.hasOwnProperty("display") ? e.display : null;
        d.style.display = sb("display", e);
      }
    } else if (6 === c.tag) c.stateNode.nodeValue = b ? "" : c.memoizedProps;else if ((23 !== c.tag && 24 !== c.tag || null === c.memoizedState || c === a) && null !== c.child) {
      c.child.return = c;
      c = c.child;
      continue;
    }

    if (c === a) break;

    for (; null === c.sibling;) {
      if (null === c.return || c.return === a) return;
      c = c.return;
    }

    c.sibling.return = c.return;
    c = c.sibling;
  }
}

function bj(a, b) {
  if (Mf && "function" === typeof Mf.onCommitFiberUnmount) try {
    Mf.onCommitFiberUnmount(Lf, b);
  } catch (f) {}

  switch (b.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
    case 22:
      a = b.updateQueue;

      if (null !== a && (a = a.lastEffect, null !== a)) {
        var c = a = a.next;

        do {
          var d = c,
              e = d.destroy;
          d = d.tag;
          if (void 0 !== e) if (0 !== (d & 4)) Zi(b, c);else {
            d = b;

            try {
              e();
            } catch (f) {
              Wi(d, f);
            }
          }
          c = c.next;
        } while (c !== a);
      }

      break;

    case 1:
      Vi(b);
      a = b.stateNode;
      if ("function" === typeof a.componentWillUnmount) try {
        a.props = b.memoizedProps, a.state = b.memoizedState, a.componentWillUnmount();
      } catch (f) {
        Wi(b, f);
      }
      break;

    case 5:
      Vi(b);
      break;

    case 4:
      cj(a, b);
  }
}

function dj(a) {
  a.alternate = null;
  a.child = null;
  a.dependencies = null;
  a.firstEffect = null;
  a.lastEffect = null;
  a.memoizedProps = null;
  a.memoizedState = null;
  a.pendingProps = null;
  a.return = null;
  a.updateQueue = null;
}

function ej(a) {
  return 5 === a.tag || 3 === a.tag || 4 === a.tag;
}

function fj(a) {
  a: {
    for (var b = a.return; null !== b;) {
      if (ej(b)) break a;
      b = b.return;
    }

    throw Error(y(160));
  }

  var c = b;
  b = c.stateNode;

  switch (c.tag) {
    case 5:
      var d = !1;
      break;

    case 3:
      b = b.containerInfo;
      d = !0;
      break;

    case 4:
      b = b.containerInfo;
      d = !0;
      break;

    default:
      throw Error(y(161));
  }

  c.flags & 16 && (pb(b, ""), c.flags &= -17);

  a: b: for (c = a;;) {
    for (; null === c.sibling;) {
      if (null === c.return || ej(c.return)) {
        c = null;
        break a;
      }

      c = c.return;
    }

    c.sibling.return = c.return;

    for (c = c.sibling; 5 !== c.tag && 6 !== c.tag && 18 !== c.tag;) {
      if (c.flags & 2) continue b;
      if (null === c.child || 4 === c.tag) continue b;else c.child.return = c, c = c.child;
    }

    if (!(c.flags & 2)) {
      c = c.stateNode;
      break a;
    }
  }

  d ? gj(a, c, b) : hj(a, c, b);
}

function gj(a, b, c) {
  var d = a.tag,
      e = 5 === d || 6 === d;
  if (e) a = e ? a.stateNode : a.stateNode.instance, b ? 8 === c.nodeType ? c.parentNode.insertBefore(a, b) : c.insertBefore(a, b) : (8 === c.nodeType ? (b = c.parentNode, b.insertBefore(a, c)) : (b = c, b.appendChild(a)), c = c._reactRootContainer, null !== c && void 0 !== c || null !== b.onclick || (b.onclick = jf));else if (4 !== d && (a = a.child, null !== a)) for (gj(a, b, c), a = a.sibling; null !== a;) gj(a, b, c), a = a.sibling;
}

function hj(a, b, c) {
  var d = a.tag,
      e = 5 === d || 6 === d;
  if (e) a = e ? a.stateNode : a.stateNode.instance, b ? c.insertBefore(a, b) : c.appendChild(a);else if (4 !== d && (a = a.child, null !== a)) for (hj(a, b, c), a = a.sibling; null !== a;) hj(a, b, c), a = a.sibling;
}

function cj(a, b) {
  for (var c = b, d = !1, e, f;;) {
    if (!d) {
      d = c.return;

      a: for (;;) {
        if (null === d) throw Error(y(160));
        e = d.stateNode;

        switch (d.tag) {
          case 5:
            f = !1;
            break a;

          case 3:
            e = e.containerInfo;
            f = !0;
            break a;

          case 4:
            e = e.containerInfo;
            f = !0;
            break a;
        }

        d = d.return;
      }

      d = !0;
    }

    if (5 === c.tag || 6 === c.tag) {
      a: for (var g = a, h = c, k = h;;) if (bj(g, k), null !== k.child && 4 !== k.tag) k.child.return = k, k = k.child;else {
        if (k === h) break a;

        for (; null === k.sibling;) {
          if (null === k.return || k.return === h) break a;
          k = k.return;
        }

        k.sibling.return = k.return;
        k = k.sibling;
      }

      f ? (g = e, h = c.stateNode, 8 === g.nodeType ? g.parentNode.removeChild(h) : g.removeChild(h)) : e.removeChild(c.stateNode);
    } else if (4 === c.tag) {
      if (null !== c.child) {
        e = c.stateNode.containerInfo;
        f = !0;
        c.child.return = c;
        c = c.child;
        continue;
      }
    } else if (bj(a, c), null !== c.child) {
      c.child.return = c;
      c = c.child;
      continue;
    }

    if (c === b) break;

    for (; null === c.sibling;) {
      if (null === c.return || c.return === b) return;
      c = c.return;
      4 === c.tag && (d = !1);
    }

    c.sibling.return = c.return;
    c = c.sibling;
  }
}

function ij(a, b) {
  switch (b.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
    case 22:
      var c = b.updateQueue;
      c = null !== c ? c.lastEffect : null;

      if (null !== c) {
        var d = c = c.next;

        do 3 === (d.tag & 3) && (a = d.destroy, d.destroy = void 0, void 0 !== a && a()), d = d.next; while (d !== c);
      }

      return;

    case 1:
      return;

    case 5:
      c = b.stateNode;

      if (null != c) {
        d = b.memoizedProps;
        var e = null !== a ? a.memoizedProps : d;
        a = b.type;
        var f = b.updateQueue;
        b.updateQueue = null;

        if (null !== f) {
          c[xf] = d;
          "input" === a && "radio" === d.type && null != d.name && $a(c, d);
          wb(a, e);
          b = wb(a, d);

          for (e = 0; e < f.length; e += 2) {
            var g = f[e],
                h = f[e + 1];
            "style" === g ? tb(c, h) : "dangerouslySetInnerHTML" === g ? ob(c, h) : "children" === g ? pb(c, h) : qa(c, g, h, b);
          }

          switch (a) {
            case "input":
              ab(c, d);
              break;

            case "textarea":
              ib(c, d);
              break;

            case "select":
              a = c._wrapperState.wasMultiple, c._wrapperState.wasMultiple = !!d.multiple, f = d.value, null != f ? fb(c, !!d.multiple, f, !1) : a !== !!d.multiple && (null != d.defaultValue ? fb(c, !!d.multiple, d.defaultValue, !0) : fb(c, !!d.multiple, d.multiple ? [] : "", !1));
          }
        }
      }

      return;

    case 6:
      if (null === b.stateNode) throw Error(y(162));
      b.stateNode.nodeValue = b.memoizedProps;
      return;

    case 3:
      c = b.stateNode;
      c.hydrate && (c.hydrate = !1, Cc(c.containerInfo));
      return;

    case 12:
      return;

    case 13:
      null !== b.memoizedState && (jj = O(), aj(b.child, !0));
      kj(b);
      return;

    case 19:
      kj(b);
      return;

    case 17:
      return;

    case 23:
    case 24:
      aj(b, null !== b.memoizedState);
      return;
  }

  throw Error(y(163));
}

function kj(a) {
  var b = a.updateQueue;

  if (null !== b) {
    a.updateQueue = null;
    var c = a.stateNode;
    null === c && (c = a.stateNode = new Ui());
    b.forEach(function (b) {
      var d = lj.bind(null, a, b);
      c.has(b) || (c.add(b), b.then(d, d));
    });
  }
}

function mj(a, b) {
  return null !== a && (a = a.memoizedState, null === a || null !== a.dehydrated) ? (b = b.memoizedState, null !== b && null === b.dehydrated) : !1;
}

var nj = Math.ceil,
    oj = ra.ReactCurrentDispatcher,
    pj = ra.ReactCurrentOwner,
    X = 0,
    U = null,
    Y = null,
    W = 0,
    qj = 0,
    rj = Bf(0),
    V = 0,
    sj = null,
    tj = 0,
    Dg = 0,
    Hi = 0,
    uj = 0,
    vj = null,
    jj = 0,
    Ji = Infinity;

function wj() {
  Ji = O() + 500;
}

var Z = null,
    Qi = !1,
    Ri = null,
    Ti = null,
    xj = !1,
    yj = null,
    zj = 90,
    Aj = [],
    Bj = [],
    Cj = null,
    Dj = 0,
    Ej = null,
    Fj = -1,
    Gj = 0,
    Hj = 0,
    Ij = null,
    Jj = !1;

function Hg() {
  return 0 !== (X & 48) ? O() : -1 !== Fj ? Fj : Fj = O();
}

function Ig(a) {
  a = a.mode;
  if (0 === (a & 2)) return 1;
  if (0 === (a & 4)) return 99 === eg() ? 1 : 2;
  0 === Gj && (Gj = tj);

  if (0 !== kg.transition) {
    0 !== Hj && (Hj = null !== vj ? vj.pendingLanes : 0);
    a = Gj;
    var b = 4186112 & ~Hj;
    b &= -b;
    0 === b && (a = 4186112 & ~a, b = a & -a, 0 === b && (b = 8192));
    return b;
  }

  a = eg();
  0 !== (X & 4) && 98 === a ? a = Xc(12, Gj) : (a = Sc(a), a = Xc(a, Gj));
  return a;
}

function Jg(a, b, c) {
  if (50 < Dj) throw Dj = 0, Ej = null, Error(y(185));
  a = Kj(a, b);
  if (null === a) return null;
  $c(a, b, c);
  a === U && (Hi |= b, 4 === V && Ii(a, W));
  var d = eg();
  1 === b ? 0 !== (X & 8) && 0 === (X & 48) ? Lj(a) : (Mj(a, c), 0 === X && (wj(), ig())) : (0 === (X & 4) || 98 !== d && 99 !== d || (null === Cj ? Cj = new Set([a]) : Cj.add(a)), Mj(a, c));
  vj = a;
}

function Kj(a, b) {
  a.lanes |= b;
  var c = a.alternate;
  null !== c && (c.lanes |= b);
  c = a;

  for (a = a.return; null !== a;) a.childLanes |= b, c = a.alternate, null !== c && (c.childLanes |= b), c = a, a = a.return;

  return 3 === c.tag ? c.stateNode : null;
}

function Mj(a, b) {
  for (var c = a.callbackNode, d = a.suspendedLanes, e = a.pingedLanes, f = a.expirationTimes, g = a.pendingLanes; 0 < g;) {
    var h = 31 - Vc(g),
        k = 1 << h,
        l = f[h];

    if (-1 === l) {
      if (0 === (k & d) || 0 !== (k & e)) {
        l = b;
        Rc(k);
        var n = F;
        f[h] = 10 <= n ? l + 250 : 6 <= n ? l + 5E3 : -1;
      }
    } else l <= b && (a.expiredLanes |= k);

    g &= ~k;
  }

  d = Uc(a, a === U ? W : 0);
  b = F;
  if (0 === d) null !== c && (c !== Zf && Pf(c), a.callbackNode = null, a.callbackPriority = 0);else {
    if (null !== c) {
      if (a.callbackPriority === b) return;
      c !== Zf && Pf(c);
    }

    15 === b ? (c = Lj.bind(null, a), null === ag ? (ag = [c], bg = Of(Uf, jg)) : ag.push(c), c = Zf) : 14 === b ? c = hg(99, Lj.bind(null, a)) : (c = Tc(b), c = hg(c, Nj.bind(null, a)));
    a.callbackPriority = b;
    a.callbackNode = c;
  }
}

function Nj(a) {
  Fj = -1;
  Hj = Gj = 0;
  if (0 !== (X & 48)) throw Error(y(327));
  var b = a.callbackNode;
  if (Oj() && a.callbackNode !== b) return null;
  var c = Uc(a, a === U ? W : 0);
  if (0 === c) return null;
  var d = c;
  var e = X;
  X |= 16;
  var f = Pj();
  if (U !== a || W !== d) wj(), Qj(a, d);

  do try {
    Rj();
    break;
  } catch (h) {
    Sj(a, h);
  } while (1);

  qg();
  oj.current = f;
  X = e;
  null !== Y ? d = 0 : (U = null, W = 0, d = V);
  if (0 !== (tj & Hi)) Qj(a, 0);else if (0 !== d) {
    2 === d && (X |= 64, a.hydrate && (a.hydrate = !1, qf(a.containerInfo)), c = Wc(a), 0 !== c && (d = Tj(a, c)));
    if (1 === d) throw b = sj, Qj(a, 0), Ii(a, c), Mj(a, O()), b;
    a.finishedWork = a.current.alternate;
    a.finishedLanes = c;

    switch (d) {
      case 0:
      case 1:
        throw Error(y(345));

      case 2:
        Uj(a);
        break;

      case 3:
        Ii(a, c);

        if ((c & 62914560) === c && (d = jj + 500 - O(), 10 < d)) {
          if (0 !== Uc(a, 0)) break;
          e = a.suspendedLanes;

          if ((e & c) !== c) {
            Hg();
            a.pingedLanes |= a.suspendedLanes & e;
            break;
          }

          a.timeoutHandle = of(Uj.bind(null, a), d);
          break;
        }

        Uj(a);
        break;

      case 4:
        Ii(a, c);
        if ((c & 4186112) === c) break;
        d = a.eventTimes;

        for (e = -1; 0 < c;) {
          var g = 31 - Vc(c);
          f = 1 << g;
          g = d[g];
          g > e && (e = g);
          c &= ~f;
        }

        c = e;
        c = O() - c;
        c = (120 > c ? 120 : 480 > c ? 480 : 1080 > c ? 1080 : 1920 > c ? 1920 : 3E3 > c ? 3E3 : 4320 > c ? 4320 : 1960 * nj(c / 1960)) - c;

        if (10 < c) {
          a.timeoutHandle = of(Uj.bind(null, a), c);
          break;
        }

        Uj(a);
        break;

      case 5:
        Uj(a);
        break;

      default:
        throw Error(y(329));
    }
  }
  Mj(a, O());
  return a.callbackNode === b ? Nj.bind(null, a) : null;
}

function Ii(a, b) {
  b &= ~uj;
  b &= ~Hi;
  a.suspendedLanes |= b;
  a.pingedLanes &= ~b;

  for (a = a.expirationTimes; 0 < b;) {
    var c = 31 - Vc(b),
        d = 1 << c;
    a[c] = -1;
    b &= ~d;
  }
}

function Lj(a) {
  if (0 !== (X & 48)) throw Error(y(327));
  Oj();

  if (a === U && 0 !== (a.expiredLanes & W)) {
    var b = W;
    var c = Tj(a, b);
    0 !== (tj & Hi) && (b = Uc(a, b), c = Tj(a, b));
  } else b = Uc(a, 0), c = Tj(a, b);

  0 !== a.tag && 2 === c && (X |= 64, a.hydrate && (a.hydrate = !1, qf(a.containerInfo)), b = Wc(a), 0 !== b && (c = Tj(a, b)));
  if (1 === c) throw c = sj, Qj(a, 0), Ii(a, b), Mj(a, O()), c;
  a.finishedWork = a.current.alternate;
  a.finishedLanes = b;
  Uj(a);
  Mj(a, O());
  return null;
}

function Vj() {
  if (null !== Cj) {
    var a = Cj;
    Cj = null;
    a.forEach(function (a) {
      a.expiredLanes |= 24 & a.pendingLanes;
      Mj(a, O());
    });
  }

  ig();
}

function Wj(a, b) {
  var c = X;
  X |= 1;

  try {
    return a(b);
  } finally {
    X = c, 0 === X && (wj(), ig());
  }
}

function Xj(a, b) {
  var c = X;
  X &= -2;
  X |= 8;

  try {
    return a(b);
  } finally {
    X = c, 0 === X && (wj(), ig());
  }
}

function ni(a, b) {
  I(rj, qj);
  qj |= b;
  tj |= b;
}

function Ki() {
  qj = rj.current;
  H(rj);
}

function Qj(a, b) {
  a.finishedWork = null;
  a.finishedLanes = 0;
  var c = a.timeoutHandle;
  -1 !== c && (a.timeoutHandle = -1, pf(c));
  if (null !== Y) for (c = Y.return; null !== c;) {
    var d = c;

    switch (d.tag) {
      case 1:
        d = d.type.childContextTypes;
        null !== d && void 0 !== d && Gf();
        break;

      case 3:
        fh();
        H(N);
        H(M);
        uh();
        break;

      case 5:
        hh(d);
        break;

      case 4:
        fh();
        break;

      case 13:
        H(P);
        break;

      case 19:
        H(P);
        break;

      case 10:
        rg(d);
        break;

      case 23:
      case 24:
        Ki();
    }

    c = c.return;
  }
  U = a;
  Y = Tg(a.current, null);
  W = qj = tj = b;
  V = 0;
  sj = null;
  uj = Hi = Dg = 0;
}

function Sj(a, b) {
  do {
    var c = Y;

    try {
      qg();
      vh.current = Gh;

      if (yh) {
        for (var d = R.memoizedState; null !== d;) {
          var e = d.queue;
          null !== e && (e.pending = null);
          d = d.next;
        }

        yh = !1;
      }

      xh = 0;
      T = S = R = null;
      zh = !1;
      pj.current = null;

      if (null === c || null === c.return) {
        V = 1;
        sj = b;
        Y = null;
        break;
      }

      a: {
        var f = a,
            g = c.return,
            h = c,
            k = b;
        b = W;
        h.flags |= 2048;
        h.firstEffect = h.lastEffect = null;

        if (null !== k && "object" === typeof k && "function" === typeof k.then) {
          var l = k;

          if (0 === (h.mode & 2)) {
            var n = h.alternate;
            n ? (h.updateQueue = n.updateQueue, h.memoizedState = n.memoizedState, h.lanes = n.lanes) : (h.updateQueue = null, h.memoizedState = null);
          }

          var A = 0 !== (P.current & 1),
              p = g;

          do {
            var C;

            if (C = 13 === p.tag) {
              var x = p.memoizedState;
              if (null !== x) C = null !== x.dehydrated ? !0 : !1;else {
                var w = p.memoizedProps;
                C = void 0 === w.fallback ? !1 : !0 !== w.unstable_avoidThisFallback ? !0 : A ? !1 : !0;
              }
            }

            if (C) {
              var z = p.updateQueue;

              if (null === z) {
                var u = new Set();
                u.add(l);
                p.updateQueue = u;
              } else z.add(l);

              if (0 === (p.mode & 2)) {
                p.flags |= 64;
                h.flags |= 16384;
                h.flags &= -2981;
                if (1 === h.tag) if (null === h.alternate) h.tag = 17;else {
                  var t = zg(-1, 1);
                  t.tag = 2;
                  Ag(h, t);
                }
                h.lanes |= 1;
                break a;
              }

              k = void 0;
              h = b;
              var q = f.pingCache;
              null === q ? (q = f.pingCache = new Oi(), k = new Set(), q.set(l, k)) : (k = q.get(l), void 0 === k && (k = new Set(), q.set(l, k)));

              if (!k.has(h)) {
                k.add(h);
                var v = Yj.bind(null, f, l, h);
                l.then(v, v);
              }

              p.flags |= 4096;
              p.lanes = b;
              break a;
            }

            p = p.return;
          } while (null !== p);

          k = Error((Ra(h.type) || "A React component") + " suspended while rendering, but no fallback UI was specified.\n\nAdd a <Suspense fallback=...> component higher in the tree to provide a loading indicator or placeholder to display.");
        }

        5 !== V && (V = 2);
        k = Mi(k, h);
        p = g;

        do {
          switch (p.tag) {
            case 3:
              f = k;
              p.flags |= 4096;
              b &= -b;
              p.lanes |= b;
              var J = Pi(p, f, b);
              Bg(p, J);
              break a;

            case 1:
              f = k;
              var K = p.type,
                  Q = p.stateNode;

              if (0 === (p.flags & 64) && ("function" === typeof K.getDerivedStateFromError || null !== Q && "function" === typeof Q.componentDidCatch && (null === Ti || !Ti.has(Q)))) {
                p.flags |= 4096;
                b &= -b;
                p.lanes |= b;
                var L = Si(p, f, b);
                Bg(p, L);
                break a;
              }

          }

          p = p.return;
        } while (null !== p);
      }

      Zj(c);
    } catch (va) {
      b = va;
      Y === c && null !== c && (Y = c = c.return);
      continue;
    }

    break;
  } while (1);
}

function Pj() {
  var a = oj.current;
  oj.current = Gh;
  return null === a ? Gh : a;
}

function Tj(a, b) {
  var c = X;
  X |= 16;
  var d = Pj();
  U === a && W === b || Qj(a, b);

  do try {
    ak();
    break;
  } catch (e) {
    Sj(a, e);
  } while (1);

  qg();
  X = c;
  oj.current = d;
  if (null !== Y) throw Error(y(261));
  U = null;
  W = 0;
  return V;
}

function ak() {
  for (; null !== Y;) bk(Y);
}

function Rj() {
  for (; null !== Y && !Qf();) bk(Y);
}

function bk(a) {
  var b = ck(a.alternate, a, qj);
  a.memoizedProps = a.pendingProps;
  null === b ? Zj(a) : Y = b;
  pj.current = null;
}

function Zj(a) {
  var b = a;

  do {
    var c = b.alternate;
    a = b.return;

    if (0 === (b.flags & 2048)) {
      c = Gi(c, b, qj);

      if (null !== c) {
        Y = c;
        return;
      }

      c = b;

      if (24 !== c.tag && 23 !== c.tag || null === c.memoizedState || 0 !== (qj & 1073741824) || 0 === (c.mode & 4)) {
        for (var d = 0, e = c.child; null !== e;) d |= e.lanes | e.childLanes, e = e.sibling;

        c.childLanes = d;
      }

      null !== a && 0 === (a.flags & 2048) && (null === a.firstEffect && (a.firstEffect = b.firstEffect), null !== b.lastEffect && (null !== a.lastEffect && (a.lastEffect.nextEffect = b.firstEffect), a.lastEffect = b.lastEffect), 1 < b.flags && (null !== a.lastEffect ? a.lastEffect.nextEffect = b : a.firstEffect = b, a.lastEffect = b));
    } else {
      c = Li(b);

      if (null !== c) {
        c.flags &= 2047;
        Y = c;
        return;
      }

      null !== a && (a.firstEffect = a.lastEffect = null, a.flags |= 2048);
    }

    b = b.sibling;

    if (null !== b) {
      Y = b;
      return;
    }

    Y = b = a;
  } while (null !== b);

  0 === V && (V = 5);
}

function Uj(a) {
  var b = eg();
  gg(99, dk.bind(null, a, b));
  return null;
}

function dk(a, b) {
  do Oj(); while (null !== yj);

  if (0 !== (X & 48)) throw Error(y(327));
  var c = a.finishedWork;
  if (null === c) return null;
  a.finishedWork = null;
  a.finishedLanes = 0;
  if (c === a.current) throw Error(y(177));
  a.callbackNode = null;
  var d = c.lanes | c.childLanes,
      e = d,
      f = a.pendingLanes & ~e;
  a.pendingLanes = e;
  a.suspendedLanes = 0;
  a.pingedLanes = 0;
  a.expiredLanes &= e;
  a.mutableReadLanes &= e;
  a.entangledLanes &= e;
  e = a.entanglements;

  for (var g = a.eventTimes, h = a.expirationTimes; 0 < f;) {
    var k = 31 - Vc(f),
        l = 1 << k;
    e[k] = 0;
    g[k] = -1;
    h[k] = -1;
    f &= ~l;
  }

  null !== Cj && 0 === (d & 24) && Cj.has(a) && Cj.delete(a);
  a === U && (Y = U = null, W = 0);
  1 < c.flags ? null !== c.lastEffect ? (c.lastEffect.nextEffect = c, d = c.firstEffect) : d = c : d = c.firstEffect;

  if (null !== d) {
    e = X;
    X |= 32;
    pj.current = null;
    kf = fd;
    g = Ne();

    if (Oe(g)) {
      if ("selectionStart" in g) h = {
        start: g.selectionStart,
        end: g.selectionEnd
      };else a: if (h = (h = g.ownerDocument) && h.defaultView || window, (l = h.getSelection && h.getSelection()) && 0 !== l.rangeCount) {
        h = l.anchorNode;
        f = l.anchorOffset;
        k = l.focusNode;
        l = l.focusOffset;

        try {
          h.nodeType, k.nodeType;
        } catch (va) {
          h = null;
          break a;
        }

        var n = 0,
            A = -1,
            p = -1,
            C = 0,
            x = 0,
            w = g,
            z = null;

        b: for (;;) {
          for (var u;;) {
            w !== h || 0 !== f && 3 !== w.nodeType || (A = n + f);
            w !== k || 0 !== l && 3 !== w.nodeType || (p = n + l);
            3 === w.nodeType && (n += w.nodeValue.length);
            if (null === (u = w.firstChild)) break;
            z = w;
            w = u;
          }

          for (;;) {
            if (w === g) break b;
            z === h && ++C === f && (A = n);
            z === k && ++x === l && (p = n);
            if (null !== (u = w.nextSibling)) break;
            w = z;
            z = w.parentNode;
          }

          w = u;
        }

        h = -1 === A || -1 === p ? null : {
          start: A,
          end: p
        };
      } else h = null;
      h = h || {
        start: 0,
        end: 0
      };
    } else h = null;

    lf = {
      focusedElem: g,
      selectionRange: h
    };
    fd = !1;
    Ij = null;
    Jj = !1;
    Z = d;

    do try {
      ek();
    } catch (va) {
      if (null === Z) throw Error(y(330));
      Wi(Z, va);
      Z = Z.nextEffect;
    } while (null !== Z);

    Ij = null;
    Z = d;

    do try {
      for (g = a; null !== Z;) {
        var t = Z.flags;
        t & 16 && pb(Z.stateNode, "");

        if (t & 128) {
          var q = Z.alternate;

          if (null !== q) {
            var v = q.ref;
            null !== v && ("function" === typeof v ? v(null) : v.current = null);
          }
        }

        switch (t & 1038) {
          case 2:
            fj(Z);
            Z.flags &= -3;
            break;

          case 6:
            fj(Z);
            Z.flags &= -3;
            ij(Z.alternate, Z);
            break;

          case 1024:
            Z.flags &= -1025;
            break;

          case 1028:
            Z.flags &= -1025;
            ij(Z.alternate, Z);
            break;

          case 4:
            ij(Z.alternate, Z);
            break;

          case 8:
            h = Z;
            cj(g, h);
            var J = h.alternate;
            dj(h);
            null !== J && dj(J);
        }

        Z = Z.nextEffect;
      }
    } catch (va) {
      if (null === Z) throw Error(y(330));
      Wi(Z, va);
      Z = Z.nextEffect;
    } while (null !== Z);

    v = lf;
    q = Ne();
    t = v.focusedElem;
    g = v.selectionRange;

    if (q !== t && t && t.ownerDocument && Me(t.ownerDocument.documentElement, t)) {
      null !== g && Oe(t) && (q = g.start, v = g.end, void 0 === v && (v = q), "selectionStart" in t ? (t.selectionStart = q, t.selectionEnd = Math.min(v, t.value.length)) : (v = (q = t.ownerDocument || document) && q.defaultView || window, v.getSelection && (v = v.getSelection(), h = t.textContent.length, J = Math.min(g.start, h), g = void 0 === g.end ? J : Math.min(g.end, h), !v.extend && J > g && (h = g, g = J, J = h), h = Le(t, J), f = Le(t, g), h && f && (1 !== v.rangeCount || v.anchorNode !== h.node || v.anchorOffset !== h.offset || v.focusNode !== f.node || v.focusOffset !== f.offset) && (q = q.createRange(), q.setStart(h.node, h.offset), v.removeAllRanges(), J > g ? (v.addRange(q), v.extend(f.node, f.offset)) : (q.setEnd(f.node, f.offset), v.addRange(q))))));
      q = [];

      for (v = t; v = v.parentNode;) 1 === v.nodeType && q.push({
        element: v,
        left: v.scrollLeft,
        top: v.scrollTop
      });

      "function" === typeof t.focus && t.focus();

      for (t = 0; t < q.length; t++) v = q[t], v.element.scrollLeft = v.left, v.element.scrollTop = v.top;
    }

    fd = !!kf;
    lf = kf = null;
    a.current = c;
    Z = d;

    do try {
      for (t = a; null !== Z;) {
        var K = Z.flags;
        K & 36 && Yi(t, Z.alternate, Z);

        if (K & 128) {
          q = void 0;
          var Q = Z.ref;

          if (null !== Q) {
            var L = Z.stateNode;

            switch (Z.tag) {
              case 5:
                q = L;
                break;

              default:
                q = L;
            }

            "function" === typeof Q ? Q(q) : Q.current = q;
          }
        }

        Z = Z.nextEffect;
      }
    } catch (va) {
      if (null === Z) throw Error(y(330));
      Wi(Z, va);
      Z = Z.nextEffect;
    } while (null !== Z);

    Z = null;
    $f();
    X = e;
  } else a.current = c;

  if (xj) xj = !1, yj = a, zj = b;else for (Z = d; null !== Z;) b = Z.nextEffect, Z.nextEffect = null, Z.flags & 8 && (K = Z, K.sibling = null, K.stateNode = null), Z = b;
  d = a.pendingLanes;
  0 === d && (Ti = null);
  1 === d ? a === Ej ? Dj++ : (Dj = 0, Ej = a) : Dj = 0;
  c = c.stateNode;
  if (Mf && "function" === typeof Mf.onCommitFiberRoot) try {
    Mf.onCommitFiberRoot(Lf, c, void 0, 64 === (c.current.flags & 64));
  } catch (va) {}
  Mj(a, O());
  if (Qi) throw Qi = !1, a = Ri, Ri = null, a;
  if (0 !== (X & 8)) return null;
  ig();
  return null;
}

function ek() {
  for (; null !== Z;) {
    var a = Z.alternate;
    Jj || null === Ij || (0 !== (Z.flags & 8) ? dc(Z, Ij) && (Jj = !0) : 13 === Z.tag && mj(a, Z) && dc(Z, Ij) && (Jj = !0));
    var b = Z.flags;
    0 !== (b & 256) && Xi(a, Z);
    0 === (b & 512) || xj || (xj = !0, hg(97, function () {
      Oj();
      return null;
    }));
    Z = Z.nextEffect;
  }
}

function Oj() {
  if (90 !== zj) {
    var a = 97 < zj ? 97 : zj;
    zj = 90;
    return gg(a, fk);
  }

  return !1;
}

function $i(a, b) {
  Aj.push(b, a);
  xj || (xj = !0, hg(97, function () {
    Oj();
    return null;
  }));
}

function Zi(a, b) {
  Bj.push(b, a);
  xj || (xj = !0, hg(97, function () {
    Oj();
    return null;
  }));
}

function fk() {
  if (null === yj) return !1;
  var a = yj;
  yj = null;
  if (0 !== (X & 48)) throw Error(y(331));
  var b = X;
  X |= 32;
  var c = Bj;
  Bj = [];

  for (var d = 0; d < c.length; d += 2) {
    var e = c[d],
        f = c[d + 1],
        g = e.destroy;
    e.destroy = void 0;
    if ("function" === typeof g) try {
      g();
    } catch (k) {
      if (null === f) throw Error(y(330));
      Wi(f, k);
    }
  }

  c = Aj;
  Aj = [];

  for (d = 0; d < c.length; d += 2) {
    e = c[d];
    f = c[d + 1];

    try {
      var h = e.create;
      e.destroy = h();
    } catch (k) {
      if (null === f) throw Error(y(330));
      Wi(f, k);
    }
  }

  for (h = a.current.firstEffect; null !== h;) a = h.nextEffect, h.nextEffect = null, h.flags & 8 && (h.sibling = null, h.stateNode = null), h = a;

  X = b;
  ig();
  return !0;
}

function gk(a, b, c) {
  b = Mi(c, b);
  b = Pi(a, b, 1);
  Ag(a, b);
  b = Hg();
  a = Kj(a, 1);
  null !== a && ($c(a, 1, b), Mj(a, b));
}

function Wi(a, b) {
  if (3 === a.tag) gk(a, a, b);else for (var c = a.return; null !== c;) {
    if (3 === c.tag) {
      gk(c, a, b);
      break;
    } else if (1 === c.tag) {
      var d = c.stateNode;

      if ("function" === typeof c.type.getDerivedStateFromError || "function" === typeof d.componentDidCatch && (null === Ti || !Ti.has(d))) {
        a = Mi(b, a);
        var e = Si(c, a, 1);
        Ag(c, e);
        e = Hg();
        c = Kj(c, 1);
        if (null !== c) $c(c, 1, e), Mj(c, e);else if ("function" === typeof d.componentDidCatch && (null === Ti || !Ti.has(d))) try {
          d.componentDidCatch(b, a);
        } catch (f) {}
        break;
      }
    }

    c = c.return;
  }
}

function Yj(a, b, c) {
  var d = a.pingCache;
  null !== d && d.delete(b);
  b = Hg();
  a.pingedLanes |= a.suspendedLanes & c;
  U === a && (W & c) === c && (4 === V || 3 === V && (W & 62914560) === W && 500 > O() - jj ? Qj(a, 0) : uj |= c);
  Mj(a, b);
}

function lj(a, b) {
  var c = a.stateNode;
  null !== c && c.delete(b);
  b = 0;
  0 === b && (b = a.mode, 0 === (b & 2) ? b = 1 : 0 === (b & 4) ? b = 99 === eg() ? 1 : 2 : (0 === Gj && (Gj = tj), b = Yc(62914560 & ~Gj), 0 === b && (b = 4194304)));
  c = Hg();
  a = Kj(a, b);
  null !== a && ($c(a, b, c), Mj(a, c));
}

var ck;

ck = function (a, b, c) {
  var d = b.lanes;
  if (null !== a) {
    if (a.memoizedProps !== b.pendingProps || N.current) ug = !0;else if (0 !== (c & d)) ug = 0 !== (a.flags & 16384) ? !0 : !1;else {
      ug = !1;

      switch (b.tag) {
        case 3:
          ri(b);
          sh();
          break;

        case 5:
          gh(b);
          break;

        case 1:
          Ff(b.type) && Jf(b);
          break;

        case 4:
          eh(b, b.stateNode.containerInfo);
          break;

        case 10:
          d = b.memoizedProps.value;
          var e = b.type._context;
          I(mg, e._currentValue);
          e._currentValue = d;
          break;

        case 13:
          if (null !== b.memoizedState) {
            if (0 !== (c & b.child.childLanes)) return ti(a, b, c);
            I(P, P.current & 1);
            b = hi(a, b, c);
            return null !== b ? b.sibling : null;
          }

          I(P, P.current & 1);
          break;

        case 19:
          d = 0 !== (c & b.childLanes);

          if (0 !== (a.flags & 64)) {
            if (d) return Ai(a, b, c);
            b.flags |= 64;
          }

          e = b.memoizedState;
          null !== e && (e.rendering = null, e.tail = null, e.lastEffect = null);
          I(P, P.current);
          if (d) break;else return null;

        case 23:
        case 24:
          return b.lanes = 0, mi(a, b, c);
      }

      return hi(a, b, c);
    }
  } else ug = !1;
  b.lanes = 0;

  switch (b.tag) {
    case 2:
      d = b.type;
      null !== a && (a.alternate = null, b.alternate = null, b.flags |= 2);
      a = b.pendingProps;
      e = Ef(b, M.current);
      tg(b, c);
      e = Ch(null, b, d, a, e, c);
      b.flags |= 1;

      if ("object" === typeof e && null !== e && "function" === typeof e.render && void 0 === e.$$typeof) {
        b.tag = 1;
        b.memoizedState = null;
        b.updateQueue = null;

        if (Ff(d)) {
          var f = !0;
          Jf(b);
        } else f = !1;

        b.memoizedState = null !== e.state && void 0 !== e.state ? e.state : null;
        xg(b);
        var g = d.getDerivedStateFromProps;
        "function" === typeof g && Gg(b, d, g, a);
        e.updater = Kg;
        b.stateNode = e;
        e._reactInternals = b;
        Og(b, d, a, c);
        b = qi(null, b, d, !0, f, c);
      } else b.tag = 0, fi(null, b, e, c), b = b.child;

      return b;

    case 16:
      e = b.elementType;

      a: {
        null !== a && (a.alternate = null, b.alternate = null, b.flags |= 2);
        a = b.pendingProps;
        f = e._init;
        e = f(e._payload);
        b.type = e;
        f = b.tag = hk(e);
        a = lg(e, a);

        switch (f) {
          case 0:
            b = li(null, b, e, a, c);
            break a;

          case 1:
            b = pi(null, b, e, a, c);
            break a;

          case 11:
            b = gi(null, b, e, a, c);
            break a;

          case 14:
            b = ii(null, b, e, lg(e.type, a), d, c);
            break a;
        }

        throw Error(y(306, e, ""));
      }

      return b;

    case 0:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : lg(d, e), li(a, b, d, e, c);

    case 1:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : lg(d, e), pi(a, b, d, e, c);

    case 3:
      ri(b);
      d = b.updateQueue;
      if (null === a || null === d) throw Error(y(282));
      d = b.pendingProps;
      e = b.memoizedState;
      e = null !== e ? e.element : null;
      yg(a, b);
      Cg(b, d, null, c);
      d = b.memoizedState.element;
      if (d === e) sh(), b = hi(a, b, c);else {
        e = b.stateNode;
        if (f = e.hydrate) kh = rf(b.stateNode.containerInfo.firstChild), jh = b, f = lh = !0;

        if (f) {
          a = e.mutableSourceEagerHydrationData;
          if (null != a) for (e = 0; e < a.length; e += 2) f = a[e], f._workInProgressVersionPrimary = a[e + 1], th.push(f);
          c = Zg(b, null, d, c);

          for (b.child = c; c;) c.flags = c.flags & -3 | 1024, c = c.sibling;
        } else fi(a, b, d, c), sh();

        b = b.child;
      }
      return b;

    case 5:
      return gh(b), null === a && ph(b), d = b.type, e = b.pendingProps, f = null !== a ? a.memoizedProps : null, g = e.children, nf(d, e) ? g = null : null !== f && nf(d, f) && (b.flags |= 16), oi(a, b), fi(a, b, g, c), b.child;

    case 6:
      return null === a && ph(b), null;

    case 13:
      return ti(a, b, c);

    case 4:
      return eh(b, b.stateNode.containerInfo), d = b.pendingProps, null === a ? b.child = Yg(b, null, d, c) : fi(a, b, d, c), b.child;

    case 11:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : lg(d, e), gi(a, b, d, e, c);

    case 7:
      return fi(a, b, b.pendingProps, c), b.child;

    case 8:
      return fi(a, b, b.pendingProps.children, c), b.child;

    case 12:
      return fi(a, b, b.pendingProps.children, c), b.child;

    case 10:
      a: {
        d = b.type._context;
        e = b.pendingProps;
        g = b.memoizedProps;
        f = e.value;
        var h = b.type._context;
        I(mg, h._currentValue);
        h._currentValue = f;
        if (null !== g) if (h = g.value, f = He(h, f) ? 0 : ("function" === typeof d._calculateChangedBits ? d._calculateChangedBits(h, f) : 1073741823) | 0, 0 === f) {
          if (g.children === e.children && !N.current) {
            b = hi(a, b, c);
            break a;
          }
        } else for (h = b.child, null !== h && (h.return = b); null !== h;) {
          var k = h.dependencies;

          if (null !== k) {
            g = h.child;

            for (var l = k.firstContext; null !== l;) {
              if (l.context === d && 0 !== (l.observedBits & f)) {
                1 === h.tag && (l = zg(-1, c & -c), l.tag = 2, Ag(h, l));
                h.lanes |= c;
                l = h.alternate;
                null !== l && (l.lanes |= c);
                sg(h.return, c);
                k.lanes |= c;
                break;
              }

              l = l.next;
            }
          } else g = 10 === h.tag ? h.type === b.type ? null : h.child : h.child;

          if (null !== g) g.return = h;else for (g = h; null !== g;) {
            if (g === b) {
              g = null;
              break;
            }

            h = g.sibling;

            if (null !== h) {
              h.return = g.return;
              g = h;
              break;
            }

            g = g.return;
          }
          h = g;
        }
        fi(a, b, e.children, c);
        b = b.child;
      }

      return b;

    case 9:
      return e = b.type, f = b.pendingProps, d = f.children, tg(b, c), e = vg(e, f.unstable_observedBits), d = d(e), b.flags |= 1, fi(a, b, d, c), b.child;

    case 14:
      return e = b.type, f = lg(e, b.pendingProps), f = lg(e.type, f), ii(a, b, e, f, d, c);

    case 15:
      return ki(a, b, b.type, b.pendingProps, d, c);

    case 17:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : lg(d, e), null !== a && (a.alternate = null, b.alternate = null, b.flags |= 2), b.tag = 1, Ff(d) ? (a = !0, Jf(b)) : a = !1, tg(b, c), Mg(b, d, e), Og(b, d, e, c), qi(null, b, d, !0, a, c);

    case 19:
      return Ai(a, b, c);

    case 23:
      return mi(a, b, c);

    case 24:
      return mi(a, b, c);
  }

  throw Error(y(156, b.tag));
};

function ik(a, b, c, d) {
  this.tag = a;
  this.key = c;
  this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null;
  this.index = 0;
  this.ref = null;
  this.pendingProps = b;
  this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null;
  this.mode = d;
  this.flags = 0;
  this.lastEffect = this.firstEffect = this.nextEffect = null;
  this.childLanes = this.lanes = 0;
  this.alternate = null;
}

function nh(a, b, c, d) {
  return new ik(a, b, c, d);
}

function ji(a) {
  a = a.prototype;
  return !(!a || !a.isReactComponent);
}

function hk(a) {
  if ("function" === typeof a) return ji(a) ? 1 : 0;

  if (void 0 !== a && null !== a) {
    a = a.$$typeof;
    if (a === Aa) return 11;
    if (a === Da) return 14;
  }

  return 2;
}

function Tg(a, b) {
  var c = a.alternate;
  null === c ? (c = nh(a.tag, b, a.key, a.mode), c.elementType = a.elementType, c.type = a.type, c.stateNode = a.stateNode, c.alternate = a, a.alternate = c) : (c.pendingProps = b, c.type = a.type, c.flags = 0, c.nextEffect = null, c.firstEffect = null, c.lastEffect = null);
  c.childLanes = a.childLanes;
  c.lanes = a.lanes;
  c.child = a.child;
  c.memoizedProps = a.memoizedProps;
  c.memoizedState = a.memoizedState;
  c.updateQueue = a.updateQueue;
  b = a.dependencies;
  c.dependencies = null === b ? null : {
    lanes: b.lanes,
    firstContext: b.firstContext
  };
  c.sibling = a.sibling;
  c.index = a.index;
  c.ref = a.ref;
  return c;
}

function Vg(a, b, c, d, e, f) {
  var g = 2;
  d = a;
  if ("function" === typeof a) ji(a) && (g = 1);else if ("string" === typeof a) g = 5;else a: switch (a) {
    case ua:
      return Xg(c.children, e, f, b);

    case Ha:
      g = 8;
      e |= 16;
      break;

    case wa:
      g = 8;
      e |= 1;
      break;

    case xa:
      return a = nh(12, c, b, e | 8), a.elementType = xa, a.type = xa, a.lanes = f, a;

    case Ba:
      return a = nh(13, c, b, e), a.type = Ba, a.elementType = Ba, a.lanes = f, a;

    case Ca:
      return a = nh(19, c, b, e), a.elementType = Ca, a.lanes = f, a;

    case Ia:
      return vi(c, e, f, b);

    case Ja:
      return a = nh(24, c, b, e), a.elementType = Ja, a.lanes = f, a;

    default:
      if ("object" === typeof a && null !== a) switch (a.$$typeof) {
        case ya:
          g = 10;
          break a;

        case za:
          g = 9;
          break a;

        case Aa:
          g = 11;
          break a;

        case Da:
          g = 14;
          break a;

        case Ea:
          g = 16;
          d = null;
          break a;

        case Fa:
          g = 22;
          break a;
      }
      throw Error(y(130, null == a ? a : typeof a, ""));
  }
  b = nh(g, c, b, e);
  b.elementType = a;
  b.type = d;
  b.lanes = f;
  return b;
}

function Xg(a, b, c, d) {
  a = nh(7, a, d, b);
  a.lanes = c;
  return a;
}

function vi(a, b, c, d) {
  a = nh(23, a, d, b);
  a.elementType = Ia;
  a.lanes = c;
  return a;
}

function Ug(a, b, c) {
  a = nh(6, a, null, b);
  a.lanes = c;
  return a;
}

function Wg(a, b, c) {
  b = nh(4, null !== a.children ? a.children : [], a.key, b);
  b.lanes = c;
  b.stateNode = {
    containerInfo: a.containerInfo,
    pendingChildren: null,
    implementation: a.implementation
  };
  return b;
}

function jk(a, b, c) {
  this.tag = b;
  this.containerInfo = a;
  this.finishedWork = this.pingCache = this.current = this.pendingChildren = null;
  this.timeoutHandle = -1;
  this.pendingContext = this.context = null;
  this.hydrate = c;
  this.callbackNode = null;
  this.callbackPriority = 0;
  this.eventTimes = Zc(0);
  this.expirationTimes = Zc(-1);
  this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0;
  this.entanglements = Zc(0);
  this.mutableSourceEagerHydrationData = null;
}

function kk(a, b, c) {
  var d = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
  return {
    $$typeof: ta,
    key: null == d ? null : "" + d,
    children: a,
    containerInfo: b,
    implementation: c
  };
}

function lk(a, b, c, d) {
  var e = b.current,
      f = Hg(),
      g = Ig(e);

  a: if (c) {
    c = c._reactInternals;

    b: {
      if (Zb(c) !== c || 1 !== c.tag) throw Error(y(170));
      var h = c;

      do {
        switch (h.tag) {
          case 3:
            h = h.stateNode.context;
            break b;

          case 1:
            if (Ff(h.type)) {
              h = h.stateNode.__reactInternalMemoizedMergedChildContext;
              break b;
            }

        }

        h = h.return;
      } while (null !== h);

      throw Error(y(171));
    }

    if (1 === c.tag) {
      var k = c.type;

      if (Ff(k)) {
        c = If(c, k, h);
        break a;
      }
    }

    c = h;
  } else c = Cf;

  null === b.context ? b.context = c : b.pendingContext = c;
  b = zg(f, g);
  b.payload = {
    element: a
  };
  d = void 0 === d ? null : d;
  null !== d && (b.callback = d);
  Ag(e, b);
  Jg(e, g, f);
  return g;
}

function mk(a) {
  a = a.current;
  if (!a.child) return null;

  switch (a.child.tag) {
    case 5:
      return a.child.stateNode;

    default:
      return a.child.stateNode;
  }
}

function nk(a, b) {
  a = a.memoizedState;

  if (null !== a && null !== a.dehydrated) {
    var c = a.retryLane;
    a.retryLane = 0 !== c && c < b ? c : b;
  }
}

function ok(a, b) {
  nk(a, b);
  (a = a.alternate) && nk(a, b);
}

function pk() {
  return null;
}

function qk(a, b, c) {
  var d = null != c && null != c.hydrationOptions && c.hydrationOptions.mutableSources || null;
  c = new jk(a, b, null != c && !0 === c.hydrate);
  b = nh(3, null, null, 2 === b ? 7 : 1 === b ? 3 : 0);
  c.current = b;
  b.stateNode = c;
  xg(b);
  a[ff] = c.current;
  cf(8 === a.nodeType ? a.parentNode : a);
  if (d) for (a = 0; a < d.length; a++) {
    b = d[a];
    var e = b._getVersion;
    e = e(b._source);
    null == c.mutableSourceEagerHydrationData ? c.mutableSourceEagerHydrationData = [b, e] : c.mutableSourceEagerHydrationData.push(b, e);
  }
  this._internalRoot = c;
}

qk.prototype.render = function (a) {
  lk(a, this._internalRoot, null, null);
};

qk.prototype.unmount = function () {
  var a = this._internalRoot,
      b = a.containerInfo;
  lk(null, a, null, function () {
    b[ff] = null;
  });
};

function rk(a) {
  return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType && (8 !== a.nodeType || " react-mount-point-unstable " !== a.nodeValue));
}

function sk(a, b) {
  b || (b = a ? 9 === a.nodeType ? a.documentElement : a.firstChild : null, b = !(!b || 1 !== b.nodeType || !b.hasAttribute("data-reactroot")));
  if (!b) for (var c; c = a.lastChild;) a.removeChild(c);
  return new qk(a, 0, b ? {
    hydrate: !0
  } : void 0);
}

function tk(a, b, c, d, e) {
  var f = c._reactRootContainer;

  if (f) {
    var g = f._internalRoot;

    if ("function" === typeof e) {
      var h = e;

      e = function () {
        var a = mk(g);
        h.call(a);
      };
    }

    lk(b, g, a, e);
  } else {
    f = c._reactRootContainer = sk(c, d);
    g = f._internalRoot;

    if ("function" === typeof e) {
      var k = e;

      e = function () {
        var a = mk(g);
        k.call(a);
      };
    }

    Xj(function () {
      lk(b, g, a, e);
    });
  }

  return mk(g);
}

ec = function (a) {
  if (13 === a.tag) {
    var b = Hg();
    Jg(a, 4, b);
    ok(a, 4);
  }
};

fc = function (a) {
  if (13 === a.tag) {
    var b = Hg();
    Jg(a, 67108864, b);
    ok(a, 67108864);
  }
};

gc = function (a) {
  if (13 === a.tag) {
    var b = Hg(),
        c = Ig(a);
    Jg(a, c, b);
    ok(a, c);
  }
};

hc = function (a, b) {
  return b();
};

yb = function (a, b, c) {
  switch (b) {
    case "input":
      ab(a, c);
      b = c.name;

      if ("radio" === c.type && null != b) {
        for (c = a; c.parentNode;) c = c.parentNode;

        c = c.querySelectorAll("input[name=" + JSON.stringify("" + b) + '][type="radio"]');

        for (b = 0; b < c.length; b++) {
          var d = c[b];

          if (d !== a && d.form === a.form) {
            var e = Db(d);
            if (!e) throw Error(y(90));
            Wa(d);
            ab(d, e);
          }
        }
      }

      break;

    case "textarea":
      ib(a, c);
      break;

    case "select":
      b = c.value, null != b && fb(a, !!c.multiple, b, !1);
  }
};

Gb = Wj;

Hb = function (a, b, c, d, e) {
  var f = X;
  X |= 4;

  try {
    return gg(98, a.bind(null, b, c, d, e));
  } finally {
    X = f, 0 === X && (wj(), ig());
  }
};

Ib = function () {
  0 === (X & 49) && (Vj(), Oj());
};

Jb = function (a, b) {
  var c = X;
  X |= 2;

  try {
    return a(b);
  } finally {
    X = c, 0 === X && (wj(), ig());
  }
};

function uk(a, b) {
  var c = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
  if (!rk(b)) throw Error(y(200));
  return kk(a, b, null, c);
}

var vk = {
  Events: [Cb, ue, Db, Eb, Fb, Oj, {
    current: !1
  }]
},
    wk = {
  findFiberByHostInstance: wc,
  bundleType: 0,
  version: "17.0.1",
  rendererPackageName: "react-dom"
};
var xk = {
  bundleType: wk.bundleType,
  version: wk.version,
  rendererPackageName: wk.rendererPackageName,
  rendererConfig: wk.rendererConfig,
  overrideHookState: null,
  overrideHookStateDeletePath: null,
  overrideHookStateRenamePath: null,
  overrideProps: null,
  overridePropsDeletePath: null,
  overridePropsRenamePath: null,
  setSuspenseHandler: null,
  scheduleUpdate: null,
  currentDispatcherRef: ra.ReactCurrentDispatcher,
  findHostInstanceByFiber: function (a) {
    a = cc(a);
    return null === a ? null : a.stateNode;
  },
  findFiberByHostInstance: wk.findFiberByHostInstance || pk,
  findHostInstancesForRefresh: null,
  scheduleRefresh: null,
  scheduleRoot: null,
  setRefreshHandler: null,
  getCurrentFiber: null
};

if ("undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) {
  var yk = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!yk.isDisabled && yk.supportsFiber) try {
    Lf = yk.inject(xk), Mf = yk;
  } catch (a) {}
}

__webpack_unused_export__ = vk;
exports.createPortal = uk;

__webpack_unused_export__ = function (a) {
  if (null == a) return null;
  if (1 === a.nodeType) return a;
  var b = a._reactInternals;

  if (void 0 === b) {
    if ("function" === typeof a.render) throw Error(y(188));
    throw Error(y(268, Object.keys(a)));
  }

  a = cc(b);
  a = null === a ? null : a.stateNode;
  return a;
};

__webpack_unused_export__ = function (a, b) {
  var c = X;
  if (0 !== (c & 48)) return a(b);
  X |= 1;

  try {
    if (a) return gg(99, a.bind(null, b));
  } finally {
    X = c, ig();
  }
};

__webpack_unused_export__ = function (a, b, c) {
  if (!rk(b)) throw Error(y(200));
  return tk(null, a, b, !0, c);
};

exports.render = function (a, b, c) {
  if (!rk(b)) throw Error(y(200));
  return tk(null, a, b, !1, c);
};

__webpack_unused_export__ = function (a) {
  if (!rk(a)) throw Error(y(40));
  return a._reactRootContainer ? (Xj(function () {
    tk(null, null, a, !1, function () {
      a._reactRootContainer = null;
      a[ff] = null;
    });
  }), !0) : !1;
};

exports.unstable_batchedUpdates = Wj;

__webpack_unused_export__ = function (a, b) {
  return uk(a, b, 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null);
};

__webpack_unused_export__ = function (a, b, c, d) {
  if (!rk(c)) throw Error(y(200));
  if (null == a || void 0 === a._reactInternals) throw Error(y(38));
  return tk(a, b, c, !1, d);
};

__webpack_unused_export__ = "17.0.1";

/***/ }),

/***/ 169:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


function checkDCE() {
  /* global __REACT_DEVTOOLS_GLOBAL_HOOK__ */
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === 'undefined' || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== 'function') {
    return;
  }

  if (false) {}

  try {
    // Verify that the code above has been dead code eliminated (DCE'd).
    __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
  } catch (err) {
    // DevTools shouldn't crash React, no matter what.
    // We should still report in case we break this code.
    console.error(err);
  }
}

if (true) {
  // DCE check should happen before ReactDOM bundle executes so that
  // DevTools can report bad minification during injection.
  checkDCE();
  module.exports = __webpack_require__(802);
} else {}

/***/ }),

/***/ 15:
/***/ (function(__unused_webpack_module, exports) {

"use strict";
/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


var b = "function" === typeof Symbol && Symbol.for,
    c = b ? Symbol.for("react.element") : 60103,
    d = b ? Symbol.for("react.portal") : 60106,
    e = b ? Symbol.for("react.fragment") : 60107,
    f = b ? Symbol.for("react.strict_mode") : 60108,
    g = b ? Symbol.for("react.profiler") : 60114,
    h = b ? Symbol.for("react.provider") : 60109,
    k = b ? Symbol.for("react.context") : 60110,
    l = b ? Symbol.for("react.async_mode") : 60111,
    m = b ? Symbol.for("react.concurrent_mode") : 60111,
    n = b ? Symbol.for("react.forward_ref") : 60112,
    p = b ? Symbol.for("react.suspense") : 60113,
    q = b ? Symbol.for("react.suspense_list") : 60120,
    r = b ? Symbol.for("react.memo") : 60115,
    t = b ? Symbol.for("react.lazy") : 60116,
    v = b ? Symbol.for("react.block") : 60121,
    w = b ? Symbol.for("react.fundamental") : 60117,
    x = b ? Symbol.for("react.responder") : 60118,
    y = b ? Symbol.for("react.scope") : 60119;

function z(a) {
  if ("object" === typeof a && null !== a) {
    var u = a.$$typeof;

    switch (u) {
      case c:
        switch (a = a.type, a) {
          case l:
          case m:
          case e:
          case g:
          case f:
          case p:
            return a;

          default:
            switch (a = a && a.$$typeof, a) {
              case k:
              case n:
              case t:
              case r:
              case h:
                return a;

              default:
                return u;
            }

        }

      case d:
        return u;
    }
  }
}

function A(a) {
  return z(a) === m;
}

exports.AsyncMode = l;
exports.ConcurrentMode = m;
exports.ContextConsumer = k;
exports.ContextProvider = h;
exports.Element = c;
exports.ForwardRef = n;
exports.Fragment = e;
exports.Lazy = t;
exports.Memo = r;
exports.Portal = d;
exports.Profiler = g;
exports.StrictMode = f;
exports.Suspense = p;

exports.isAsyncMode = function (a) {
  return A(a) || z(a) === l;
};

exports.isConcurrentMode = A;

exports.isContextConsumer = function (a) {
  return z(a) === k;
};

exports.isContextProvider = function (a) {
  return z(a) === h;
};

exports.isElement = function (a) {
  return "object" === typeof a && null !== a && a.$$typeof === c;
};

exports.isForwardRef = function (a) {
  return z(a) === n;
};

exports.isFragment = function (a) {
  return z(a) === e;
};

exports.isLazy = function (a) {
  return z(a) === t;
};

exports.isMemo = function (a) {
  return z(a) === r;
};

exports.isPortal = function (a) {
  return z(a) === d;
};

exports.isProfiler = function (a) {
  return z(a) === g;
};

exports.isStrictMode = function (a) {
  return z(a) === f;
};

exports.isSuspense = function (a) {
  return z(a) === p;
};

exports.isValidElementType = function (a) {
  return "string" === typeof a || "function" === typeof a || a === e || a === m || a === g || a === f || a === p || a === q || "object" === typeof a && null !== a && (a.$$typeof === t || a.$$typeof === r || a.$$typeof === h || a.$$typeof === k || a.$$typeof === n || a.$$typeof === w || a.$$typeof === x || a.$$typeof === y || a.$$typeof === v);
};

exports.typeOf = z;

/***/ }),

/***/ 532:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


if (true) {
  module.exports = __webpack_require__(15);
} else {}

/***/ }),

/***/ 563:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
/** @license React v17.0.1
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


var l = __webpack_require__(103),
    n = 60103,
    p = 60106;

exports.Fragment = 60107;
exports.StrictMode = 60108;
exports.Profiler = 60114;
var q = 60109,
    r = 60110,
    t = 60112;
exports.Suspense = 60113;
var u = 60115,
    v = 60116;

if ("function" === typeof Symbol && Symbol.for) {
  var w = Symbol.for;
  n = w("react.element");
  p = w("react.portal");
  exports.Fragment = w("react.fragment");
  exports.StrictMode = w("react.strict_mode");
  exports.Profiler = w("react.profiler");
  q = w("react.provider");
  r = w("react.context");
  t = w("react.forward_ref");
  exports.Suspense = w("react.suspense");
  u = w("react.memo");
  v = w("react.lazy");
}

var x = "function" === typeof Symbol && Symbol.iterator;

function y(a) {
  if (null === a || "object" !== typeof a) return null;
  a = x && a[x] || a["@@iterator"];
  return "function" === typeof a ? a : null;
}

function z(a) {
  for (var b = "https://reactjs.org/docs/error-decoder.html?invariant=" + a, c = 1; c < arguments.length; c++) b += "&args[]=" + encodeURIComponent(arguments[c]);

  return "Minified React error #" + a + "; visit " + b + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
}

var A = {
  isMounted: function () {
    return !1;
  },
  enqueueForceUpdate: function () {},
  enqueueReplaceState: function () {},
  enqueueSetState: function () {}
},
    B = {};

function C(a, b, c) {
  this.props = a;
  this.context = b;
  this.refs = B;
  this.updater = c || A;
}

C.prototype.isReactComponent = {};

C.prototype.setState = function (a, b) {
  if ("object" !== typeof a && "function" !== typeof a && null != a) throw Error(z(85));
  this.updater.enqueueSetState(this, a, b, "setState");
};

C.prototype.forceUpdate = function (a) {
  this.updater.enqueueForceUpdate(this, a, "forceUpdate");
};

function D() {}

D.prototype = C.prototype;

function E(a, b, c) {
  this.props = a;
  this.context = b;
  this.refs = B;
  this.updater = c || A;
}

var F = E.prototype = new D();
F.constructor = E;
l(F, C.prototype);
F.isPureReactComponent = !0;
var G = {
  current: null
},
    H = Object.prototype.hasOwnProperty,
    I = {
  key: !0,
  ref: !0,
  __self: !0,
  __source: !0
};

function J(a, b, c) {
  var e,
      d = {},
      k = null,
      h = null;
  if (null != b) for (e in void 0 !== b.ref && (h = b.ref), void 0 !== b.key && (k = "" + b.key), b) H.call(b, e) && !I.hasOwnProperty(e) && (d[e] = b[e]);
  var g = arguments.length - 2;
  if (1 === g) d.children = c;else if (1 < g) {
    for (var f = Array(g), m = 0; m < g; m++) f[m] = arguments[m + 2];

    d.children = f;
  }
  if (a && a.defaultProps) for (e in g = a.defaultProps, g) void 0 === d[e] && (d[e] = g[e]);
  return {
    $$typeof: n,
    type: a,
    key: k,
    ref: h,
    props: d,
    _owner: G.current
  };
}

function K(a, b) {
  return {
    $$typeof: n,
    type: a.type,
    key: b,
    ref: a.ref,
    props: a.props,
    _owner: a._owner
  };
}

function L(a) {
  return "object" === typeof a && null !== a && a.$$typeof === n;
}

function escape(a) {
  var b = {
    "=": "=0",
    ":": "=2"
  };
  return "$" + a.replace(/[=:]/g, function (a) {
    return b[a];
  });
}

var M = /\/+/g;

function N(a, b) {
  return "object" === typeof a && null !== a && null != a.key ? escape("" + a.key) : b.toString(36);
}

function O(a, b, c, e, d) {
  var k = typeof a;
  if ("undefined" === k || "boolean" === k) a = null;
  var h = !1;
  if (null === a) h = !0;else switch (k) {
    case "string":
    case "number":
      h = !0;
      break;

    case "object":
      switch (a.$$typeof) {
        case n:
        case p:
          h = !0;
      }

  }
  if (h) return h = a, d = d(h), a = "" === e ? "." + N(h, 0) : e, Array.isArray(d) ? (c = "", null != a && (c = a.replace(M, "$&/") + "/"), O(d, b, c, "", function (a) {
    return a;
  })) : null != d && (L(d) && (d = K(d, c + (!d.key || h && h.key === d.key ? "" : ("" + d.key).replace(M, "$&/") + "/") + a)), b.push(d)), 1;
  h = 0;
  e = "" === e ? "." : e + ":";
  if (Array.isArray(a)) for (var g = 0; g < a.length; g++) {
    k = a[g];
    var f = e + N(k, g);
    h += O(k, b, c, f, d);
  } else if (f = y(a), "function" === typeof f) for (a = f.call(a), g = 0; !(k = a.next()).done;) k = k.value, f = e + N(k, g++), h += O(k, b, c, f, d);else if ("object" === k) throw b = "" + a, Error(z(31, "[object Object]" === b ? "object with keys {" + Object.keys(a).join(", ") + "}" : b));
  return h;
}

function P(a, b, c) {
  if (null == a) return a;
  var e = [],
      d = 0;
  O(a, e, "", "", function (a) {
    return b.call(c, a, d++);
  });
  return e;
}

function Q(a) {
  if (-1 === a._status) {
    var b = a._result;
    b = b();
    a._status = 0;
    a._result = b;
    b.then(function (b) {
      0 === a._status && (b = b.default, a._status = 1, a._result = b);
    }, function (b) {
      0 === a._status && (a._status = 2, a._result = b);
    });
  }

  if (1 === a._status) return a._result;
  throw a._result;
}

var R = {
  current: null
};

function S() {
  var a = R.current;
  if (null === a) throw Error(z(321));
  return a;
}

var T = {
  ReactCurrentDispatcher: R,
  ReactCurrentBatchConfig: {
    transition: 0
  },
  ReactCurrentOwner: G,
  IsSomeRendererActing: {
    current: !1
  },
  assign: l
};
exports.Children = {
  map: P,
  forEach: function (a, b, c) {
    P(a, function () {
      b.apply(this, arguments);
    }, c);
  },
  count: function (a) {
    var b = 0;
    P(a, function () {
      b++;
    });
    return b;
  },
  toArray: function (a) {
    return P(a, function (a) {
      return a;
    }) || [];
  },
  only: function (a) {
    if (!L(a)) throw Error(z(143));
    return a;
  }
};
exports.Component = C;
exports.PureComponent = E;
exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = T;

exports.cloneElement = function (a, b, c) {
  if (null === a || void 0 === a) throw Error(z(267, a));
  var e = l({}, a.props),
      d = a.key,
      k = a.ref,
      h = a._owner;

  if (null != b) {
    void 0 !== b.ref && (k = b.ref, h = G.current);
    void 0 !== b.key && (d = "" + b.key);
    if (a.type && a.type.defaultProps) var g = a.type.defaultProps;

    for (f in b) H.call(b, f) && !I.hasOwnProperty(f) && (e[f] = void 0 === b[f] && void 0 !== g ? g[f] : b[f]);
  }

  var f = arguments.length - 2;
  if (1 === f) e.children = c;else if (1 < f) {
    g = Array(f);

    for (var m = 0; m < f; m++) g[m] = arguments[m + 2];

    e.children = g;
  }
  return {
    $$typeof: n,
    type: a.type,
    key: d,
    ref: k,
    props: e,
    _owner: h
  };
};

exports.createContext = function (a, b) {
  void 0 === b && (b = null);
  a = {
    $$typeof: r,
    _calculateChangedBits: b,
    _currentValue: a,
    _currentValue2: a,
    _threadCount: 0,
    Provider: null,
    Consumer: null
  };
  a.Provider = {
    $$typeof: q,
    _context: a
  };
  return a.Consumer = a;
};

exports.createElement = J;

exports.createFactory = function (a) {
  var b = J.bind(null, a);
  b.type = a;
  return b;
};

exports.createRef = function () {
  return {
    current: null
  };
};

exports.forwardRef = function (a) {
  return {
    $$typeof: t,
    render: a
  };
};

exports.isValidElement = L;

exports.lazy = function (a) {
  return {
    $$typeof: v,
    _payload: {
      _status: -1,
      _result: a
    },
    _init: Q
  };
};

exports.memo = function (a, b) {
  return {
    $$typeof: u,
    type: a,
    compare: void 0 === b ? null : b
  };
};

exports.useCallback = function (a, b) {
  return S().useCallback(a, b);
};

exports.useContext = function (a, b) {
  return S().useContext(a, b);
};

exports.useDebugValue = function () {};

exports.useEffect = function (a, b) {
  return S().useEffect(a, b);
};

exports.useImperativeHandle = function (a, b, c) {
  return S().useImperativeHandle(a, b, c);
};

exports.useLayoutEffect = function (a, b) {
  return S().useLayoutEffect(a, b);
};

exports.useMemo = function (a, b) {
  return S().useMemo(a, b);
};

exports.useReducer = function (a, b, c) {
  return S().useReducer(a, b, c);
};

exports.useRef = function (a) {
  return S().useRef(a);
};

exports.useState = function (a) {
  return S().useState(a);
};

exports.version = "17.0.1";

/***/ }),

/***/ 709:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


if (true) {
  module.exports = __webpack_require__(563);
} else {}

/***/ }),

/***/ 682:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

!function (e, t) {
   true ? t(exports) : 0;
}(this, function (e) {
  "use strict";

  function t(e, t) {
    e.super_ = t, e.prototype = Object.create(t.prototype, {
      constructor: {
        value: e,
        enumerable: !1,
        writable: !0,
        configurable: !0
      }
    });
  }

  function r(e, t) {
    Object.defineProperty(this, "kind", {
      value: e,
      enumerable: !0
    }), t && t.length && Object.defineProperty(this, "path", {
      value: t,
      enumerable: !0
    });
  }

  function n(e, t, r) {
    n.super_.call(this, "E", e), Object.defineProperty(this, "lhs", {
      value: t,
      enumerable: !0
    }), Object.defineProperty(this, "rhs", {
      value: r,
      enumerable: !0
    });
  }

  function o(e, t) {
    o.super_.call(this, "N", e), Object.defineProperty(this, "rhs", {
      value: t,
      enumerable: !0
    });
  }

  function i(e, t) {
    i.super_.call(this, "D", e), Object.defineProperty(this, "lhs", {
      value: t,
      enumerable: !0
    });
  }

  function a(e, t, r) {
    a.super_.call(this, "A", e), Object.defineProperty(this, "index", {
      value: t,
      enumerable: !0
    }), Object.defineProperty(this, "item", {
      value: r,
      enumerable: !0
    });
  }

  function f(e, t, r) {
    var n = e.slice((r || t) + 1 || e.length);
    return e.length = t < 0 ? e.length + t : t, e.push.apply(e, n), e;
  }

  function u(e) {
    var t = "undefined" == typeof e ? "undefined" : N(e);
    return "object" !== t ? t : e === Math ? "math" : null === e ? "null" : Array.isArray(e) ? "array" : "[object Date]" === Object.prototype.toString.call(e) ? "date" : "function" == typeof e.toString && /^\/.*\//.test(e.toString()) ? "regexp" : "object";
  }

  function l(e, t, r, c, s, d, p) {
    s = s || [], p = p || [];
    var g = s.slice(0);

    if ("undefined" != typeof d) {
      if (c) {
        if ("function" == typeof c && c(g, d)) return;

        if ("object" === ("undefined" == typeof c ? "undefined" : N(c))) {
          if (c.prefilter && c.prefilter(g, d)) return;

          if (c.normalize) {
            var h = c.normalize(g, d, e, t);
            h && (e = h[0], t = h[1]);
          }
        }
      }

      g.push(d);
    }

    "regexp" === u(e) && "regexp" === u(t) && (e = e.toString(), t = t.toString());
    var y = "undefined" == typeof e ? "undefined" : N(e),
        v = "undefined" == typeof t ? "undefined" : N(t),
        b = "undefined" !== y || p && p[p.length - 1].lhs && p[p.length - 1].lhs.hasOwnProperty(d),
        m = "undefined" !== v || p && p[p.length - 1].rhs && p[p.length - 1].rhs.hasOwnProperty(d);
    if (!b && m) r(new o(g, t));else if (!m && b) r(new i(g, e));else if (u(e) !== u(t)) r(new n(g, e, t));else if ("date" === u(e) && e - t !== 0) r(new n(g, e, t));else if ("object" === y && null !== e && null !== t) {
      if (p.filter(function (t) {
        return t.lhs === e;
      }).length) e !== t && r(new n(g, e, t));else {
        if (p.push({
          lhs: e,
          rhs: t
        }), Array.isArray(e)) {
          var w;
          e.length;

          for (w = 0; w < e.length; w++) w >= t.length ? r(new a(g, w, new i(void 0, e[w]))) : l(e[w], t[w], r, c, g, w, p);

          for (; w < t.length;) r(new a(g, w, new o(void 0, t[w++])));
        } else {
          var x = Object.keys(e),
              S = Object.keys(t);
          x.forEach(function (n, o) {
            var i = S.indexOf(n);
            i >= 0 ? (l(e[n], t[n], r, c, g, n, p), S = f(S, i)) : l(e[n], void 0, r, c, g, n, p);
          }), S.forEach(function (e) {
            l(void 0, t[e], r, c, g, e, p);
          });
        }

        p.length = p.length - 1;
      }
    } else e !== t && ("number" === y && isNaN(e) && isNaN(t) || r(new n(g, e, t)));
  }

  function c(e, t, r, n) {
    return n = n || [], l(e, t, function (e) {
      e && n.push(e);
    }, r), n.length ? n : void 0;
  }

  function s(e, t, r) {
    if (r.path && r.path.length) {
      var n,
          o = e[t],
          i = r.path.length - 1;

      for (n = 0; n < i; n++) o = o[r.path[n]];

      switch (r.kind) {
        case "A":
          s(o[r.path[n]], r.index, r.item);
          break;

        case "D":
          delete o[r.path[n]];
          break;

        case "E":
        case "N":
          o[r.path[n]] = r.rhs;
      }
    } else switch (r.kind) {
      case "A":
        s(e[t], r.index, r.item);
        break;

      case "D":
        e = f(e, t);
        break;

      case "E":
      case "N":
        e[t] = r.rhs;
    }

    return e;
  }

  function d(e, t, r) {
    if (e && t && r && r.kind) {
      for (var n = e, o = -1, i = r.path ? r.path.length - 1 : 0; ++o < i;) "undefined" == typeof n[r.path[o]] && (n[r.path[o]] = "number" == typeof r.path[o] ? [] : {}), n = n[r.path[o]];

      switch (r.kind) {
        case "A":
          s(r.path ? n[r.path[o]] : n, r.index, r.item);
          break;

        case "D":
          delete n[r.path[o]];
          break;

        case "E":
        case "N":
          n[r.path[o]] = r.rhs;
      }
    }
  }

  function p(e, t, r) {
    if (r.path && r.path.length) {
      var n,
          o = e[t],
          i = r.path.length - 1;

      for (n = 0; n < i; n++) o = o[r.path[n]];

      switch (r.kind) {
        case "A":
          p(o[r.path[n]], r.index, r.item);
          break;

        case "D":
          o[r.path[n]] = r.lhs;
          break;

        case "E":
          o[r.path[n]] = r.lhs;
          break;

        case "N":
          delete o[r.path[n]];
      }
    } else switch (r.kind) {
      case "A":
        p(e[t], r.index, r.item);
        break;

      case "D":
        e[t] = r.lhs;
        break;

      case "E":
        e[t] = r.lhs;
        break;

      case "N":
        e = f(e, t);
    }

    return e;
  }

  function g(e, t, r) {
    if (e && t && r && r.kind) {
      var n,
          o,
          i = e;

      for (o = r.path.length - 1, n = 0; n < o; n++) "undefined" == typeof i[r.path[n]] && (i[r.path[n]] = {}), i = i[r.path[n]];

      switch (r.kind) {
        case "A":
          p(i[r.path[n]], r.index, r.item);
          break;

        case "D":
          i[r.path[n]] = r.lhs;
          break;

        case "E":
          i[r.path[n]] = r.lhs;
          break;

        case "N":
          delete i[r.path[n]];
      }
    }
  }

  function h(e, t, r) {
    if (e && t) {
      var n = function (n) {
        r && !r(e, t, n) || d(e, t, n);
      };

      l(e, t, n);
    }
  }

  function y(e) {
    return "color: " + F[e].color + "; font-weight: bold";
  }

  function v(e) {
    var t = e.kind,
        r = e.path,
        n = e.lhs,
        o = e.rhs,
        i = e.index,
        a = e.item;

    switch (t) {
      case "E":
        return [r.join("."), n, "→", o];

      case "N":
        return [r.join("."), o];

      case "D":
        return [r.join(".")];

      case "A":
        return [r.join(".") + "[" + i + "]", a];

      default:
        return [];
    }
  }

  function b(e, t, r, n) {
    var o = c(e, t);

    try {
      n ? r.groupCollapsed("diff") : r.group("diff");
    } catch (e) {
      r.log("diff");
    }

    o ? o.forEach(function (e) {
      var t = e.kind,
          n = v(e);
      r.log.apply(r, ["%c " + F[t].text, y(t)].concat(P(n)));
    }) : r.log("—— no diff ——");

    try {
      r.groupEnd();
    } catch (e) {
      r.log("—— diff end —— ");
    }
  }

  function m(e, t, r, n) {
    switch ("undefined" == typeof e ? "undefined" : N(e)) {
      case "object":
        return "function" == typeof e[n] ? e[n].apply(e, P(r)) : e[n];

      case "function":
        return e(t);

      default:
        return e;
    }
  }

  function w(e) {
    var t = e.timestamp,
        r = e.duration;
    return function (e, n, o) {
      var i = ["action"];
      return i.push("%c" + String(e.type)), t && i.push("%c@ " + n), r && i.push("%c(in " + o.toFixed(2) + " ms)"), i.join(" ");
    };
  }

  function x(e, t) {
    var r = t.logger,
        n = t.actionTransformer,
        o = t.titleFormatter,
        i = void 0 === o ? w(t) : o,
        a = t.collapsed,
        f = t.colors,
        u = t.level,
        l = t.diff,
        c = "undefined" == typeof t.titleFormatter;
    e.forEach(function (o, s) {
      var d = o.started,
          p = o.startedTime,
          g = o.action,
          h = o.prevState,
          y = o.error,
          v = o.took,
          w = o.nextState,
          x = e[s + 1];
      x && (w = x.prevState, v = x.started - d);
      var S = n(g),
          k = "function" == typeof a ? a(function () {
        return w;
      }, g, o) : a,
          j = D(p),
          E = f.title ? "color: " + f.title(S) + ";" : "",
          A = ["color: gray; font-weight: lighter;"];
      A.push(E), t.timestamp && A.push("color: gray; font-weight: lighter;"), t.duration && A.push("color: gray; font-weight: lighter;");
      var O = i(S, j, v);

      try {
        k ? f.title && c ? r.groupCollapsed.apply(r, ["%c " + O].concat(A)) : r.groupCollapsed(O) : f.title && c ? r.group.apply(r, ["%c " + O].concat(A)) : r.group(O);
      } catch (e) {
        r.log(O);
      }

      var N = m(u, S, [h], "prevState"),
          P = m(u, S, [S], "action"),
          C = m(u, S, [y, h], "error"),
          F = m(u, S, [w], "nextState");
      if (N) if (f.prevState) {
        var L = "color: " + f.prevState(h) + "; font-weight: bold";
        r[N]("%c prev state", L, h);
      } else r[N]("prev state", h);
      if (P) if (f.action) {
        var T = "color: " + f.action(S) + "; font-weight: bold";
        r[P]("%c action    ", T, S);
      } else r[P]("action    ", S);
      if (y && C) if (f.error) {
        var M = "color: " + f.error(y, h) + "; font-weight: bold;";
        r[C]("%c error     ", M, y);
      } else r[C]("error     ", y);
      if (F) if (f.nextState) {
        var _ = "color: " + f.nextState(w) + "; font-weight: bold";

        r[F]("%c next state", _, w);
      } else r[F]("next state", w);
      l && b(h, w, r, k);

      try {
        r.groupEnd();
      } catch (e) {
        r.log("—— log end ——");
      }
    });
  }

  function S() {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
        t = Object.assign({}, L, e),
        r = t.logger,
        n = t.stateTransformer,
        o = t.errorTransformer,
        i = t.predicate,
        a = t.logErrors,
        f = t.diffPredicate;
    if ("undefined" == typeof r) return function () {
      return function (e) {
        return function (t) {
          return e(t);
        };
      };
    };
    if (e.getState && e.dispatch) return console.error("[redux-logger] redux-logger not installed. Make sure to pass logger instance as middleware:\n// Logger with default options\nimport { logger } from 'redux-logger'\nconst store = createStore(\n  reducer,\n  applyMiddleware(logger)\n)\n// Or you can create your own logger with custom options http://bit.ly/redux-logger-options\nimport createLogger from 'redux-logger'\nconst logger = createLogger({\n  // ...options\n});\nconst store = createStore(\n  reducer,\n  applyMiddleware(logger)\n)\n"), function () {
      return function (e) {
        return function (t) {
          return e(t);
        };
      };
    };
    var u = [];
    return function (e) {
      var r = e.getState;
      return function (e) {
        return function (l) {
          if ("function" == typeof i && !i(r, l)) return e(l);
          var c = {};
          u.push(c), c.started = O.now(), c.startedTime = new Date(), c.prevState = n(r()), c.action = l;
          var s = void 0;
          if (a) try {
            s = e(l);
          } catch (e) {
            c.error = o(e);
          } else s = e(l);
          c.took = O.now() - c.started, c.nextState = n(r());
          var d = t.diff && "function" == typeof f ? f(r, l) : t.diff;
          if (x(u, Object.assign({}, t, {
            diff: d
          })), u.length = 0, c.error) throw c.error;
          return s;
        };
      };
    };
  }

  var k,
      j,
      E = function (e, t) {
    return new Array(t + 1).join(e);
  },
      A = function (e, t) {
    return E("0", t - e.toString().length) + e;
  },
      D = function (e) {
    return A(e.getHours(), 2) + ":" + A(e.getMinutes(), 2) + ":" + A(e.getSeconds(), 2) + "." + A(e.getMilliseconds(), 3);
  },
      O = "undefined" != typeof performance && null !== performance && "function" == typeof performance.now ? performance : Date,
      N = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
    return typeof e;
  } : function (e) {
    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  },
      P = function (e) {
    if (Array.isArray(e)) {
      for (var t = 0, r = Array(e.length); t < e.length; t++) r[t] = e[t];

      return r;
    }

    return Array.from(e);
  },
      C = [];

  k = "object" === ("undefined" == typeof __webpack_require__.g ? "undefined" : N(__webpack_require__.g)) && __webpack_require__.g ? __webpack_require__.g : "undefined" != typeof window ? window : {}, j = k.DeepDiff, j && C.push(function () {
    "undefined" != typeof j && k.DeepDiff === c && (k.DeepDiff = j, j = void 0);
  }), t(n, r), t(o, r), t(i, r), t(a, r), Object.defineProperties(c, {
    diff: {
      value: c,
      enumerable: !0
    },
    observableDiff: {
      value: l,
      enumerable: !0
    },
    applyDiff: {
      value: h,
      enumerable: !0
    },
    applyChange: {
      value: d,
      enumerable: !0
    },
    revertChange: {
      value: g,
      enumerable: !0
    },
    isConflict: {
      value: function () {
        return "undefined" != typeof j;
      },
      enumerable: !0
    },
    noConflict: {
      value: function () {
        return C && (C.forEach(function (e) {
          e();
        }), C = null), c;
      },
      enumerable: !0
    }
  });

  var F = {
    E: {
      color: "#2196F3",
      text: "CHANGED:"
    },
    N: {
      color: "#4CAF50",
      text: "ADDED:"
    },
    D: {
      color: "#F44336",
      text: "DELETED:"
    },
    A: {
      color: "#2196F3",
      text: "ARRAY:"
    }
  },
      L = {
    level: "log",
    logger: console,
    logErrors: !0,
    collapsed: void 0,
    predicate: void 0,
    duration: !1,
    timestamp: !0,
    stateTransformer: function (e) {
      return e;
    },
    actionTransformer: function (e) {
      return e;
    },
    errorTransformer: function (e) {
      return e;
    },
    colors: {
      title: function () {
        return "inherit";
      },
      prevState: function () {
        return "#9E9E9E";
      },
      action: function () {
        return "#03A9F4";
      },
      nextState: function () {
        return "#4CAF50";
      },
      error: function () {
        return "#F20404";
      }
    },
    diff: !1,
    diffPredicate: void 0,
    transformer: void 0
  },
      T = function () {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
        t = e.dispatch,
        r = e.getState;
    return "function" == typeof t || "function" == typeof r ? S()({
      dispatch: t,
      getState: r
    }) : void console.error("\n[redux-logger v3] BREAKING CHANGE\n[redux-logger v3] Since 3.0.0 redux-logger exports by default logger with default settings.\n[redux-logger v3] Change\n[redux-logger v3] import createLogger from 'redux-logger'\n[redux-logger v3] to\n[redux-logger v3] import { createLogger } from 'redux-logger'\n");
  };

  e.defaults = L, e.createLogger = S, e.logger = T, e.default = T, Object.defineProperty(e, "__esModule", {
    value: !0
  });
});

/***/ }),

/***/ 245:
/***/ (function(__unused_webpack_module, exports) {

"use strict";
/** @license React v0.20.1
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


var f, g, h, k;

if ("object" === typeof performance && "function" === typeof performance.now) {
  var l = performance;

  exports.unstable_now = function () {
    return l.now();
  };
} else {
  var p = Date,
      q = p.now();

  exports.unstable_now = function () {
    return p.now() - q;
  };
}

if ("undefined" === typeof window || "function" !== typeof MessageChannel) {
  var t = null,
      u = null,
      w = function () {
    if (null !== t) try {
      var a = exports.unstable_now();
      t(!0, a);
      t = null;
    } catch (b) {
      throw setTimeout(w, 0), b;
    }
  };

  f = function (a) {
    null !== t ? setTimeout(f, 0, a) : (t = a, setTimeout(w, 0));
  };

  g = function (a, b) {
    u = setTimeout(a, b);
  };

  h = function () {
    clearTimeout(u);
  };

  exports.unstable_shouldYield = function () {
    return !1;
  };

  k = exports.unstable_forceFrameRate = function () {};
} else {
  var x = window.setTimeout,
      y = window.clearTimeout;

  if ("undefined" !== typeof console) {
    var z = window.cancelAnimationFrame;
    "function" !== typeof window.requestAnimationFrame && console.error("This browser doesn't support requestAnimationFrame. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills");
    "function" !== typeof z && console.error("This browser doesn't support cancelAnimationFrame. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills");
  }

  var A = !1,
      B = null,
      C = -1,
      D = 5,
      E = 0;

  exports.unstable_shouldYield = function () {
    return exports.unstable_now() >= E;
  };

  k = function () {};

  exports.unstable_forceFrameRate = function (a) {
    0 > a || 125 < a ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : D = 0 < a ? Math.floor(1E3 / a) : 5;
  };

  var F = new MessageChannel(),
      G = F.port2;

  F.port1.onmessage = function () {
    if (null !== B) {
      var a = exports.unstable_now();
      E = a + D;

      try {
        B(!0, a) ? G.postMessage(null) : (A = !1, B = null);
      } catch (b) {
        throw G.postMessage(null), b;
      }
    } else A = !1;
  };

  f = function (a) {
    B = a;
    A || (A = !0, G.postMessage(null));
  };

  g = function (a, b) {
    C = x(function () {
      a(exports.unstable_now());
    }, b);
  };

  h = function () {
    y(C);
    C = -1;
  };
}

function H(a, b) {
  var c = a.length;
  a.push(b);

  a: for (;;) {
    var d = c - 1 >>> 1,
        e = a[d];
    if (void 0 !== e && 0 < I(e, b)) a[d] = b, a[c] = e, c = d;else break a;
  }
}

function J(a) {
  a = a[0];
  return void 0 === a ? null : a;
}

function K(a) {
  var b = a[0];

  if (void 0 !== b) {
    var c = a.pop();

    if (c !== b) {
      a[0] = c;

      a: for (var d = 0, e = a.length; d < e;) {
        var m = 2 * (d + 1) - 1,
            n = a[m],
            v = m + 1,
            r = a[v];
        if (void 0 !== n && 0 > I(n, c)) void 0 !== r && 0 > I(r, n) ? (a[d] = r, a[v] = c, d = v) : (a[d] = n, a[m] = c, d = m);else if (void 0 !== r && 0 > I(r, c)) a[d] = r, a[v] = c, d = v;else break a;
      }
    }

    return b;
  }

  return null;
}

function I(a, b) {
  var c = a.sortIndex - b.sortIndex;
  return 0 !== c ? c : a.id - b.id;
}

var L = [],
    M = [],
    N = 1,
    O = null,
    P = 3,
    Q = !1,
    R = !1,
    S = !1;

function T(a) {
  for (var b = J(M); null !== b;) {
    if (null === b.callback) K(M);else if (b.startTime <= a) K(M), b.sortIndex = b.expirationTime, H(L, b);else break;
    b = J(M);
  }
}

function U(a) {
  S = !1;
  T(a);
  if (!R) if (null !== J(L)) R = !0, f(V);else {
    var b = J(M);
    null !== b && g(U, b.startTime - a);
  }
}

function V(a, b) {
  R = !1;
  S && (S = !1, h());
  Q = !0;
  var c = P;

  try {
    T(b);

    for (O = J(L); null !== O && (!(O.expirationTime > b) || a && !exports.unstable_shouldYield());) {
      var d = O.callback;

      if ("function" === typeof d) {
        O.callback = null;
        P = O.priorityLevel;
        var e = d(O.expirationTime <= b);
        b = exports.unstable_now();
        "function" === typeof e ? O.callback = e : O === J(L) && K(L);
        T(b);
      } else K(L);

      O = J(L);
    }

    if (null !== O) var m = !0;else {
      var n = J(M);
      null !== n && g(U, n.startTime - b);
      m = !1;
    }
    return m;
  } finally {
    O = null, P = c, Q = !1;
  }
}

var W = k;
exports.unstable_IdlePriority = 5;
exports.unstable_ImmediatePriority = 1;
exports.unstable_LowPriority = 4;
exports.unstable_NormalPriority = 3;
exports.unstable_Profiling = null;
exports.unstable_UserBlockingPriority = 2;

exports.unstable_cancelCallback = function (a) {
  a.callback = null;
};

exports.unstable_continueExecution = function () {
  R || Q || (R = !0, f(V));
};

exports.unstable_getCurrentPriorityLevel = function () {
  return P;
};

exports.unstable_getFirstCallbackNode = function () {
  return J(L);
};

exports.unstable_next = function (a) {
  switch (P) {
    case 1:
    case 2:
    case 3:
      var b = 3;
      break;

    default:
      b = P;
  }

  var c = P;
  P = b;

  try {
    return a();
  } finally {
    P = c;
  }
};

exports.unstable_pauseExecution = function () {};

exports.unstable_requestPaint = W;

exports.unstable_runWithPriority = function (a, b) {
  switch (a) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
      break;

    default:
      a = 3;
  }

  var c = P;
  P = a;

  try {
    return b();
  } finally {
    P = c;
  }
};

exports.unstable_scheduleCallback = function (a, b, c) {
  var d = exports.unstable_now();
  "object" === typeof c && null !== c ? (c = c.delay, c = "number" === typeof c && 0 < c ? d + c : d) : c = d;

  switch (a) {
    case 1:
      var e = -1;
      break;

    case 2:
      e = 250;
      break;

    case 5:
      e = 1073741823;
      break;

    case 4:
      e = 1E4;
      break;

    default:
      e = 5E3;
  }

  e = c + e;
  a = {
    id: N++,
    callback: b,
    priorityLevel: a,
    startTime: c,
    expirationTime: e,
    sortIndex: -1
  };
  c > d ? (a.sortIndex = c, H(M, a), null === J(L) && a === J(M) && (S ? h() : S = !0, g(U, c - d))) : (a.sortIndex = e, H(L, a), R || Q || (R = !0, f(V)));
  return a;
};

exports.unstable_wrapCallback = function (a) {
  var b = P;
  return function () {
    var c = P;
    P = b;

    try {
      return a.apply(this, arguments);
    } finally {
      P = c;
    }
  };
};

/***/ }),

/***/ 853:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


if (true) {
  module.exports = __webpack_require__(245);
} else {}

/***/ }),

/***/ 173:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Z": function() { return /* binding */ es; }
});

// CONCATENATED MODULE: ./node_modules/symbol-observable/es/ponyfill.js
function symbolObservablePonyfill(root) {
  var result;
  var Symbol = root.Symbol;

  if (typeof Symbol === 'function') {
    if (Symbol.observable) {
      result = Symbol.observable;
    } else {
      result = Symbol('observable');
      Symbol.observable = result;
    }
  } else {
    result = '@@observable';
  }

  return result;
}
;
// CONCATENATED MODULE: ./node_modules/symbol-observable/es/index.js
/* module decorator */ module = __webpack_require__.hmd(module);
/* global window */

var root;

if (typeof self !== 'undefined') {
  root = self;
} else if (typeof window !== 'undefined') {
  root = window;
} else if (typeof __webpack_require__.g !== 'undefined') {
  root = __webpack_require__.g;
} else if (true) {
  root = module;
} else {}

var result = symbolObservablePonyfill(root);
/* harmony default export */ var es = (result);

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	!function() {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/harmony module decorator */
/******/ 	!function() {
/******/ 		__webpack_require__.hmd = function(module) {
/******/ 			module = Object.create(module);
/******/ 			if (!module.children) module.children = [];
/******/ 			Object.defineProperty(module, 'exports', {
/******/ 				enumerable: true,
/******/ 				set: function() {
/******/ 					throw new Error('ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: ' + module.id);
/******/ 				}
/******/ 			});
/******/ 			return module;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	!function() {
/******/ 		__webpack_require__.nmd = function(module) {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
!function() {
"use strict";

// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(709);
// EXTERNAL MODULE: ./node_modules/react-dom/index.js
var react_dom = __webpack_require__(169);
// EXTERNAL MODULE: ./node_modules/prop-types/index.js
var prop_types = __webpack_require__(526);
// CONCATENATED MODULE: ./node_modules/react-redux/es/components/Context.js

var Context_ReactReduxContext = /*#__PURE__*/react.createContext(null);

if (false) {}

/* harmony default export */ var Context = ((/* unused pure expression or super */ null && (Context_ReactReduxContext)));
// CONCATENATED MODULE: ./node_modules/react-redux/es/utils/batch.js
// Default to a dummy "batch" implementation that just runs the callback
function defaultNoopBatch(callback) {
  callback();
}

var batch = defaultNoopBatch; // Allow injecting another batching function later

var setBatch = function setBatch(newBatch) {
  return batch = newBatch;
}; // Supply a getter just to skip dealing with ESM bindings

var getBatch = function getBatch() {
  return batch;
};
// CONCATENATED MODULE: ./node_modules/react-redux/es/utils/Subscription.js
 // encapsulates the subscription logic for connecting a component to the redux store, as
// well as nesting subscriptions of descendant components, so that we can ensure the
// ancestor components re-render before descendants

var nullListeners = {
  notify: function notify() {}
};

function createListenerCollection() {
  var batch = getBatch();
  var first = null;
  var last = null;
  return {
    clear: function clear() {
      first = null;
      last = null;
    },
    notify: function notify() {
      batch(function () {
        var listener = first;

        while (listener) {
          listener.callback();
          listener = listener.next;
        }
      });
    },
    get: function get() {
      var listeners = [];
      var listener = first;

      while (listener) {
        listeners.push(listener);
        listener = listener.next;
      }

      return listeners;
    },
    subscribe: function subscribe(callback) {
      var isSubscribed = true;
      var listener = last = {
        callback: callback,
        next: null,
        prev: last
      };

      if (listener.prev) {
        listener.prev.next = listener;
      } else {
        first = listener;
      }

      return function unsubscribe() {
        if (!isSubscribed || first === null) return;
        isSubscribed = false;

        if (listener.next) {
          listener.next.prev = listener.prev;
        } else {
          last = listener.prev;
        }

        if (listener.prev) {
          listener.prev.next = listener.next;
        } else {
          first = listener.next;
        }
      };
    }
  };
}

var Subscription_Subscription = /*#__PURE__*/function () {
  function Subscription(store, parentSub) {
    this.store = store;
    this.parentSub = parentSub;
    this.unsubscribe = null;
    this.listeners = nullListeners;
    this.handleChangeWrapper = this.handleChangeWrapper.bind(this);
  }

  var _proto = Subscription.prototype;

  _proto.addNestedSub = function addNestedSub(listener) {
    this.trySubscribe();
    return this.listeners.subscribe(listener);
  };

  _proto.notifyNestedSubs = function notifyNestedSubs() {
    this.listeners.notify();
  };

  _proto.handleChangeWrapper = function handleChangeWrapper() {
    if (this.onStateChange) {
      this.onStateChange();
    }
  };

  _proto.isSubscribed = function isSubscribed() {
    return Boolean(this.unsubscribe);
  };

  _proto.trySubscribe = function trySubscribe() {
    if (!this.unsubscribe) {
      this.unsubscribe = this.parentSub ? this.parentSub.addNestedSub(this.handleChangeWrapper) : this.store.subscribe(this.handleChangeWrapper);
      this.listeners = createListenerCollection();
    }
  };

  _proto.tryUnsubscribe = function tryUnsubscribe() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
      this.listeners.clear();
      this.listeners = nullListeners;
    }
  };

  return Subscription;
}();


// CONCATENATED MODULE: ./node_modules/react-redux/es/components/Provider.js





function Provider(_ref) {
  var store = _ref.store,
      context = _ref.context,
      children = _ref.children;
  var contextValue = (0,react.useMemo)(function () {
    var subscription = new Subscription_Subscription(store);
    subscription.onStateChange = subscription.notifyNestedSubs;
    return {
      store: store,
      subscription: subscription
    };
  }, [store]);
  var previousState = (0,react.useMemo)(function () {
    return store.getState();
  }, [store]);
  (0,react.useEffect)(function () {
    var subscription = contextValue.subscription;
    subscription.trySubscribe();

    if (previousState !== store.getState()) {
      subscription.notifyNestedSubs();
    }

    return function () {
      subscription.tryUnsubscribe();
      subscription.onStateChange = null;
    };
  }, [contextValue, previousState]);
  var Context = context || Context_ReactReduxContext;
  return /*#__PURE__*/react.createElement(Context.Provider, {
    value: contextValue
  }, children);
}

if (false) {}

/* harmony default export */ var components_Provider = (Provider);
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/extends.js
function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}
// EXTERNAL MODULE: ./node_modules/hoist-non-react-statics/dist/hoist-non-react-statics.cjs.js
var hoist_non_react_statics_cjs = __webpack_require__(480);
var hoist_non_react_statics_cjs_default = /*#__PURE__*/__webpack_require__.n(hoist_non_react_statics_cjs);
// EXTERNAL MODULE: ./node_modules/react-is/index.js
var react_is = __webpack_require__(532);
// CONCATENATED MODULE: ./node_modules/react-redux/es/utils/useIsomorphicLayoutEffect.js
 // React currently throws a warning when using useLayoutEffect on the server.
// To get around it, we can conditionally useEffect on the server (no-op) and
// useLayoutEffect in the browser. We need useLayoutEffect to ensure the store
// subscription callback always has the selector from the latest render commit
// available, otherwise a store update may happen between render and the effect,
// which may cause missed updates; we also must ensure the store subscription
// is created synchronously, otherwise a store update may occur before the
// subscription is created and an inconsistent state may be observed

var useIsomorphicLayoutEffect_useIsomorphicLayoutEffect = typeof window !== 'undefined' && typeof window.document !== 'undefined' && typeof window.document.createElement !== 'undefined' ? react.useLayoutEffect : react.useEffect;
// CONCATENATED MODULE: ./node_modules/react-redux/es/components/connectAdvanced.js







 // Define some constant arrays just to avoid re-creating these

var EMPTY_ARRAY = [];
var NO_SUBSCRIPTION_ARRAY = [null, null];

var stringifyComponent = function stringifyComponent(Comp) {
  try {
    return JSON.stringify(Comp);
  } catch (err) {
    return String(Comp);
  }
};

function storeStateUpdatesReducer(state, action) {
  var updateCount = state[1];
  return [action.payload, updateCount + 1];
}

function useIsomorphicLayoutEffectWithArgs(effectFunc, effectArgs, dependencies) {
  useIsomorphicLayoutEffect_useIsomorphicLayoutEffect(function () {
    return effectFunc.apply(void 0, effectArgs);
  }, dependencies);
}

function captureWrapperProps(lastWrapperProps, lastChildProps, renderIsScheduled, wrapperProps, actualChildProps, childPropsFromStoreUpdate, notifyNestedSubs) {
  // We want to capture the wrapper props and child props we used for later comparisons
  lastWrapperProps.current = wrapperProps;
  lastChildProps.current = actualChildProps;
  renderIsScheduled.current = false; // If the render was from a store update, clear out that reference and cascade the subscriber update

  if (childPropsFromStoreUpdate.current) {
    childPropsFromStoreUpdate.current = null;
    notifyNestedSubs();
  }
}

function subscribeUpdates(shouldHandleStateChanges, store, subscription, childPropsSelector, lastWrapperProps, lastChildProps, renderIsScheduled, childPropsFromStoreUpdate, notifyNestedSubs, forceComponentUpdateDispatch) {
  // If we're not subscribed to the store, nothing to do here
  if (!shouldHandleStateChanges) return; // Capture values for checking if and when this component unmounts

  var didUnsubscribe = false;
  var lastThrownError = null; // We'll run this callback every time a store subscription update propagates to this component

  var checkForUpdates = function checkForUpdates() {
    if (didUnsubscribe) {
      // Don't run stale listeners.
      // Redux doesn't guarantee unsubscriptions happen until next dispatch.
      return;
    }

    var latestStoreState = store.getState();
    var newChildProps, error;

    try {
      // Actually run the selector with the most recent store state and wrapper props
      // to determine what the child props should be
      newChildProps = childPropsSelector(latestStoreState, lastWrapperProps.current);
    } catch (e) {
      error = e;
      lastThrownError = e;
    }

    if (!error) {
      lastThrownError = null;
    } // If the child props haven't changed, nothing to do here - cascade the subscription update


    if (newChildProps === lastChildProps.current) {
      if (!renderIsScheduled.current) {
        notifyNestedSubs();
      }
    } else {
      // Save references to the new child props.  Note that we track the "child props from store update"
      // as a ref instead of a useState/useReducer because we need a way to determine if that value has
      // been processed.  If this went into useState/useReducer, we couldn't clear out the value without
      // forcing another re-render, which we don't want.
      lastChildProps.current = newChildProps;
      childPropsFromStoreUpdate.current = newChildProps;
      renderIsScheduled.current = true; // If the child props _did_ change (or we caught an error), this wrapper component needs to re-render

      forceComponentUpdateDispatch({
        type: 'STORE_UPDATED',
        payload: {
          error: error
        }
      });
    }
  }; // Actually subscribe to the nearest connected ancestor (or store)


  subscription.onStateChange = checkForUpdates;
  subscription.trySubscribe(); // Pull data from the store after first render in case the store has
  // changed since we began.

  checkForUpdates();

  var unsubscribeWrapper = function unsubscribeWrapper() {
    didUnsubscribe = true;
    subscription.tryUnsubscribe();
    subscription.onStateChange = null;

    if (lastThrownError) {
      // It's possible that we caught an error due to a bad mapState function, but the
      // parent re-rendered without this component and we're about to unmount.
      // This shouldn't happen as long as we do top-down subscriptions correctly, but
      // if we ever do those wrong, this throw will surface the error in our tests.
      // In that case, throw the error from here so it doesn't get lost.
      throw lastThrownError;
    }
  };

  return unsubscribeWrapper;
}

var initStateUpdates = function initStateUpdates() {
  return [null, 0];
};

function connectAdvanced(
/*
  selectorFactory is a func that is responsible for returning the selector function used to
  compute new props from state, props, and dispatch. For example:
     export default connectAdvanced((dispatch, options) => (state, props) => ({
      thing: state.things[props.thingId],
      saveThing: fields => dispatch(actionCreators.saveThing(props.thingId, fields)),
    }))(YourComponent)
   Access to dispatch is provided to the factory so selectorFactories can bind actionCreators
  outside of their selector as an optimization. Options passed to connectAdvanced are passed to
  the selectorFactory, along with displayName and WrappedComponent, as the second argument.
   Note that selectorFactory is responsible for all caching/memoization of inbound and outbound
  props. Do not use connectAdvanced directly without memoizing results between calls to your
  selector, otherwise the Connect component will re-render on every state or props change.
*/
selectorFactory, // options object:
_ref) {
  if (_ref === void 0) {
    _ref = {};
  }

  var _ref2 = _ref,
      _ref2$getDisplayName = _ref2.getDisplayName,
      getDisplayName = _ref2$getDisplayName === void 0 ? function (name) {
    return "ConnectAdvanced(" + name + ")";
  } : _ref2$getDisplayName,
      _ref2$methodName = _ref2.methodName,
      methodName = _ref2$methodName === void 0 ? 'connectAdvanced' : _ref2$methodName,
      _ref2$renderCountProp = _ref2.renderCountProp,
      renderCountProp = _ref2$renderCountProp === void 0 ? undefined : _ref2$renderCountProp,
      _ref2$shouldHandleSta = _ref2.shouldHandleStateChanges,
      shouldHandleStateChanges = _ref2$shouldHandleSta === void 0 ? true : _ref2$shouldHandleSta,
      _ref2$storeKey = _ref2.storeKey,
      storeKey = _ref2$storeKey === void 0 ? 'store' : _ref2$storeKey,
      _ref2$withRef = _ref2.withRef,
      withRef = _ref2$withRef === void 0 ? false : _ref2$withRef,
      _ref2$forwardRef = _ref2.forwardRef,
      forwardRef = _ref2$forwardRef === void 0 ? false : _ref2$forwardRef,
      _ref2$context = _ref2.context,
      context = _ref2$context === void 0 ? Context_ReactReduxContext : _ref2$context,
      connectOptions = _objectWithoutPropertiesLoose(_ref2, ["getDisplayName", "methodName", "renderCountProp", "shouldHandleStateChanges", "storeKey", "withRef", "forwardRef", "context"]);

  if (false) { var customStoreWarningMessage; }

  var Context = context;
  return function wrapWithConnect(WrappedComponent) {
    if (false) {}

    var wrappedComponentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
    var displayName = getDisplayName(wrappedComponentName);

    var selectorFactoryOptions = _extends({}, connectOptions, {
      getDisplayName: getDisplayName,
      methodName: methodName,
      renderCountProp: renderCountProp,
      shouldHandleStateChanges: shouldHandleStateChanges,
      storeKey: storeKey,
      displayName: displayName,
      wrappedComponentName: wrappedComponentName,
      WrappedComponent: WrappedComponent
    });

    var pure = connectOptions.pure;

    function createChildSelector(store) {
      return selectorFactory(store.dispatch, selectorFactoryOptions);
    } // If we aren't running in "pure" mode, we don't want to memoize values.
    // To avoid conditionally calling hooks, we fall back to a tiny wrapper
    // that just executes the given callback immediately.


    var usePureOnlyMemo = pure ? react.useMemo : function (callback) {
      return callback();
    };

    function ConnectFunction(props) {
      var _useMemo = (0,react.useMemo)(function () {
        // Distinguish between actual "data" props that were passed to the wrapper component,
        // and values needed to control behavior (forwarded refs, alternate context instances).
        // To maintain the wrapperProps object reference, memoize this destructuring.
        var reactReduxForwardedRef = props.reactReduxForwardedRef,
            wrapperProps = _objectWithoutPropertiesLoose(props, ["reactReduxForwardedRef"]);

        return [props.context, reactReduxForwardedRef, wrapperProps];
      }, [props]),
          propsContext = _useMemo[0],
          reactReduxForwardedRef = _useMemo[1],
          wrapperProps = _useMemo[2];

      var ContextToUse = (0,react.useMemo)(function () {
        // Users may optionally pass in a custom context instance to use instead of our ReactReduxContext.
        // Memoize the check that determines which context instance we should use.
        return propsContext && propsContext.Consumer && (0,react_is.isContextConsumer)( /*#__PURE__*/react.createElement(propsContext.Consumer, null)) ? propsContext : Context;
      }, [propsContext, Context]); // Retrieve the store and ancestor subscription via context, if available

      var contextValue = (0,react.useContext)(ContextToUse); // The store _must_ exist as either a prop or in context.
      // We'll check to see if it _looks_ like a Redux store first.
      // This allows us to pass through a `store` prop that is just a plain value.

      var didStoreComeFromProps = Boolean(props.store) && Boolean(props.store.getState) && Boolean(props.store.dispatch);
      var didStoreComeFromContext = Boolean(contextValue) && Boolean(contextValue.store);

      if (false) {} // Based on the previous check, one of these must be true


      var store = didStoreComeFromProps ? props.store : contextValue.store;
      var childPropsSelector = (0,react.useMemo)(function () {
        // The child props selector needs the store reference as an input.
        // Re-create this selector whenever the store changes.
        return createChildSelector(store);
      }, [store]);

      var _useMemo2 = (0,react.useMemo)(function () {
        if (!shouldHandleStateChanges) return NO_SUBSCRIPTION_ARRAY; // This Subscription's source should match where store came from: props vs. context. A component
        // connected to the store via props shouldn't use subscription from context, or vice versa.

        var subscription = new Subscription_Subscription(store, didStoreComeFromProps ? null : contextValue.subscription); // `notifyNestedSubs` is duplicated to handle the case where the component is unmounted in
        // the middle of the notification loop, where `subscription` will then be null. This can
        // probably be avoided if Subscription's listeners logic is changed to not call listeners
        // that have been unsubscribed in the  middle of the notification loop.

        var notifyNestedSubs = subscription.notifyNestedSubs.bind(subscription);
        return [subscription, notifyNestedSubs];
      }, [store, didStoreComeFromProps, contextValue]),
          subscription = _useMemo2[0],
          notifyNestedSubs = _useMemo2[1]; // Determine what {store, subscription} value should be put into nested context, if necessary,
      // and memoize that value to avoid unnecessary context updates.


      var overriddenContextValue = (0,react.useMemo)(function () {
        if (didStoreComeFromProps) {
          // This component is directly subscribed to a store from props.
          // We don't want descendants reading from this store - pass down whatever
          // the existing context value is from the nearest connected ancestor.
          return contextValue;
        } // Otherwise, put this component's subscription instance into context, so that
        // connected descendants won't update until after this component is done


        return _extends({}, contextValue, {
          subscription: subscription
        });
      }, [didStoreComeFromProps, contextValue, subscription]); // We need to force this wrapper component to re-render whenever a Redux store update
      // causes a change to the calculated child component props (or we caught an error in mapState)

      var _useReducer = (0,react.useReducer)(storeStateUpdatesReducer, EMPTY_ARRAY, initStateUpdates),
          _useReducer$ = _useReducer[0],
          previousStateUpdateResult = _useReducer$[0],
          forceComponentUpdateDispatch = _useReducer[1]; // Propagate any mapState/mapDispatch errors upwards


      if (previousStateUpdateResult && previousStateUpdateResult.error) {
        throw previousStateUpdateResult.error;
      } // Set up refs to coordinate values between the subscription effect and the render logic


      var lastChildProps = (0,react.useRef)();
      var lastWrapperProps = (0,react.useRef)(wrapperProps);
      var childPropsFromStoreUpdate = (0,react.useRef)();
      var renderIsScheduled = (0,react.useRef)(false);
      var actualChildProps = usePureOnlyMemo(function () {
        // Tricky logic here:
        // - This render may have been triggered by a Redux store update that produced new child props
        // - However, we may have gotten new wrapper props after that
        // If we have new child props, and the same wrapper props, we know we should use the new child props as-is.
        // But, if we have new wrapper props, those might change the child props, so we have to recalculate things.
        // So, we'll use the child props from store update only if the wrapper props are the same as last time.
        if (childPropsFromStoreUpdate.current && wrapperProps === lastWrapperProps.current) {
          return childPropsFromStoreUpdate.current;
        } // TODO We're reading the store directly in render() here. Bad idea?
        // This will likely cause Bad Things (TM) to happen in Concurrent Mode.
        // Note that we do this because on renders _not_ caused by store updates, we need the latest store state
        // to determine what the child props should be.


        return childPropsSelector(store.getState(), wrapperProps);
      }, [store, previousStateUpdateResult, wrapperProps]); // We need this to execute synchronously every time we re-render. However, React warns
      // about useLayoutEffect in SSR, so we try to detect environment and fall back to
      // just useEffect instead to avoid the warning, since neither will run anyway.

      useIsomorphicLayoutEffectWithArgs(captureWrapperProps, [lastWrapperProps, lastChildProps, renderIsScheduled, wrapperProps, actualChildProps, childPropsFromStoreUpdate, notifyNestedSubs]); // Our re-subscribe logic only runs when the store/subscription setup changes

      useIsomorphicLayoutEffectWithArgs(subscribeUpdates, [shouldHandleStateChanges, store, subscription, childPropsSelector, lastWrapperProps, lastChildProps, renderIsScheduled, childPropsFromStoreUpdate, notifyNestedSubs, forceComponentUpdateDispatch], [store, subscription, childPropsSelector]); // Now that all that's done, we can finally try to actually render the child component.
      // We memoize the elements for the rendered child component as an optimization.

      var renderedWrappedComponent = (0,react.useMemo)(function () {
        return /*#__PURE__*/react.createElement(WrappedComponent, _extends({}, actualChildProps, {
          ref: reactReduxForwardedRef
        }));
      }, [reactReduxForwardedRef, WrappedComponent, actualChildProps]); // If React sees the exact same element reference as last time, it bails out of re-rendering
      // that child, same as if it was wrapped in React.memo() or returned false from shouldComponentUpdate.

      var renderedChild = (0,react.useMemo)(function () {
        if (shouldHandleStateChanges) {
          // If this component is subscribed to store updates, we need to pass its own
          // subscription instance down to our descendants. That means rendering the same
          // Context instance, and putting a different value into the context.
          return /*#__PURE__*/react.createElement(ContextToUse.Provider, {
            value: overriddenContextValue
          }, renderedWrappedComponent);
        }

        return renderedWrappedComponent;
      }, [ContextToUse, renderedWrappedComponent, overriddenContextValue]);
      return renderedChild;
    } // If we're in "pure" mode, ensure our wrapper component only re-renders when incoming props have changed.


    var Connect = pure ? react.memo(ConnectFunction) : ConnectFunction;
    Connect.WrappedComponent = WrappedComponent;
    Connect.displayName = displayName;

    if (forwardRef) {
      var forwarded = react.forwardRef(function forwardConnectRef(props, ref) {
        return /*#__PURE__*/react.createElement(Connect, _extends({}, props, {
          reactReduxForwardedRef: ref
        }));
      });
      forwarded.displayName = displayName;
      forwarded.WrappedComponent = WrappedComponent;
      return hoist_non_react_statics_cjs_default()(forwarded, WrappedComponent);
    }

    return hoist_non_react_statics_cjs_default()(Connect, WrappedComponent);
  };
}
// CONCATENATED MODULE: ./node_modules/react-redux/es/utils/shallowEqual.js
function is(x, y) {
  if (x === y) {
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  } else {
    return x !== x && y !== y;
  }
}

function shallowEqual(objA, objB) {
  if (is(objA, objB)) return true;

  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) return false;

  for (var i = 0; i < keysA.length; i++) {
    if (!Object.prototype.hasOwnProperty.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }

  return true;
}
// EXTERNAL MODULE: ./node_modules/symbol-observable/es/index.js + 1 modules
var es = __webpack_require__(173);
// CONCATENATED MODULE: ./node_modules/redux/es/redux.js

/**
 * These are private action types reserved by Redux.
 * For any unknown actions, you must return the current state.
 * If the current state is undefined, you must return the initial state.
 * Do not reference these action types directly in your code.
 */

var randomString = function randomString() {
  return Math.random().toString(36).substring(7).split('').join('.');
};

var ActionTypes = {
  INIT: "@@redux/INIT" + randomString(),
  REPLACE: "@@redux/REPLACE" + randomString(),
  PROBE_UNKNOWN_ACTION: function PROBE_UNKNOWN_ACTION() {
    return "@@redux/PROBE_UNKNOWN_ACTION" + randomString();
  }
};
/**
 * @param {any} obj The object to inspect.
 * @returns {boolean} True if the argument appears to be a plain object.
 */

function redux_isPlainObject(obj) {
  if (typeof obj !== 'object' || obj === null) return false;
  var proto = obj;

  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }

  return Object.getPrototypeOf(obj) === proto;
}
/**
 * Creates a Redux store that holds the state tree.
 * The only way to change the data in the store is to call `dispatch()` on it.
 *
 * There should only be a single store in your app. To specify how different
 * parts of the state tree respond to actions, you may combine several reducers
 * into a single reducer function by using `combineReducers`.
 *
 * @param {Function} reducer A function that returns the next state tree, given
 * the current state tree and the action to handle.
 *
 * @param {any} [preloadedState] The initial state. You may optionally specify it
 * to hydrate the state from the server in universal apps, or to restore a
 * previously serialized user session.
 * If you use `combineReducers` to produce the root reducer function, this must be
 * an object with the same shape as `combineReducers` keys.
 *
 * @param {Function} [enhancer] The store enhancer. You may optionally specify it
 * to enhance the store with third-party capabilities such as middleware,
 * time travel, persistence, etc. The only store enhancer that ships with Redux
 * is `applyMiddleware()`.
 *
 * @returns {Store} A Redux store that lets you read the state, dispatch actions
 * and subscribe to changes.
 */


function createStore(reducer, preloadedState, enhancer) {
  var _ref2;

  if (typeof preloadedState === 'function' && typeof enhancer === 'function' || typeof enhancer === 'function' && typeof arguments[3] === 'function') {
    throw new Error('It looks like you are passing several store enhancers to ' + 'createStore(). This is not supported. Instead, compose them ' + 'together to a single function.');
  }

  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState;
    preloadedState = undefined;
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.');
    }

    return enhancer(createStore)(reducer, preloadedState);
  }

  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.');
  }

  var currentReducer = reducer;
  var currentState = preloadedState;
  var currentListeners = [];
  var nextListeners = currentListeners;
  var isDispatching = false;
  /**
   * This makes a shallow copy of currentListeners so we can use
   * nextListeners as a temporary list while dispatching.
   *
   * This prevents any bugs around consumers calling
   * subscribe/unsubscribe in the middle of a dispatch.
   */

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }
  /**
   * Reads the state tree managed by the store.
   *
   * @returns {any} The current state tree of your application.
   */


  function getState() {
    if (isDispatching) {
      throw new Error('You may not call store.getState() while the reducer is executing. ' + 'The reducer has already received the state as an argument. ' + 'Pass it down from the top reducer instead of reading it from the store.');
    }

    return currentState;
  }
  /**
   * Adds a change listener. It will be called any time an action is dispatched,
   * and some part of the state tree may potentially have changed. You may then
   * call `getState()` to read the current state tree inside the callback.
   *
   * You may call `dispatch()` from a change listener, with the following
   * caveats:
   *
   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
   * If you subscribe or unsubscribe while the listeners are being invoked, this
   * will not have any effect on the `dispatch()` that is currently in progress.
   * However, the next `dispatch()` call, whether nested or not, will use a more
   * recent snapshot of the subscription list.
   *
   * 2. The listener should not expect to see all state changes, as the state
   * might have been updated multiple times during a nested `dispatch()` before
   * the listener is called. It is, however, guaranteed that all subscribers
   * registered before the `dispatch()` started will be called with the latest
   * state by the time it exits.
   *
   * @param {Function} listener A callback to be invoked on every dispatch.
   * @returns {Function} A function to remove this change listener.
   */


  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected the listener to be a function.');
    }

    if (isDispatching) {
      throw new Error('You may not call store.subscribe() while the reducer is executing. ' + 'If you would like to be notified after the store has been updated, subscribe from a ' + 'component and invoke store.getState() in the callback to access the latest state. ' + 'See https://redux.js.org/api-reference/store#subscribelistener for more details.');
    }

    var isSubscribed = true;
    ensureCanMutateNextListeners();
    nextListeners.push(listener);
    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }

      if (isDispatching) {
        throw new Error('You may not unsubscribe from a store listener while the reducer is executing. ' + 'See https://redux.js.org/api-reference/store#subscribelistener for more details.');
      }

      isSubscribed = false;
      ensureCanMutateNextListeners();
      var index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
      currentListeners = null;
    };
  }
  /**
   * Dispatches an action. It is the only way to trigger a state change.
   *
   * The `reducer` function, used to create the store, will be called with the
   * current state tree and the given `action`. Its return value will
   * be considered the **next** state of the tree, and the change listeners
   * will be notified.
   *
   * The base implementation only supports plain object actions. If you want to
   * dispatch a Promise, an Observable, a thunk, or something else, you need to
   * wrap your store creating function into the corresponding middleware. For
   * example, see the documentation for the `redux-thunk` package. Even the
   * middleware will eventually dispatch plain object actions using this method.
   *
   * @param {Object} action A plain object representing “what changed”. It is
   * a good idea to keep actions serializable so you can record and replay user
   * sessions, or use the time travelling `redux-devtools`. An action must have
   * a `type` property which may not be `undefined`. It is a good idea to use
   * string constants for action types.
   *
   * @returns {Object} For convenience, the same action object you dispatched.
   *
   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
   * return something else (for example, a Promise you can await).
   */


  function dispatch(action) {
    if (!redux_isPlainObject(action)) {
      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
    }

    if (typeof action.type === 'undefined') {
      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
    }

    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.');
    }

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    var listeners = currentListeners = nextListeners;

    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      listener();
    }

    return action;
  }
  /**
   * Replaces the reducer currently used by the store to calculate the state.
   *
   * You might need this if your app implements code splitting and you want to
   * load some of the reducers dynamically. You might also need this if you
   * implement a hot reloading mechanism for Redux.
   *
   * @param {Function} nextReducer The reducer for the store to use instead.
   * @returns {void}
   */


  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error('Expected the nextReducer to be a function.');
    }

    currentReducer = nextReducer; // This action has a similiar effect to ActionTypes.INIT.
    // Any reducers that existed in both the new and old rootReducer
    // will receive the previous state. This effectively populates
    // the new state tree with any relevant data from the old one.

    dispatch({
      type: ActionTypes.REPLACE
    });
  }
  /**
   * Interoperability point for observable/reactive libraries.
   * @returns {observable} A minimal observable of state changes.
   * For more information, see the observable proposal:
   * https://github.com/tc39/proposal-observable
   */


  function observable() {
    var _ref;

    var outerSubscribe = subscribe;
    return _ref = {
      /**
       * The minimal observable subscription method.
       * @param {Object} observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns {subscription} An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe: function subscribe(observer) {
        if (typeof observer !== 'object' || observer === null) {
          throw new TypeError('Expected the observer to be an object.');
        }

        function observeState() {
          if (observer.next) {
            observer.next(getState());
          }
        }

        observeState();
        var unsubscribe = outerSubscribe(observeState);
        return {
          unsubscribe: unsubscribe
        };
      }
    }, _ref[es/* default */.Z] = function () {
      return this;
    }, _ref;
  } // When a store is created, an "INIT" action is dispatched so that every
  // reducer returns their initial state. This effectively populates
  // the initial state tree.


  dispatch({
    type: ActionTypes.INIT
  });
  return _ref2 = {
    dispatch: dispatch,
    subscribe: subscribe,
    getState: getState,
    replaceReducer: replaceReducer
  }, _ref2[es/* default */.Z] = observable, _ref2;
}
/**
 * Prints a warning in the console if it exists.
 *
 * @param {String} message The warning message.
 * @returns {void}
 */


function redux_warning(message) {
  /* eslint-disable no-console */
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message);
  }
  /* eslint-enable no-console */


  try {
    // This error was thrown as a convenience so that if you enable
    // "break on all exceptions" in your console,
    // it would pause the execution at this line.
    throw new Error(message);
  } catch (e) {} // eslint-disable-line no-empty

}

function getUndefinedStateErrorMessage(key, action) {
  var actionType = action && action.type;
  var actionDescription = actionType && "action \"" + String(actionType) + "\"" || 'an action';
  return "Given " + actionDescription + ", reducer \"" + key + "\" returned undefined. " + "To ignore an action, you must explicitly return the previous state. " + "If you want this reducer to hold no value, you can return null instead of undefined.";
}

function getUnexpectedStateShapeWarningMessage(inputState, reducers, action, unexpectedKeyCache) {
  var reducerKeys = Object.keys(reducers);
  var argumentName = action && action.type === ActionTypes.INIT ? 'preloadedState argument passed to createStore' : 'previous state received by the reducer';

  if (reducerKeys.length === 0) {
    return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.';
  }

  if (!redux_isPlainObject(inputState)) {
    return "The " + argumentName + " has unexpected type of \"" + {}.toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] + "\". Expected argument to be an object with the following " + ("keys: \"" + reducerKeys.join('", "') + "\"");
  }

  var unexpectedKeys = Object.keys(inputState).filter(function (key) {
    return !reducers.hasOwnProperty(key) && !unexpectedKeyCache[key];
  });
  unexpectedKeys.forEach(function (key) {
    unexpectedKeyCache[key] = true;
  });
  if (action && action.type === ActionTypes.REPLACE) return;

  if (unexpectedKeys.length > 0) {
    return "Unexpected " + (unexpectedKeys.length > 1 ? 'keys' : 'key') + " " + ("\"" + unexpectedKeys.join('", "') + "\" found in " + argumentName + ". ") + "Expected to find one of the known reducer keys instead: " + ("\"" + reducerKeys.join('", "') + "\". Unexpected keys will be ignored.");
  }
}

function assertReducerShape(reducers) {
  Object.keys(reducers).forEach(function (key) {
    var reducer = reducers[key];
    var initialState = reducer(undefined, {
      type: ActionTypes.INIT
    });

    if (typeof initialState === 'undefined') {
      throw new Error("Reducer \"" + key + "\" returned undefined during initialization. " + "If the state passed to the reducer is undefined, you must " + "explicitly return the initial state. The initial state may " + "not be undefined. If you don't want to set a value for this reducer, " + "you can use null instead of undefined.");
    }

    if (typeof reducer(undefined, {
      type: ActionTypes.PROBE_UNKNOWN_ACTION()
    }) === 'undefined') {
      throw new Error("Reducer \"" + key + "\" returned undefined when probed with a random type. " + ("Don't try to handle " + ActionTypes.INIT + " or other actions in \"redux/*\" ") + "namespace. They are considered private. Instead, you must return the " + "current state for any unknown actions, unless it is undefined, " + "in which case you must return the initial state, regardless of the " + "action type. The initial state may not be undefined, but can be null.");
    }
  });
}
/**
 * Turns an object whose values are different reducer functions, into a single
 * reducer function. It will call every child reducer, and gather their results
 * into a single state object, whose keys correspond to the keys of the passed
 * reducer functions.
 *
 * @param {Object} reducers An object whose values correspond to different
 * reducer functions that need to be combined into one. One handy way to obtain
 * it is to use ES6 `import * as reducers` syntax. The reducers may never return
 * undefined for any action. Instead, they should return their initial state
 * if the state passed to them was undefined, and the current state for any
 * unrecognized action.
 *
 * @returns {Function} A reducer function that invokes every reducer inside the
 * passed object, and builds a state object with the same shape.
 */


function combineReducers(reducers) {
  var reducerKeys = Object.keys(reducers);
  var finalReducers = {};

  for (var i = 0; i < reducerKeys.length; i++) {
    var key = reducerKeys[i];

    if (false) {}

    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key];
    }
  }

  var finalReducerKeys = Object.keys(finalReducers); // This is used to make sure we don't warn about the same
  // keys multiple times.

  var unexpectedKeyCache;

  if (false) {}

  var shapeAssertionError;

  try {
    assertReducerShape(finalReducers);
  } catch (e) {
    shapeAssertionError = e;
  }

  return function combination(state, action) {
    if (state === void 0) {
      state = {};
    }

    if (shapeAssertionError) {
      throw shapeAssertionError;
    }

    if (false) { var warningMessage; }

    var hasChanged = false;
    var nextState = {};

    for (var _i = 0; _i < finalReducerKeys.length; _i++) {
      var _key = finalReducerKeys[_i];
      var reducer = finalReducers[_key];
      var previousStateForKey = state[_key];
      var nextStateForKey = reducer(previousStateForKey, action);

      if (typeof nextStateForKey === 'undefined') {
        var errorMessage = getUndefinedStateErrorMessage(_key, action);
        throw new Error(errorMessage);
      }

      nextState[_key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }

    hasChanged = hasChanged || finalReducerKeys.length !== Object.keys(state).length;
    return hasChanged ? nextState : state;
  };
}

function bindActionCreator(actionCreator, dispatch) {
  return function () {
    return dispatch(actionCreator.apply(this, arguments));
  };
}
/**
 * Turns an object whose values are action creators, into an object with the
 * same keys, but with every function wrapped into a `dispatch` call so they
 * may be invoked directly. This is just a convenience method, as you can call
 * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
 *
 * For convenience, you can also pass an action creator as the first argument,
 * and get a dispatch wrapped function in return.
 *
 * @param {Function|Object} actionCreators An object whose values are action
 * creator functions. One handy way to obtain it is to use ES6 `import * as`
 * syntax. You may also pass a single function.
 *
 * @param {Function} dispatch The `dispatch` function available on your Redux
 * store.
 *
 * @returns {Function|Object} The object mimicking the original object, but with
 * every action creator wrapped into the `dispatch` call. If you passed a
 * function as `actionCreators`, the return value will also be a single
 * function.
 */


function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch);
  }

  if (typeof actionCreators !== 'object' || actionCreators === null) {
    throw new Error("bindActionCreators expected an object or a function, instead received " + (actionCreators === null ? 'null' : typeof actionCreators) + ". " + "Did you write \"import ActionCreators from\" instead of \"import * as ActionCreators from\"?");
  }

  var boundActionCreators = {};

  for (var key in actionCreators) {
    var actionCreator = actionCreators[key];

    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
    }
  }

  return boundActionCreators;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    keys.push.apply(keys, Object.getOwnPropertySymbols(object));
  }

  if (enumerableOnly) keys = keys.filter(function (sym) {
    return Object.getOwnPropertyDescriptor(object, sym).enumerable;
  });
  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(source, true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(source).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}
/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */


function compose() {
  for (var _len = arguments.length, funcs = new Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  if (funcs.length === 0) {
    return function (arg) {
      return arg;
    };
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce(function (a, b) {
    return function () {
      return a(b.apply(void 0, arguments));
    };
  });
}
/**
 * Creates a store enhancer that applies middleware to the dispatch method
 * of the Redux store. This is handy for a variety of tasks, such as expressing
 * asynchronous actions in a concise manner, or logging every action payload.
 *
 * See `redux-thunk` package as an example of the Redux middleware.
 *
 * Because middleware is potentially asynchronous, this should be the first
 * store enhancer in the composition chain.
 *
 * Note that each middleware will be given the `dispatch` and `getState` functions
 * as named arguments.
 *
 * @param {...Function} middlewares The middleware chain to be applied.
 * @returns {Function} A store enhancer applying the middleware.
 */


function applyMiddleware() {
  for (var _len = arguments.length, middlewares = new Array(_len), _key = 0; _key < _len; _key++) {
    middlewares[_key] = arguments[_key];
  }

  return function (createStore) {
    return function () {
      var store = createStore.apply(void 0, arguments);

      var _dispatch = function dispatch() {
        throw new Error('Dispatching while constructing your middleware is not allowed. ' + 'Other middleware would not be applied to this dispatch.');
      };

      var middlewareAPI = {
        getState: store.getState,
        dispatch: function dispatch() {
          return _dispatch.apply(void 0, arguments);
        }
      };
      var chain = middlewares.map(function (middleware) {
        return middleware(middlewareAPI);
      });
      _dispatch = compose.apply(void 0, chain)(store.dispatch);
      return _objectSpread2({}, store, {
        dispatch: _dispatch
      });
    };
  };
}
/*
 * This is a dummy function to check if the function name has been altered by minification.
 * If the function has been minified and NODE_ENV !== 'production', warn the user.
 */


function isCrushed() {}

if (false) {}


// CONCATENATED MODULE: ./node_modules/react-redux/es/utils/verifyPlainObject.js


function verifyPlainObject(value, displayName, methodName) {
  if (!isPlainObject(value)) {
    warning(methodName + "() in " + displayName + " must return a plain object. Instead received " + value + ".");
  }
}
// CONCATENATED MODULE: ./node_modules/react-redux/es/connect/wrapMapToProps.js

function wrapMapToPropsConstant(getConstant) {
  return function initConstantSelector(dispatch, options) {
    var constant = getConstant(dispatch, options);

    function constantSelector() {
      return constant;
    }

    constantSelector.dependsOnOwnProps = false;
    return constantSelector;
  };
} // dependsOnOwnProps is used by createMapToPropsProxy to determine whether to pass props as args
// to the mapToProps function being wrapped. It is also used by makePurePropsSelector to determine
// whether mapToProps needs to be invoked when props have changed.
//
// A length of one signals that mapToProps does not depend on props from the parent component.
// A length of zero is assumed to mean mapToProps is getting args via arguments or ...args and
// therefore not reporting its length accurately..

function getDependsOnOwnProps(mapToProps) {
  return mapToProps.dependsOnOwnProps !== null && mapToProps.dependsOnOwnProps !== undefined ? Boolean(mapToProps.dependsOnOwnProps) : mapToProps.length !== 1;
} // Used by whenMapStateToPropsIsFunction and whenMapDispatchToPropsIsFunction,
// this function wraps mapToProps in a proxy function which does several things:
//
//  * Detects whether the mapToProps function being called depends on props, which
//    is used by selectorFactory to decide if it should reinvoke on props changes.
//
//  * On first call, handles mapToProps if returns another function, and treats that
//    new function as the true mapToProps for subsequent calls.
//
//  * On first call, verifies the first result is a plain object, in order to warn
//    the developer that their mapToProps function is not returning a valid result.
//

function wrapMapToPropsFunc(mapToProps, methodName) {
  return function initProxySelector(dispatch, _ref) {
    var displayName = _ref.displayName;

    var proxy = function mapToPropsProxy(stateOrDispatch, ownProps) {
      return proxy.dependsOnOwnProps ? proxy.mapToProps(stateOrDispatch, ownProps) : proxy.mapToProps(stateOrDispatch);
    }; // allow detectFactoryAndVerify to get ownProps


    proxy.dependsOnOwnProps = true;

    proxy.mapToProps = function detectFactoryAndVerify(stateOrDispatch, ownProps) {
      proxy.mapToProps = mapToProps;
      proxy.dependsOnOwnProps = getDependsOnOwnProps(mapToProps);
      var props = proxy(stateOrDispatch, ownProps);

      if (typeof props === 'function') {
        proxy.mapToProps = props;
        proxy.dependsOnOwnProps = getDependsOnOwnProps(props);
        props = proxy(stateOrDispatch, ownProps);
      }

      if (false) {}
      return props;
    };

    return proxy;
  };
}
// CONCATENATED MODULE: ./node_modules/react-redux/es/connect/mapDispatchToProps.js


function whenMapDispatchToPropsIsFunction(mapDispatchToProps) {
  return typeof mapDispatchToProps === 'function' ? wrapMapToPropsFunc(mapDispatchToProps, 'mapDispatchToProps') : undefined;
}
function whenMapDispatchToPropsIsMissing(mapDispatchToProps) {
  return !mapDispatchToProps ? wrapMapToPropsConstant(function (dispatch) {
    return {
      dispatch: dispatch
    };
  }) : undefined;
}
function whenMapDispatchToPropsIsObject(mapDispatchToProps) {
  return mapDispatchToProps && typeof mapDispatchToProps === 'object' ? wrapMapToPropsConstant(function (dispatch) {
    return bindActionCreators(mapDispatchToProps, dispatch);
  }) : undefined;
}
/* harmony default export */ var mapDispatchToProps = ([whenMapDispatchToPropsIsFunction, whenMapDispatchToPropsIsMissing, whenMapDispatchToPropsIsObject]);
// CONCATENATED MODULE: ./node_modules/react-redux/es/connect/mapStateToProps.js

function whenMapStateToPropsIsFunction(mapStateToProps) {
  return typeof mapStateToProps === 'function' ? wrapMapToPropsFunc(mapStateToProps, 'mapStateToProps') : undefined;
}
function whenMapStateToPropsIsMissing(mapStateToProps) {
  return !mapStateToProps ? wrapMapToPropsConstant(function () {
    return {};
  }) : undefined;
}
/* harmony default export */ var mapStateToProps = ([whenMapStateToPropsIsFunction, whenMapStateToPropsIsMissing]);
// CONCATENATED MODULE: ./node_modules/react-redux/es/connect/mergeProps.js


function defaultMergeProps(stateProps, dispatchProps, ownProps) {
  return _extends({}, ownProps, stateProps, dispatchProps);
}
function wrapMergePropsFunc(mergeProps) {
  return function initMergePropsProxy(dispatch, _ref) {
    var displayName = _ref.displayName,
        pure = _ref.pure,
        areMergedPropsEqual = _ref.areMergedPropsEqual;
    var hasRunOnce = false;
    var mergedProps;
    return function mergePropsProxy(stateProps, dispatchProps, ownProps) {
      var nextMergedProps = mergeProps(stateProps, dispatchProps, ownProps);

      if (hasRunOnce) {
        if (!pure || !areMergedPropsEqual(nextMergedProps, mergedProps)) mergedProps = nextMergedProps;
      } else {
        hasRunOnce = true;
        mergedProps = nextMergedProps;
        if (false) {}
      }

      return mergedProps;
    };
  };
}
function whenMergePropsIsFunction(mergeProps) {
  return typeof mergeProps === 'function' ? wrapMergePropsFunc(mergeProps) : undefined;
}
function whenMergePropsIsOmitted(mergeProps) {
  return !mergeProps ? function () {
    return defaultMergeProps;
  } : undefined;
}
/* harmony default export */ var mergeProps = ([whenMergePropsIsFunction, whenMergePropsIsOmitted]);
// CONCATENATED MODULE: ./node_modules/react-redux/es/connect/verifySubselectors.js


function verify(selector, methodName, displayName) {
  if (!selector) {
    throw new Error("Unexpected value for " + methodName + " in " + displayName + ".");
  } else if (methodName === 'mapStateToProps' || methodName === 'mapDispatchToProps') {
    if (!Object.prototype.hasOwnProperty.call(selector, 'dependsOnOwnProps')) {
      warning("The selector for " + methodName + " of " + displayName + " did not specify a value for dependsOnOwnProps.");
    }
  }
}

function verifySubselectors(mapStateToProps, mapDispatchToProps, mergeProps, displayName) {
  verify(mapStateToProps, 'mapStateToProps', displayName);
  verify(mapDispatchToProps, 'mapDispatchToProps', displayName);
  verify(mergeProps, 'mergeProps', displayName);
}
// CONCATENATED MODULE: ./node_modules/react-redux/es/connect/selectorFactory.js


function impureFinalPropsSelectorFactory(mapStateToProps, mapDispatchToProps, mergeProps, dispatch) {
  return function impureFinalPropsSelector(state, ownProps) {
    return mergeProps(mapStateToProps(state, ownProps), mapDispatchToProps(dispatch, ownProps), ownProps);
  };
}
function pureFinalPropsSelectorFactory(mapStateToProps, mapDispatchToProps, mergeProps, dispatch, _ref) {
  var areStatesEqual = _ref.areStatesEqual,
      areOwnPropsEqual = _ref.areOwnPropsEqual,
      areStatePropsEqual = _ref.areStatePropsEqual;
  var hasRunAtLeastOnce = false;
  var state;
  var ownProps;
  var stateProps;
  var dispatchProps;
  var mergedProps;

  function handleFirstCall(firstState, firstOwnProps) {
    state = firstState;
    ownProps = firstOwnProps;
    stateProps = mapStateToProps(state, ownProps);
    dispatchProps = mapDispatchToProps(dispatch, ownProps);
    mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
    hasRunAtLeastOnce = true;
    return mergedProps;
  }

  function handleNewPropsAndNewState() {
    stateProps = mapStateToProps(state, ownProps);
    if (mapDispatchToProps.dependsOnOwnProps) dispatchProps = mapDispatchToProps(dispatch, ownProps);
    mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
    return mergedProps;
  }

  function handleNewProps() {
    if (mapStateToProps.dependsOnOwnProps) stateProps = mapStateToProps(state, ownProps);
    if (mapDispatchToProps.dependsOnOwnProps) dispatchProps = mapDispatchToProps(dispatch, ownProps);
    mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
    return mergedProps;
  }

  function handleNewState() {
    var nextStateProps = mapStateToProps(state, ownProps);
    var statePropsChanged = !areStatePropsEqual(nextStateProps, stateProps);
    stateProps = nextStateProps;
    if (statePropsChanged) mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
    return mergedProps;
  }

  function handleSubsequentCalls(nextState, nextOwnProps) {
    var propsChanged = !areOwnPropsEqual(nextOwnProps, ownProps);
    var stateChanged = !areStatesEqual(nextState, state);
    state = nextState;
    ownProps = nextOwnProps;
    if (propsChanged && stateChanged) return handleNewPropsAndNewState();
    if (propsChanged) return handleNewProps();
    if (stateChanged) return handleNewState();
    return mergedProps;
  }

  return function pureFinalPropsSelector(nextState, nextOwnProps) {
    return hasRunAtLeastOnce ? handleSubsequentCalls(nextState, nextOwnProps) : handleFirstCall(nextState, nextOwnProps);
  };
} // TODO: Add more comments
// If pure is true, the selector returned by selectorFactory will memoize its results,
// allowing connectAdvanced's shouldComponentUpdate to return false if final
// props have not changed. If false, the selector will always return a new
// object and shouldComponentUpdate will always return true.

function finalPropsSelectorFactory(dispatch, _ref2) {
  var initMapStateToProps = _ref2.initMapStateToProps,
      initMapDispatchToProps = _ref2.initMapDispatchToProps,
      initMergeProps = _ref2.initMergeProps,
      options = _objectWithoutPropertiesLoose(_ref2, ["initMapStateToProps", "initMapDispatchToProps", "initMergeProps"]);

  var mapStateToProps = initMapStateToProps(dispatch, options);
  var mapDispatchToProps = initMapDispatchToProps(dispatch, options);
  var mergeProps = initMergeProps(dispatch, options);

  if (false) {}

  var selectorFactory = options.pure ? pureFinalPropsSelectorFactory : impureFinalPropsSelectorFactory;
  return selectorFactory(mapStateToProps, mapDispatchToProps, mergeProps, dispatch, options);
}
// CONCATENATED MODULE: ./node_modules/react-redux/es/connect/connect.js








/*
  connect is a facade over connectAdvanced. It turns its args into a compatible
  selectorFactory, which has the signature:

    (dispatch, options) => (nextState, nextOwnProps) => nextFinalProps
  
  connect passes its args to connectAdvanced as options, which will in turn pass them to
  selectorFactory each time a Connect component instance is instantiated or hot reloaded.

  selectorFactory returns a final props selector from its mapStateToProps,
  mapStateToPropsFactories, mapDispatchToProps, mapDispatchToPropsFactories, mergeProps,
  mergePropsFactories, and pure args.

  The resulting final props selector is called by the Connect component instance whenever
  it receives new props or store state.
 */

function match(arg, factories, name) {
  for (var i = factories.length - 1; i >= 0; i--) {
    var result = factories[i](arg);
    if (result) return result;
  }

  return function (dispatch, options) {
    throw new Error("Invalid value of type " + typeof arg + " for " + name + " argument when connecting component " + options.wrappedComponentName + ".");
  };
}

function strictEqual(a, b) {
  return a === b;
} // createConnect with default args builds the 'official' connect behavior. Calling it with
// different options opens up some testing and extensibility scenarios


function createConnect(_temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      _ref$connectHOC = _ref.connectHOC,
      connectHOC = _ref$connectHOC === void 0 ? connectAdvanced : _ref$connectHOC,
      _ref$mapStateToPropsF = _ref.mapStateToPropsFactories,
      mapStateToPropsFactories = _ref$mapStateToPropsF === void 0 ? mapStateToProps : _ref$mapStateToPropsF,
      _ref$mapDispatchToPro = _ref.mapDispatchToPropsFactories,
      mapDispatchToPropsFactories = _ref$mapDispatchToPro === void 0 ? mapDispatchToProps : _ref$mapDispatchToPro,
      _ref$mergePropsFactor = _ref.mergePropsFactories,
      mergePropsFactories = _ref$mergePropsFactor === void 0 ? mergeProps : _ref$mergePropsFactor,
      _ref$selectorFactory = _ref.selectorFactory,
      selectorFactory = _ref$selectorFactory === void 0 ? finalPropsSelectorFactory : _ref$selectorFactory;

  return function connect(mapStateToProps, mapDispatchToProps, mergeProps, _ref2) {
    if (_ref2 === void 0) {
      _ref2 = {};
    }

    var _ref3 = _ref2,
        _ref3$pure = _ref3.pure,
        pure = _ref3$pure === void 0 ? true : _ref3$pure,
        _ref3$areStatesEqual = _ref3.areStatesEqual,
        areStatesEqual = _ref3$areStatesEqual === void 0 ? strictEqual : _ref3$areStatesEqual,
        _ref3$areOwnPropsEqua = _ref3.areOwnPropsEqual,
        areOwnPropsEqual = _ref3$areOwnPropsEqua === void 0 ? shallowEqual : _ref3$areOwnPropsEqua,
        _ref3$areStatePropsEq = _ref3.areStatePropsEqual,
        areStatePropsEqual = _ref3$areStatePropsEq === void 0 ? shallowEqual : _ref3$areStatePropsEq,
        _ref3$areMergedPropsE = _ref3.areMergedPropsEqual,
        areMergedPropsEqual = _ref3$areMergedPropsE === void 0 ? shallowEqual : _ref3$areMergedPropsE,
        extraOptions = _objectWithoutPropertiesLoose(_ref3, ["pure", "areStatesEqual", "areOwnPropsEqual", "areStatePropsEqual", "areMergedPropsEqual"]);

    var initMapStateToProps = match(mapStateToProps, mapStateToPropsFactories, 'mapStateToProps');
    var initMapDispatchToProps = match(mapDispatchToProps, mapDispatchToPropsFactories, 'mapDispatchToProps');
    var initMergeProps = match(mergeProps, mergePropsFactories, 'mergeProps');
    return connectHOC(selectorFactory, _extends({
      // used in error messages
      methodName: 'connect',
      // used to compute Connect's displayName from the wrapped component's displayName.
      getDisplayName: function getDisplayName(name) {
        return "Connect(" + name + ")";
      },
      // if mapStateToProps is falsy, the Connect component doesn't subscribe to store state changes
      shouldHandleStateChanges: Boolean(mapStateToProps),
      // passed through to selectorFactory
      initMapStateToProps: initMapStateToProps,
      initMapDispatchToProps: initMapDispatchToProps,
      initMergeProps: initMergeProps,
      pure: pure,
      areStatesEqual: areStatesEqual,
      areOwnPropsEqual: areOwnPropsEqual,
      areStatePropsEqual: areStatePropsEqual,
      areMergedPropsEqual: areMergedPropsEqual
    }, extraOptions));
  };
}
/* harmony default export */ var connect = (/*#__PURE__*/createConnect());
// CONCATENATED MODULE: ./node_modules/react-redux/es/hooks/useReduxContext.js


/**
 * A hook to access the value of the `ReactReduxContext`. This is a low-level
 * hook that you should usually not need to call directly.
 *
 * @returns {any} the value of the `ReactReduxContext`
 *
 * @example
 *
 * import React from 'react'
 * import { useReduxContext } from 'react-redux'
 *
 * export const CounterComponent = ({ value }) => {
 *   const { store } = useReduxContext()
 *   return <div>{store.getState()}</div>
 * }
 */

function useReduxContext() {
  var contextValue = useContext(ReactReduxContext);

  if (false) {}

  return contextValue;
}
// CONCATENATED MODULE: ./node_modules/react-redux/es/hooks/useStore.js



/**
 * Hook factory, which creates a `useStore` hook bound to a given context.
 *
 * @param {React.Context} [context=ReactReduxContext] Context passed to your `<Provider>`.
 * @returns {Function} A `useStore` hook bound to the specified context.
 */

function useStore_createStoreHook(context) {
  if (context === void 0) {
    context = ReactReduxContext;
  }

  var useReduxContext = context === ReactReduxContext ? useDefaultReduxContext : function () {
    return useContext(context);
  };
  return function useStore() {
    var _useReduxContext = useReduxContext(),
        store = _useReduxContext.store;

    return store;
  };
}
/**
 * A hook to access the redux store.
 *
 * @returns {any} the redux store
 *
 * @example
 *
 * import React from 'react'
 * import { useStore } from 'react-redux'
 *
 * export const ExampleComponent = () => {
 *   const store = useStore()
 *   return <div>{store.getState()}</div>
 * }
 */

var useStore = /*#__PURE__*/(/* unused pure expression or super */ null && (useStore_createStoreHook()));
// CONCATENATED MODULE: ./node_modules/react-redux/es/hooks/useDispatch.js


/**
 * Hook factory, which creates a `useDispatch` hook bound to a given context.
 *
 * @param {React.Context} [context=ReactReduxContext] Context passed to your `<Provider>`.
 * @returns {Function} A `useDispatch` hook bound to the specified context.
 */

function createDispatchHook(context) {
  if (context === void 0) {
    context = ReactReduxContext;
  }

  var useStore = context === ReactReduxContext ? useDefaultStore : createStoreHook(context);
  return function useDispatch() {
    var store = useStore();
    return store.dispatch;
  };
}
/**
 * A hook to access the redux `dispatch` function.
 *
 * @returns {any|function} redux store's `dispatch` function
 *
 * @example
 *
 * import React, { useCallback } from 'react'
 * import { useDispatch } from 'react-redux'
 *
 * export const CounterComponent = ({ value }) => {
 *   const dispatch = useDispatch()
 *   const increaseCounter = useCallback(() => dispatch({ type: 'increase-counter' }), [])
 *   return (
 *     <div>
 *       <span>{value}</span>
 *       <button onClick={increaseCounter}>Increase counter</button>
 *     </div>
 *   )
 * }
 */

var useDispatch = /*#__PURE__*/(/* unused pure expression or super */ null && (createDispatchHook()));
// CONCATENATED MODULE: ./node_modules/react-redux/es/hooks/useSelector.js






var refEquality = function refEquality(a, b) {
  return a === b;
};

function useSelectorWithStoreAndSubscription(selector, equalityFn, store, contextSub) {
  var _useReducer = useReducer(function (s) {
    return s + 1;
  }, 0),
      forceRender = _useReducer[1];

  var subscription = useMemo(function () {
    return new Subscription(store, contextSub);
  }, [store, contextSub]);
  var latestSubscriptionCallbackError = useRef();
  var latestSelector = useRef();
  var latestStoreState = useRef();
  var latestSelectedState = useRef();
  var storeState = store.getState();
  var selectedState;

  try {
    if (selector !== latestSelector.current || storeState !== latestStoreState.current || latestSubscriptionCallbackError.current) {
      selectedState = selector(storeState);
    } else {
      selectedState = latestSelectedState.current;
    }
  } catch (err) {
    if (latestSubscriptionCallbackError.current) {
      err.message += "\nThe error may be correlated with this previous error:\n" + latestSubscriptionCallbackError.current.stack + "\n\n";
    }

    throw err;
  }

  useIsomorphicLayoutEffect(function () {
    latestSelector.current = selector;
    latestStoreState.current = storeState;
    latestSelectedState.current = selectedState;
    latestSubscriptionCallbackError.current = undefined;
  });
  useIsomorphicLayoutEffect(function () {
    function checkForUpdates() {
      try {
        var newSelectedState = latestSelector.current(store.getState());

        if (equalityFn(newSelectedState, latestSelectedState.current)) {
          return;
        }

        latestSelectedState.current = newSelectedState;
      } catch (err) {
        // we ignore all errors here, since when the component
        // is re-rendered, the selectors are called again, and
        // will throw again, if neither props nor store state
        // changed
        latestSubscriptionCallbackError.current = err;
      }

      forceRender();
    }

    subscription.onStateChange = checkForUpdates;
    subscription.trySubscribe();
    checkForUpdates();
    return function () {
      return subscription.tryUnsubscribe();
    };
  }, [store, subscription]);
  return selectedState;
}
/**
 * Hook factory, which creates a `useSelector` hook bound to a given context.
 *
 * @param {React.Context} [context=ReactReduxContext] Context passed to your `<Provider>`.
 * @returns {Function} A `useSelector` hook bound to the specified context.
 */


function createSelectorHook(context) {
  if (context === void 0) {
    context = ReactReduxContext;
  }

  var useReduxContext = context === ReactReduxContext ? useDefaultReduxContext : function () {
    return useContext(context);
  };
  return function useSelector(selector, equalityFn) {
    if (equalityFn === void 0) {
      equalityFn = refEquality;
    }

    if (false) {}

    var _useReduxContext = useReduxContext(),
        store = _useReduxContext.store,
        contextSub = _useReduxContext.subscription;

    var selectedState = useSelectorWithStoreAndSubscription(selector, equalityFn, store, contextSub);
    useDebugValue(selectedState);
    return selectedState;
  };
}
/**
 * A hook to access the redux store's state. This hook takes a selector function
 * as an argument. The selector is called with the store state.
 *
 * This hook takes an optional equality comparison function as the second parameter
 * that allows you to customize the way the selected state is compared to determine
 * whether the component needs to be re-rendered.
 *
 * @param {Function} selector the selector function
 * @param {Function=} equalityFn the function that will be used to determine equality
 *
 * @returns {any} the selected state
 *
 * @example
 *
 * import React from 'react'
 * import { useSelector } from 'react-redux'
 *
 * export const CounterComponent = () => {
 *   const counter = useSelector(state => state.counter)
 *   return <div>{counter}</div>
 * }
 */

var useSelector = /*#__PURE__*/(/* unused pure expression or super */ null && (createSelectorHook()));
// CONCATENATED MODULE: ./node_modules/react-redux/es/utils/reactBatchedUpdates.js
/* eslint-disable import/no-unresolved */

// CONCATENATED MODULE: ./node_modules/react-redux/es/index.js










setBatch(react_dom.unstable_batchedUpdates);

// CONCATENATED MODULE: ./src/components/modal/modal.jsx



var handleClick = function handleClick(toggle, fetchTriviaQuestions) {
  fetchTriviaQuestions();
  toggle();
};

var Modal = function Modal(_ref) {
  var visible = _ref.visible,
      toggle = _ref.toggle,
      fetchTriviaQuestions = _ref.fetchTriviaQuestions;
  return visible ? /*#__PURE__*/react_dom.createPortal( /*#__PURE__*/react.createElement(react.Fragment, null, /*#__PURE__*/react.createElement("div", {
    className: "modal-overlay"
  }, /*#__PURE__*/react.createElement("div", {
    className: "modal-wrapper"
  }, /*#__PURE__*/react.createElement("div", {
    className: "modal"
  }, /*#__PURE__*/react.createElement("div", {
    className: "modal-container"
  }, /*#__PURE__*/react.createElement("h1", null, "Brandon's Tandem Trivia"), /*#__PURE__*/react.createElement("span", null, "10 questions."), /*#__PURE__*/react.createElement("span", null, "30 seconds each."), /*#__PURE__*/react.createElement("span", null, "ready?"), /*#__PURE__*/react.createElement("button", {
    onClick: function onClick() {
      return handleClick(toggle, fetchTriviaQuestions);
    }
  }, "Start")))))), document.body) : null;
};
// CONCATENATED MODULE: ./src/utils/utils.js
var utils_fetchTriviaQuestions = function fetchTriviaQuestions() {
  return fetch("/src/data/triviaData.json").then(function (res) {
    if (!res.ok) {
      throw new Error("HTTP Error " + res.status);
    }

    return res.json();
  }).then(function (data) {
    return data;
  }).catch(function () {
    this.dataError = true;
  });
};
// CONCATENATED MODULE: ./src/actions/actions.js

var UPDATE_QUESTION = 'UPDATE_QUESTION';
var INCREMENT_SCORE = 'INCREMENT_SCORE';
var RESTART_GAME = 'RESTART_GAME';
var START_GAME = 'START_GAME';
var actions_updateQuestion = function updateQuestion() {
  return {
    type: UPDATE_QUESTION
  };
};
var incrementScore = function incrementScore() {
  return {
    type: INCREMENT_SCORE
  };
};
var actions_restartGame = function restartGame() {
  return {
    type: RESTART_GAME
  };
};
var startGame = function startGame(triviaQuestions) {
  return {
    type: START_GAME,
    triviaQuestions: triviaQuestions
  };
};
var actions_incrementScoreAndUpdate = function incrementScoreAndUpdate() {
  return function (dispatch) {
    dispatch(incrementScore());
    dispatch(actions_updateQuestion());
  };
};
var actions_fetchTriviaQuestions = function fetchTriviaQuestions() {
  return function (dispatch) {
    utils_fetchTriviaQuestions().then(function (triviaQuestions) {
      dispatch(startGame(triviaQuestions));
      dispatch(actions_updateQuestion());
    });
  };
};
// CONCATENATED MODULE: ./src/components/modal/modal_container.jsx





var modal_container_mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    updateQuestion: function updateQuestion() {
      return dispatch(actions_updateQuestion());
    },
    fetchTriviaQuestions: function fetchTriviaQuestions() {
      return dispatch(actions_fetchTriviaQuestions());
    }
  };
};

/* harmony default export */ var modal_container = (connect(null, modal_container_mapDispatchToProps)(Modal));
// CONCATENATED MODULE: ./src/hooks/useModal.js
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }



var useModal = function useModal() {
  var _useState = (0,react.useState)(true),
      _useState2 = _slicedToArray(_useState, 2),
      visible = _useState2[0],
      setVisibility = _useState2[1];

  function toggle() {
    setVisibility(!visible);
  }

  return {
    visible: visible,
    toggle: toggle
  };
};

/* harmony default export */ var hooks_useModal = (useModal);
// CONCATENATED MODULE: ./src/components/question/question.jsx


var Question = function Question(_ref) {
  var currentQuestion = _ref.currentQuestion,
      questionNum = _ref.questionNum;
  return /*#__PURE__*/react.createElement("div", {
    className: "question-container"
  }, /*#__PURE__*/react.createElement("span", {
    className: "question-num"
  }, "Q", questionNum, ": "), /*#__PURE__*/react.createElement("span", {
    className: "question-label"
  }, currentQuestion));
};

/* harmony default export */ var question = (Question);
// EXTERNAL MODULE: ./node_modules/async/dist/async.js
var dist_async = __webpack_require__(662);
// CONCATENATED MODULE: ./src/components/answers/answer_item.jsx



var AnswerItem = function AnswerItem(_ref) {
  var answer = _ref.answer,
      checkAnswer = _ref.checkAnswer,
      correctAnswer = _ref.correctAnswer,
      showAnswer = _ref.showAnswer;

  var display = function display() {
    if (showAnswer) {
      return answer === correctAnswer ? "answer-correct" : "answer-incorrect";
    } else {
      return "answer-not-selected";
    }
  };

  var handleClick = function handleClick(e) {
    var allAnswers = document.querySelectorAll('[data-answer]');

    for (var i = 0; i < allAnswers.length; i++) {
      allAnswers[i].className = "answer-not-selected";
    }

    e.currentTarget.className = "answer-selected";
    checkAnswer(answer);
  };

  return /*#__PURE__*/react.createElement("div", {
    className: display(),
    onClick: function onClick(e) {
      return handleClick(e);
    },
    "data-answer": answer
  }, /*#__PURE__*/react.createElement("span", {
    className: "answer-label"
  }, answer));
};

/* harmony default export */ var answer_item = (AnswerItem);
// CONCATENATED MODULE: ./src/components/timer/filler.jsx


var Filler = function Filler(_ref) {
  var percentage = _ref.percentage;
  return /*#__PURE__*/react.createElement("div", {
    className: "filler",
    style: {
      width: "".concat(percentage, "%")
    }
  });
};

/* harmony default export */ var filler = (Filler);
// CONCATENATED MODULE: ./src/components/timer/timerBar.jsx



var TimerBar = function TimerBar(_ref) {
  var percentage = _ref.percentage;
  return /*#__PURE__*/react.createElement("div", {
    className: "timer-bar"
  }, /*#__PURE__*/react.createElement(filler, {
    percentage: percentage
  }));
};

/* harmony default export */ var timerBar = (TimerBar);
// CONCATENATED MODULE: ./src/components/timer/timer.jsx



var Timer = function Timer(_ref) {
  var handleSubmit = _ref.handleSubmit,
      timeLeft = _ref.timeLeft,
      setTimeLeft = _ref.setTimeLeft,
      stopTime = _ref.stopTime;
  (0,react.useEffect)(function () {
    if (timeLeft === 0 && !stopTime) {
      handleSubmit(true);
      return;
    }

    var timerId = null;

    var manageTimer = function manageTimer(stopTime) {
      if (stopTime) {
        clearInterval(timerId);
      } else {
        timerId = setInterval(function () {
          setTimeLeft(timeLeft - 1);
        }, 1000);
      }
    };

    manageTimer(stopTime); //clean up side effect

    return function () {
      return clearInterval(timerId);
    };
  }, [timeLeft]);

  var timeToPercent = function timeToPercent() {
    return timeLeft / 30 * 100;
  };

  return /*#__PURE__*/react.createElement(react.Fragment, null, /*#__PURE__*/react.createElement(timerBar, {
    percentage: timeToPercent()
  }));
};

/* harmony default export */ var timer = (Timer);
// CONCATENATED MODULE: ./src/components/answers/answers.jsx
function answers_slicedToArray(arr, i) { return answers_arrayWithHoles(arr) || answers_iterableToArrayLimit(arr, i) || answers_unsupportedIterableToArray(arr, i) || answers_nonIterableRest(); }

function answers_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function answers_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return answers_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return answers_arrayLikeToArray(o, minLen); }

function answers_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function answers_iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function answers_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }






var Answers = function Answers(_ref) {
  var correctAnswer = _ref.correctAnswer,
      incorrectAnswers = _ref.incorrectAnswers,
      answers = _ref.answers,
      incrementScoreAndUpdate = _ref.incrementScoreAndUpdate,
      updateQuestion = _ref.updateQuestion;

  var _useState = (0,react.useState)("none"),
      _useState2 = answers_slicedToArray(_useState, 2),
      currentAnswer = _useState2[0],
      setCurrentAnswer = _useState2[1];

  var _useState3 = (0,react.useState)(false),
      _useState4 = answers_slicedToArray(_useState3, 2),
      showAnswer = _useState4[0],
      setShowAnswer = _useState4[1];

  var _useState5 = (0,react.useState)(30),
      _useState6 = answers_slicedToArray(_useState5, 2),
      timeLeft = _useState6[0],
      setTimeLeft = _useState6[1];

  var _useState7 = (0,react.useState)(false),
      _useState8 = answers_slicedToArray(_useState7, 2),
      stopTime = _useState8[0],
      setStopTime = _useState8[1];

  var renderAnswers = function renderAnswers() {
    var answerComponents = answers.map(function (answer, i) {
      return /*#__PURE__*/react.createElement(answer_item, {
        key: i,
        answer: answer,
        checkAnswer: checkAnswer,
        showAnswer: showAnswer,
        correctAnswer: correctAnswer
      });
    });
    return answerComponents;
  };

  var checkAnswer = function checkAnswer(selectedAnswer) {
    if (selectedAnswer === correctAnswer) {
      setCurrentAnswer("correct");
    } else {
      setCurrentAnswer("incorrect");
    }
  };

  var renderNextQ = function renderNextQ(dispatchFn) {
    setShowAnswer(true);
    setStopTime(true);
    setTimeout(function () {
      var submit = document.querySelector(".submit-btn");
      submit.disabled = false;
      setStopTime(false);
      setCurrentAnswer("none");
      setTimeLeft(30);
      setShowAnswer(false);
      dispatchFn();
    }, 2000);
  };

  var handleSubmit = function handleSubmit(timeOut) {
    var submit = document.querySelector('.submit-btn');
    submit.disabled = true;
    if (timeOut && currentAnswer === "none") currentAnswer = "incorrect";

    if (currentAnswer === "correct") {
      renderNextQ(incrementScoreAndUpdate);
    } else if (currentAnswer === "incorrect") {
      renderNextQ(updateQuestion);
    } else {
      alert("Please choose an answer");
    }
  };

  return /*#__PURE__*/react.createElement("div", {
    className: "answers-container"
  }, renderAnswers(), /*#__PURE__*/react.createElement(timer, {
    timeLeft: timeLeft,
    stopTime: stopTime,
    setTimeLeft: setTimeLeft,
    currentAnswer: currentAnswer,
    handleSubmit: handleSubmit
  }), /*#__PURE__*/react.createElement("button", {
    className: "submit-btn",
    onClick: function onClick() {
      return handleSubmit();
    }
  }, "Submit"));
};

/* harmony default export */ var answers = (Answers);
// CONCATENATED MODULE: ./src/components/answers/answers_container.jsx



 // const mapStateToProps = ({ correctAnswer, incorrrectAnswers }) => {
//     return({
//         correctAnswer,
//         incorrrectAnswers
//     });
// };

var answers_container_mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    updateQuestion: function updateQuestion() {
      return dispatch(actions_updateQuestion());
    },
    incrementScoreAndUpdate: function incrementScoreAndUpdate() {
      return dispatch(actions_incrementScoreAndUpdate());
    }
  };
};

/* harmony default export */ var answers_container = (connect(null, answers_container_mapDispatchToProps)(answers));
// CONCATENATED MODULE: ./src/components/score/score.jsx


var Score = function Score(_ref) {
  var score = _ref.score,
      end = _ref.end;

  var className = function className() {
    return end ? "score-end" : "score-game";
  };

  return /*#__PURE__*/react.createElement("div", {
    className: className()
  }, score, " / 10");
};

/* harmony default export */ var score_score = (Score);
// CONCATENATED MODULE: ./src/components/board/board.jsx






var Board = function Board(_ref) {
  var currentQuestion = _ref.currentQuestion,
      correctAnswer = _ref.correctAnswer,
      incorrectAnswers = _ref.incorrectAnswers,
      score = _ref.score,
      questionNum = _ref.questionNum;

  //Durstenfeld Shuffle (optimized Fisher-Yates Shuffle)
  var randomizeAnswers = function randomizeAnswers(correctAnswer, incorrectAnswers) {
    var answers = [correctAnswer].concat(incorrectAnswers);

    for (var currentIndex = answers.length - 1; currentIndex > 0; currentIndex--) {
      var randomIndex = Math.floor(Math.random() * (currentIndex + 1));
      var temp = answers[currentIndex];
      answers[currentIndex] = answers[randomIndex];
      answers[randomIndex] = temp;
    }

    return answers;
  };

  return /*#__PURE__*/react.createElement("div", {
    className: "board-container"
  }, /*#__PURE__*/react.createElement(score_score, {
    score: score
  }), /*#__PURE__*/react.createElement(question, {
    currentQuestion: currentQuestion,
    questionNum: questionNum
  }), /*#__PURE__*/react.createElement(answers_container, {
    correctAnswer: correctAnswer,
    incorrectAnswers: incorrectAnswers,
    answers: randomizeAnswers(correctAnswer, incorrectAnswers)
  }));
};

/* harmony default export */ var board = (Board);
// CONCATENATED MODULE: ./src/components/board/board_container.jsx





var board_container_mapStateToProps = function mapStateToProps(_ref) {
  var currentQuestion = _ref.currentQuestion,
      correctAnswer = _ref.correctAnswer,
      incorrectAnswers = _ref.incorrectAnswers,
      score = _ref.score,
      questionNum = _ref.questionNum;
  return {
    currentQuestion: currentQuestion,
    correctAnswer: correctAnswer,
    incorrectAnswers: incorrectAnswers,
    score: score,
    questionNum: questionNum
  };
};

var board_container_mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    updateQuestion: function updateQuestion() {
      return dispatch(actions_updateQuestion());
    }
  };
};

/* harmony default export */ var board_container = (connect(board_container_mapStateToProps, board_container_mapDispatchToProps)(board));
// CONCATENATED MODULE: ./src/components/end/end.jsx



var End = function End(_ref) {
  var score = _ref.score,
      fetchTriviaQuestions = _ref.fetchTriviaQuestions;
  return /*#__PURE__*/react.createElement("div", {
    className: "end-container"
  }, /*#__PURE__*/react.createElement(score_score, {
    score: score,
    end: true
  }), /*#__PURE__*/react.createElement("span", null, "the end!"), /*#__PURE__*/react.createElement("button", {
    onClick: function onClick() {
      return fetchTriviaQuestions();
    }
  }, "Play Again"));
};

/* harmony default export */ var end = (End);
// CONCATENATED MODULE: ./src/components/end/end_container.jsx





var end_container_mapStateToProps = function mapStateToProps(_ref) {
  var score = _ref.score;
  return {
    score: score
  };
};

var end_container_mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    restartGame: function restartGame() {
      return dispatch(actions_restartGame());
    },
    fetchTriviaQuestions: function fetchTriviaQuestions() {
      return dispatch(actions_fetchTriviaQuestions());
    }
  };
};

/* harmony default export */ var end_container = (connect(end_container_mapStateToProps, end_container_mapDispatchToProps)(end));
// CONCATENATED MODULE: ./src/components/display/display.jsx





var Display = function Display(_ref) {
  var questionNum = _ref.questionNum;

  if (questionNum > 10) {
    return /*#__PURE__*/react.createElement(end_container, null);
  } else if (questionNum > 0 && questionNum <= 10) {
    return /*#__PURE__*/react.createElement(board_container, null);
  } else {
    return null;
  }
};

/* harmony default export */ var display = (Display);
// CONCATENATED MODULE: ./src/components/display/display_container.jsx




var display_container_mapStateToProps = function mapStateToProps(_ref) {
  var questionNum = _ref.questionNum;
  return {
    questionNum: questionNum
  };
};

var display_container_mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {};
};

/* harmony default export */ var display_container = (connect(display_container_mapStateToProps, display_container_mapDispatchToProps)(display));
// CONCATENATED MODULE: ./src/App.jsx



 // import BoardContainer from './components/board/board_container';



var App = function App(_ref) {
  var store = _ref.store;

  var _useModal = hooks_useModal(),
      visible = _useModal.visible,
      toggle = _useModal.toggle;

  var state = store.getState();
  return /*#__PURE__*/react.createElement(components_Provider, {
    store: store
  }, /*#__PURE__*/react.createElement("div", {
    className: "App"
  }, /*#__PURE__*/react.createElement(modal_container, {
    visible: visible,
    toggle: toggle
  }), /*#__PURE__*/react.createElement(display_container, null)));
};

/* harmony default export */ var src_App = (App);
// CONCATENATED MODULE: ./src/middleware/thunk.js
var thunk = function thunk(_ref) {
  var dispatch = _ref.dispatch,
      getState = _ref.getState;
  return function (next) {
    return function (action) {
      if (typeof action === "function") {
        return action(dispatch, getState);
      }

      return next(action);
    };
  };
};
// CONCATENATED MODULE: ./src/data/triviaData.json
var triviaData_namespaceObject = [];
// CONCATENATED MODULE: ./src/reducers/reducers.js


var initialState = {
  currentQuestion: null,
  correctAnswer: null,
  incorrectAnswers: null,
  score: 0,
  questionNum: 0
};

var updateState = function updateState() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  Object.freeze(state);
  var stateCopy = Object.assign({}, state);

  switch (action.type) {
    case START_GAME:
      var newInitialState = Object.assign({}, initialState);
      var triviaQuestions = action.triviaQuestions;
      return Object.assign(newInitialState, {
        questionBank: triviaQuestions
      });

    case UPDATE_QUESTION:
      var questionBank = stateCopy.questionBank,
          questionNum = stateCopy.questionNum;
      var newQuestion = updateQuestion(questionBank);
      var question = newQuestion.question,
          correct = newQuestion.correct,
          incorrect = newQuestion.incorrect;
      var updatedQuestionData = {
        currentQuestion: question,
        correctAnswer: correct,
        incorrectAnswers: incorrect,
        questionNum: questionNum + 1,
        questionBank: questionBank
      };
      return Object.assign(stateCopy, updatedQuestionData);

    case INCREMENT_SCORE:
      var score = stateCopy.score;
      score++;
      return Object.assign(stateCopy, {
        score: score
      });

    default:
      return state;
  }
};

var updateQuestion = function updateQuestion(questionBank) {
  return randomizeArray(questionBank).pop();
};

var randomizeArray = function randomizeArray(array) {
  for (var currentIndex = array.length - 1; currentIndex > 0; currentIndex--) {
    var randomIndex = Math.floor(Math.random() * (currentIndex + 1));
    var temp = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temp;
  }

  return array;
};

/* harmony default export */ var reducers = (updateState);
// EXTERNAL MODULE: ./node_modules/redux-logger/dist/redux-logger.js
var redux_logger = __webpack_require__(682);
// CONCATENATED MODULE: ./src/store/store.js



 //remove logger when deploying to production

var configureStore = function configureStore() {
  return createStore(reducers, applyMiddleware(thunk));
};

/* harmony default export */ var store_store = (configureStore);
// CONCATENATED MODULE: ./src/entry.jsx





document.addEventListener("DOMContentLoaded", function () {
  var root = document.getElementById("root");
  var store = store_store();
  react_dom.render( /*#__PURE__*/react.createElement(src_App, {
    store: store
  }), root);
});
}();
/******/ })()
;
//# sourceMappingURL=bundle.js.map