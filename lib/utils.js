/**
 * Created by wcweb on 7/3/14.
 */
/**
 * Formats mongoose errors into proper array
 *
 * @param {Array} errors
 * @return {Array}
 * @api public
 */

exports.errors = function (errors) {
    var keys = Object.keys(errors)
    var errs = []

    // if there is no validation error, just display a generic error
    if (!keys) {
        return ['Oops! There was an error']
    }

    keys.forEach(function (key) {
        errs.push(errors[key].message)
    })

    return errs
}

/**
 * Index of object within an array
 *
 * @param {Array} arr
 * @param {Object} obj
 * @return {Number}
 * @api public
 */

exports.indexof = function (arr, obj) {
    var index = -1; // not found initially
    var keys = Object.keys(obj);
    // filter the collection with the given criterias
    var result = arr.filter(function (doc, idx) {
        // keep a counter of matched key/value pairs
        var matched = 0;

        // loop over criteria
        for (var i = keys.length - 1; i >= 0; i--) {
            if (doc[keys[i]] === obj[keys[i]]) {
                matched++;

                // check if all the criterias are matched
                if (matched === keys.length) {
                    index = idx;
                    return idx;
                }
            }
        };
    });
    return index;
}

/**
 * Find object in an array of objects that matches a condition
 *
 * @param {Array} arr
 * @param {Object} obj
 * @param {Function} cb - optional
 * @return {Object}
 * @api public
 */

exports.findByParam = function (arr, obj, cb) {
    var index = exports.indexof(arr, obj)
    if (~index && typeof cb === 'function') {
        return cb(undefined, arr[index])
    } else if (~index && !cb) {
        return arr[index]
    } else if (!~index && typeof cb === 'function') {
        return cb('not found')
    }
    // else undefined is returned
}

// each copyright from underscore.js
var breaker ={};
var ArrayProto = Array.prototype;
var slic = ArrayProto.slice;
var nativeForeach = ArrayProto.forEach;
var each = function(obj, iterator, context){
    if (obj == null ) return obj;
    if(nativeForeach && obj.forEach === nativeForeach){
        obj.forEach(iterator, context);
    }else if(obj.length === +obj.length){
        for(var i= 0, length = obj.length; i< length; i++ ){
            if(iterator.call(context, obj[i], i, obj) === breaker) return;
        }
    }
    return obj;
};

exports.extend = function(obj){
    each(slic.call(arguments, 1), function(source){
        if(source){
            for(var prop in source){
                obj[prop] = source[prop];
            }
        }
    });
    return obj;
}