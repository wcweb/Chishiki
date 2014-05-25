(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

var quizExample = exports.quiz = {
    "info": {
        "name":    "小测试!!",
        "main":    "<p>看完视频 小测一下!</p>",
        "results": "<h5>测试完成</h5><p></p>",
        "level1":  "完全掌握理解运用。",
        "level2":  "掌握得不错",
        "level3":  "恭喜您，合格了。",
        "level4":  "麻麻啦，基本拉车尾。",
        "level5":  "仍然需要努力哦..." // no comma here
    },
    "questions": [
        { // Question 1 - Multiple Choice, Single True Answer
            "question": "男性330303030,50岁,农民,以衰弱、气促、轻度干咳8个月入院。体检:呼吸28次/分,两肺底闻爆裂音(Velcro罗音),有杵状指,胸部X线:两肺中下野弥漫性网状影,肺功能示限制性通气障碍,最可能的诊断是",
            "answers": [
                {"option": "A.慢性支气管炎",      "correct": false},
                {"option": "B.特发性肺间质纤维化",     "correct": true},
                {"option": "C.支气管扩张症",      "correct": false},
                {"option": "D.心力衰竭",     "correct": false},
                {"option": "E.矽肺",     "correct": false} // no comma here
            ],
            "correct": "<p> 答案：B <span>您答对了！</span> 要记住肺纤维化：肺功能提示的是限制性通气障碍。查体通常有杵状指。</p>",
            "incorrect": "<p>答案：B <span>抱歉，答错了。</span> 见到两肺底闻爆裂音(Velcro罗音)或见到胸部X线:两肺中下野弥漫性网状影就是肺纤维化；</p>" // no comma here
        },
        { // Question 2 - Multiple Choice, Multiple True Answers, Select Any
            "question": "支气管哮喘患者急性发作5天,测动脉血气pH7.40、PaO6.67kPa(50mmHg),PaCO8.0kPa(60mmHg)、HCO30mmol/L，最可能表明",
            "answers": [
                {"option": "A.病情好转",               "correct": false},
                {"option": "B.没有临床意义",   "correct": true},
                {"option": "C.轻度发作",               "correct": false},
                {"option": "D.病情严重,须积极治疗",               "correct": true},
                {"option": "E.有心血管并发症", "correct": false} // no comma here
            ],
            "select_any": true,
            "correct": "<p>答案：D <span>您答对了！!</span> <span>分析：</span><br /> \
                        支气管哮喘发作时是呼气性呼吸困难，血气分析常常是：呼吸性碱中毒。 \
                        题干出现哮喘发作5天，提示是重症哮喘。（哮喘持续状态可持续1-2天，又称为重症哮喘；每分钟呼吸28次/分，P大于110次/分。可出现呼吸机疲劳，出现奇脉，血压下降、大汗淋漓、严重脱水、神志模糊。出现呼吸性酸中毒，若缺氧明显可合并代谢性酸中毒）\
                        题干提示：出现PaCO潴留，说明是重症哮喘。\
                        综上所述是D</p>",
            "incorrect": "<p>答案：B D <span>抱歉，答错了。.</span> <br /> \
                        <span>分析：</span><br /> \
                        支气管哮喘发作时是呼气性呼吸困难，血气分析常常是：呼吸性碱中毒。 \
                        题干出现哮喘发作5天，提示是重症哮喘。（哮喘持续状态可持续1-2天，又称为重症哮喘；每分钟呼吸28次/分，P大于110次/分。可出现呼吸机疲劳，出现奇脉，血压下降、大汗淋漓、严重脱水、神志模糊。出现呼吸性酸中毒，若缺氧明显可合并代谢性酸中毒）\
                        题干提示：出现PaCO潴留，说明是重症哮喘。\
                        综上所述是B D </p>" // no comma here
        },
        { // Question 3 - Multiple Choice, Multiple True Answers, Select All
            "question": "支气管哮喘发病的最主要病理基础是.",
            "answers": [
                {"option": "气道的非特异性炎症",           "correct": true},
                {"option": "副交感神经兴奋",                  "correct": false},
                {"option": "细菌感染",  "correct": false},
                {"option": "支气管痉挛",          "correct": false} // no comma here
            ],
            "correct": "<p> 答案：A <span>您答对了！!</span> 支气管哮喘的定义已涵盖了，死记。</p>",
            "incorrect": "<p>答案：A <span>抱歉，答错了。.</span> 支气管哮喘的定义已涵盖了，死记。</p>" // no comma here
        },
        { // Question 4
            "question": "男性60岁，突然夜间发作呼吸困难，查体：双肺满布呼气性哮鸣音。下面哪几项对鉴别诊断有意义。",
            "answers": [
                {"option": "A.血气分析",    "correct": false},
                {"option": "B.超声心动图",     "correct": true},
                {"option": "C.胸部X线",      "correct": true},
                {"option": "E.既往病史",   "correct": true} // no comma here
            ],
            "correct": "<p>答案：A<span>您答对了！!</span> </p>",
            "incorrect": "<p>答案：A<span>抱歉，答错了。.</span> </p>" // no comma here
        }
    ]
};

},{}],2:[function(require,module,exports){
"use strict";
/*globals Handlebars: true */
var base = require("./handlebars/base");

// Each of these augment the Handlebars object. No need to setup here.
// (This is done to easily share code between commonjs and browse envs)
var SafeString = require("./handlebars/safe-string")["default"];
var Exception = require("./handlebars/exception")["default"];
var Utils = require("./handlebars/utils");
var runtime = require("./handlebars/runtime");

// For compatibility and usage outside of module systems, make the Handlebars object a namespace
var create = function() {
  var hb = new base.HandlebarsEnvironment();

  Utils.extend(hb, base);
  hb.SafeString = SafeString;
  hb.Exception = Exception;
  hb.Utils = Utils;

  hb.VM = runtime;
  hb.template = function(spec) {
    return runtime.template(spec, hb);
  };

  return hb;
};

var Handlebars = create();
Handlebars.create = create;

exports["default"] = Handlebars;
},{"./handlebars/base":3,"./handlebars/exception":4,"./handlebars/runtime":5,"./handlebars/safe-string":6,"./handlebars/utils":7}],3:[function(require,module,exports){
"use strict";
var Utils = require("./utils");
var Exception = require("./exception")["default"];

var VERSION = "1.3.0";
exports.VERSION = VERSION;var COMPILER_REVISION = 4;
exports.COMPILER_REVISION = COMPILER_REVISION;
var REVISION_CHANGES = {
  1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
  2: '== 1.0.0-rc.3',
  3: '== 1.0.0-rc.4',
  4: '>= 1.0.0'
};
exports.REVISION_CHANGES = REVISION_CHANGES;
var isArray = Utils.isArray,
    isFunction = Utils.isFunction,
    toString = Utils.toString,
    objectType = '[object Object]';

function HandlebarsEnvironment(helpers, partials) {
  this.helpers = helpers || {};
  this.partials = partials || {};

  registerDefaultHelpers(this);
}

exports.HandlebarsEnvironment = HandlebarsEnvironment;HandlebarsEnvironment.prototype = {
  constructor: HandlebarsEnvironment,

  logger: logger,
  log: log,

  registerHelper: function(name, fn, inverse) {
    if (toString.call(name) === objectType) {
      if (inverse || fn) { throw new Exception('Arg not supported with multiple helpers'); }
      Utils.extend(this.helpers, name);
    } else {
      if (inverse) { fn.not = inverse; }
      this.helpers[name] = fn;
    }
  },

  registerPartial: function(name, str) {
    if (toString.call(name) === objectType) {
      Utils.extend(this.partials,  name);
    } else {
      this.partials[name] = str;
    }
  }
};

function registerDefaultHelpers(instance) {
  instance.registerHelper('helperMissing', function(arg) {
    if(arguments.length === 2) {
      return undefined;
    } else {
      throw new Exception("Missing helper: '" + arg + "'");
    }
  });

  instance.registerHelper('blockHelperMissing', function(context, options) {
    var inverse = options.inverse || function() {}, fn = options.fn;

    if (isFunction(context)) { context = context.call(this); }

    if(context === true) {
      return fn(this);
    } else if(context === false || context == null) {
      return inverse(this);
    } else if (isArray(context)) {
      if(context.length > 0) {
        return instance.helpers.each(context, options);
      } else {
        return inverse(this);
      }
    } else {
      return fn(context);
    }
  });

  instance.registerHelper('each', function(context, options) {
    var fn = options.fn, inverse = options.inverse;
    var i = 0, ret = "", data;

    if (isFunction(context)) { context = context.call(this); }

    if (options.data) {
      data = createFrame(options.data);
    }

    if(context && typeof context === 'object') {
      if (isArray(context)) {
        for(var j = context.length; i<j; i++) {
          if (data) {
            data.index = i;
            data.first = (i === 0);
            data.last  = (i === (context.length-1));
          }
          ret = ret + fn(context[i], { data: data });
        }
      } else {
        for(var key in context) {
          if(context.hasOwnProperty(key)) {
            if(data) { 
              data.key = key; 
              data.index = i;
              data.first = (i === 0);
            }
            ret = ret + fn(context[key], {data: data});
            i++;
          }
        }
      }
    }

    if(i === 0){
      ret = inverse(this);
    }

    return ret;
  });

  instance.registerHelper('if', function(conditional, options) {
    if (isFunction(conditional)) { conditional = conditional.call(this); }

    // Default behavior is to render the positive path if the value is truthy and not empty.
    // The `includeZero` option may be set to treat the condtional as purely not empty based on the
    // behavior of isEmpty. Effectively this determines if 0 is handled by the positive path or negative.
    if ((!options.hash.includeZero && !conditional) || Utils.isEmpty(conditional)) {
      return options.inverse(this);
    } else {
      return options.fn(this);
    }
  });

  instance.registerHelper('unless', function(conditional, options) {
    return instance.helpers['if'].call(this, conditional, {fn: options.inverse, inverse: options.fn, hash: options.hash});
  });

  instance.registerHelper('with', function(context, options) {
    if (isFunction(context)) { context = context.call(this); }

    if (!Utils.isEmpty(context)) return options.fn(context);
  });

  instance.registerHelper('log', function(context, options) {
    var level = options.data && options.data.level != null ? parseInt(options.data.level, 10) : 1;
    instance.log(level, context);
  });
}

var logger = {
  methodMap: { 0: 'debug', 1: 'info', 2: 'warn', 3: 'error' },

  // State enum
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  level: 3,

  // can be overridden in the host environment
  log: function(level, obj) {
    if (logger.level <= level) {
      var method = logger.methodMap[level];
      if (typeof console !== 'undefined' && console[method]) {
        console[method].call(console, obj);
      }
    }
  }
};
exports.logger = logger;
function log(level, obj) { logger.log(level, obj); }

exports.log = log;var createFrame = function(object) {
  var obj = {};
  Utils.extend(obj, object);
  return obj;
};
exports.createFrame = createFrame;
},{"./exception":4,"./utils":7}],4:[function(require,module,exports){
"use strict";

var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

function Exception(message, node) {
  var line;
  if (node && node.firstLine) {
    line = node.firstLine;

    message += ' - ' + line + ':' + node.firstColumn;
  }

  var tmp = Error.prototype.constructor.call(this, message);

  // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
  for (var idx = 0; idx < errorProps.length; idx++) {
    this[errorProps[idx]] = tmp[errorProps[idx]];
  }

  if (line) {
    this.lineNumber = line;
    this.column = node.firstColumn;
  }
}

Exception.prototype = new Error();

exports["default"] = Exception;
},{}],5:[function(require,module,exports){
"use strict";
var Utils = require("./utils");
var Exception = require("./exception")["default"];
var COMPILER_REVISION = require("./base").COMPILER_REVISION;
var REVISION_CHANGES = require("./base").REVISION_CHANGES;

function checkRevision(compilerInfo) {
  var compilerRevision = compilerInfo && compilerInfo[0] || 1,
      currentRevision = COMPILER_REVISION;

  if (compilerRevision !== currentRevision) {
    if (compilerRevision < currentRevision) {
      var runtimeVersions = REVISION_CHANGES[currentRevision],
          compilerVersions = REVISION_CHANGES[compilerRevision];
      throw new Exception("Template was precompiled with an older version of Handlebars than the current runtime. "+
            "Please update your precompiler to a newer version ("+runtimeVersions+") or downgrade your runtime to an older version ("+compilerVersions+").");
    } else {
      // Use the embedded version info since the runtime doesn't know about this revision yet
      throw new Exception("Template was precompiled with a newer version of Handlebars than the current runtime. "+
            "Please update your runtime to a newer version ("+compilerInfo[1]+").");
    }
  }
}

exports.checkRevision = checkRevision;// TODO: Remove this line and break up compilePartial

function template(templateSpec, env) {
  if (!env) {
    throw new Exception("No environment passed to template");
  }

  // Note: Using env.VM references rather than local var references throughout this section to allow
  // for external users to override these as psuedo-supported APIs.
  var invokePartialWrapper = function(partial, name, context, helpers, partials, data) {
    var result = env.VM.invokePartial.apply(this, arguments);
    if (result != null) { return result; }

    if (env.compile) {
      var options = { helpers: helpers, partials: partials, data: data };
      partials[name] = env.compile(partial, { data: data !== undefined }, env);
      return partials[name](context, options);
    } else {
      throw new Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
    }
  };

  // Just add water
  var container = {
    escapeExpression: Utils.escapeExpression,
    invokePartial: invokePartialWrapper,
    programs: [],
    program: function(i, fn, data) {
      var programWrapper = this.programs[i];
      if(data) {
        programWrapper = program(i, fn, data);
      } else if (!programWrapper) {
        programWrapper = this.programs[i] = program(i, fn);
      }
      return programWrapper;
    },
    merge: function(param, common) {
      var ret = param || common;

      if (param && common && (param !== common)) {
        ret = {};
        Utils.extend(ret, common);
        Utils.extend(ret, param);
      }
      return ret;
    },
    programWithDepth: env.VM.programWithDepth,
    noop: env.VM.noop,
    compilerInfo: null
  };

  return function(context, options) {
    options = options || {};
    var namespace = options.partial ? options : env,
        helpers,
        partials;

    if (!options.partial) {
      helpers = options.helpers;
      partials = options.partials;
    }
    var result = templateSpec.call(
          container,
          namespace, context,
          helpers,
          partials,
          options.data);

    if (!options.partial) {
      env.VM.checkRevision(container.compilerInfo);
    }

    return result;
  };
}

exports.template = template;function programWithDepth(i, fn, data /*, $depth */) {
  var args = Array.prototype.slice.call(arguments, 3);

  var prog = function(context, options) {
    options = options || {};

    return fn.apply(this, [context, options.data || data].concat(args));
  };
  prog.program = i;
  prog.depth = args.length;
  return prog;
}

exports.programWithDepth = programWithDepth;function program(i, fn, data) {
  var prog = function(context, options) {
    options = options || {};

    return fn(context, options.data || data);
  };
  prog.program = i;
  prog.depth = 0;
  return prog;
}

exports.program = program;function invokePartial(partial, name, context, helpers, partials, data) {
  var options = { partial: true, helpers: helpers, partials: partials, data: data };

  if(partial === undefined) {
    throw new Exception("The partial " + name + " could not be found");
  } else if(partial instanceof Function) {
    return partial(context, options);
  }
}

exports.invokePartial = invokePartial;function noop() { return ""; }

exports.noop = noop;
},{"./base":3,"./exception":4,"./utils":7}],6:[function(require,module,exports){
"use strict";
// Build out our basic SafeString type
function SafeString(string) {
  this.string = string;
}

SafeString.prototype.toString = function() {
  return "" + this.string;
};

exports["default"] = SafeString;
},{}],7:[function(require,module,exports){
"use strict";
/*jshint -W004 */
var SafeString = require("./safe-string")["default"];

var escape = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "`": "&#x60;"
};

var badChars = /[&<>"'`]/g;
var possible = /[&<>"'`]/;

function escapeChar(chr) {
  return escape[chr] || "&amp;";
}

function extend(obj, value) {
  for(var key in value) {
    if(Object.prototype.hasOwnProperty.call(value, key)) {
      obj[key] = value[key];
    }
  }
}

exports.extend = extend;var toString = Object.prototype.toString;
exports.toString = toString;
// Sourced from lodash
// https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
var isFunction = function(value) {
  return typeof value === 'function';
};
// fallback for older versions of Chrome and Safari
if (isFunction(/x/)) {
  isFunction = function(value) {
    return typeof value === 'function' && toString.call(value) === '[object Function]';
  };
}
var isFunction;
exports.isFunction = isFunction;
var isArray = Array.isArray || function(value) {
  return (value && typeof value === 'object') ? toString.call(value) === '[object Array]' : false;
};
exports.isArray = isArray;

function escapeExpression(string) {
  // don't escape SafeStrings, since they're already safe
  if (string instanceof SafeString) {
    return string.toString();
  } else if (!string && string !== 0) {
    return "";
  }

  // Force a string conversion as this will be done by the append regardless and
  // the regex test will do this transparently behind the scenes, causing issues if
  // an object's to string has escaped characters in it.
  string = "" + string;

  if(!possible.test(string)) { return string; }
  return string.replace(badChars, escapeChar);
}

exports.escapeExpression = escapeExpression;function isEmpty(value) {
  if (!value && value !== 0) {
    return true;
  } else if (isArray(value) && value.length === 0) {
    return true;
  } else {
    return false;
  }
}

exports.isEmpty = isEmpty;
},{"./safe-string":6}],8:[function(require,module,exports){
// Create a simple path alias to allow browserify to resolve
// the runtime on a supported path.
module.exports = require('./dist/cjs/handlebars.runtime');

},{"./dist/cjs/handlebars.runtime":2}],9:[function(require,module,exports){
module.exports = require("handlebars/runtime")["default"];

},{"handlebars/runtime":8}],10:[function(require,module,exports){
//     Underscore.js 1.5.2
//     http://underscorejs.org
//     (c) 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    concat           = ArrayProto.concat,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.5.2';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, length = obj.length; i < length; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      var keys = _.keys(obj);
      for (var i = 0, length = keys.length; i < length; i++) {
        if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
      }
    }
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results.push(iterator.call(context, value, index, list));
    });
    return results;
  };

  var reduceError = 'Reduce of empty array with no initial value';

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var length = obj.length;
    if (length !== +length) {
      var keys = _.keys(obj);
      length = keys.length;
    }
    each(obj, function(value, index, list) {
      index = keys ? keys[--length] : --length;
      if (!initial) {
        memo = obj[index];
        initial = true;
      } else {
        memo = iterator.call(context, memo, obj[index], index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, iterator, context) {
    var result;
    any(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, iterator, context) {
    return _.filter(obj, function(value, index, list) {
      return !iterator.call(context, value, index, list);
    }, context);
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
    each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
    each(obj, function(value, index, list) {
      if (result || (result = iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  _.contains = _.include = function(obj, target) {
    if (obj == null) return false;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    return any(obj, function(value) {
      return value === target;
    });
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, function(value){ return value[key]; });
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs, first) {
    if (_.isEmpty(attrs)) return first ? void 0 : [];
    return _[first ? 'find' : 'filter'](obj, function(value) {
      for (var key in attrs) {
        if (attrs[key] !== value[key]) return false;
      }
      return true;
    });
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.where(obj, attrs, true);
  };

  // Return the maximum element or (element-based computation).
  // Can't optimize arrays of integers longer than 65,535 elements.
  // See [WebKit Bug 80797](https://bugs.webkit.org/show_bug.cgi?id=80797)
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.max.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return -Infinity;
    var result = {computed : -Infinity, value: -Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed > result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.min.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return Infinity;
    var result = {computed : Infinity, value: Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Shuffle an array, using the modern version of the 
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var rand;
    var index = 0;
    var shuffled = [];
    each(obj, function(value) {
      rand = _.random(index++);
      shuffled[index - 1] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // Sample **n** random values from an array.
  // If **n** is not specified, returns a single random element from the array.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (arguments.length < 2 || guard) {
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // An internal function to generate lookup iterators.
  var lookupIterator = function(value) {
    return _.isFunction(value) ? value : function(obj){ return obj[value]; };
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, value, context) {
    var iterator = lookupIterator(value);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, value, context) {
      var result = {};
      var iterator = value == null ? _.identity : lookupIterator(value);
      each(obj, function(value, index) {
        var key = iterator.call(context, value, index, obj);
        behavior(result, key, value);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, key, value) {
    (_.has(result, key) ? result[key] : (result[key] = [])).push(value);
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, key, value) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, key) {
    _.has(result, key) ? result[key]++ : result[key] = 1;
  });

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator, context) {
    iterator = iterator == null ? _.identity : lookupIterator(iterator);
    var value = iterator.call(context, obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >>> 1;
      iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    return (n == null) || guard ? array[0] : slice.call(array, 0, n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n == null) || guard) {
      return array[array.length - 1];
    } else {
      return slice.call(array, Math.max(array.length - n, 0));
    }
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, (n == null) || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, output) {
    if (shallow && _.every(input, _.isArray)) {
      return concat.apply(output, input);
    }
    each(input, function(value) {
      if (_.isArray(value) || _.isArguments(value)) {
        shallow ? push.apply(output, value) : flatten(value, shallow, output);
      } else {
        output.push(value);
      }
    });
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator, context) {
    if (_.isFunction(isSorted)) {
      context = iterator;
      iterator = isSorted;
      isSorted = false;
    }
    var initial = iterator ? _.map(array, iterator, context) : array;
    var results = [];
    var seen = [];
    each(initial, function(value, index) {
      if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
        seen.push(value);
        results.push(array[index]);
      }
    });
    return results;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(_.flatten(arguments, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
    return _.filter(array, function(value){ return !_.contains(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var length = _.max(_.pluck(arguments, "length").concat(0));
    var results = new Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(arguments, '' + i);
    }
    return results;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, length = list.length; i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0, length = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = (isSorted < 0 ? Math.max(0, length + isSorted) : isSorted);
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
    for (; i < length; i++) if (array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var hasIndex = from != null;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
      return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
    }
    var i = (hasIndex ? from : array.length);
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(length);

    while(idx < length) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Reusable constructor function for prototype setting.
  var ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    var args, bound;
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError;
    args = slice.call(arguments, 2);
    return bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      ctor.prototype = func.prototype;
      var self = new ctor;
      ctor.prototype = null;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (Object(result) === result) return result;
      return self;
    };
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context.
  _.partial = function(func) {
    var args = slice.call(arguments, 1);
    return function() {
      return func.apply(this, args.concat(slice.call(arguments)));
    };
  };

  // Bind all of an object's methods to that object. Useful for ensuring that
  // all callbacks defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length === 0) throw new Error("bindAll must be passed function names");
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(null, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    options || (options = {});
    var later = function() {
      previous = options.leading === false ? 0 : new Date;
      timeout = null;
      result = func.apply(context, args);
    };
    return function() {
      var now = new Date;
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;
    return function() {
      context = this;
      args = arguments;
      timestamp = new Date();
      var later = function() {
        var last = (new Date()) - timestamp;
        if (last < wait) {
          timeout = setTimeout(later, wait - last);
        } else {
          timeout = null;
          if (!immediate) result = func.apply(context, args);
        }
      };
      var callNow = immediate && !timeout;
      if (!timeout) {
        timeout = setTimeout(later, wait);
      }
      if (callNow) result = func.apply(context, args);
      return result;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      memo = func.apply(this, arguments);
      func = null;
      return memo;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return function() {
      var args = [func];
      push.apply(args, arguments);
      return wrapper.apply(this, args);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = nativeKeys || function(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = new Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = new Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    each(keys, function(key) {
      if (key in obj) copy[key] = obj[key];
    });
    return copy;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    for (var key in obj) {
      if (!_.contains(keys, key)) copy[key] = obj[key];
    }
    return copy;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] === void 0) obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] == a) return bStack[length] == b;
    }
    // Objects with different constructors are not equivalent, but `Object`s
    // from different frames are.
    var aCtor = a.constructor, bCtor = b.constructor;
    if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
                             _.isFunction(bCtor) && (bCtor instanceof bCtor))) {
      return false;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) == '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Optimize `isFunction` if appropriate.
  if (typeof (/./) !== 'function') {
    _.isFunction = function(obj) {
      return typeof obj === 'function';
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj != +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  // Run a function **n** times.
  _.times = function(n, iterator, context) {
    var accum = Array(Math.max(0, n));
    for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // List of HTML entities for escaping.
  var entityMap = {
    escape: {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;'
    }
  };
  entityMap.unescape = _.invert(entityMap.escape);

  // Regexes containing the keys and values listed immediately above.
  var entityRegexes = {
    escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
    unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
  };

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  _.each(['escape', 'unescape'], function(method) {
    _[method] = function(string) {
      if (string == null) return '';
      return ('' + string).replace(entityRegexes[method], function(match) {
        return entityMap[method][match];
      });
    };
  });

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return void 0;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\t':     't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(text, data, settings) {
    var render;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = new RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset)
        .replace(escaper, function(match) { return '\\' + escapes[match]; });

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      }
      if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      }
      if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }
      index = offset + match.length;
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + "return __p;\n";

    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled function source as a convenience for precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(obj) {
    return this._chain ? _(obj).chain() : obj;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
      return result.call(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });

  _.extend(_.prototype, {

    // Start chaining a wrapped Underscore object.
    chain: function() {
      this._chain = true;
      return this;
    },

    // Extracts the result from a wrapped and chained object.
    value: function() {
      return this._wrapped;
    }

  });

}).call(this);

},{}],11:[function(require,module,exports){
var example = require('./../../../lib/fixture/quiz').quiz;
var _ = require('underscore');

/*
 {
 quiz:{
 _id:
 index:
 isActive: true,
 question: { type : String, default : '', trim : true},
 answers: [{
 _id:
 index:
 option : { type: String, default : '', trim : true},
 correct: { type: Boolean, default : false }
 }],
 correct: { type: String, default : '', trim : true},
 incorrect: { type: Boolean, default : false }
 }
 }


 {
 action: [
 add: {
 which parent
 },
 remove: {
 which node
 }
 ],
 reindex: function
 }
 */




var NodeTree = function NodeTree(parent) {
        this.elements = [];
        this.children = [];
        this.parent = {};
        this.template = "";
        this.index = -1;
        this.templateId = "";

        if (parent){
            this.parent = parent;
            parent.add(this);
        }
    }
    , NodeElement = function NodeElement(template) {
        this.template = template;
        this.templateId = "";
        this.index = -1;
        this.parent = {};
    };


NodeTree.prototype.add = function (child) {
    if (child.constructor.name === 'NodeElement') {
        child.index =this.elements.length;
        this.elements.push(child);
        child.parent = this;

    }
    if (child.constructor.name === 'NodeTree') {

        child.index = this.children.length;
        this.children.push(child);
        child.parent = this;

    }

    //@TODO
    //$(this.template).append(child.template);
};


NodeTree.prototype.remove = function (idx, childType) {
    if (childType === "NodeTree") {
        this.children.splice(idx, 1);
        var len = this.children.length;
        for (var i = idx; i < len; i++) {
            this.children[i].index -= 1;
        }
    }
    //@TODO
    //$(this.template).remove(child.template);
};

NodeElement.prototype.setIndex = function (idx) {
    this.index = idx;
};


//
//var nt = new NodeTree(null);
//var nt2 = new NodeTree(null);
//
//var nnt = new NodeTree(nt);
//nt.add(nnt);
//nt.add(nnt);
//console.log(nt.children.length);
//var ele = new NodeElement('sssss');
//
//nt.add(ele);
//nt.remove(1,nnt.constructor.name);
//console.log(nt.children.length);
//nt.add(new NodeElement('sssss2'));
//console.log('after',ele);
//console.dir(nt.toString());
//console.log("constructor",nt.constructor.name.toString());
//console.log(nt);


var config = {
        data: {},
        methodType: 'GET',
        wrapper: 'body'
    }, lastClick = {}, nodeTree,
    reformerData = function (data) {


        data['actionName'] = data.quizzes.length > 0 ? "Update" : "Save";

        if (!data.quizzes.length) {
            var demoQuiz = {quiz: example};
            data.quizzes.push(demoQuiz);
            //config.methodType = 'POST';
        } else {
            config.methodType = 'PUT';
        }

        data.quizzes[0].quiz.questions[0].isActive = true;


        return {form: data};
    },

    reTemplate = function (next) {
        var data = config.data;
        var nt = new NodeTree(null);
        nt.template = $('#quizzes-group-0');
        nt.templateId = '#quizzes-group-0';


        _.each(data.quizzes[0].quiz.questions, function (el, idx) {
                var childTree = new NodeTree(nt);

                var cT = $('#group-pane-0-' + idx);
                childTree.template = cT;
                childTree.templateId = '#group-pane-0-' + idx;
                var currentQuiz = data.quizzes[0].quiz.questions[idx];
                _.each(currentQuiz.answers,function (elem, j) {
                        var childElementTemplate = $('#group-pane-sub-' + idx + '-' + j);
                        var childElement = new NodeElement($(childElementTemplate));
                        childElement.templateId = '#group-pane-sub-' + idx + '-' + j;
                        childTree.add(childElement);
                });

        });

        nodeTree = nt;
        next();
    },

    buildReduce = function (data) {
        for (var prop in data) {
            var element = data[prop];
            if (isArray(element)) {
                //buildReduce(element);
            }
        }
    },
    addChildNode = function (target) {
        // case index === 0 : tab panel
        // case index === 1 : groups
        // case index >=1 : group

        // create template with data.property
        // template append

        // combing target with action
        // events bind with button.


        var targetString = target;
        var templateClone,newIndex,parent,indexArray,newId,tempName;
        if (targetString.indexOf('nav') >= 0) {
            // handle tree node now.

            var cloneNode = nodeTree.children[0];
            //console.log(nodeTree.children);
            parent = cloneNode.parent;
            templateClone = getEmptyNodeTemplate($(parent.children[0].templateId).clone());
            //console.log("templateClone",templateClone);
            var templateNavClone = ($('#quizzes-groups-nav li').first().clone());
            newIndex = parent.children[0].templateId;// #sub-0-0-0-...  when nodeTree.templateId ='';
            var childrenIndex = parent.children.length;

            if (newIndex.indexOf('#') >= 0) {
                newIndex = newIndex.slice(newIndex.indexOf('#') + 1);
            }

            indexArray = newIndex.split('-');
            newId = '';
            _.each(indexArray, function(elem,idx){
                newId += indexArray[idx] + "-";
            });

            newId += childrenIndex;


            $(templateClone).attr('id', newId);

            $(templateClone).find('#options-group-pane-sub-0-0-wrapper .group-pane-sub').each(function (idx, ele) {
                var tempId = $(ele).attr('id');
                var idArray = tempId.split('-');
                $(ele).find('button').attr('data-target', '#group-pane-sub-' + childrenIndex + '-' + idx);
                $(ele).attr('id', 'group-pane-sub-' + childrenIndex + '-' + idArray[idArray.length - 1]);

                // var tempName = $(ele).find('input[type="checkbox"]').attr('name');
                tempName = "quizzes[" + childrenIndex + "][answers][" + idx + "][correct]";
                $(ele).find('input[type="checkbox"]').attr('name', tempName);

                // var tempName = $(ele).find('input[type="text"]').attr('name');
                tempName = "quizzes[" + childrenIndex + "][answers][" + idx + "][option]";
                $(ele).find('input[type="text"]').attr('name', tempName);

            });
            //console.log('childrenIndex',childrenIndex);
            $(templateClone).find('.group-pane-sub-add-btn')
                .attr('data-target', '#group-pane-0-' + childrenIndex + '-0');
            $(templateClone).find('.group-pane-remove-btn')
                .attr('data-target','#group-pane-0-'+childrenIndex);




            var newTree = new NodeTree();
            newTree.children = parent.children[0].children.slice(0);
            newTree.elements = parent.children[0].elements.slice(0);

            // walk through the cloned tree
            for (var il = 0; il < newTree.children.length; il++) {
                var child = newTree.children[il];
                var idArray = child.templateId.split('-');
                idArray[idArray.length - 2] = childrenIndex;
                child.templateId = idArray.join('-');
                child.template = $(child.templateId);
                child.parent = newTree;
            }
            _.each(newTree.elements, function (elem, ix) {
                    var element = newTree.elements[ix];
                    var idArray = element.templateId.split('-');
                    idArray[idArray.length - 2] = childrenIndex;
                    element.templateId = idArray.join('-');
                    element.template = $(element.templateId);
                    element.parent = newTree;
            });

            newTree.template = $(templateClone);
            newTree.templateId = '#' + newId;

            // append nav li

            $('#quizzes-groups-nav li').each(function (idx, ele) {
                if ($(ele).hasClass('active')) $(ele).removeClass('active');
            });
            $(templateNavClone).find('a').html(childrenIndex + 1).attr('href', newTree.templateId);
            $(templateNavClone).attr('id','group-nav-'+childrenIndex);


            $('#quizzes-groups-nav').append(templateNavClone);
//            $(templateNavClone).addClass('active');
//

            // append content
//            $('#quizzes-group-0 .tab-pane').each(function (idx, ele) {
//                if ($(ele).hasClass('active')) $(ele).removeClass('active');
//            });
//            console.log(parent.templateId);


            $(parent.templateId).append(newTree.template);
            //$(newTree.template).addClass('active');
            $('#quizzes-groups-nav li:eq('+(childrenIndex)+') a').tab('show');
            parent.add(newTree);

        } else {
            // handle element node now.
            var whichNode = getChildNode(targetString);
            console.log('which', whichNode);
            parent = whichNode.parent;
            templateClone = getEmptyNodeTemplate($(parent.elements[0].templateId).clone());
            newIndex = parent.elements[0].templateId;
            var elementsIndex = parent.elements.length;

            if (newIndex.indexOf('#') >= 0) {
                console.log("newindex", newIndex.indexOf('#'));
                newIndex = newIndex.slice(newIndex.indexOf('#') + 1);

            }

            console.log("newindex", newIndex);
            indexArray = newIndex.split('-');
            newId = '';
            for (var im = 0; im < indexArray.length - 1; im++) {
                newId += indexArray[im] + "-";
            }


            newId += elementsIndex;


            var newElement = new NodeElement();

            // set name and id to input.

            $(templateClone).attr('id', newId).find('button').attr('data-target', '#' + newId);

            // tempName = $(templateClone).find('input[type="checkbox"]').attr('name');
            tempName = "quizzes[" + parent.index + "][answers][" + elementsIndex + "][correct]";
            $(templateClone).find('input[type="checkbox"]').attr('name', tempName);

            // tempName = $(templateClone).find('input[type="text"]').attr('name');
            tempName = "quizzes[" + parent.index + "][answers][" + elementsIndex + "][option]";
            $(templateClone).find('input[type="text"]').attr('name', tempName);

            newElement.template = $(templateClone);

            newElement.templateId = '#' + newId;


            $(parent.templateId + ' .options-group').append(newElement.template);
            parent.add(newElement);

        }


    },
    getEmptyNodeTemplate = function (templateClone) {
        $(templateClone).find('input').val('').attr('value', '');
        $(templateClone).find('textarea').html('');
        $(templateClone).find("[type='checkbox']").prop('checked', false);
        return $(templateClone);
    },
    getChildNode = function (targetString) {

        if (targetString.lastIndexOf('sub') >= 0)
            targetString = targetString.substr(targetString.lastIndexOf('sub-') + 4);

        if (targetString.indexOf('group-pane-0') >= 0)
            targetString = targetString.substr(targetString.indexOf('group-pane-0-') + 13);

        var indexArray = targetString.split('-');

        var stringTarget = "nodeTree";

        for (var j = 0; j < indexArray.length; j++) {
            if (indexArray[j] !== "") {
                if (j % 2) {
                    stringTarget += ".elements[" + indexArray[j] + "]";
                } else {
                    stringTarget += ".children[" + indexArray[j] + "]";

                }
            }
        }

        //console.log(stringTarget);
        return   eval(stringTarget);
    },
    removeChildNode = function (target) {

        // sub-1-2  level 1 second one.

        var targets = $(target);
        //console.log(targets);
        var i = 0;
        _.each(targets, function(elem,i){
            var finalFn = function (treeArray, whichIndex,type) {
                //console.log(whichIndex !== 0);

                if(whichIndex !== 0){
                    if(type === 'NodeTree'){
                        if(whichIndex < treeArray.length-1){
                            $('#quizzes-groups-nav li:eq('+whichIndex+') a').tab('show');

                        }else if(whichIndex-1 > 0){
                            $('#quizzes-groups-nav li:eq('+(whichIndex-1)+') a').tab('show');
                        }else{
                            $('#quizzes-groups-nav li:eq(0) a').tab('show');
                        }
                    }

                    treeArray.splice(whichIndex, 1);
                }



            };
            (function (done) {
                var targetString = $(targets[i]).attr('id');
                //console.log(targetString);
                var whichNode = getChildNode(targetString);
                var whichIndex = whichNode.index;
                var parentTree = whichNode.parent;
                var tempName,idx;

                if (whichIndex !== 0) $('div').remove(whichNode.templateId);

                if(whichNode.constructor.name === 'NodeElement') {
                  _.each(parentTree.elements, function(element,idx){

                            //if(idx === whichIndex) continue;

                            parentTree.elements[idx].index = idx;
                            var newId = idx - 1;
                            var newTemplateId = 'group-pane-sub-' + parentTree.index + '-' + newId;
                            var tempOldIdObject = $(parentTree.elements[idx].templateId);
                            tempOldIdObject.attr('id', newTemplateId);

                            newTemplateId = "#" + newTemplateId;

                            tempOldIdObject.find('button').attr('data-target', newTemplateId);

                            // var tempName = tempOldIdObject.find('input[type="checkbox"]').attr('name');
                            tempName = "quizzes[" + parentTree.index + "][answers][" + newId + "][correct]";
                            tempOldIdObject.find('input[type="checkbox"]').attr('name', tempName);

                            // var tempName = tempOldIdObject.find('input[type="text"]').attr('name');
                            tempName = "quizzes[" + parentTree.index + "][answers][" + newId + "][option]";
                            tempOldIdObject.find('input[type="text"]').attr('name', tempName);


                            parentTree.elements[idx].templateId = newTemplateId;

                            if (idx === parentTree.elements.length - 1) {
                                done(parentTree.elements, whichIndex,'NodeElement');
                            }
                        });
                }else if(whichNode.constructor.name === 'NodeTree'){
                    //console.log('whichIndex:',whichIndex);
                    if(whichIndex !== 0) $('#group-nav-'+whichIndex).remove();

                    _.each(parentTree.children, function(elem, idx){
                        //if(idx === whichIndex) continue;
                        $('#group-nav-'+idx).children('a').html(idx).attr('href','#group-pane-0-'+(idx-1));
                        $('#group-nav-'+idx).attr('id','group-nav-'+(idx-1));
                        $('#group-pane-0-'+idx).attr('id','group-pane-0-'+(idx-1));
                        $('#group-pane-0-'+idx).find('.group-pane-remove-btn')
                            .attr('data-target','#group-pane-0-'+(idx-1));
                        parentTree.children[idx].index = idx-1;
                        parentTree.children[idx].templateId  = '#group-pane-0-'+(idx-1);
                        var childTree = parentTree.children[idx];
                        _.each(childTree.elements, function(elem, cidx){
                            //if(idx === whichIndex) continue;

                            var newId = childTree.elements[cidx].index;
                            var newTemplateId = 'group-pane-sub-' + childTree.index + '-' + newId;
                            var tempOldIdObject = $(childTree.elements[cidx].templateId);
                            tempOldIdObject.attr('id', newTemplateId);

                            newTemplateId = "#" + newTemplateId;

                            tempOldIdObject.find('button').attr('data-target', newTemplateId);

                            // var tempName = tempOldIdObject.find('input[type="checkbox"]').attr('name');
                            tempName = "quizzes[" + childTree.index + "][answers][" + newId + "][correct]";
                            tempOldIdObject.find('input[type="checkbox"]').attr('name', tempName);

                            // var tempName = tempOldIdObject.find('input[type="text"]').attr('name');
                            tempName = "quizzes[" + childTree.index + "][answers][" + newId + "][option]";
                            tempOldIdObject.find('input[type="text"]').attr('name', tempName);

                            childTree.elements[cidx].templateId = newTemplateId;

                        });
                });
                done(parentTree.children, whichIndex,'NodeTree');
              }
            })(finalFn);
            //console.log(nodeTree);
        });
    },
    handleMouseClickFactory = function (e) {
        e.preventDefault();// @TODO use button type instead
        console.log('preventDefault');
        var target = e.currentTarget;
        var ObjectTarget = $(target).attr('data-target');

        switch ($(target).attr('data-action')) {
            case  'add':
                addChildNode(ObjectTarget);
                break;
            case  'remove':
                removeChildNode(ObjectTarget);
                break;
            default :
                break;
        }

        lastClick = e.target;

    },
    isArray = function (obj) {
        return Object.prototype.toString.apply(obj) === '[object Array]';
    };


exports.formBuild = function (options) {

    // each property in data
    // add new tab , add form, add submit button ,add elem button
    // each property in element , isArray
    // add panel element (eq. remove cur elem button)
    // each property in elem  isArray
    // add textArea , checkBox , or radiosGroup
    //
    //@TODO use extend fn.
    config.data = options.data;
    config.wrapper = options.wrapper;
    config.formBody = options.formBody;
    var data = config.data,
        questions = data['questions'];
    //console.log("data.quizzes", data.quizzes);
    data = reformerData(data);

    var wrapper = $(config.formBody);

    var template = require('./../templates/quizzesForm.handlebars');

    buildReduce(data);

    var html = template(data);

    wrapper.append(html);


    reTemplate(function () {
        $('body').on('click', config.formBody + " button[type!='submit']", {lastClick: lastClick}, handleMouseClickFactory);

        wrapper.on('submit', function (e) {

            e.preventDefault();
            var form = $(config.formBody);

            var serializedArray;

            var ajaxURL = '';
            if (config.methodType === 'PUT') {
                ajaxURL = $(form).attr('action') + '/' + data.form.quizzes[0].quiz._id;
                console.log(JSON.stringify($(form).serialize()));
                //serializedArray = serializeJSON($(form).serializeArray());

            } else {
                ajaxURL = $(form).attr('action');
                //serializedArray = $(form).serialize();
            }
            serializedArray = $(form).serialize();
            $.ajax({
                type:config.methodType,
                url: ajaxURL,
                data: serializedArray,
                dataType: "json",
                success: function(json){
                    console.log(json);

                    $('#quizMsg ul').append($('<li> article '+json.art_id+' updated!</li>'))
                        .parent().show().fadeIn();

                },
                error:function(err){
                    console.log(err);
                }
            });


        });
    });


};


var serializeJSON = function (dataArray) {
    var serializedArray = {};
    var tempObjectId = "0";
    var temp2ObjectId = "0";
    var hasMatches, hasPropertyMatches;
    var tempObject = {};
    var temp2Object = {index: -1};
    var key, subKey, subId,subsKey;

    $.each(dataArray, function () {
        var matches = this.name.match(/^(.+?)\[(\d+)\]\[(.+)\]+$/i)
            , value = this.value;

        if (matches) {
            hasMatches = true;
            // serializedArray[key][subId]{pos, answers[]}
            subKey = matches[3];
            subId = matches[2];
            key = matches[1];

            if (!( key in  serializedArray)) {
                serializedArray[key] = [];
            }

            //tempObject.index = subId;

            var propertyMatches = subKey.match(/^(.+?)\]\[(\d+)\]\[(.+)+$/i);


            //console.log(propertyMatches);
            //@TODO if more deeper?


            if (propertyMatches) {
                hasPropertyMatches = true;
                subsKey = propertyMatches[1];
                var subsId = propertyMatches[2];
                var subsKeyName = propertyMatches[3];

                if (!( subsKey in  tempObject)) {
                    tempObject[subsKey] = [];
                }

//                if( !(subsId ==== temp2Object.index)){
//                    if(temp2Object.index!==-1) tempObject[subsKey].push(temp2Object);
//                    temp2Object = {};
//                    temp2Object.index = subsId;
//                }

                if (subsId !== temp2ObjectId) {
                    tempObject[subsKey].push(temp2Object);
                    temp2Object = {};
                    temp2ObjectId = subsId;
                }


                temp2Object[subsKeyName] = value;

            } else {
                hasPropertyMatches = false;
                tempObject[subKey] = value;
            }

            // start from subId.
            if (subId !== tempObjectId) {
                console.log(tempObjectId, subId);
                // insert and start to next loop



                serializedArray[key].push(tempObject);
                tempObject = {};
                tempObjectId = subId;
            }


        } else {
            hasMatches = true;

            serializedArray[this.name] = this.value || '';
        }

    });
    if (hasMatches) {
        if(hasPropertyMatches){
            console.log(temp2Object);
            tempObject[subsKey].push(temp2Object);
        }
        serializedArray[key].push(tempObject);
    }
    return serializedArray;
};

},{"./../../../lib/fixture/quiz":1,"./../templates/quizzesForm.handlebars":16,"underscore":10}],12:[function(require,module,exports){
exports.init= function(){
    $('#buildScorm').on('click',function(e){
        e.preventDefault();
        var aid = $(e.currentTarget).attr('data-target');
        var ajaxURL = '/scorm/'+aid+'/build';

        $.ajax({
            url: ajaxURL,
            success: function(json){
                console.log(json);
            },
            error:function(err){
                console.log(err);
            }
        });
    });
    $('#downloadSCORM').on('click',function(e){
        e.preventDefault();
        var aid = $(e.currentTarget).attr('data-target');
        var ajaxURL = '/scorm/'+aid+'/exportSCORM';

        $.ajax({
            url: ajaxURL,
            success: function(json){
                console.log(json);
            },
            error:function(err){
                console.log(err);
            }
        });
    });

};
},{}],13:[function(require,module,exports){
//Module.exports= function(){
//define('_forms/_videosForm', ['exports'], function(__exports___){
exports.videoInit= function(){
    $(document).ready(function () {

        // @TODO  refactor
        /*
         * {
         *   wrapper_name,
         *   group_name,
         *   property_name,
         *   button_id,
         *   button_data-target_index
         *   control_id
         *   form_element_tagName
         *   form_id
         * }
         * */
        $(document).on('click','button.remove-video-btn',{}, removeVideoFn);

        $(document).on('click','button.remove-video-btn',{}, removeVideoFn);

        //$('button.remove-video-btn').on('click',removeVideoFn);
        // jquery 1.7
        //$('.remove-video-btn').live('click', removeVideoFn);



        $('#videoForm #add').on('click', function(e){
            e.preventDefault();
            //@TODO first with append.
            var count = $('.video-group').length;
            var template =$('.video-group').first().clone();
            $(template).children('.crud-video-control').toggleClass('hide').children();
            var elements = $(template).children().children().children("[name^='videos']");
            var button = $(template).children('.crud-video-control').children().children(' button');
            button.attr('id','temp-video-id');
            button.attr('data-target',count);
            elements.each(function(idx, ele){
                var attr_name = $(ele).attr('name');
                var word_star_at = attr_name.indexOf('[');
                var word_end_at = attr_name.indexOf(']');
                var new_attr_name =attr_name.substr(0, word_star_at+1)+count+ attr_name.substr(word_end_at);

                $(ele).attr('name', new_attr_name);

                if($(ele).is('textarea')){
                    $(ele).empty();
                }
                if($(ele).is('input')){
                    $(ele).val('');
                }
            });

            $('#videos-group').append(template);
        });

        $("#videoForm button[type='submit']").on('click',function(e){
            var form = $('#videoForm');
            var data =$(form).serialize();

            $.ajax({
                url: $(form).attr('action'),
                data: data,
                success: function(json){
                    flash('success update video.');

                }
            });
        });
//        $('#videoForm').on('submit', function(e){
//            e.preventDefault();
//        });


    });


    var flash=function(message){
    //    $('.main-content').prepend($('.fade.in.alert-info'))

    //        .fade.in.alert.alert-danger
        //    button.close(type='button', data-dismiss='alert') ×
        //    ul
        //    - each error in errors
        //    li!= error
    };


    var removeVideoFn = function(e){
        e.preventDefault();
        var target = e.target;
        var currentIndex= $(target).attr('data-target');
        console.log($(target).attr('id'));

        if('temp-video-id' === $(target).attr('id')){
            $('.video-group')[currentIndex].remove();
        }else{
            var form = $('#videoForm');
            var videoId = $(target).attr('id');
            $.ajax({
                url: $(form).attr('action')+ "/"+videoId,
                type:'DELETE',
                headers: {
                    'X-CSRF-Token': $('[name="_csrf"]').val()
                },

                success: function(json){
                    $('.video-group')[currentIndex].remove();
                }
            });
        }

        // recount
        $('.video-group').each(function(idx, child){

            var target = $(child).children().children().children("[name^='videos']");
            target.each(function(i,ele){
                var attr_name = $(ele).attr('name');
                var word_star_at = attr_name.indexOf('[');
                var word_end_at = attr_name.indexOf(']');
                var new_attr_name =attr_name.substr(0, word_star_at+1)+idx+ attr_name.substr(word_end_at);

                $(ele).attr('name', new_attr_name);

            });
            var remove_btn = $(child).children('.crud-video-control').children().children(' button');
            remove_btn.attr('data-target',idx);

        });
    };

};
},{}],14:[function(require,module,exports){

$(document).ready(function () {

  $('#tags').tagsInput({
    'height':'60px',
    'width':'280px'
  });

  $('#side-menu').metisMenu();
  $(".chosen-select").chosen();
 
});



//Loads the correct sidebar on window load,
//collapses the sidebar on window resize.
$(function() {
    $(window).bind("load resize", function() {
        var width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
        if (width < 768) {
            $('div.sidebar-collapse').addClass('collapse');
        } else {
            $('div.sidebar-collapse').removeClass('collapse');
        }
    });
});




// @TODO will concat file with gulp in the future
//$.getScript(domain.scriptPath+"_forms/_videosForm.js", function(){
//    //require('./_forms/_videosForm');
//});

//require handlebars


require('./lib/helpers/handlebars-helpers');

require('./_forms/_videosForm.js').videoInit();

//require('./templates/quizzesForm.handlebars');
//MyApp = window['MyApp'] ||{};
//MyApp.templates = window['MyApp'].templates || {};

var MyApp = require('./_forms/_quizzesForm.js');

if(!window.hasOwnProperty('MyApp')) window['MyApp'] = MyApp;


function flash(msg){

}

if($('#buildScorm').length){
    require('./_forms/_scromForm.js').init();
}


},{"./_forms/_quizzesForm.js":11,"./_forms/_scromForm.js":12,"./_forms/_videosForm.js":13,"./lib/helpers/handlebars-helpers":15}],15:[function(require,module,exports){

var Handlebars = require('hbsfy/runtime');
Handlebars.registerHelper('setIndex', function(value){
    this.oindex = value;     // @TODO some time ../index can't work?
    this.hindex = Number(value + 1); //I needed human readable index, not zero based
    return this.hindex;
});

Handlebars.registerHelper('lookup', function(obj, field){
    return obj[field];
});
},{"hbsfy/runtime":9}],16:[function(require,module,exports){
// hbsfy compiled Handlebars template
var Handlebars = require('hbsfy/runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "";


  return buffer;
  });

},{"hbsfy/runtime":9}]},{},[14])