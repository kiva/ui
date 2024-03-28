(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[15],{

/***/ 5012:
/***/ (function(module, exports, __webpack_require__) {

var eq = __webpack_require__(989),
    isArrayLike = __webpack_require__(387),
    isIndex = __webpack_require__(991),
    isObject = __webpack_require__(333);

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike(object) && isIndex(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq(object[index], value);
  }
  return false;
}

module.exports = isIterateeCall;


/***/ }),

/***/ 5113:
/***/ (function(module, exports, __webpack_require__) {

var baseFlatten = __webpack_require__(2468),
    baseOrderBy = __webpack_require__(2487),
    baseRest = __webpack_require__(2465),
    isIterateeCall = __webpack_require__(5012);

/**
 * Creates an array of elements, sorted in ascending order by the results of
 * running each element in a collection thru each iteratee. This method
 * performs a stable sort, that is, it preserves the original sort order of
 * equal elements. The iteratees are invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {...(Function|Function[])} [iteratees=[_.identity]]
 *  The iteratees to sort by.
 * @returns {Array} Returns the new sorted array.
 * @example
 *
 * var users = [
 *   { 'user': 'fred',   'age': 48 },
 *   { 'user': 'barney', 'age': 36 },
 *   { 'user': 'fred',   'age': 30 },
 *   { 'user': 'barney', 'age': 34 }
 * ];
 *
 * _.sortBy(users, [function(o) { return o.user; }]);
 * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 30]]
 *
 * _.sortBy(users, ['user', 'age']);
 * // => objects for [['barney', 34], ['barney', 36], ['fred', 30], ['fred', 48]]
 */
var sortBy = baseRest(function(collection, iteratees) {
  if (collection == null) {
    return [];
  }
  var length = iteratees.length;
  if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {
    iteratees = [];
  } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
    iteratees = [iteratees[0]];
  }
  return baseOrderBy(collection, baseFlatten(iteratees, 1), []);
});

module.exports = sortBy;


/***/ }),

/***/ 5311:
/***/ (function(module, exports, __webpack_require__) {

var baseAssignValue = __webpack_require__(992),
    eq = __webpack_require__(989);

/**
 * This function is like `assignValue` except that it doesn't assign
 * `undefined` values.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignMergeValue(object, key, value) {
  if ((value !== undefined && !eq(object[key], value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue(object, key, value);
  }
}

module.exports = assignMergeValue;


/***/ }),

/***/ 5312:
/***/ (function(module, exports) {

/**
 * Gets the value at `key`, unless `key` is "__proto__" or "constructor".
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function safeGet(object, key) {
  if (key === 'constructor' && typeof object[key] === 'function') {
    return;
  }

  if (key == '__proto__') {
    return;
  }

  return object[key];
}

module.exports = safeGet;


/***/ }),

/***/ 5591:
/***/ (function(module, exports, __webpack_require__) {

var baseFlatten = __webpack_require__(2468),
    baseRest = __webpack_require__(2465),
    baseUniq = __webpack_require__(2505),
    isArrayLikeObject = __webpack_require__(2477);

/**
 * Creates an array of unique values, in order, from all given arrays using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @returns {Array} Returns the new array of combined values.
 * @example
 *
 * _.union([2], [1, 2]);
 * // => [2, 1]
 */
var union = baseRest(function(arrays) {
  return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));
});

module.exports = union;


/***/ }),

/***/ 5592:
/***/ (function(module, exports, __webpack_require__) {

var baseDifference = __webpack_require__(5593),
    baseRest = __webpack_require__(2465),
    isArrayLikeObject = __webpack_require__(2477);

/**
 * Creates an array excluding all given values using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * **Note:** Unlike `_.pull`, this method returns a new array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {...*} [values] The values to exclude.
 * @returns {Array} Returns the new array of filtered values.
 * @see _.difference, _.xor
 * @example
 *
 * _.without([2, 1, 2, 3], 1, 2);
 * // => [3]
 */
var without = baseRest(function(array, values) {
  return isArrayLikeObject(array)
    ? baseDifference(array, values)
    : [];
});

module.exports = without;


/***/ }),

/***/ 5593:
/***/ (function(module, exports, __webpack_require__) {

var SetCache = __webpack_require__(1407),
    arrayIncludes = __webpack_require__(2506),
    arrayIncludesWith = __webpack_require__(2507),
    arrayMap = __webpack_require__(446),
    baseUnary = __webpack_require__(1411),
    cacheHas = __webpack_require__(1408);

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * The base implementation of methods like `_.difference` without support
 * for excluding multiple arrays or iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Array} values The values to exclude.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new array of filtered values.
 */
function baseDifference(array, values, iteratee, comparator) {
  var index = -1,
      includes = arrayIncludes,
      isCommon = true,
      length = array.length,
      result = [],
      valuesLength = values.length;

  if (!length) {
    return result;
  }
  if (iteratee) {
    values = arrayMap(values, baseUnary(iteratee));
  }
  if (comparator) {
    includes = arrayIncludesWith;
    isCommon = false;
  }
  else if (values.length >= LARGE_ARRAY_SIZE) {
    includes = cacheHas;
    isCommon = false;
    values = new SetCache(values);
  }
  outer:
  while (++index < length) {
    var value = array[index],
        computed = iteratee == null ? value : iteratee(value);

    value = (comparator || value !== 0) ? value : 0;
    if (isCommon && computed === computed) {
      var valuesIndex = valuesLength;
      while (valuesIndex--) {
        if (values[valuesIndex] === computed) {
          continue outer;
        }
      }
      result.push(value);
    }
    else if (!includes(values, computed, comparator)) {
      result.push(value);
    }
  }
  return result;
}

module.exports = baseDifference;


/***/ }),

/***/ 5608:
/***/ (function(module, exports, __webpack_require__) {

var apply = __webpack_require__(2478),
    baseEach = __webpack_require__(706),
    baseInvoke = __webpack_require__(5609),
    baseRest = __webpack_require__(2465),
    isArrayLike = __webpack_require__(387);

/**
 * Invokes the method at `path` of each element in `collection`, returning
 * an array of the results of each invoked method. Any additional arguments
 * are provided to each invoked method. If `path` is a function, it's invoked
 * for, and `this` bound to, each element in `collection`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Array|Function|string} path The path of the method to invoke or
 *  the function invoked per iteration.
 * @param {...*} [args] The arguments to invoke each method with.
 * @returns {Array} Returns the array of results.
 * @example
 *
 * _.invokeMap([[5, 1, 7], [3, 2, 1]], 'sort');
 * // => [[1, 5, 7], [1, 2, 3]]
 *
 * _.invokeMap([123, 456], String.prototype.split, '');
 * // => [['1', '2', '3'], ['4', '5', '6']]
 */
var invokeMap = baseRest(function(collection, path, args) {
  var index = -1,
      isFunc = typeof path == 'function',
      result = isArrayLike(collection) ? Array(collection.length) : [];

  baseEach(collection, function(value) {
    result[++index] = isFunc ? apply(path, value, args) : baseInvoke(value, path, args);
  });
  return result;
});

module.exports = invokeMap;


/***/ }),

/***/ 5609:
/***/ (function(module, exports, __webpack_require__) {

var apply = __webpack_require__(2478),
    castPath = __webpack_require__(704),
    last = __webpack_require__(5610),
    parent = __webpack_require__(5611),
    toKey = __webpack_require__(546);

/**
 * The base implementation of `_.invoke` without support for individual
 * method arguments.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the method to invoke.
 * @param {Array} args The arguments to invoke the method with.
 * @returns {*} Returns the result of the invoked method.
 */
function baseInvoke(object, path, args) {
  path = castPath(path, object);
  object = parent(object, path);
  var func = object == null ? object : object[toKey(last(path))];
  return func == null ? undefined : apply(func, object, args);
}

module.exports = baseInvoke;


/***/ }),

/***/ 5610:
/***/ (function(module, exports) {

/**
 * Gets the last element of `array`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to query.
 * @returns {*} Returns the last element of `array`.
 * @example
 *
 * _.last([1, 2, 3]);
 * // => 3
 */
function last(array) {
  var length = array == null ? 0 : array.length;
  return length ? array[length - 1] : undefined;
}

module.exports = last;


/***/ }),

/***/ 5611:
/***/ (function(module, exports, __webpack_require__) {

var baseGet = __webpack_require__(703),
    baseSlice = __webpack_require__(1404);

/**
 * Gets the parent value at `path` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} path The path to get the parent value of.
 * @returns {*} Returns the parent value.
 */
function parent(object, path) {
  return path.length < 2 ? object : baseGet(object, baseSlice(path, 0, -1));
}

module.exports = parent;


/***/ }),

/***/ 5612:
/***/ (function(module, exports, __webpack_require__) {

var baseMerge = __webpack_require__(5613),
    createAssigner = __webpack_require__(5623);

/**
 * This method is like `_.assign` except that it recursively merges own and
 * inherited enumerable string keyed properties of source objects into the
 * destination object. Source properties that resolve to `undefined` are
 * skipped if a destination value exists. Array and plain object properties
 * are merged recursively. Other objects and value types are overridden by
 * assignment. Source objects are applied from left to right. Subsequent
 * sources overwrite property assignments of previous sources.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 0.5.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var object = {
 *   'a': [{ 'b': 2 }, { 'd': 4 }]
 * };
 *
 * var other = {
 *   'a': [{ 'c': 3 }, { 'e': 5 }]
 * };
 *
 * _.merge(object, other);
 * // => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }
 */
var merge = createAssigner(function(object, source, srcIndex) {
  baseMerge(object, source, srcIndex);
});

module.exports = merge;


/***/ }),

/***/ 5613:
/***/ (function(module, exports, __webpack_require__) {

var Stack = __webpack_require__(1405),
    assignMergeValue = __webpack_require__(5311),
    baseFor = __webpack_require__(2489),
    baseMergeDeep = __webpack_require__(5614),
    isObject = __webpack_require__(333),
    keysIn = __webpack_require__(2479),
    safeGet = __webpack_require__(5312);

/**
 * The base implementation of `_.merge` without support for multiple sources.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} [customizer] The function to customize merged values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMerge(object, source, srcIndex, customizer, stack) {
  if (object === source) {
    return;
  }
  baseFor(source, function(srcValue, key) {
    stack || (stack = new Stack);
    if (isObject(srcValue)) {
      baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
    }
    else {
      var newValue = customizer
        ? customizer(safeGet(object, key), srcValue, (key + ''), object, source, stack)
        : undefined;

      if (newValue === undefined) {
        newValue = srcValue;
      }
      assignMergeValue(object, key, newValue);
    }
  }, keysIn);
}

module.exports = baseMerge;


/***/ }),

/***/ 5614:
/***/ (function(module, exports, __webpack_require__) {

var assignMergeValue = __webpack_require__(5311),
    cloneBuffer = __webpack_require__(5615),
    cloneTypedArray = __webpack_require__(5616),
    copyArray = __webpack_require__(5618),
    initCloneObject = __webpack_require__(5619),
    isArguments = __webpack_require__(996),
    isArray = __webpack_require__(146),
    isArrayLikeObject = __webpack_require__(2477),
    isBuffer = __webpack_require__(1409),
    isFunction = __webpack_require__(1406),
    isObject = __webpack_require__(333),
    isPlainObject = __webpack_require__(258),
    isTypedArray = __webpack_require__(1410),
    safeGet = __webpack_require__(5312),
    toPlainObject = __webpack_require__(5621);

/**
 * A specialized version of `baseMerge` for arrays and objects which performs
 * deep merges and tracks traversed objects enabling objects with circular
 * references to be merged.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {string} key The key of the value to merge.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} mergeFunc The function to merge values.
 * @param {Function} [customizer] The function to customize assigned values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
  var objValue = safeGet(object, key),
      srcValue = safeGet(source, key),
      stacked = stack.get(srcValue);

  if (stacked) {
    assignMergeValue(object, key, stacked);
    return;
  }
  var newValue = customizer
    ? customizer(objValue, srcValue, (key + ''), object, source, stack)
    : undefined;

  var isCommon = newValue === undefined;

  if (isCommon) {
    var isArr = isArray(srcValue),
        isBuff = !isArr && isBuffer(srcValue),
        isTyped = !isArr && !isBuff && isTypedArray(srcValue);

    newValue = srcValue;
    if (isArr || isBuff || isTyped) {
      if (isArray(objValue)) {
        newValue = objValue;
      }
      else if (isArrayLikeObject(objValue)) {
        newValue = copyArray(objValue);
      }
      else if (isBuff) {
        isCommon = false;
        newValue = cloneBuffer(srcValue, true);
      }
      else if (isTyped) {
        isCommon = false;
        newValue = cloneTypedArray(srcValue, true);
      }
      else {
        newValue = [];
      }
    }
    else if (isPlainObject(srcValue) || isArguments(srcValue)) {
      newValue = objValue;
      if (isArguments(objValue)) {
        newValue = toPlainObject(objValue);
      }
      else if (!isObject(objValue) || isFunction(objValue)) {
        newValue = initCloneObject(srcValue);
      }
    }
    else {
      isCommon = false;
    }
  }
  if (isCommon) {
    // Recursively merge objects and arrays (susceptible to call stack limits).
    stack.set(srcValue, newValue);
    mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
    stack['delete'](srcValue);
  }
  assignMergeValue(object, key, newValue);
}

module.exports = baseMergeDeep;


/***/ }),

/***/ 5615:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var root = __webpack_require__(264);

/** Detect free variable `exports`. */
var freeExports =  true && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
    allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var length = buffer.length,
      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

  buffer.copy(result);
  return result;
}

module.exports = cloneBuffer;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(985)(module)))

/***/ }),

/***/ 5616:
/***/ (function(module, exports, __webpack_require__) {

var cloneArrayBuffer = __webpack_require__(5617);

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

module.exports = cloneTypedArray;


/***/ }),

/***/ 5617:
/***/ (function(module, exports, __webpack_require__) {

var Uint8Array = __webpack_require__(2488);

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  return result;
}

module.exports = cloneArrayBuffer;


/***/ }),

/***/ 5618:
/***/ (function(module, exports) {

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

module.exports = copyArray;


/***/ }),

/***/ 5619:
/***/ (function(module, exports, __webpack_require__) {

var baseCreate = __webpack_require__(5620),
    getPrototype = __webpack_require__(1413),
    isPrototype = __webpack_require__(1412);

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !isPrototype(object))
    ? baseCreate(getPrototype(object))
    : {};
}

module.exports = initCloneObject;


/***/ }),

/***/ 5620:
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(333);

/** Built-in value references. */
var objectCreate = Object.create;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 */
var baseCreate = (function() {
  function object() {}
  return function(proto) {
    if (!isObject(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object;
    object.prototype = undefined;
    return result;
  };
}());

module.exports = baseCreate;


/***/ }),

/***/ 5621:
/***/ (function(module, exports, __webpack_require__) {

var copyObject = __webpack_require__(5622),
    keysIn = __webpack_require__(2479);

/**
 * Converts `value` to a plain object flattening inherited enumerable string
 * keyed properties of `value` to own properties of the plain object.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {Object} Returns the converted plain object.
 * @example
 *
 * function Foo() {
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.assign({ 'a': 1 }, new Foo);
 * // => { 'a': 1, 'b': 2 }
 *
 * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
 * // => { 'a': 1, 'b': 2, 'c': 3 }
 */
function toPlainObject(value) {
  return copyObject(value, keysIn(value));
}

module.exports = toPlainObject;


/***/ }),

/***/ 5622:
/***/ (function(module, exports, __webpack_require__) {

var assignValue = __webpack_require__(2490),
    baseAssignValue = __webpack_require__(992);

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    if (newValue === undefined) {
      newValue = source[key];
    }
    if (isNew) {
      baseAssignValue(object, key, newValue);
    } else {
      assignValue(object, key, newValue);
    }
  }
  return object;
}

module.exports = copyObject;


/***/ }),

/***/ 5623:
/***/ (function(module, exports, __webpack_require__) {

var baseRest = __webpack_require__(2465),
    isIterateeCall = __webpack_require__(5012);

/**
 * Creates a function like `_.assign`.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return baseRest(function(object, sources) {
    var index = -1,
        length = sources.length,
        customizer = length > 1 ? sources[length - 1] : undefined,
        guard = length > 2 ? sources[2] : undefined;

    customizer = (assigner.length > 3 && typeof customizer == 'function')
      ? (length--, customizer)
      : undefined;

    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, index, customizer);
      }
    }
    return object;
  });
}

module.exports = createAssigner;


/***/ }),

/***/ 5731:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./node_modules/vue-docgen-loader/lib!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./node_modules/@kiva/kv-components/vue/KvAccordionItem.vue?vue&type=template&id=37d62dfc&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"tw-border-b tw-border-tertiary tw-relative last:tw-border-b-0"},[_c('button',{staticClass:"tw-w-full tw-flex tw-justify-between tw-items-center tw-py-1.5 tw-px-0\n\t\t\ttw-text-left disabled:tw-cursor-not-allowed disabled:tw-opacity-low\n\t\t\thover:tw-text-action-highlight focus:tw-text-action-highlight",attrs:{"disabled":_vm.disabled,"aria-controls":("kv-accordion-" + _vm.id),"aria-expanded":_vm.isOpen ? 'true' : 'false'},on:{"click":function($event){$event.preventDefault();return _vm.toggle.apply(null, arguments)}}},[_c('span',{staticClass:"tw-flex-1"},[_vm._t("header")],2),_vm._v(" "),_c('kv-material-icon',{staticClass:"tw-h-3 tw-w-3 tw-transition tw-transform tw-duration-500 tw-ease",class:{ 'tw-rotate-180' : _vm.isOpen },attrs:{"icon":_vm.mdiChevronDown}})],1),_vm._v(" "),_c('kv-expandable',[_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.isOpen),expression:"isOpen"}],attrs:{"id":("kv-accordion-" + _vm.id),"aria-hidden":_vm.isOpen ? 'false' : 'true'}},[_vm._t("default")],2)])],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./node_modules/@kiva/kv-components/vue/KvAccordionItem.vue?vue&type=template&id=37d62dfc&

// EXTERNAL MODULE: ./node_modules/vue-demi/lib/index.mjs
var lib = __webpack_require__(13);

// EXTERNAL MODULE: ./node_modules/@kiva/kv-components/node_modules/@mdi/js/mdi.js
var mdi = __webpack_require__(225);

// CONCATENATED MODULE: ./node_modules/vue-docgen-loader/lib!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./node_modules/@kiva/kv-components/vue/KvExpandable.vue?vue&type=template&id=65505a42&
var KvExpandablevue_type_template_id_65505a42_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('transition',{on:{"enter":_vm.enter,"leave":_vm.leave}},[_vm._t("default")],2)}
var KvExpandablevue_type_template_id_65505a42_staticRenderFns = []


// CONCATENATED MODULE: ./node_modules/@kiva/kv-components/vue/KvExpandable.vue?vue&type=template&id=65505a42&

// CONCATENATED MODULE: ./node_modules/@kiva/kv-components/utils/expander.js
/* eslint-disable no-param-reassign */
function setInitialStyle(el, _ref) {
  var property = _ref.property,
      delay = _ref.delay,
      easing = _ref.easing;
  el.style.overflow = 'hidden';
  el.style.transition = "".concat(property, " ").concat(delay, "ms ").concat(easing);
}

function unsetStyles(el, _ref2) {
  var property = _ref2.property;
  el.style[property] = null;
  el.style.overflow = null;
  el.style.transition = null;
}

function expander_expand(el, _ref3) {
  var _ref3$easing = _ref3.easing,
      easing = _ref3$easing === void 0 ? 'ease' : _ref3$easing,
      _ref3$delay = _ref3.delay,
      delay = _ref3$delay === void 0 ? 500 : _ref3$delay,
      _ref3$done = _ref3.done,
      done = _ref3$done === void 0 ? function () {} : _ref3$done,
      _ref3$from = _ref3.from,
      from = _ref3$from === void 0 ? 0 : _ref3$from,
      _ref3$property = _ref3.property,
      property = _ref3$property === void 0 ? 'height' : _ref3$property;
  // set initial styles
  setInitialStyle(el, {
    property: property,
    delay: delay,
    easing: easing
  }); // need to measure the property, so first set the value to 'auto'
  // then unset display:none from v-show

  el.style[property] = 'auto';
  el.style.display = null; // measure the property

  var propValue = window.getComputedStyle(el).getPropertyValue(property); // set the property to the 'from' value

  el.style[property] = from;
  el.addEventListener('transitionend', function listener() {
    unsetStyles(el, {
      property: property
    }); // finally, call the done callback after the transition

    done();
    el.removeEventListener('transitionend', listener, true);
  }, true); // hack to cause the browser to reflow

  void el.offsetWidth; // eslint-disable-line no-void
  // ...and set the property to the measured value on the next tick so it animates w/ css

  el.style[property] = propValue;
}
function expander_collapse(el, _ref4) {
  var _ref4$easing = _ref4.easing,
      easing = _ref4$easing === void 0 ? 'ease' : _ref4$easing,
      _ref4$delay = _ref4.delay,
      delay = _ref4$delay === void 0 ? 500 : _ref4$delay,
      _ref4$done = _ref4.done,
      done = _ref4$done === void 0 ? function () {} : _ref4$done,
      _ref4$to = _ref4.to,
      to = _ref4$to === void 0 ? 0 : _ref4$to,
      _ref4$property = _ref4.property,
      property = _ref4$property === void 0 ? 'height' : _ref4$property;
  // set initial styles
  setInitialStyle(el, {
    property: property,
    delay: delay,
    easing: easing
  }); // explicitly set the property value...

  el.style[property] = window.getComputedStyle(el).getPropertyValue(property);
  el.addEventListener('transitionend', function listener() {
    unsetStyles(el, {
      property: property
    }); // finally, call the done callback after the transition

    done();
    el.removeEventListener('transitionend', listener, true);
  }, true); // hack to cause the browser to reflow

  void el.offsetWidth; // eslint-disable-line no-void
  // ...and set the property to the 'to' value on the next tick so it animates w/ css

  el.style[property] = to;
}
// CONCATENATED MODULE: ./node_modules/vue-docgen-loader/lib!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib??ref--9-1!./node_modules/vue-loader/lib??vue-loader-options!./node_modules/@kiva/kv-components/vue/KvExpandable.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//


/* harmony default export */ var KvExpandablevue_type_script_lang_js_ = ({
  props: {
    property: {
      type: String,
      default: 'height'
    },
    delay: {
      type: Number,
      default: 500
    },
    easing: {
      type: String,
      default: 'ease'
    },
    skipEnter: {
      type: Boolean,
      default: false
    },
    skipLeave: {
      type: Boolean,
      default: false
    }
  },
  setup: function setup(props) {
    var _toRefs = Object(lib["toRefs"])(props),
        property = _toRefs.property,
        delay = _toRefs.delay,
        easing = _toRefs.easing,
        skipEnter = _toRefs.skipEnter,
        skipLeave = _toRefs.skipLeave;

    var enter = function enter(el, done) {
      if (skipEnter.value) {
        return done();
      }

      expander_expand(el, {
        property: property.value,
        delay: delay.value,
        easing: easing.value,
        done: done
      });
      return true;
    };

    var leave = function leave(el, done) {
      if (skipLeave.value) {
        return done();
      }

      expander_collapse(el, {
        property: property.value,
        delay: delay.value,
        easing: easing.value,
        done: done
      });
      return true;
    };

    return {
      enter: enter,
      leave: leave
    };
  }
});
// CONCATENATED MODULE: ./node_modules/@kiva/kv-components/vue/KvExpandable.vue?vue&type=script&lang=js&
 /* harmony default export */ var vue_KvExpandablevue_type_script_lang_js_ = (KvExpandablevue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./node_modules/@kiva/kv-components/vue/KvExpandable.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  vue_KvExpandablevue_type_script_lang_js_,
  KvExpandablevue_type_template_id_65505a42_render,
  KvExpandablevue_type_template_id_65505a42_staticRenderFns,
  false,
  null,
  null,
  null
  
)

const __vuedocgen_export_0 = component.exports;
/* harmony default export */ var KvExpandable = (__vuedocgen_export_0);
__vuedocgen_export_0.__docgenInfo = {"exportName":"default","displayName":"KvExpandable","description":"","tags":{},"props":[{"name":"property","type":{"name":"string"},"defaultValue":{"func":false,"value":"'height'"}},{"name":"delay","type":{"name":"number"},"defaultValue":{"func":false,"value":"500"}},{"name":"easing","type":{"name":"string"},"defaultValue":{"func":false,"value":"'ease'"}},{"name":"skipEnter","type":{"name":"boolean"},"defaultValue":{"func":false,"value":"false"}},{"name":"skipLeave","type":{"name":"boolean"},"defaultValue":{"func":false,"value":"false"}}],"slots":[{"name":"default"}]}
// EXTERNAL MODULE: ./node_modules/@kiva/kv-components/vue/KvMaterialIcon.vue + 4 modules
var KvMaterialIcon = __webpack_require__(14);

// CONCATENATED MODULE: ./node_modules/vue-docgen-loader/lib!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib??ref--9-1!./node_modules/vue-loader/lib??vue-loader-options!./node_modules/@kiva/kv-components/vue/KvAccordionItem.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
// Accordion a11y resources
// https://www.w3.org/TR/wai-aria-practices-1.1/examples/accordion/accordion.html
// https://www.aditus.io/patterns/accordion/
// Future improvement
// Currently the slot content is inside the button, which means h2, h3 etc. won't be
// navigatable via headings. See https://daverupert.com/2019/12/why-details-is-not-an-accordion/
// h2 + button // ✅ H1 will show up when navigating by headings
// button + h2 // ❌ H1 will not show up when navigating by headings
// Perhaps we could do some magic DOM reordering via this.$slots.header or
// pass a prop like 'tag' that sets the parent node of the button. <accordion tag="h3">...




/* harmony default export */ var KvAccordionItemvue_type_script_lang_js_ = ({
  components: {
    KvMaterialIcon: KvMaterialIcon["a" /* default */],
    KvExpandable: KvExpandable
  },
  props: {
    /**
    * Unique id. used for a11y
    * */
    id: {
      type: String,
      required: true,
      validator: function validator(v) {
        return v.length > 0 && !/\s/g.test(v);
      } // must be a valid html5 id

    },

    /**
    	* Whether the body is shown initially
    * */
    open: {
      type: Boolean,
      default: false
    },

    /**
     * Whether the accordion can be toggled
    * */
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['toggle'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit;

    var _toRefs = Object(lib["toRefs"])(props),
        open = _toRefs.open,
        disabled = _toRefs.disabled;

    var isOpen = Object(lib["ref"])(open.value);

    var toggle = function toggle() {
      if (!disabled.value) {
        isOpen.value = !isOpen.value;
        /**
         * Fires when the accordion has been toggled.
         * Contains an object with a boolean 'open' property of the current open
         * state of the accordion
         * @event toggle
         * @type {Event}
         */

        emit('toggle', {
          open: isOpen.value
        });
      }
    };

    var expand = function expand() {
      if (!disabled.value) {
        isOpen.value = true;
      }
    };

    var collapse = function collapse() {
      if (!disabled.value) {
        isOpen.value = false;
      }
    };

    return {
      collapse: collapse,
      expand: expand,
      isOpen: isOpen,
      mdiChevronDown: mdi["b" /* mdiChevronDown */],
      toggle: toggle
    };
  }
});
// CONCATENATED MODULE: ./node_modules/@kiva/kv-components/vue/KvAccordionItem.vue?vue&type=script&lang=js&
 /* harmony default export */ var vue_KvAccordionItemvue_type_script_lang_js_ = (KvAccordionItemvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./node_modules/@kiva/kv-components/vue/KvAccordionItem.vue





/* normalize component */

var KvAccordionItem_component = Object(componentNormalizer["a" /* default */])(
  vue_KvAccordionItemvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

const KvAccordionItem_vuedocgen_export_0 = KvAccordionItem_component.exports;
/* harmony default export */ var KvAccordionItem = __webpack_exports__["a"] = (KvAccordionItem_vuedocgen_export_0);
KvAccordionItem_vuedocgen_export_0.__docgenInfo = {"exportName":"default","displayName":"KvAccordionItem","description":"","tags":{},"props":[{"name":"id","description":"Unique id. used for a11y","type":{"name":"string"},"required":true},{"name":"open","description":"Whether the body is shown initially","type":{"name":"boolean"},"defaultValue":{"func":false,"value":"false"}},{"name":"disabled","description":"Whether the accordion can be toggled","type":{"name":"boolean"},"defaultValue":{"func":false,"value":"false"}}],"events":[{"name":"toggle"}],"slots":[{"name":"header"},{"name":"default"}]}

/***/ })

}]);